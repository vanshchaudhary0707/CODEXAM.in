import React, { useState, useEffect, useRef } from "react";
import { 
  Database, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Upload, 
  FileText, 
  Search, 
  Grid, 
  Edit, 
  ChevronRight, 
  ShieldCheck, 
  GraduationCap, 
  Share2, 
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Question } from "../types";
import { CURRICULUM_DATABASE } from "../data/curriculumDb";

interface PyqVaultViewProps {
  onAddQuestionToDraftQueue?: (q: Question) => void;
  activeQueue?: Question[];
  onRemoveQuestionFromQueue?: (id: string) => void;
  onClearQueue?: () => void;
}

interface ExtractedQuestionDraft {
  id: string;
  question_text: string;
  suggested_number: string;
  marks: number;
  chapter: string;
}

export const PyqVaultView: React.FC<PyqVaultViewProps> = () => {
  // Navigation categories
  const [selectedClass, setSelectedClass] = useState("Class 12");
  const [selectedSubject, setSelectedSubject] = useState("Accounts");
  const [selectedChapter, setSelectedChapter] = useState("All Units");
  const [searchQuery, setSearchQuery] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  // Input states for Manual Question Builder
  const [manualText, setManualText] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");
  const [manualMarks, setManualMarks] = useState<number>(3);
  const [manualType, setManualType] = useState("Short");
  const [manualChp, setManualChp] = useState("");

  // File Upload and Text OCR Extraction states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [extractedDrafts, setExtractedDrafts] = useState<ExtractedQuestionDraft[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchQuestions();
  }, [selectedClass, selectedSubject]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchQuestions = async () => {
    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    setLoading(true);
    try {
      const res = await fetch("/api/questions", {
        headers: {
          "X-Teacher-Codename": codename
        }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Failed to sync personal question stack database:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete question from Personal Stack
  const handleDeleteQuestion = async (id: string) => {
    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          "X-Teacher-Codename": codename
        }
      });
      if (res.ok) {
        setQuestions(questions.filter(q => q.id !== id));
        triggerToast("🗑️ Question pulled out from stack.");
      }
    } catch (err) {
      console.error("Failed to delete selected question index instance", err);
    }
  };

  // Create new question manually via submit handler
  const handleManualCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    const payload = {
      class_level: selectedClass,
      subject: selectedSubject,
      chapter_name: manualChp || "General Core",
      mark_value: manualMarks,
      question_type: manualType,
      question_text_latex: manualText.trim(),
      marking_scheme_text_latex: manualAnswer.trim() || "Proportional grading rules verified."
    };

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Teacher-Codename": codename
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.question) {
          setQuestions([data.question, ...questions]);
          setManualText("");
          setManualAnswer("");
          triggerToast("📚 New custom question logged into your private stack.");
        }
      }
    } catch (err) {
      console.error("Manual question insert failed", err);
    }
  };

  // Structured OCR/NLP regex patterns parser for shared PDF/text uploads
  const handleProcessUploadedFile = (file: File) => {
    setUploadedFileName(file.name);
    setIsExtracting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      
      // Strict regex scanner looking for "Q1.", "Q2)", "1.", "2." questions anchors
      const regexPattern = /(?:^|\n)(?:Q)?(\d+)[\.\)]\s*(.+?)(?=(?:^|\n)(?:Q)?\d+[\.\)]|$)/gs;
      
      let match;
      const results: ExtractedQuestionDraft[] = [];
      let counter = 1;

      while ((match = regexPattern.exec(text)) !== null) {
        const extractedTxt = match[2].trim();
        if (extractedTxt.length > 10) {
          results.push({
            id: `extracted-draft-${counter}-${Date.now()}`,
            suggested_number: match[1] || String(counter),
            question_text: extractedTxt,
            marks: extractedTxt.length < 50 ? 1 : extractedTxt.length < 150 ? 3 : 5,
            chapter: "Extracted Chapter"
          });
          counter++;
        }
      }

      // Fallback if no clean regex landmarks were isolated inside standard formats
      if (results.length === 0) {
        // Break by double line breaks
        const blocks = text.split(/\r?\n\r?\n/);
        blocks.forEach((blk, idx) => {
          const clean = blk.trim();
          if (clean.length > 20) {
            results.push({
              id: `extracted-draft-${idx}-${Date.now()}`,
              suggested_number: String(idx + 1),
              question_text: clean,
              marks: clean.length < 60 ? 1 : 4,
              chapter: "Document Import"
            });
          }
        });
      }

      setTimeout(() => {
        setExtractedDrafts(results.slice(0, 15)); // Cap to 15 entries for beautiful layout reviews
        setIsExtracting(false);
        triggerToast(`📁 Extracted ${results.length} structural question blocks!`);
      }, 1000);
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessUploadedFile(e.target.files[0]);
    }
  };

  // Commit selected OCR question blocks to main personal sandbox
  const handleCommitExtractedToStack = async (idxToSave: number) => {
    const item = extractedDrafts[idxToSave];
    if (!item) return;

    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Teacher-Codename": codename
        },
        body: JSON.stringify({
          class_level: selectedClass,
          subject: selectedSubject,
          chapter_name: manualChp || "Extracted Unit",
          mark_value: item.marks,
          question_type: item.marks === 1 ? "MCQ" : "Short",
          question_text_latex: item.question_text,
          marking_scheme_text_latex: "Verified from document upload extraction."
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.question) {
          setQuestions([data.question, ...questions]);
          // Filter entry out of extracted list
          setExtractedDrafts(extractedDrafts.filter((_, idx) => idx !== idxToSave));
          triggerToast("📥 Question moved securely to Saved Question Stack!");
        }
      }
    } catch (e) {
      console.error("Persistence failed", e);
    }
  };

  const getSubjs = (): string[] => {
    const classNum = parseInt(selectedClass.replace("Class ", ""));
    if (isNaN(classNum) || classNum <= 5) {
      return ["English Grammar", "Maths", "Hindi", "EVS"];
    } else if (classNum <= 10) {
      return ["Maths", "Science", "Social Science", "Hindi", "English Grammar and passages"];
    } else {
      return ["Physics", "Chemistry", "Biology", "Accounts", "Economics", "Business Studies", "History"];
    }
  };

  // Dyn Chapters lists
  const [chaptersList, setChaptersList] = useState<string[]>([]);
  useEffect(() => {
    const clsMatch = CURRICULUM_DATABASE.find(c => c.className === selectedClass);
    if (clsMatch) {
      const subMatch = clsMatch.subjects.find(s => s.subjectName.toLowerCase() === selectedSubject.toLowerCase());
      if (subMatch) {
        const list = subMatch.chapters.map(ch => ch.chapterName);
        setChaptersList(list);
        setManualChp(list[0] || "General Core");
      } else {
        setChaptersList([]);
      }
    }
  }, [selectedClass, selectedSubject]);

  const filteredQuestions = questions.filter(q => {
    const matchesChapter = selectedChapter === "All Units" || q.chapter_name === selectedChapter;
    const matchesSearch = q.question_text_latex.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChapter && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans pb-12 select-none">
      
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-amber-500 text-amber-400 font-bold text-xs uppercase px-5 py-3 rounded-xl shadow-2xl animate-in fade-in">
          {toast}
        </div>
      )}

      {/* STACK DIRECTORY TITLE BANNER */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-600 block leading-none">DATABASE CATALOGUE</span>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-1 flex items-center gap-2">
            <Database className="h-5 w-5 text-amber-500" />
            <span>Private Question Stack & Bulk Document Import</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Maintain, write, or extract questions dynamically. Shared question pool displays zero initial preset listings.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedChapter("All Units");
            }}
            className="text-xs font-bold bg-slate-100 border border-slate-200 py-2 px-3.5 rounded-xl cursor-pointer"
          >
            <option value="Class 12">Class XII</option>
            <option value="Class 11">Class XI</option>
            <option value="Class 10">Class X</option>
            <option value="Class 9">Class IX</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedChapter("All Units");
            }}
            className="text-xs font-bold bg-slate-100 border border-slate-200 py-2 px-3.5 rounded-xl cursor-pointer"
          >
            {getSubjs().map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROW 1: CONTROLS ETC. - MANUAL WRITE AND OCR LOADERS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* DRAG AND DROP FILE IMPORT EXTRACTOR */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div>
              <span className="text-[10px] uppercase font-black text-amber-600 block">Bulk Document Parser</span>
              <h3 className="text-sm font-black text-slate-900 uppercase">Share Files & Extract Questions</h3>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-4 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging 
                  ? "border-amber-500 bg-amber-50/20" 
                  : "border-slate-200 hover:border-amber-400 bg-slate-50"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept=".txt,.json,.md,.pdf"
              />
              <Upload className="h-8 w-8 text-slate-400 mx-auto group-hover:text-amber-500" />
              <p className="text-xs font-bold text-slate-700 mt-2">Drag & Drop exam PDF, JSON or Text file</p>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-1">Or browse local filesystem</p>
            </div>

            {uploadedFileName && (
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 text-slate-300 text-xs flex items-center justify-between font-mono">
                <span className="truncate max-w-[150px] font-bold">{uploadedFileName}</span>
                <span className="text-[9px] bg-amber-500 text-slate-950 font-sans font-black px-1.5 py-0.5 rounded leading-none uppercase">Imported</span>
              </div>
            )}

            {isExtracting && (
              <div className="text-center font-bold text-xs text-amber-600 animate-pulse">Running Regex Structural OCR scanners...</div>
            )}
          </div>

          {/* MANUAL QUESTIONS MAKER FOR PRIVATE WORKSPACE */}
          <form onSubmit={handleManualCreateSubmit} className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-black text-amber-600 block">Manual Composer</span>
              <h3 className="text-sm font-black text-slate-900 uppercase">Logging Custom Entry</h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Chapter Topic Mapping</label>
                <select
                  value={manualChp}
                  onChange={(e) => setManualChp(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 p-2 rounded-xl"
                >
                  {chaptersList.map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Award Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={manualMarks}
                    onChange={(e) => setManualMarks(parseInt(e.target.value) || 1)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Grade Type</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                  >
                    <option value="MCQ">MCQ Option</option>
                    <option value="Short">Short Answer</option>
                    <option value="Long">Long Case</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Question Text (LaTeX formulas supported)</label>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Insert question details. Standard formulas formatting like $x = \frac{-b \pm \sqrt{d}}{2a}$ will render clean."
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 h-28 focus:outline-none focus:bg-white focus:border-amber-400"
                  required
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Step Evaluation / Marking Key Guidelines</label>
                <textarea
                  value={manualAnswer}
                  onChange={(e) => setManualAnswer(e.target.value)}
                  placeholder="Write the correct options keys or steps scheme."
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 h-20"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 border border-slate-800 text-amber-400 hover:text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Insert to Private Stack
              </button>
            </div>
          </form>

        </div>

        {/* COLUMNS 2 & 3: MAIN LIST VIEWPORT AND EXTRACTED CARDS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION A: THE EXTRACTED OCR REVIEW CARD CAROUSEL */}
          {extractedDrafts.length > 0 && (
            <div className="bg-slate-950 border-2 border-amber-500/80 rounded-2xl p-6 space-y-4 shadow-xl text-white animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[9px] uppercase font-black text-amber-500 font-mono tracking-widest block leading-none">Draft Import Deck</span>
                  <h3 className="text-sm font-black text-white uppercase mt-0.5">Extracted Question Review Columns ({extractedDrafts.length})</h3>
                </div>
                <button
                  onClick={() => setExtractedDrafts([])}
                  className="text-xs text-rose-400 font-bold hover:text-white p-1 border border-rose-900/40 rounded px-2 bg-rose-950/20"
                >
                  Close Deck
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {extractedDrafts.map((item, idx) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-amber-400">
                        <span className="bg-slate-950 px-1.5 rounded">Scanned Q#{item.suggested_number}</span>
                        <span>•</span>
                        <span className="bg-slate-950 px-1.5 rounded">{item.chapter}</span>
                      </div>
                      <p className="text-xs text-slate-200 font-serif leading-relaxed line-clamp-2">{item.question_text}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-2.5 md:pt-0 border-t border-slate-800 md:border-0 justify-end">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-bold">Marks:</span>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={item.marks}
                          onChange={(e) => {
                            const updated = [...extractedDrafts];
                            updated[idx].marks = Math.max(1, parseInt(e.target.value) || 1);
                            setExtractedDrafts(updated);
                          }}
                          className="w-10 text-center bg-slate-950 text-white font-mono rounded text-xs p-1"
                        />
                      </div>
                      <button
                        onClick={() => handleCommitExtractedToStack(idx)}
                        className="p-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <span>Verify & Add</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION B: PRIMARY SAVED QUESTION DATABASE CATALOG */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm min-h-[400px] flex flex-col">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-150 pb-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter local questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:bg-white rounded-xl py-2 pl-9 pr-4"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg max-w-[200px]"
                >
                  <option value="All Units">All Chapters</option>
                  {chaptersList.map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 space-y-3.5">
              {loading ? (
                <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">Syncing personal catalog workspace...</div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-xl space-y-2">
                  <Database className="h-8 w-8 text-slate-350 mx-auto" />
                  <p className="text-xs font-bold text-slate-650">No saved questions in your private {selectedSubject} sandbox.</p>
                  <p className="text-[10px] text-slate-400 font-medium">Use the left composer to log manual keys, or upload a sheet to extract them!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredQuestions.map((q) => (
                    <div 
                      key={q.id} 
                      className="border-2 border-slate-150 rounded-2xl p-5 hover:border-slate-300 transition-all bg-white relative group"
                    >
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2 font-mono text-[9px] font-black uppercase">
                          <span className="bg-slate-100 text-slate-700 px-2 rounded tracking-wider leading-none border border-slate-200 py-0.5">
                            {q.chapter_name}
                          </span>
                          <span className="bg-amber-100 text-amber-800 px-2 rounded leading-none border border-amber-200 py-0.5">
                            {q.mark_value} Mark({q.mark_value > 1 ? 's' : ''})
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-1.5 rounded lowercase leading-none">{q.question_type}</span>
                        </div>

                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Erase question from private bank"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="prose max-w-none text-xs font-semibold leading-relaxed font-serif text-slate-850 whitespace-pre-wrap">
                        {q.question_text_latex}
                      </div>

                      {q.marking_scheme_text_latex && (
                        <div className="mt-3.5 pt-3.5 border-t border-slate-100 bg-emerald-50/20 p-3 rounded-xl text-[10.5px] text-emerald-800 font-medium">
                          <span className="text-[8.5px] font-mono uppercase tracking-widest text-emerald-700 font-extrabold block">Grading Metric / Option:</span>
                          <p className="whitespace-pre-wrap mt-1 leading-normal text-emerald-950 font-serif font-bold">{q.marking_scheme_text_latex}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
