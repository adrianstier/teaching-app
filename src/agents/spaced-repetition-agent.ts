import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  SpacedRepetitionSchedule,
  ReviewItem,
  RetrievalPracticeItem,
  SpacingInterval
} from '../types/pedagogical-features';

export interface SpacedRepetitionInput {
  courseId: string;
  concepts: Array<{
    id: string;
    name: string;
    lectureDate: string;
    lecture: string;
    importance: 'core' | 'supporting' | 'extension';
  }>;
  existingSchedule?: SpacedRepetitionSchedule;
}

export interface RetrievalPracticeInput {
  topic: string;
  concepts: string[];
  bloomLevel?: string;
  includeInterleaving?: boolean;
  priorTopics?: string[];
}

export interface PreClassActivationInput {
  upcomingLecture: string;
  topic: string;
  prerequisites: string[];
  priorKnowledge: string[];
}

/**
 * SpacedRepetitionAgent
 *
 * Implements evidence-based spaced repetition and retrieval practice
 * based on research by Dunlosky et al. (2013) and Roediger & Karpicke (2006).
 *
 * Key features:
 * - SM-2 algorithm for optimal spacing intervals
 * - Interleaving support for mixed practice
 * - Pre-class activation prompts
 * - Low-stakes retrieval practice generation
 */
export class SpacedRepetitionAgent {
  name = 'SpacedRepetitionAgent';
  description = 'Generate spaced repetition schedules and retrieval practice for optimal long-term retention';

