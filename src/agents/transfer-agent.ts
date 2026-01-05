import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  TransferOrientedDesign,
  TransferActivity,
  AnalogicalTransferExercise,
  AbstractionLadder,
  TransferDistance
} from '../types/pedagogical-features';

export interface TransferActivityInput {
  sourceConcept: string;
  sourceContext: string;
  targetContext: string;
  transferDistance: TransferDistance;
  scaffoldingLevel: 'heavy' | 'moderate' | 'light' | 'none';
}

export interface AnalogicalInput {
  sourceCase: {
    domain: string;
    situation: string;
    solution: string;
  };
  targetDomain: string;
}

export interface AbstractionInput {
  concept: string;
  concreteExamples: string[];
  targetAbstraction: string;
}

/**
 * TransferAgent
 *
 * Implements transfer-oriented design based on research by
 * Perkins & Salomon (1992) and Barnett & Ceci (2002).
 *
 * Key features:
 * - Near vs. far transfer activities
 * - Analogical transfer exercises
 * - Abstraction ladders (concrete to abstract)
 * - Cross-domain application scenarios
 */
export class TransferAgent {
  name = 'TransferAgent';
  description = 'Design learning experiences that promote transfer to new contexts';

  /**
   * Generate a transfer activity
   */
  async generateTransferActivity(input: TransferActivityInput): Promise<TransferActivity> {
    logger.info(`[${this.name}] Generating ${input.transferDistance} transfer activity`);

    const systemPrompt = `You are an expert in transfer of learning. You design activities that help students apply knowledge to new contexts.

Research basis:
- Perkins & Salomon on low-road and high-road transfer
- Barnett & Ceci on transfer dimensions
- Gick & Holyoak on analogical transfer

Transfer types:
- Near: Similar surface and deep structure
- Moderate: Different surface, similar deep structure
- Far: Different surface and context, same underlying principle

Key strategies:
1. Hugging: Maximize similarity to promote low-road transfer
2. Bridging: Explicitly connect through abstraction for high-road transfer
3. Abstraction: Extract underlying principles
4. Multiple contexts: Vary surface features`;

    const prompt = `Create a transfer activity:

Source Concept: ${input.sourceConcept}
Source Context: ${input.sourceContext}
Target Context: ${input.targetContext}
Transfer Distance: ${input.transferDistance}
Scaffolding: ${input.scaffoldingLevel}

Design an activity that helps students apply the concept in the new context.

Return JSON:
{
  "id": "<unique-id>",
  "sourceConcept": "${input.sourceConcept}",
  "sourceContext": "${input.sourceContext}",
  "targetContext": "${input.targetContext}",
  "transferDistance": "${input.transferDistance}",
  "activity": {
    "setup": "<activity introduction>",
    "task": "<what students do>",
    "scaffolding": [
      {
        "level": "heavy" | "moderate" | "light" | "none",
        "support": "<scaffolding provided at this level>"
      }
    ]
  },
  "underlyingPrinciple": "<the abstract principle that transfers>",
  "deepStructure": "<structural elements that are similar>",
  "surfaceFeaturesToIgnore": ["<surface feature 1>"],
  "bridgingPrompts": [
    "<prompt to connect source and target>"
  ],
  "huggingActivities": [
    "<activity that reminds of original context>"
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<TransferActivity>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated transfer activity`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating activity:`, error);
      return this.getFallbackTransferActivity(input);
    }
  }

  /**
   * Generate an analogical transfer exercise
   */
  async generateAnalogicalExercise(input: AnalogicalInput): Promise<AnalogicalTransferExercise> {
    logger.info(`[${this.name}] Generating analogical transfer from ${input.sourceCase.domain} to ${input.targetDomain}`);

    const systemPrompt = `You are an expert in analogical reasoning and transfer. You help students see deep structural similarities between different domains.

Research basis:
- Gentner on structure mapping
- Gick & Holyoak on analogical problem solving
- Dunbar on scientific analogies

Effective analogies:
1. Map structural relations, not surface features
2. Make mapping explicit
3. Highlight corresponding elements
4. Discuss where analogy breaks down`;

    const prompt = `Create an analogical transfer exercise:

Source Case:
- Domain: ${input.sourceCase.domain}
- Situation: ${input.sourceCase.situation}
- Solution: ${input.sourceCase.solution}

Target Domain: ${input.targetDomain}

Design an exercise that helps students transfer understanding.

Return JSON:
{
  "id": "<unique-id>",
  "sourceCase": {
    "domain": "${input.sourceCase.domain}",
    "situation": "${input.sourceCase.situation}",
    "solution": "${input.sourceCase.solution}",
    "underlyingStructure": "<abstract structure>"
  },
  "targetCase": {
    "domain": "${input.targetDomain}",
    "situation": "<parallel situation in target domain>",
    "structuralMapping": [
      {
        "sourceElement": "<element in source>",
        "targetElement": "<corresponding element in target>",
        "relationship": "<how they correspond>"
      }
    ]
  },
  "hints": [
    {
      "level": 1,
      "hint": "<first hint>"
    },
    {
      "level": 2,
      "hint": "<more explicit hint>"
    },
    {
      "level": 3,
      "hint": "<most explicit hint>"
    }
  ],
  "abstractionPrompts": [
    "<prompt to extract general principle>"
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<AnalogicalTransferExercise>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated analogical exercise`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating exercise:`, error);
      return this.getFallbackAnalogicalExercise(input);
    }
  }

