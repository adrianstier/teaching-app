import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  MetacognitiveToolkit,
  StudyStrategy,
  SelfExplanationPrompt,
  ReflectionTemplate,
  LearningGoalTracker
} from '../types/pedagogical-features';
import { BloomLevel } from '../types/extended-types';

export interface StudyStrategyInput {
  topic: string;
  bloomLevel: BloomLevel;
  contentType: 'conceptual' | 'procedural' | 'factual' | 'metacognitive';
  learningGoal: 'memorization' | 'understanding' | 'application' | 'transfer';
  studentLevel: 'novice' | 'intermediate' | 'advanced';
}

export interface SelfExplanationInput {
  content: string;
  contentId: string;
  targetConcept: string;
  scaffoldLevel: 'none' | 'light' | 'moderate' | 'heavy';
}

export interface ReflectionTemplateInput {
  timing: 'pre-class' | 'during-class' | 'post-class' | 'weekly' | 'unit-end';
  focus: string[];
  includeGoalTracking: boolean;
}

export interface CalibrationExerciseInput {
  topic: string;
  assessmentType: string;
  concepts: string[];
}

/**
 * MetacognitiveAgent
 *
 * Implements metacognitive scaffolding tools based on research by
 * Zimmerman (2002) on self-regulated learning and Flavell (1979)
 * on metacognition.
 *
 * Key features:
 * - Study strategy recommendations matched to learning context
 * - Self-explanation prompts for deeper processing
 * - Reflection templates for metacognitive awareness
 * - Calibration exercises for accurate self-assessment
 */
export class MetacognitiveAgent {
  name = 'MetacognitiveAgent';
  description = 'Generate metacognitive scaffolding tools for self-regulated learning';

  /**
   * Recommend study strategies based on learning context
   */
  async recommendStudyStrategies(input: StudyStrategyInput): Promise<StudyStrategy[]> {
    logger.info(`[${this.name}] Recommending strategies for ${input.topic} at ${input.bloomLevel} level`);

    const systemPrompt = `You are an expert in learning science and study strategies. You recommend evidence-based study techniques matched to specific learning contexts.

Your knowledge includes research by:
- Dunlosky et al. (2013) on effective learning strategies
- Roediger & Karpicke on retrieval practice
- Chi on self-explanation
- Zimmerman on self-regulated learning

Key strategies and their effectiveness:
- Practice testing (high effectiveness)
- Distributed practice (high effectiveness)
- Elaborative interrogation (moderate)
- Self-explanation (moderate)
- Interleaved practice (moderate)
- Summarization (low unless trained)
- Highlighting (low)
- Rereading (low)`;

    const prompt = `Recommend study strategies for this learning context:

Topic: ${input.topic}
Bloom's Level: ${input.bloomLevel}
Content Type: ${input.contentType}
Learning Goal: ${input.learningGoal}
Student Level: ${input.studentLevel}

Provide 3-5 research-backed strategies, ranked by effectiveness for this context.

For each strategy include:
1. How to implement it specifically for this topic
2. Common mistakes to avoid
3. Time required
4. Research citation

Return JSON array:
[
  {
    "id": "<unique-id>",
    "name": "<strategy name>",
    "description": "<what this strategy involves>",
    "bestFor": {
      "bloomLevels": ["${input.bloomLevel}"],
      "contentTypes": ["${input.contentType}"],
      "learningGoals": ["${input.learningGoal}"]
    },
    "effectiveness": <0.0-1.0 effect size>,
    "researchCitation": "<key research reference>",
    "howToUse": [
      "<step 1>",
      "<step 2>"
    ],
    "commonMistakes": [
      "<mistake 1>",
      "<mistake 2>"
    ],
    "timeRequired": "<estimated time>",
    "exampleApplication": "<specific example for this topic>"
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<StudyStrategy[]>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated ${result.length} study strategy recommendations`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating strategies:`, error);
      return this.getFallbackStrategies(input);
    }
  }

  /**
   * Generate self-explanation prompts for content
   */
  async generateSelfExplanationPrompts(input: SelfExplanationInput): Promise<SelfExplanationPrompt[]> {
    logger.info(`[${this.name}] Generating self-explanation prompts for: ${input.targetConcept}`);

    const systemPrompt = `You are an expert in self-explanation and elaborative interrogation. You create prompts that help students process information more deeply by explaining it to themselves.

Research basis:
- Chi et al. on self-explanation effect
- Dunlosky et al. on elaborative interrogation
- Graesser on questioning strategies

Effective self-explanation prompts:
- Why questions (why does this work?)
- How questions (how does this connect?)
- What-if questions (what would happen if...?)
- Compare-contrast (how is this different from...?)
- Predict (what will happen next?)
- Connect (how does this relate to...?)`;

    const prompt = `Generate self-explanation prompts for this content:

Content: ${input.content}
Target Concept: ${input.targetConcept}
Scaffolding Level: ${input.scaffoldLevel}

Create 4-6 prompts that encourage deep processing. Include:
1. Where to insert each prompt (after which content)
2. Scaffolded versions for struggling students
3. Exemplar responses for self-checking

Return JSON array:
[
  {
    "id": "<unique-id>",
    "type": "why" | "how" | "what-if" | "compare" | "predict" | "connect",
    "prompt": "<the self-explanation prompt>",
    "targetContent": "${input.content.substring(0, 100)}...",
    "insertAfter": "<content location description>",
    "scaffoldLevel": "${input.scaffoldLevel}",
    "hints": ["<hint 1>", "<hint 2>"],
    "exemplarResponse": "<what a good self-explanation looks like>",
    "responseQualityCriteria": ["<criterion 1>", "<criterion 2>"]
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<SelfExplanationPrompt[]>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated ${result.length} self-explanation prompts`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating prompts:`, error);
      return this.getFallbackSelfExplanationPrompts(input);
    }
  }

