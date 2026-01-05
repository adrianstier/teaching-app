import { BaseAgent } from './base-agent';
import { AgentContext } from '../types';
import {
  Exercise,
  ExerciseConfig,
  ExerciseSchema,
  BloomVerbsByLevel,
  QuestionType
} from '../types/extended-types';
import logger from '../utils/logger';

export class ExerciseGeneratorAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Exercise Generator',
        role: 'Assessment & Exercise Specialist',
        description: 'Generates pedagogically-sound exercises aligned with Bloom\'s taxonomy and learning outcomes',
        systemPrompt: `You are an expert in educational assessment and exercise design across multiple disciplines.

        Your role is to:
        1. Generate questions at specific Bloom's taxonomy levels
        2. Create appropriate distractors based on common misconceptions
        3. Write clear, unambiguous questions
        4. Develop comprehensive solutions and rubrics
        5. Ensure alignment with learning outcomes

        For Multiple Choice Questions:
        - The correct answer should be clear and defensible
        - Distractors should be plausible and based on real misconceptions
        - Avoid "all of the above" or "none of the above" unless pedagogically valuable
        - Each distractor should reveal a specific misunderstanding

        For Open-Ended Questions:
        - Provide clear rubrics with specific criteria
        - Include common student mistakes
        - Give detailed solution steps

        For All Questions:
        - Match the difficulty level to the target audience
        - Use appropriate technical language for the field
        - Include real-world context when possible
        - Ensure questions are culturally sensitive and inclusive`
      },
      context
    );
  }

  async execute(config: ExerciseConfig): Promise<Exercise[]> {
    logger.info(`Generating ${config.variants} exercise(s) for: ${config.topic}`);

    const exercises: Exercise[] = [];

    for (let i = 0; i < config.variants; i++) {
      const exercise = await this.generateSingleExercise(config, i);
      exercises.push(exercise);
    }

    logger.info(`Successfully generated ${exercises.length} exercise(s)`);
    return exercises;
  }

  private async generateSingleExercise(config: ExerciseConfig, variantIndex: number): Promise<Exercise> {
    const verbs = BloomVerbsByLevel[config.bloomLevel];

    const prompt = `Generate a ${config.questionType} question for the following specifications:

Topic: ${config.topic}
Bloom's Level: ${config.bloomLevel} (appropriate verbs: ${verbs.join(', ')})
Difficulty: ${config.difficulty}/5 (1=easiest, 5=hardest)
Purpose: ${config.purpose}
Class Type: ${config.classType}
Variant: ${variantIndex + 1} of ${config.variants}

${this.getQuestionTypeGuidance(config.questionType)}

Generate a complete exercise with:
1. The question text (clear, specific, and at the appropriate Bloom's level)
2. ${config.questionType === 'multiple-choice' ? 'Four answer options (A, B, C, D)' : 'Expected answer format'}
3. The correct answer
${config.includeDistractors && config.questionType === 'multiple-choice' ? '4. For each wrong answer, explain the misconception it represents' : ''}
5. A detailed solution with step-by-step explanation
6. Common mistakes students make
${config.includeRubric ? '7. A grading rubric with specific criteria' : ''}
8. Estimated time to complete (in minutes)
9. Any prerequisites needed

Return as a JSON object matching this structure:
{
  "question": "The question text",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],  // Only for MCQs
  "correctAnswer": "The correct answer",
  "distractors": [  // Only for MCQs with misconceptions
    {
      "option": "B",
      "misconception": "Student thinks X when actually Y"
    }
  ],
  "solution": {
    "steps": ["Step 1", "Step 2", ...],
    "explanation": "Detailed explanation of the solution",
    "commonMistakes": ["Mistake 1", "Mistake 2", ...]
  },
  "rubric": [  // Optional
    {
      "criterion": "Understanding of concept",
      "points": 4,
      "excellent": "Description",
      "good": "Description",
      "needsWork": "Description",
      "commonErrors": ["Error 1", "Error 2"]
    }
  ],
  "metadata": {
    "estimatedTime": 10,
    "prerequisites": ["Concept A", "Concept B"],
    "learningOutcomes": ["Students will be able to..."]
  }
}`;

    try {
      const response = await this.think(prompt, {
        responseFormat: 'json',
        temperature: 0.7 + (variantIndex * 0.1) // Slight variation for different variants
      });

      const exerciseData = JSON.parse(response);

      // Construct the exercise object
      const exercise: Exercise = {
        id: `ex-${Date.now()}-${variantIndex}`,
        topic: config.topic,
        questionType: config.questionType,
        bloomLevel: config.bloomLevel,
        difficulty: config.difficulty,
        question: exerciseData.question,
        options: exerciseData.options,
        correctAnswer: exerciseData.correctAnswer,
        distractors: exerciseData.distractors,
        solution: exerciseData.solution,
        rubric: exerciseData.rubric,
        metadata: exerciseData.metadata
      };

      // Validate
      const validated = ExerciseSchema.parse(exercise);
      return validated;

    } catch (error) {
      logger.error('Failed to generate exercise', error);
      throw error;
    }
  }

  private getQuestionTypeGuidance(type: QuestionType): string {
    const guidance: Record<QuestionType, string> = {
      'multiple-choice': `
Create a multiple-choice question with:
- One clearly correct answer
- Three plausible distractors based on common misconceptions
- Options that are mutually exclusive
- Roughly equal length for all options`,

      'short-answer': `
Create a short-answer question that:
- Can be answered in 2-4 sentences
- Has a clear correct answer
- Tests understanding, not just recall`,

      'essay': `
Create an essay question that:
- Requires extended written response (2-3 paragraphs)
- Tests higher-order thinking
- Has clear evaluation criteria`,

      'calculation': `
Create a calculation problem that:
- Requires showing work/steps
- Has a definite numerical answer
- Includes appropriate units
- Tests both process and result`,

      'data-interpretation': `
Create a data interpretation question that:
- Presents data in table, graph, or chart form
- Requires analysis, not just reading values
- Tests understanding of patterns and trends`,

      'coding': `
Create a coding problem that:
- Has clear input/output specifications
- Can be solved in multiple languages
- Includes test cases
- Tests algorithmic thinking`,

      'diagram': `
Create a question requiring a diagram that:
- Specifies what should be labeled
- Tests spatial/visual understanding
- Has clear evaluation criteria`,

      'true-false': `
Create a true/false question that:
- Tests a specific fact or concept
- Is unambiguously true or false
- Includes explanation of why`,

      'matching': `
Create a matching question with:
- Two columns of related items
- At least 5-7 items per column
- One correct match for each item`,

      'fill-in-blank': `
Create a fill-in-the-blank question that:
- Has a clear, single correct answer
- Tests recall of key terms
- Provides sufficient context`
    };

    return guidance[type] || '';
  }

  async generateExerciseSet(
    topic: string,
    config: Partial<ExerciseConfig>,
    count: number = 5
  ): Promise<Exercise[]> {
    const baseConfig: ExerciseConfig = {
      topic,
      bloomLevel: config.bloomLevel || 'understand',
      difficulty: config.difficulty || 3,
      questionType: config.questionType || 'multiple-choice',
      purpose: config.purpose || 'practice',
      classType: config.classType || 'STEM',
      variants: 1,
      includeRubric: config.includeRubric || false,
      includeSolution: config.includeSolution ?? true,
      includeDistractors: config.includeDistractors ?? true
    };

    const exercises: Exercise[] = [];

    // Generate variety: different question types and Bloom's levels
    const questionTypes: QuestionType[] = ['multiple-choice', 'short-answer', 'calculation'];
    const bloomLevels = ['understand', 'apply', 'analyze'] as const;

    for (let i = 0; i < count; i++) {
      const variedConfig = {
        ...baseConfig,
        questionType: questionTypes[i % questionTypes.length],
        bloomLevel: bloomLevels[i % bloomLevels.length],
        difficulty: Math.min(5, baseConfig.difficulty + (i % 3) - 1) // Vary difficulty slightly
      };

      const exercise = await this.generateSingleExercise(variedConfig, i);
      exercises.push(exercise);
    }

    return exercises;
  }

  async generateAssessment(
    topic: string,
    totalPoints: number,
    bloomDistribution?: Partial<Record<string, number>>
  ): Promise<Exercise[]> {
    // Default Bloom's distribution for a balanced assessment
    const distribution = bloomDistribution || {
      remember: 0.15,
      understand: 0.25,
      apply: 0.30,
      analyze: 0.20,
      evaluate: 0.10
    };

    const exercises: Exercise[] = [];
    let pointsAllocated = 0;

    for (const [level, percentage] of Object.entries(distribution)) {
      const points = Math.round(totalPoints * percentage);

      // Generate 1-3 questions for this Bloom's level
      const numQuestions = Math.ceil(points / 10); // Roughly 10 points per question

      for (let i = 0; i < numQuestions; i++) {
        const config: ExerciseConfig = {
          topic,
          bloomLevel: level as any,
          difficulty: 3,
          questionType: this.selectQuestionTypeForBloom(level as any),
          purpose: 'summative',
          classType: 'STEM',
          variants: 1,
          includeRubric: true,
          includeSolution: true,
          includeDistractors: true
        };

        const exercise = await this.generateSingleExercise(config, i);
        exercises.push(exercise);
        pointsAllocated += Math.floor(points / numQuestions);
      }
    }

    logger.info(`Generated assessment with ${exercises.length} questions, ${pointsAllocated} points`);
    return exercises;
  }

  private selectQuestionTypeForBloom(bloomLevel: string): QuestionType {
    const typesByLevel: Record<string, QuestionType[]> = {
      remember: ['multiple-choice', 'fill-in-blank', 'short-answer'],
      understand: ['short-answer', 'multiple-choice'],
      apply: ['calculation', 'coding', 'short-answer'],
      analyze: ['data-interpretation', 'essay', 'short-answer'],
      evaluate: ['essay', 'short-answer'],
      create: ['essay', 'coding', 'diagram']
    };

    const types = typesByLevel[bloomLevel] || ['short-answer'];
    return types[Math.floor(Math.random() * types.length)];
  }

  async validate(output: any): Promise<boolean> {
    try {
      if (Array.isArray(output)) {
        output.forEach(ex => ExerciseSchema.parse(ex));
      } else {
        ExerciseSchema.parse(output);
      }
      return true;
    } catch (error) {
      logger.error('Exercise validation failed', error);
      return false;
    }
  }
}