import React, { useState, useEffect } from "react";
import { 
  FolderLock, 
  Plus, 
  Trash2, 
  Settings, 
  Printer, 
  Eye, 
  BookOpen, 
  Edit2, 
  Check, 
  ArrowLeftRight, 
  Award, 
  Book, 
  Layers, 
  Compass, 
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { Question, BrandingDetails } from "../types";
import { CURRICULUM_DATABASE } from "../data/curriculumDb";

interface DualDocumentWorkspaceProps {
  // Can receive optional state parameters
}

export const DualDocumentWorkspace: React.FC<DualDocumentWorkspaceProps> = () => {
  // Academic setups
  const [selectedClass, setSelectedClass] = useState<string>("Class 12");
  const [selectedSubject, setSelectedSubject] = useState<string>("Accounts");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  
  // Custom headers editable directly right here!
  const [schoolName, setSchoolName] = useState<string>("Modern Academic Institution");
  const [examName, setExamName] = useState<string>("Mid-Term Evaluation Project");
  const [timeAllowed, setTimeAllowed] = useState<string>("3 Hours");

  // User session state (retrieved from localStorage inside setup)
  const [userSession, setUserSession] = useState<any>(null);

  // Mark counts selectors
  const [cnt1, setCnt1] = useState<number>(5); // 1 Mark MCQs
  const [cnt2, setCnt2] = useState<number>(3); // 2 Marks Short
  const [cnt3, setCnt3] = useState<number>(3); // 3 Marks Short
  const [cnt4, setCnt4] = useState<number>(2); // 4 Marks Case
  const [cnt5, setCnt5] = useState<number>(2); // 5 Marks Long
  const [cnt6, setCnt6] = useState<number>(1); // 6 Marks Long

  // Operational states
  const [wizardStep, setWizardStep] = useState<number>(1); // 1: Setup, 2: Slot Assignment Review
  const [isAssembling, setIsAssembling] = useState<boolean>(false);
  
  // Draft layout state
  const [draftPaper, setDraftPaper] = useState<any>(null);
  const [savedStack, setSavedStack] = useState<Question[]>([]);
  const [loadingStack, setLoadingStack] = useState<boolean>(false);

  // Assignment Modal
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [activeSlotMarks, setActiveSlotMarks] = useState<number>(1);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  // Manual typing override helper states
  const [manualText, setManualText] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");
  const [manualTopic, setManualTopic] = useState("");
  const [manualChapter, setManualChapter] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  // Retrieve user credentials
  useEffect(() => {
    const raw = localStorage.getItem("codexam_session");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUserSession(parsed);
        setSchoolName(parsed.name);
      } catch (err) {
        console.error("Workspace session reading error", err);
      }
    }
    fetchSavedQuestions();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getSubjectsForClass = (cls: string): string[] => {
    const classNum = parseInt(cls.replace("Class ", ""));
    if (isNaN(classNum) || classNum <= 5) {
      return ["English Grammar", "Maths", "Hindi", "EVS"];
    } else if (classNum <= 10) {
      return ["Maths", "Science", "Social Science", "Hindi", "English Grammar and passages"];
    } else {
      return ["Physics", "Chemistry", "Biology", "Maths / Applied maths", "Accounts", "Economics", "Business Studies", "History", "Political science"];
    }
  };

  // Synchronize subjects when Class changes
  const handleClassChange = (newCls: string) => {
    setSelectedClass(newCls);
    const subjs = getSubjectsForClass(newCls);
    if (subjs.length > 0) {
      setSelectedSubject(subjs[0]);
    }
    setSelectedChapters([]);
  };

  // Sync chapters dynamically
  useEffect(() => {
    const clsMatch = CURRICULUM_DATABASE.find(c => c.className === selectedClass);
    if (clsMatch) {
      const subMatch = clsMatch.subjects.find(s => s.subjectName.toLowerCase() === selectedSubject.toLowerCase());
      if (subMatch) {
        setSelectedChapters(subMatch.chapters.map(ch => ch.chapterName));
      } else {
        setSelectedChapters([]);
      }
    }
  }, [selectedClass, selectedSubject]);

  // Read saved question stack for custom matching allocations
  const fetchSavedQuestions = async () => {
    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    setLoadingStack(true);
    try {
      const res = await fetch("/api/questions", {
        headers: {
          "X-Teacher-Codename": codename
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedStack(data);
      }
    } catch (err) {
      console.error("Failed to sync saved question bank", err);
    } finally {
      setLoadingStack(false);
    }
  };

  // Assemble the empty physical draft structure
  const handleCompileDraftPaper = async () => {
    setIsAssembling(true);
    const sectionsConfig = [
      { section_name: "SECTION A", mark_value: 1, count: cnt1 },
      { section_name: "SECTION B", mark_value: 2, count: cnt2 },
      { section_name: "SECTION C", mark_value: 3, count: cnt3 },
      { section_name: "SECTION D", mark_value: 4, count: cnt4 },
      { section_name: "SECTION E", mark_value: 5, count: cnt5 },
      { section_name: "SECTION F", mark_value: 6, count: cnt6 }
    ].filter(s => s.count > 0);

    const totalMarks = (cnt1 * 1) + (cnt2 * 2) + (cnt3 * 3) + (cnt4 * 4) + (cnt5 * 5) + (cnt6 * 6);

    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/generate-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Teacher-Codename": codename
        },
        body: JSON.stringify({
          chapters: selectedChapters.length > 0 ? selectedChapters : ["General Outline"],
          class_level: selectedClass,
          subject: selectedSubject,
          sections: sectionsConfig,
          branding: {
            school_name: schoolName,
            exam_name: examName,
            time_allowed: timeAllowed,
            max_marks: totalMarks,
            logo_url: userSession?.logo_url || ""
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.paper) {
          setDraftPaper(data.paper);
          setWizardStep(2);
          triggerToast("📄 Skeleton draft constructed successfully. Assign questions to empty fill-up slots.");
        }
      }
    } catch (err) {
      console.error("Draft generation failed", err);
    } finally {
      setIsAssembling(false);
    }
  };

  // Slide open the private saved question picker modal
  const handleOpenAssignPicker = (slotId: string, marks: number) => {
    setActiveSlotId(slotId);
    setActiveSlotMarks(marks);
    // Fetch fresh stack update
    fetchSavedQuestions();
    
    // Pick first chapter matching selected subjects if available
    setManualChapter(selectedChapters[0] || "General Core");
    setManualTopic("Unit Evaluation");
    setManualText("");
    setManualAnswer("");
    setShowAssignModal(true);
  };

  // Save selection from saved stack into paper slot
  const handleAssignFromStack = (q: Question) => {
    if (!draftPaper) return;

    const updatedSections = draftPaper.sections.map((sec: any) => {
      const updatedQuestions = sec.questions.map((quest: Question) => {
        if (quest.id === activeSlotId) {
          return {
            ...quest,
            id: `assigned-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            question_text_latex: q.question_text_latex,
            marking_scheme_text_latex: q.marking_scheme_text_latex,
            chapter_name: q.chapter_name,
            topic_name: q.topic_name,
            question_type: q.question_type,
            cognitive_level: q.cognitive_level,
            image_url: q.image_url,
            isPlaceholder: false
          };
        }
        return quest;
      });
      return {
        ...sec,
        questions: updatedQuestions
      };
    });

    setDraftPaper({
      ...draftPaper,
      sections: updatedSections
    });

    setShowAssignModal(false);
    triggerToast("✨ Question assigned from saved stack.");
  };

  // Direct manual composition write helper
  const handleCreateAndAssignManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    // Save newly written question in database so they can reuse it in other slots anytime!
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
          chapter_name: manualChapter,
          topic_name: manualTopic,
          mark_value: activeSlotMarks,
          question_text_latex: manualText,
          marking_scheme_text_latex: manualAnswer || "Direct step evaluation marks."
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.question) {
          // Immediately assign this new question to the current slot
          handleAssignFromStack(data.question);
        }
      }
    } catch (e) {
      console.error("Failed to persist newly typed question in backend", e);
    }
  };

  // Clear or wipe out a slot
  const handleClearSlot = (slotId: string) => {
    if (!draftPaper) return;

    const updatedSections = draftPaper.sections.map((sec: any) => {
      const updatedQuestions = sec.questions.map((quest: Question) => {
        if (quest.id === slotId) {
          return {
            ...quest,
            question_text_latex: "",
            marking_scheme_text_latex: "",
            topic_name: "TBD",
            isPlaceholder: true
          };
        }
        return quest;
      });
      return {
        ...sec,
        questions: updatedQuestions
      };
    });

    setDraftPaper({
      ...draftPaper,
      sections: updatedSections
    });
    triggerToast("Slot cleared.");
  };

  // Save final Typeset Exam Draft in database
  const handleSaveDraftToPortal = async () => {
    if (!draftPaper) return;

    const rawSession = localStorage.getItem("codexam_session");
    let codename = "GUEST";
    if (rawSession) {
      try {
        codename = JSON.parse(rawSession).codename;
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/saved-papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Teacher-Codename": codename
        },
        body: JSON.stringify(draftPaper)
      });

      if (res.ok) {
        triggerToast("🔒 Full Typeset Draft saved securely & cryptographically sealed.");
        setWizardStep(1);
        setDraftPaper(null);
      }
    } catch (err) {
      console.error("Saving compiled paper failed", err);
    }
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-amber-500 text-amber-400 font-extrabold text-xs uppercase px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* HEADER WIZARD PATH BANNER */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-600 block leading-none">TYPESETTING ENGINE</span>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-1 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-500" />
            <span>Draft Paper Layout Typesetter</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure target weights and assign questions from your stack manually—strictly 100% human authorization.</p>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] font-bold">
          <span className={`px-3 py-1.5 rounded-lg border ${wizardStep === 1 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            1. Configure Counts
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className={`px-3 py-1.5 rounded-lg border ${wizardStep === 2 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            2. Slot Allocation Review
          </span>
        </div>
      </div>

      {wizardStep === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT WIDGET: SKELETON BRANDING PROFILE */}
          <div className="lg:col-span-1 bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-150 pb-3">
              <span className="text-[10px] font-black text-slate-450 uppercase block">Step 1 of 2</span>
              <h3 className="text-sm font-black text-slate-900 uppercase">Headings Formatting</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">School or Institution Title</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Modern Model Senior Academy"
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-250 p-2.5 rounded-xl focus:bg-white focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Examination / Paper Title</label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Mid-Term Evaluation Project"
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-250 p-2.5 rounded-xl focus:bg-white focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Time Allowed</label>
                <input
                  type="text"
                  value={timeAllowed}
                  onChange={(e) => setTimeAllowed(e.target.value)}
                  placeholder="e.g. 3 Hours"
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-250 p-2.5 rounded-xl focus:bg-white focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10.5px] text-slate-500 leading-normal flex gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Logo url and affiliation styles are pre-fetched and applied from your logged-in profile configuration automatically.</span>
              </div>
            </div>
          </div>

          {/* CENTRE WIDGET: SYLLABUS DIRECTORIES */}
          <div className="lg:col-span-1 bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-150 pb-3">
              <span className="text-[10px] font-black text-slate-450 uppercase block">Step 2 of 2</span>
              <h3 className="text-sm font-black text-slate-900 uppercase">Class & Syllabus Specialization</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Class / Grade Level</label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-250 p-3 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Class 12">Class XII (Senior Secondary)</option>
                  <option value="Class 11">Class XI (Senior Secondary)</option>
                  <option value="Class 10">Class X (Middle)</option>
                  <option value="Class 9">Class IX (Middle)</option>
                  <option value="Class 8">Class VIII</option>
                  <option value="Class 6">Class VI</option>
                  <option value="Class 1">Class I</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Subject Specialist Name</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-250 p-3 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                >
                  {getSubjectsForClass(selectedClass).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Chapter Segments Selected</span>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2.5 divide-y divide-slate-100 bg-slate-50">
                  {selectedChapters.length === 0 ? (
                    <span className="text-xs text-slate-400 p-2 block font-medium">All chapter units selected by default.</span>
                  ) : (
                    selectedChapters.map((ch, i) => (
                      <div key={ch} className="py-1.5 text-xs text-slate-700 font-bold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 bg-amber-500 rounded-full"></span>
                        <span className="truncate">{ch}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT WIDGET: QUANTITY CONFIGURATION CONTROLLER */}
          <div className="lg:col-span-1 bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm relative">
            <div className="border-b border-slate-150 pb-3">
              <span className="text-[10px] font-black text-slate-450 uppercase block">Draft Skeleton Layout</span>
              <h3 className="text-sm font-black text-slate-900 uppercase">Target Questions Matrix</h3>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-slate-700">1 Mark Questions (e.g. MCQs)</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={cnt1}
                  onChange={(e) => setCnt1(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 text-center text-xs font-bold bg-white border border-slate-250 rounded-lg p-1.5 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-slate-700">2 Marks Questions (e.g. Short)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={cnt2}
                  onChange={(e) => setCnt2(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 text-center text-xs font-bold bg-white border border-slate-250 rounded-lg p-1.5 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-slate-700">3 Marks Questions (e.g. Analytical)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={cnt3}
                  onChange={(e) => setCnt3(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 text-center text-xs font-bold bg-white border border-slate-250 rounded-lg p-1.5 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-slate-700">4 Marks Questions (e.g. Case Study)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={cnt4}
                  onChange={(e) => setCnt4(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 text-center text-xs font-bold bg-white border border-slate-250 rounded-lg p-1.5 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-slate-700">5 Marks Questions (e.g. Long)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={cnt5}
                  onChange={(e) => setCnt5(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 text-center text-xs font-bold bg-white border border-slate-250 rounded-lg p-1.5 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-slate-700">6 Marks Questions (e.g. Advanced)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={cnt6}
                  onChange={(e) => setCnt6(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 text-center text-xs font-bold bg-white border border-slate-250 rounded-lg p-1.5 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleCompileDraftPaper}
                disabled={isAssembling || (cnt1 + cnt2 + cnt3 + cnt4 + cnt5 + cnt6 === 0)}
                className="w-full py-3.5 bg-slate-900 text-amber-400 hover:text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50 hover:bg-slate-800 transform active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>{isAssembling ? "Compiling skeleton grid..." : "Initialize Blank Draft Paper"}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* WIZARD STEP 2: ACTIVE DRAFT TYPESET WITH PLACEHOLDER CARD MATRIX SLOTS */
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white border-2 border-slate-800 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-800 rounded-xl border border-amber-500 flex items-center justify-center text-amber-500 shadow font-bold text-lg">
                  ⚙
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-200">Typeset Layout Dashboard</h3>
                  <p className="text-xs text-slate-400 font-medium">Click on empty slot indicators inside the paper column beneath to assign layout questions.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWizardStep(1);
                    setDraftPaper(null);
                  }}
                  className="px-4 py-2 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs border border-slate-700 transition cursor-pointer"
                >
                  Discard Skeleton
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraftToPortal}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Lock & Wrap Paper</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Class Goal</span>
                <span className="text-xs font-mono font-bold text-white block mt-0.5">{draftPaper?.class_level || selectedClass}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Syllabus Subject</span>
                <span className="text-xs font-bold text-amber-400 block mt-0.5 truncate">{draftPaper?.subject || selectedSubject}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Maximum Weightage</span>
                <span className="text-xs font-mono font-black text-white block mt-0.5">{draftPaper?.max_marks || 0} Marks</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Physical Time Limit</span>
                <span className="text-xs font-bold text-emerald-400 block mt-0.5">{draftPaper?.time_allowed || "3 Hours"}</span>
              </div>
            </div>
          </div>

          {/* SKELETON SHEETS COLUMNS RENDERING PLACEHOLDER CARDS */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm space-y-8 max-w-5xl mx-auto min-h-[500px]">
            
            {/* Header branding simulation */}
            <div className="border-b-4 border-double border-amber-500 pb-5 text-center space-y-1 select-none">
              <h1 className="text-lg md:text-xl font-serif font-black text-slate-900 uppercase tracking-tight">
                {draftPaper?.branding?.school_name || schoolName}
              </h1>
              <h2 className="text-sm font-sans font-bold text-slate-700 tracking-tight uppercase">
                {draftPaper?.branding?.exam_name || examName}
              </h2>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono px-4 pt-3 border-t border-slate-100 max-w-lg mx-auto">
                <span>Subject: {draftPaper?.subject || selectedSubject}</span>
                <span>Max Marks: {draftPaper?.max_marks || 0}</span>
                <span>Time: {draftPaper?.time_allowed || "3 Hours"}</span>
              </div>
            </div>

            {/* General Instructions */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs text-slate-600 font-medium">
              <span className="text-[10px] uppercase font-black tracking-wide text-slate-700 block">General Typesetting Rubrics & Directions:</span>
              <ul className="list-decimal pl-4.5 space-y-1">
                <li>All blank fill-up columns represented beneath require full teacher question key assignments.</li>
                <li>Each segment marks can sit within distinct question types (MCQ, Short, Long) as predefined.</li>
                <li>Finalized documents can be instantly exported, typographically synced or sent to PDF typography pools.</li>
              </ul>
            </div>

            {/* Render Each Section */}
            {draftPaper?.sections?.map((sec: any) => (
              <div key={sec.section_name} className="space-y-4 pt-4 border-t border-slate-150">
                <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono">
                    {sec.section_name} ({sec.questions.length} Question{sec.questions.length > 1 ? 's' : ''} × {sec.mark_value} Mark{sec.mark_value > 1 ? 's' : ''} each)
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase">
                    Weightage: {sec.mark_value * sec.questions.length} Marks
                  </span>
                </div>

                <div className="space-y-4">
                  {sec.questions.map((quest: Question, qIdx: number) => {
                    const isPlace = quest.isPlaceholder || !quest.question_text_latex;
                    
                    return (
                      <div 
                        key={quest.id} 
                        className={`border-2 rounded-2xl p-5 transition-all flex flex-col md:flex-row items-stretch justify-between gap-5 relative group ${
                          isPlace 
                            ? "border-dashed border-amber-300 bg-amber-50/20 hover:bg-amber-50/45" 
                            : "border-slate-250 bg-white hover:border-slate-355"
                        }`}
                      >
                        <div className="space-y-2 flex-1 min-w-0 pr-0 md:pr-4">
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-slate-900 text-white font-extrabold text-[10px] flex items-center justify-center font-mono">
                              Q{qIdx + 1}
                            </span>
                            <span className="text-[9.5px] font-mono font-bold text-slate-450 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase">
                              {quest.chapter_name || "General Selection"}
                            </span>
                            <span className="text-[9.5px] font-mono font-bold text-slate-450 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase">
                              {quest.mark_value} Mark({quest.mark_value > 1 ? 's' : ''})
                            </span>
                          </div>

                          {isPlace ? (
                            <div className="py-2.5">
                              <p className="text-xs italic font-bold text-amber-700 animate-pulse flex items-center gap-1.5">
                                <span>⚠️ EMPTY DRAFT SLOT: Click "Assign Question" to fill from saved catalog stack or manually write.</span>
                              </p>
                            </div>
                          ) : (
                            <div className="prose max-w-none text-slate-800 text-xs font-semibold leading-relaxed font-serif whitespace-pre-wrap py-2">
                              {quest.question_text_latex}
                            </div>
                          )}

                          {quest.marking_scheme_text_latex && (
                            <div className="bg-emerald-50/25 border border-emerald-100 p-2.5 rounded-lg text-[10.5px] text-emerald-800 leading-normal font-medium">
                              <span className="text-[8.5px] font-extrabold text-emerald-700 uppercase tracking-widest block font-sans">Verified Answer Rubric:</span>
                              <p className="whitespace-pre-wrap font-sans mt-0.5 font-semibold text-emerald-900">{quest.marking_scheme_text_latex}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row md:flex-col items-center justify-end gap-2 shrink-0 md:border-l border-slate-150 pl-0 md:pl-4 min-w-32">
                          <button
                            type="button"
                            onClick={() => handleOpenAssignPicker(quest.id, sec.mark_value)}
                            className="flex-1 md:w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white font-bold text-[10.5px] uppercase tracking-wide rounded-xl cursor-pointer transition flex items-center justify-center gap-1 shrink-0 px-3"
                          >
                            <span>Assign Question</span>
                          </button>

                          {!isPlace && (
                            <button
                              type="button"
                              onClick={() => handleClearSlot(quest.id)}
                              className="p-1 px-3 border border-slate-200 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all text-[10px] font-bold cursor-pointer"
                              title="Clear assigned question"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-slate-200 text-center select-none">
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase">
                ⚙---- CODEXAM DRAFT STRUCTURE MODEL END ----⚙
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ASSIGNMENT SECTOR MODAL VIEWPORT */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-slate-900 max-w-3xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[9px] uppercase font-black text-amber-600 tracking-wider">SECURE ASSIGNMENT OVERRIDE</span>
                <h3 className="text-md font-black text-slate-900 uppercase">Load Slot with {activeSlotMarks} Mark(s) Question</h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Column: Pick from private Saved Stack */}
              <div className="space-y-3.5 flex flex-col">
                <div className="border-b border-slate-150 pb-1.5 shrink-0 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">A. Select from Saved Stack ({savedStack.filter(q => q.mark_value === activeSlotMarks).length} available)</span>
                  <span className="text-[8.5px] font-mono font-bold uppercase text-slate-400 bg-slate-50 border px-1.5 rounded">Filter: {activeSlotMarks} Marks</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 max-h-72 min-h-40 border border-slate-150 rounded-2xl p-2.5 bg-slate-50">
                  {loadingStack ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-bold animate-pulse">Syncing question banks...</div>
                  ) : savedStack.filter(q => q.mark_value === activeSlotMarks).length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 font-medium">
                      No saved {activeSlotMarks}-marks questions found in your stack. Please write one on the right to auto-persist!
                    </div>
                  ) : (
                    savedStack
                      .filter(q => q.mark_value === activeSlotMarks)
                      .map((q) => (
                        <div 
                          key={q.id}
                          onClick={() => handleAssignFromStack(q)}
                          className="border border-slate-200 bg-white hover:border-amber-500 p-3 rounded-xl cursor-pointer transition select-none hover:shadow-sm"
                        >
                          <div className="flex items-center gap-1.5 mb-1.5 text-[9.5px] font-mono font-extrabold text-slate-450">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[120px]">{q.chapter_name}</span>
                            <span>•</span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">{q.question_type}</span>
                          </div>
                          <p className="text-xs font-medium font-serif line-clamp-3 text-slate-800 whitespace-pre-wrap">{q.question_text_latex}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Right Column: Write a custom new question instantly */}
              <form onSubmit={handleCreateAndAssignManual} className="space-y-3.5 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 pl-0 md:pl-5 flex flex-col">
                <div className="border-b border-slate-150 pb-1.5 shrink-0">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">B. Or Instant Manual Write-In</span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72">
                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Chapter Topic Mapping</label>
                    <input 
                      type="text"
                      value={manualChapter}
                      onChange={(e) => setManualChapter(e.target.value)}
                      placeholder="e.g. Accounting Fundamentals"
                      className="w-full text-xs font-bold border border-slate-250 p-2 rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Specific Question Text</label>
                    <textarea 
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Type LaTeX formulas using single dollars like $x^2 + y^2 = 36$"
                      className="w-full text-xs font-medium border border-slate-250 p-2 rounded-lg h-24 focus:outline-none focus:border-amber-500"
                      required
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-500 font-extrabold uppercase">Step Grading Criteria / Correct Sol. Guidelines</label>
                    <textarea 
                      value={manualAnswer}
                      onChange={(e) => setManualAnswer(e.target.value)}
                      placeholder="Meticulously write correct solution and step markings details."
                      className="w-full text-[11px] font-medium border border-slate-250 p-2 rounded-lg h-16"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 shrink-0">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Commit & Auto-Assign Question
                  </button>
                </div>
              </form>

            </div>

            <div className="pt-3 border-t border-slate-150 text-right">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-extrabold text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
