export interface UnitSubdivision {
  unitName: string;
  subdivisions: string[];
}

export interface Chapter {
  chapterNumber: number;
  chapterName: string;
  units: UnitSubdivision[];
}

export interface SubjectCurriculum {
  subjectName: string;
  booksCount?: string; // e.g. "3 Books in Class 12", "2 books"
  chapters: Chapter[];
}

export interface ClassCurriculum {
  classId: string; // "class-1" to "class-12"
  className: string; // "Class 1" to "Class 12"
  gradeGroup: "Primary (1-5)" | "Middle (6-10)" | "Senior Secondary (11-12)";
  subjects: SubjectCurriculum[];
}

// Master curriculum mappings for exact, high-fidelity NCERT/CBSE syllabus listing
const BS_CLASS_12_CHAPTERS = [
  "Nature and Significance of Management",
  "Principles of Management",
  "Business Environment",
  "Planning",
  "Organising",
  "Staffing",
  "Directing",
  "Controlling",
  "Financial Management",
  "Financial Markets",
  "Marketing Management",
  "Consumer Protection"
];

const BS_CLASS_11_CHAPTERS = [
  "Evolution and Fundamentals of Business",
  "Forms of Business Organisations",
  "Public, Private and Global Enterprises",
  "Business Services",
  "Emerging Modes of Business",
  "Social Responsibilities of Business and Business Ethics",
  "Sources of Business Finance",
  "Small Business and Enterprises",
  "Internal Trade",
  "International Business"
];

const ACCOUNTS_CLASS_12_CHAPTERS = [
  "Accounting for Partnership Firms - Basic Concepts",
  "Reconstitution of Partnership - Admission of a Partner",
  "Reconstitution of Partnership - Retirement/Death of a Partner",
  "Dissolution of Partnership Firm",
  "Accounting for Share Capital",
  "Issue and Redemption of Debentures",
  "Financial Statements of a Company",
  "Analysis of Financial Statements",
  "Accounting Ratios",
  "Cash Flow Statement"
];

const ACCOUNTS_CLASS_11_CHAPTERS = [
  "Introduction to Accounting",
  "Theory Base of Accounting",
  "Recording of Transactions - I",
  "Recording of Transactions - II",
  "Bank Reconciliation Statement",
  "Trial Balance and Rectification of Errors",
  "Depreciation, Provisions and Reserves",
  "Bills of Exchange",
  "Financial Statements - I",
  "Financial Statements - II",
  "Accounts from Incomplete Records"
];

const ECONOMICS_CLASS_12_CHAPTERS = [
  "Introduction to Macroeconomics",
  "National Income and Related Aggregates",
  "Money and Banking",
  "Determination of Income and Employment",
  "Government Budget and the Economy",
  "Balance of Payments & Foreign Exchange",
  "Development Experience (1947-90) & Economic Reforms since 1991",
  "Current Challenges Facing Indian Economy",
  "Development Experience of India: A Comparison with Neighbours"
];

const ECONOMICS_CLASS_11_CHAPTERS = [
  "Introduction to Statistics for Economics",
  "Collection, Organisation and Presentation of Data",
  "Statistical Tools and Interpretation (Mean, Dispersion, Correlation)",
  "Introduction to Microeconomics",
  "Consumer's Equilibrium and Demand",
  "Producer Behaviour and Supply",
  "Forms of Market and Price Determination under Perfect Competition"
];

const PHYSICS_CLASS_12_CHAPTERS = [
  "Electric Charges and Fields",
  "Electrostatic Potential and Capacitance",
  "Current Electricity",
  "Moving Charges and Magnetism",
  "Magnetism and Matter",
  "Electromagnetic Induction",
  "Alternating Current",
  "Electromagnetic Waves",
  "Ray Optics and Optical Instruments",
  "Wave Optics",
  "Dual Nature of Radiation and Matter",
  "Atoms",
  "Nuclei",
  "Semiconductor Electronics: Materials, Devices and Simple Circuits"
];

