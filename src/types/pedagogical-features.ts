import { z } from 'zod';
import { BloomLevelSchema, BloomLevel } from './extended-types';

// ============================================================================
// PEDAGOGICAL FEATURES - COMPREHENSIVE TYPE DEFINITIONS
// All 15 new evidence-based teaching features
// ============================================================================

// ============================================================================
// 1. SPACED REPETITION & RETRIEVAL PRACTICE SYSTEM
// Research: Dunlosky et al. (2013), Roediger & Karpicke (2006)
// ============================================================================

export const SpacingIntervalSchema = z.enum(['1-day', '3-day', '1-week', '2-week', '1-month', '3-month']);
export type SpacingInterval = z.infer<typeof SpacingIntervalSchema>;

export const ReviewItemSchema = z.object({
  id: z.string(),
  conceptId: z.string(),
  conceptName: z.string(),
  originalLecture: z.string(),
  originalDate: z.string(),

  // Spaced repetition tracking
  nextReviewDate: z.string(),
  currentInterval: SpacingIntervalSchema,
  easeFactor: z.number().min(1.3).max(3.0), // SM-2 algorithm
  repetitions: z.number(),
  lastReviewDate: z.string().optional(),
  lastPerformance: z.enum(['again', 'hard', 'good', 'easy']).optional(),

  // Content for review
  reviewPrompt: z.string(),
  expectedResponse: z.string(),
  hints: z.array(z.string()).optional(),
  relatedConcepts: z.array(z.string())
});

export const RetrievalPracticeItemSchema = z.object({
  id: z.string(),
  type: z.enum(['free-recall', 'cued-recall', 'recognition', 'application']),
  prompt: z.string(),
  bloomLevel: BloomLevelSchema,
  difficulty: z.number().min(1).max(5),

  // For pre-class activation
  isPreClassActivation: z.boolean().default(false),
  connectsToPriorKnowledge: z.array(z.string()),

  // Interleaving support
  interleavingCategory: z.string().optional(), // For mixing old + new
  mixWithTopics: z.array(z.string()).optional()
});

export const SpacedRepetitionScheduleSchema = z.object({
  courseId: z.string(),
  studentId: z.string().optional(), // For personalized schedules

  items: z.array(ReviewItemSchema),

  // Daily review recommendations
  dailyReview: z.object({
    date: z.string(),
    itemsDue: z.array(z.string()), // item IDs
    estimatedMinutes: z.number(),
    interleavingMix: z.array(z.object({
      topic: z.string(),
      count: z.number()
    }))
  }),

  // Pre-class prompts for next lecture
  preClassActivation: z.array(z.object({
    lectureDate: z.string(),
    topic: z.string(),
    activationPrompts: z.array(z.string()),
    priorKnowledgeToActivate: z.array(z.string())
  }))
});

export type ReviewItem = z.infer<typeof ReviewItemSchema>;
export type RetrievalPracticeItem = z.infer<typeof RetrievalPracticeItemSchema>;
export type SpacedRepetitionSchedule = z.infer<typeof SpacedRepetitionScheduleSchema>;

// ============================================================================
// 2. FORMATIVE ASSESSMENT DASHBOARD WITH REAL-TIME ANALYTICS
// Research: Hattie & Timperley (2007), Black & Wiliam (1998)
// ============================================================================

export const LivePollSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple-choice', 'numeric', 'word-cloud', 'short-answer', 'confidence-weighted']),
  question: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),

  // Real-time tracking
  responses: z.array(z.object({
    studentId: z.string().optional(), // Anonymous if not provided
    answer: z.string(),
    confidence: z.number().min(1).max(5).optional(),
    timestamp: z.string()
  })),

  status: z.enum(['draft', 'active', 'closed', 'analyzed']),
  launchedAt: z.string().optional(),
  closedAt: z.string().optional()
});

export const MisconceptionTrackerSchema = z.object({
  conceptId: z.string(),
  conceptName: z.string(),

  // Known misconceptions from research/experience
  knownMisconceptions: z.array(z.object({
    id: z.string(),
    description: z.string(),
    frequency: z.number(), // How often observed (0-1)
    correctiveExplanation: z.string(),
    diagnosticQuestion: z.string(),
    relatedWrongAnswers: z.array(z.string())
  })),

  // Real-time detection
  detectedInSession: z.array(z.object({
    misconceptionId: z.string(),
    pollId: z.string(),
    studentCount: z.number(),
    percentageOfClass: z.number(),
    detectedAt: z.string()
  }))
});

export const ExitTicketSchema = z.object({
  id: z.string(),
  lectureId: z.string(),
  date: z.string(),

  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['muddy-point', 'main-takeaway', 'question', 'confidence', 'application']),
    prompt: z.string(),
    required: z.boolean()
  })),

  responses: z.array(z.object({
    studentId: z.string().optional(),
    answers: z.array(z.object({
      questionId: z.string(),
      response: z.string()
    })),
    submittedAt: z.string()
  })),

  analysis: z.object({
    responseRate: z.number(),
    sentimentScore: z.number().min(-1).max(1), // -1 negative, 1 positive
    topConfusions: z.array(z.object({
      theme: z.string(),
      count: z.number(),
      sampleResponses: z.array(z.string())
    })),
    topTakeaways: z.array(z.string()),
    questionsToAddress: z.array(z.string()),
    comprehensionEstimate: z.number().min(0).max(100),
    recommendedActions: z.array(z.string())
  }).optional()
});

export const FormativeAssessmentDashboardSchema = z.object({
  sessionId: z.string(),
  lectureId: z.string(),
  date: z.string(),

  polls: z.array(LivePollSchema),
  exitTicket: ExitTicketSchema.optional(),
  misconceptionTracker: z.array(MisconceptionTrackerSchema),

  realTimeMetrics: z.object({
    currentEngagement: z.number().min(0).max(100),
    comprehensionTrend: z.array(z.object({
      timestamp: z.string(),
      score: z.number()
    })),
    confusionAlerts: z.array(z.object({
      timestamp: z.string(),
      topic: z.string(),
      severity: z.enum(['low', 'medium', 'high']),
      suggestedAction: z.string()
    }))
  }),

  difficultyAdjustment: z.object({
    currentLevel: z.number().min(1).max(5),
    recommendedAdjustment: z.enum(['easier', 'maintain', 'harder']),
    reason: z.string()
  })
});

export type LivePoll = z.infer<typeof LivePollSchema>;
export type MisconceptionTracker = z.infer<typeof MisconceptionTrackerSchema>;
export type ExitTicket = z.infer<typeof ExitTicketSchema>;
export type FormativeAssessmentDashboard = z.infer<typeof FormativeAssessmentDashboardSchema>;

// ============================================================================
// 3. METACOGNITIVE SCAFFOLDING TOOLS
// Research: Zimmerman (2002), Flavell (1979)
// ============================================================================

