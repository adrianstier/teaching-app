import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  CaseStudy,
  CaseBasedLearningStudio
} from '../types/pedagogical-features';

export interface CaseStudyInput {
  topic: string;
  domain: string;
  complexity: 'simplified' | 'moderate' | 'realistic' | 'messy';
  learningObjectives: string[];
  studentLevel: 'introductory' | 'intermediate' | 'advanced';
  includeEthicalDimensions?: boolean;
  interdisciplinaryConnections?: string[];
}

export interface AnalysisFrameworkInput {
  caseId: string;
  scaffoldingLevel: 'high' | 'medium' | 'low';
  focusAreas: string[];
}

/**
 * CaseBasedLearningAgent
 *
 * Implements case-based learning pedagogy based on research by
 * Bransford et al. (2000) and Kolodner (1992).
 *
 * Key features:
 * - Real-world scenario generation
 * - Scaffolded analysis frameworks
 * - Multiple stakeholder perspectives
 * - Ethical dimension integration
 * - Decision-making frameworks
 */
export class CaseBasedLearningAgent {
  name = 'CaseBasedLearningAgent';
  description = 'Generate authentic case studies for deep learning through real-world scenarios';

  /**
   * Generate a complete case study
   */
  async generateCaseStudy(input: CaseStudyInput): Promise<CaseStudy> {
    logger.info(`[${this.name}] Generating ${input.complexity} case study for: ${input.topic}`);

    const systemPrompt = `You are an expert in case-based learning and instructional design. You create authentic, engaging case studies that:
1. Present realistic, complex situations
2. Require application of course concepts
3. Have multiple valid perspectives
4. Promote critical thinking and decision-making
5. Connect theory to practice

Research basis:
- Bransford et al. on anchored instruction
- Kolodner on case-based reasoning
- Problem-based learning literature

Complexity levels:
- Simplified: Clear problem, limited variables, obvious solution path
- Moderate: Some ambiguity, multiple factors, several valid approaches
- Realistic: Real-world messiness, incomplete information, trade-offs
- Messy: High ambiguity, conflicting stakeholders, no clear "right" answer`;

    const prompt = `Create a ${input.complexity} case study:

Topic: ${input.topic}
Domain: ${input.domain}
Learning Objectives: ${JSON.stringify(input.learningObjectives)}
Student Level: ${input.studentLevel}
${input.includeEthicalDimensions ? 'Include ethical dimensions: Yes' : ''}
${input.interdisciplinaryConnections ? `Interdisciplinary connections: ${JSON.stringify(input.interdisciplinaryConnections)}` : ''}

Generate a complete case with:
1. Rich background and context
2. Multiple stakeholders with different perspectives
3. Relevant data and information
4. A decision point or problem to solve
5. Analysis scaffolding appropriate to complexity
6. Expert insights for instructor reference

Return JSON:
{
  "id": "<unique-id>",
  "title": "<compelling case title>",
  "domain": "${input.domain}",
  "realWorldContext": "<why this matters in the real world>",
  "relevanceToStudents": ["<relevance 1>", "<relevance 2>"],
  "disciplinaryConnections": ["<connection 1>"],
  "scenario": {
    "background": "<detailed background context>",
    "situation": "<the current situation/problem>",
    "stakeholders": [
      {
        "name": "<stakeholder name>",
        "role": "<their role>",
        "perspective": "<their viewpoint>",
        "interests": ["<interest 1>", "<interest 2>"]
      }
    ],
    "dataProvided": [
      {
        "type": "quantitative" | "qualitative" | "visual" | "document",
        "description": "<what this data is>",
        "content": "<the actual data or description>"
      }
    ],
    "constraints": ["<constraint 1>", "<constraint 2>"],
    "decision": "<what decision needs to be made>"
  },
  "complexity": "${input.complexity}",
  "scaffoldingLevel": {
    "structureProvided": "${input.complexity === 'simplified' ? 'high' : input.complexity === 'moderate' ? 'medium' : 'low'}",
    "hintAvailability": "${input.studentLevel === 'introductory' ? 'always' : 'on-request'}",
    "expertModelAvailable": ${input.studentLevel !== 'advanced'}
  },
  "analysisPrompts": [
    {
      "phase": "understand" | "analyze" | "evaluate" | "decide" | "reflect",
      "prompt": "<analysis prompt>",
      "scaffoldedVersion": "<simpler version if needed>"
    }
  ],
  ${input.includeEthicalDimensions ? `"ethicalConsiderations": ["<ethical issue 1>", "<ethical issue 2>"],` : ''}
  ${input.interdisciplinaryConnections ? `"interdisciplinaryAngles": [
    {
      "discipline": "<discipline>",
      "perspective": "<how this discipline views the case>"
    }
  ],` : ''}
  "expertAnalysis": {
    "keyInsights": ["<insight 1>", "<insight 2>"],
    "commonMistakes": ["<mistake students often make>"],
    "bestPractices": ["<best practice 1>"]
  },
  "decisionCriteria": [
    {
      "criterion": "<evaluation criterion>",
      "weight": <0.0-1.0>,
      "howToEvaluate": "<how to assess this>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<CaseStudy>(prompt, systemPrompt, 8192);
      logger.info(`[${this.name}] Generated case study: ${result.title}`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating case study:`, error);
      return this.getFallbackCaseStudy(input);
    }
  }

  /**
   * Generate analysis framework for a case
   */
  async generateAnalysisFramework(input: AnalysisFrameworkInput): Promise<{
    phases: Array<{
      name: string;
      duration: number;
      prompts: string[];
      deliverable: string;
    }>;
    worksheetTemplate: string;
    discussionQuestions: string[];
  }> {
    logger.info(`[${this.name}] Generating analysis framework for case: ${input.caseId}`);

    const systemPrompt = `You are an expert in case method teaching. You design analysis frameworks that guide students through systematic case analysis while developing critical thinking skills.`;

    const prompt = `Create an analysis framework:

Case ID: ${input.caseId}
Scaffolding Level: ${input.scaffoldingLevel}
Focus Areas: ${JSON.stringify(input.focusAreas)}

Generate:
1. Phased analysis process with timing
2. A worksheet template students can use
3. Discussion questions for class debrief

Return JSON:
{
  "phases": [
    {
      "name": "<phase name>",
      "duration": <minutes>,
      "prompts": ["<guiding prompt 1>", "<guiding prompt 2>"],
      "deliverable": "<what students produce>"
    }
  ],
  "worksheetTemplate": "<markdown formatted worksheet>",
  "discussionQuestions": ["<question 1>", "<question 2>"]
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        phases: Array<{
          name: string;
          duration: number;
          prompts: string[];
          deliverable: string;
        }>;
        worksheetTemplate: string;
        discussionQuestions: string[];
      }>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated framework with ${result.phases.length} phases`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating framework:`, error);
      return {
        phases: [
          {
            name: 'Understanding',
            duration: 10,
            prompts: ['What is the main issue?', 'Who are the stakeholders?'],
            deliverable: 'Problem statement'
          },
          {
            name: 'Analysis',
            duration: 15,
            prompts: ['What factors are relevant?', 'What are the constraints?'],
            deliverable: 'Analysis summary'
          },
          {
            name: 'Evaluation',
            duration: 10,
            prompts: ['What are the options?', 'What are the trade-offs?'],
            deliverable: 'Options assessment'
          },
          {
            name: 'Decision',
            duration: 10,
            prompts: ['What do you recommend?', 'How would you implement it?'],
            deliverable: 'Recommendation with justification'
          }
        ],
        worksheetTemplate: '# Case Analysis Worksheet\n\n## Problem Statement\n\n## Key Stakeholders\n\n## Analysis\n\n## Options\n\n## Recommendation',
        discussionQuestions: input.focusAreas.map(area => `How did ${area} influence your analysis?`)
      };
    }
  }

  /**
   * Generate comparative analysis prompts for multiple cases
   */
  async generateComparativeAnalysis(cases: CaseStudy[]): Promise<{
    comparisonPrompts: string[];
    synthesisActivity: string;
    transferQuestions: string[];
  }> {
    logger.info(`[${this.name}] Generating comparative analysis for ${cases.length} cases`);

    const systemPrompt = `You are an expert in case-based reasoning and transfer of learning. You help students see patterns across cases and apply insights to new situations.`;

    const prompt = `Create a comparative analysis activity for these cases:

${cases.map((c, i) => `Case ${i + 1}: ${c.title} - ${c.scenario.decision}`).join('\n')}

Generate:
1. Prompts for comparing across cases
2. A synthesis activity
3. Transfer questions for new situations

Return JSON:
{
  "comparisonPrompts": ["<comparison prompt 1>"],
  "synthesisActivity": "<activity description>",
  "transferQuestions": ["<transfer question 1>"]
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        comparisonPrompts: string[];
        synthesisActivity: string;
        transferQuestions: string[];
      }>(prompt, systemPrompt, 2048);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating comparative analysis:`, error);
      return {
        comparisonPrompts: [
          'What patterns do you see across these cases?',
          'How did context affect the outcomes in each case?',
          'What principles apply across all cases?'
        ],
        synthesisActivity: 'Create a decision framework that could apply to all cases',
        transferQuestions: [
          'How would you apply these insights to a new situation?',
          'What would you do differently knowing what you know now?'
        ]
      };
    }
  }

  /**
   * Create a complete case-based learning studio for a topic
   */
  async createCaseBasedStudio(
    topic: string,
    domain: string,
    learningObjectives: string[],
    caseCount: number = 2
  ): Promise<CaseBasedLearningStudio> {
    logger.info(`[${this.name}] Creating case-based learning studio for: ${topic}`);

    const complexityLevels: Array<'simplified' | 'moderate' | 'realistic'> = ['simplified', 'moderate', 'realistic'];

    const cases = await Promise.all(
      Array.from({ length: caseCount }, (_, i) =>
        this.generateCaseStudy({
          topic,
          domain,
          complexity: complexityLevels[i % complexityLevels.length],
          learningObjectives,
          studentLevel: 'intermediate',
          includeEthicalDimensions: true
        })
      )
    );

    const comparative = cases.length > 1
      ? await this.generateComparativeAnalysis(cases)
      : undefined;

    return {
      courseId: `studio-${Date.now()}`,
      topic,
      cases,
      comparativeAnalysis: comparative ? {
        enabled: true,
        comparisonPrompts: comparative.comparisonPrompts,
        synthesisActivity: comparative.synthesisActivity
      } : undefined
    };
  }

  private getFallbackCaseStudy(input: CaseStudyInput): CaseStudy {
    return {
      id: `case-${Date.now()}`,
      title: `Case Study: ${input.topic}`,
      domain: input.domain,
      realWorldContext: `This case explores real-world applications of ${input.topic}`,
      relevanceToStudents: [
        `Develops practical understanding of ${input.topic}`,
        'Builds decision-making skills'
      ],
      disciplinaryConnections: input.interdisciplinaryConnections || [input.domain],
      scenario: {
        background: `Background context for a case about ${input.topic} in ${input.domain}`,
        situation: `A challenging situation has arisen requiring application of ${input.topic}`,
        stakeholders: [
          {
            name: 'Primary Stakeholder',
            role: 'Decision Maker',
            perspective: 'Focused on achieving the best outcome',
            interests: ['Success', 'Efficiency', 'Quality']
          },
          {
            name: 'Secondary Stakeholder',
            role: 'Affected Party',
            perspective: 'Concerned about impacts',
            interests: ['Fairness', 'Transparency']
          }
        ],
        dataProvided: [
          {
            type: 'qualitative',
            description: 'Background information',
            content: `Relevant context about ${input.topic}`
          }
        ],
        constraints: [
          'Limited resources',
          'Time pressure',
          'Competing priorities'
        ],
        decision: `What approach should be taken to address this ${input.topic} challenge?`
      },
      complexity: input.complexity,
      scaffoldingLevel: {
        structureProvided: input.complexity === 'simplified' ? 'high' : 'medium',
        hintAvailability: input.studentLevel === 'introductory' ? 'always' : 'on-request',
        expertModelAvailable: input.studentLevel !== 'advanced'
      },
      analysisPrompts: [
        {
          phase: 'understand',
          prompt: 'What is the core problem or decision in this case?',
          scaffoldedVersion: 'List the main issue in one sentence.'
        },
        {
          phase: 'analyze',
          prompt: 'What factors influence this situation?',
          scaffoldedVersion: 'Identify 3 key factors.'
        },
        {
          phase: 'evaluate',
          prompt: 'What options are available and what are their trade-offs?',
          scaffoldedVersion: 'List 2 options with pros and cons.'
        },
        {
          phase: 'decide',
          prompt: 'What do you recommend and why?',
          scaffoldedVersion: 'State your recommendation with one main reason.'
        },
        {
          phase: 'reflect',
          prompt: 'What did you learn from analyzing this case?',
          scaffoldedVersion: 'What was the most important lesson?'
        }
      ],
      ethicalConsiderations: input.includeEthicalDimensions
        ? ['Consider fairness implications', 'Evaluate potential harms']
        : undefined,
      interdisciplinaryAngles: input.interdisciplinaryConnections?.map(d => ({
        discipline: d,
        perspective: `How ${d} views this issue`
      })),
      expertAnalysis: {
        keyInsights: [
          `Key concepts from ${input.topic} apply directly`,
          'Multiple valid approaches exist'
        ],
        commonMistakes: [
          'Overlooking stakeholder perspectives',
          'Jumping to conclusions without analysis'
        ],
        bestPractices: [
          'Systematic analysis before decision',
          'Consider multiple perspectives'
        ]
      },
      decisionCriteria: input.learningObjectives.map((obj, i) => ({
        criterion: obj,
        weight: 1 / input.learningObjectives.length,
        howToEvaluate: `Assess how well the solution addresses ${obj}`
      }))
    };
  }
}
