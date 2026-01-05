import { z } from 'zod';

// Core data structures for the lecture development system

export const LearningObjectiveSchema = z.object({
  id: z.string(),
  objective: z.string(),
  bloomLevel: z.enum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']),
  measurable: z.boolean(),
  assessmentStrategy: z.string().optional()
});

export const ConceptNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  prerequisites: z.array(z.string()),
  relatedConcepts: z.array(z.string()),
  complexity: z.enum(['basic', 'intermediate', 'advanced']),
  estimatedTime: z.number() // in minutes
});

export const LectureBriefSchema = z.object({
  title: z.string(),
  duration: z.number(), // in minutes
  topic: z.string(),
  audienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  prerequisites: z.array(z.string()),
  mainGoals: z.array(z.string()),
  constraints: z.array(z.string()).optional(),
  preferredStyle: z.string().optional(),
  specialRequirements: z.array(z.string()).optional()
});

export const LectureSegmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number(),
  type: z.enum(['introduction', 'content', 'activity', 'transition', 'summary', 'assessment']),
  content: z.string(),
  speakerNotes: z.string(),
  visualElements: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional()
});

export const ActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['think-pair-share', 'poll', 'discussion', 'problem-solving', 'reflection', 'quiz']),
  duration: z.number(),
  instructions: z.string(),
  materials: z.array(z.string()).optional(),
  expectedOutcomes: z.array(z.string()),
  facilitation: z.string()
});

export const SlideSpecificationSchema = z.object({
  slideNumber: z.number(),
  title: z.string(),
  layout: z.enum(['title', 'content', 'two-column', 'image-focus', 'comparison', 'process']),
  content: z.object({
    mainText: z.string().optional(),
    bulletPoints: z.array(z.string()).optional(),
    images: z.array(z.object({
      description: z.string(),
      placement: z.string(),
      caption: z.string().optional()
    })).optional(),
    diagrams: z.array(z.object({
      type: z.string(),
      elements: z.array(z.string()),
      relationships: z.array(z.string())
    })).optional()
  }),
  speakerNotes: z.string(),
  animations: z.array(z.string()).optional(),
  timing: z.number() // suggested time in seconds
});

export const LecturePackageSchema = z.object({
  brief: LectureBriefSchema,
  learningObjectives: z.array(LearningObjectiveSchema),
  conceptMap: z.array(ConceptNodeSchema),
  segments: z.array(LectureSegmentSchema),
  activities: z.array(ActivitySchema),
  slides: z.array(SlideSpecificationSchema),
  instructorGuide: z.string(),
  timingChecklist: z.array(z.object({
    time: z.string(),
    action: z.string(),
    materials: z.array(z.string()).optional()
  })),
  metadata: z.object({
    createdAt: z.date(),
    version: z.string(),
    lastModified: z.date(),
    approvalStatus: z.enum(['draft', 'review', 'approved', 'final'])
  })
});

// Types
export type LearningObjective = z.infer<typeof LearningObjectiveSchema>;
export type ConceptNode = z.infer<typeof ConceptNodeSchema>;
export type LectureBrief = z.infer<typeof LectureBriefSchema>;
export type LectureSegment = z.infer<typeof LectureSegmentSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type SlideSpecification = z.infer<typeof SlideSpecificationSchema>;
export type LecturePackage = z.infer<typeof LecturePackageSchema>;

// Agent message types
export interface AgentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AgentContext {
  lecturePackage: Partial<LecturePackage>;
  currentPhase: number;
  checkpointsPassed: string[];
  feedbackHistory: AgentMessage[];
  proposedStructure?: any; // Temporary storage for architecture phase output
}