export const StudyStrategySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),

  // Match to learning context
  bestFor: z.object({
    bloomLevels: z.array(BloomLevelSchema),
    contentTypes: z.array(z.enum(['conceptual', 'procedural', 'factual', 'metacognitive'])),
    learningGoals: z.array(z.enum(['memorization', 'understanding', 'application', 'transfer']))
  }),

  // Evidence base
  effectiveness: z.number().min(0).max(1), // Effect size
  researchCitation: z.string(),

  // Implementation guidance
  howToUse: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  timeRequired: z.string(),

  // Examples
  exampleApplication: z.string()
});

export const SelfExplanationPromptSchema = z.object({
  id: z.string(),
  type: z.enum(['why', 'how', 'what-if', 'compare', 'predict', 'connect']),
  prompt: z.string(),

  // Context
  embeddedAfter: z.string(), // Content ID or description
  targetConcept: z.string(),

  // Scaffolding
  scaffoldLevel: z.enum(['none', 'light', 'moderate', 'heavy']),
  hints: z.array(z.string()).optional(),
  exemplarResponse: z.string().optional()
});

export const ReflectionTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  timing: z.enum(['pre-class', 'during-class', 'post-class', 'weekly', 'unit-end']),

  prompts: z.array(z.object({
    category: z.enum(['learning', 'confusion', 'application', 'strategy', 'goals', 'emotions']),
    prompt: z.string(),
    responseType: z.enum(['text', 'scale', 'checklist'])
  })),

  // For tracking over time
  enableProgressTracking: z.boolean(),
  compareToLastResponse: z.boolean()
});

export const LearningGoalTrackerSchema = z.object({
  studentId: z.string().optional(),
  courseId: z.string(),

  goals: z.array(z.object({
    id: z.string(),
    type: z.enum(['mastery', 'performance', 'process']),
    description: z.string(),
    targetDate: z.string().optional(),
    status: z.enum(['not-started', 'in-progress', 'achieved', 'revised']),

    // Progress tracking
    milestones: z.array(z.object({
      description: z.string(),
      completed: z.boolean(),
      completedDate: z.string().optional()
    })),

    // Self-assessment
    selfRatedProgress: z.number().min(0).max(100),
    lastUpdated: z.string()
  })),

  // Calibration
  predictionAccuracy: z.array(z.object({
    assessmentId: z.string(),
    predictedScore: z.number(),
    actualScore: z.number(),
    date: z.string()
  }))
});

export const MetacognitiveToolkitSchema = z.object({
  courseId: z.string(),

  strategyRecommendations: z.array(StudyStrategySchema),
  selfExplanationPrompts: z.array(SelfExplanationPromptSchema),
  reflectionTemplates: z.array(ReflectionTemplateSchema),
  goalTracker: LearningGoalTrackerSchema.optional(),

  // Calibration tools
  calibrationExercises: z.array(z.object({
    id: z.string(),
    topic: z.string(),
    preAssessmentConfidence: z.number().optional(),
    postAssessmentConfidence: z.number().optional(),
    actualPerformance: z.number().optional(),
    calibrationFeedback: z.string().optional()
  }))
});

export type StudyStrategy = z.infer<typeof StudyStrategySchema>;
export type SelfExplanationPrompt = z.infer<typeof SelfExplanationPromptSchema>;
export type ReflectionTemplate = z.infer<typeof ReflectionTemplateSchema>;
export type LearningGoalTracker = z.infer<typeof LearningGoalTrackerSchema>;
export type MetacognitiveToolkit = z.infer<typeof MetacognitiveToolkitSchema>;

// ============================================================================
// 4. COLLABORATIVE LEARNING ORCHESTRATOR
// Research: Johnson & Johnson (2009), Slavin (1996)
// ============================================================================

export const GroupFormationCriteriaSchema = z.object({
  strategy: z.enum(['heterogeneous', 'homogeneous', 'random', 'interest-based', 'complementary-skills']),

  // For heterogeneous grouping
  diversifyBy: z.array(z.enum(['skill-level', 'background', 'perspective', 'learning-style', 'major'])).optional(),

  // For homogeneous grouping
  groupBy: z.enum(['skill-level', 'interest', 'topic-preference']).optional(),

  // Constraints
  groupSize: z.object({
    min: z.number(),
    max: z.number(),
    ideal: z.number()
  }),

  avoidPairings: z.array(z.object({
    student1: z.string(),
    student2: z.string(),
    reason: z.string()
  })).optional()
});

export const GroupRoleSchema = z.object({
  name: z.string(),
  responsibilities: z.array(z.string()),
  rotationFrequency: z.enum(['never', 'each-activity', 'weekly', 'unit']),

  // Role-specific prompts
  promptsForRole: z.array(z.string()),

  // Accountability
  accountabilityMeasures: z.array(z.string())
});

export const CollaborativeActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['jigsaw', 'think-pair-share', 'peer-teaching', 'group-problem-solving',
                'structured-controversy', 'reciprocal-teaching', 'peer-review', 'fishbowl']),

  duration: z.number(),
  groupSize: z.number(),

  // Structure
  phases: z.array(z.object({
    name: z.string(),
    duration: z.number(),
    instructions: z.string(),
    studentFacing: z.string()
  })),

  roles: z.array(GroupRoleSchema).optional(),

  // Accountability
  individualAccountability: z.object({
    method: z.enum(['individual-quiz', 'random-call', 'written-reflection', 'peer-rating', 'individual-product']),
    description: z.string()
  }),

  positiveInterdependence: z.object({
    type: z.enum(['goal', 'resource', 'role', 'reward', 'task']),
    description: z.string()
  }),

  // Facilitation
  instructorActions: z.array(z.object({
    timing: z.string(),
    action: z.string(),
    lookFor: z.array(z.string())
  })),

  // Materials
  materials: z.object({
    instructorGuide: z.string(),
    studentHandout: z.string(),
    peerFeedbackRubric: z.string().optional()
  })
});

export const PeerFeedbackFrameworkSchema = z.object({
  id: z.string(),
  name: z.string(),

  // Training materials
  trainingRequired: z.boolean(),
  trainingMaterials: z.array(z.object({
    title: z.string(),
    content: z.string(),
    duration: z.number()
  })).optional(),

  // Rubric/criteria
  feedbackCriteria: z.array(z.object({
    criterion: z.string(),
    description: z.string(),
    levels: z.array(z.object({
      level: z.number(),
      description: z.string()
    }))
  })),

  // Sentence starters and prompts
  feedbackPrompts: z.object({
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    questions: z.array(z.string())
  }),

  // Quality control
  feedbackOnFeedback: z.boolean(),
  instructorModeration: z.boolean()
});

export const CollaborativeLearningOrchestratorSchema = z.object({
  courseId: z.string(),

  groupFormation: GroupFormationCriteriaSchema,
  currentGroups: z.array(z.object({
    id: z.string(),
    members: z.array(z.string()),
    roles: z.record(z.string(), z.string()).optional() // studentId -> role
  })),

  activities: z.array(CollaborativeActivitySchema),
  peerFeedbackFramework: PeerFeedbackFrameworkSchema.optional(),

  // Analytics
  groupDynamics: z.array(z.object({
    groupId: z.string(),
    participationBalance: z.number(), // 0-1, higher = more balanced
    productivityScore: z.number(),
    concerns: z.array(z.string())
  }))
});

