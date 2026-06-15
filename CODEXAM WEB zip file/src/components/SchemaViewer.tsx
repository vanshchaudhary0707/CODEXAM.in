import React, { useState, useEffect } from "react";
import { 
  Database, 
  Copy, 
  Check, 
  Plus, 
  RefreshCw, 
  Search, 
  FileCode, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  FileText
} from "lucide-react";
import { Question } from "../types";

export const SchemaViewer: React.FC = () => {
  const [copying, setCopying] = useState(false);
  const [activeTab, setActiveTab] = useState<"ddl" | "questions" | "add-question" | "queries" | "pdf-extractor">("ddl");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchText, setSearchText] = useState("");
  const [stats, setStats] = useState<any>({ totalQuestions: 0 });
  const [loading, setLoading] = useState(false);

  // PDF Extractor states
  const [rawTextForExtraction, setRawTextForExtraction] = useState<string>(
    "Q1. Find the roots of the quadratic equation 2x^2 - 5x + 3 = 0 using factorization.\n\n" +
    "Q2. Prove that sin theta + cos theta has a maximum value of square root of 2.\n\n" +
    "Q3) Derive an equation for the electric field intensity at any point of an electric dipole dipole moment p.\n\n" +
    "4. Highlight three major challenges faced by small enterprisers trying to align operations with legal regulatory statutes."
  );
  const [extractedRegExMatches, setExtractedRegExMatches] = useState<Array<{ suggested_number: string; question_text: string }>>([
    { suggested_number: "1", question_text: "Find the roots of the quadratic equation 2x^2 - 5x + 3 = 0 using factorization." },
    { suggested_number: "2", question_text: "Prove that sin theta + cos theta has a maximum value of square root of 2." },
    { suggested_number: "3", question_text: "Derive an equation for the electric field intensity at any point of an electric dipole dipole moment p." },
    { suggested_number: "4", question_text: "Highlight three major challenges faced by small enterprisers trying to align operations with legal regulatory statutes." }
  ]);

  // Form states to insert question
  const [class_level, setClass] = useState("Class 12");
  const [subject, setSubject] = useState("Business Studies");
  const [chapter_name, setChapter] = useState("Principles of Management");
  const [topic_name, setTopic] = useState("Centralization");
  const [mark_value, setMarks] = useState(3);
  const [question_type, setType] = useState<"MCQ" | "Short" | "Long" | "Case-Based">("Short");
  const [cognitive_level, setCognitive] = useState<"Remembering" | "Understanding" | "Applying" | "Analyzing">("Understanding");
  const [question_text_latex, setQuestionText] = useState("");
  const [marking_scheme_text_latex, setMarkingText] = useState("");
  const [is_pyq, setIsPyq] = useState(true);
  const [pyqYear, setPyqYear] = useState(2025);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExtractQuestions = () => {
    // Regex matching Q1., Q2), 1. patterns structurally
    const questionPattern = /(?:^|\n)(?:Q)?(\d+)[\.\)]\s*(.+?)(?=(?:^|\n)(?:Q)?\d+[\.\)]|$)/gs;
    let matches;
    const results: Array<{ suggested_number: string; question_text: string }> = [];
    
    // reset regex lastIndex
    questionPattern.lastIndex = 0;
    while ((matches = questionPattern.exec(rawTextForExtraction)) !== null) {
      results.push({
        suggested_number: matches[1],
        question_text: matches[2].trim()
      });
    }
    setExtractedRegExMatches(results);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);

      const statsRes = await fetch("/api/db-status");
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const ddlSqlCode = `-- 
-- CBSE Question Paper Generator SaaS Platform
-- PostgreSQL DDL Schema (Supabase/PostgreSQL Compatible)
--

-- 1. INSTITUTIONS TABLE (For custom branding)
CREATE TABLE institutions (
    institution_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TEACHERS / USERS TABLE
CREATE TABLE teachers (
    teacher_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    institution_id INT REFERENCES institutions(institution_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. WORKSPACES TABLE (Personal sections for teachers to save questions)
CREATE TABLE workspaces (
    workspace_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    name VARCHAR(100) DEFAULT 'My Saved Questions',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MASTER QUESTIONS BANK
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,      -- e.g., 'Business Studies', 'Physics'
    class_level VARCHAR(50) NOT NULL,    -- e.g., 'Class 12', 'Class 11'
    topic VARCHAR(150) NOT NULL,        -- e.g., 'Principles of Management'
    marks INT NOT NULL CHECK (marks BETWEEN 1 AND 6), -- Enforces 1, 2, 3, 4, 5, 6 marks
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('MCQ', 'Subjective')),
    question_text TEXT NOT NULL,
    
    -- MCQ Specific Fields (Nullable if it's a subjective 5/6 marker)
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_option CHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. WORKSPACE_QUESTIONS (Mapping table linking questions to a teacher's workspace)
CREATE TABLE workspace_questions (
    workspace_id INT REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, question_id)
);

-- 6. TEMPORARY STAGING TABLE (For reviewing extracted PDF questions before final save)
CREATE TABLE bulk_uploads (
    upload_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    class_level VARCHAR(50) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    extracted_text TEXT NOT NULL,
    marks INT CHECK (marks BETWEEN 1 AND 6),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. QUESTION PAPERS TABLE (The metadata for a single test paper)
CREATE TABLE question_papers (
    paper_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    institution_id INT REFERENCES institutions(institution_id),
    title VARCHAR(255) NOT NULL, -- e.g., "Class 12 Mid-Term Physics"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. PAPER_QUESTIONS (The ordering mechanism that builds the paper column question-wise)
CREATE TABLE paper_questions (
    paper_id INT REFERENCES question_papers(paper_id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
    sort_order INT NOT NULL, -- Determines the physical position (Question 1, Question 2...)
    assigned_marks INT NOT NULL, -- Explicit marks assigned for this specific test
    PRIMARY KEY (paper_id, question_id)
);

-- --- INDEXES FOR HIGHER-PERFORMANCE CONSTRAINTS ---
CREATE INDEX IF NOT EXISTS idx_questions_selection 
ON questions (class_level, subject, topic, marks);

CREATE INDEX IF NOT EXISTS idx_workspaces_teacher_id 
ON workspaces (teacher_id);`;

  const copyDdlToClipboard = () => {
    navigator.clipboard.writeText(ddlSqlCode);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleCreateQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    const payload = {
      class_level,
      subject,
      chapter_name,
      topic_name,
      mark_value,
      question_type,
      question_text_latex,
      marking_scheme_text_latex,
      cognitive_level,
      is_pyq,
      pyq_metadata: is_pyq ? { year: pyqYear, board: "CBSE Board Exam" } : null
    };

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Question successfully inserted and index cached! DB now contains ${questions.length + 1} queries.`);
        // Reset inputs
        setQuestionText("");
        setMarkingText("");
        // Reload questions list
        fetchQuestions();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.question_text_latex.toLowerCase().includes(searchText.toLowerCase()) ||
    q.chapter_name.toLowerCase().includes(searchText.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div id="schema-viewer-panel" className="bg-white border text-xs border-slate-200 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 leading-none">
            <span>SaaS Architecture & DB Administration</span>
            <Database className="h-4.5 w-4.5 text-blue-600" />
          </h2>
          <p className="text-xs text-slate-500">Inspect the production PostgreSQL DDL schema, explore the cached question registry, and insert manual entities.</p>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex border rounded-lg overflow-hidden select-none bg-slate-50 border-slate-200">
          <button
            id="tab-ddl-btn"
            onClick={() => setActiveTab("ddl")}
            className={`px-3 py-1.5 font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === "ddl" ? "bg-white text-blue-700 shadow-sm" : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>PostgreSQL DDL</span>
          </button>
          <button
            id="tab-questions-btn"
            onClick={() => setActiveTab("questions")}
            className={`px-3 py-1.5 font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === "questions" ? "bg-white text-blue-700 shadow-sm" : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Questions Pool ({stats?.totalQuestions || 0})</span>
          </button>
          <button
            id="tab-add-btn"
            onClick={() => setActiveTab("add-question")}
            className={`px-3 py-1.5 font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer border-r border-slate-200 ${
              activeTab === "add-question" ? "bg-white text-blue-700 shadow-sm" : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
          <button
            id="tab-queries-btn"
            onClick={() => setActiveTab("queries")}
            className={`px-3 py-1.5 font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer border-r border-slate-200 ${
              activeTab === "queries" ? "bg-white text-blue-700 shadow-sm" : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
            <span>Operational Queries</span>
          </button>
          <button
            id="tab-pdf-extractor-btn"
            onClick={() => setActiveTab("pdf-extractor")}
            className={`px-3 py-1.5 font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === "pdf-extractor" ? "bg-white text-blue-700 shadow-sm" : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-indigo-500" />
            <span>PDF Extractor Pipeline</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}

      {/* TAB 1: DDL SCHEMA EXPOSITOR */}
      {activeTab === "ddl" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 text-xs">Supabase & PostgreSQL Compliant Directives:</span>
            <button
              id="copy-ddl-btn"
              type="button"
              onClick={copyDdlToClipboard}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-700 font-semibold rounded-md flex items-center gap-1 cursor-pointer"
            >
              {copying ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copying ? "Copied" : "Copy SQL Code"}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl p-4 overflow-x-auto text-[11px] font-mono leading-relaxed max-h-[300px] select-all">
              {ddlSqlCode}
            </pre>
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-mono italic">PostgreSQL DDL schema (with cascading, constraints & indices)</div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED QUESTIONS VIEW */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="search-questions-input"
                type="text"
                placeholder="Search statements, chapters, or grades..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <button
              id="refresh-db-btn"
              onClick={fetchQuestions}
              disabled={loading}
              className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Refresh local registry cache"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-500" : ""}`} />
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white max-h-[340px]">
            <table className="w-full text-left text-slate-700 min-w-[700px]">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100 select-none sticky top-0">
                <tr>
                  <th className="px-4 py-2.5 w-24">Grade</th>
                  <th className="px-4 py-2.5 w-32">Subject</th>
                  <th className="px-4 py-2.5">NCERT Chapter</th>
                  <th className="px-4 py-2.5 w-20 text-center">Marks</th>
                  <th className="px-4 py-2.5 w-32">Cognitive Level</th>
                  <th className="px-4 py-2.5">Question Text Snippet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/40 transition-all">
                    <td className="px-4 py-2">
                      <span className="font-semibold">{q.class_level}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-slate-500 font-medium">{q.subject}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-slate-700 font-semibold truncate max-w-[160px] inline-block">{q.chapter_name}</span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="bg-slate-105 inline-block px-1.5 py-0.5 rounded font-bold font-mono text-slate-600">{q.mark_value}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[10px]">{q.cognitive_level}</span>
                    </td>
                    <td className="px-4 py-2">
                      <p className="text-slate-500 truncate max-w-sm" title={q.question_text_latex}>{q.question_text_latex}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL CUSTOM QUESTIONS ENUMERATOR INSERTION */}
      {activeTab === "add-question" && (
        <form onSubmit={handleCreateQuestionSubmit} className="space-y-4">
          {successMsg && (
            <div id="add-success-banner" className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <p className="font-semibold">{successMsg}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_class_select">Grade</label>
              <select
                id="insert_class_select"
                value={class_level}
                onChange={(e) => setClass(e.target.value)}
                className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs"
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_subject_select">Subject</label>
              <select
                id="insert_subject_select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs"
              >
                <option value="Business Studies">Business Studies</option>
                <option value="Physics">Physics</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_marks_input">Marks per Question</label>
              <input
                id="insert_marks_input"
                type="number"
                min="1"
                max="10"
                value={mark_value}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs font-mono text-center"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_type_select">Type</label>
              <select
                id="insert_type_select"
                value={question_type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs"
              >
                <option value="MCQ">MCQ</option>
                <option value="Short">Short Answer</option>
                <option value="Long">Long Answer</option>
                <option value="Case-Based">Case Based</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_chapter_input">Chapter Name</label>
              <input
                id="insert_chapter_input"
                type="text"
                value={chapter_name}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Principles of Management"
                className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_cognitive_select">Cognitive Type</label>
              <select
                id="insert_cognitive_select"
                value={cognitive_level}
                onChange={(e) => setCognitive(e.target.value as any)}
                className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs"
              >
                <option value="Remembering">Remembering</option>
                <option value="Understanding">Understanding</option>
                <option value="Applying">Applying</option>
                <option value="Analyzing">Analyzing</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_question_text">Question statement (Markdown & LaTeX math syntax enabled)</label>
              <textarea
                id="insert_question_text"
                rows={3}
                required
                value={question_text_latex}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Write the CBSE exam prompt here. Enclose math formulas inside matching single $ or double $$ signs like $x^2 + y = r$."
                className="w-full border border-slate-200 rounded p-2.5 bg-white text-xs font-serif"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" htmlFor="insert_marking_text">Marking / Step Evaluation Scheme</label>
              <textarea
                id="insert_marking_text"
                rows={3}
                required
                value={marking_scheme_text_latex}
                onChange={(e) => setMarkingText(e.target.value)}
                placeholder="Detail the complete marks breakdown (e.g. 1 Mark for equation, 2 Marks for calculation)."
                className="w-full border border-slate-200 rounded p-2.5 bg-white text-xs font-serif"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                id="insert_pyq_checkbox"
                type="checkbox"
                checked={is_pyq}
                onChange={(e) => setIsPyq(e.target.checked)}
              />
              <span>Tag as CBSE Board PYQ reference?</span>
            </label>

            {is_pyq && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Board Exam Year:</span>
                <input
                  id="insert_pyq_year"
                  type="number"
                  min="2010"
                  max="2026"
                  value={pyqYear}
                  onChange={(e) => setPyqYear(Number(e.target.value))}
                  className="w-16 border rounded text-center p-1 font-mono text-xs"
                />
              </div>
            )}

            <button
              id="submit-custom-question-btn"
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow cursor-pointer flex items-center gap-1"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Insert Question Record</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: SAMPLE OPERATIONAL QUERY REPOSITORY */}
      {activeTab === "queries" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">High-Performance Production SQL Queries</h3>
            <p className="text-[11px] text-slate-500">Optimized query structures used to dynamically build CBSE board papers, pull specific workspaces, and update mapped saved questions with safe conflict avoidance.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Query 1 */}
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h4 className="font-bold text-slate-700 text-xs uppercase font-mono">1. Random MCQ Paper Selection</h4>
                </div>
                <p className="text-[11px] text-slate-500">Pulls randomized matching MCQ questions for any standard, subject, and chapter combination.</p>
              </div>
              <pre className="bg-slate-900 border border-slate-850 text-slate-300 rounded-lg p-3 text-[10px] font-mono overflow-auto leading-relaxed h-[130px] select-all">
{`SELECT question_id, question_text, 
       option_a, option_b, option_c, option_d 
FROM questions 
WHERE class_level = 'Class 12'
  AND subject = 'Business Studies'
  AND topic = 'Principles of Management'
  AND marks = 1
  AND question_type = 'MCQ'
ORDER BY RANDOM() 
LIMIT 5;`}
              </pre>
            </div>

            {/* Query 2 */}
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <h4 className="font-bold text-slate-700 text-xs uppercase font-mono">2. Personal Saved Questions</h4>
                </div>
                <p className="text-[11px] text-slate-500">Retrieves standard custom question items saved within high-priority teacher workspaces.</p>
              </div>
              <pre className="bg-slate-900 border border-slate-850 text-slate-300 rounded-lg p-3 text-[10px] font-mono overflow-auto leading-relaxed h-[130px] select-all">
{`SELECT q.* FROM questions q
JOIN workspace_questions wq 
  ON q.question_id = wq.question_id
JOIN workspaces w 
  ON wq.workspace_id = w.workspace_id
WHERE w.teacher_id = 123 
  AND q.subject = 'Business Studies'
  AND q.marks = 4;`}
              </pre>
            </div>

            {/* Query 3 */}
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <h4 className="font-bold text-slate-700 text-xs uppercase font-mono">3. Co-Conflict Saved Mapper</h4>
                </div>
                <p className="text-[11px] text-slate-500">Maps questions to standard teacher workspace units, using conflict avoidance logic.</p>
              </div>
              <pre className="bg-slate-900 border border-slate-850 text-slate-300 rounded-lg p-3 text-[10px] font-mono overflow-auto leading-relaxed h-[130px] select-all">
{`INSERT INTO workspace_questions (
  workspace_id, 
  question_id
) 
VALUES (
  current_teacher_workspace_id, 
  selected_question_id
)
ON CONFLICT DO NOTHING;`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PDF / REGEX QUESTION EXTRACTOR SANDBOX */}
      {activeTab === "pdf-extractor" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">PDF & Raw Document Structural Regex Parser</h3>
            <p className="text-[11px] text-slate-500">Run direct regular expression extraction audits on crude string dumps derived from OCR/PDF pipelines to construct formatted CBSE query objects.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parser Sandbox input / outcome */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs font-mono uppercase">Document String Dump Sandbox</span>
                  <span className="text-[10px] text-slate-450 italic">Pasted text parsed in active memory</span>
                </div>
                
                <textarea
                  value={rawTextForExtraction}
                  onChange={(e) => setRawTextForExtraction(e.target.value)}
                  className="w-full h-[180px] p-3 text-[11px] font-mono bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="Paste question paper text here (e.g. Q1. Text... Q2. Text...)"
                />

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleExtractQuestions}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer transition shadow-sm hover:shadow text-xs"
                  >
                    Run Regex Parser &rArr;
                  </button>
                </div>
              </div>

              {/* Extracted results list */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-700 text-xs uppercase font-mono">Parsed Question Blocks ({extractedRegExMatches.length})</span>
                  <span className="text-[10.5px] text-amber-600 bg-amber-50 border border-amber-100 font-bold px-1.5 py-0.5 rounded font-mono">Regex Match Live</span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
                  {extractedRegExMatches.length === 0 ? (
                    <p className="text-center py-6 text-slate-400 font-medium italic">No questions matched. Update input to use "Q1.", "Q2)", "1.", etc.</p>
                  ) : (
                    extractedRegExMatches.map((item, idx) => (
                      <div key={idx} className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/50 flex items-start gap-2.5 text-[11px]">
                        <span className="bg-indigo-100 text-indigo-800 font-mono font-black shrink-0 px-2 py-0.5 rounded text-[10.5px]">
                          Q{item.suggested_number}
                        </span>
                        <p className="font-serif leading-relaxed text-slate-700 select-all">{item.question_text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Microservice Implementation */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 text-slate-300 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-indigo-400 text-xs font-mono uppercase">Node.js / Express Microservice Script</span>
                  <span className="bg-indigo-950 text-indigo-350 border border-indigo-900 px-2 py-0.5 rounded text-[10px] font-mono">production-ready</span>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Integrate standard PDF parsing via <code className="text-indigo-350 font-mono">pdf-parse</code>. Employs the identical, optimized regular expression engine seen in the sandbox:
                </p>

                <pre className="bg-black/45 hover:bg-black/60 rounded-lg p-3 text-[10px] font-mono overflow-auto leading-relaxed h-[270px] select-all scrollbar-thin border border-slate-850">
{`const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractQuestionsFromPDF(pdfBuffer) {
    const data = await pdfParse(pdfBuffer);
    const rawText = data.text;

    // Regex to find patterns like "Q1.", "Q2)", "1." at the start of lines
    const questionPattern = /(?:^|\\n)(?:Q)?(\\d+)[\\.\\)]\\s*(.+?)(?=(?:^|\\n)(?:Q)?\\d+[\\.\\)]|$)/gs;
    
    let matches;
    const extractedQuestions = [];

    while ((matches = questionPattern.exec(rawText)) !== null) {
        extractedQuestions.push({
            suggested_number: matches[1],
            question_text: matches[2].trim()
        });
    }

    return extractedQuestions; // Returns an array of clean, parsed text blocks
}`}
                </pre>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">Usage: call inside PDF upload route controller</span>
                  <button
                    type="button"
                    onClick={() => {
                      const code = `const fs = require('fs');\nconst pdfParse = require('pdf-parse');\n\nasync function extractQuestionsFromPDF(pdfBuffer) {\n    const data = await pdfParse(pdfBuffer);\n    const rawText = data.text;\n\n    const questionPattern = /(?:^|\\n)(?:Q)?(\\d+)[\\.\\)]\\s*(.+?)(?=(?:^|\\n)(?:Q)?\\d+[\\.\\)]|$)/gs;\n    \n    let matches;\n    const extractedQuestions = [];\n\n    while ((matches = questionPattern.exec(rawText)) !== null) {\n        extractedQuestions.push({\n            suggested_number: matches[1],\n            question_text: matches[2].trim()\n        });\n    }\n\n    return extractedQuestions;\n}`;
                      navigator.clipboard.writeText(code);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-755 text-slate-200 border border-slate-700 hover:border-slate-600 rounded text-[10.5px] font-bold cursor-pointer transition"
                  >
                    Copy Extractor Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
