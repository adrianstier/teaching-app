import { BaseAgent } from './base-agent';
import { AgentContext } from '../types';
import {
  LearningOutcome,
  LearningOutcomeSchema,
  BloomLevel,
  BloomVerbsByLevel
} from '../types/extended-types';
import logger from '../utils/logger';

export class LearningOutcomesAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Learning Outcomes Assistant',
        role: 'Outcomes Design Specialist',
        description: 'Helps write measurable, actionable learning outcomes aligned with Bloom\'s taxonomy',
        systemPrompt: `You are an expert in learning outcomes design and Bloom's taxonomy.

        Your role is to:
        1. Help instructors write clear, measurable learning outcomes
        2. Classify outcomes by Bloom's cognitive level
        3. Ensure outcomes are specific, actionable, and assessable
        4. Map outcomes to course activities and assessments
        5. Identify gaps in outcome coverage

        Good Learning Outcomes:
        - Start with "By the end of [timeframe], students will be able to..."
        - Use specific, observable action verbs
        - Include clear object (what students will do)
        - Are measurable and assessable
        - Align with appropriate Bloom's level for the course

        Bloom's Taxonomy Levels:
        - Remember: recall facts, terms, concepts
        - Understand: explain ideas, summarize, interpret
        - Apply: use knowledge in new situations, solve problems
        - Analyze: break down information, find patterns, distinguish parts
        - Evaluate: make judgments, critique, justify
        - Create: produce new work, design, construct

        Poor Learning Outcomes to Avoid:
        - Vague verbs: "know", "understand", "appreciate", "be familiar with"
        - Too broad: "understand calculus"
        - Not measurable: "appreciate the beauty of poetry"
        - Missing context or specificity`
      },
      context
    );
  }

  async execute(input: {
    topic: string;
    courseLevel?: string;
    duration?: string;
    existingOutcomes?: string[];
  }): Promise<LearningOutcome[]> {
    logger.info(`Generating learning outcomes for: ${input.topic}`);

    if (input.existingOutcomes && input.existingOutcomes.length > 0) {
      return this.improveExistingOutcomes(input.existingOutcomes, input.topic);
    } else {
      return this.generateNewOutcomes(input.topic, input.courseLevel || 'undergraduate', input.duration || 'course');
    }
  }

  async generateNewOutcomes(
    topic: string,
    courseLevel: string,
    duration: string
  ): Promise<LearningOutcome[]> {
    const prompt = `Generate 5-7 learning outcomes for a ${courseLevel} ${duration} on "${topic}".

Create outcomes that:
1. Cover different Bloom's levels (aim for 20% remember/understand, 40% apply, 30% analyze, 10% evaluate/create)
2. Progress from foundational to advanced
3. Are specific and measurable
4. Use appropriate action verbs for each Bloom's level

For each outcome, provide:
- The complete outcome statement ("By the end of this ${duration}, students will be able to...")
- The Bloom's level
- The specific verb used
- The object/content
- Suggested assessment methods

Return as JSON array:
[
  {
    "statement": "By the end of this course, students will be able to...",
    "bloomLevel": "apply",
    "verb": "demonstrate",
    "object": "object/skill/knowledge",
    "context": "optional context",
    "suggestedActivities": ["activity 1", "activity 2"],
    "assessmentAlignment": 0.8
  }
]`;

    try {
      const response = await this.think(prompt, { responseFormat: 'json' });
      const outcomesData = JSON.parse(response);

      const outcomes: LearningOutcome[] = outcomesData.map((data: any, index: number) => ({
        id: `lo-${Date.now()}-${index}`,
        statement: data.statement,
        bloomLevel: data.bloomLevel,
        verb: data.verb,
        object: data.object,
        context: data.context,
        coverage: {
          lectures: [],
          activities: [],
          assessments: []
        },
        status: 'missing' as const,
        suggestedActivities: data.suggestedActivities || [],
        assessmentAlignment: data.assessmentAlignment || 0.5
      }));

      logger.info(`Generated ${outcomes.length} learning outcomes`);
      return outcomes;

    } catch (error) {
      logger.error('Failed to generate learning outcomes', error);
      throw error;
    }
  }

  async improveExistingOutcomes(
    existingStatements: string[],
    topic: string
  ): Promise<LearningOutcome[]> {
    const prompt = `Analyze and improve these learning outcomes for a course on "${topic}":

${existingStatements.map((s, i) => `${i + 1}. ${s}`).join('\n')}

For each outcome:
1. Identify the Bloom's level
2. Extract the verb and object
3. Assess if it's well-written (specific, measurable, appropriate verb)
4. Suggest improvements if needed
5. Recommend activities and assessments

Return as JSON array with:
[
  {
    "original": "the original statement",
    "improved": "improved statement (or same if already good)",
    "bloomLevel": "the Bloom's level",
    "verb": "the action verb",
    "object": "what students will do",
    "issues": ["issue 1", "issue 2"] or [],
    "improvements": "explanation of changes made",
    "suggestedActivities": ["activity 1", "activity 2"],
    "assessmentAlignment": 0.0 to 1.0
  }
]`;

    try {
      const response = await this.think(prompt, { responseFormat: 'json' });
      const analyzed = JSON.parse(response);

      const outcomes: LearningOutcome[] = analyzed.map((data: any, index: number) => ({
        id: `lo-${Date.now()}-${index}`,
        statement: data.improved,
        bloomLevel: data.bloomLevel,
        verb: data.verb,
        object: data.object,
        context: '',
        coverage: {
          lectures: [],
          activities: [],
          assessments: []
        },
        status: 'missing' as const,
        suggestedActivities: data.suggestedActivities || [],
        assessmentAlignment: data.assessmentAlignment || 0.5
      }));

      return outcomes;

    } catch (error) {
      logger.error('Failed to improve learning outcomes', error);
      throw error;
    }
  }

  async analyzeOutcomeCoverage(
    outcomes: LearningOutcome[],
    courseContent: {
      lectures: Array<{ id: string; topic: string; content: string }>;
      activities: Array<{ id: string; type: string; description: string }>;
      assessments: Array<{ id: string; type: string; questions: string[] }>;
    }
  ): Promise<LearningOutcome[]> {
    logger.info('Analyzing outcome coverage across course content');

    const prompt = `Analyze how well these learning outcomes are covered in the course content.

Learning Outcomes:
${outcomes.map((o, i) => `${i + 1}. ${o.statement} (Bloom's: ${o.bloomLevel})`).join('\n')}

Lectures:
${courseContent.lectures.map((l, i) => `${i + 1}. ${l.topic}: ${l.content.substring(0, 200)}...`).join('\n')}

Activities:
${courseContent.activities.map((a, i) => `${i + 1}. ${a.type}: ${a.description}`).join('\n')}

Assessments:
${courseContent.assessments.map((a, i) => `${i + 1}. ${a.type} with ${a.questions.length} questions`).join('\n')}

For each learning outcome, identify:
1. Which lectures address it
2. Which activities practice it
3. Which assessments test it
4. Coverage status: over-covered, adequate, under-covered, or missing
5. Specific recommendations for improvement

Return as JSON:
[
  {
    "outcomeIndex": 0,
    "lectures": ["lecture-1", "lecture-3"],
    "activities": ["activity-2"],
    "assessments": ["assessment-1"],
    "status": "adequate" | "over-covered" | "under-covered" | "missing",
    "recommendations": ["Add practice activity", "Include in midterm"]
  }
]`;

    try {
      const response = await this.think(prompt, { responseFormat: 'json' });
      const coverage = JSON.parse(response);

      // Update outcomes with coverage information
      const updatedOutcomes = outcomes.map((outcome, index) => {
        const cov = coverage.find((c: any) => c.outcomeIndex === index);

        if (cov) {
          return {
            ...outcome,
            coverage: {
              lectures: cov.lectures || [],
              activities: cov.activities || [],
              assessments: cov.assessments || []
            },
            status: cov.status || 'missing',
            suggestedActivities: cov.recommendations || outcome.suggestedActivities
          };
        }

        return outcome;
      });

      return updatedOutcomes;

    } catch (error) {
      logger.error('Failed to analyze outcome coverage', error);
      throw error;
    }
  }

  async generateBloomBalanceReport(outcomes: LearningOutcome[]): Promise<{
    distribution: Record<BloomLevel, number>;
    recommendations: string[];
    idealDistribution: Record<BloomLevel, number>;
  }> {
    const distribution: Record<string, number> = {
      remember: 0,
      understand: 0,
      apply: 0,
      analyze: 0,
      evaluate: 0,
      create: 0
    };

    outcomes.forEach(outcome => {
      distribution[outcome.bloomLevel] = (distribution[outcome.bloomLevel] || 0) + 1;
    });

    // Convert to percentages
    const total = outcomes.length;
    const percentages: Record<BloomLevel, number> = {} as any;

    Object.keys(distribution).forEach(level => {
      percentages[level as BloomLevel] = (distribution[level] / total) * 100;
    });

    // Ideal distribution for undergraduate courses
    const idealDistribution: Record<BloomLevel, number> = {
      remember: 10,
      understand: 20,
      apply: 35,
      analyze: 20,
      evaluate: 10,
      create: 5
    };

    // Generate recommendations
    const recommendations: string[] = [];

    Object.entries(percentages).forEach(([level, percentage]) => {
      const ideal = idealDistribution[level as BloomLevel];
      const diff = percentage - ideal;

      if (diff > 15) {
        recommendations.push(`Too many "${level}" outcomes (${percentage.toFixed(0)}% vs ideal ${ideal}%). Consider converting some to higher-order thinking.`);
      } else if (diff < -15) {
        recommendations.push(`Too few "${level}" outcomes (${percentage.toFixed(0)}% vs ideal ${ideal}%). Consider adding more ${level}-level outcomes.`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Bloom\'s distribution is well-balanced!');
    }

    return {
      distribution: percentages,
      recommendations,
      idealDistribution
    };
  }

  async suggestActivitiesForOutcome(outcome: LearningOutcome): Promise<string[]> {
    const prompt = `Suggest 3-5 specific learning activities to help students achieve this learning outcome:

"${outcome.statement}"

Bloom's Level: ${outcome.bloomLevel}

Activities should:
1. Be appropriate for the Bloom's level (${outcome.bloomLevel})
2. Be practical and implementable in class
3. Provide opportunities for practice and feedback
4. Range from individual to collaborative
5. Include both formative and summative options

Return as JSON array of activity descriptions:
["Activity 1", "Activity 2", "Activity 3"]`;

    try {
      const response = await this.think(prompt, { responseFormat: 'json' });
      return JSON.parse(response);
    } catch (error) {
      logger.error('Failed to suggest activities', error);
      return [];
    }
  }

  async validateOutcomeQuality(statement: string): Promise<{
    isGood: boolean;
    issues: string[];
    suggestions: string[];
    bloomLevel: BloomLevel;
  }> {
    const prompt = `Evaluate this learning outcome for quality:

"${statement}"

Check for:
1. Does it start with an appropriate phrase?
2. Does it use a specific, observable action verb?
3. Is the verb appropriate for a specific Bloom's level?
4. Is it measurable and assessable?
5. Is it specific enough (not too vague or too narrow)?
6. Does it avoid weak verbs like "know", "understand", "appreciate"?

Return as JSON:
{
  "isGood": true/false,
  "bloomLevel": "the detected Bloom's level",
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

    try {
      const response = await this.think(prompt, { responseFormat: 'json' });
      return JSON.parse(response);
    } catch (error) {
      logger.error('Failed to validate outcome', error);
      throw error;
    }
  }

  async validate(output: any): Promise<boolean> {
    try {
      if (Array.isArray(output)) {
        output.forEach(o => LearningOutcomeSchema.parse(o));
      } else {
        LearningOutcomeSchema.parse(output);
      }
      return true;
    } catch (error) {
      logger.error('Learning outcome validation failed', error);
      return false;
    }
  }
}