export type GroupFormationCriteria = z.infer<typeof GroupFormationCriteriaSchema>;
export type GroupRole = z.infer<typeof GroupRoleSchema>;
export type CollaborativeActivity = z.infer<typeof CollaborativeActivitySchema>;
export type PeerFeedbackFramework = z.infer<typeof PeerFeedbackFrameworkSchema>;
export type CollaborativeLearningOrchestrator = z.infer<typeof CollaborativeLearningOrchestratorSchema>;

// ============================================================================
// 5. ADAPTIVE DIFFICULTY PATHWAYS
// Research: Vygotsky (1978), Csikszentmihalyi (1990)
// ============================================================================

export const DiagnosticAssessmentSchema = z.object({
  id: z.string(),
  topic: z.string(),

  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['multiple-choice', 'short-answer', 'demonstration']),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string(),
    diagnosticValue: z.object({
      ifCorrect: z.object({
        mastery: z.array(z.string()),
        readyFor: z.array(z.string())
      }),
      ifIncorrect: z.object({
        gaps: z.array(z.string()),
        needsReview: z.array(z.string())
      })
    })
  })),

  scoringRubric: z.object({
    remedialThreshold: z.number(),
    standardThreshold: z.number(),
    advancedThreshold: z.number()
  })
});

export const LearningPathwaySchema = z.object({
  id: z.string(),
  name: z.string(),
  track: z.enum(['remedial', 'standard', 'challenge', 'accelerated']),

  // Prerequisites
  entryRequirements: z.array(z.string()),
  diagnosticCriteria: z.string(),

  // Content sequence
  modules: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['prerequisite-review', 'core-content', 'practice', 'extension', 'application']),
    content: z.string(),
    estimatedTime: z.number(),

    // Branching logic
    completionCriteria: z.string(),
    onSuccess: z.string(), // next module ID
    onStruggle: z.string() // support module ID
  })),

  // Scaffolding
  scaffoldingLevel: z.enum(['heavy', 'moderate', 'light', 'minimal']),
  justInTimePrerequisites: z.array(z.object({
    triggerCondition: z.string(),
    prerequisiteModule: z.string()
  }))
});

export const AdaptiveDifficultySystemSchema = z.object({
  courseId: z.string(),
  topic: z.string(),

  diagnosticAssessment: DiagnosticAssessmentSchema,
  pathways: z.array(LearningPathwaySchema),

  // Challenge problems for advanced students
  challengeBank: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    difficulty: z.number().min(6).max(10), // Beyond standard 1-5
    bloomLevel: BloomLevelSchema,
    estimatedTime: z.number(),
    solution: z.string(),
    hints: z.array(z.string())
  })),

  // Mastery tracking
  masteryBasedProgression: z.object({
    enabled: z.boolean(),
    masteryThreshold: z.number(), // e.g., 85%
    assessmentAttempts: z.number(), // How many tries allowed
    remediation: z.string() // What happens if not mastered
  })
});

export type DiagnosticAssessment = z.infer<typeof DiagnosticAssessmentSchema>;
export type LearningPathway = z.infer<typeof LearningPathwaySchema>;
export type AdaptiveDifficultySystem = z.infer<typeof AdaptiveDifficultySystemSchema>;

// ============================================================================
// 6. CASE-BASED LEARNING STUDIO
// Research: Bransford et al. (2000), Kolodner (1992)
// ============================================================================

export const CaseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  domain: z.string(),

  // Context and relevance
  realWorldContext: z.string(),
  relevanceToStudents: z.array(z.string()),
  disciplinaryConnections: z.array(z.string()),

  // Case content
  scenario: z.object({
    background: z.string(),
    situation: z.string(),
    stakeholders: z.array(z.object({
      name: z.string(),
      role: z.string(),
      perspective: z.string(),
      interests: z.array(z.string())
    })),
    dataProvided: z.array(z.object({
      type: z.enum(['quantitative', 'qualitative', 'visual', 'document']),
      description: z.string(),
      content: z.string()
    })),
    constraints: z.array(z.string()),
    decision: z.string() // What decision needs to be made
  }),

  // Scaffolding
  complexity: z.enum(['simplified', 'moderate', 'realistic', 'messy']),
  scaffoldingLevel: z.object({
    structureProvided: z.enum(['high', 'medium', 'low']),
    hintAvailability: z.enum(['always', 'on-request', 'after-attempt', 'never']),
    expertModelAvailable: z.boolean()
  }),

  // Analysis framework
  analysisPrompts: z.array(z.object({
    phase: z.enum(['understand', 'analyze', 'evaluate', 'decide', 'reflect']),
    prompt: z.string(),
    scaffoldedVersion: z.string().optional()
  })),

  // Ethics and broader implications
  ethicalConsiderations: z.array(z.string()).optional(),
  interdisciplinaryAngles: z.array(z.object({
    discipline: z.string(),
    perspective: z.string()
  })).optional(),

  // Expert perspective
  expertAnalysis: z.object({
    keyInsights: z.array(z.string()),
    commonMistakes: z.array(z.string()),
    bestPractices: z.array(z.string())
  }).optional(),

  // Decision framework
  decisionCriteria: z.array(z.object({
    criterion: z.string(),
    weight: z.number(),
    howToEvaluate: z.string()
  }))
});

export const CaseBasedLearningStudioSchema = z.object({
  courseId: z.string(),
  topic: z.string(),

  cases: z.array(CaseStudySchema),

  // Industry connections
  professionalPerspectives: z.array(z.object({
    name: z.string(),
    title: z.string(),
    organization: z.string(),
    perspective: z.string(),
    videoLink: z.string().optional()
  })).optional(),

  // Cross-case comparison
  comparativeAnalysis: z.object({
    enabled: z.boolean(),
    comparisonPrompts: z.array(z.string()),
    synthesisActivity: z.string()
  }).optional()
});

export type CaseStudy = z.infer<typeof CaseStudySchema>;
export type CaseBasedLearningStudio = z.infer<typeof CaseBasedLearningStudioSchema>;

// ============================================================================
// 7. MISCONCEPTION DATABASE SYSTEM
// Research: Chi (2008), Vosniadou (1994)
// ============================================================================

