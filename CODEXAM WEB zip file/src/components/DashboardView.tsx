import React, { useEffect, useState } from "react";
import { 
  Award, 
  Database, 
  Layers, 
  PlusCircle, 
  History, 
  ChevronRight, 
  TrendingUp, 
  BookOpen, 
  Settings,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Trash2
} from "lucide-react";
import { GeneratedPaper } from "../types";

interface DashboardViewProps {
  dbStats: any;
  savedPapers: GeneratedPaper[];
  onNavigateToView: (view: "generator" | "pyq" | "saved" | "settings") => void;
  onOpenPaper?: (paper: GeneratedPaper) => void;
  onDeletePaper?: (paperId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dbStats,
  savedPapers,
  onNavigateToView,
  onOpenPaper,
  onDeletePaper
}) => {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  
  // High quality CBSE announcements pool
  const announcements = [
    { id: 1, title: "Class XII Economics syllabus revisions", description: "CBSE has added 3 marks for competency evaluation calculations inside the National Income aggregate domain.", type: "URGENT" },
    { id: 2, title: "Double-Line Hardcopy layouts mandated", description: "To match actual answer sheet grids, printed examination papers are recommended to use standard crisp margins.", type: "RECOMMENDED" },
    { id: 3, title: "Mock solutions keys requested", description: "Class XII boards will require side-by-side solutions codes during exam evaluation audits.", type: "INFO" }
  ];

  return (
    <div id="cbse-dashboard-viewport" className="space-y-6">
      
      {/* SaaS Welcome Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white rounded-2xl border-2 border-double border-amber-500 overflow-hidden relative shadow-lg">
        {/* Subtle grid layer */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        
        <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-amber-400 text-slate-900 border border-amber-500 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-flex items-center gap-1 shadow-sm">
              <ShieldCheck className="h-3 w-3" />
              Verified CBSE Administrator Console
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-black tracking-tight leading-tight">
              Modernized Assessment & <span className="text-amber-400">CBSE Curriculum</span> Portal
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
              Welcome back to your high-fidelity SaaS dashboard helper. Our smart typesetting engines are loaded with the latest NCERT mappings and CBSE regional past examination pools, optimized for strict typesetting drafts, solutions keys, and quick mock paper drafting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              id="dash-quick-generate-btn"
              onClick={() => onNavigateToView("generator")}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs tracking-tight rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-400"
            >
              <PlusCircle className="h-4 w-4" />
              <span>AI Instant Creator</span>
            </button>
            <button
              id="dash-pyq-vault-btn"
              onClick={() => onNavigateToView("pyq")}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs tracking-tight rounded-xl transition-all shadow-md border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Database className="h-4 w-4" />
              <span>PYQ Explorer Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Metric counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <History className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Archived Drafts</span>
            <h3 className="text-2xl font-black font-mono text-slate-900 mt-1">{savedPapers?.length || 0}</h3>
            <p className="text-[10px] text-slate-500 font-medium mt-1">Exportable exam blueprints</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Curriculum subjects</span>
            <h3 className="text-2xl font-black font-mono text-slate-900 mt-1">
              {Object.keys(dbStats?.bySubject || {}).length} Authorized
            </h3>
            <p className="text-[10px] text-slate-500 font-medium mt-1">Science & Commerce active</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Inference Status</span>
            <h3 className="text-md font-bold text-indigo-700 uppercase tracking-wide mt-2 flex items-center gap-1.5 leading-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gemini 3.5 Ready</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium mt-1">Automatic auto-fill enabled</p>
          </div>
        </div>

      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Stats breakdown and recent items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Drafted & Published Question Papers list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif font-black text-sm text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <span>Drafted &amp; Published Question Papers</span>
            </h3>
            
            {savedPapers.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-bold">No drafted papers found.</p>
                <button
                  onClick={() => onNavigateToView("generator")}
                  className="mt-3 px-3 py-1.5 bg-[#0c4a60] hover:bg-[#0c4a60]/95 text-white rounded-lg text-[10.5px] font-bold cursor-pointer"
                >
                  Create a Question Paper Draft
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPapers.slice(0, 5).map((paper) => (
                  <div key={paper.id} className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded uppercase">
                          {paper.class_level}
                        </span>
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 rounded uppercase text-[10px]">
                          {paper.subject}
                        </span>
                        <span className="text-slate-400 font-bold">
                          {paper.time_allowed} / {paper.max_marks} Marks
                        </span>
                      </div>
                      <h4 className="font-serif font-black text-sm text-slate-900 leading-tight truncate">
                        {paper.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {paper.branding.school_name}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onOpenPaper && onOpenPaper(paper)}
                        className="px-3 py-1.5 bg-[#0c4a60] hover:bg-[#0c4a60]/95 text-white text-[11px] font-extrabold rounded-lg cursor-pointer transition flex items-center gap-1"
                      >
                        <span>Continue &rArr;</span>
                      </button>
                      
                      <button
                        onClick={() => onDeletePaper && onDeletePaper(paper.id)}
                        className="px-2 py-1.5 bg-white border border-slate-250 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 text-slate-400 rounded-lg cursor-pointer transition"
                        title="Delete this draft"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick-setup Presets widget */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif font-black text-sm text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                <span>Preconfigured CBSE Blueprint Presets</span>
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="border border-slate-250 p-4 rounded-xl bg-slate-50/45 hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">Class 12 Economics</span>
                  <span className="text-[10px] font-mono font-bold text-slate-450 bg-slate-100 px-2 py-0.5 rounded">Duration: 3 Hours</span>
                </div>
                <h4 className="text-xs font-bold font-serif text-slate-900 leading-none mb-1">Standard National Income Aggregate Scheme</h4>
                <p className="text-[10px] text-slate-550 leading-relaxed font-sans max-w-xl">
                  Contains MCQ, Short Answers, Case-Based Welfare Analysis, and Income-Expenditure calculation models. Configured for a maximum output of 80 marks.
                </p>
                <button
                  onClick={() => onNavigateToView("generator")} 
                  className="mt-3.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>Select Preset & Launch Blueprint</span>
                  <ChevronRight className="h-3 w-3 text-amber-400" />
                </button>
              </div>

              <div className="border border-slate-250 p-4 rounded-xl bg-slate-50/45 hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">Class 12 Business Studies</span>
                  <span className="text-[10px] font-mono font-bold text-slate-450 bg-slate-100 px-2 py-0.5 rounded">Duration: 3 Hours</span>
                </div>
                <h4 className="text-xs font-bold font-serif text-slate-900 leading-none mb-1">Principles of Management Terminal Blueprint</h4>
                <p className="text-[10px] text-slate-550 leading-relaxed font-sans max-w-xl">
                  Includes Taylor’s Scientific Management, Fayol's Principles, functional foremanship, and Case-Based Equity evaluation models for a total of 80 marks.
                </p>
                <button
                  onClick={() => onNavigateToView("generator")}
                  className="mt-3.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>Select Preset & Launch Blueprint</span>
                  <ChevronRight className="h-3 w-3 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Board announcements & notifications */}
        <div className="space-y-6">
          
          {/* Institution notice-board */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col space-y-4">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">BOARD NOTICES</span>
            
            <div className="divide-y divide-slate-200">
              {announcements.map((ann) => (
                <div key={ann.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-sans font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 tracking-wider">
                      {ann.type}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold font-mono">2026-MAY</span>
                  </div>
                  <h4 className="text-xs font-bold font-serif text-slate-850 leading-tight pr-4">{ann.title}</h4>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans font-medium">{ann.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a 
                href="https://cbse.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[11px] font-extrabold text-blue-600 hover:underline flex items-center justify-center gap-1 py-1.5 w-full border border-slate-200 bg-white rounded-xl"
              >
                <span>Navigate to Official CBSE Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Academic Presets widget information */}
          <div className="bg-amber-500/10 border-2 border-double border-amber-300 rounded-2xl p-5 space-y-3.5 text-xs">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-amber-600" />
              <span>Typesetting Standard Mandate</span>
            </h4>
            <p className="text-[11px] text-slate-700 leading-relaxed font-serif italic">
              "Under regulation 40/B of the CBSE academic board directives, every mock exam paper draft must have structured evaluation criteria appended separately inside a solution key or marking scheme. This ensures fair physical grading allocations on hardcopies."
            </p>
            <div className="border-t border-amber-500/20 pt-2 text-[10px] text-amber-800 font-mono font-bold leading-none select-none uppercase">
              REgulating Year 2026-2027
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
