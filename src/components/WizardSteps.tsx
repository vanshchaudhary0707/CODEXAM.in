import React, { useState, useEffect } from "react";
import { 
  Building2, 
  FileText, 
  Clock, 
  Target, 
  Upload, 
  BookOpen, 
  Layers, 
  Plus, 
  Trash2, 
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { BrandingDetails, PaperSectionCriteria, PaperGenerationConfig } from "../types";
import { CLASS_SUBJECT_CHAPTERS_MAP } from "../data/chaptersData";

// ==================== STEP 1: BRANDING DETAILS ====================
interface Step1Props {
  branding: BrandingDetails;
  onChange: (val: BrandingDetails) => void;
  onNext: () => void;
}

export const BrandingStep: React.FC<Step1Props> = ({ branding, onChange, onNext }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...branding,
      [e.target.name]: e.target.name === "max_marks" ? Number(e.target.value) : e.target.value
    });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      onChange({
        ...branding,
        logo_url: uploadEvent.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const selectPrebuiltLogo = (url: string) => {
    onChange({
      ...branding,
      logo_url: url
    });
  };

  const SAMPLE_LOGOS = [
    { name: "CBSE Emblem", url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/CBSE_Logo.svg/1200px-CBSE_Logo.svg.png" },
    { name: "Academic Shield", url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=120&h=120&q=80" },
    { name: "Kendriya Vidyalaya", url: "https://upload.wikimedia.org/wikipedia/en/2/2c/Kendriya_Vidyalaya_logo.svg" }
  ];

  return (
    <div id="step-branding-container" className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Step 1: Institutional Branding</h2>
        <p className="text-sm text-slate-500">Configure your school name, logo, and exam headers. This will form the printed question paper letterhead.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2" htmlFor="school_name">
              School / Institution Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="school_name_input"
                type="text"
                name="school_name"
                value={branding.school_name}
                onChange={handleTextChange}
                placeholder="e.g., Delhi Public School, Sector 4"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-serif font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2" htmlFor="exam_name">
              Examination / Paper Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="exam_name_input"
                type="text"
                name="exam_name"
                value={branding.exam_name}
                onChange={handleTextChange}
                placeholder="e.g., Pre-Board Examination (Term 2)"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2" htmlFor="time_allowed">
                Time Allowed
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="time_allowed_input"
                  type="text"
                  name="time_allowed"
                  value={branding.time_allowed}
                  onChange={handleTextChange}
                  placeholder="e.g., 3 Hours"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2" htmlFor="max_marks">
                Maximum Marks (Target)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="max_marks_input"
                  type="number"
                  name="max_marks"
                  value={branding.max_marks}
                  onChange={handleTextChange}
                  placeholder="80"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo upload block */}
        <div className="flex flex-col space-y-3">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
            School Logo Mark
          </label>
          <div
            id="logo_drop_zone"
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
              dragActive ? "border-blue-500 bg-blue-50/50" : branding.logo_url ? "border-emerald-200 bg-emerald-50/10" : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => document.getElementById("logo-upload-input")?.click()}
          >
            <input
              id="logo-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            {branding.logo_url ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  id="uploaded_logo_preview"
                  src={branding.logo_url}
                  alt="Branding Logo"
                  className="h-16 w-16 object-contain rounded border bg-white p-1"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs text-emerald-600 font-medium">Logo successfully linked</span>
                <span className="text-[10px] text-slate-400">Click or drag new file to change</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-slate-50 rounded-full">
                  <Upload className="h-5 w-5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">Drag & drop school logo image</span>
                <span className="text-xs text-slate-400">Supports PNG, JPG (Auto crops)</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Prebuilt Quick Presets</span>
            <div className="flex gap-2">
              {SAMPLE_LOGOS.map((logo, i) => (
                <button
                  id={`preset-logo-btn-${i}`}
                  key={i}
                  type="button"
                  onClick={() => selectPrebuiltLogo(logo.url)}
                  className={`px-2 py-1 flex items-center gap-1.5 text-xs border rounded-md transition-all ${
                    branding.logo_url === logo.url ? "border-blue-500 bg-blue-50/50 text-blue-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <img src={logo.url} alt={logo.name} className="h-4 w-4 object-contain rounded-full" referrerPolicy="no-referrer" />
                  <span>{logo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          id="branding-next-btn"
          type="button"
          onClick={onNext}
          disabled={!branding.school_name || !branding.exam_name}
          className="px-5 py-2.5 bg-blue-600 font-medium text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow"
        >
          <span>Continue to Scope</span>
          <BookOpen className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};


// ==================== STEP 2: TARGET SCOPE ====================
interface Step2Props {
  classLevel: string;
  subject: string;
  selectedChapters: string[];
  onChangeClass: (c: string) => void;
  onChangeSubject: (s: string) => void;
  onChangeChapters: (ch: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ScopeStep: React.FC<Step2Props> = ({
  classLevel,
  subject,
  selectedChapters,
  onChangeClass,
  onChangeSubject,
  onChangeChapters,
  onNext,
  onBack
}) => {
  const classesList = Object.keys(CLASS_SUBJECT_CHAPTERS_MAP);
  const subjectsList = classLevel ? Object.keys(CLASS_SUBJECT_CHAPTERS_MAP[classLevel] || {}) : [];
  const chaptersList = (classLevel && subject) ? (CLASS_SUBJECT_CHAPTERS_MAP[classLevel]?.[subject] || []) : [];

  // Handle class level switch
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChangeClass(val);
    const subjs = Object.keys(CLASS_SUBJECT_CHAPTERS_MAP[val] || {});
    if (subjs.length > 0) {
      onChangeSubject(subjs[0]);
      onChangeChapters([]); // Reset chapters selection
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeSubject(e.target.value);
    onChangeChapters([]); // Reset chapters selection
  };

  const toggleChapter = (chap: string) => {
    if (selectedChapters.includes(chap)) {
      onChangeChapters(selectedChapters.filter(c => c !== chap));
    } else {
      onChangeChapters([...selectedChapters, chap]);
    }
  };

  const toggleSelectAllChapters = () => {
    if (selectedChapters.length === chaptersList.length) {
      onChangeChapters([]);
    } else {
      onChangeChapters([...chaptersList]);
    }
  };

  return (
    <div id="step-scope-container" className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Step 2: Syllabus Target & Scope</h2>
        <p className="text-sm text-slate-500">Choose the destination grade, subject, and chapter chapters that should be utilized to extract questions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2" htmlFor="class_level_select">
              CBSE Class / Grade
            </label>
            <select
              id="class_level_select"
              value={classLevel}
              onChange={handleClassChange}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            >
              {classesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2" htmlFor="subject_select">
              Subject
            </label>
            <select
              id="subject_select"
              value={subject}
              onChange={handleSubjectChange}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-800 block">Syllabus Filter Lock</span>
              <p className="text-xs text-blue-700 leading-relaxed">
                The generator extracts CBSE standard sample papers strictly adhering to NCERT chapters. Selecting multiple chapters spreads questions evenly across subjects.
              </p>
            </div>
          </div>
        </div>

        {/* Chapters checklist panel */}
        <div className="border border-slate-200 rounded-xl bg-white flex flex-col h-[280px]">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">NCERT Chapters ({chaptersList.length})</span>
            </div>
            <button
              id="select-all-chapters-btn"
              type="button"
              onClick={toggleSelectAllChapters}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              {selectedChapters.length === chaptersList.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div id="chapters-list-checklist" className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {chaptersList.map((chap) => {
              const isChecked = selectedChapters.includes(chap);
              return (
                <label
                  key={chap}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isChecked ? "border-blue-100 bg-blue-50/20 text-blue-800" : "border-slate-100 text-slate-600 hover:bg-slate-50/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleChapter(chap)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">{chap}</span>
                </label>
              );
            })}
          </div>

          <div className="px-4 py-2.5 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between bg-slate-50/50 rounded-b-xl font-medium">
            <span>Selected {selectedChapters.length} of {chaptersList.length}</span>
            {selectedChapters.length === 0 && <span className="text-rose-500">Pick at least one</span>}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between border-t border-slate-100">
        <button
          id="scope-back-btn"
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-all"
        >
          Back
        </button>
        <button
          id="scope-next-btn"
          type="button"
          onClick={onNext}
          disabled={selectedChapters.length === 0}
          className="px-5 py-2.5 bg-blue-600 font-medium text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow"
        >
          <span>Setup Exam Grid</span>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};


// ==================== STEP 3: SECTION GRID CONFIGURATION ====================
interface Step3Props {
  sections: PaperSectionCriteria[];
  targetMaxMarks: number;
  onChange: (val: PaperSectionCriteria[]) => void;
  onNext: () => void;
  onBack: () => void;
  aiAutoFill: boolean;
  onToggleAiAutoFill: (val: boolean) => void;
}

export const SectionGridStep: React.FC<Step3Props> = ({
  sections,
  targetMaxMarks,
  onChange,
  onNext,
  onBack,
  aiAutoFill,
  onToggleAiAutoFill
}) => {
  // Add direct row
  const addRow = () => {
    const nextCodeChar = String.fromCharCode(65 + sections.length); // e.g., 'A', 'B'
    onChange([
      ...sections,
      { section_name: `SECTION ${nextCodeChar}`, mark_value: 3, count: 5 }
    ]);
  };

  const removeRow = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, key: keyof PaperSectionCriteria, val: any) => {
    const updated = [...sections];
    updated[index] = {
      ...updated[index],
      [key]: key === "section_name" ? val : Number(val)
    };
    onChange(updated);
  };

  // Calculate current total
  const totalConfiguredMarks = sections.reduce((sum, s) => sum + (s.mark_value * s.count), 0);
  const isMarksMatching = totalConfiguredMarks === targetMaxMarks;

  return (
    <div id="step-section-grid-container" className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Step 3: Section Grid Configuration</h2>
          <p className="text-sm text-slate-500">Define the paper sections, question weightage distributions, and target quantities.</p>
        </div>
        <button
          id="add-section-grid-btn"
          type="button"
          onClick={addRow}
          className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 flex items-center gap-1.5 transition-all w-fit cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Grid view containing section parameters */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium block mb-2">No sections defined yet.</span>
            <button
              id="add-first-section-btn"
              type="button"
              onClick={addRow}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Click here to add the first Section (Section A)
            </button>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
            <table className="w-full text-left text-slate-700 min-w-[500px]">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Section Header</th>
                  <th className="px-4 py-3">Marks/Question</th>
                  <th className="px-4 py-3">No. of Questions</th>
                  <th className="px-4 py-3">Total Subsection Marks</th>
                  <th className="px-4 py-3 w-16">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sections.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/35 transition-all">
                    <td className="px-4 py-2">
                      <input
                        id={`sec-name-input-${idx}`}
                        type="text"
                        value={sec.section_name}
                        onChange={(e) => handleRowChange(idx, "section_name", e.target.value)}
                        placeholder="e.g. SECTION A"
                        className="px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-40 font-medium"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        id={`sec-marks-select-${idx}`}
                        value={sec.mark_value}
                        onChange={(e) => handleRowChange(idx, "mark_value", e.target.value)}
                        className="px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-xs w-28 font-mono"
                      >
                        <option value="1">1 Mark (MCQ)</option>
                        <option value="2">2 Marks (Short)</option>
                        <option value="3">3 Marks (Short)</option>
                        <option value="4">4 Marks (Case-Based)</option>
                        <option value="5">5 Marks (Long)</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        id={`sec-count-input-${idx}`}
                        type="number"
                        min="1"
                        max="50"
                        value={sec.count}
                        onChange={(e) => handleRowChange(idx, "count", e.target.value)}
                        className="px-2 py-1 border border-slate-200 rounded focus:outline-none bg-white w-20 font-mono text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-semibold text-slate-700 font-mono text-sm leading-none bg-slate-50 inline-block px-2.5 py-1 rounded">
                        {sec.mark_value * sec.count} Marks
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        id={`sec-delete-btn-${idx}`}
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50/50 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live marks summary indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 border text-xs space-y-3.5 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Exam Blueprint Metrics:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm font-bold">{totalConfiguredMarks}</span>
              <span className="text-slate-400">/</span>
              <span className="font-mono text-xs">{targetMaxMarks} Target</span>
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              style={{ width: `${Math.min((totalConfiguredMarks / targetMaxMarks) * 100, 100)}%` }}
              className={`h-full transition-all ${isMarksMatching ? "bg-emerald-500" : "bg-blue-500"}`}
            />
          </div>

          {!isMarksMatching && (
            <div id="blueprint-mismatch-warning" className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Current configuration total of <strong>{totalConfiguredMarks} Marks</strong> does not equal target of <strong>{targetMaxMarks} Marks</strong>. We suggest adjusting counts or altering Step 1's target value so they match CBSE standards.
              </p>
            </div>
          )}

          {isMarksMatching && (
            <div id="blueprint-match-banner" className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-[11px] font-medium">
                Perfect Alignment! Section totals match the targeted maximum marks of {targetMaxMarks} Marks.
              </p>
            </div>
          )}
        </div>

        {/* AI Assisted setup toggle */}
        <div className="rounded-xl p-4 border flex flex-col justify-between bg-blue-50/20 border-blue-100">
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-blue-800 font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>SaaS AI-Assisted Generation Boost</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              If the CBSE question pool doesn't contain enough matching questions of specified chapters, enabling this will trigger the Gemini API on your server to seamlessly compile and translate original standard questions into LaTeX structures in real-time.
            </p>
          </div>

          <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-blue-100 cursor-pointer w-fit shadow-xs mt-3 text-xs select-none">
            <input
              id="ai_autofill_checkbox"
              type="checkbox"
              checked={aiAutoFill}
              onChange={(e) => onToggleAiAutoFill(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-blue-900">Enable Dynamic AI Fill Tool</span>
          </label>
        </div>
      </div>

      <div className="pt-4 flex justify-between border-t border-slate-100">
        <button
          id="grid-back-btn"
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-all"
        >
          Back
        </button>
        <button
          id="trigger-generation-btn"
          type="button"
          onClick={onNext}
          disabled={sections.length === 0}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-all shadow flex items-center gap-2"
        >
          <span>Generate CBSE Exam Paper</span>
          <Sparkles className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};


// ==================== STEP 4: GENERATION LOADING SCREEN ====================
interface Step4Props {
  error: string | null;
  onReset: () => void;
  onRetryWithAi: () => void;
  aiAutoFill: boolean;
}

export const GenerationProgress: React.FC<Step4Props> = ({ error, onReset, onRetryWithAi, aiAutoFill }) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const PROGRESS_MESSAGES = [
    "Locking academic subject parameters...",
    "Injecting institutional branding credentials...",
    "Parsing NCERT CBSE Syllabus requirements...",
    "Structuring Section groupings and marks values...",
    "Analyzing cognitive levels (Understanding, Analyzing)...",
    "Running randomizing non-repeating filters...",
    "Formatting LaTeX mathematical blocks...",
    "Compiling scoring logic and step-by-step answers..."
  ];

  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [error]);

  if (error) {
    return (
      <div id="generation-error-container" className="py-8 text-center space-y-5 max-w-xl mx-auto">
        <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border border-rose-200 shadow-sm animate-bounce">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-800">Syllabus Insufficient Data</h3>
          <p className="text-xs text-rose-700 bg-rose-50 border border-rose-100 p-4 rounded-xl leading-relaxed font-mono text-left">
            {error}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <button
            id="error-adjust-btn"
            type="button"
            onClick={onReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            Adjust Criteria or Chapter Pool
          </button>
          {!aiAutoFill && (
            <button
              id="error-retry-ai-btn"
              type="button"
              onClick={onRetryWithAi}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Retry with Generative AI Fill</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="generation-loading-container" className="py-12 flex flex-col items-center justify-center space-y-6 text-center max-w-sm mx-auto">
      <div className="relative flex items-center justify-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <Sparkles className="h-6 w-6 text-indigo-500 absolute animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="text-md font-semibold text-slate-800 tracking-tight animate-pulse">Assembling Exam Paper...</h3>
        <p className="text-xs text-indigo-600 font-medium h-4 transition-all">
          {PROGRESS_MESSAGES[activeMessageIndex]}
        </p>
        <p className="text-[10px] text-slate-400">
          This checks the question limits and maps the database constraints. Usually completes in 1-4 seconds.
        </p>
      </div>
    </div>
  );
};
