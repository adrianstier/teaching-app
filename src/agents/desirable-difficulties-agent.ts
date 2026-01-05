import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  DesirableDifficultiesEngine,
  GenerationEffectExercise,
  InterleavedPracticeSet,
  PretestingParadoxActivity,
  EncodingVariabilityActivity
} from '../types/pedagogical-features';
import { BloomLevel } from '../types/extended-types';

export interface GenerationExerciseInput {
  topic: string;
  concept: string;
  type: 'complete-the-blank' | 'generate-example' | 'predict-then-learn' |
        'generate-explanation' | 'create-analogy' | 'generate-question';
  scaffolding: 'none' | 'hints-available' | 'partial-structure';
}

export interface InterleavingInput {
  topics: string[];
  questionsPerTopic: number;
  includeContrastingCases: boolean;
}

export interface PretestInput {
  topic: string;
  concepts: string[];
  difficultyLevel: 'impossible' | 'very-hard' | 'guessable';
}

export interface EncodingVariabilityInput {
  concept: string;
  contexts: string[];
}

/**
 * DesirableDifficultiesAgent
 *
 * Implements desirable difficulties for enhanced learning based on
 * research by Bjork (1994) and Kornell & Bjork (2008).
 *
 * Key features:
 * - Generation effect exercises (producing vs. reading)
 * - Interleaved practice sets (mixing topics)
 * - Pretesting paradox activities (test before learning)
 * - Encoding variability (same concept, different contexts)
 * - Testing effect optimization
 */
export class DesirableDifficultiesAgent {
  name = 'DesirableDifficultiesAgent';
  description = 'Create learning experiences with desirable difficulties for enhanced retention';