  /**
   * Generate an abstraction ladder
   */
  async generateAbstractionLadder(input: AbstractionInput): Promise<AbstractionLadder> {
    logger.info(`[${this.name}] Generating abstraction ladder for: ${input.concept}`);

    const systemPrompt = `You are an expert in conceptual abstraction and transfer. You help students move between concrete and abstract understanding.

Abstraction levels:
1. Concrete-specific: Individual examples
2. Concrete-general: Classes of similar examples
3. Abstract-specific: Principles in specific domains
4. Abstract-general: Universal principles

Moving up (ascending): From concrete to abstract
Moving down (descending): From abstract to concrete application`;

    const prompt = `Create an abstraction ladder:

Concept: ${input.concept}
Concrete Examples: ${JSON.stringify(input.concreteExamples)}
Target Abstraction: ${input.targetAbstraction}

Help students move between concrete and abstract understanding.

Return JSON:
{
  "id": "<unique-id>",
  "concept": "${input.concept}",
  "levels": [
    {
      "level": "concrete-specific",
      "description": "<description at this level>",
      "examples": ["<specific example>"],
      "language": ["<terms used at this level>"]
    },
    {
      "level": "concrete-general",
      "description": "<description>",
      "examples": ["<general example>"],
      "language": ["<terms>"]
    },
    {
      "level": "abstract-specific",
      "description": "<description>",
      "examples": ["<domain-specific abstraction>"],
      "language": ["<technical terms>"]
    },
    {
      "level": "abstract-general",
      "description": "<description>",
      "examples": ["<universal principle>"],
      "language": ["<abstract terms>"]
    }
  ],
  "ascendingExercises": [
    {
      "from": "<concrete level>",
      "prompt": "<prompt to move toward abstraction>",
      "targetAbstraction": "<what to abstract to>"
    }
  ],
  "descendingExercises": [
    {
      "from": "<abstract level>",
      "prompt": "<prompt to apply to concrete>",
      "targetContext": "<concrete application>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<AbstractionLadder>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated abstraction ladder with ${result.levels.length} levels`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating ladder:`, error);
      return this.getFallbackAbstractionLadder(input);
    }
  }

  /**
   * Generate novel application scenarios
   */
  async generateNovelScenarios(
    concept: string,
    familiarContexts: string[],
    count: number = 3
  ): Promise<Array<{
    scenario: string;
    relevantConcepts: string[];
    transferDistance: TransferDistance;
    adaptationRequired: string;
    solution: string;
  }>> {
    logger.info(`[${this.name}] Generating ${count} novel scenarios for: ${concept}`);

    const systemPrompt = `You are an expert in transfer and application of knowledge. You create novel scenarios that require students to apply learning in new ways.`;

    const prompt = `Generate ${count} novel application scenarios:

Concept: ${concept}
Familiar Contexts: ${JSON.stringify(familiarContexts)}

Create scenarios that are increasingly distant from familiar contexts.

Return JSON array:
[
  {
    "scenario": "<novel situation>",
    "relevantConcepts": ["<concept 1>"],
    "transferDistance": "near" | "moderate" | "far",
    "adaptationRequired": "<what needs to be adapted>",
    "solution": "<how concept applies>"
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<Array<{
        scenario: string;
        relevantConcepts: string[];
        transferDistance: TransferDistance;
        adaptationRequired: string;
        solution: string;
      }>>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating scenarios:`, error);
      return [];
    }
  }

  /**
   * Create a complete transfer-oriented design
   */
  async createDesign(courseId: string, concepts: string[]): Promise<TransferOrientedDesign> {
    logger.info(`[${this.name}] Creating transfer-oriented design for: ${courseId}`);

    const activities = await Promise.all(
      concepts.slice(0, 2).map(concept =>
        this.generateTransferActivity({
          sourceConcept: concept,
          sourceContext: 'classroom',
          targetContext: 'real-world application',
          transferDistance: 'moderate',
          scaffoldingLevel: 'moderate'
        })
      )
    );

    const abstractionLadder = await this.generateAbstractionLadder({
      concept: concepts[0],
      concreteExamples: ['Example 1', 'Example 2'],
      targetAbstraction: 'General principle'
    });

    return {
      courseId,
      transferActivities: activities,
      analogicalExercises: [],
      abstractionLadders: [abstractionLadder],
      novelApplicationScenarios: [],
      crossDisciplinaryLinks: []
    };
  }

  private getFallbackTransferActivity(input: TransferActivityInput): TransferActivity {
    return {
      id: `transfer-${Date.now()}`,
      sourceConcept: input.sourceConcept,
      sourceContext: input.sourceContext,
      targetContext: input.targetContext,
      transferDistance: input.transferDistance,
      activity: {
        setup: `You have learned about ${input.sourceConcept} in ${input.sourceContext}. Now consider how this applies to ${input.targetContext}.`,
        task: `Identify how the principles of ${input.sourceConcept} can be applied in ${input.targetContext}`,
        scaffolding: [
          { level: 'heavy', support: 'Here are the key elements that transfer: [elements]' },
          { level: 'moderate', support: 'Consider what aspects are similar between contexts' },
          { level: 'light', support: 'Apply the underlying principle' },
          { level: 'none', support: 'Solve the problem independently' }
        ]
      },
      underlyingPrinciple: `The core principle of ${input.sourceConcept}`,
      deepStructure: 'The structural relationships that remain constant across contexts',
      surfaceFeaturesToIgnore: ['Context-specific terminology', 'Domain-specific examples'],
      bridgingPrompts: [
        `What is the same about ${input.sourceContext} and ${input.targetContext}?`,
        `What underlying principle applies in both cases?`
      ],
      huggingActivities: [
        `Practice with a context very similar to ${input.sourceContext}`
      ]
    };
  }

  private getFallbackAnalogicalExercise(input: AnalogicalInput): AnalogicalTransferExercise {
    return {
      id: `analogy-${Date.now()}`,
      sourceCase: {
        domain: input.sourceCase.domain,
        situation: input.sourceCase.situation,
        solution: input.sourceCase.solution,
        underlyingStructure: 'The abstract pattern in the source case'
      },
      targetCase: {
        domain: input.targetDomain,
        situation: `A parallel situation in ${input.targetDomain}`,
        structuralMapping: [
          {
            sourceElement: 'Key element from source',
            targetElement: 'Corresponding element in target',
            relationship: 'Both serve the same functional role'
          }
        ]
      },
      hints: [
        { level: 1, hint: 'Think about the structure, not the surface features' },
        { level: 2, hint: 'What corresponds to [key element] in the new domain?' },
        { level: 3, hint: 'The mapping is: source element → target element' }
      ],
      abstractionPrompts: [
        'What general principle is illustrated in both cases?',
        'How would you describe this principle without reference to either domain?'
      ]
    };
  }

  private getFallbackAbstractionLadder(input: AbstractionInput): AbstractionLadder {
    return {
      id: `ladder-${Date.now()}`,
      concept: input.concept,
      levels: [
        {
          level: 'concrete-specific',
          description: `Specific instance of ${input.concept}`,
          examples: input.concreteExamples.slice(0, 1),
          language: ['specific terms']
        },
        {
          level: 'concrete-general',
          description: `General examples of ${input.concept}`,
          examples: input.concreteExamples,
          language: ['category terms']
        },
        {
          level: 'abstract-specific',
          description: `${input.concept} as a domain principle`,
          examples: [`The principle of ${input.concept} in this field`],
          language: ['technical terminology']
        },
        {
          level: 'abstract-general',
          description: input.targetAbstraction,
          examples: ['Universal principle across domains'],
          language: ['abstract terminology']
        }
      ],
      ascendingExercises: [
        {
          from: 'concrete example',
          prompt: 'What do all these examples have in common?',
          targetAbstraction: input.targetAbstraction
        }
      ],
      descendingExercises: [
        {
          from: input.targetAbstraction,
          prompt: 'Give a new example that demonstrates this principle',
          targetContext: 'A novel situation'
        }
      ]
    };
  }
}
