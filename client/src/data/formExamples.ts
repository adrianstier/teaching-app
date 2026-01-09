/**
 * Form Examples for All Features
 *
 * This file contains realistic example data for all form fields across the platform.
 * Use these examples to help users understand what to input and reduce guesswork.
 */

export const formExamples = {
  // Spaced Repetition
  spacedRepetition: {
    schedule: {
      courseId: 'PSY101-Spring2024',
      courseTopic: 'Introduction to Psychology',
      concepts: `Classical conditioning
Operant conditioning
Observational learning
Memory consolidation
Cognitive biases`,
      algorithm: 'sm2' as const,
    },
    retrievalPractice: {
      topic: 'Cellular Respiration',
      concepts: ['Glycolysis', 'Krebs Cycle', 'Electron Transport Chain'],
      bloomLevel: 'apply' as const,
      priorTopics: ['Cell structure', 'ATP basics'],
    },
    preClassActivation: {
      upcomingLecture: 'Quantum Mechanics Basics',
      topic: 'Wave-particle duality',
      prerequisites: ['Classical mechanics', 'Basic wave theory'],
    },
  },

  // Formative Assessment
  formativeAssessment: {
    livePoll: {
      topic: 'Mitosis vs Meiosis',
      concept: 'Cell division stages',
      type: 'multiple-choice' as const,
      targetMisconception: 'Students confuse metaphase I and metaphase II',
      bloomLevel: 'understand' as const,
    },
    exitTicket: {
      lectureId: 'CHEM201-L05',
      topic: 'Organic Reaction Mechanisms',
      keyConceptsCovered: ['Nucleophilic substitution', 'Leaving groups', 'SN1 vs SN2'],
      includeTypes: ['comprehension', 'application', 'reflection'],
    },
    misconceptionTracker: {
      topic: 'Evolution by Natural Selection',
      discipline: 'Biology',
      concepts: ['Adaptation', 'Fitness', 'Selection pressure'],
    },
  },

  // Cognitive Load
  cognitiveLoad: {
    workedExample: {
      topic: 'Integration by Parts',
      problemType: 'Calculus integration',
      problem: 'Find the integral of x·e^x dx',
      solution: 'Let u = x, dv = e^x dx. Then du = dx, v = e^x. Using integration by parts: ∫x·e^x dx = x·e^x - ∫e^x dx = x·e^x - e^x + C',
      targetFadingLevel: 'intermediate' as const,
    },
    slideAnalysis: {
      slideContent: 'Neural networks consist of input layer, hidden layers, and output layer. Each neuron receives weighted inputs, applies activation function, and passes output forward.',
      slideNumber: 12,
      hasImages: true,
      hasAnimations: false,
    },
    chunking: {
      content: 'The cardiovascular system includes the heart, blood vessels, and blood. The heart pumps oxygenated blood through arteries...',
      contentId: 'anatomy-lecture-3',
      targetAudience: 'First-year medical students',
    },
  },

  // Growth Mindset
  growthMindset: {
    struggleMessages: {
      context: 'student-stuck-on-problem' as const,
      topic: 'Debugging code',
      bloomLevel: 'analyze' as const,
    },
    praiseTemplates: {
      situations: ['Improved on test', 'Asked good question', 'Helped peer', 'Persisted on challenge'],
    },
    productiveFailure: {
      topic: 'Statistics',
      targetConcept: 'Standard deviation',
      duration: 20,
      priorKnowledge: ['Mean', 'Variance basics'],
    },
  },

  // Metacognition
  metacognition: {
    studyStrategies: {
      topic: 'Organic Chemistry Reactions',
      bloomLevel: 'analyze' as const,
      contentType: 'procedural' as const,
      learningGoal: 'Predict reaction products',
      studentLevel: 'intermediate' as const,
    },
    selfExplanation: {
      content: 'Photosynthesis converts light energy into chemical energy stored in glucose.',
      contentId: 'bio-lecture-7',
      targetConcept: 'Energy conversion',
      scaffoldLevel: 'medium' as const,
    },
    calibration: {
      topic: 'Linear Algebra',
      assessmentType: 'problem-solving' as const,
      concepts: ['Matrix multiplication', 'Determinants', 'Eigenvalues'],
    },
  },

  // Desirable Difficulties
  desirableDifficulties: {
    generation: {
      topic: 'American Revolution',
      concept: 'Causes of colonial unrest',
      type: 'fill-in-blank' as const,
      scaffolding: 'medium' as const,
    },
    interleaving: {
      topics: ['Derivatives', 'Integrals', 'Limits'],
      questionsPerTopic: 4,
      includeContrastingCases: true,
    },
    pretesting: {
      topic: 'Atomic Structure',
      concepts: ['Protons', 'Electrons', 'Neutrons', 'Isotopes'],
      difficultyLevel: 'moderate' as const,
    },
  },

  // Collaborative Learning
  collaborative: {
    formGroups: {
      classSize: 30,
      strategy: 'heterogeneous' as const,
      groupSizePreference: 4,
      studentData: {
        hasSkillLevels: true,
        hasPersonalityData: false,
      },
    },
    generateActivity: {
      type: 'jigsaw' as const,
      topic: 'Climate Change',
      duration: 45,
      groupSize: 4,
      learningObjective: 'Students will synthesize multiple perspectives on climate policy',
      includeRoles: true,
    },
    peerFeedback: {
      activityType: 'essay-review' as const,
      criteria: ['Thesis clarity', 'Evidence quality', 'Argument structure'],
      includeTraining: true,
    },
  },

  // Case-Based Learning
  caseBased: {
    generateCase: {
      topic: 'Business Ethics',
      domain: 'Business',
      complexity: 'intermediate' as const,
      learningObjectives: 'Students will evaluate stakeholder impacts and propose ethically-sound solutions',
      studentLevel: 'undergraduate' as const,
      includeEthicalDimensions: true,
      interdisciplinaryConnections: ['Economics', 'Philosophy'],
    },
    analysisFramework: {
      caseId: 'ethics-case-001',
      scaffoldingLevel: 'medium' as const,
      focusAreas: ['Stakeholder analysis', 'Ethical frameworks', 'Decision criteria'],
    },
  },

  // Misconceptions
  misconceptions: {
    database: {
      topic: 'Newton\'s Laws of Motion',
      discipline: 'Physics',
      concepts: ['Inertia', 'Force', 'Action-reaction pairs'],
      studentLevel: 'high-school' as const,
    },
    conceptualChange: {
      misconception: {
        description: 'Students believe heavier objects fall faster',
        prevalence: 'common',
        rootCause: 'Everyday experience without air resistance',
      },
      availableTime: 30,
      classSize: 25,
    },
  },

  // Inclusive Design
  inclusiveDesign: {
    checkContent: {
      content: 'When planning your weekend activities, consider visiting the mall or going to church...',
      contentId: 'example-lecture',
      contentType: 'lecture-notes' as const,
    },
    diverseExamples: {
      topic: 'Family structures in sociology',
      currentExample: 'Traditional nuclear family',
      targetAudience: 'Undergraduate sociology students',
      culturalContexts: ['Global', 'Urban/Rural', 'Socioeconomic diversity'],
    },
    multilingualGlossary: {
      terms: ['Hypothesis', 'Variable', 'Control group', 'Data analysis'],
      targetLanguages: ['Spanish', 'Mandarin', 'Arabic'],
    },
  },

  // Adaptive Pathways
  adaptive: {
    diagnostic: {
      topic: 'Algebra Fundamentals',
      concepts: ['Linear equations', 'Quadratic equations', 'Systems of equations'],
      targetSkills: ['Problem solving', 'Formula application'],
      studentLevel: 'mixed' as const,
    },
    pathway: {
      topic: 'Programming Basics',
      track: 'accelerated' as const,
      prerequisites: ['None - complete beginners'],
      targetOutcomes: ['Write simple programs', 'Debug code', 'Understand control flow'],
      estimatedDuration: '4 weeks',
    },
    challengeProblems: {
      topic: 'Thermodynamics',
      baseConceptsMastered: ['First law', 'Entropy', 'Heat engines'],
      bloomLevel: 'analyze' as const,
      count: 5,
    },
  },

  // Transfer Learning
  transfer: {
    activity: {
      sourceConcept: 'Supply and demand curves',
      sourceContext: 'Economics - Market equilibrium',
      targetContext: 'Environmental science - Carbon trading markets',
      transferDistance: 'near' as const,
      scaffoldingLevel: 'medium' as const,
    },
    analogical: {
      sourceCase: {
        domain: 'Biology',
        concept: 'Natural selection',
        example: 'Antibiotic resistance in bacteria',
      },
      targetDomain: 'Computer science - Genetic algorithms',
    },
    abstractionLadder: {
      concept: 'Feedback loops',
      concreteExamples: ['Thermostat', 'Supply and demand', 'Predator-prey'],
      targetAbstraction: 'Systems thinking framework',
    },
  },

  // Elaborative Interrogation
  elaborative: {
    prompts: {
      content: 'Mitochondria produce ATP through cellular respiration',
      targetConcept: 'Energy production in cells',
      type: 'why' as const,
      scaffoldLevel: 'medium' as const,
    },
    causalScaffold: {
      phenomenon: 'Climate change accelerating',
      domain: 'Environmental science',
      priorKnowledge: ['Greenhouse gases', 'Fossil fuels'],
    },
    connectionExercise: {
      newConcept: 'Quantum entanglement',
      priorConcepts: ['Wave-particle duality', 'Probability in quantum mechanics'],
      domain: 'Physics',
    },
  },

  // Learning Science Recommendations
  learningScience: {
    analyzeCourse: {
      courseId: 'BIO101-Fall2024',
      currentPractices: ['Lecture', 'Weekly quizzes', 'Lab work'],
      contentTypes: ['Conceptual', 'Procedural', 'Factual'],
      classSize: 150,
      modality: 'in-person' as const,
    },
    findPatterns: {
      context: 'Large lecture with low engagement',
      goals: ['Increase active learning', 'Improve retention', 'Reduce failure rate'],
    },
    intervention: {
      gap: 'Students struggle to apply concepts to new problems',
      currentState: 'Lecture-heavy, few practice opportunities',
      constraints: ['50-minute class periods', 'Limited TA support'],
      priority: 'high' as const,
    },
  },

  // Student Perspective
  studentPerspective: {
    noviceModel: {
      concept: 'Electric circuits',
      domain: 'Physics',
      priorKnowledge: ['Basic electricity'],
      commonBackgrounds: ['High school physics', 'No engineering experience'],
    },
    prerequisiteGaps: {
      targetConcept: 'Calculus-based physics',
      intendedPrerequisites: ['Algebra', 'Trigonometry', 'Calculus I'],
      studentPopulation: 'First-year engineering students',
    },
    predictConfusion: {
      content: 'The p-value indicates the probability that the null hypothesis is true',
      topic: 'Statistical hypothesis testing',
      studentLevel: 'undergraduate' as const,
    },
  },
};

// Helper type for accessing examples with autocomplete
export type FeatureName = keyof typeof formExamples;
export type ExampleCategory<T extends FeatureName> = keyof (typeof formExamples)[T];

// Helper function to get example with type safety
export function getExample<T extends FeatureName>(
  feature: T,
  category?: ExampleCategory<T>
): any {
  if (category) {
    return formExamples[feature][category as string];
  }
  return formExamples[feature];
}
