import React, { useState, useEffect } from "react";
import { 
  BrandingDetails, 
  PaperSectionCriteria, 
  PaperGenerationConfig, 
  GeneratedPaper, 
  Question 
} from "./types";
import { PaperReview } from "./components/PaperReview";
import { PaperPrintView } from "./components/PaperPrintView";
import { SchemaViewer } from "./components/SchemaViewer";

// Import newly designed institutional modular components
import { PortalHeader } from "./components/PortalHeader";
import { PortalSidebar, PortalView } from "./components/PortalSidebar";
import { DashboardView } from "./components/DashboardView";
import { PyqVaultView } from "./components/PyqVaultView";
import { DualDocumentWorkspace } from "./components/DualDocumentWorkspace";
import { InstitutionSettingsView } from "./components/InstitutionSettingsView";
import { IntroductoryHomeView } from "./components/IntroductoryHomeView";
import { CodexamLogin } from "./components/CodexamLogin";

import { 
  Plus, 
  History, 
  Trash2, 
  BookOpen, 
  Eye, 
  ChevronRight,
  FolderLock,
  Calendar,
  Undo2,
  FileText
} from "lucide-react";

export default function App() {
  // Authentication user session state
  const [userSession, setUserSession] = useState<{
    codename: string;
    pin: string;
    type: "school" | "independent";
    name: string;
    logo_url: string;
  } | null>(null);

  // Navigation View controllers: "home" | "dashboard" | "generator" | "pyq" | "saved" | "settings"
  const [portalView, setPortalView] = useState<PortalView>("home");
  const [vaultSubTab, setVaultSubTab] = useState<"vault" | "quiz">("vault");
  
  // High-level screen phase indicators ("wizard" | "review" | "print")
  const [viewPhase, setViewPhase] = useState<"wizard" | "review" | "print">("wizard");
  
  // Database status aggregates cache
  const [dbStats, setDbStats] = useState<any>({ totalQuestions: 0 });
  const [savedPapers, setSavedPapers] = useState<GeneratedPaper[]>([]);
  const [currentPaper, setCurrentPaper] = useState<GeneratedPaper | null>(null);
  const [loadingPapers, setLoadingPapers] = useState(false);

  // General Academic Cycle control (Updates dynamically in Settings/Header)
  const [academicYear, setAcademicYear] = useState<string>("2026-27");

  // PYQ Explorer Vault Cart Queue state
  const [activeQueue, setActiveQueue] = useState<Question[]>([]);

  // Institution branding presets target
  const [branding, setBranding] = useState<BrandingDetails>({
    school_name: "Modern Secondary Academy Hub",
    exam_name: "Mid-Term Evaluation Project",
    time_allowed: "3 Hours",
    max_marks: 80,
    logo_url: ""
  });

  // Load session from localStorage on startup
  useEffect(() => {
    console.log("[CODEXAM] Initializing core assessment layout engine...");
    const raw = localStorage.getItem("codexam_session");
    if (raw) {
      console.log("[CODEXAM] Cached session string found in localStorage:", raw);
      try {
        const parsed = JSON.parse(raw);
        console.log("[CODEXAM] Decrypted profile payload parsed correctly:", parsed);
        setUserSession(parsed);
        setBranding({
          school_name: parsed.name || "Modern Secondary Academy Hub",
          exam_name: "Mid-Term Evaluation Project",
          time_allowed: "3 Hours",
          max_marks: 80,
          logo_url: parsed.logo_url || ""
        });
      } catch (err) {
        console.error("[CODEXAM] Invalid cached session string parse warning:", err);
        localStorage.removeItem("codexam_session");
        setUserSession(null);
      }
    } else {
      console.log("[CODEXAM] No local workspace session found. Launching decryption/login terminal...");
    }
  }, []);

  // Update session changes instantly (e.g. from sidebar or home edit)
  const handleUpdateSession = (updatedSec: any) => {
    console.log("[CODEXAM] Updating active teacher session:", updatedSec);
    setUserSession(updatedSec);
    localStorage.setItem("codexam_session", JSON.stringify(updatedSec));
    
    // Sync headers and branding directly
    setBranding(prev => ({
      ...prev,
      school_name: updatedSec.name,
      logo_url: updatedSec.logo_url
    }));
  };

  const handleLogout = () => {
    console.log("[CODEXAM] Session logout requested. Evicting local seals...");
    localStorage.removeItem("codexam_session");
    setUserSession(null);
    setPortalView("home");
  };

  // Load backend aggregates and papers list
  const fetchDashboardData = async () => {
    if (!userSession) {
      console.log("[CODEXAM] Sync aborted: No active user session.");
      return;
    }
    try {
      console.log(`[CODEXAM] Querying database stats and papers for codename: ${userSession.codename}...`);
      const dbRes = await fetch("/api/db-status", {
        headers: {
          "X-Teacher-Codename": userSession.codename
        }
      });
      const dbData = await dbRes.json();
      console.log("[CODEXAM] Database stats received:", dbData);
      setDbStats(dbData);

      setLoadingPapers(true);
      const papersRes = await fetch("/api/saved-papers", {
        headers: {
          "X-Teacher-Codename": userSession.codename
        }
      });
      const papersData = await papersRes.json();
      console.log("[CODEXAM] Saved papers catalogs retrieved:", papersData);
      setSavedPapers(papersData);
    } catch (err) {
      console.error("[CODEXAM] Core database status synchronization failed:", err);
    } finally {
      setLoadingPapers(false);
    }
  };

  useEffect(() => {
    if (userSession?.codename) {
      fetchDashboardData();
    }
  }, [userSession?.codename]);

  // Saved template paper deletion triggers
  const handleDeletePaper = async (paperId: string) => {
    if (!userSession) return;
    try {
      const res = await fetch(`/api/saved-papers/${paperId}`, {
        method: "DELETE",
        headers: {
          "X-Teacher-Codename": userSession.codename
        }
      });
      if (res.ok) {
        setSavedPapers(savedPapers.filter(p => p.id !== paperId));
      }
    } catch (err) {
      console.error("Failed to delete requested paper template:", err);
    }
  };

  // Launches high fidelity reviewer
  const openSavedPaper = (paper: GeneratedPaper) => {
    setCurrentPaper(paper);
    setViewPhase("review");
  };

  // Exit Review modes back to primary dashboard view
  const handleResetGenerator = () => {
    setViewPhase("wizard");
    setPortalView("dashboard");
    fetchDashboardData();
  };

  // Question selection lists
  const handleAddQuestionToQueue = (q: Question) => {
    if (!activeQueue.some(item => item.id === q.id)) {
      setActiveQueue([...activeQueue, q]);
    }
  };

  const handleRemoveQuestionFromQueue = (id: string) => {
    setActiveQueue(activeQueue.filter(item => item.id !== id));
  };

  const handleClearQueue = () => {
    setActiveQueue([]);
  };

  // RENDER SECURITY ACCESS SCREEN FIRST IF NO SESSION ACTIVE OR CORRUPT
  if (!userSession || !userSession.codename) {
    return <CodexamLogin onLoginSuccess={(session) => {
      setUserSession(session);
      setBranding({
        school_name: session.name,
        exam_name: "Mid-Term Evaluation Project",
        time_allowed: "3 Hours",
        max_marks: 80,
        logo_url: session.logo_url
      });
    }} />;
  }

  return (
    <div id="saas-app-wrapper" className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-900">
      
      {/* RENDER MODE A: FULL SCREEN HARDCOPY CUSTOM TYPESET PRINT VIEW */}
      {viewPhase === "print" && currentPaper && (
        <PaperPrintView
          paper={currentPaper}
          onBack={() => setViewPhase("review")}
          showMarkingScheme={true}
        />
      )}

      {/* RENDER MODE B: ACTIVE REVIEW SCHEME WORKSPACE */}
      {viewPhase === "review" && currentPaper && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-105">
          
          {/* Header Bar to return back to dashboard */}
          <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b-4 border-double border-amber-500 shrink-0 relative z-30 shadow">
            <div className="flex items-center gap-3">
              <button
                id="review-back-home-btn"
                onClick={handleResetGenerator}
                className="p-1 px-3.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs tracking-tight rounded-lg border border-slate-750 transition-all flex items-center gap-1.5 cursor-pointer uppercase font-sans"
              >
                <Undo2 className="h-3.5 w-3.5" />
                <span>Return to Portal Control</span>
              </button>
              <div className="h-5 w-[1px] bg-slate-750 hidden sm:block"></div>
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block leading-none">Typesetting Draft under Review</span>
                <span className="text-xs font-serif font-black">{currentPaper.title}</span>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-400 font-mono font-bold uppercase select-none">
              Scope Cycle: {academicYear} Active
            </div>
          </div>

          <PaperReview
            paper={currentPaper}
            onUpdatePaper={setCurrentPaper}
            onGoToPrint={() => setViewPhase("print")}
            onReset={handleResetGenerator}
          />
        </div>
      )}

      {/* RENDER MODE C: MAIN ASSESSMENT PORTAL VIEW SYSTEM & SIDEBAR SHELL */}
      {viewPhase === "wizard" && (
        <>
          {/* 1. TOP PORTAL HEADER BAR WITH DECRYPTED CREDENTIALS */}
          <PortalHeader 
            academicYear={academicYear} 
            onRefreshData={fetchDashboardData} 
            userSession={userSession}
            onLogout={handleLogout}
          />

          {/* 2. DUAL LAYOUT COLUMNS: LEFT SIDEBAR + MAIN WORKSPACE */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            
            {/* LEFT PORTAL MENU SIDEBAR */}
            <PortalSidebar
              activeView={portalView === "curriculum" ? "pyq" : portalView}
              onViewChange={(view, subTab) => {
                if (view === "curriculum" as any) {
                  setPortalView("pyq");
                } else {
                  setPortalView(view);
                }
                if (view === "pyq") {
                  setVaultSubTab(subTab === "quiz" ? "quiz" : "vault");
                }
              }}
              dbStats={dbStats}
              savedPapersCount={savedPapers.length}
              userSession={userSession}
              onUpdateSession={handleUpdateSession}
            />

            {/* MAIN CONTENT WORKSPACE VIEWPORT LAYERED WITH ASSESSMENT GRID LINE PATTERN */}
            <main 
              id="assessment-grid-viewport" 
              className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 relative bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] min-h-0"
            >
              
              {/* DYNAMIC PORTAL MENUS */}

              {/* INTRODUCTORY HOME VIEW PANEL WITH 3D NEOMORPHIC ENTRYWAYS */}
              {portalView === "home" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <IntroductoryHomeView 
                    onNavigate={(view, subTab) => {
                      if (view === "curriculum" as any) {
                        setPortalView("pyq");
                      } else {
                        setPortalView(view);
                      }
                      if (view === "pyq") {
                        setVaultSubTab(subTab === "quiz" ? "quiz" : "vault");
                      }
                    }}
                    userSession={userSession}
                    onUpdateSession={handleUpdateSession}
                  />
                </div>
              )}

              {/* MODULE 1: Portal Dashboard */}
              {portalView === "dashboard" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <DashboardView 
                    dbStats={dbStats} 
                    savedPapers={savedPapers} 
                    onNavigateToView={setPortalView} 
                    onOpenPaper={openSavedPaper}
                    onDeletePaper={handleDeletePaper}
                  />
                </div>
              )}

              {/* MODULE 2: Custom Layout Typesetter Planner */}
              {portalView === "generator" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <DualDocumentWorkspace />
                </div>
              )}

              {/* MODULE 3: Private Saved Question Stack & Document Import */}
              {portalView === "pyq" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <PyqVaultView
                    onAddQuestionToDraftQueue={handleAddQuestionToQueue}
                    activeQueue={activeQueue}
                    onRemoveQuestionFromQueue={handleRemoveQuestionFromQueue}
                    onClearQueue={handleClearQueue}
                  />
                </div>
              )}

              {/* MODULE 4: My Saved Question Paper Designs list */}
              {portalView === "saved" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                  
                  {/* Outer Wrap container */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="border-b border-slate-150 pb-4 mb-6">
                      <h2 className="text-md font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 leading-none">
                        <History className="h-5 w-5 text-amber-500" />
                        <span>My Completed Designs</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Review, delete or send generated question papers to typography spools.</p>
                    </div>

                    {loadingPapers ? (
                      <div className="py-12 text-center text-xs text-slate-400 font-bold animate-pulse">
                        Querying saved databases...
                      </div>
                    ) : savedPapers.length === 0 ? (
                      <div id="no-saved-papers-view" className="py-12 text-center border-2 border-dashed border-slate-250 rounded-xl bg-slate-50/50">
                        <FileText className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                        <span className="text-xs font-bold text-slate-700 block">No Active Paper Templates Found</span>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                          Enter your custom configurations on the "Draft Paper Typesetter" module or explore the Private Question Stack to build a catalog.
                        </p>
                        <button
                          onClick={() => setPortalView("generator")}
                          className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                        >
                          Launch Builder Workspace
                        </button>
                      </div>
                    ) : (
                      <div id="saved-papers-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedPapers.map((paperInstance) => (
                          <div 
                            key={paperInstance.id} 
                            className="border-2 border-slate-200 p-4 rounded-xl flex items-start justify-between bg-white hover:border-amber-400 transition-all shadow-xs hover:shadow-sm"
                          >
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {paperInstance.branding.logo_url && (
                                  <img src={paperInstance.branding.logo_url} alt="Crest" className="h-6 w-6 object-contain rounded border pointer-events-none" referrerPolicy="no-referrer" />
                                )}
                                <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 font-sans font-bold text-[9px] rounded uppercase">
                                  {paperInstance.class_level}
                                </span>
                                <span className="text-[10px] text-slate-450 font-bold uppercase font-mono bg-slate-100 px-2 py-0.5 rounded">
                                  {paperInstance.subject}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-serif font-black text-sm text-slate-900 leading-tight">
                                  {paperInstance.title}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-medium font-sans max-w-xs truncate">
                                  {paperInstance.branding.school_name}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                                <span>Max Marks: {paperInstance.max_marks}</span>
                                <span>•</span>
                                <span>Time Allowed: {paperInstance.time_allowed}</span>
                              </div>
                            </div>

                            <div className="flex gap-1.5 shrink-0 pl-4">
                              <button
                                id={`open-paper-btn-${paperInstance.id}`}
                                onClick={() => openSavedPaper(paperInstance)}
                                className="px-3 py-1.5 bg-white border border-slate-250 text-slate-700 hover:bg-slate-100 hover:border-slate-350 font-bold rounded-lg text-[10.5px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Preview</span>
                                <Eye className="h-3.5 w-3.5 text-blue-650" />
                              </button>

                              <button
                                id={`delete-paper-btn-${paperInstance.id}`}
                                onClick={() => handleDeletePaper(paperInstance.id)}
                                className="p-1 px-2.5 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                title="Delete archived template"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Schema View component display as an advanced developer sub-tab */}
                  <div className="bg-slate-900 border-2 border-double border-amber-500 rounded-2xl p-6 text-white space-y-4">
                    <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-xs font-black uppercase text-amber-400 tracking-widest block font-sans">CODEXAM Schema Architect Console</h2>
                        <h3 className="text-md font-serif font-bold text-slate-200">Supabase-Compatible PostgreSQL (DDL)</h3>
                      </div>
                      <span className="text-[9px] font-mono bg-blue-600 px-2 py-0.5 rounded font-black text-white">Relational DB</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans max-w-3xl font-medium">
                      Below is the exact production-ready migrations blueprint compatible with Supabase PostgreSQL environments, equipped with custom indexing algorithms for rapid questions mapping correctly.
                    </p>

                    <SchemaViewer />
                  </div>

                </div>
              )}

              {/* MODULE 5: Identity and settings parameters */}
              {portalView === "settings" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <InstitutionSettingsView
                    branding={branding}
                    onUpdateBranding={setBranding}
                    academicYear={academicYear}
                    onUpdateAcademicYear={setAcademicYear}
                  />
                </div>
              )}

            </main>
          </div>
        </>
      )}

    </div>
  );
}
