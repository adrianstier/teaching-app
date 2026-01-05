import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  ElaborativeInterrogationSystem,
  ElaborativePrompt,
  CausalReasoningScaffold,
  ConnectionMakingExercise,
  StudentGeneratedQuestions
} from '../types/pedagogical-features';

export interface ElaborativePromptInput {
  content: string;
  targetConcept: string;
  type: 'why' | 'how' | 'what-if' | 'compare-contrast' | 'cause-effect' |
        'predict' | 'connect' | 'justify' | 'evaluate';
  scaffoldLevel: 'heavy' | 'moderate' | 'light';
}

export interface CausalScaffoldInput {
  phenomenon: string;
  domain: string;
  priorKnowledge: string[];
}

export interface ConnectionExerciseInput {
  newConcept: string;
  priorConcepts: string[];
  domain: string;
}

export interface QuestionGenerationInput {
  topic: string;
  sampleContent: string;
  targetQuality: 'deep-processing' | 'surface' | 'mixed';
}

/**
 * ElaborativeInterrogationAgent
 *
 * Implements elaborative interrogation and deep processing strategies
 * based on research by Dunlosky et al. (2013) and Pressley et al. (1987).
 *
 * Key features:
 * - Why/how question prompts for deep processing
 * - Causal reasoning scaffolds
 * - Connection-making exercises
 * - Student question generation training
 */
export class ElaborativeInterrogationAgent {
  name = 'ElaborativeInterrogationAgent';
  description = 'Generate deep processing prompts and elaborative interrogation activities';