const PHYSICS_CLASS_11_CHAPTERS = [
  "Units and Measurements",
  "Motion in a Straight Line",
  "Motion in a Plane",
  "Laws of Motion",
  "Work, Energy and Power",
  "System of Particles and Rotational Motion",
  "Gravitation",
  "Mechanical Properties of Solids",
  "Mechanical Properties of Fluids",
  "Thermal Properties of Matter",
  "Thermodynamics",
  "Kinetic Theory of Gases",
  "Oscillations",
  "Waves"
];

const CHEMISTRY_CLASS_12_CHAPTERS = [
  "Solutions",
  "Electrochemistry",
  "Chemical Kinetics",
  "The d-and f-Block Elements",
  "Coordination Compounds",
  "Haloalkanes and Haloarenes",
  "Alcohols, Phenols and Ethers",
  "Aldehydes, Ketones and Carboxylic Acids",
  "Amines",
  "Biomolecules"
];

const CHEMISTRY_CLASS_11_CHAPTERS = [
  "Some Basic Concepts of Chemistry",
  "Structure of Atom",
  "Classification of Elements and Periodicity in Properties",
  "Chemical Bonding and Molecular Structure",
  "Chemical Thermodynamics",
  "Equilibrium",
  "Redox Reactions",
  "Organic Chemistry: Some Basic Principles and Techniques",
  "Hydrocarbons"
];

const BIOLOGY_CLASS_12_CHAPTERS = [
  "Sexual Reproduction in Flowering Plants",
  "Human Reproduction",
  "Reproductive Health",
  "Principles of Inheritance and Variation",
  "Molecular Basis of Inheritance",
  "Evolution",
  "Human Health and Disease",
  "Microbes in Human Welfare",
  "Biotechnology: Principles and Processes",
  "Biotechnology and its Applications",
  "Organisms and Populations",
  "Ecosystem",
  "Biodiversity and Conservation"
];

const BIOLOGY_CLASS_11_CHAPTERS = [
  "The Living World",
  "Biological Classification",
  "Plant Kingdom",
  "Animal Kingdom",
  "Morphology of Flowering Plants",
  "Anatomy of Flowering Plants",
  "Structural Organisation in Animals",
  "Cell: The Unit of Life",
  "Biomolecules",
  "Cell Cycle and Cell Division",
  "Photosynthesis in Higher Plants",
  "Respiration in Plants",
  "Plant Growth and Development",
  "Breathing and Exchange of Gases",
  "Body Fluids and Circulation",
  "Excretory Products and their Elimination",
  "Locomotion and Movement",
  "Neural Control and Coordination",
  "Chemical Coordination and Integration"
];

const MATHS_CLASS_12_CHAPTERS = [
  "Relations and Functions",
  "Inverse Trigonometric Functions",
  "Matrices",
  "Determinants",
  "Continuity and Differentiability",
  "Application of Derivatives",
  "Integrals",
  "Application of Integrals",
  "Differential Equations",
  "Vector Algebra",
  "Three Dimensional Geometry",
  "Linear Programming",
  "Probability"
];

const MATHS_CLASS_11_CHAPTERS = [
  "Sets",
  "Relations and Functions",
  "Trigonometric Functions",
  "Complex Numbers and Quadratic Equations",
  "Linear Inequalities",
  "Permutations and Combinations",
  "Binomial Theorem",
  "Sequences and Series",
  "Straight Lines",
  "Conic Sections",
  "Introduction to Three Dimensional Geometry",
  "Limits and Derivatives",
  "Statistics",
  "Probability"
];

const MATHS_CLASS_10_CHAPTERS = [
  "Real Numbers",
  "Polynomials",
  "Pair of Linear Equations in Two Variables",
  "Quadratic Equations",
  "Arithmetic Progressions",
  "Triangles",
  "Coordinate Geometry",
  "Introduction to Trigonometry",
  "Some Applications of Trigonometry",
  "Circles",
  "Area Related to Circles",
  "Surface Areas and Volumes",
  "Statistics",
  "Probability"
];

