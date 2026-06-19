export interface SubjectChapters {
  [className: string]: {
    [subjectName: string]: string[];
  };
}

export const CLASS_SUBJECT_CHAPTERS_MAP: SubjectChapters = {
  "Class 10": {
    "Science": [
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-Metals",
      "Carbon and its Compounds",
      "Life Processes"
    ],
    "Mathematics": [
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations",
      "Arithmetic Progressions"
    ]
  },
  "Class 12": {
    "Physics": [
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Electromagnetic Induction"
    ],
    "Business Studies": [
      "Nature and Significance of Management",
      "Principles of Management",
      "Business Environment",
      "Planning",
      "Organizing"
    ],
    "Economics": [
      "National Income",
      "Money and Banking",
      "Government Budget",
      "Balance of Payments"
    ]
  }
};
