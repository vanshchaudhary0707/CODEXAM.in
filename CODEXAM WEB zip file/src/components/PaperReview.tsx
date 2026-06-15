import React, { useState } from "react";
import { 
  Shuffle, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Sparkles,
  Award,
  Database,
  Printer,
  ChevronLeft,
  Info
} from "lucide-react";
import { GeneratedPaper, GeneratedSection, Question } from "../types";

interface PaperReviewProps {
  paper: GeneratedPaper;
  onUpdatePaper: (updated: GeneratedPaper) => void;
  onGoToPrint: () => void;
  onReset: () => void;
}

export const PaperReview: React.FC<PaperReviewProps> = ({ 
  paper, 
  onUpdatePaper, 
  onGoToPrint,
  onReset 
}) => {
  const [hoveredQuestionId, setHoveredQuestionId] = useState<string | null>(null);
  const [showMarkingScheme, setShowMarkingScheme] = useState<boolean>(false);
  const [shufflingId, setShufflingId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [aiShuffleFallback, setAiShuffleFallback] = useState<boolean>(true);

  // Scroll target element into view smoothly in the right column
  const scrollToQuestionCard = (qId: string) => {
    const el = document.getElementById(`q-card-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHoveredQuestionId(qId);
      // Brief flashing effect to draw focus
      setTimeout(() => {
        setHoveredQuestionId(null);
      }, 1500);
    }
  };

  // Reorder questions (Move Up/Down inside specific section block)
  const handleMoveQuestion = (sIdx: number, qIdx: number, direction: "up" | "down") => {
    const nextSections = [...paper.sections];
    const section = { ...nextSections[sIdx] };
    const questions = [...section.questions];

    if (direction === "up" && qIdx > 0) {
      const temp = questions[qIdx];
      questions[qIdx] = questions[qIdx - 1];
      questions[qIdx - 1] = temp;
    } else if (direction === "down" && qIdx < questions.length - 1) {
      const temp = questions[qIdx];
      questions[qIdx] = questions[qIdx + 1];
      questions[qIdx + 1] = temp;
    } else {
      return; // No-op boundary hit
    }

    section.questions = questions;
    nextSections[sIdx] = section;
    onUpdatePaper({
      ...paper,
      sections: nextSections
    });
  };

  // Hit POST /api/shuffle-question to seamlessly find a matching NCERT alternative
  const handleShuffleQuestion = async (sIdx: number, qIdx: number, targetQ: Question) => {
    setShufflingId(targetQ.id);
    setErrorBanner(null);

    try {
      const res = await fetch("/api/shuffle-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_level: paper.class_level,
          subject: paper.subject,
          chapter_name: targetQ.chapter_name,
          mark_value: targetQ.mark_value,
          cognitive_level: targetQ.cognitive_level,
          current_id: targetQ.id,
          ai_fallback: aiShuffleFallback
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No dynamic matching alternative questions exist.");
      }

      if (data.success && data.question) {
        const nextSections = [...paper.sections];
        const section = { ...nextSections[sIdx] };
        const questions = [...section.questions];
        
        // Swap original question with new matching counterpart
        questions[qIdx] = data.question;
        section.questions = questions;
        nextSections[sIdx] = section;

        onUpdatePaper({
          ...paper,
          sections: nextSections
        });
      }
    } catch (err: any) {
      setErrorBanner(`Shuffle Warning: ${err.message}`);
      // Fade out banner gradually
      setTimeout(() => {
        setErrorBanner(null);
      }, 5000);
    } finally {
      setShufflingId(null);
    }
  };

  // Calculate high-level summary metadata
  const totalQuestions = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div id="paper-review-panel" className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
      
      {/* Dynamic Error Status Banner */}
      {errorBanner && (
        <div id="shuffle-warning-banner" className="bg-rose-50 border-b border-rose-100 text-rose-700 font-mono text-xs px-6 py-2 flex items-center justify-between shrink-0">
          <span>{errorBanner}</span>
          <button onClick={() => setErrorBanner(null)} className="font-bold font-sans">✕</button>
        </div>
      )}

      {/* Pane Action Control Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            id="review-back-home-btn"
            onClick={onReset}
            className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition-all"
            title="Create new paper"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 leading-none">
              <span>Interactive Review Pane</span>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </h2>
            <p className="text-[10px] text-slate-400">Shuffle, reorder, evaluate and review before hardcopies are generated</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AI fallback status filter check */}
          <label className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2 py-1.5 rounded-lg text-[10px] text-indigo-700 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={aiShuffleFallback}
              onChange={(e) => setAiShuffleFallback(e.target.checked)}
              className="rounded text-indigo-600 font-sans focus:ring-indigo-500"
            />
            <Sparkles className="h-3 w-3" />
            <span>AI Powered Shuffle</span>
          </label>

          {/* Marking scheme visibility switch */}
          <button
            id="toggle-marking-scheme-btn"
            type="button"
            onClick={() => setShowMarkingScheme(!showMarkingScheme)}
            className={`px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showMarkingScheme 
                ? "bg-slate-800 border-slate-800 text-white" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {showMarkingScheme ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>Marking Keys</span>
          </button>

          {/* Go to Print Action */}
          <button
            id="review-print-nav-btn"
            type="button"
            onClick={onGoToPrint}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Typeset & Print</span>
          </button>
        </div>
      </div>

      {/* Double Pane Body Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: SCANNABLE STRUCTURAL INDEX */}
        <div id="review-structural-index-pane" className="w-[30%] border-r border-slate-200 bg-white overflow-y-auto hidden md:block select-none">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">INDEX PLANNER</span>
            <div className="mt-1 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">Exam Layout Outline</h3>
              <p className="text-[10px] font-semibold text-slate-500 font-mono italic">{totalQuestions} Questions</p>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {paper.sections.map((section: GeneratedSection, sIdx: number) => {
              const startNum = paper.sections
                .slice(0, sIdx)
                .reduce((acc, curr) => acc + curr.questions.length, 0) + 1;
              const endNum = startNum + section.questions.length - 1;

              return (
                <div key={sIdx} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-l-2 border-slate-300 pl-2">
                    <span className="uppercase">{section.section_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Q. {startNum}-{endNum}</span>
                  </div>

                  {/* Staggered Question Serial Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 pl-2.5">
                    {section.questions.map((q: Question, qIdx: number) => {
                      const absoluteNumber = startNum + qIdx;
                      return (
                        <button
                          id={`index-pills-${q.id}`}
                          key={q.id}
                          type="button"
                          onClick={() => scrollToQuestionCard(q.id)}
                          className="py-1 px-2 border border-slate-100 text-[10px] font-mono font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-700 rounded text-center transition-all bg-slate-50/50 flex flex-col items-center justify-center gap-0.5"
                          title={`Click to jump to Q. ${absoluteNumber} (${q.cognitive_level})`}
                        >
                          <span className="text-sm font-semibold text-slate-800 leading-none">{absoluteNumber}</span>
                          <span className="text-[8px] font-sans font-medium text-slate-400 scale-90">{q.cognitive_level.substring(0, 3)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-start gap-2.5 text-[10px] leading-relaxed text-slate-500">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Clicking indices pans the editor to target cards. Shuffle matching standards or swap question placement order inline directly.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: LIVE SHEET REVIEW SCREEN */}
        <div id="review-sheet-viewport" className="flex-1 bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-xl shadow border border-slate-200 min-h-[600px] flex flex-col space-y-6">
            
            {/* Embedded Header Info */}
            <div className="border-b border-dashed border-slate-200 pb-4 text-slate-700">
              <div className="flex items-center gap-3 mb-2">
                {paper.branding.logo_url && (
                  <img src={paper.branding.logo_url} alt="Logo" className="h-10 w-10 object-contain rounded border pointer-events-none" referrerPolicy="no-referrer" />
                )}
                <div>
                  <h4 className="text-xs font-bold font-serif uppercase tracking-tight text-slate-900">{paper.branding.school_name}</h4>
                  <h5 className="text-[11px] font-sans text-slate-500 uppercase font-semibold">{paper.title}</h5>
                </div>
              </div>

              <div className="grid grid-cols-2 text-[10px] uppercase font-semibold text-slate-500 pt-1 border-t border-slate-100">
                <div>Class: <span className="font-bold text-slate-800">{paper.class_level}</span> | Subject: <span className="font-bold text-slate-800">{paper.subject}</span></div>
                <div className="text-right">Max Marks: <span className="font-bold text-slate-800">{paper.max_marks}</span> | Time: <span className="font-bold text-slate-800">{paper.time_allowed}</span></div>
              </div>
            </div>

            {/* Questions stack inside sheet */}
            <div className="space-y-8 flex-1">
              {paper.sections.map((section: GeneratedSection, sIdx: number) => {
                const startNum = paper.sections
                  .slice(0, sIdx)
                  .reduce((acc, curr) => acc + curr.questions.length, 0) + 1;

                return (
                  <div key={sIdx} className="space-y-4">
                    {/* Centered Section divider */}
                    <div className="text-center font-bold tracking-wider text-xs uppercase bg-slate-50 border-y border-slate-250 py-1 text-slate-700">
                      {section.section_name} - {section.mark_value} Mark(s) each
                    </div>

                    <div className="space-y-4 divide-y divide-slate-100">
                      {section.questions.map((q: Question, qIdx: number) => {
                        const serialNum = startNum + qIdx;
                        const isHovered = hoveredQuestionId === q.id;

                        return (
                          <div
                            id={`q-card-${q.id}`}
                            key={q.id}
                            onMouseEnter={() => setHoveredQuestionId(q.id)}
                            onMouseLeave={() => setHoveredQuestionId(null)}
                            className={`pt-4 first:pt-0 relative group rounded-xl px-3 transition-all ${
                              isHovered ? "bg-slate-50/50" : ""
                            }`}
                          >
                            {/* ACTION BUTTONS HOVER TOOLBAR OVERLAY */}
                            <div className={`absolute top-2 right-4 flex items-center gap-1 bg-white border border-slate-250 rounded-lg shadow-sm px-1 py-1 z-10 transition-opacity duration-200 ${
                              isHovered ? "opacity-100" : "opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto"
                            }`}>
                              
                              {/* Reorder Up */}
                              <button
                                id={`move-up-btn-${q.id}`}
                                type="button"
                                onClick={() => handleMoveQuestion(sIdx, qIdx, "up")}
                                disabled={qIdx === 0}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                title="Move question up"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>

                              {/* Reorder Down */}
                              <button
                                id={`move-down-btn-${q.id}`}
                                type="button"
                                onClick={() => handleMoveQuestion(sIdx, qIdx, "down")}
                                disabled={qIdx === section.questions.length - 1}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                title="Move question down"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>

                              <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>

                              {/* Shuffle alternative question */}
                              <button
                                id={`shuffle-btn-${q.id}`}
                                type="button"
                                onClick={() => handleShuffleQuestion(sIdx, qIdx, q)}
                                disabled={shufflingId === q.id}
                                className={`p-1 hover:bg-slate-100 rounded transition-all text-blue-600 font-semibold flex items-center gap-0.5 ${
                                  shufflingId === q.id ? "animate-spin text-indigo-500 cursor-not-allowed" : ""
                                }`}
                                title="Shuffle: Load standard NCERT counterpart of equivalent weight and topic"
                              >
                                <Shuffle className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Question Card Content Display */}
                            <div className="flex gap-4">
                              <span className="font-bold text-sm text-slate-800 font-serif shrink-0 mt-0.5">{serialNum}.</span>
                              <div className="flex-1 space-y-2 min-w-0">
                                
                                <div className="flex justify-between items-start gap-4">
                                  <div className="text-sm font-serif text-slate-800 leading-relaxed prose whitespace-pre-wrap select-text">
                                    {q.question_text_latex}
                                  </div>
                                  <span className="text-xs font-serif font-bold text-slate-500 shrink-0 whitespace-nowrap pt-0.5">
                                    [{q.mark_value} Mark(s)]
                                  </span>
                                </div>

                                {q.image_url && (
                                  <div className="mt-2 text-left max-w-sm rounded overflow-hidden border border-slate-205">
                                    <img src={q.image_url} alt="Question Diagram" className="max-h-48 object-contain bg-white" referrerPolicy="no-referrer" />
                                  </div>
                                )}

                                {/* Metadata metrics Tags */}
                                <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase font-bold tracking-wider pt-1.5 select-none text-slate-400">
                                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600 lowercase font-medium">
                                    <span>chapter:</span>
                                    <span className="text-slate-800 font-bold max-w-28 truncate">{q.chapter_name}</span>
                                  </span>
                                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600 lowercase font-medium">
                                    <span>type:</span>
                                    <span className="text-slate-800 font-bold">{q.question_type}</span>
                                  </span>
                                  <span className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded text-blue-700 lowercase font-medium">
                                    <span>cognitive:</span>
                                    <span className="text-blue-900 font-bold">{q.cognitive_level}</span>
                                  </span>
                                  {q.is_pyq && q.pyq_metadata && (
                                    <span className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded text-emerald-700 font-bold uppercase">
                                      <Award className="h-3 w-3 shrink-0" />
                                      <span>CBSE {q.pyq_metadata.year} PYQ</span>
                                    </span>
                                  )}
                                </div>

                                {/* Model answers evaluation schemes */}
                                {showMarkingScheme && (
                                  <div className="p-3 bg-indigo-50/45 rounded-lg border border-indigo-100 text-xs font-serif text-slate-800 mt-2 hover:bg-indigo-50/70 select-text">
                                    <span className="block font-bold text-[9px] text-indigo-700 uppercase tracking-wider mb-1 font-sans">MARKING SCHEME CODE:</span>
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                      {q.marking_scheme_text_latex}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* End status indicators */}
            <div className="border-t border-dashed border-slate-200 pt-6 text-center text-[10px] text-slate-400 font-sans tracking-widest leading-none select-none uppercase">
              --- END OF INTERACTIVE EVALUATION ---
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