  /**
   * Generate elaborative prompts for content
   */
  async generateElaborativePrompts(input: ElaborativePromptInput): Promise<ElaborativePrompt[]> {
    logger.info(`[${this.name}] Generating ${input.type} prompts for: ${input.targetConcept}`);

    const systemPrompt = `You are an expert in elaborative interrogation and deep learning strategies. You create prompts that encourage students to process information more deeply.

Research basis:
- Elaborative interrogation: "Why does this make sense?"
- Self-explanation: "Explain this in your own words"
- Chi et al. on self-explanation effect
- Dunlosky et al. on learning strategies

Prompt types and their purposes:
- Why: Understand causal mechanisms
- How: Understand processes and procedures
- What-if: Counterfactual reasoning, transfer
- Compare-contrast: Discrimination, integration
- Cause-effect: Causal reasoning
- Predict: Anticipation, hypothesis testing
- Connect: Integration with prior knowledge
- Justify: Evidence-based reasoning
- Evaluate: Critical thinking`;

    const prompt = `Generate elaborative prompts:

Content: ${input.content.substring(0, 2000)}
Target Concept: ${input.targetConcept}
Prompt Type: ${input.type}
Scaffolding Level: ${input.scaffoldLevel}

Create 3-5 prompts that:
1. Require deep processing, not just recall
2. Are appropriate to the scaffolding level
3. Have exemplar responses for self-checking
4. Include quality criteria

Return JSON array:
[
  {
    "id": "<unique-id>",
    "type": "${input.type}",
    "prompt": "<the elaborative prompt>",
    "targetContent": "<what content this addresses>",
    "insertAfter": "<where to insert>",
    "scaffoldedVersions": [
      {
        "level": "heavy",
        "prompt": "<highly scaffolded version>"
      },
      {
        "level": "moderate",
        "prompt": "<moderately scaffolded>"
      },
      {
        "level": "light",
        "prompt": "<minimal scaffolding>"
      }
    ],
    "exemplarResponse": "<what a good response looks like>",
    "responseQualityCriteria": ["<criterion 1>", "<criterion 2>"]
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<ElaborativePrompt[]>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated ${result.length} elaborative prompts`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating prompts:`, error);
      return this.getFallbackPrompts(input);
    }
  }

  /**
   * Generate causal reasoning scaffolds
   */
  async generateCausalScaffold(input: CausalScaffoldInput): Promise<CausalReasoningScaffold> {
    logger.info(`[${this.name}] Generating causal scaffold for: ${input.phenomenon}`);

    const systemPrompt = `You are an expert in causal reasoning and scientific explanation. You create scaffolds that help students understand causal mechanisms.

Key elements of causal explanations:
1. Identify cause(s)
2. Describe mechanism
3. Explain effect(s)
4. Provide evidence
5. Consider counterfactuals`;

    const prompt = `Create a causal reasoning scaffold:

Phenomenon: ${input.phenomenon}
Domain: ${input.domain}
Prior Knowledge: ${JSON.stringify(input.priorKnowledge)}

Structure the causal chain and create prompts for discovery.

Return JSON:
{
  "id": "<unique-id>",
  "phenomenon": "${input.phenomenon}",
  "causalChain": [
    {
      "cause": "<the cause>",
      "mechanism": "<how it leads to effect>",
      "effect": "<the effect>",
      "evidence": "<supporting evidence>"
    }
  ],
  "discoveryPrompts": [
    "<prompt to discover causation>"
  ],
  "counterfactuals": [
    {
      "ifNot": "<if this didn't happen>",
      "then": "<what would result>",
      "because": "<why>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<CausalReasoningScaffold>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated causal scaffold with ${result.causalChain.length} links`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating scaffold:`, error);
      return this.getFallbackCausalScaffold(input);
    }
  }

  /**
   * Generate connection-making exercises
   */
  async generateConnectionExercise(input: ConnectionExerciseInput): Promise<ConnectionMakingExercise> {
    logger.info(`[${this.name}] Generating connection exercise for: ${input.newConcept}`);

    const systemPrompt = `You are an expert in meaningful learning and knowledge integration. You help students connect new learning to prior knowledge.

Research basis:
- Ausubel's meaningful learning theory
- Schema theory
- Conceptual change research

Effective connections:
1. Analogies - similar structures
2. Contrasts - what it's NOT
3. Prerequisites - what it builds on
4. Applications - where it's used
5. Examples - instances of the concept`;

    const prompt = `Create a connection-making exercise:

New Concept: ${input.newConcept}
Prior Concepts: ${JSON.stringify(input.priorConcepts)}
Domain: ${input.domain}

Help students connect the new concept to what they already know.

Return JSON:
{
  "id": "<unique-id>",
  "newConcept": "${input.newConcept}",
  "priorKnowledgeLinks": [
    {
      "priorConcept": "<prior concept>",
      "relationship": "analogous" | "contrasting" | "prerequisite" | "application" | "example",
      "connectionExplanation": "<how they connect>"
    }
  ],
  "connectionPrompts": [
    "<prompt to make connections>"
  ],
  "conceptMapActivity": {
    "centralConcept": "${input.newConcept}",
    "nodesToConnect": ${JSON.stringify(input.priorConcepts)},
    "relationshipTypes": ["leads to", "is similar to", "is different from", "requires"],
    "exemplarMap": "<description of a good concept map>"
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<ConnectionMakingExercise>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated connection exercise with ${result.priorKnowledgeLinks.length} links`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating exercise:`, error);
      return this.getFallbackConnectionExercise(input);
    }
  }

  /**
   * Generate student question generation training
   */
  async generateQuestionTraining(input: QuestionGenerationInput): Promise<StudentGeneratedQuestions> {
    logger.info(`[${this.name}] Generating question training for: ${input.topic}`);

    const systemPrompt = `You are an expert in student question generation and inquiry-based learning. You help students learn to ask deep, meaningful questions.

Quality question indicators:
1. Requires explanation, not just recall
2. Connects to broader concepts
3. Addresses underlying mechanisms
4. Prompts critical thinking
5. Leads to further inquiry

Poor questions:
- Can be answered with yes/no
- Ask for definitions only
- Have obvious answers
- Don't require thinking`;

    const prompt = `Create question generation training:

Topic: ${input.topic}
Sample Content: ${input.sampleContent.substring(0, 1500)}
Target Quality: ${input.targetQuality}

Provide training materials for students to generate better questions.

Return JSON:
{
  "id": "<unique-id>",
  "topic": "${input.topic}",
  "trainingExamples": [
    {
      "content": "<piece of content>",
      "goodQuestions": [
        {
          "question": "<good question>",
          "qualityExplanation": "<why it's good>"
        }
      ],
      "weakQuestions": [
        {
          "question": "<weak question>",
          "improvement": "<how to make it better>"
        }
      ]
    }
  ],
  "questionStems": {
    "deepProcessing": [
      "Why does...",
      "How would... change if...",
      "What would happen if..."
    ],
    "surfaceLevel": [
      "What is the definition of...",
      "When did... happen"
    ],
    "comparison": [
      "How is... similar to...",
      "What's the difference between..."
    ],
    "application": [
      "How could... be used to...",
      "What would... look like in..."
    ]
  },
  "qualityCriteria": [
    {
      "criterion": "<quality criterion>",
      "exemplar": "<question meeting criterion>",
      "nonExemplar": "<question not meeting criterion>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<StudentGeneratedQuestions>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated question training`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating training:`, error);
      return this.getFallbackQuestionTraining(input);
    }
  }

  /**
   * Create a complete elaborative interrogation system
   */
  async createSystem(courseId: string, topics: string[]): Promise<ElaborativeInterrogationSystem> {
    logger.info(`[${this.name}] Creating elaborative interrogation system for: ${courseId}`);

    const prompts = await Promise.all(
      ['why', 'how', 'connect'].map(type =>
        this.generateElaborativePrompts({
          content: `Content about ${topics[0]}`,
          targetConcept: topics[0],
          type: type as any,
          scaffoldLevel: 'moderate'
        })
      )
    );

    const connectionExercise = topics.length >= 2
      ? await this.generateConnectionExercise({
          newConcept: topics[topics.length - 1],
          priorConcepts: topics.slice(0, -1),
          domain: 'course domain'
        })
      : null;

    return {
      courseId,
      elaborativePrompts: prompts.flat(),
      causalScaffolds: [],
      connectionExercises: connectionExercise ? [connectionExercise] : [],
      questionGenerationTraining: [],
      justificationRequirements: {
        assessmentsRequiringJustification: [],
        justificationRubric: [
          { level: 4, description: 'Complete justification with evidence and reasoning', example: 'Because X, which leads to Y, as shown by Z' },
          { level: 3, description: 'Good justification with some reasoning', example: 'Because X leads to Y' },
          { level: 2, description: 'Partial justification', example: 'Because of X' },
          { level: 1, description: 'No justification or incorrect', example: 'Just because' }
        ]
      }
    };
  }

  private getFallbackPrompts(input: ElaborativePromptInput): ElaborativePrompt[] {
    const prompts: Record<string, string> = {
      'why': `Why does ${input.targetConcept} work this way?`,
      'how': `How does ${input.targetConcept} lead to its effects?`,
      'what-if': `What if ${input.targetConcept} were different? How would outcomes change?`,
      'compare-contrast': `How is ${input.targetConcept} similar to and different from related concepts?`,
      'cause-effect': `What causes ${input.targetConcept}? What effects does it have?`,
      'predict': `Based on ${input.targetConcept}, what would you predict in a new situation?`,
      'connect': `How does ${input.targetConcept} connect to what you already know?`,
      'justify': `What evidence supports the importance of ${input.targetConcept}?`,
      'evaluate': `What are the strengths and limitations of ${input.targetConcept}?`
    };

    return [{
      id: `elab-${Date.now()}`,
      type: input.type,
      prompt: prompts[input.type] || prompts['why'],
      targetContent: input.content.substring(0, 200),
      insertAfter: 'main content',
      scaffoldedVersions: [
        { level: 'heavy', prompt: `Think about ${input.targetConcept}. What might explain how it works?` },
        { level: 'moderate', prompt: prompts[input.type] },
        { level: 'light', prompt: `Explain the mechanism behind ${input.targetConcept}.` }
      ],
      exemplarResponse: `A good response would explain the underlying mechanism of ${input.targetConcept} and connect it to broader principles.`,
      responseQualityCriteria: [
        'Addresses the underlying mechanism',
        'Uses accurate terminology',
        'Makes logical connections'
      ]
    }];
  }

  private getFallbackCausalScaffold(input: CausalScaffoldInput): CausalReasoningScaffold {
    return {
      id: `causal-${Date.now()}`,
      phenomenon: input.phenomenon,
      causalChain: [{
        cause: 'Initial condition or trigger',
        mechanism: 'The process by which cause leads to effect',
        effect: 'The resulting outcome',
        evidence: 'Observable data supporting this link'
      }],
      discoveryPrompts: [
        `What triggers ${input.phenomenon}?`,
        `Through what process does this lead to the observed effect?`,
        `What evidence supports this causal relationship?`
      ],
      counterfactuals: [{
        ifNot: `If the cause were absent`,
        then: `The effect would not occur`,
        because: `The mechanism requires the cause to operate`
      }]
    };
  }

  private getFallbackConnectionExercise(input: ConnectionExerciseInput): ConnectionMakingExercise {
    return {
      id: `connect-${Date.now()}`,
      newConcept: input.newConcept,
      priorKnowledgeLinks: input.priorConcepts.map((prior, i) => ({
        priorConcept: prior,
        relationship: (['analogous', 'prerequisite', 'application'] as const)[i % 3],
        connectionExplanation: `${input.newConcept} relates to ${prior} through shared principles`
      })),
      connectionPrompts: [
        `How is ${input.newConcept} similar to ${input.priorConcepts[0]}?`,
        `What prior knowledge helps you understand ${input.newConcept}?`,
        `Where might you see ${input.newConcept} applied in contexts you already know?`
      ],
      conceptMapActivity: {
        centralConcept: input.newConcept,
        nodesToConnect: input.priorConcepts,
        relationshipTypes: ['builds on', 'is similar to', 'is applied in', 'contrasts with'],
        exemplarMap: `A concept map with ${input.newConcept} in the center, connected to each prior concept with labeled relationships`
      }
    };
  }

  private getFallbackQuestionTraining(input: QuestionGenerationInput): StudentGeneratedQuestions {
    return {
      id: `qgen-${Date.now()}`,
      topic: input.topic,
      trainingExamples: [{
        content: input.sampleContent.substring(0, 200),
        goodQuestions: [
          { question: `Why does ${input.topic} work this way?`, qualityExplanation: 'Requires explanation of mechanism' },
          { question: `How would changing X affect ${input.topic}?`, qualityExplanation: 'Promotes counterfactual thinking' }
        ],
        weakQuestions: [
          { question: `What is ${input.topic}?`, improvement: 'Ask about mechanisms: "How does X in ${input.topic} lead to Y?"' },
          { question: `Is ${input.topic} important?`, improvement: 'Ask about significance: "What would change without ${input.topic}?"' }
        ]
      }],
      questionStems: {
        deepProcessing: [
          'Why does...',
          'How would X change if...',
          'What would happen if...',
          'What mechanisms explain...'
        ],
        surfaceLevel: [
          'What is...',
          'When did...',
          'Who discovered...'
        ],
        comparison: [
          'How is X similar to Y...',
          'What distinguishes X from Y...'
        ],
        application: [
          'How could X be used to...',
          'In what situations would...'
        ]
      },
      qualityCriteria: [
        {
          criterion: 'Requires explanation',
          exemplar: 'Why do plants need sunlight to produce glucose?',
          nonExemplar: 'Do plants need sunlight?'
        },
        {
          criterion: 'Promotes transfer',
          exemplar: 'How might photosynthesis principles apply to solar energy?',
          nonExemplar: 'Where does photosynthesis occur?'
        }
      ]
    };
  }
}
