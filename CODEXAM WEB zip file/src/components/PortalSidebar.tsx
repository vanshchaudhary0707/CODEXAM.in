import React, { useState } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { 
  Building2, 
  Sparkles, 
  Database, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  BookOpen, 
  Edit2,
  Check,
  User,
  ShieldAlert,
  GraduationCap,
  Camera,
  Upload,
  X
} from "lucide-react";

export type PortalView = "home" | "dashboard" | "generator" | "pyq" | "saved" | "settings" | "curriculum";

interface PortalSidebarProps {
  activeView: PortalView;
  onViewChange: (view: PortalView, subTab?: string) => void;
  dbStats?: { totalQuestions: number };
  savedPapersCount?: number;
  userSession: {
    codename: string;
    pin: string;
    type: "school" | "independent";
    name: string;
    logo_url: string;
  } | null;
  onUpdateSession: (updated: any) => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeView,
  onViewChange,
  dbStats,
  savedPapersCount = 0,
  userSession,
  onUpdateSession
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [tempName, setTempName] = useState(userSession?.name || "");
  const [tempType, setTempType] = useState<"school" | "independent">(userSession?.type || "school");
  const [tempLogo, setTempLogo] = useState(userSession?.logo_url || "");

  const menuItems = [
    {
      id: "home" as PortalView,
      label: "CODEXAM Home",
      icon: BookOpen,
      desc: "Welcome & Quickstart options"
    },
    {
      id: "dashboard" as PortalView,
      label: "Stats Overview",
      icon: LayoutDashboard,
      desc: "Drafts and analytics dashboard"
    },
    {
      id: "generator" as PortalView,
      label: "Draft Paper Typesetter",
      icon: FileText,
      desc: "Assemble questions-free paper grids"
    },
    {
      id: "pyq" as PortalView,
      label: "Saved Question Stack",
      icon: Database,
      desc: "OCR extractor and custom bank",
      badge: "Private Database"
    },
    {
      id: "saved" as PortalView,
      label: "My Completed Designs",
      icon: FileText,
      desc: "Locked drafts & review catalogs",
      count: savedPapersCount
    },
    {
      id: "settings" as PortalView,
      label: "Identity & Branding Settings",
      icon: Settings,
      desc: "Configure header formatting metrics"
    }
  ];

  const handleStartEditing = () => {
    setTempName(userSession?.name || "");
    setTempType(userSession?.type || "school");
    setTempLogo(userSession?.logo_url || "");
    setIsEditing(true);
  };

  const handleSaveSidebarEdit = () => {
    if (!tempName.trim()) return;
    onUpdateSession({
      ...userSession,
      name: tempName.trim(),
      type: tempType,
      logo_url: tempLogo.trim()
    });
    setIsEditing(false);
  };