const MATHS_CLASS_9_CHAPTERS = [
  "Number Systems",
  "Polynomials",
  "Coordinate Geometry",
  "Linear Equations in Two Variables",
  "Introduction to Euclid's Geometry",
  "Lines and Angles",
  "Triangles",
  "Quadrilaterals",
  "Areas of Parallelograms and Triangles",
  "Circles",
  "Heron's Formula",
  "Surface Areas and Volumes",
  "Statistics",
  "Probability"
];

const MATHS_CLASS_8_CHAPTERS = [
  "Rational Numbers",
  "Linear Equations in One Variable",
  "Understanding Quadrilaterals",
  "Practical Geometry & Data Handling",
  "Squares and Square Roots",
  "Cubes and Cube Roots",
  "Comparing Quantities",
  "Algebraic Expressions and Identities",
  "Visualising Solid Shapes",
  "Mensuration",
  "Exponents and Powers",
  "Direct and Inverse Proportions",
  "Factorisation",
  "Introduction to Graphs"
];

const MATHS_CLASS_7_CHAPTERS = [
  "Integers",
  "Fractions and Decimals",
  "Data Handling",
  "Simple Equations",
  "Lines and Angles",
  "The Triangle and its Properties",
  "Congruence of Triangles",
  "Comparing Quantities",
  "Rational Numbers",
  "Practical Geometry",
  "Perimeter and Area",
  "Algebraic Expressions",
  "Exponents and Powers",
  "Symmetry & Visualising Solid Shapes"
];

const MATHS_CLASS_6_CHAPTERS = [
  "Knowing Our Numbers",
  "Whole Numbers",
  "Playing with Numbers",
  "Basic Geometrical Ideas",
  "Understanding Elementary Shapes",
  "Integers",
  "Fractions",
  "Decimals",
  "Data Handling",
  "Mensuration",
  "Algebra",
  "Ratio and Proportion",
  "Symmetry and Practical Geometry"
];

const SCIENCE_CLASS_10_CHAPTERS = [
  "Chemical Reactions and Equations",
  "Acids, Bases and Salts",
  "Metals and Non-metals",
  "Carbon and its Compounds",
  "Periodic Classification of Elements",
  "Life Processes",
  "Control and Coordination",
  "How do Organisms Reproduce?",
  "Heredity and Evolution",
  "Light – Reflection and Refraction",
  "The Human Eye and the Colorful World",
  "Electricity",
  "Magnetic Effects of Electric Current",
  "Sources of Energy",
  "Our Environment",
  "Sustainable Management of Natural Resources"
];

const SCIENCE_CLASS_9_CHAPTERS = [
  "Matter in Our Surroundings",
  "Is Matter Around Us Pure",
  "Atoms and Molecules",
  "Structure of the Atom",
  "The Fundamental Unit of Life",
  "Tissues",
  "Diversity in Living Organisms",
  "Motion",
  "Force and Laws of Motion",
  "Gravitation",
  "Work and Energy",
  "Sound",
  "Why Do We Fall Ill",
  "Natural Resources",
  "Improvement in Food Resources"
];

const SCIENCE_CLASS_8_CHAPTERS = [
  "Crop Production and Management",
  "Microorganisms: Friend and Foe",
  "Synthetic Fibres and Plastics",
  "Materials: Metals and Non-Metals",
  "Coal and Petroleum",
  "Combustion and Flame",
  "Conservation of Plants and Animals",
  "Cell — Structure and Functions",
  "Reproduction in Animals",
  "Reaching the Age of Adolescence",
  "Force and Pressure",
  "Friction",
  "Sound",
  "Chemical Effects of Electric Current",
  "Some Natural Phenomena",
  "Light",
  "Stars and the Solar System"
];

const SCIENCE_CLASS_7_CHAPTERS = [
  "Nutrition in Plants",
  "Nutrition in Animals",
  "Fibre to Fabric",
  "Heat",
  "Acids, Bases and Salts",
  "Physical and Chemical Changes",
  "Weather, Climate and Adaptations",
  "Winds, Storms and Cyclones",
  "Soil",
  "Respiration in Organisms",
  "Transportation in Animals and Plants",
  "Reproduction in Plants",
  "Motion and Time",
  "Electric Current and its Effects",
  "Light",
  "Water & Forests"
];

