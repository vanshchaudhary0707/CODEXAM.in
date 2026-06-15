import React from "react";
import { GeneratedPaper, GeneratedSection, Question } from "../types";
import { ArrowLeft, Printer } from "lucide-react";

interface PrintViewProps {
  paper: GeneratedPaper;
  onBack: () => void;
  showMarkingScheme: boolean;
}

export const PaperPrintView: React.FC<PrintViewProps> = ({ paper, onBack, showMarkingScheme }) => {
  const handlePrint = () => {
    window.print();
  };

  // Dynamically build instruction statements matching CBSE trends
  const buildInstructions = () => {
    const list = [
      "All questions are compulsory. Operational choices can be opted as detailed within questions.",
      `This question paper contains ${paper.sections.length} Sections: ${paper.sections.map(s => s.section_name.replace("SECTION ", "")).join(", ")}.`,
    ];

    paper.sections.forEach(s => {
      const qCount = s.questions.length;
      const mVal = s.mark_value;
      let typeText = mVal === 1 ? "Multiple Choice Questions (MCQ)" : mVal <= 3 ? "Short Answer Type" : "Long Answer/Case Answer Type";
      list.push(`${s.section_name} contains ${qCount} questions of ${mVal} Mark(s) each (${typeText}).`);
    });

    list.push("There is no overall negative marking. Use of calculators or visual logs is prohibited.");
    list.push("Verify you have the identical sets matching current academic guidelines.");
    return list;
  };

  return (
    <div id="print-view-wrapper" className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top dashboard control panel (Hidden during Print) */}
      <div id="print-controls" className="bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shadow-xs print:hidden z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            id="print-view-back-btn"
            type="button"
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-all"
            title="Go back to editor"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-800">Print Preview: {paper.title}</h1>
            <p className="text-[10px] text-slate-400">CBSE standard typesetting sheet locked for physical output</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="print-trigger-btn"
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Print Container Sheet */}
      <div className="flex-1 p-4 md:p-8 flex justify-center overflow-y-auto">
        <div 
          id="cbse-print-paper-canvas" 
          className="w-full max-w-[800px] bg-white text-black p-10 shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none transition-all mr-auto ml-auto"
          style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
        >
          {/* PRINT-ONLY CSS RULES */}
          <style>{`
            @media print {
              body {
                background-color: #fff !important;
                color: #000 !important;
              }
              #print-controls {
                display: none !important;
              }
              .print\\:hidden {
                display: none !important;
              }
              #cbse-print-paper-canvas {
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                width: 100% !important;
                max-width: none !important;
              }
              /* Prevent orphaned sections and headers */
              .cbse-section-block {
                page-break-inside: avoid;
              }
              h2, h3, .section-title-bar {
                page-break-after: avoid;
              }
              .question-card-block {
                page-break-inside: avoid;
              }
            }
          `}</style>

          {/* Letterhead and logo */}
          <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-black">
            {paper.branding.logo_url && (
              <img
                src={paper.branding.logo_url}
                alt="School Emblem"
                className="h-16 w-16 object-contain p-1 border border-slate-300 rounded"
                referrerPolicy="no-referrer"
              />
            )}
            
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase leading-none font-serif text-black">{paper.branding.school_name}</h2>
              <h3 className="text-sm md:text-md uppercase tracking-wider font-semibold text-neutral-800">{paper.title}</h3>
            </div>

            {/* Header parameters row */}
            <div className="w-full grid grid-cols-2 pt-2 text-xs md:text-sm border-t border-dashed border-neutral-300 font-semibold uppercase text-neutral-600">
              <div className="text-left space-y-0.5">
                <div>Class: <span className="text-black font-bold">{paper.class_level}</span></div>
                <div>Subject: <span className="text-black font-bold">{paper.subject}</span></div>
              </div>
              <div className="text-right space-y-0.5">
                <div>Time Allowed: <span className="text-black font-bold">{paper.time_allowed}</span></div>
                <div>Maximum Marks: <span className="text-black font-bold">{paper.max_marks}</span></div>
              </div>
            </div>
          </div>

          {/* SECTION: GENERAL INSTRUCTIONS */}
          <div className="py-4 border-b border-black text-xs md:text-sm">
            <h4 className="font-bold underline uppercase mb-2 text-neutral-800 tracking-wider">General Instructions:</h4>
            <ol className="list-decimal pl-5 space-y-1 font-sans text-neutral-700">
              {buildInstructions().map((inst, idx) => (
                <li key={idx} className="leading-relaxed">{inst}</li>
              ))}
            </ol>
          </div>

          {/* QUESTIONS LIST */}
          <div className="py-4 space-y-6">
            {paper.sections.map((section: GeneratedSection, sIdx: number) => (
              <div key={sIdx} className="cbse-section-block">
                
                {/* Clean Shaded Shaded Background Bar for section header */}
                <div className="text-center bg-neutral-100 hover:bg-neutral-200 py-1.5 px-4 font-bold border-y border-neutral-300 text-xs md:text-sm uppercase tracking-wide my-4 rounded">
                  {section.section_name} - {section.mark_value} Mark(s) Each
                </div>

                <div className="divide-y divide-neutral-100">
                  {section.questions.map((q: Question, qIdx: number) => {
                    const cumulativeQuestionNumber = paper.sections
                      .slice(0, sIdx)
                      .reduce((acc, curr) => acc + curr.questions.length, 0) + qIdx + 1;

                    return (
                      <div key={q.id} className="question-card-block py-4 flex items-start gap-4">
                        {/* Question Serial Number */}
                        <span className="font-bold text-sm md:text-md shrink-0">{cumulativeQuestionNumber}.</span>
                        
                        {/* Question Content & Marks Align */}
                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="flex justify-between items-start gap-4 text-sm md:text-md leading-relaxed">
                            <div className="text-black font-serif prose whitespace-pre-wrap select-text">
                              {q.question_text_latex}
                            </div>
                            
                            {q.image_url && (
                              <div className="mt-2 text-left max-w-sm rounded overflow-hidden border border-neutral-300">
                                <img src={q.image_url} alt="Question Diagram" className="max-h-48 object-contain bg-white" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            
                            {/* Marks Right-Aligned */}
                            <span className="font-bold text-neutral-800 font-serif shrink-0 whitespace-nowrap">
                              [{q.mark_value}]
                            </span>
                          </div>

                          {/* PYQ Indicator (Included in printing) */}
                          {q.is_pyq && q.pyq_metadata && (
                            <div className="text-[10px] text-neutral-500 font-sans italic border-l-2 border-slate-300 pl-2">
                              (CBSE PYQ: {q.pyq_metadata.board} {q.pyq_metadata.year})
                            </div>
                          )}

                          {/* SECTION: MARKING SCHEME / MODEL ANSWERS */}
                          {showMarkingScheme && (
                            <div className="mt-3 p-3 bg-indigo-50/40 border border-indigo-100 rounded text-xs select-text font-serif">
                              <span className="block font-bold uppercase tracking-wider text-[10px] text-indigo-700 font-sans mb-1.5">Marking Scheme Guide:</span>
                              <div className="whitespace-pre-line leading-relaxed text-indigo-950">
                                {q.marking_scheme_text_latex}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer of Printed Sheet */}
          <div className="pt-8 border-t border-dashed border-neutral-400 text-center text-[10px] text-neutral-400 font-sans uppercase tracking-widest leading-none">
            --- End of Examination Paper ---
          </div>
        </div>
      </div>
    </div>
  );
};
