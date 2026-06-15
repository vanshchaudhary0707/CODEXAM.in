import React from "react";

interface CodexamLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
}

export const CodexamLogo: React.FC<CodexamLogoProps> = ({
  size = "md",
  className = "",
  showTagline = true,
}) => {
  // Map standard size triggers
  const dimensions = {
    sm: { box: "h-12", iconSize: 40, textClass: "text-lg" },
    md: { box: "h-20", iconSize: 64, textClass: "text-2xl" },
    lg: { box: "h-36", iconSize: 110, textClass: "text-3xl" },
    xl: { box: "h-48", iconSize: 160, textClass: "text-4xl" },
  };

  const current = dimensions[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Dynamic Golden Vector Icon matching the attached reference design */}
      <svg
        width={current.iconSize}
        height={current.iconSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_15px_rgba(230,175,54,0.25)]"
      >
        <defs>
          {/* Authentic Metallic Gold Gradient */}
          <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="25%" stopColor="#F9D776" />
            <stop offset="60%" stopColor="#D29F35" />
            <stop offset="90%" stopColor="#966914" />
            <stop offset="100%" stopColor="#5E3E04" />
          </linearGradient>
          
          {/* Subtle Glow Gradient */}
          <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F3C34D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F3C34D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background glow ring */}
        <circle cx="100" cy="90" r="45" fill="url(#goldGlow)" />

        {/* Main Graduation Cap & Circuit & Book Hybrid */}
        {/* Top Diamond Plate of Mortarboard */}
        <path
          d="M 100 35 L 165 65 L 100 95 L 35 65 Z"
          fill="url(#premiumGold)"
          stroke="#1E293B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Golden Tassel hanging on the right side */}
        <path
          d="M 162 66 L 162 105"
          stroke="url(#premiumGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 158 105 L 166 105 L 164 122 L 160 122 Z"
          fill="url(#premiumGold)"
        />

        {/* Right sidebook pages curve */}
        <path
          d="M 102 96 C 115 106, 135 106, 148 98 L 148 135 C 135 142, 115 142, 102 132 Z"
          fill="url(#premiumGold)"
          opacity="0.9"
        />
        <path
          d="M 102 132 L 102 96 C 104 100, 110 115, 110 135 Z"
          fill="#5E3E04"
          opacity="0.35"
        />
        {/* Double layered page edge line effect */}
        <path
          d="M 106 135 C 118 143, 137 143, 151 137 L 151 100"
          stroke="url(#premiumGold)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />

        {/* Left side integrated microchip circuit path */}
        {/* Main base vertical neck */}
        <path
          d="M 98 96 L 98 132"
          stroke="url(#premiumGold)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Circuit Branch 1 (Top-Left) */}
        <path
          d="M 90 92 L 65 92 L 50 82"
          stroke="url(#premiumGold)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="82" r="3.5" fill="url(#premiumGold)" stroke="#0F172A" strokeWidth="1" />

        {/* Circuit Branch 2 (Middle-Left) */}
        <path
          d="M 85 105 L 58 105 L 42 98"
          stroke="url(#premiumGold)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="42" cy="98" r="3.5" fill="url(#premiumGold)" stroke="#0F172A" strokeWidth="1" />

        {/* Circuit Branch 3 (Lower-Middle-Left) */}
        <path
          d="M 85 116 L 62 116 L 50 125"
          stroke="url(#premiumGold)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="125" r="3.5" fill="url(#premiumGold)" stroke="#0F172A" strokeWidth="1" />

        {/* Circuit Branch 4 (Bottom-Left) */}
        <path
          d="M 90 128 L 76 128 L 70 138"
          stroke="url(#premiumGold)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="70" cy="138" r="3.5" fill="url(#premiumGold)" stroke="#0F172A" strokeWidth="1" />
      </svg>

      {/* Typography matches attached logo style with CODE in white and XAM in shining gold */}
      <div className="mt-4 flex flex-col items-center">
        <h2 className={`${current.textClass} font-sans tracking-[0.16em] uppercase font-black text-white`}>
          CODE<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9D776] via-[#D29F35] to-[#AA771C]">XAM</span>
        </h2>
        
        {showTagline && (
          <div className="flex items-center gap-2 mt-1.5 w-full max-w-sm justify-center">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#D29F35] uppercase font-sans whitespace-nowrap">
              GENERATE. LEARN. SUCCEED.
            </span>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
        )}
      </div>
    </div>
  );
};