export const MisconceptionSchema = z.object({
  id: z.string(),
  topic: z.string(),
  discipline: z.string(),

  // The misconception itself
  misconception: z.string(),
  correctUnderstanding: z.string(),

  // Research base
  prevalence: z.enum(['common', 'frequent', 'occasional', 'rare']),
  persistence: z.enum(['surface', 'moderate', 'deep-seated', 'threshold-concept']),
  researchCitations: z.array(z.string()),

  // Detection
  diagnosticQuestions: z.array(z.object({
    question: z.string(),
    revealsMisconception: z.string(), // Answer indicating misconception
    indicatesUnderstanding: z.string()
  })),

  typicalWrongAnswers: z.array(z.string()),

  // Remediation
  conceptualChangeStrategies: z.array(z.object({
    strategy: z.enum(['cognitive-conflict', 'bridging-analogy', 'refutational-text',
                      'worked-examples', 'contrasting-cases', 'socratic-questioning']),
    description: z.string(),
    implementation: z.string(),
    estimatedTime: z.number()
  })),

  // Related concepts
  prerequisiteGaps: z.array(z.string()),
  relatedMisconceptions: z.array(z.string()),

  // Analogies to repair mental models
  correctiveAnalogies: z.array(z.object({
    analogy: z.string(),
    targetMapping: z.string(),
    limitations: z.array(z.string())
  }))
});

export const MisconceptionDatabaseSchema = z.object({
  discipline: z.string(),

  misconceptions: z.array(MisconceptionSchema),

  // Quick diagnostic bank
  diagnosticBank: z.array(z.object({
    id: z.string(),
    topic: z.string(),
    question: z.string(),
    options: z.array(z.object({
      text: z.string(),
      isCorrect: z.boolean(),
      misconceptionId: z.string().optional() // Links to misconception if wrong
    })),
    explanation: z.string()
  })),

  // Evolution tracking for a cohort
  classProgress: z.array(z.object({
    misconceptionId: z.string(),
    preAssessmentRate: z.number(), // % of class with misconception
    currentRate: z.number(),
    interventionsApplied: z.array(z.string()),
    lastAssessed: z.string()
  })).optional()
});

export type Misconception = z.infer<typeof MisconceptionSchema>;
export type MisconceptionDatabase = z.infer<typeof MisconceptionDatabaseSchema>;

// ============================================================================
// 8. INCLUSIVE & CULTURALLY RESPONSIVE FEATURES
// Research: Gay (2010), Hammond (2014), CAST UDL Guidelines
// ============================================================================

export const InclusiveContentCheckSchema = z.object({
  contentId: z.string(),

  // Representation diversity
  representation: z.object({
    namesUsed: z.array(z.object({
      name: z.string(),
      perceivedBackground: z.string()
    })),
    diversityScore: z.number().min(0).max(100),
    suggestions: z.array(z.string())
  }),

  // Context and examples
  contextAnalysis: z.object({
    contextsUsed: z.array(z.string()),
    culturalAssumptions: z.array(z.string()),
    accessibilityOfExamples: z.enum(['universal', 'mostly-accessible', 'limited', 'exclusive']),
    suggestedAlternatives: z.array(z.string())
  }),

  // Language accessibility
  languageCheck: z.object({
    readabilityScore: z.number(), // Flesch-Kincaid
    jargonCount: z.number(),
    jargonTerms: z.array(z.object({
      term: z.string(),
      definition: z.string().optional(),
      plainLanguageAlternative: z.string()
    })),
    idioms: z.array(z.object({
      phrase: z.string(),
      meaning: z.string(),
      alternative: z.string()
    }))
  }),

  // Accessibility
  accessibilityCheck: z.object({
    hasAltText: z.boolean(),
    colorContrastPasses: z.boolean(),
    multipleModalities: z.boolean(),
    captionsAvailable: z.boolean(),
    issues: z.array(z.string()),
    fixes: z.array(z.string())
  }),

  // Stereotype threat mitigation
  stereotypeThreatCheck: z.object({
    potentialTriggers: z.array(z.string()),
    identitySafeLanguage: z.boolean(),
    growthMindsetLanguage: z.boolean(),
    recommendations: z.array(z.string())
  })
});

export const MultilingualGlossarySchema = z.object({
  courseId: z.string(),

  terms: z.array(z.object({
    id: z.string(),
    termEnglish: z.string(),
    definition: z.string(),
    plainLanguageDefinition: z.string(),

    translations: z.array(z.object({
      language: z.string(),
      term: z.string(),
      translatedDefinition: z.string()
    })),

    pronunciation: z.string().optional(),
    etymology: z.string().optional(),
    commonConfusions: z.array(z.string())
  }))
});

export const InclusiveDesignToolkitSchema = z.object({
  courseId: z.string(),

  contentChecks: z.array(InclusiveContentCheckSchema),
  glossary: MultilingualGlossarySchema,

  // Diverse example generator settings
  diverseExampleSettings: z.object({
    nameDatabase: z.array(z.object({
      name: z.string(),
      gender: z.string(),
      culturalBackground: z.string()
    })),
    contextDatabase: z.array(z.object({
      context: z.string(),
      culturalRelevance: z.array(z.string())
    }))
  }),

  // UDL alignment
  udlChecklist: z.array(z.object({
    principle: z.enum(['engagement', 'representation', 'action-expression']),
    guideline: z.string(),
    implemented: z.boolean(),
    evidence: z.string().optional()
  }))
});

export type InclusiveContentCheck = z.infer<typeof InclusiveContentCheckSchema>;
export type MultilingualGlossary = z.infer<typeof MultilingualGlossarySchema>;
export type InclusiveDesignToolkit = z.infer<typeof InclusiveDesignToolkitSchema>;

// ============================================================================
// 9. COGNITIVE LOAD OPTIMIZER
// Research: Sweller (2011), Mayer (2009)
// ============================================================================

export const WorkedExampleSchema = z.object({
  id: z.string(),
  topic: z.string(),
  problemType: z.string(),

  // The worked example
  problem: z.string(),
  solution: z.array(z.object({
    stepNumber: z.number(),
    action: z.string(),
    explanation: z.string(),
    subgoalLabel: z.string().optional() // For subgoal labeling
  })),

  // Fading structure
  fadingLevel: z.enum(['full', 'partial-1', 'partial-2', 'completion', 'problem-only']),
  fadedSteps: z.array(z.number()), // Which steps are blanked out

  // Self-explanation prompts
  selfExplanationPrompts: z.array(z.object({
    afterStep: z.number(),
    prompt: z.string()
  })),

  // Common errors
  commonErrors: z.array(z.object({
    atStep: z.number(),
    error: z.string(),
    correction: z.string()
  }))
});

