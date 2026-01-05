import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  GrowthMindsetToolkit,
  StruggleNormalizationMessage,
  ProcessPraiseTemplate,
  AttributionTraining,
  ProductiveFailureActivity
} from '../types/pedagogical-features';
import { BloomLevel } from '../types/extended-types';

export interface StruggleMessageInput {
  context: 'before-difficult-content' | 'after-failure' | 'during-practice' |
           'assessment-feedback' | 'general-encouragement';
  topic?: string;
  bloomLevel?: BloomLevel;
}

export interface ProductiveFailureInput {
  topic: string;
  targetConcept: string;
  duration: number;
  priorKnowledge: string[];
}

export interface FeedbackLanguageInput {
  originalFeedback: string;
  situation: 'correct-answer' | 'improvement' | 'persistence' | 'struggle';
}

/**
 * GrowthMindsetAgent
 *
 * Implements growth mindset and motivation-building strategies based on
 * research by Dweck (2006) and Ryan & Deci's Self-Determination Theory (2000).
 *
 * Key features:
 * - Struggle normalization messages
 * - Process praise templates
 * - Attribution training
 * - Productive failure activities
 * - Fixed vs. growth mindset language conversion
 */
export class GrowthMindsetAgent {
  name = 'GrowthMindsetAgent';
  description = 'Build growth mindset and intrinsic motivation through evidence-based messaging';