  /**
   * Generate a generation effect exercise
   */
  async generateGenerationExercise(input: GenerationExerciseInput): Promise<GenerationEffectExercise> {
    logger.info(`[${this.name}] Generating ${input.type} exercise for: ${input.concept}`);

    const systemPrompt = `You are an expert in the generation effect (Slamecka & Graf, 1978). You create exercises where students produce information rather than just reading it.

Research basis:
- Generation effect: Generating information leads to better memory than reading
- Production effect: Saying/writing strengthens memory traces
- Self-explanation effect: Explaining improves understanding

Key principles:
1. Students should generate, not just select
2. Some scaffolding may be needed initially
3. Difficulty should be manageable but real
4. Feedback should follow generation attempts`;

    const typeDescriptions = {
      'complete-the-blank': 'Complete missing parts of a concept or process',
      'generate-example': 'Create a novel example of a concept',
      'predict-then-learn': 'Predict an outcome before learning the answer',
      'generate-explanation': 'Explain a concept in your own words',
      'create-analogy': 'Create an analogy for a concept',
      'generate-question': 'Create questions about the material'
    };

    const prompt = `Create a generation effect exercise:

Topic: ${input.topic}
Concept: ${input.concept}
Type: ${input.type} - ${typeDescriptions[input.type]}
Scaffolding: ${input.scaffolding}

The exercise should require active generation, not just recognition.

Return JSON:
{
  "id": "<unique-id>",
  "topic": "${input.topic}",
  "type": "${input.type}",
  "prompt": "<the generation task>",
  "scaffolding": "${input.scaffolding}",
  "exemplarResponse": "<example of a good response>",
  "evaluationCriteria": ["<criterion 1>", "<criterion 2>"]
}`;

    try {
      const result = await claudeAPI.generateJSON<GenerationEffectExercise>(prompt, systemPrompt, 2048);
      logger.info(`[${this.name}] Generated generation exercise`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating exercise:`, error);
      return this.getFallbackGenerationExercise(input);
    }
  }

  /**
   * Generate an interleaved practice set
   */
  async generateInterleavedPractice(input: InterleavingInput): Promise<InterleavedPracticeSet> {
    logger.info(`[${this.name}] Generating interleaved practice for ${input.topics.length} topics`);

    const systemPrompt = `You are an expert in interleaved practice (Rohrer & Taylor, 2007). You create practice sets that mix different problem types to improve discrimination and transfer.

Research basis:
- Interleaving improves discrimination between problem types
- Blocked practice feels easier but interleaved leads to better retention
- Interleaving forces retrieval of the appropriate strategy
- Contrast between problem types highlights key differences

Key principles:
1. Mix problems from different topics/types
2. Include discrimination prompts to help students identify problem type
3. Vary surface features while maintaining deep structure
4. Provide contrasting cases for similar concepts`;

    const prompt = `Create an interleaved practice set:

Topics: ${JSON.stringify(input.topics)}
Questions per topic: ${input.questionsPerTopic}
Include contrasting cases: ${input.includeContrastingCases}

Create a practice set that:
1. Mixes problems from all topics
2. Requires students to identify which approach applies
3. Highlights differences between similar problem types
${input.includeContrastingCases ? '4. Includes contrasting cases for similar concepts' : ''}

Return JSON:
{
  "id": "<unique-id>",
  "title": "Interleaved Practice: ${input.topics.join(' & ')}",
  "topics": ${JSON.stringify(input.topics)},
  "problems": [
    {
      "id": "<problem-id>",
      "topic": "<which topic>",
      "problem": "<the problem>",
      "solution": "<the solution>",
      "discriminationHint": "<what distinguishes this type>"
    }
  ],
  "ordering": "random",
  ${input.includeContrastingCases ? `"contrastingCases": [
    {
      "case1": { "problem": "<problem>", "solution": "<solution>" },
      "case2": { "problem": "<similar but different>", "solution": "<different solution>" },
      "keyDifference": "<what makes them different>",
      "discriminationQuestion": "<question to highlight difference>"
    }
  ]` : '"contrastingCases": []'}
}`;

    try {
      const result = await claudeAPI.generateJSON<InterleavedPracticeSet>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Generated interleaved set with ${result.problems.length} problems`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating practice set:`, error);
      return this.getFallbackInterleavedPractice(input);
    }
  }

  /**
   * Generate a pretesting activity (test before learning)
   */
  async generatePretestingActivity(input: PretestInput): Promise<PretestingParadoxActivity> {
    logger.info(`[${this.name}] Generating pretesting activity for: ${input.topic}`);

    const systemPrompt = `You are an expert in the pretesting effect (Richland et al., 2009). You create pretests that prime learning even when students answer incorrectly.

Research basis:
- Taking a test before learning improves later learning
- Errors on pretests can be more beneficial than correct answers
- Pretesting activates relevant prior knowledge
- Pretesting creates "search sets" that facilitate later encoding

Key principles:
1. Pretest questions should relate to upcoming content
2. Difficulty should be high (students will mostly fail)
3. Instruction should explicitly connect to pretest questions
4. Posttests assess transfer and application`;

    const prompt = `Create a pretesting activity:

Topic: ${input.topic}
Concepts: ${JSON.stringify(input.concepts)}
Difficulty Level: ${input.difficultyLevel}

Generate:
1. Pretest questions (students likely can't answer yet)
2. Instructional connections to pretest questions
3. Parallel posttest questions

Return JSON:
{
  "id": "<unique-id>",
  "topic": "${input.topic}",
  "pretest": {
    "questions": [
      {
        "question": "<question students probably can't answer>",
        "expectedDifficulty": "${input.difficultyLevel}",
        "correctAnswer": "<the correct answer>"
      }
    ],
    "purpose": "<why this primes learning>",
    "duration": <minutes>
  },
  "instruction": {
    "content": "<summary of instruction that follows>",
    "connectionsToPretestQuestions": [
      {
        "pretestQuestion": "<the pretest question>",
        "instructionalConnection": "<how instruction addresses this>"
      }
    ]
  },
  "posttest": {
    "questions": [
      {
        "question": "<similar or transfer question>",
        "isParallel": true | false,
        "correctAnswer": "<answer>"
      }
    ]
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<PretestingParadoxActivity>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated pretesting activity with ${result.pretest.questions.length} pretest questions`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating pretesting activity:`, error);
      return this.getFallbackPretesting(input);
    }
  }

  /**
   * Generate encoding variability activities
   */
  async generateEncodingVariability(input: EncodingVariabilityInput): Promise<EncodingVariabilityActivity> {
    logger.info(`[${this.name}] Generating encoding variability for: ${input.concept}`);

    const systemPrompt = `You are an expert in encoding variability (Smith & Handy, 2014). You create practice that varies context to improve transfer.

Research basis:
- Varying study contexts leads to better retrieval in new contexts
- Multiple presentations strengthen different retrieval cues
- Variable practice improves transfer more than massed practice
- Context diversity during encoding improves context independence

Key principles:
1. Same concept, different surface features
2. Same concept, different domains/applications
3. Same principle, different problem formats
4. Transfer prompts to novel situations`;

    const prompt = `Create encoding variability activities:

Concept: ${input.concept}
Contexts to use: ${JSON.stringify(input.contexts)}

Present the same concept in each context, then prompt for transfer.

Return JSON:
{
  "id": "<unique-id>",
  "concept": "${input.concept}",
  "variableContexts": [
    {
      "context": "<context name>",
      "presentation": "<how concept appears in this context>",
      "practiceProblems": ["<problem 1>", "<problem 2>"]
    }
  ],
  "transferPrompts": [
    {
      "novelContext": "<a new context not in training>",
      "prompt": "<transfer question>",
      "connectionToLearned": "<how this connects to learned contexts>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<EncodingVariabilityActivity>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated encoding variability with ${result.variableContexts.length} contexts`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating activity:`, error);
      return this.getFallbackEncodingVariability(input);
    }
  }

  /**
   * Create a complete desirable difficulties engine
   */
  async createEngine(courseId: string, topics: string[]): Promise<DesirableDifficultiesEngine> {
    logger.info(`[${this.name}] Creating desirable difficulties engine for: ${courseId}`);

    const generationExercises = await Promise.all(
      topics.slice(0, 3).map(topic =>
        this.generateGenerationExercise({
          topic,
          concept: topic,
          type: 'generate-explanation',
          scaffolding: 'hints-available'
        })
      )
    );

    const interleavedSet = topics.length >= 2
      ? await this.generateInterleavedPractice({
          topics: topics.slice(0, 3),
          questionsPerTopic: 2,
          includeContrastingCases: true
        })
      : null;

    return {
      courseId,
      generationExercises,
      interleavedPracticeSets: interleavedSet ? [interleavedSet] : [],
      pretestingActivities: [],
      encodingVariabilityActivities: [],
      retrievalPracticeSchedule: {
        frequency: 'every-class',
        format: 'low-stakes-quiz',
        feedbackTiming: 'immediate'
      },
      implementationNotes: {
        studentResistanceStrategies: [
          'Explain the research on desirable difficulties',
          'Show examples of improved long-term retention',
          'Start with lower stakes to build buy-in',
          'Acknowledge that it feels harder but leads to better learning'
        ],
        gradingConsiderations: [
          'Grade on effort and improvement, not just accuracy',
          'Allow multiple attempts on generation tasks',
          'Use formative rather than summative assessment for these activities'
        ],
        communicatingPurpose: 'These activities are designed to feel challenging because research shows that productive struggle leads to better long-term retention and transfer. It\'s supposed to be hard!'
      }
    };
  }

  private getFallbackGenerationExercise(input: GenerationExerciseInput): GenerationEffectExercise {
    return {
      id: `gen-${Date.now()}`,
      topic: input.topic,
      type: input.type,
      prompt: `Generate your own explanation/example of ${input.concept} in your own words.`,
      scaffolding: input.scaffolding,
      exemplarResponse: `A strong response would include the key aspects of ${input.concept} and connect it to prior knowledge.`,
      evaluationCriteria: [
        'Accuracy of core concept',
        'Use of appropriate terminology',
        'Connection to examples or applications'
      ]
    };
  }

  private getFallbackInterleavedPractice(input: InterleavingInput): InterleavedPracticeSet {
    // Handle both string[] and object[] with name property
    const getTopicName = (topic: any): string => {
      if (typeof topic === 'string') return topic;
      if (topic && typeof topic === 'object' && topic.name) return topic.name;
      return String(topic);
    };

    const topicNames = input.topics.map(getTopicName);

    return {
      id: `interleave-${Date.now()}`,
      title: `Interleaved Practice: ${topicNames.join(' & ')}`,
      topics: input.topics,
      problems: input.topics.flatMap((topic, topicIdx) => {
        const name = getTopicName(topic);
        return Array.from({ length: input.questionsPerTopic }, (_, i) => ({
          id: `prob-${topicIdx}-${i}`,
          topic,
          problem: `Practice problem ${i + 1} for ${name}`,
          solution: `Solution for this ${name} problem`,
          discriminationHint: `This is a ${name} problem because...`
        }));
      }),
      ordering: 'random',
      contrastingCases: input.includeContrastingCases ? [{
        case1: { problem: `${getTopicName(input.topics[0])} example`, solution: 'Solution A' },
        case2: { problem: `${getTopicName(input.topics[1] || input.topics[0])} example`, solution: 'Solution B' },
        keyDifference: 'The key difference is...',
        discriminationQuestion: 'How do you know which approach to use?'
      }] : []
    };
  }

  private getFallbackPretesting(input: PretestInput): PretestingParadoxActivity {
    return {
      id: `pretest-${Date.now()}`,
      topic: input.topic,
      pretest: {
        questions: input.concepts.map((concept, i) => ({
          question: `What do you think ${concept} means or involves?`,
          expectedDifficulty: input.difficultyLevel,
          correctAnswer: `The correct understanding of ${concept} is...`
        })),
        purpose: 'These questions activate relevant prior knowledge and create curiosity for the upcoming material',
        duration: 5
      },
      instruction: {
        content: `Instruction covering ${input.concepts.join(', ')}`,
        connectionsToPretestQuestions: input.concepts.map((concept, i) => ({
          pretestQuestion: `What do you think ${concept} means?`,
          instructionalConnection: `Now we'll see how ${concept} actually works...`
        }))
      },
      posttest: {
        questions: input.concepts.map((concept, i) => ({
          question: `Apply your understanding of ${concept} to a new situation...`,
          isParallel: true,
          correctAnswer: `A correct application would...`
        }))
      }
    };
  }

  private getFallbackEncodingVariability(input: EncodingVariabilityInput): EncodingVariabilityActivity {
    return {
      id: `encoding-${Date.now()}`,
      concept: input.concept,
      variableContexts: input.contexts.map((context, i) => ({
        context,
        presentation: `${input.concept} as applied in ${context}`,
        practiceProblems: [
          `Apply ${input.concept} to a ${context} scenario`,
          `Identify ${input.concept} in this ${context} example`
        ]
      })),
      transferPrompts: [{
        novelContext: 'A completely new domain',
        prompt: `How would ${input.concept} apply in this new situation?`,
        connectionToLearned: 'Look for the underlying principle that connects all the contexts you practiced'
      }]
    };
  }
}