const SCIENCE_CLASS_6_CHAPTERS = [
  "Food: Where Does It Come From?",
  "Components of Food",
  "Fibre to Fabric",
  "Sorting Materials into Groups",
  "Separation of Substances",
  "Changes Around Us",
  "Getting to Know Plants",
  "Body Movements",
  "The Living Organisms and Their Surroundings",
  "Motion and Measurement of Distances",
  "Light, Shadows and Reflections",
  "Electricity and Circuits",
  "Fun with Magnets",
  "Water",
  "Air Around Us",
  "Garbage In, Garbage Out"
];

const SOCIAL_SCIENCE_CLASS_10_CHAPTERS = [
  "The Rise of Nationalism in Europe",
  "Nationalism in India",
  "The Making of a Global World",
  "The Age of Industrialisation",
  "Resources and Development",
  "Forest and Wildlife Resources",
  "Water Resources",
  "Agriculture",
  "Minerals and Energy Resources",
  "Power Sharing",
  "Federalism",
  "Democracy and Diversity",
  "Gender, Religion and Caste",
  "Political Parties",
  "Outcomes of Democracy",
  "Development",
  "Sectors of the Indian Economy",
  "Money and Credit",
  "Globalisation and the Indian Economy",
  "Consumer Rights"
];

const SOCIAL_SCIENCE_CLASS_9_CHAPTERS = [
  "The French Revolution",
  "Socialism in Europe and the Russian Revolution",
  "Nazism and the Rise of Hitler",
  "Forest Society and Colonialism",
  "Pastoralists in the Modern World",
  "India – Size and Location",
  "Physical Features of India",
  "Drainage",
  "Climate",
  "Natural Vegetation and Wildlife",
  "What is Democracy? Why Democracy?",
  "Constitutional Design",
  "Electoral Politics",
  "Working of Institutions",
  "Democratic Rights",
  "The Story of Village Palampur",
  "People as Resource",
  "Poverty as a Challenge",
  "Food Security in India"
];

const SOCIAL_SCIENCE_CLASS_8_CHAPTERS = [
  "How, When and Where",
  "From Trade to Territory (The Company Establishes Power)",
  "Ruling the Countryside",
  "Tribals, Dikus and the Vision of a Golden Age",
  "When People Rebel (1857 and After)",
  "Weavers, Iron Smelters and Factory Owners",
  "Civilising the 'Native', Educating the Nation",
  "Women, Caste and Reform",
  "The Making of the National Movement: 1870s-1947",
  "India After Independence",
  "Resources",
  "Land, Soil, Water, Natural Vegetation and Wildlife Resources",
  "Mineral and Power Resources",
  "Agriculture",
  "Industries",
  "Human Resources",
  "The Indian Constitution",
  "Understanding Secularism",
  "Why do we need a Parliament?",
  "Understanding Laws",
  "Judiciary",
  "Understanding Our Criminal Justice System",
  "Understanding Marginalisation & Confronting Marginalisation",
  "Public Facilities",
  "Law and Social Justice"
];

const SOCIAL_SCIENCE_CLASS_7_CHAPTERS = [
  "Tracing Changes Through a Thousand Years",
  "New Kings and Kingdoms",
  "The Delhi Sultans",
  "The Mughal Empire",
  "Rulers and Buildings",
  "Towns, Traders and Craftspersons",
  "Tribes, Nomads and Settled Communities",
  "Devotional Paths to the Divine",
  "The Making of Regional Cultures",
  "Eighteenth-Century Political Formations",
  "Environment",
  "Inside Our Earth",
  "Our Changing Earth",
  "Air",
  "Water",
  "Natural Vegetation and Wildlife",
  "Human Environment: Settlement, Transport and Communication",
  "On Equality",
  "Role of the Government in Health",
  "How the State Government Works",
  "Growing Up as Boys and Girls",
  "Women Change the World",
  "Understanding Media"
];

