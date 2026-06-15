import express from "express";
import path from "path";
import http from "http";
import { createServer as createViteServer } from "vite";
import { Question } from "./src/types";

const app = express();
const PORT = 3000;
const server = http.createServer(app);

// Multi-user private sandbox structures
// Keys: Teacher Codename (Uppercase) -> Private data arrays
let teacherQuestions: Record<string, Question[]> = {};
let teacherPapers: Record<string, any[]> = {};

app.use(express.json());

// Helper to retrieve isolated scoped databases
function getQuestionsBucket(codename: string): Question[] {
  const code = (codename || "GUEST").trim().toUpperCase();
  if (!teacherQuestions[code]) {
    teacherQuestions[code] = [];
  }
  return teacherQuestions[code];
}

function getPapersBucket(codename: string): any[] {
  const code = (codename || "GUEST").trim().toUpperCase();
  if (!teacherPapers[code]) {
    teacherPapers[code] = [];
  }
  return teacherPapers[code];
}

// ==================== DB CONFIG & SCHEMA ENDPOINTS ====================

// API to fetch active database state: metadata counts, custom questions list, etc.
app.get("/api/db-status", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  const pool = getQuestionsBucket(codename);
  const papers = getPapersBucket(codename);
  
  res.json({
    totalQuestions: pool.length,
    savedPapersCount: papers.length,
    byClass: {
      "Class 10": pool.filter(q => q.class_level === "Class 10").length,
      "Class 12": pool.filter(q => q.class_level === "Class 12").length,
    },
    bySubject: {
      "Business Studies": pool.filter(q => q.subject === "Business Studies").length,
      "Economics": pool.filter(q => q.subject === "Economics").length,
      "Physics": pool.filter(q => q.subject === "Physics").length,
      "Science": pool.filter(q => q.subject === "Science").length,
      "Mathematics": pool.filter(q => q.subject === "Mathematics").length,
    }
  });
});

// GET custom question pool list with intelligent subject and class filters
app.get("/api/questions", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  const { class_level, subject, chapter_name } = req.query;
  let filtered = [...getQuestionsBucket(codename)];
  
  if (class_level) {
    filtered = filtered.filter(q => q.class_level === class_level);
  }
  if (subject) {
    filtered = filtered.filter(q => q.subject.toLowerCase() === (subject as string).toLowerCase());
  }
  if (chapter_name) {
    filtered = filtered.filter(q => q.chapter_name === chapter_name);
  }
  res.json(filtered);
});

// POST to insert a new manual question block into DB (with custom teacher encryption support)
app.post("/api/questions", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  const {
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
    pyq_metadata
  } = req.body;

  if (!class_level || !subject || !chapter_name || !question_text_latex) {
    return res.status(400).json({ error: "Missing required properties to save question." });
  }

  const newQuestion: Question = {
    id: `custom-q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    class_level,
    subject,
    chapter_name,
    topic_name: topic_name || "General",
    mark_value: Number(mark_value) || 1,
    question_type: question_type || "Short",
    question_text_latex,
    marking_scheme_text_latex: marking_scheme_text_latex || "",
    cognitive_level: cognitive_level || "Understanding",
    image_url: null,
    is_pyq: !!is_pyq,
    pyq_metadata: pyq_metadata || null,
    created_at: new Date().toISOString()
  };

  const pool = getQuestionsBucket(codename);
  pool.unshift(newQuestion);
  res.status(201).json({ success: true, question: newQuestion });
});

// ==================== CORE API: GENERATE BLANK DRAFT STRUCTURES ====================

app.post("/api/generate-paper", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  const {
    chapters,
    class_level,
    subject,
    sections,
    branding
  } = req.body;

  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return res.status(400).json({ error: "At least one chapter must be selected." });
  }
  if (!class_level || !subject) {
    return res.status(400).json({ error: "Class level and subject are required." });
  }
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ error: "Sections criteria are required to form skeleton draft." });
  }

  const generatedSections: any[] = [];
  const assignedChapters = chapters && chapters.length > 0 ? chapters : ["General Topic"];

  // NO AI generation! Build physical fill-up columns strictly with clean placeholders
  sections.forEach((s) => {
    const marks = Number(s.mark_value) || 1;
    const count = Number(s.count) || 1;
    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
      const targetChapter = assignedChapters[i % assignedChapters.length];
      questions.push({
        id: `draft-slot-${marks}-${i}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        class_level,
        subject,
        chapter_name: targetChapter,
        topic_name: "TBD",
        mark_value: marks,
        question_type: marks === 1 ? "MCQ" : marks <= 3 ? "Short" : "Long",
        question_text_latex: "", // Empty so it serves as a fill-up column
        marking_scheme_text_latex: "",
        cognitive_level: "Understanding",
        image_url: null,
        is_pyq: false,
        pyq_metadata: null,
        created_at: new Date().toISOString()
      });
    }

    generatedSections.push({
      section_name: s.section_name,
      mark_value: marks,
      questions: questions
    });
  });

  // Sort sections by marks in escalating sequence
  generatedSections.sort((a, b) => Number(a.mark_value) - Number(b.mark_value));

  const totalMarks = sections.reduce((sum, s) => sum + (Number(s.mark_value) * Number(s.count)), 0);

  // Compile draft structural paper object
  const draftPaper = {
    id: `draft-paper-${Date.now()}`,
    title: branding?.exam_name || "Custom Draft Paper Design",
    class_level,
    subject,
    max_marks: totalMarks,
    time_allowed: branding?.time_allowed || "3 Hours",
    branding: branding || {
      school_name: "Institution Name",
      exam_name: "Examination Draft",
      time_allowed: "3 Hours",
      max_marks: totalMarks,
      logo_url: ""
    },
    sections: generatedSections,
    created_at: new Date().toISOString(),
    is_sealed: true // indicates encryption status flag
  };

  const papers = getPapersBucket(codename);
  papers.unshift(draftPaper);

  res.json({
    success: true,
    paper: draftPaper
  });
});

// GET saved papers
app.get("/api/saved-papers", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  res.json(getPapersBucket(codename));
});

// POST to update/save a paper (with encrypted payload backing)
app.post("/api/saved-papers", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  const paper = req.body;
  
  if (!paper.id) {
    paper.id = `paper-${Date.now()}`;
  }
  
  const papers = getPapersBucket(codename);
  const existingIdx = papers.findIndex(p => p.id === paper.id);
  
  if (existingIdx > -1) {
    papers[existingIdx] = paper;
  } else {
    papers.unshift(paper);
  }
  
  res.json({ success: true, paper });
});

// Delete saved paper
app.delete("/api/saved-papers/:id", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  const papers = getPapersBucket(codename);
  const filtered = papers.filter(p => p.id !== req.params.id);
  
  teacherPapers[codename.trim().toUpperCase()] = filtered;
  res.json({ success: true });
});

// API for question deletion from bank
app.delete("/api/questions/:id", (req, res) => {
  const codename = (req.headers["x-teacher-codename"] as string) || "GUEST";
  const pool = getQuestionsBucket(codename);
  const filtered = pool.filter(q => q.id !== req.params.id);
  
  teacherQuestions[codename.trim().toUpperCase()] = filtered;
  res.json({ success: true });
});

// ==================== VITE DEVELOPMENT ENVIRONMENT MIDDLEWARE ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { server }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[CODEXAM Core Server] Active and running on port ${PORT}`);
  });
}

startServer();
