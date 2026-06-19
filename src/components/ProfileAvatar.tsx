import React from "react";

interface ProfileAvatarProps {
  logoUrl?: string | null;
  name?: string;
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  logoUrl,
  name = "Workspace",
  className = "h-10 w-10 shrink-0"
}) => {
  // Extract initials cleanly
  const getInitials = (str: string) => {
    if (!str) return "CX";
    const cleanStr = str
      .replace(/Apex Administrative Trial Board/i, "AA")
      .replace(/Modern Secondary Academy Hub/i, "MS")
      .trim();
    const parts = cleanStr.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanStr.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  // Check if logoUrl is a preset string or fallback needed
  const isPreset = logoUrl && logoUrl.startsWith("preset:");
  const presetType = isPreset ? logoUrl.replace("preset:", "") : "whatsapp";

  const renderContent = () => {
    // If the image is a custom desktop file upload (Base64) or custom remote image, render it
    // If it's a realistic portrait mock URL, treat it as empty/placeholder to respect the "no real picture" rule
    const isRealisticPortrait = typeof logoUrl === "string" && (
      logoUrl.includes("unsplash.com") && (
        logoUrl.includes("573496359142") || 
        logoUrl.includes("544005313") || 
        logoUrl.includes("535713875002") || 
        logoUrl.includes("1580489944761") || 
        logoUrl.includes("1472099645785") || 
        logoUrl.includes("1507003211169")
      )
    );

    if (logoUrl && !isPreset && !isRealisticPortrait) {
      return (
        <img
          src={logoUrl}
          alt={name}
          className="h-full w-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      );
    }

    // Clean up preset identification
    const selectedPreset = isRealisticPortrait ? "whatsapp" : presetType;

    switch (selectedPreset) {
      case "instagram":
        return (
          <div className="w-full h-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        );
      case "rose-amber":
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-mono font-bold text-[12px] tracking-tight uppercase">
            {initials}
          </div>
        );
      case "indigo-purple":
        return (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-mono font-bold text-[12px] tracking-tight uppercase">
            {initials}
          </div>
        );
      case "emerald-teal":
        return (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-mono font-bold text-[12px] tracking-tight uppercase">
            {initials}
          </div>
        );
      case "blue-cyan":
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-mono font-bold text-[12px] tracking-tight uppercase">
            {initials}
          </div>
        );
      case "slate-dark":
        return (
          <div className="w-full h-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-500 font-mono font-bold text-[12px] tracking-tight uppercase">
            {initials}
          </div>
        );
      case "whatsapp":
      default:
        // Classic WhatsApp soft slate/teal grey base with clean user contour silhouette
        return (
          <div className="w-full h-full bg-[#DFE5E7] dark:bg-[#232d36] flex items-center justify-center text-[#9fa6aa] relative">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[70%] h-[70%] translate-y-1 text-slate-400">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-250 shrink-0 shadow-inner flex items-center justify-center select-none ring-1 ring-slate-100 ${className}`}>
      {renderContent()}
    </div>
  );
};