export const SlideComplexityAnalysisSchema = z.object({
  slideId: z.string(),
  slideNumber: z.number(),

  metrics: z.object({
    wordCount: z.number(),
    bulletPoints: z.number(),
    images: z.number(),
    diagrams: z.number(),
    animations: z.number(),

    // Cognitive load indicators
    intrinsicLoad: z.number().min(1).max(10), // Concept difficulty
    extraneousLoad: z.number().min(1).max(10), // Unnecessary complexity
    germaneLoad: z.number().min(1).max(10), // Helpful for learning
    totalEstimatedLoad: z.number().min(1).max(10)
  }),

  issues: z.array(z.object({
    type: z.enum(['text-overload', 'split-attention', 'redundancy', 'transient-info',
                  'missing-visual', 'decorative-visual', 'poor-chunking']),
    description: z.string(),
    location: z.string(),
    fix: z.string()
  })),

  multimediaPrinciples: z.object({
    coherence: z.boolean(), // No extraneous material
    signaling: z.boolean(), // Key info highlighted
    redundancy: z.boolean(), // No narration + on-screen text
    spatialContiguity: z.boolean(), // Words near graphics
    temporalContiguity: z.boolean(), // Narration synced with graphics
    segmenting: z.boolean(), // Learner-paced segments
    pretraining: z.boolean(), // Key concepts pre-taught
    modality: z.boolean(), // Narration over on-screen text
    personalization: z.boolean() // Conversational style
  })
});

export const ChunkingRecommendationSchema = z.object({
  contentId: z.string(),
  originalContent: z.string(),

  analysis: z.object({
    currentChunks: z.number(),
    idealChunks: z.number(),
    elementsToGroup: z.array(z.array(z.string())),
    suggestedHierarchy: z.array(z.object({
      level: z.number(),
      label: z.string(),
      content: z.array(z.string())
    }))
  }),

  chunkedVersion: z.array(z.object({
    chunkId: z.string(),
    chunkLabel: z.string(),
    content: z.string(),
    estimatedProcessingTime: z.number()
  }))
});

export const CognitiveLoadOptimizerSchema = z.object({
  courseId: z.string(),

  workedExamples: z.array(WorkedExampleSchema),
  slideAnalyses: z.array(SlideComplexityAnalysisSchema),
  chunkingRecommendations: z.array(ChunkingRecommendationSchema),

  // Overall course cognitive load profile
  courseLoadProfile: z.object({
    lectureByLectureLoad: z.array(z.object({
      lectureId: z.string(),
      averageLoad: z.number(),
      peakLoad: z.number(),
      recommendations: z.array(z.string())
    })),

    overallBalance: z.enum(['well-balanced', 'front-loaded', 'back-loaded', 'uneven']),
    suggestions: z.array(z.string())
  })
});

export type WorkedExample = z.infer<typeof WorkedExampleSchema>;
export type SlideComplexityAnalysis = z.infer<typeof SlideComplexityAnalysisSchema>;
export type ChunkingRecommendation = z.infer<typeof ChunkingRecommendationSchema>;
export type CognitiveLoadOptimizer = z.infer<typeof CognitiveLoadOptimizerSchema>;

// ============================================================================
// 10. GROWTH MINDSET & MOTIVATION BUILDER
// Research: Dweck (2006), Ryan & Deci (2000)
// ============================================================================

export const StruggleNormalizationMessageSchema = z.object({
  id: z.string(),
  context: z.enum(['before-difficult-content', 'after-failure', 'during-practice',
                   'assessment-feedback', 'general-encouragement']),
  message: z.string(),

  // Targeting
  bloomLevel: BloomLevelSchema.optional(),
  topicDifficulty: z.enum(['any', 'high', 'threshold-concept']).optional()
});

export const ProcessPraiseTemplateSchema = z.object({
  id: z.string(),
  situation: z.enum(['correct-answer', 'improvement', 'persistence', 'strategy-use',
                     'help-seeking', 'collaboration', 'revision']),

  // Templates with placeholders
  templates: z.array(z.string()),

  // What to avoid
  avoidPhrases: z.array(z.object({
    phrase: z.string(),
    issue: z.string(),
    alternative: z.string()
  }))
});

export const AttributionTrainingSchema = z.object({
  id: z.string(),

  // Reframing exercises
  reframingExercises: z.array(z.object({
    scenario: z.string(),
    unhelpfulAttribution: z.string(),
    helpfulReframe: z.string(),
    explanation: z.string()
  })),

  // Success/failure attribution prompts
  attributionPrompts: z.object({
    afterSuccess: z.array(z.string()),
    afterStruggle: z.array(z.string())
  })
});

export const ProductiveFailureActivitySchema = z.object({
  id: z.string(),
  topic: z.string(),

  // Phase 1: Generation (before instruction)
  generationPhase: z.object({
    problem: z.string(),
    duration: z.number(),
    constraints: z.array(z.string()),
    allowedResources: z.array(z.string()),

    // Prompts during struggle
    supportPrompts: z.array(z.object({
      triggerCondition: z.string(),
      prompt: z.string()
    }))
  }),

  // Phase 2: Consolidation (instruction)
  consolidationPhase: z.object({
    connections: z.array(z.object({
      studentAttempt: z.string(),
      expertSolution: z.string(),
      bridgingExplanation: z.string()
    })),
    canonicalSolution: z.string(),
    keyInsights: z.array(z.string())
  }),

  // Why failure is productive here
  learningRationale: z.string()
});

export const GrowthMindsetToolkitSchema = z.object({
  courseId: z.string(),

  struggleMessages: z.array(StruggleNormalizationMessageSchema),
  praiseTemplates: z.array(ProcessPraiseTemplateSchema),
  attributionTraining: AttributionTrainingSchema,
  productiveFailureActivities: z.array(ProductiveFailureActivitySchema),

  // Feedback language analyzer
  feedbackLanguageGuidelines: z.object({
    growthMindsetPhrases: z.array(z.string()),
    fixedMindsetPhrases: z.array(z.object({
      phrase: z.string(),
      replacement: z.string()
    })),
    processVsPersonDescriptors: z.array(z.object({
      personFocused: z.string(),
      processFocused: z.string()
    }))
  })
});

export type StruggleNormalizationMessage = z.infer<typeof StruggleNormalizationMessageSchema>;
export type ProcessPraiseTemplate = z.infer<typeof ProcessPraiseTemplateSchema>;
export type AttributionTraining = z.infer<typeof AttributionTrainingSchema>;
export type ProductiveFailureActivity = z.infer<typeof ProductiveFailureActivitySchema>;
export type GrowthMindsetToolkit = z.infer<typeof GrowthMindsetToolkitSchema>;

// ============================================================================
// 11. DESIRABLE DIFFICULTIES ENGINE
// Research: Bjork (1994), Kornell & Bjork (2008)
// ============================================================================

export const GenerationEffectExerciseSchema = z.object({
  id: z.string(),
  topic: z.string(),

  type: z.enum(['complete-the-blank', 'generate-example', 'predict-then-learn',
                'generate-explanation', 'create-analogy', 'generate-question']),

  prompt: z.string(),
  scaffolding: z.enum(['none', 'hints-available', 'partial-structure']),

  // For evaluation
  exemplarResponse: z.string(),
  evaluationCriteria: z.array(z.string())
});