  return (
    <aside id="portal-side-nav" className="w-full lg:w-72 bg-white border-r border-slate-200 select-none flex flex-col shrink-0 font-sans">
      
      {/* Dynamic Profile/Identity Section - Fully Editable as requested */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 relative">
        {!isEditing ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-center gap-2.5">
                <div 
                  onClick={() => setShowImagePicker(!showImagePicker)}
                  className="group relative h-10 w-10 rounded-xl bg-slate-900 border-2 border-amber-505 hover:border-amber-400 shadow-sm shrink-0 overflow-hidden cursor-pointer transition-all"
                  title="Click to customize profile picture"
                >
                  <ProfileAvatar 
                    logoUrl={userSession?.logo_url} 
                    name={userSession?.name || "Workspace"} 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border block w-fit ${
                    userSession?.type === "school" 
                      ? "bg-blue-50 text-blue-700 border-blue-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {userSession?.type === "school" ? "SCHOOL UNIT" : "INDEPENDENT TUTOR"}
                  </span>
                  <div className="text-xs font-bold text-slate-800 tracking-tight mt-1 truncate max-w-[160px] font-serif">
                    {userSession?.name || "Independent Workspace"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowImagePicker(false);
                  handleStartEditing();
                }}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-705 rounded-lg transition-all cursor-pointer shrink-0"
                title="Edit Identity Settings directly"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>

            {/* Dynamic Interactive Profile Photo Customizer */}
            {showImagePicker && (
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-black/5 animate-in fade-in duration-200 space-y-3 z-20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-amber-500" />
                    <span>Customize Profile picture</span>
                  </span>
                  <button 
                    onClick={() => setShowImagePicker(false)}
                    className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                {/* Instagram/WhatsApp Preset Gallery */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Select Vector Custom Preset</span>
                  <div className="grid grid-cols-7 gap-1.5">
                    {[
                      { name: "Classic WhatsApp Outline", url: "preset:whatsapp" },
                      { name: "Vibrant Instagram Gradient", url: "preset:instagram" },
                      { name: "Sunset Flare (Initials)", url: "preset:rose-amber" },
                      { name: "Cosmic Indigo (Initials)", url: "preset:indigo-purple" },
                      { name: "Mint Emerald (Initials)", url: "preset:emerald-teal" },
                      { name: "Ocean Waves (Initials)", url: "preset:blue-cyan" },
                      { name: "Obsidian Slate (Initials)", url: "preset:slate-dark" }
                    ].map((portrait, idx) => {
                      const isSelected = (userSession?.logo_url || "preset:whatsapp") === portrait.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          title={portrait.name}
                          onClick={() => {
                            onUpdateSession({
                              ...userSession,
                              logo_url: portrait.url
                            });
                          }}
                          className={`h-7 w-7 rounded-lg overflow-hidden border cursor-pointer transition-all hover:scale-105 active:scale-95 relative ${
                            isSelected ? "border-amber-550 ring-2 ring-amber-500/20" : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <ProfileAvatar logoUrl={portrait.url} name={userSession?.name} className="w-full h-full border-none rounded-none" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-amber-600 bg-white rounded-full p-0.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop File Upload Button */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Upload Desktop Files</span>
                  
                  <label className="w-full flex items-center justify-center gap-2 py-1.5 border border-dashed border-slate-250 hover:border-amber-500 rounded-lg hover:bg-amber-50/20 cursor-pointer transition-all text-slate-600 hover:text-amber-805 text-[10.5px] font-semibold">
                    <Upload className="h-3.5 w-3.5 text-amber-550" />
                    <span>Choose Desktop File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (uploadEvent) => {
                            const base64 = uploadEvent.target?.result as string;
                            onUpdateSession({
                              ...userSession,
                              logo_url: base64
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-amber-600 uppercase block">Modify Active Identity</span>
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/65 rounded-lg border border-slate-150 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setTempType("school")}
                  className={`py-1 rounded font-bold cursor-pointer transition-all ${
                    tempType === "school" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  School
                </button>
                <button
                  type="button"
                  onClick={() => setTempType("independent")}
                  className={`py-1 rounded font-bold cursor-pointer transition-all ${
                    tempType === "independent" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  Independent
                </button>
              </div>

              {/* Display Name Input */}
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Institutional/Teacher Name"
                className="w-full text-xs font-bold bg-white border border-slate-200 focus:border-amber-500 p-2 rounded-lg"
              />
            </div>

            <div className="flex gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10.5px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSidebarEdit}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10.5px] cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="h-3 w-3 text-amber-400" />
                <span>Save</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 p-4 space-y-2 mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                isActive 
                  ? "bg-slate-900 border-slate-900 text-white shadow-md relative" 
                  : "bg-white border-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-50 hover:border-slate-150"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                  isActive ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500"
                }`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-black tracking-tight truncate ${isActive ? "text-white" : "text-slate-800"}`}>
                    {item.label}
                  </div>
                  <div className={`text-[10px] truncate max-w-[150px] ${isActive ? "text-slate-300" : "text-slate-400 font-medium"}`}>
                    {item.desc}
                  </div>
                </div>
              </div>

              {/* Badges or counters */}
              {item.badge && (
                <span className="text-[7.5px] font-black uppercase tracking-wider bg-orange-500 text-white px-1.5 py-0.5 rounded-full border border-orange-400">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > -1 && (
                <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded ${
                  isActive ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-600"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Database sync micro bar widget at standard grid */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-[11px] leading-relaxed space-y-2 shrink-0">
        <div className="flex items-center justify-between text-slate-450 font-bold uppercase tracking-wider text-[8.5px]">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span>CODEXAM Operational</span>
          </span>
          <span className="text-slate-500 font-mono text-[8px]">Encrypted</span>
        </div>
        
        <p className="text-[10px] text-slate-400 leading-normal italic text-center">
          Secured local-host sandbox configuration.
        </p>
      </div>

    </aside>
  );
};