const SOCIAL_SCIENCE_CLASS_6_CHAPTERS = [
  "What, Where, How and When?",
  "From Hunting-Gathering to Growing Food",
  "In the Earliest Cities",
  "What Books and Burials Tell Us",
  "Kingdoms, Kings and an Early Republic",
  "New Questions and Ideas",
  "Ashoka, The Emperor Who Gave Up War",
  "Vital Villages, Thriving Towns",
  "Traders, Kings and Pilgrims",
  "New Empires and Kingdoms",
  "Buildings, Paintings and Books",
  "Understanding Diversity & Discrimination",
  "What is Government? & Key Elements of a Democratic Govt",
  "Panchayati Raj",
  "Rural Administration & Urban Administration",
  "The Earth in the Solar System",
  "Globe, Latitudes and Longitudes",
  "Motions of the Earth & Maps",
  "Major Domains of the Earth & Major Landforms"
];

const HISTORY_CLASS_12_CHAPTERS = [
  "Bricks, Beads and Bones (The Harappan Civilisation)",
  "Kings, Farmers and Towns (Early States and Economies)",
  "Kinship, Caste and Class (Early Societies)",
  "Thinkers, Beliefs and Buildings (Cultural Developments)",
  "Through the Eyes of Travellers (Perceptions of Society)",
  "Bhakti-Sufi Traditions (Changes in Religious Beliefs)",
  "An Imperial Capital: Vijayanagara (14th to 16th century)",
  "Peasants, Zamindars and the State (Agrarian Society)",
  "Colonialism and the Countryside (Explorations in Official Archives)",
  "Rebels and the Raj (1857 Revolt and its Representations)",
  "Mahatma Gandhi and the Nationalist Movement (Civil Disobedience and Beyond)",
  "Framing the Constitution (The Beginning of a New Era)"
];

const HISTORY_CLASS_11_CHAPTERS = [
  "Writing and City Life (Mesopotamian Civilisation)",
  "An Empire Across Three Continents (The Roman Empire)",
  "Nomadic Empires (The Mongols)",
  "The Three Orders (Feudal Europe)",
  "Changing Cultural Traditions (The Renaissance)",
  "Displacing Indigenous Peoples (The Americas and Australia)",
  "Paths to Modernisation (East Asia, Japan, China)"
];

const POL_SCI_CLASS_12_CHAPTERS = [
  "The End of Bipolarity",
  "Contemporary Centres of Power",
  "Contemporary South Asia",
  "International Organisations",
  "Security in the Contemporary World",
  "Environment and Natural Resources",
  "Globalisation",
  "Challenges of Nation Building",
  "Era of One-Party Dominance",
  "Politics of Planned Development",
  "India's External Relations",
  "Challenges to and Restoration of the Congress System",
  "The Crisis of Democratic Order",
  "Regional Aspirations",
  "Recent Developments in Indian Politics"
];

const POL_SCI_CLASS_11_CHAPTERS = [
  "Constitution: Why and How?",
  "Rights in the Indian Constitution",
  "Election and Representation",
  "Executive",
  "Legislature",
  "Judiciary",
  "Federalism",
  "Local Governments",
  "Constitution as a Living Document & Philosophy",
  "Political Theory: An Introduction",
  "Freedom",
  "Equality",
  "Social Justice",
  "Rights",
  "Citizenship",
  "Nationalism",
  "Secularism"
];

const GEOGRAPHY_CLASS_12_CHAPTERS = [
  "Human Geography: Nature and Scope",
  "The World Population: Distribution, Density and Growth",
  "Human Development",
  "Primary Activities",
  "Secondary Activities",
  "Tertiary and Quaternary Activities",
  "Transport and Communication",
  "International Trade",
  "Population, Migration, and Development in India",
  "Human Settlements",
  "Water Resources & Land Resources",
  "Mineral and Energy Resources",
  "Planning and Sustainable Development in Indian Context"
];