  /**
   * Generate struggle normalization messages
   */
  async generateStruggleMessages(input: StruggleMessageInput): Promise<StruggleNormalizationMessage[]> {
    logger.info(`[${this.name}] Generating struggle messages for context: ${input.context}`);

    const systemPrompt = `You are an expert in growth mindset and motivation research. You create messages that normalize productive struggle and build resilience.

Research basis:
- Dweck (2006) on growth mindset
- Haimovitz & Dweck on failure mindsets
- Kapur on productive failure
- Ryan & Deci on intrinsic motivation

Key principles:
1. Struggle is normal and expected in learning
2. Effort and strategy matter more than innate ability
3. Challenges help the brain grow
4. Mistakes are learning opportunities
5. Focus on process, not just outcomes`;

    const prompt = `Generate 5 struggle normalization messages for:

Context: ${input.context}
${input.topic ? `Topic: ${input.topic}` : ''}
${input.bloomLevel ? `Bloom's Level: ${input.bloomLevel}` : ''}

Create messages that:
1. Normalize the struggle without dismissing the difficulty
2. Emphasize growth and learning from challenges
3. Redirect focus from ability to effort and strategy
4. Are appropriate for university students

Return JSON array:
[
  {
    "id": "<unique-id>",
    "context": "${input.context}",
    "message": "<the encouraging message>",
    "bloomLevel": "${input.bloomLevel || 'any'}",
    "topicDifficulty": "any" | "high" | "threshold-concept"
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<StruggleNormalizationMessage[]>(prompt, systemPrompt, 2048);
      logger.info(`[${this.name}] Generated ${result.length} struggle messages`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating messages:`, error);
      return this.getFallbackStruggleMessages(input);
    }
  }

  /**
   * Generate process praise templates
   */
  async generateProcessPraiseTemplates(situations: string[]): Promise<ProcessPraiseTemplate[]> {
    logger.info(`[${this.name}] Generating process praise templates`);

    const systemPrompt = `You are an expert in feedback and motivation. You help instructors give process-focused praise that builds growth mindset.

Process vs. Person praise:
- Person: "You're so smart" → Fixed mindset
- Process: "Your strategy really worked" → Growth mindset

Effective process praise:
1. Specific to behaviors and strategies
2. Highlights effort and approach
3. Connects actions to outcomes
4. Encourages continued growth`;

    const prompt = `Generate process praise templates for these situations:

Situations: ${JSON.stringify(situations)}

For each situation, provide:
1. 3-4 template phrases with [PLACEHOLDERS]
2. Phrases to avoid (person-focused)
3. Alternative replacements

Return JSON array:
[
  {
    "id": "<unique-id>",
    "situation": "<situation>",
    "templates": [
      "I noticed [SPECIFIC STRATEGY] - that really helped with [OUTCOME].",
      "Your [EFFORT/APPROACH] showed in [RESULT]."
    ],
    "avoidPhrases": [
      {
        "phrase": "<phrase to avoid>",
        "issue": "<why it's problematic>",
        "alternative": "<better alternative>"
      }
    ]
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<ProcessPraiseTemplate[]>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated ${result.length} praise templates`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating templates:`, error);
      return this.getFallbackPraiseTemplates(situations);
    }
  }

  /**
   * Generate attribution training content
   */
  async generateAttributionTraining(topic: string): Promise<AttributionTraining> {
    logger.info(`[${this.name}] Generating attribution training for: ${topic}`);

    const systemPrompt = `You are an expert in attribution theory and motivation. You help students develop helpful attributions for success and failure.

Attribution dimensions:
1. Locus: Internal vs. External
2. Stability: Stable vs. Unstable
3. Controllability: Controllable vs. Uncontrollable

Helpful attributions:
- Success: Internal, unstable, controllable (effort, strategy)
- Failure: Internal, unstable, controllable (can improve)

Unhelpful attributions:
- Success: External, stable (luck, easy task)
- Failure: Internal, stable, uncontrollable (lack of ability)`;

    const prompt = `Create attribution training content for: ${topic}

Include:
1. Reframing exercises for common unhelpful attributions
2. Prompts for reflecting after success and struggle
3. Explanations of why different attributions matter

Return JSON:
{
  "id": "<unique-id>",
  "reframingExercises": [
    {
      "scenario": "<a situation a student might experience>",
      "unhelpfulAttribution": "<fixed/external attribution>",
      "helpfulReframe": "<growth/internal/controllable attribution>",
      "explanation": "<why the reframe is better>"
    }
  ],
  "attributionPrompts": {
    "afterSuccess": [
      "What specific actions led to this success?",
      "Which strategies worked well?"
    ],
    "afterStruggle": [
      "What can you do differently next time?",
      "What resources haven't you tried yet?"
    ]
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<AttributionTraining>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating training:`, error);
      return this.getFallbackAttributionTraining();
    }
  }

  /**
   * Generate a productive failure activity
   */
  async generateProductiveFailureActivity(input: ProductiveFailureInput): Promise<ProductiveFailureActivity> {
    logger.info(`[${this.name}] Generating productive failure activity for: ${input.topic}`);

    const systemPrompt = `You are an expert in productive failure (Kapur, 2008). You design activities where students:
1. Attempt problems before instruction
2. Generate diverse solutions (even incorrect ones)
3. Compare their attempts to expert solutions
4. Learn more deeply through the struggle

Key principles:
- Initial failure is expected and productive
- Multiple solution attempts activate prior knowledge
- Consolidation phase connects attempts to canonical solutions
- Struggle enhances long-term retention and transfer`;

    const prompt = `Design a productive failure activity:

Topic: ${input.topic}
Target Concept: ${input.targetConcept}
Duration: ${input.duration} minutes
Prior Knowledge: ${JSON.stringify(input.priorKnowledge)}

Structure:
1. Generation Phase: Students attempt without instruction
2. Consolidation Phase: Instructor connects attempts to correct solution

Return JSON:
{
  "id": "<unique-id>",
  "topic": "${input.topic}",
  "generationPhase": {
    "problem": "<challenging problem students attempt>",
    "duration": ${Math.round(input.duration * 0.6)},
    "constraints": ["<what students can/cannot use>"],
    "allowedResources": ["<resources available>"],
    "supportPrompts": [
      {
        "triggerCondition": "<when to offer this>",
        "prompt": "<supportive prompt, not answer>"
      }
    ]
  },
  "consolidationPhase": {
    "connections": [
      {
        "studentAttempt": "<type of student attempt>",
        "expertSolution": "<corresponding expert approach>",
        "bridgingExplanation": "<how they connect>"
      }
    ],
    "canonicalSolution": "<the correct solution approach>",
    "keyInsights": ["<insight 1>", "<insight 2>"]
  },
  "learningRationale": "<why this struggle helps learning>"
}`;

    try {
      const result = await claudeAPI.generateJSON<ProductiveFailureActivity>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated productive failure activity`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating activity:`, error);
      return this.getFallbackProductiveFailure(input);
    }
  }

