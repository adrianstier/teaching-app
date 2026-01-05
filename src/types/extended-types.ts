import { z } from 'zod';

// ============================================================================
// EXTENDED TYPE DEFINITIONS FOR COMPREHENSIVE FEATURES
// ============================================================================

// Bloom's Taxonomy Types
export const BloomLevelSchema = z.enum([
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
  'create'
]);

export type BloomLevel = z.infer<typeof BloomLevelSchema>;

export const BloomVerbsByLevel: Record<BloomLevel, string[]> = {
  remember: ['define', 'list', 'recall', 'identify', 'name', 'state', 'describe'],
  understand: ['explain', 'summarize', 'paraphrase', 'classify', 'compare', 'interpret'],
  apply: ['apply', 'demonstrate', 'solve', 'use', 'execute', 'implement'],
  analyze: ['analyze', 'differentiate', 'examine', 'distinguish', 'categorize', 'investigate'],
  evaluate: ['evaluate', 'justify', 'critique', 'assess', 'argue', 'defend'],
  create: ['create', 'design', 'construct', 'develop', 'formulate', 'synthesize']
};

// ============================================================================
// ENHANCED LECTURE BLUEPRINT
// ============================================================================

export const CognitiveLoadLevel = z.enum(['introductory', 'intermediate', 'advanced']);
export type CognitiveLoadLevel = z.infer<typeof CognitiveLoadLevel>;

export const ClassContextSchema = z.enum(['lecture', 'lab', 'seminar', 'online', 'hybrid']);
export type ClassContext = z.infer<typeof ClassContextSchema>;

export const CheckpointSchema = z.object({
  id: z.string(),
  timing: z.number(), // minutes into lecture
  type: z.enum(['poll', 'think-pair-share', 'quick-write', 'show-of-hands', 'question']),
  prompt: z.string(),
  expectedResponse: z.string(),
  fallbackAction: z.string() // What to do if students are confused
});

export const EnhancedLectureBlueprintSchema = z.object({
  topic: z.string(),
  duration: z.number(),
  cognitiveLoad: CognitiveLoadLevel,
  classContext: ClassContextSchema,

  structure: z.object({
    hook: z.object({
      duration: z.number(),
      description: z.string(),
      script: z.string(),
      materials: z.array(z.string()).optional()
    }),

    coreSegments: z.array(z.object({
      id: z.string(),
      title: z.string(),
      duration: z.number(),
      explanation: z.string(),
      examples: z.array(z.string()),
      commonMisconceptions: z.array(z.string()).optional()
    })),

    activities: z.array(z.object({
      id: z.string(),
      type: z.string(),
      duration: z.number(),
      instructions: z.string(),
      studentFacing: z.string(),
      facilitationNotes: z.string()
    })),

    checkpoints: z.array(CheckpointSchema),

    wrapUp: z.object({
      duration: z.number(),
      summary: z.string(),
      nextClassPreview: z.string(),
      assignmentHandoff: z.string().optional()
    })
  }),

  alternativePaths: z.object({
    ifAhead: z.array(z.object({
      activity: z.string(),
      duration: z.number()
    })).optional(),
    ifBehind: z.array(z.object({
      skip: z.string(),
      compress: z.string()
    })).optional(),
    ifConfused: z.array(z.object({
      reteach: z.string(),
      alternative: z.string()
    })).optional()
  }),

  estimatedCognitiveLoad: z.number(), // 1-10 scale
  scaffoldingNotes: z.string()
});

export type EnhancedLectureBlueprint = z.infer<typeof EnhancedLectureBlueprintSchema>;
export type Checkpoint = z.infer<typeof CheckpointSchema>;

// ============================================================================
// LEARNING OUTCOMES
// ============================================================================

export const LearningOutcomeSchema = z.object({
  id: z.string(),
  statement: z.string(),
  bloomLevel: BloomLevelSchema,
  verb: z.string(),
  object: z.string(),
  context: z.string().optional(),

  coverage: z.object({
    lectures: z.array(z.string()),
    activities: z.array(z.string()),
    assessments: z.array(z.string())
  }),

  status: z.enum(['over-covered', 'adequate', 'under-covered', 'missing']),
  suggestedActivities: z.array(z.string()).optional(),
  assessmentAlignment: z.number() // 0-1 score
});

export type LearningOutcome = z.infer<typeof LearningOutcomeSchema>;

// ============================================================================
// EXERCISE GENERATION
// ============================================================================