const GEOGRAPHY_CLASS_11_CHAPTERS = [
  "Geography as a Discipline",
  "The Origin and Evolution of the Earth",
  "Interior of the Earth & Distribution of Continents",
  "Geomorphic Processes & Landforms Evolution",
  "Composition and Structure of Atmosphere",
  "Solar Radiation, Heat Balance and Temperature",
  "Atmospheric Circulation and Weather Systems",
  "Water in the Atmosphere & World Climate Change",
  "Water (Oceans) & Ocean Water Movements",
  "Life on the Earth & Biodiversity Conservation",
  "India: Physical Environment - Location",
  "Structure, Physiography and Drainage System",
  "Climate, Natural Vegetation and Soils",
  "Natural Hazards and Disasters: Causes and Management"
];

// Helper to resolve the correct array of chapter titles dynamically
function getSyllabusChapterTitles(className: string, subjectName: string): string[] {
  const normClass = className.replace(/\s+/g, "").toLowerCase();
  const normSubject = subjectName.replace(/[\/\s-+]+/g, "").toLowerCase();

  // 1. Business Studies
  if (normSubject.indexOf("businessstudies") !== -1 || normSubject.indexOf("bst") !== -1) {
    if (normClass.indexOf("12") !== -1) return BS_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return BS_CLASS_11_CHAPTERS;
  }

  // 2. Accounts
  if (normSubject.indexOf("accounts") !== -1 || normSubject.indexOf("accountancy") !== -1) {
    if (normClass.indexOf("12") !== -1) return ACCOUNTS_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return ACCOUNTS_CLASS_11_CHAPTERS;
  }

  // 3. Economics
  if (normSubject.indexOf("economics") !== -1) {
    if (normClass.indexOf("12") !== -1) return ECONOMICS_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return ECONOMICS_CLASS_11_CHAPTERS;
  }

  // 4. Physics
  if (normSubject.indexOf("physics") !== -1) {
    if (normClass.indexOf("12") !== -1) return PHYSICS_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return PHYSICS_CLASS_11_CHAPTERS;
  }

  // 5. Chemistry
  if (normSubject.indexOf("chemistry") !== -1) {
    if (normClass.indexOf("12") !== -1) return CHEMISTRY_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return CHEMISTRY_CLASS_11_CHAPTERS;
  }

  // 6. Biology
  if (normSubject.indexOf("biology") !== -1) {
    if (normClass.indexOf("12") !== -1) return BIOLOGY_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return BIOLOGY_CLASS_11_CHAPTERS;
  }

  // 7. Maths / Applied maths
  if (normSubject.indexOf("math") !== -1 || normSubject.indexOf("appliedmath") !== -1) {
    if (normClass.indexOf("12") !== -1) return MATHS_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return MATHS_CLASS_11_CHAPTERS;
    if (normClass.indexOf("10") !== -1) return MATHS_CLASS_10_CHAPTERS;
    if (normClass.indexOf("9") !== -1) return MATHS_CLASS_9_CHAPTERS;
    if (normClass.indexOf("8") !== -1) return MATHS_CLASS_8_CHAPTERS;
    if (normClass.indexOf("7") !== -1) return MATHS_CLASS_7_CHAPTERS;
    if (normClass.indexOf("6") !== -1) return MATHS_CLASS_6_CHAPTERS;
  }

  // 8. Science
  if (normSubject.indexOf("science") !== -1 && normSubject.indexOf("social") === -1 && normSubject.indexOf("political") === -1) {
    if (normClass.indexOf("10") !== -1) return SCIENCE_CLASS_10_CHAPTERS;
    if (normClass.indexOf("9") !== -1) return SCIENCE_CLASS_9_CHAPTERS;
    if (normClass.indexOf("8") !== -1) return SCIENCE_CLASS_8_CHAPTERS;
    if (normClass.indexOf("7") !== -1) return SCIENCE_CLASS_7_CHAPTERS;
    if (normClass.indexOf("6") !== -1) return SCIENCE_CLASS_6_CHAPTERS;
  }

  // 9. Social Science
  if (normSubject.indexOf("socialscience") !== -1) {
    if (normClass.indexOf("10") !== -1) return SOCIAL_SCIENCE_CLASS_10_CHAPTERS;
    if (normClass.indexOf("9") !== -1) return SOCIAL_SCIENCE_CLASS_9_CHAPTERS;
    if (normClass.indexOf("8") !== -1) return SOCIAL_SCIENCE_CLASS_8_CHAPTERS;
    if (normClass.indexOf("7") !== -1) return SOCIAL_SCIENCE_CLASS_7_CHAPTERS;
    if (normClass.indexOf("6") !== -1) return SOCIAL_SCIENCE_CLASS_6_CHAPTERS;
  }

  // 10. History
  if (normSubject.indexOf("history") !== -1) {
    if (normClass.indexOf("12") !== -1) return HISTORY_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return HISTORY_CLASS_11_CHAPTERS;
  }

  // 11. Political Science
  if (normSubject.indexOf("political") !== -1 || normSubject.indexOf("polsci") !== -1 || normSubject.indexOf("civics") !== -1) {
    if (normClass.indexOf("12") !== -1) return POL_SCI_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return POL_SCI_CLASS_11_CHAPTERS;
  }

  // 12. Geography
  if (normSubject.indexOf("geography") !== -1) {
    if (normClass.indexOf("12") !== -1) return GEOGRAPHY_CLASS_12_CHAPTERS;
    if (normClass.indexOf("11") !== -1) return GEOGRAPHY_CLASS_11_CHAPTERS;
  }

  // Fallbacks for other class/subject combinations
  return [
    "Introduction to Foundation Standards",
    "Conceptual Theories and Models",
    "Practical Application & Formula Exercises",
    "Board Syllabus Comprehensive Revision"
  ];
}