export const InterleavedPracticeSetSchema = z.object({
  id: z.string(),
  title: z.string(),

  // Topics to interleave
  topics: z.array(z.string()),

  // Practice problems with deliberate mixing
  problems: z.array(z.object({
    id: z.string(),
    topic: z.string(),
    problem: z.string(),
    solution: z.string(),

    // Discrimination cue (helps students recognize problem type)
    discriminationHint: z.string().optional()
  })),

  // Ordering strategy
  ordering: z.enum(['random', 'spaced-by-topic', 'increasing-similarity', 'blocked-then-interleaved']),

  // Contrast for discrimination
  contrastingCases: z.array(z.object({
    case1: z.object({ problem: z.string(), solution: z.string() }),
    case2: z.object({ problem: z.string(), solution: z.string() }),
    keyDifference: z.string(),
    discriminationQuestion: z.string()
  })).optional()
});

export const PretestingParadoxActivitySchema = z.object({
  id: z.string(),
  topic: z.string(),

  // Pre-test (before instruction)
  pretest: z.object({
    questions: z.array(z.object({
      question: z.string(),
      expectedDifficulty: z.enum(['impossible', 'very-hard', 'guessable']),
      correctAnswer: z.string()
    })),
    purpose: z.string(), // Why this primes learning
    duration: z.number()
  }),

  // Instruction phase
  instruction: z.object({
    content: z.string(),
    connectionsToPretestQuestions: z.array(z.object({
      pretestQuestion: z.string(),
      instructionalConnection: z.string()
    }))
  }),

  // Post-test for comparison
  posttest: z.object({
    questions: z.array(z.object({
      question: z.string(),
      isParallel: z.boolean(), // True if similar to pretest question
      correctAnswer: z.string()
    }))
  })
});

export const EncodingVariabilityActivitySchema = z.object({
  id: z.string(),
  concept: z.string(),

  // Same concept in different contexts
  variableContexts: z.array(z.object({
    context: z.string(),
    presentation: z.string(),
    practiceProblems: z.array(z.string())
  })),

  // Transfer prompts
  transferPrompts: z.array(z.object({
    novelContext: z.string(),
    prompt: z.string(),
    connectionToLearned: z.string()
  }))
});

export const DesirableDifficultiesEngineSchema = z.object({
  courseId: z.string(),

  generationExercises: z.array(GenerationEffectExerciseSchema),
  interleavedPracticeSets: z.array(InterleavedPracticeSetSchema),
  pretestingActivities: z.array(PretestingParadoxActivitySchema),
  encodingVariabilityActivities: z.array(EncodingVariabilityActivitySchema),

  // Testing effect maximizer
  retrievalPracticeSchedule: z.object({
    frequency: z.enum(['every-class', 'weekly', 'spaced']),
    format: z.enum(['low-stakes-quiz', 'practice-test', 'retrieval-prompts']),
    feedbackTiming: z.enum(['immediate', 'delayed', 'mixed'])
  }),

  // Instructor guidance
  implementationNotes: z.object({
    studentResistanceStrategies: z.array(z.string()),
    gradingConsiderations: z.array(z.string()),
    communicatingPurpose: z.string()
  })
});

export type GenerationEffectExercise = z.infer<typeof GenerationEffectExerciseSchema>;
export type InterleavedPracticeSet = z.infer<typeof InterleavedPracticeSetSchema>;
export type PretestingParadoxActivity = z.infer<typeof PretestingParadoxActivitySchema>;
export type EncodingVariabilityActivity = z.infer<typeof EncodingVariabilityActivitySchema>;
export type DesirableDifficultiesEngine = z.infer<typeof DesirableDifficultiesEngineSchema>;

// ============================================================================
// 12. ELABORATIVE INTERROGATION SYSTEM
// Research: Dunlosky et al. (2013), Pressley et al. (1987)
// ============================================================================

export const ElaborativePromptSchema = z.object({
  id: z.string(),
  type: z.enum(['why', 'how', 'what-if', 'compare-contrast', 'cause-effect',
                'predict', 'connect', 'justify', 'evaluate']),

  prompt: z.string(),

  // Context
  targetContent: z.string(),
  insertAfter: z.string(), // Content ID or description

  // Scaffolding options
  scaffoldedVersions: z.array(z.object({
    level: z.enum(['heavy', 'moderate', 'light']),
    prompt: z.string()
  })),

  // For self-assessment
  exemplarResponse: z.string(),
  responseQualityCriteria: z.array(z.string())
});

export const CausalReasoningScaffoldSchema = z.object({
  id: z.string(),
  phenomenon: z.string(),

  // Causal chain
  causalChain: z.array(z.object({
    cause: z.string(),
    mechanism: z.string(),
    effect: z.string(),
    evidence: z.string().optional()
  })),

  // Prompts for discovering causation
  discoveryPrompts: z.array(z.string()),

  // Counterfactual reasoning
  counterfactuals: z.array(z.object({
    ifNot: z.string(),
    then: z.string(),
    because: z.string()
  }))
});

export const ConnectionMakingExerciseSchema = z.object({
  id: z.string(),
  newConcept: z.string(),

  // Prior knowledge connections
  priorKnowledgeLinks: z.array(z.object({
    priorConcept: z.string(),
    relationship: z.enum(['analogous', 'contrasting', 'prerequisite', 'application', 'example']),
    connectionExplanation: z.string()
  })),

  // Student prompts
  connectionPrompts: z.array(z.string()),

  // Concept map activity
  conceptMapActivity: z.object({
    centralConcept: z.string(),
    nodesToConnect: z.array(z.string()),
    relationshipTypes: z.array(z.string()),
    exemplarMap: z.string()
  }).optional()
});

export const StudentGeneratedQuestionsSchema = z.object({
  id: z.string(),
  topic: z.string(),

  // Question generation training
  trainingExamples: z.array(z.object({
    content: z.string(),
    goodQuestions: z.array(z.object({
      question: z.string(),
      qualityExplanation: z.string()
    })),
    weakQuestions: z.array(z.object({
      question: z.string(),
      improvement: z.string()
    }))
  })),

  // Question stems
  questionStems: z.object({
    deepProcessing: z.array(z.string()),
    surfaceLevel: z.array(z.string()), // To avoid
    comparison: z.array(z.string()),
    application: z.array(z.string())
  }),

  // Quality criteria
  qualityCriteria: z.array(z.object({
    criterion: z.string(),
    exemplar: z.string(),
    nonExemplar: z.string()
  }))
});

export const ElaborativeInterrogationSystemSchema = z.object({
  courseId: z.string(),

  elaborativePrompts: z.array(ElaborativePromptSchema),
  causalScaffolds: z.array(CausalReasoningScaffoldSchema),
  connectionExercises: z.array(ConnectionMakingExerciseSchema),
  questionGenerationTraining: z.array(StudentGeneratedQuestionsSchema),

  // Assessment integration
  justificationRequirements: z.object({
    assessmentsRequiringJustification: z.array(z.string()),
    justificationRubric: z.array(z.object({
      level: z.number(),
      description: z.string(),
      example: z.string()
    }))
  })
});

