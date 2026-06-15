var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_http = __toESM(require("http"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
var server = import_http.default.createServer(app);
var teacherQuestions = {};
var teacherPapers = {};
app.use(import_express.default.json());
function getQuestionsBucket(codename) {
  const code = (codename || "GUEST").trim().toUpperCase();
  if (!teacherQuestions[code]) {
    teacherQuestions[code] = [];
  }
  return teacherQuestions[code];
}
function getPapersBucket(codename) {
  const code = (codename || "GUEST").trim().toUpperCase();
  if (!teacherPapers[code]) {
    teacherPapers[code] = [];
  }
  return teacherPapers[code];
}
app.get("/api/db-status", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
  const pool = getQuestionsBucket(codename);
  const papers = getPapersBucket(codename);
  res.json({
    totalQuestions: pool.length,
    savedPapersCount: papers.length,
    byClass: {
      "Class 10": pool.filter((q) => q.class_level === "Class 10").length,
      "Class 12": pool.filter((q) => q.class_level === "Class 12").length
    },
    bySubject: {
      "Business Studies": pool.filter((q) => q.subject === "Business Studies").length,
      "Economics": pool.filter((q) => q.subject === "Economics").length,
      "Physics": pool.filter((q) => q.subject === "Physics").length,
      "Science": pool.filter((q) => q.subject === "Science").length,
      "Mathematics": pool.filter((q) => q.subject === "Mathematics").length
    }
  });
});
app.get("/api/questions", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
  const { class_level, subject, chapter_name } = req.query;
  let filtered = [...getQuestionsBucket(codename)];
  if (class_level) {
    filtered = filtered.filter((q) => q.class_level === class_level);
  }
  if (subject) {
    filtered = filtered.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
  }
  if (chapter_name) {
    filtered = filtered.filter((q) => q.chapter_name === chapter_name);
  }
  res.json(filtered);
});
app.post("/api/questions", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
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
  const newQuestion = {
    id: `custom-q-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
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
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const pool = getQuestionsBucket(codename);
  pool.unshift(newQuestion);
  res.status(201).json({ success: true, question: newQuestion });
});
app.post("/api/generate-paper", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
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
  const generatedSections = [];
  const assignedChapters = chapters && chapters.length > 0 ? chapters : ["General Topic"];
  sections.forEach((s) => {
    const marks = Number(s.mark_value) || 1;
    const count = Number(s.count) || 1;
    const questions = [];
    for (let i = 0; i < count; i++) {
      const targetChapter = assignedChapters[i % assignedChapters.length];
      questions.push({
        id: `draft-slot-${marks}-${i}-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
        class_level,
        subject,
        chapter_name: targetChapter,
        topic_name: "TBD",
        mark_value: marks,
        question_type: marks === 1 ? "MCQ" : marks <= 3 ? "Short" : "Long",
        question_text_latex: "",
        // Empty so it serves as a fill-up column
        marking_scheme_text_latex: "",
        cognitive_level: "Understanding",
        image_url: null,
        is_pyq: false,
        pyq_metadata: null,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    generatedSections.push({
      section_name: s.section_name,
      mark_value: marks,
      questions
    });
  });
  generatedSections.sort((a, b) => Number(a.mark_value) - Number(b.mark_value));
  const totalMarks = sections.reduce((sum, s) => sum + Number(s.mark_value) * Number(s.count), 0);
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
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    is_sealed: true
    // indicates encryption status flag
  };
  const papers = getPapersBucket(codename);
  papers.unshift(draftPaper);
  res.json({
    success: true,
    paper: draftPaper
  });
});
app.get("/api/saved-papers", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
  res.json(getPapersBucket(codename));
});
app.post("/api/saved-papers", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
  const paper = req.body;
  if (!paper.id) {
    paper.id = `paper-${Date.now()}`;
  }
  const papers = getPapersBucket(codename);
  const existingIdx = papers.findIndex((p) => p.id === paper.id);
  if (existingIdx > -1) {
    papers[existingIdx] = paper;
  } else {
    papers.unshift(paper);
  }
  res.json({ success: true, paper });
});
app.delete("/api/saved-papers/:id", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
  const papers = getPapersBucket(codename);
  const filtered = papers.filter((p) => p.id !== req.params.id);
  teacherPapers[codename.trim().toUpperCase()] = filtered;
  res.json({ success: true });
});
app.delete("/api/questions/:id", (req, res) => {
  const codename = req.headers["x-teacher-codename"] || "GUEST";
  const pool = getQuestionsBucket(codename);
  const filtered = pool.filter((q) => q.id !== req.params.id);
  teacherQuestions[codename.trim().toUpperCase()] = filtered;
  res.json({ success: true });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        hmr: { server }
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[CODEXAM Core Server] Active and running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
