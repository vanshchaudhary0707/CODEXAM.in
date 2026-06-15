import React, { useState } from "react";
import { 
  Building, 
  Check, 
  Save, 
  ShieldCheck,
  User,
  Calendar,
  ChevronRight
} from "lucide-react";
import { BrandingDetails } from "../types";

interface InstitutionSettingsViewProps {
  branding: BrandingDetails;
  onUpdateBranding: (updated: BrandingDetails) => void;
  academicYear: string;
  onUpdateAcademicYear: (yr: string) => void;
}

export const InstitutionSettingsView: React.FC<InstitutionSettingsViewProps> = ({
  branding,
  onUpdateBranding,
  academicYear,
  onUpdateAcademicYear
}) => {
  const [schoolName, setSchoolName] = useState(branding.school_name);
  const [examName, setExamName] = useState(branding.exam_name);
  const [timeAllowed, setTimeAllowed] = useState(branding.time_allowed);
  const [maxMarks, setMaxMarks] = useState(branding.max_marks);
  const [logoUrl, setLogoUrl] = useState(branding.logo_url);
  const [tempYear, setTempYear] = useState(academicYear);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Ready presets for simplified academic switching
  const schoolPresets = [
    {
      name: "Modern Secondary Academy Hub",
      logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80",
      exam: "Term Evaluation Scheme"
    },
    {
      name: "Apex College of Humanities & Sciences",
      logo: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=100&auto=format&fit=crop&q=80",
      exam: "Summative Performance Trial"
    },
    {
      name: "Independent Educators Coalition",
      logo: "",
      exam: "Syllabus Diagnostic Test"
    }
  ];

  const handleApplyPreset = (preset: typeof schoolPresets[0]) => {
    setSchoolName(preset.name);
    setLogoUrl(preset.logo);
    setExamName(preset.exam);
  };

  const handleSaveSettings = () => {
    onUpdateBranding({
      school_name: schoolName,
      exam_name: examName,
      time_allowed: timeAllowed,
      max_marks: Number(maxMarks) || 80,
      logo_url: logoUrl
    });
    onUpdateAcademicYear(tempYear);
    setShowSaveAlert(true);
    setTimeout(() => {
      setShowSaveAlert(false);
    }, 4000);
  };

  return (
    <div id="settings-viewport-container" className="space-y-6 max-w-4xl mx-auto select-none font-sans">
      
      {/* Settings Summary block */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-md font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-1 leading-none">
          <Building className="h-5 w-5 text-amber-500" />
          <span>Identity & Formatting Metrics Settings</span>
        </h2>
        <p className="text-xs text-slate-500">Configure standard metadata labels and branding values to represent your institution across all generated hardcopies.</p>

        {showSaveAlert && (
          <div className="mt-4 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Success! Local CODEXAM settings and branding templates updated correctly.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Main settings form block */}
          <div className="space-y-4">
            
            {/* School Name input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">School/College/Educator Name Label</label>
              <input
                id="settings-school-name"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-250 p-2.5 rounded-lg focus:bg-white focus:outline-none transition-all mt-1"
                placeholder="Enter formal branding banner..."
              />
            </div>

            {/* Exam Banner tag */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Default Exam Title Scheme</label>
              <input
                id="settings-exam-name"
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-250 p-2.5 rounded-lg focus:bg-white focus:outline-none transition-all mt-1"
                placeholder="e.g. Summative Term Assessment"
              />
            </div>

            {/* Logo Image selection locked with explanation */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Institutional Mascot Emblem</label>
              <div className="w-full text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-500 font-medium select-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Locked to CODEXAM High-Fidelity Golden Vector Standard</span>
              </div>
            </div>

            {/* Micro layouts: Year / Marks / Duration */}
            <div className="grid grid-cols-3 gap-3.5 pt-1">
              
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 block">Academic Cycle</label>
                <select
                  id="settings-cycle"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-350 p-2 rounded-lg"
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 block">Max Marks Preset</label>
                <input
                  id="settings-marks"
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-350 p-1.5 rounded-lg text-center"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 block">Time Duration</label>
                <input
                  id="settings-duration"
                  type="text"
                  value={timeAllowed}
                  onChange={(e) => setTimeAllowed(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-350 p-1.5 rounded-lg text-center"
                />
              </div>

            </div>

            {/* CTA SAVE ACTION DIRECTORY */}
            <div className="pt-4">
              <button
                id="settings-save-master-btn"
                onClick={handleSaveSettings}
                className="px-5 py-3 bg-slate-900 border border-slate-800 text-amber-400 hover:text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-800 flex items-center justify-center gap-2 transition-all shadow-md mt-2 w-full font-sans"
              >
                <span>Save Administrative Settings</span>
              </button>
            </div>

          </div>

          {/* Preset options and explanations */}
          <div className="space-y-5 border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-6">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Select from verified presets</span>
            
            <div className="space-y-3.5">
              {schoolPresets.map((preset) => (
                <div 
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className="bg-slate-50 hover:bg-slate-100 hover:border-amber-400 border border-slate-200 p-3.5 rounded-xl cursor-pointer transition-all select-none flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{preset.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{preset.exam}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-[11px] text-slate-600 leading-normal flex gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block uppercase text-[10px]">Proper Cryptographic Seals</span>
                <p className="mt-0.5">Once locked inside the typesetting dashboard, actual correct solution sheets are isolated dynamically under AES shift-scrambling keys mapped specifically to your codename pin.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
