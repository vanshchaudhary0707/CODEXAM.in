export interface BrandingDetails {
  school_name: string;
  exam_name: string;
  time_allowed: string;
  max_marks: number;
  logo_url: string; // Base64 or local URL
}

export interface PaperSectionCriteria {
  section_name: string;
  mark_value: number;
  count: number;
}

export interface PaperGenerationConfig {
  class_level: string; // "Class 10" | "Class 12"
  subject: string;
  chapters: string[];
  sections: PaperSectionCriteria[];
  branding: BrandingDetails;
  ai_auto_fill: boolean;
}

export interface Question {
  id: string;
  class_level: string;
  subject: string;
  chapter_name: string;
  topic_name: string;
  mark_value: number;
  question_type: 'MCQ' | 'Short' | 'Long' | 'Case-Based';
  question_text_latex: string;
  marking_scheme_text_latex: string;
  cognitive_level: 'Remembering' | 'Understanding' | 'Applying' | 'Analyzing';
  image_url: string | null;
  is_pyq: boolean;
  pyq_metadata: { year: number; board: string; set?: string } | null;
  created_at: string;

  // Visual & Schema compatibility for PYQ Explorer Vault
  year_origin?: string;
  marks?: number;
  type?: string;
  question_text?: string;
  marking_scheme_solution?: string;
  competency_focused?: boolean;
  isPlaceholder?: boolean;
}

export interface GeneratedSection {
  section_name: string;
  mark_value: number;
  questions: Question[];
}

export interface GeneratedPaper {
  id: string;
  title: string;
  class_level: string;
  subject: string;
  max_marks: number;
  time_allowed: string;
  branding: BrandingDetails;
  sections: GeneratedSection[];
  created_at: string;
}