  /**
   * Generate a complete spaced repetition schedule for a course
   */
  async generateSchedule(input: SpacedRepetitionInput): Promise<SpacedRepetitionSchedule> {
    logger.info(`[${this.name}] Generating spaced repetition schedule for ${input.concepts.length} concepts`);

    const systemPrompt = `You are an expert in learning science, specializing in spaced repetition and the testing effect. You help instructors design optimal review schedules based on the SM-2 algorithm and research on distributed practice.

Key principles you apply:
1. Initial review within 24 hours of learning
2. Expanding intervals: 1 day → 3 days → 1 week → 2 weeks → 1 month → 3 months
3. Interleaving different topics for discrimination learning
4. Retrieval practice over re-reading
5. Pre-class activation of prior knowledge`;

    const prompt = `Create a spaced repetition schedule for these course concepts:

${JSON.stringify(input.concepts, null, 2)}

For each concept, generate:
1. A review item with prompts that require active retrieval (not recognition)
2. Optimal spacing intervals based on importance
3. Related concepts for interleaving
4. Hints that scaffold without giving away the answer

Also generate:
- Daily review recommendations that mix old and new material
- Pre-class activation prompts for upcoming lectures

Return a JSON object with this structure:
{
  "courseId": "${input.courseId}",
  "items": [
    {
      "id": "<unique-id>",
      "conceptId": "<concept-id>",
      "conceptName": "<name>",
      "originalLecture": "<lecture-name>",
      "originalDate": "<date>",
      "nextReviewDate": "<YYYY-MM-DD>",
      "currentInterval": "1-day",
      "easeFactor": 2.5,
      "repetitions": 0,
      "reviewPrompt": "<question requiring retrieval>",
      "expectedResponse": "<key points to recall>",
      "hints": ["<hint 1>", "<hint 2>"],
      "relatedConcepts": ["<related concept 1>", "<related concept 2>"]
    }
  ],
  "dailyReview": {
    "date": "<today's date>",
    "itemsDue": ["<item-id-1>", "<item-id-2>"],
    "estimatedMinutes": <number>,
    "interleavingMix": [
      { "topic": "<topic>", "count": <number> }
    ]
  },
  "preClassActivation": [
    {
      "lectureDate": "<date>",
      "topic": "<upcoming topic>",
      "activationPrompts": ["<prompt 1>", "<prompt 2>"],
      "priorKnowledgeToActivate": ["<prior concept 1>", "<prior concept 2>"]
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<SpacedRepetitionSchedule>(prompt, systemPrompt, 8192);
      logger.info(`[${this.name}] Successfully generated schedule with ${result.items?.length || 0} items`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating schedule:`, error);
      return this.getFallbackSchedule(input);
    }
  }

  /**
   * Generate retrieval practice items for a specific topic
   */
  async generateRetrievalPractice(input: RetrievalPracticeInput): Promise<RetrievalPracticeItem[]> {
    logger.info(`[${this.name}] Generating retrieval practice for: ${input.topic}`);

    const systemPrompt = `You are an expert in the testing effect and retrieval practice. You create practice questions that require active memory retrieval rather than passive recognition.

Key principles:
1. Free recall is more effective than recognition (cued recall)
2. Questions should require generating answers, not selecting them
3. Difficulty should be desirable - some struggle improves retention
4. Connect new learning to prior knowledge
5. Interleave topics to improve discrimination`;

    const prompt = `Generate retrieval practice items for the topic: "${input.topic}"

Concepts to cover: ${JSON.stringify(input.concepts)}
${input.bloomLevel ? `Target Bloom's level: ${input.bloomLevel}` : ''}
${input.includeInterleaving && input.priorTopics ? `Include interleaving with these prior topics: ${JSON.stringify(input.priorTopics)}` : ''}

Create 5-8 retrieval practice items with a mix of:
- Free recall (generate from memory)
- Cued recall (prompt with context)
- Application (use knowledge in new context)
- Interleaving (mix with prior topics if requested)

Return a JSON array:
[
  {
    "id": "<unique-id>",
    "type": "free-recall" | "cued-recall" | "recognition" | "application",
    "prompt": "<the practice question>",
    "bloomLevel": "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create",
    "difficulty": 1-5,
    "isPreClassActivation": false,
    "connectsToPriorKnowledge": ["<prior concept 1>"],
    "interleavingCategory": "<topic category>",
    "mixWithTopics": ["<related topic>"]
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<RetrievalPracticeItem[]>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated ${result.length} retrieval practice items`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating retrieval practice:`, error);
      return this.getFallbackRetrievalItems(input);
    }
  }

  /**
   * Generate pre-class activation prompts
   */
  async generatePreClassActivation(input: PreClassActivationInput): Promise<{
    activationPrompts: string[];
    priorKnowledgeToActivate: string[];
    warmUpActivity: string;
  }> {
    logger.info(`[${this.name}] Generating pre-class activation for: ${input.topic}`);

    const systemPrompt = `You are an expert in learning science, specializing in priming and activation of prior knowledge. You help instructors prepare students for new learning by activating relevant prior knowledge before class.

Research basis:
- Prior knowledge activation improves encoding of new information
- Making connections explicit improves retention
- Pre-questions can prime attention during instruction`;

    const prompt = `Create pre-class activation prompts for this upcoming lecture:

Topic: ${input.upcomingLecture} - ${input.topic}
Prerequisites: ${JSON.stringify(input.prerequisites)}
Prior Knowledge to Activate: ${JSON.stringify(input.priorKnowledge)}

Generate:
1. 3-5 activation prompts that prime students to think about relevant prior knowledge
2. A list of specific prior concepts that should be recalled
3. A brief warm-up activity (2-3 minutes) for the start of class

Return JSON:
{
  "activationPrompts": [
    "<prompt that activates prior knowledge>"
  ],
  "priorKnowledgeToActivate": [
    "<specific concept to recall>"
  ],
  "warmUpActivity": "<brief activity description>"
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        activationPrompts: string[];
        priorKnowledgeToActivate: string[];
        warmUpActivity: string;
      }>(prompt, systemPrompt, 2048);
      logger.info(`[${this.name}] Generated pre-class activation with ${result.activationPrompts.length} prompts`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating pre-class activation:`, error);
      return {
        activationPrompts: [`What do you already know about ${input.topic}?`, `How might ${input.prerequisites[0] || 'prior concepts'} connect to today's topic?`],
        priorKnowledgeToActivate: input.priorKnowledge,
        warmUpActivity: `Spend 2 minutes writing down everything you remember about ${input.prerequisites[0] || 'the prerequisite topics'}.`
      };
    }
  }

  /**
   * Update a review item based on performance (SM-2 algorithm)
   */
  updateReviewItem(item: ReviewItem, performance: 'again' | 'hard' | 'good' | 'easy'): ReviewItem {
    const performanceScores = { again: 0, hard: 3, good: 4, easy: 5 };
    const score = performanceScores[performance];

    let newEaseFactor = item.easeFactor;
    let newInterval: SpacingInterval = item.currentInterval;
    let newRepetitions = item.repetitions;

    if (score < 3) {
      // Failed - reset
      newRepetitions = 0;
      newInterval = '1-day';
    } else {
      // Success - advance
      newRepetitions++;
      newEaseFactor = Math.max(1.3, item.easeFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02)));

      // Determine next interval
      const intervalProgression: SpacingInterval[] = ['1-day', '3-day', '1-week', '2-week', '1-month', '3-month'];
      const currentIndex = intervalProgression.indexOf(item.currentInterval);
      const nextIndex = Math.min(currentIndex + 1, intervalProgression.length - 1);
      newInterval = intervalProgression[nextIndex];
    }

    // Calculate next review date
    const intervalDays: Record<SpacingInterval, number> = {
      '1-day': 1,
      '3-day': 3,
      '1-week': 7,
      '2-week': 14,
      '1-month': 30,
      '3-month': 90
    };

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + Math.round(intervalDays[newInterval] * newEaseFactor));

    return {
      ...item,
      easeFactor: newEaseFactor,
      currentInterval: newInterval,
      repetitions: newRepetitions,
      lastReviewDate: new Date().toISOString().split('T')[0],
      lastPerformance: performance,
      nextReviewDate: nextDate.toISOString().split('T')[0]
    };
  }

  private getFallbackSchedule(input: SpacedRepetitionInput): SpacedRepetitionSchedule {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    return {
      courseId: input.courseId,
      items: input.concepts.map((concept, idx) => ({
        id: `review-${concept.id}-${Date.now()}`,
        conceptId: concept.id,
        conceptName: concept.name,
        originalLecture: concept.lecture,
        originalDate: concept.lectureDate,
        nextReviewDate: tomorrow,
        currentInterval: '1-day' as SpacingInterval,
        easeFactor: 2.5,
        repetitions: 0,
        reviewPrompt: `What are the key points about ${concept.name}?`,
        expectedResponse: `Key concepts from ${concept.name} in ${concept.lecture}`,
        hints: ['Think about the main definition', 'Consider the examples discussed'],
        relatedConcepts: []
      })),
      dailyReview: {
        date: today,
        itemsDue: [],
        estimatedMinutes: 10,
        interleavingMix: [{ topic: 'General', count: input.concepts.length }]
      },
      preClassActivation: []
    };
  }

  private getFallbackRetrievalItems(input: RetrievalPracticeInput): RetrievalPracticeItem[] {
    return input.concepts.map((concept, idx) => ({
      id: `retrieval-${Date.now()}-${idx}`,
      type: 'cued-recall' as const,
      prompt: `Explain the key aspects of ${concept} in your own words.`,
      bloomLevel: (input.bloomLevel as any) || 'understand',
      difficulty: 3,
      isPreClassActivation: false,
      connectsToPriorKnowledge: input.priorTopics || [],
      interleavingCategory: input.topic,
      mixWithTopics: input.priorTopics || []
    }));
  }
}
