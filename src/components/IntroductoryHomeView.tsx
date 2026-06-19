import React, { useState } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { FolderLock, Database, FileText, ArrowRight, Upload, Sparkles, User, Building } from "lucide-react";
import { PortalView } from "./PortalSidebar";

interface IntroductoryHomeViewProps {
  onNavigate: (view: PortalView, optionalSubTab?: string) => void;
  userSession: {
    codename: string;
    pin: string;
    type: "school" | "independent";
    name: string;
    logo_url: string;
  } | null;
  onUpdateSession: (updated: any) => void;
}

export const IntroductoryHomeView: React.FC<IntroductoryHomeViewProps> = ({ 
  onNavigate, 
  userSession,
  onUpdateSession 
}) => {
  const [logoInput, setLogoInput] = useState(userSession?.logo_url || "");
  const [showLogoEditor, setShowLogoEditor] = useState(false);

  const handleSubmitLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (logoInput.trim()) {
      onUpdateSession({
        ...userSession,
        logo_url: logoInput.trim()
      });
      setShowLogoEditor(false);
    }
  };

  return (
    <div id="intro-home-container" className="space-y-10 py-6 font-sans">
      
      {/* 1. Header Banner Zone with dynamic customizable logo space */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        
        {/* Logo display area right at the top centering block! */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-slate-900 border-2 border-amber-500 overflow-hidden shadow-xl flex items-center justify-center transition-transform hover:scale-105">
              <ProfileAvatar 
                logoUrl={userSession?.logo_url} 
                name={userSession?.name || "Workspace"} 
                className="w-full h-full border-none rounded-none" 
              />
            </div>
            <button 
              onClick={() => setShowLogoEditor(!showLogoEditor)}
              className="absolute -bottom-1 -right-1 p-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg border border-slate-900 text-[10px] font-black cursor-pointer shadow-md uppercase font-mono tracking-tight"
            >
              Change
            </button>
          </div>

          {showLogoEditor && (
            <form onSubmit={handleSubmitLogo} className="w-full max-w-md bg-white p-3.5 border-2 border-slate-200 rounded-xl space-y-2.5 shadow-sm animate-in zoom-in-95">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Configure Workspace Logo Link</span>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={logoInput} 
                  onChange={(e) => setLogoInput(e.target.value)} 
                  placeholder="https://example.com/logo.png" 
                  className="flex-1 text-xs border border-slate-300 p-2 rounded-lg font-mono"
                  required
                />
                <button type="submit" className="px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs uppercase rounded-lg cursor-pointer">
                  Update
                </button>
              </div>
            </form>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
          COD<span className="text-amber-500">EXAM</span>
        </h1>
        
        <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
          Welcome to your high-performance private typesetting lab. Under your decrypted credentials, you can build mock draft papers with empty placeholder slots and assign custom questions from your secure shared stack.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold text-[9px] rounded uppercase">Decrypted Session Code</span>
          <span className="text-xs font-mono text-slate-700 font-black px-1.5">{userSession?.codename || "GUEST"}</span>
          <span className="h-3 w-[1px] bg-slate-300"></span>
          <span className="text-[10.5px] font-sans font-bold text-slate-500 flex items-center gap-1">
            {userSession?.type === "school" ? <Building className="h-3.5 w-3.5 text-blue-600" /> : <User className="h-3.5 w-3.5 text-amber-600" />}
            <span>{userSession?.name}</span>
          </span>
        </div>
      </div>
 
      {/* 2. Heavy-Border Tactile Neomorphic Operation Cards */}
      <div id="intro-physical-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 max-w-4xl mx-auto">
        
        {/* Card One: Draft Paper Creator */}
        <div 
          onClick={() => onNavigate("generator")}
          className="group relative cursor-pointer bg-white rounded-2xl border-2 border-slate-900 p-8 flex flex-col justify-between h-80 transition-all duration-300 transform shadow-[8px_8px_0px_0px_#0f172a] hover:translate-y-[-8px] hover:shadow-[14px_14px_0px_0px_#f59e0b] hover:border-amber-500"
        >
          {/* Accent strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-900 to-amber-500 rounded-t-xl"></div>
          
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shadow-inner group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
              <FileText className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span>📝 Draft Exam Typesetter</span>
              </h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Set up custom question counts for 1 to 6 marks. Create a fully structures blank paper structure with editable placeholder weightage cards, and easily drag-and-drop or select questions from your bank.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-150 flex items-center justify-between text-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider font-sans group-hover:text-amber-600 transition-colors">
              Launch Creator Workspace
            </span>
            <div className="p-1 px-3 bg-slate-900 text-white rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Card Two: Private Question Stack & OCR Uploader */}
        <div 
          onClick={() => onNavigate("pyq")}
          className="group relative cursor-pointer bg-white rounded-2xl border-2 border-slate-900 p-8 flex flex-col justify-between h-80 transition-all duration-300 transform shadow-[8px_8px_0px_0px_#0f172a] hover:translate-y-[-8px] hover:shadow-[14px_14px_0px_0px_#f59e0b] hover:border-amber-500"
        >
          {/* Accent strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-t-xl"></div>
          
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shadow-inner group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
              <Database className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span>📚 Private Question Stack</span>
              </h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Manage your secure local question database. Share/upload reference papers, text files, or PDFs, automatically extract bulk text using our OCR helper, save questions, and use them to fill up empty paper drafts.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-150 flex items-center justify-between text-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider font-sans group-hover:text-amber-600 transition-colors">
              Open Question Stack
            </span>
            <div className="p-1 px-3 bg-slate-900 text-white rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
