import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  MisconceptionDatabase,
  Misconception
} from '../types/pedagogical-features';

export interface MisconceptionInput {
  topic: string;
  discipline: string;
  concepts: string[];
  studentLevel: 'introductory' | 'intermediate' | 'advanced';
}

export interface DiagnosticQuestionInput {
  misconception: Misconception;
  questionCount: number;
}

export interface ConceptualChangeInput {
  misconception: Misconception;
  availableTime: number; // minutes
  classSize: number;
}

/**
 * MisconceptionAgent
 *
 * Implements misconception identification and remediation based on
 * research by Chi (2008) and Vosniadou (1994).
 *
 * Key features:
 * - Discipline-specific misconception databases
 * - Diagnostic question generation
 * - Conceptual change strategies
 * - Corrective analogies and explanations
 */
export class MisconceptionAgent {
  name = 'MisconceptionAgent';
  description = 'Identify and address student misconceptions with research-based strategies';

  /**
   * Generate a misconception database for a topic
   */
  async generateMisconceptionDatabase(input: MisconceptionInput): Promise<MisconceptionDatabase> {
    logger.info(`[${this.name}] Generating misconception database for: ${input.topic} in ${input.discipline}`);

    const systemPrompt = `You are an expert in student misconceptions and conceptual change. You have extensive knowledge of research-documented misconceptions across disciplines.

Research basis:
- Chi (2008) on types of misconceptions
- Vosniadou (1994) on framework theories
- DiSessa on p-prims
- Strike & Posner on conceptual change

Types of misconceptions:
- Surface-level: Terminology confusion, easily corrected
- Deep-seated: Fundamental misunderstanding of concepts
- Threshold concepts: Transformative, troublesome knowledge
- Framework theories: Coherent but incorrect mental models`;

    const prompt = `Create a misconception database for:

Topic: ${input.topic}
Discipline: ${input.discipline}
Concepts: ${JSON.stringify(input.concepts)}
Student Level: ${input.studentLevel}

For each concept, identify:
1. 2-4 common misconceptions with research backing
2. Diagnostic questions that reveal each misconception
3. Conceptual change strategies
4. Corrective analogies

Return JSON:
{
  "discipline": "${input.discipline}",
  "misconceptions": [
    {
      "id": "<unique-id>",
      "topic": "<topic>",
      "discipline": "${input.discipline}",
      "misconception": "<what students mistakenly believe>",
      "correctUnderstanding": "<accurate understanding>",
      "prevalence": "common" | "frequent" | "occasional" | "rare",
      "persistence": "surface" | "moderate" | "deep-seated" | "threshold-concept",
      "researchCitations": ["<citation>"],
      "diagnosticQuestions": [
        {
          "question": "<question that reveals this misconception>",
          "revealsMisconception": "<answer indicating misconception>",
          "indicatesUnderstanding": "<answer showing understanding>"
        }
      ],
      "typicalWrongAnswers": ["<wrong answer 1>", "<wrong answer 2>"],
      "conceptualChangeStrategies": [
        {
          "strategy": "cognitive-conflict" | "bridging-analogy" | "refutational-text" | "worked-examples" | "contrasting-cases" | "socratic-questioning",
          "description": "<how to apply this strategy>",
          "implementation": "<specific implementation steps>",
          "estimatedTime": <minutes>
        }
      ],
      "prerequisiteGaps": ["<gap 1>"],
      "relatedMisconceptions": ["<related-id>"],
      "correctiveAnalogies": [
        {
          "analogy": "<the analogy>",
          "targetMapping": "<what maps to what>",
          "limitations": ["<limitation 1>"]
        }
      ]
    }
  ],
  "diagnosticBank": [
    {
      "id": "<q-id>",
      "topic": "<topic>",
      "question": "<diagnostic question>",
      "options": [
        {
          "text": "<option text>",
          "isCorrect": true | false,
          "misconceptionId": "<links to misconception if wrong answer>"
        }
      ],
      "explanation": "<why correct answer is correct>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<MisconceptionDatabase>(prompt, systemPrompt, 8192);
      logger.info(`[${this.name}] Generated database with ${result.misconceptions.length} misconceptions`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating database:`, error);
      return this.getFallbackDatabase(input);
    }
  }

  /**
   * Generate additional diagnostic questions for a specific misconception
   */
  async generateDiagnosticQuestions(input: DiagnosticQuestionInput): Promise<Array<{
    question: string;
    options: Array<{ text: string; isCorrect: boolean; misconceptionIndicator?: string }>;
    explanation: string;
  }>> {
    logger.info(`[${this.name}] Generating ${input.questionCount} diagnostic questions for misconception: ${input.misconception.id}`);

    const systemPrompt = `You are an expert in formative assessment and misconception diagnosis. You create questions that specifically reveal whether students hold particular misconceptions.`;

    const prompt = `Create ${input.questionCount} diagnostic questions for this misconception:

Misconception: ${input.misconception.misconception}
Correct Understanding: ${input.misconception.correctUnderstanding}
Typical Wrong Answers: ${JSON.stringify(input.misconception.typicalWrongAnswers)}

Each question should:
1. Be answerable differently by those with vs. without the misconception
2. Have distractors based on the specific misconception
3. Include an explanation of what each answer choice reveals

Return JSON array:
[
  {
    "question": "<the diagnostic question>",
    "options": [
      { "text": "<option>", "isCorrect": true, "misconceptionIndicator": null },
      { "text": "<option>", "isCorrect": false, "misconceptionIndicator": "<what this answer reveals>" }
    ],
    "explanation": "<why correct answer is correct and what wrong answers indicate>"
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<Array<{
        question: string;
        options: Array<{ text: string; isCorrect: boolean; misconceptionIndicator?: string }>;
        explanation: string;
      }>>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating questions:`, error);
      return [];
    }
  }

  /**
   * Generate a conceptual change activity for a specific misconception
   */
  async generateConceptualChangeActivity(input: ConceptualChangeInput): Promise<{
    strategy: string;
    activity: {
      name: string;
      phases: Array<{
        name: string;
        duration: number;
        instructions: string;
        studentActions: string;
      }>;
      materials: string[];
      instructorNotes: string;
    };
    assessmentOfChange: string;
  }> {
    logger.info(`[${this.name}] Generating conceptual change activity for: ${input.misconception.misconception}`);

    const systemPrompt = `You are an expert in conceptual change pedagogy. You design activities that help students recognize and revise their misconceptions.

Conceptual change strategies:
1. Cognitive conflict: Create situations where misconception fails
2. Bridging analogies: Use intermediate cases to build understanding
3. Refutational text: Explicitly state and refute misconception
4. Contrasting cases: Compare correct and incorrect examples
5. Socratic questioning: Guide discovery through questions`;

    const prompt = `Design a conceptual change activity:

Misconception: ${input.misconception.misconception}
Correct Understanding: ${input.misconception.correctUnderstanding}
Available Time: ${input.availableTime} minutes
Class Size: ${input.classSize} students
Persistence Level: ${input.misconception.persistence}

Choose the most appropriate strategy and design a complete activity.

Return JSON:
{
  "strategy": "<chosen strategy>",
  "activity": {
    "name": "<activity name>",
    "phases": [
      {
        "name": "<phase name>",
        "duration": <minutes>,
        "instructions": "<instructor instructions>",
        "studentActions": "<what students do>"
      }
    ],
    "materials": ["<material 1>"],
    "instructorNotes": "<key facilitation notes>"
  },
  "assessmentOfChange": "<how to verify misconception is addressed>"
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        strategy: string;
        activity: {
          name: string;
          phases: Array<{
            name: string;
            duration: number;
            instructions: string;
            studentActions: string;
          }>;
          materials: string[];
          instructorNotes: string;
        };
        assessmentOfChange: string;
      }>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating activity:`, error);
      return {
        strategy: 'cognitive-conflict',
        activity: {
          name: 'Misconception Challenge Activity',
          phases: [
            {
              name: 'Elicit',
              duration: 5,
              instructions: 'Ask students to predict/explain',
              studentActions: 'Make predictions based on current understanding'
            },
            {
              name: 'Confront',
              duration: 10,
              instructions: 'Present anomalous data or counterexample',
              studentActions: 'Observe and try to explain the conflict'
            },
            {
              name: 'Resolve',
              duration: 10,
              instructions: 'Guide toward correct understanding',
              studentActions: 'Revise mental model and re-explain'
            }
          ],
          materials: ['Demonstration materials', 'Worksheet'],
          instructorNotes: 'Allow time for cognitive dissonance. Don\'t rush to resolve.'
        },
        assessmentOfChange: 'Present a new scenario requiring the correct understanding'
      };
    }
  }

  /**
   * Track misconception prevalence in a class
   */
  trackClassMisconceptions(
    diagnosticResults: Array<{ studentId: string; questionId: string; selectedOption: string; misconceptionId?: string }>
  ): Array<{
    misconceptionId: string;
    prevalence: number;
    studentCount: number;
    trend: 'increasing' | 'stable' | 'decreasing' | 'new';
  }> {
    const misconceptionCounts: Record<string, number> = {};
    const totalResponses = diagnosticResults.length;

    diagnosticResults.forEach(result => {
      if (result.misconceptionId) {
        misconceptionCounts[result.misconceptionId] = (misconceptionCounts[result.misconceptionId] || 0) + 1;
      }
    });

    return Object.entries(misconceptionCounts).map(([id, count]) => ({
      misconceptionId: id,
      prevalence: count / totalResponses,
      studentCount: count,
      trend: 'new' as const // In a real system, compare to previous assessments
    }));
  }

  private getFallbackDatabase(input: MisconceptionInput): MisconceptionDatabase {
    return {
      discipline: input.discipline,
      misconceptions: input.concepts.map((concept, idx) => ({
        id: `misc-${idx + 1}`,
        topic: concept,
        discipline: input.discipline,
        misconception: `Common misunderstanding about ${concept}`,
        correctUnderstanding: `The accurate understanding of ${concept}`,
        prevalence: 'common' as const,
        persistence: 'moderate' as const,
        researchCitations: ['Research on misconceptions in ' + input.discipline],
        diagnosticQuestions: [{
          question: `Which statement about ${concept} is most accurate?`,
          revealsMisconception: 'Incorrect answer based on misconception',
          indicatesUnderstanding: 'Correct answer showing understanding'
        }],
        typicalWrongAnswers: ['Common wrong answer 1', 'Common wrong answer 2'],
        conceptualChangeStrategies: [{
          strategy: 'cognitive-conflict' as const,
          description: 'Create a situation where the misconception fails',
          implementation: 'Present a counterexample that the misconception cannot explain',
          estimatedTime: 15
        }],
        prerequisiteGaps: ['Foundational understanding'],
        relatedMisconceptions: [],
        correctiveAnalogies: [{
          analogy: `Think of ${concept} like...`,
          targetMapping: 'How the analogy maps to the concept',
          limitations: ['This analogy breaks down when...']
        }]
      })),
      diagnosticBank: input.concepts.map((concept, idx) => ({
        id: `diag-${idx + 1}`,
        topic: concept,
        question: `Which best describes ${concept}?`,
        options: [
          { text: 'Correct understanding', isCorrect: true },
          { text: 'Common misconception', isCorrect: false, misconceptionId: `misc-${idx + 1}` },
          { text: 'Another misconception', isCorrect: false, misconceptionId: `misc-${idx + 1}` },
          { text: 'Correct but incomplete', isCorrect: false }
        ],
        explanation: `The correct answer demonstrates understanding of ${concept}`
      }))
    };
  }
}