  /**
   * Generate reflection templates for metacognitive awareness
   */
  async generateReflectionTemplate(input: ReflectionTemplateInput): Promise<ReflectionTemplate> {
    logger.info(`[${this.name}] Generating ${input.timing} reflection template`);

    const systemPrompt = `You are an expert in metacognition and reflective practice. You create reflection templates that help students develop metacognitive awareness and self-regulation skills.

Key reflection categories:
- Learning: What did I learn? How well do I understand it?
- Confusion: What confused me? What do I need to review?
- Application: How can I use this? Where does this apply?
- Strategy: What strategies worked? What should I change?
- Goals: Am I on track? What should I focus on next?
- Emotions: How do I feel about learning this? What's motivating/demotivating?`;

    const prompt = `Create a reflection template for:

Timing: ${input.timing}
Focus Areas: ${JSON.stringify(input.focus)}
Include Goal Tracking: ${input.includeGoalTracking}

The template should:
1. Be completable in 3-5 minutes
2. Promote genuine reflection, not just box-checking
3. Connect to previous reflections if progress tracking is enabled
4. Be specific enough to be useful, general enough to reuse

Return JSON:
{
  "id": "<unique-id>",
  "name": "<template name>",
  "timing": "${input.timing}",
  "prompts": [
    {
      "category": "learning" | "confusion" | "application" | "strategy" | "goals" | "emotions",
      "prompt": "<the reflection question>",
      "responseType": "text" | "scale" | "checklist"
    }
  ],
  "enableProgressTracking": ${input.includeGoalTracking},
  "compareToLastResponse": ${input.includeGoalTracking}
}`;

    try {
      const result = await claudeAPI.generateJSON<ReflectionTemplate>(prompt, systemPrompt, 2048);
      logger.info(`[${this.name}] Generated reflection template with ${result.prompts.length} prompts`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating template:`, error);
      return this.getFallbackReflectionTemplate(input);
    }
  }

  /**
   * Generate calibration exercises for self-assessment accuracy
   */
  async generateCalibrationExercise(input: CalibrationExerciseInput): Promise<{
    preAssessmentPrompt: string;
    assessmentQuestions: Array<{ question: string; answer: string }>;
    postAssessmentReflection: string;
    calibrationFeedbackTemplate: string;
  }> {
    logger.info(`[${this.name}] Generating calibration exercise for: ${input.topic}`);

    const systemPrompt = `You are an expert in metacognition and calibration. You help students develop accurate self-assessment skills through prediction and reflection exercises.

Research basis:
- Kruger-Dunning effect on miscalibration
- Koriat & Bjork on judgments of learning
- Dunlosky on metacomprehension accuracy

Calibration improves when students:
1. Make predictions before testing
2. Compare predictions to actual performance
3. Reflect on discrepancies
4. Adjust future predictions`;

    const prompt = `Create a calibration exercise for:

Topic: ${input.topic}
Assessment Type: ${input.assessmentType}
Concepts: ${JSON.stringify(input.concepts)}

Generate:
1. A pre-assessment confidence prompt
2. 3-5 assessment questions with answers
3. A post-assessment reflection prompt
4. A template for giving calibration feedback

Return JSON:
{
  "preAssessmentPrompt": "<prompt asking for confidence prediction>",
  "assessmentQuestions": [
    { "question": "<question>", "answer": "<answer>" }
  ],
  "postAssessmentReflection": "<prompt for reflecting on prediction accuracy>",
  "calibrationFeedbackTemplate": "<template for explaining calibration results>"
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        preAssessmentPrompt: string;
        assessmentQuestions: Array<{ question: string; answer: string }>;
        postAssessmentReflection: string;
        calibrationFeedbackTemplate: string;
      }>(prompt, systemPrompt, 3072);
      logger.info(`[${this.name}] Generated calibration exercise with ${result.assessmentQuestions.length} questions`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating calibration exercise:`, error);
      return {
        preAssessmentPrompt: `Before taking this assessment on ${input.topic}, predict your score (0-100%):`,
        assessmentQuestions: input.concepts.map(c => ({
          question: `Explain ${c} in your own words.`,
          answer: `A complete answer would include the key aspects of ${c}.`
        })),
        postAssessmentReflection: 'Compare your predicted score to your actual score. What does this tell you about your understanding?',
        calibrationFeedbackTemplate: 'Your predicted score was [PREDICTED]. Your actual score was [ACTUAL]. The difference of [DIFF] suggests [INTERPRETATION].'
      };
    }
  }

  /**
   * Create a complete metacognitive toolkit for a course
   */
  async createMetacognitiveToolkit(courseId: string, topics: string[]): Promise<MetacognitiveToolkit> {
    logger.info(`[${this.name}] Creating metacognitive toolkit for course: ${courseId}`);

    // Generate components
    const strategyPromises = topics.slice(0, 3).map(topic =>
      this.recommendStudyStrategies({
        topic,
        bloomLevel: 'understand',
        contentType: 'conceptual',
        learningGoal: 'understanding',
        studentLevel: 'intermediate'
      })
    );

    const reflectionTemplate = await this.generateReflectionTemplate({
      timing: 'weekly',
      focus: ['learning', 'confusion', 'strategy', 'goals'],
      includeGoalTracking: true
    });

    const strategies = (await Promise.all(strategyPromises)).flat();

    return {
      courseId,
      strategyRecommendations: strategies,
      selfExplanationPrompts: [],
      reflectionTemplates: [reflectionTemplate],
      calibrationExercises: []
    };
  }

  private getFallbackStrategies(input: StudyStrategyInput): StudyStrategy[] {
    return [
      {
        id: 'strategy-practice-testing',
        name: 'Practice Testing',
        description: 'Test yourself on the material without looking at notes',
        bestFor: {
          bloomLevels: [input.bloomLevel],
          contentTypes: [input.contentType],
          learningGoals: [input.learningGoal]
        },
        effectiveness: 0.7,
        researchCitation: 'Dunlosky et al. (2013)',
        howToUse: [
          'Create flashcards or practice questions',
          'Attempt to answer without looking at materials',
          'Check your answers and note errors',
          'Focus extra practice on items you missed'
        ],
        commonMistakes: [
          'Looking at the answer too quickly',
          'Not practicing material you think you know'
        ],
        timeRequired: '15-30 minutes per session',
        exampleApplication: `For ${input.topic}, create questions that require you to explain key concepts from memory.`
      },
      {
        id: 'strategy-distributed-practice',
        name: 'Distributed Practice',
        description: 'Spread studying over multiple sessions rather than cramming',
        bestFor: {
          bloomLevels: [input.bloomLevel],
          contentTypes: [input.contentType],
          learningGoals: [input.learningGoal]
        },
        effectiveness: 0.65,
        researchCitation: 'Cepeda et al. (2006)',
        howToUse: [
          'Plan multiple study sessions over days/weeks',
          'Review previously learned material in each session',
          'Mix review with new material',
          'Use spaced repetition scheduling'
        ],
        commonMistakes: [
          'Cramming before exams',
          'Not returning to earlier material'
        ],
        timeRequired: 'Multiple 20-30 minute sessions',
        exampleApplication: `For ${input.topic}, schedule 3-4 study sessions over the next week, reviewing earlier concepts each time.`
      }
    ];
  }

  private getFallbackSelfExplanationPrompts(input: SelfExplanationInput): SelfExplanationPrompt[] {
    return [
      {
        id: 'self-exp-why',
        type: 'why',
        prompt: `Why does ${input.targetConcept} work this way?`,
        targetConcept: input.targetConcept,
        embeddedAfter: 'main explanation',
        scaffoldLevel: input.scaffoldLevel,
        hints: ['Think about the underlying mechanism', 'Consider what would happen otherwise'],
        exemplarResponse: `A good explanation would connect ${input.targetConcept} to its underlying principles.`
      },
      {
        id: 'self-exp-connect',
        type: 'connect',
        prompt: `How does ${input.targetConcept} connect to what you already know?`,
        targetConcept: input.targetConcept,
        embeddedAfter: 'examples section',
        scaffoldLevel: input.scaffoldLevel,
        hints: ['Think about related concepts', 'Consider similar situations'],
        exemplarResponse: `This connects to prior knowledge by...`
      }
    ];
  }

  private getFallbackReflectionTemplate(input: ReflectionTemplateInput): ReflectionTemplate {
    return {
      id: `reflection-${input.timing}-${Date.now()}`,
      name: `${input.timing.charAt(0).toUpperCase() + input.timing.slice(1)} Reflection`,
      timing: input.timing,
      prompts: [
        {
          category: 'learning',
          prompt: 'What is the most important thing you learned?',
          responseType: 'text'
        },
        {
          category: 'confusion',
          prompt: 'What concepts are still unclear?',
          responseType: 'text'
        },
        {
          category: 'strategy',
          prompt: 'What study strategies worked well for you?',
          responseType: 'text'
        },
        {
          category: 'goals',
          prompt: 'What will you focus on next?',
          responseType: 'text'
        }
      ],
      enableProgressTracking: input.includeGoalTracking,
      compareToLastResponse: input.includeGoalTracking
    };
  }
}
