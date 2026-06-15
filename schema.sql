-- 
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

-- --- INDEXES FOR HIGH-PERFORMANCE QUERYING ---
CREATE INDEX IF NOT EXISTS idx_questions_selection 
ON questions (class_level, subject, topic, marks);

CREATE INDEX IF NOT EXISTS idx_workspaces_teacher_id 
ON workspaces (teacher_id);
