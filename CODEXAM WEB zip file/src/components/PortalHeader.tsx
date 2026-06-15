import React, { useState } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { LogOut, FolderLock, ShieldAlert, Award, RefreshCw, Key } from "lucide-react";

interface PortalHeaderProps {
  academicYear?: string;
  onRefreshData?: () => void;
  userSession: {
    codename: string;
    pin: string;
    type: "school" | "independent";
    name: string;
    logo_url: string;
  } | null;
  onLogout: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ 
  academicYear = "2026-27",
  onRefreshData,
  userSession,
  onLogout
}) => {
  const [showStatusBubble, setShowStatusBubble] = useState(false);

  return (
    <header 
      id="codexam-portal-header" 
      className="bg-slate-900 text-white border-b-4 border-double border-amber-500 py-3.5 px-6 shrink-0 relative z-30 shadow-md font-sans"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Modern Interactive Logo Area */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Elegant Double-bordered Crest with Custom Logo dynamic support */}
            <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-755 hover:border-amber-400 overflow-hidden flex items-center justify-center shadow-lg transition-all group">
              <ProfileAvatar 
                logoUrl={userSession?.logo_url} 
                name={userSession?.name || "Workspace"} 
                className="w-full h-full border-none rounded-none" 
              />
            </div>
            {/* Unlocked lock badge overlay */}
            <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-slate-950 border border-slate-900 shadow" title="Session decrypted and unlocked locally">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none font-sans">
                COD<span className="text-amber-500">EXAM</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[8.5px] font-black tracking-widest bg-emerald-500 text-slate-950 font-mono rounded uppercase">
                DECRYPTED LAB
              </span>
            </div>
            <p className="text-[10.5px] text-slate-300 font-medium tracking-tight mt-1 flex items-center gap-1.5 font-sans">
              <span className="text-amber-400 font-bold uppercase text-[10px]">Private Typesetting Console</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 leading-none truncate max-w-[200px] sm:max-w-xs">{userSession?.name || "Independent Teacher Workspace"}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Isolation indicator, Log out, Sync refresh */}
        <div className="flex flex-wrap items-center justify-end gap-3.5 w-full md:w-auto">
          
          {/* Active Academic Year Indicator */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
              Scope: <span className="text-white font-black font-mono">{academicYear} Aligned</span>
            </div>
          </div>

          {/* Sync Trigger button */}
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              className="p-2 bg-slate-800 text-slate-300 hover:text-amber-400 rounded-lg border border-slate-700 hover:bg-slate-750 transition-all cursor-pointer"
              title="Synchronize private database stack"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}

          {/* User Profile Badge & Cryptographic Lock State */}
          <div className="flex items-center gap-2.5 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm relative group">
            <div className="text-right select-none md:block hidden">
              <p className="text-[11px] font-black text-white font-mono uppercase">{userSession?.codename || "GUEST"}</p>
              <p className="text-[9px] text-amber-500 font-bold tracking-wide uppercase font-sans">
                {userSession?.type === "school" ? "School Administrator" : "Independent Educator"}
              </p>
            </div>
            <div className="h-8.5 w-8.5 rounded-lg bg-amber-500 text-slate-950 border border-amber-600 flex items-center justify-center font-extrabold text-xs shadow">
              <Key className="h-4 w-4" />
            </div>
          </div>

          {/* Logout Trigger button */}
          <button
            onClick={onLogout}
            className="p-2 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white rounded-lg border border-rose-900 transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 px-3.5 cursor-pointer"
            title="Lock and clear local decryption session"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lock Lab</span>
          </button>

        </div>
      </div>
    </header>
  );
};