export const QuestionTypeSchema = z.enum([
  'multiple-choice',
  'short-answer',
  'essay',
  'calculation',
  'data-interpretation',
  'coding',
  'diagram',
  'true-false',
  'matching',
  'fill-in-blank'
]);

export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const ExercisePurposeSchema = z.enum(['practice', 'formative', 'summative']);
export type ExercisePurpose = z.infer<typeof ExercisePurposeSchema>;

export const ClassTypeSchema = z.enum(['STEM', 'humanities', 'social-science', 'lab', 'seminar']);
export type ClassType = z.infer<typeof ClassTypeSchema>;

export const ExerciseConfigSchema = z.object({
  topic: z.string(),
  bloomLevel: BloomLevelSchema,
  difficulty: z.number().min(1).max(5),
  questionType: QuestionTypeSchema,
  purpose: ExercisePurposeSchema,
  classType: ClassTypeSchema,
  variants: z.number().default(1),
  includeRubric: z.boolean().default(false),
  includeSolution: z.boolean().default(true),
  includeDistractors: z.boolean().default(true) // For MCQs
});

export type ExerciseConfig = z.infer<typeof ExerciseConfigSchema>;

export const RubricCriterionSchema = z.object({
  criterion: z.string(),
  points: z.number(),
  excellent: z.string(),
  good: z.string(),
  needsWork: z.string(),
  commonErrors: z.array(z.string()).optional()
});

export const ExerciseSchema = z.object({
  id: z.string(),
  topic: z.string(),
  questionType: QuestionTypeSchema,
  bloomLevel: BloomLevelSchema,
  difficulty: z.number(),

  question: z.string(),
  options: z.array(z.string()).optional(), // For MCQs
  correctAnswer: z.string(),
  distractors: z.array(z.object({
    option: z.string(),
    misconception: z.string()
  })).optional(),

  solution: z.object({
    steps: z.array(z.string()),
    explanation: z.string(),
    commonMistakes: z.array(z.string()).optional()
  }),

  rubric: z.array(RubricCriterionSchema).optional(),

  metadata: z.object({
    estimatedTime: z.number(), // minutes
    prerequisites: z.array(z.string()),
    learningOutcomes: z.array(z.string())
  })
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type RubricCriterion = z.infer<typeof RubricCriterionSchema>;

// ============================================================================
// SYLLABUS ANALYSIS
// ============================================================================

export const WeekPlanSchema = z.object({
  weekNumber: z.number(),
  topics: z.array(z.string()),
  readings: z.array(z.string()).optional(),
  assignments: z.array(z.object({
    title: z.string(),
    dueDate: z.string(),
    estimatedHours: z.number().optional()
  })).optional(),
  estimatedStudentHours: z.number()
});

export const ConceptMapSchema = z.object({
  nodes: z.array(z.object({
    id: z.string(),
    concept: z.string(),
    week: z.number(),
    complexity: z.enum(['basic', 'intermediate', 'advanced'])
  })),
  edges: z.array(z.object({
    from: z.string(), // prerequisite
    to: z.string(), // dependent concept
    strength: z.enum(['required', 'recommended', 'related'])
  }))
});

export const WorkloadAnalysisSchema = z.object({
  weeklyBreakdown: z.array(z.object({
    week: z.number(),
    topics: z.number(),
    assignmentHours: z.number(),
    readingPages: z.number(),
    totalLoad: z.number(), // weighted score
    status: z.enum(['light', 'moderate', 'heavy', 'overloaded'])
  })),

  gaps: z.array(z.object({
    outcomeId: z.string(),
    description: z.string(),
    severity: z.enum(['minor', 'moderate', 'critical'])
  })),

  recommendations: z.array(z.object({
    type: z.enum(['reorder', 'split', 'merge', 'add-practice', 'reduce-load']),
    description: z.string(),
    affectedWeeks: z.array(z.number())
  }))
});

export const SyllabusAnalysisSchema = z.object({
  rawContent: z.string(),
  parsedData: z.object({
    courseTitle: z.string(),
    term: z.string(),
    instructor: z.string().optional(),
    learningOutcomes: z.array(z.string()),
    weeklySchedule: z.array(WeekPlanSchema)
  }),
  conceptMap: ConceptMapSchema,
  workloadAnalysis: WorkloadAnalysisSchema,
  overallScore: z.number(), // 0-100
  improvementPriority: z.array(z.string())
});

export type SyllabusAnalysis = z.infer<typeof SyllabusAnalysisSchema>;
export type WeekPlan = z.infer<typeof WeekPlanSchema>;
export type ConceptMap = z.infer<typeof ConceptMapSchema>;
export type WorkloadAnalysis = z.infer<typeof WorkloadAnalysisSchema>;

// ============================================================================
// SLIDE CRITIQUE
// ============================================================================

export const SlideIssueSchema = z.object({
  slideNumber: z.number(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.enum([
    'text-density',
    'visual-balance',
    'cognitive-load',
    'example-quality',
    'accessibility',
    'clarity'
  ]),
  description: z.string(),
  specificIssue: z.string(),
  suggestedFix: z.string()
});

export const SlideCritiqueSchema = z.object({
  totalSlides: z.number(),
  overallScore: z.number(), // 0-100

  issues: z.array(SlideIssueSchema),

  metrics: z.object({
    avgWordsPerSlide: z.number(),
    slidesWithImages: z.number(),
    slidesWithExamples: z.number(),
    accessibilityScore: z.number() // 0-100
  }),

  recommendations: z.array(z.object({
    priority: z.enum(['high', 'medium', 'low']),
    action: z.string(),
    slides: z.array(z.number()),
    quickFix: z.string().optional()
  }))
});

export type SlideCritique = z.infer<typeof SlideCritiqueSchema>;
export type SlideIssue = z.infer<typeof SlideIssueSchema>;

// ============================================================================
// MULTI-REPRESENTATION
// ============================================================================

export const MultiRepresentationSchema = z.object({
  concept: z.string(),
  representations: z.object({
    formal: z.string(),
    plain: z.string(),
    example: z.string(),
    visual: z.object({
      description: z.string(),
      suggestedDiagram: z.string(),
      alternativeMetaphors: z.array(z.string()).optional()
    }),
    mathematical: z.string().optional(),
    historical: z.string().optional(),
    misconception: z.string().optional()
  }),
  teachingSequence: z.array(z.string()),
  targetAudiences: z.object({
    novice: z.string(),
    intermediate: z.string(),
    advanced: z.string()
  })
});

export type MultiRepresentation = z.infer<typeof MultiRepresentationSchema>;

// ============================================================================
// FEEDBACK & ANALYTICS
// ============================================================================

export const MicroFeedbackSurveySchema = z.object({
  id: z.string(),
  lectureId: z.string(),
  weekNumber: z.number(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['text', 'scale', 'choice'])
  })),
  responses: z.array(z.object({
    questionId: z.string(),
    answer: z.string()
  })).optional()
});