export type ElaborativePrompt = z.infer<typeof ElaborativePromptSchema>;
export type CausalReasoningScaffold = z.infer<typeof CausalReasoningScaffoldSchema>;
export type ConnectionMakingExercise = z.infer<typeof ConnectionMakingExerciseSchema>;
export type StudentGeneratedQuestions = z.infer<typeof StudentGeneratedQuestionsSchema>;
export type ElaborativeInterrogationSystem = z.infer<typeof ElaborativeInterrogationSystemSchema>;

// ============================================================================
// 13. TRANSFER-ORIENTED DESIGN
// Research: Perkins & Salomon (1992), Barnett & Ceci (2002)
// ============================================================================

export const TransferDistanceSchema = z.enum(['near', 'moderate', 'far']);
export type TransferDistance = z.infer<typeof TransferDistanceSchema>;

export const TransferActivitySchema = z.object({
  id: z.string(),
  sourceConcept: z.string(),
  sourceContext: z.string(),

  // Transfer target
  targetContext: z.string(),
  transferDistance: TransferDistanceSchema,

  // The activity
  activity: z.object({
    setup: z.string(),
    task: z.string(),
    scaffolding: z.array(z.object({
      level: z.enum(['heavy', 'moderate', 'light', 'none']),
      support: z.string()
    }))
  }),

  // Key abstractions
  underlyingPrinciple: z.string(),
  deepStructure: z.string(),
  surfaceFeaturesToIgnore: z.array(z.string()),

  // Bridging
  bridgingPrompts: z.array(z.string()),
  huggingActivities: z.array(z.string()) // Cues that remind of original context
});

export const AnalogicalTransferExerciseSchema = z.object({
  id: z.string(),

  // Source analog
  sourceCase: z.object({
    domain: z.string(),
    situation: z.string(),
    solution: z.string(),
    underlyingStructure: z.string()
  }),

  // Target analog
  targetCase: z.object({
    domain: z.string(),
    situation: z.string(),
    // Solution to be discovered through analogy
    structuralMapping: z.array(z.object({
      sourceElement: z.string(),
      targetElement: z.string(),
      relationship: z.string()
    }))
  }),

  // Scaffolding
  hints: z.array(z.object({
    level: z.number(),
    hint: z.string()
  })),

  // Reflection
  abstractionPrompts: z.array(z.string())
});

export const AbstractionLadderSchema = z.object({
  id: z.string(),
  concept: z.string(),

  // Levels of abstraction
  levels: z.array(z.object({
    level: z.enum(['concrete-specific', 'concrete-general', 'abstract-specific', 'abstract-general']),
    description: z.string(),
    examples: z.array(z.string()),
    language: z.array(z.string()) // Key terms at this level
  })),

  // Movement exercises
  ascendingExercises: z.array(z.object({
    from: z.string(),
    prompt: z.string(), // Move toward general principle
    targetAbstraction: z.string()
  })),

  descendingExercises: z.array(z.object({
    from: z.string(),
    prompt: z.string(), // Move toward concrete application
    targetContext: z.string()
  }))
});

export const TransferOrientedDesignSchema = z.object({
  courseId: z.string(),

  transferActivities: z.array(TransferActivitySchema),
  analogicalExercises: z.array(AnalogicalTransferExerciseSchema),
  abstractionLadders: z.array(AbstractionLadderSchema),

  // Application scenarios
  novelApplicationScenarios: z.array(z.object({
    id: z.string(),
    scenario: z.string(),
    relevantConcepts: z.array(z.string()),
    transferDistance: TransferDistanceSchema,
    adaptationRequired: z.string(),
    solution: z.string()
  })),

  // Cross-disciplinary connections
  crossDisciplinaryLinks: z.array(z.object({
    concept: z.string(),
    disciplineA: z.string(),
    disciplineB: z.string(),
    connection: z.string(),
    jointActivity: z.string().optional()
  }))
});

export type TransferActivity = z.infer<typeof TransferActivitySchema>;
export type AnalogicalTransferExercise = z.infer<typeof AnalogicalTransferExerciseSchema>;
export type AbstractionLadder = z.infer<typeof AbstractionLadderSchema>;
export type TransferOrientedDesign = z.infer<typeof TransferOrientedDesignSchema>;

// ============================================================================
// 14. LEARNING SCIENCE RECOMMENDATIONS ENGINE
// Meta-analysis and pattern recognition for pedagogical improvement
// ============================================================================

export const PedagogicalPatternSchema = z.object({
  id: z.string(),
  patternName: z.string(),

  // When this pattern applies
  context: z.object({
    contentType: z.array(z.enum(['conceptual', 'procedural', 'factual', 'metacognitive'])),
    bloomLevels: z.array(BloomLevelSchema),
    classSizes: z.array(z.enum(['small', 'medium', 'large', 'massive'])),
    modalities: z.array(z.enum(['in-person', 'online', 'hybrid']))
  }),

  // The recommendation
  recommendation: z.object({
    technique: z.string(),
    implementation: z.string(),
    expectedImpact: z.enum(['low', 'medium', 'high', 'very-high']),
    effortRequired: z.enum(['minimal', 'moderate', 'significant']),
    timeToSeeResults: z.string()
  }),

  // Evidence base
  evidence: z.object({
    effectSize: z.number(),
    researchQuality: z.enum(['meta-analysis', 'rct', 'quasi-experimental', 'observational']),
    citations: z.array(z.string()),
    caveats: z.array(z.string())
  }),

  // Implementation examples
  examples: z.array(z.object({
    discipline: z.string(),
    description: z.string(),
    outcome: z.string()
  }))
});

export const CourseAnalysisSchema = z.object({
  courseId: z.string(),

  // Current state analysis
  currentPractices: z.array(z.object({
    practice: z.string(),
    frequency: z.enum(['never', 'rarely', 'sometimes', 'often', 'always']),
    effectiveness: z.enum(['unknown', 'low', 'medium', 'high']).optional()
  })),

  // Gaps identified
  gaps: z.array(z.object({
    area: z.string(),
    currentState: z.string(),
    idealState: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'critical'])
  })),

  // Strengths to leverage
  strengths: z.array(z.object({
    strength: z.string(),
    howToLeverage: z.string()
  }))
});

export const InterventionSuggestionSchema = z.object({
  id: z.string(),
  targetGap: z.string(),

  // The intervention
  intervention: z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(['assessment', 'engagement', 'content-delivery', 'feedback',
                      'practice', 'metacognition', 'collaboration', 'motivation'])
  }),

  // Implementation plan
  implementation: z.object({
    steps: z.array(z.string()),
    resourcesNeeded: z.array(z.string()),
    estimatedPrepTime: z.number(),
    pilotSuggestion: z.string()
  }),

  // Expected outcomes
  outcomes: z.object({
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string()),
    measurableIndicators: z.array(z.string())
  }),

  // Related patterns
  basedOnPatterns: z.array(z.string()) // pattern IDs
});