  /**
   * Convert fixed mindset feedback to growth mindset
   */
  async convertFeedbackLanguage(input: FeedbackLanguageInput): Promise<{
    original: string;
    issues: string[];
    improved: string;
    explanation: string;
  }> {
    logger.info(`[${this.name}] Converting feedback language`);

    const systemPrompt = `You are an expert in growth mindset communication. You help instructors revise feedback to promote growth mindset.`;

    const prompt = `Convert this feedback to growth mindset language:

Original: "${input.originalFeedback}"
Situation: ${input.situation}

Identify:
1. Any fixed mindset language
2. Missing process focus
3. Improvements needed

Return JSON:
{
  "original": "${input.originalFeedback}",
  "issues": ["<issue 1>"],
  "improved": "<revised feedback>",
  "explanation": "<why the changes matter>"
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        original: string;
        issues: string[];
        improved: string;
        explanation: string;
      }>(prompt, systemPrompt, 2048);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error converting feedback:`, error);
      return {
        original: input.originalFeedback,
        issues: [],
        improved: input.originalFeedback,
        explanation: 'Unable to analyze'
      };
    }
  }

  /**
   * Create a complete growth mindset toolkit
   */
  async createToolkit(courseId: string, topics: string[]): Promise<GrowthMindsetToolkit> {
    logger.info(`[${this.name}] Creating growth mindset toolkit for: ${courseId}`);

    const struggleMessages = await this.generateStruggleMessages({
      context: 'before-difficult-content'
    });

    const praiseTemplates = await this.generateProcessPraiseTemplates([
      'correct-answer', 'improvement', 'persistence', 'strategy-use'
    ]);

    const attributionTraining = await this.generateAttributionTraining(topics[0] || 'general');

    return {
      courseId,
      struggleMessages,
      praiseTemplates,
      attributionTraining,
      productiveFailureActivities: [],
      feedbackLanguageGuidelines: {
        growthMindsetPhrases: [
          'Your approach shows...',
          'The effort you put into...',
          'I can see you tried...',
          'This strategy worked because...',
          'Next time you might try...'
        ],
        fixedMindsetPhrases: [
          { phrase: "You're so smart", replacement: "You worked really hard on this" },
          { phrase: "You're a natural", replacement: "Your practice is paying off" },
          { phrase: "This is easy for you", replacement: "Your strategies are working well" },
          { phrase: "You're not good at this", replacement: "This is challenging - let's try a different approach" }
        ],
        processVsPersonDescriptors: [
          { personFocused: 'smart', processFocused: 'thoughtful approach' },
          { personFocused: 'talented', processFocused: 'well-practiced' },
          { personFocused: 'gifted', processFocused: 'dedicated effort' },
          { personFocused: 'slow learner', processFocused: 'still developing this skill' }
        ]
      }
    };
  }

  private getFallbackStruggleMessages(input: StruggleMessageInput): StruggleNormalizationMessage[] {
    const messages: Record<string, string[]> = {
      'before-difficult-content': [
        'The material we\'re about to cover is challenging - and that\'s exactly the point. Struggle is how your brain grows.',
        'If this feels hard, you\'re in the right zone. Easy means you already know it; challenging means you\'re learning.'
      ],
      'after-failure': [
        'Mistakes aren\'t failures - they\'re information about what to try next.',
        'The fact that you tried matters. Now we can figure out a better approach.'
      ],
      'during-practice': [
        'Feeling stuck is normal. Take a breath, try a different approach.',
        'The discomfort you feel is your brain building new connections.'
      ],
      'assessment-feedback': [
        'Your score shows where you are now, not where you\'ll always be. Let\'s focus on growth.',
        'Every expert was once a beginner. This feedback helps us plan your next steps.'
      ],
      'general-encouragement': [
        'Your abilities are not fixed. Every time you push through difficulty, you grow.',
        'Learning is supposed to be challenging. If it feels easy, you\'re not learning much new.'
      ]
    };

    return (messages[input.context] || messages['general-encouragement']).map((msg, i) => ({
      id: `struggle-${i + 1}`,
      context: input.context,
      message: msg,
      bloomLevel: input.bloomLevel,
      topicDifficulty: 'any' as const
    }));
  }

  private getFallbackPraiseTemplates(situations: string[]): ProcessPraiseTemplate[] {
    return situations.map((situation, i) => ({
      id: `praise-${i + 1}`,
      situation: situation as any,
      templates: [
        `Your [SPECIFIC STRATEGY] really made a difference here.`,
        `I noticed how you [SPECIFIC EFFORT] - that's exactly the kind of approach that leads to growth.`
      ],
      avoidPhrases: [
        {
          phrase: "You're so smart",
          issue: "Implies ability is fixed",
          alternative: "Your approach was really effective"
        }
      ]
    }));
  }

  private getFallbackAttributionTraining(): AttributionTraining {
    return {
      id: `attribution-${Date.now()}`,
      reframingExercises: [
        {
          scenario: 'You got a low grade on an exam',
          unhelpfulAttribution: 'I\'m just not smart enough for this',
          helpfulReframe: 'I need to change my study strategy for this type of material',
          explanation: 'This attribution focuses on changeable factors (strategy) rather than fixed ability'
        },
        {
          scenario: 'You did well on a project',
          unhelpfulAttribution: 'I got lucky with an easy topic',
          helpfulReframe: 'My preparation and approach paid off',
          explanation: 'This acknowledges your role in the success, motivating continued effort'
        }
      ],
      attributionPrompts: {
        afterSuccess: [
          'What specific actions contributed to this outcome?',
          'Which strategies would you use again?',
          'What preparation made a difference?'
        ],
        afterStruggle: [
          'What different approach could you try?',
          'Who could you ask for help or guidance?',
          'What resources haven\'t you used yet?',
          'What would you do differently if you could start over?'
        ]
      }
    };
  }

  private getFallbackProductiveFailure(input: ProductiveFailureInput): ProductiveFailureActivity {
    return {
      id: `pf-${Date.now()}`,
      topic: input.topic,
      generationPhase: {
        problem: `Without looking at any resources, try to solve/explain ${input.targetConcept} based on what you already know.`,
        duration: Math.round(input.duration * 0.6),
        constraints: ['Do not use textbook or notes', 'Work individually first'],
        allowedResources: ['Your prior knowledge', 'Discussion with peers'],
        supportPrompts: [
          {
            triggerCondition: 'Students seem stuck',
            prompt: 'What do you already know that might be relevant? Try connecting to something familiar.'
          },
          {
            triggerCondition: 'Students give up quickly',
            prompt: 'It\'s okay to be wrong. Generate multiple possible approaches, even if you\'re unsure.'
          }
        ]
      },
      consolidationPhase: {
        connections: [
          {
            studentAttempt: 'Common initial approach',
            expertSolution: 'The canonical method',
            bridgingExplanation: 'Your intuition was heading in the right direction. Here\'s how experts refine that approach.'
          }
        ],
        canonicalSolution: `The standard approach to ${input.targetConcept}`,
        keyInsights: [
          'Your initial attempts activated relevant prior knowledge',
          'The struggle helped you see why the expert approach works'
        ]
      },
      learningRationale: 'Attempting problems before instruction creates cognitive readiness for new information and leads to better long-term retention and transfer.'
    };
  }
}