export const FeedbackSummarySchema = z.object({
  week: z.number(),
  responseRate: z.number(),
  overallSentiment: z.enum(['positive', 'neutral', 'negative']),
  topConfusions: z.array(z.string()),
  quotesToReview: z.array(z.string()),
  recommendations: z.array(z.string()),
  trafficLight: z.enum(['green', 'yellow', 'red'])
});

export type MicroFeedbackSurvey = z.infer<typeof MicroFeedbackSurveySchema>;
export type FeedbackSummary = z.infer<typeof FeedbackSummarySchema>;

// ============================================================================
// ACTIVE LEARNING TEMPLATES
// ============================================================================

export const ActivityTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    'think-pair-share',
    'jigsaw',
    'debate',
    'minute-paper',
    'concept-map',
    'case-study',
    'peer-instruction',
    'gallery-walk'
  ]),
  duration: z.number(),
  groupSize: z.string(),

  instructorScript: z.object({
    setup: z.string(),
    duringActivity: z.array(z.string()),
    debrief: z.string(),
    timing: z.object({
      setup: z.number(),
      activity: z.number(),
      debrief: z.number()
    })
  }),

  studentHandout: z.string(),

  materials: z.array(z.string()),
  assessment: z.object({
    method: z.string(),
    criteria: z.array(z.string())
  }).optional()
});

export type ActivityTemplate = z.infer<typeof ActivityTemplateSchema>;

// ============================================================================
// COURSE-LEVEL TYPES
// ============================================================================

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  term: z.string(),
  instructor: z.string(),

  syllabus: SyllabusAnalysisSchema.optional(),
  learningOutcomes: z.array(LearningOutcomeSchema),
  lectures: z.array(z.string()), // lecture IDs
  assessments: z.array(z.string()), // assessment IDs

  metadata: z.object({
    created: z.date(),
    lastModified: z.date(),
    term: z.string(),
    students: z.number().optional()
  })
});

export type Course = z.infer<typeof CourseSchema>;