// Complete curriculum database
export const CURRICULUM_DATABASE: ClassCurriculum[] = Array.from({ length: 12 }, (_, index) => {
  const classNum = index + 1;
  const className = `Class ${classNum}`;
  
  // 1. Determine Grade Group
  let gradeGroup: ClassCurriculum["gradeGroup"] = "Primary (1-5)";
  if (classNum >= 6 && classNum <= 10) {
    gradeGroup = "Middle (6-10)";
  } else if (classNum >= 11) {
    gradeGroup = "Senior Secondary (11-12)";
  }

  // 2. Map Subjects by Class Limits
  let subjectsList: { name: string; booksCount?: string }[] = [];
  if (classNum <= 5) {
    subjectsList = [
      { name: "English Grammar" },
      { name: "Maths" },
      { name: "Hindi" },
      { name: "EVS" }
    ];
  } else if (classNum >= 6 && classNum <= 10) {
    subjectsList = [
      { name: "Maths" },
      { name: "Science" },
      { name: "Social Science" },
      { name: "Hindi" },
      { name: "English Grammar and passages" }
    ];
  } else {
    // Classes 11 and 12
    subjectsList = [
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Biology" },
      { name: "Maths / Applied maths" },
      { 
        name: "Accounts", 
        booksCount: classNum === 12 ? "3 Books in Class 12" : "2 Books in Class 11" 
      },
      { 
        name: "Economics", 
        booksCount: "2 books" 
      },
      { name: "Business Studies" },
      { name: "History" },
      { name: "Political science" },
      { name: "Geography" }
    ];
  }

  const subjects: SubjectCurriculum[] = subjectsList.map((sub) => {
    const rawTitles = getSyllabusChapterTitles(className, sub.name);

    const chapters: Chapter[] = rawTitles.map((title, cIdx) => {
      const chNum = cIdx + 1;
      
      // Build dynamic subdivisions for NCERT styling inside unit levels
      const units: UnitSubdivision[] = [
        { 
          unitName: `${title.slice(0, 20)} Core Theory`, 
          subdivisions: [
            "Definitions & Terminology Keys", 
            "Important Board Exam Derivations", 
            "Practice Application Scenarios"
          ] 
        },
        { 
          unitName: `Competency Based Analysis`, 
          subdivisions: [
            "Case study interpretation questions", 
            "Formula-led numeric drills", 
            "Step-marking criteria check"
          ] 
        }
      ];

      return {
        chapterNumber: chNum,
        chapterName: title,
        units
      };
    });

    return {
      subjectName: sub.name,
      booksCount: sub.booksCount,
      chapters
    };
  });

  return {
    classId: `class-${classNum}`,
    className,
    gradeGroup,
    subjects
  };
});
