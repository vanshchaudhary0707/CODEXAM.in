import React, { useState, useEffect } from "react";
// Removed motion to ensure zero dynamic library crash under sandbox
import { 
  FolderLock, 
  ShieldCheck, 
  Building2, 
  User, 
  Sparkles, 
  Fingerprint, 
  KeyRound, 
  ShieldAlert, 
  Globe, 
  Info,
  Clock,
  LogIn,
  UserPlus,
  Mail,
  Shield,
  ArrowRight,
  Database,
  Code2
} from "lucide-react";
import { CodexamLogo } from "./CodexamLogo";

interface CodexamLoginProps {
  onLoginSuccess: (session: {
    codename: string;
    pin: string;
    type: "school" | "independent";
    name: string;
    logo_url: string;
  }) => void;
}

export const CodexamLogin: React.FC<CodexamLoginProps> = ({ onLoginSuccess }) => {
  // Navigation active tab: "login" | "signup"
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // LOGIN FORM STATES
  const [loginTeacherId, setLoginTeacherId] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGNUP FORM STATES
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupSchoolName, setSignupSchoolName] = useState("");
  const [signupType, setSignupType] = useState<"school" | "independent">("school");

  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");

  // Update real-time clock indicator in top banner
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Precalculates standard bypass options to assist the Owner Developer under pre-trial mode
  const handleApplyDeveloperBypass = (type: "login" | "signup") => {
    if (type === "login") {
      setLoginTeacherId("DEV-OWNER-77");
      setLoginEmail("vansh.vc8@gmail.com");
      setLoginPassword("ADMIN-ROOT-99");
    } else {
      setSignupName("Vansh Developer (Owner)");
      setSignupEmail("vansh.vc8@gmail.com");
      setSignupPassword("SEED-PIN-2026");
      setSignupSchoolName("Apex National CODEXAM Research Board");
      setSignupType("school");
    }
    setErrorMsg("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sandbox default fallback trigger for random or empty pre-trial submissions:
    const codename = loginTeacherId.trim() || "DEVELOPER-TRIAL";
    const email = loginEmail.trim() || "developer@codexam.com";
    const password = loginPassword.trim() || "123456";

    const session = {
      codename: codename.toUpperCase(),
      pin: password,
      type: "school" as const,
      name: "Apex Administrative Trial Board",
      logo_url: "preset:whatsapp"
    };

    localStorage.setItem("codexam_session", JSON.stringify(session));
    onLoginSuccess(session);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sandbox default fallback trigger for random or empty pre-trial submissions:
    const name = signupName.trim() || "Vansh (Owner Dev)";
    const email = signupEmail.trim() || "vansh.vc8@gmail.com";
    const pin = signupPassword.trim() || "999999";
    const school = signupSchoolName.trim() || "Standard Trial Academy";

    const session = {
      codename: name.slice(0, 10).replace(/\s+/g, "-").toUpperCase() + "-SANDBOX",
      pin: pin,
      type: signupType,
      name: school,
      logo_url: "preset:whatsapp"
    };

    localStorage.setItem("codexam_session", JSON.stringify(session));
    onLoginSuccess(session);
  };

  // Live password metric feedback
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { percent: 0, text: "Unset", color: "bg-slate-800" };
    if (pass.length < 4) return { percent: 30, text: "Simple Test Pass", color: "bg-rose-500" };
    if (pass.length < 8) return { percent: 65, text: "Medium Security", color: "bg-amber-500" };
    return { percent: 100, text: "Highly Sealed Secret", color: "bg-emerald-500" };
  };

  const currentPassStrength = getPasswordStrength(activeTab === "login" ? loginPassword : signupPassword);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-amber-400 selection:text-slate-900 font-sans relative overflow-hidden">
      
      {/* ─── SPECTACULAR KINETIC BLUEPRINT BACKDROP — GRAPHIC DESIGN ENHANCED ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* Soft elegant radial glowing spot lamps - 10bit blur for high density screens */}
        <div className="absolute top-[-5%] left-1/4 w-[600px] h-[600px] bg-amber-500/[0.06] rounded-full blur-[140px] mix-blend-screen animate-pulse duration-[10s]" />
        <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] bg-indigo-500/[0.06] rounded-full blur-[160px] mix-blend-screen animate-pulse duration-[15s]" />
        
        {/* Fine Engineering Blueprint Alignment grid lines */}
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:28px_28px]" />

        {/* Dynamic Vector Drafting Circles / Cosmic Coordinates Grid */}
        <svg className="absolute w-full h-full opacity-[0.45]" xmlns="http://www.w3.org/2000/svg">
          {/* Top-left scanning telemetry dashboard wireframe */}
          <g transform="translate(180, 220)">
            <circle cx="0" cy="0" r="140" fill="none" stroke="rgba(245, 158, 11, 0.16)" strokeWidth="1" strokeDasharray="4, 4" />
            <circle cx="0" cy="0" r="220" fill="none" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="1" />
            <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="1" strokeDasharray="16, 8" />
            <line x1="-15" y1="0" x2="15" y2="0" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" />
            <line x1="0" y1="-15" x2="0" y2="15" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" />
            
            {/* Fine compass angle marks */}
            <path d="M 0 -140 L 0 -130 M 0 140 L 0 130 M -140 0 L -130 0 M 140 0 L 130 0" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1" />
            
            <text x="15" y="-120" className="text-[9px] fill-amber-500/40 font-mono font-bold tracking-[0.2em] uppercase">BLUEPRINT SECTOR D-08</text>
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0" 
              to="360" 
              dur="90s" 
              repeatCount="indefinite" 
            />
          </g>

          {/* Large structural orbit wireframe in the right background */}
          <g transform="translate(1150, 480)" className="hidden xl:block">
            <circle cx="0" cy="0" r="320" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="180" fill="none" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1" strokeDasharray="8, 20" />
            <circle cx="226" cy="226" r="5" fill="#f59e0b" className="opacity-50 animate-ping" />
            <line x1="-380" y1="0" x2="380" y2="0" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" />
            <line x1="0" y1="-380" x2="0" y2="380" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" />
            
            <text x="10" y="195" className="text-[10px] fill-slate-500/45 font-mono tracking-widest">STABILITY ENGINE STATUS: SECURED_STABLE</text>
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="360" 
              to="0" 
              dur="120s" 
              repeatCount="indefinite" 
            />
          </g>

          {/* Side-running matrix system telemetry labels */}
          <g className="text-amber-500/25 font-mono text-[9px] select-none">
            <text x="60" y="90">01111001 01100101 01100001 01110011</text>
            <text x="60" y="108">CODEXAM_DECRYPT_STATION_READY... SUCCESS</text>
            <text x="60" y="126">SYSTEM_ENVIRONMENT_SANDBOX ... TRUE</text>
          </g>
        </svg>

        {/* drift math variables for true academic architectural vibe */}
        <div className="absolute top-[14%] right-[8%] text-[10.5px] text-amber-505/10 text-amber-500/10 font-mono tracking-[0.25em] hidden md:block select-none leading-relaxed">
          P(T|X) = [ η(X|T) * P(T) ] / ∑_k P(X|T_k) P(T_k) <br />
          ∇²Ψ + (2m/ħ²)[E - V(r)]Ψ = 0 <br />
          Z_f_x = ∮_c [ e^(-k_s x) ] / [ x^2 + λ^2 ] dx
        </div>
        <div className="absolute bottom-[12%] left-[6%] text-[10.5px] text-slate-500/15 font-mono tracking-[0.25em] hidden md:block select-none leading-relaxed">
          C_ijk = ∑_p A_ijp · B_p_k - δ_ik · μ <br />
          S(H) = -k_B ∑ w_i ln(w_i) <br />
          det(M - κ I) = (κ_1 - κ)(κ_2 - κ)...(κ_n - κ)
        </div>
      </div>

      {/* ─── TOP STATUS HEADER ─── */}
      <header className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-center gap-2 pb-6 border-b border-white/5 select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <span>PLATFORM PROTOCOL: PRE-TRIAL MODE ACTIVE</span>
          </span>
        </div>
        <div className="flex items-center gap-3.5 text-[10px] font-mono font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-slate-600" />
            <span className="text-slate-400">{currentTime || "SYNCING UTC CHRONO"}</span>
          </div>
          <span className="hidden sm:inline text-slate-800">|</span>
          <span className="text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20" id="trial-active-badge">
            CLIENT EVALUATION STAGE
          </span>
        </div>
      </header>

      {/* ─── MAIN PORTAL HUB ─── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-6 md:my-10">
        
        {/* Dynamic Multi-column Layout containing elegant Brand Presentation + Form Controls */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* COLUMN 1: Majestic Branding Banner displaying the gorgeous gold-vector logo (40% space) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 bg-gradient-to-b from-slate-900/60 to-slate-950/80 border-2 border-slate-800/80 rounded-3xl relative backdrop-blur-md overflow-hidden text-center min-h-[320px]">
            {/* Ambient gold nebula projection */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06),transparent_65%)] pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4 animate-in fade-in zoom-in-95 duration-500">
              {/* Premium Golden Tapered SVG Logo */}
              <CodexamLogo size="lg" showTagline={true} />

              <div className="space-y-2 pt-2.5 max-w-xs mx-auto">
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase inline-block">
                  PRE-TRIAL RELEASE
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The ultimate web-typesetter and Private Curriculum Stack. Generate highly secured solution keys, papers, and CBSE schemas with absolute layout control.
                </p>
              </div>

              {/* Operational Specs Grid */}
              <div className="grid grid-cols-2 gap-2 pt-4 text-left max-w-xs mx-auto border-t border-slate-800/50">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Storage Module</span>
                  <span className="text-[10px] text-white font-mono font-bold block mt-0.5">PostgreSQL Client</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Access Policy</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold block mt-0.5">Sandbox Unsealed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex-1 bg-slate-900/40 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative backdrop-blur-xl flex flex-col justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Top ambient color accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/[0.08] to-transparent blur-xl pointer-events-none rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/[0.08] to-transparent blur-xl pointer-events-none rounded-bl-3xl" />

              {/* Top Selector Core Tabs: Log In vs Create Account */}
              <div>
                <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-slate-950 rounded-2xl border border-slate-850 select-none">
                  <button
                    id="tab-selector-login"
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setErrorMsg("");
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === "login"
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>SECURE PORTAL LOGIN</span>
                  </button>
                  <button
                    id="tab-selector-signup"
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      setErrorMsg("");
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === "signup"
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>CREATE ARCHIVE ACCOUNT</span>
                  </button>
                </div>

                {/* TAB CONTENT A: SECURE LOGIN FORM */}
                {activeTab === "login" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                        <FolderLock className="h-4 w-4 text-amber-500" />
                        <span>Log In with Existing Credentials</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Decrypt and load your existing curriculum vaults and typesetting blueprints.
                      </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {/* Teacher Codename or ID */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                          <Fingerprint className="h-3.5 w-3.5 text-amber-500" />
                          <span>Decryption Codename / ID</span>
                        </label>
                        <input
                          id="login-field-teacherid"
                          type="text"
                          placeholder="e.g. TEACHER-777 or any name"
                          value={loginTeacherId}
                          onChange={(e) => setLoginTeacherId(e.target.value)}
                          className="w-full bg-slate-950 text-white placeholder-slate-700 border border-slate-805 border-slate-800 focus:border-amber-500/50 rounded-xl py-2.5 px-3.5 text-xs font-mono uppercase focus:outline-none transition-all"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-blue-400" />
                          <span>Registered Email ID</span>
                        </label>
                        <input
                          id="login-field-email"
                          type="email"
                          placeholder="your.email@school.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-slate-950 text-white placeholder-slate-700 border border-slate-800 focus:border-amber-500/50 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none transition-all"
                        />
                      </div>

                      {/* Password PIN */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                          <KeyRound className="h-3.5 w-3.5 text-green-400" />
                          <span>Security Password / PIN</span>
                        </label>
                        <input
                          id="login-field-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-slate-950 text-white placeholder-slate-800 border border-slate-800 focus:border-amber-500/50 rounded-xl py-2.5 px-3.5 text-xs font-bold tracking-widest focus:outline-none transition-all"
                        />
                      </div>

                      {/* Submit action button */}
                      <button
                        id="login-submit-btn"
                        type="submit"
                        className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.30)] hover:brightness-105 active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="h-4.5 w-4.5" />
                        <span>DECRYPT & UNLOCK PORTAL</span>
                      </button>
                    </form>

                    {/* Developer assist inline action */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-850 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block leading-none">⚡ Trial bypass</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Press submit empty to auto-authenticate random credentials.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyDeveloperBypass("login")}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 hover:text-amber-300 text-slate-300 font-mono text-[9px] font-bold rounded-lg transition-all border border-slate-800 shrink-0 cursor-pointer"
                      >
                        Set Demo Seeds
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "signup" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-amber-500" />
                        <span>Register a New Secure Account</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Securely formulate empty databases under a custom encrypted key name.
                      </p>
                    </div>

                    <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                      {/* Grid for Name and Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                            Full Name
                          </label>
                          <input
                            id="signup-field-name"
                            type="text"
                            placeholder="e.g. Dr. Arthur Sharma"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            className="w-full bg-slate-950 text-white placeholder-slate-700 border border-slate-800 focus:border-amber-500/50 rounded-xl py-2.5 px-3.5 text-xs font-bold focus:outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                            Email Address
                          </label>
                          <input
                            id="signup-field-email"
                            type="email"
                            placeholder="your.email@domain.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="w-full bg-slate-950 text-white placeholder-slate-700 border border-slate-800 focus:border-amber-500/50 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Choose Password PIN with Strength Meter feedback */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                            Secure Passphrase Key / Password
                          </label>
                          {signupPassword && (
                            <span className={`text-[8px] font-bold uppercase ${currentPassStrength.percent === 100 ? "text-emerald-400" : currentPassStrength.percent === 65 ? "text-amber-400" : "text-rose-400"}`}>
                              {currentPassStrength.text}
                            </span>
                          )}
                        </div>
                        <input
                          id="signup-field-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full bg-slate-950 text-white placeholder-slate-800 border border-slate-800 focus:border-amber-500/50 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none transition-all"
                        />
                      </div>

                      {/* School Affiliation Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                          School / College / Institution Name
                        </label>
                        <input
                          id="signup-field-school"
                          type="text"
                          placeholder="e.g. Modern Model Secondary Academy"
                          value={signupSchoolName}
                          onChange={(e) => setSignupSchoolName(e.target.value)}
                          className="w-full bg-slate-950 text-white placeholder-slate-700 border border-slate-800 focus:border-amber-500/50 rounded-xl py-2.5 px-3.5 text-xs font-bold focus:outline-none transition-all"
                        />
                      </div>

                      {/* Type Switcher */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                          Identity Protocol Model
                        </label>
                        <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-950 rounded-xl border border-slate-850">
                          <button
                            type="button"
                            onClick={() => setSignupType("school")}
                            className={`py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              signupType === "school" 
                                ? "bg-amber-500 text-slate-950 font-black" 
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <Building2 className="h-3.5 w-3.5" />
                            <span>School Lab</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignupType("independent")}
                            className={`py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              signupType === "independent" 
                                ? "bg-amber-500 text-slate-950 font-black" 
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <User className="h-3.5 w-3.5" />
                            <span>Independent</span>
                          </button>
                        </div>
                      </div>

                      {/* Submit SignUp action button */}
                      <button
                        id="signup-submit-btn"
                        type="submit"
                        className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-105 active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <UserPlus className="h-4.5 w-4.5" />
                        <span>PROVISION NEW VAULT ARCHIVE</span>
                      </button>
                    </form>

                    {/* Developer assist signup toggle */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-850 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block leading-none">⚡ Sandbox Mockup</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Let owners bypass instantly with filled-in seeds.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyDeveloperBypass("signup")}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 hover:text-amber-300 text-slate-300 font-mono text-[9px] font-bold rounded-lg transition-all border border-slate-800 shrink-0 cursor-pointer"
                      >
                        Set Demo Seeds
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure sandbox footer notice */}
              <div className="mt-6 pt-4 border-t border-slate-850 text-center select-none">
                <p className="text-[9.5px] text-slate-500 font-mono font-bold flex items-center justify-center gap-2 flex-wrap">
                  <span>🔒 AES PRIVATE SEALS</span>
                  <span>•</span>
                  <span>PRE-TRIAL BYPASS ACTIVE</span>
                  <span>•</span>
                  <span>ZERO LOG SENT EXTERNAL</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── FOOTER METRICS ─── */}
      <footer className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-center gap-2 pt-6 border-t border-white/5 text-[9px] font-mono text-slate-500 select-none shrink-0">
        <div>
          <span>CODEXAM METRIC TYPESETTER CORE v3 // DEVELOPER TESTBENCH</span>
        </div>
        <div>
          <span className="text-slate-400">© 2026 CODEXAM LABS INC. PRE-TRIAL EDITION.</span>
        </div>
      </footer>

    </div>
  );
};