export const LearningScienzeRecommendationsEngineSchema = z.object({
  // Pattern database
  patterns: z.array(PedagogicalPatternSchema),

  // Course-specific analysis
  courseAnalysis: CourseAnalysisSchema,

  // Prioritized suggestions
  suggestions: z.array(InterventionSuggestionSchema),

  // Professional development
  professionalDevelopment: z.array(z.object({
    topic: z.string(),
    format: z.enum(['article', 'video', 'workshop', 'book', 'course']),
    resource: z.string(),
    estimatedTime: z.number(),
    relevanceScore: z.number()
  })),

  // Comparative effectiveness
  comparativeAnalysis: z.object({
    techniqueComparisons: z.array(z.object({
      technique1: z.string(),
      technique2: z.string(),
      context: z.string(),
      moreEffective: z.string(),
      byHowMuch: z.string(),
      conditions: z.string()
    }))
  })
});

export type PedagogicalPattern = z.infer<typeof PedagogicalPatternSchema>;
export type CourseAnalysis = z.infer<typeof CourseAnalysisSchema>;
export type InterventionSuggestion = z.infer<typeof InterventionSuggestionSchema>;
export type LearningScienzeRecommendationsEngine = z.infer<typeof LearningScienzeRecommendationsEngineSchema>;

// ============================================================================
// 15. STUDENT PERSPECTIVE SIMULATOR
// Anticipating student experience and struggles
// ============================================================================

export const NoviceMentalModelSchema = z.object({
  concept: z.string(),

  // How novices typically think
  typicalNoviceModel: z.object({
    beliefs: z.array(z.string()),
    assumptions: z.array(z.string()),
    missingConnections: z.array(z.string()),
    overSimplifications: z.array(z.string())
  }),

  // Expert vs novice comparison
  expertNoviceContrast: z.array(z.object({
    aspect: z.string(),
    novicePerspective: z.string(),
    expertPerspective: z.string(),
    bridgingPath: z.string()
  })),

  // What might confuse novices
  confusionSources: z.array(z.object({
    source: z.string(),
    whyConfusing: z.string(),
    howToAddress: z.string()
  }))
});

export const PrerequisiteGapDetectorSchema = z.object({
  targetConcept: z.string(),

  // Required prior knowledge
  prerequisites: z.array(z.object({
    concept: z.string(),
    importance: z.enum(['essential', 'helpful', 'nice-to-have']),
    typicallyMastered: z.number(), // % of students who have this
    gapIndicators: z.array(z.string()), // Signs a student lacks this
    justInTimeSupport: z.string()
  })),

  // Common gap patterns
  commonGapPatterns: z.array(z.object({
    pattern: z.string(),
    affectedPrerequisites: z.array(z.string()),
    typicalBackground: z.string(),
    interventionSuggestion: z.string()
  }))
});

export const ConfusionPointPredictorSchema = z.object({
  contentId: z.string(),
  topic: z.string(),

  predictedConfusionPoints: z.array(z.object({
    location: z.string(),
    description: z.string(),
    likelihood: z.enum(['low', 'medium', 'high', 'very-high']),

    causes: z.array(z.enum([
      'terminology', 'abstraction-level', 'prerequisite-gap', 'counterintuitive',
      'information-density', 'ambiguity', 'notation', 'hidden-assumptions'
    ])),

    preventionStrategies: z.array(z.string()),
    recoveryStrategies: z.array(z.string())
  })),

  // Threshold concepts (particularly difficult transformative concepts)
  thresholdConcepts: z.array(z.object({
    concept: z.string(),
    whyThreshold: z.string(),
    typicalStruggleDuration: z.string(),
    breakthroughIndicators: z.array(z.string()),
    supportStrategies: z.array(z.string())
  }))
});

export const ReadabilityAnalysisSchema = z.object({
  contentId: z.string(),

  metrics: z.object({
    fleschKincaid: z.number(),
    fleschReadingEase: z.number(),
    averageSentenceLength: z.number(),
    averageSyllablesPerWord: z.number(),
    technicalTermDensity: z.number(), // Terms per 100 words
    conceptDensity: z.number() // New concepts per paragraph
  }),

  issues: z.array(z.object({
    type: z.enum(['long-sentence', 'passive-voice', 'jargon', 'concept-cluster',
                  'missing-transition', 'ambiguous-pronoun', 'undefined-term']),
    location: z.string(),
    original: z.string(),
    suggestion: z.string()
  })),

  audienceAppropriate: z.object({
    targetAudience: z.string(),
    currentLevel: z.string(),
    match: z.enum(['appropriate', 'too-simple', 'too-complex']),
    adjustmentSuggestions: z.array(z.string())
  })
});

export const TimeOnTaskEstimatorSchema = z.object({
  contentId: z.string(),

  // Task breakdown
  tasks: z.array(z.object({
    task: z.string(),
    type: z.enum(['reading', 'watching', 'practice', 'problem-solving', 'writing',
                  'research', 'collaboration', 'reflection']),
    instructorEstimate: z.number(),
    realisticEstimate: z.number(),
    rangeMin: z.number(),
    rangeMax: z.number(),

    // Factors affecting time
    variabilityFactors: z.array(z.string())
  })),

  // Cumulative load
  weeklyTotal: z.object({
    instructorExpected: z.number(),
    realisticMean: z.number(),
    percentile90: z.number(), // Time for slower students
    comparedToNorm: z.enum(['light', 'typical', 'heavy', 'excessive'])
  }),

  // Pacing recommendations
  pacingAdvice: z.array(z.string())
});

export const StudentPerspectiveSimulatorSchema = z.object({
  courseId: z.string(),

  noviceMentalModels: z.array(NoviceMentalModelSchema),
  prerequisiteAnalysis: z.array(PrerequisiteGapDetectorSchema),
  confusionPredictions: z.array(ConfusionPointPredictorSchema),
  readabilityAnalyses: z.array(ReadabilityAnalysisSchema),
  timeEstimates: z.array(TimeOnTaskEstimatorSchema),

  // Overall student experience prediction
  overallExperiencePrediction: z.object({
    engagementForecast: z.enum(['low', 'moderate', 'high']),
    difficultyPerception: z.enum(['too-easy', 'appropriate', 'challenging', 'overwhelming']),
    keyRisks: z.array(z.object({
      risk: z.string(),
      likelihood: z.enum(['low', 'medium', 'high']),
      mitigation: z.string()
    })),
    recommendedAdjustments: z.array(z.string())
  })
});

export type NoviceMentalModel = z.infer<typeof NoviceMentalModelSchema>;
export type PrerequisiteGapDetector = z.infer<typeof PrerequisiteGapDetectorSchema>;
export type ConfusionPointPredictor = z.infer<typeof ConfusionPointPredictorSchema>;
export type ReadabilityAnalysis = z.infer<typeof ReadabilityAnalysisSchema>;
export type TimeOnTaskEstimator = z.infer<typeof TimeOnTaskEstimatorSchema>;
export type StudentPerspectiveSimulator = z.infer<typeof StudentPerspectiveSimulatorSchema>;
