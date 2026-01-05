import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  AdaptiveDifficultySystem,
  DiagnosticAssessment,
  LearningPathway
} from '../types/pedagogical-features';
import { BloomLevel } from '../types/extended-types';

export interface DiagnosticInput {
  topic: string;
  concepts: string[];
  targetSkills: string[];
  studentLevel: 'introductory' | 'intermediate' | 'advanced';
}

export interface PathwayInput {
  topic: string;
  track: 'remedial' | 'standard' | 'challenge' | 'accelerated';
  prerequisites: string[];
  targetOutcomes: string[];
  estimatedDuration: number; // minutes
}

export interface ChallengeInput {
  topic: string;
  baseConceptsMastered: string[];
  bloomLevel: BloomLevel;
  count: number;
}

/**
 * AdaptiveDifficultyAgent
 *
 * Implements adaptive learning pathways based on Vygotsky's Zone of
 * Proximal Development and Csikszentmihalyi's Flow Theory.
 *
 * Key features:
 * - Diagnostic pre-assessments to identify starting points
 * - Branching content paths (remedial, standard, challenge)
 * - Just-in-time prerequisite insertion
 * - Mastery-based progression
 */
export class AdaptiveDifficultyAgent {
  name = 'AdaptiveDifficultyAgent';
  description = 'Create adaptive learning pathways matched to student readiness';

  /**
   * Generate a diagnostic assessment for placement
   */
  async generateDiagnostic(input: DiagnosticInput): Promise<DiagnosticAssessment> {
    logger.info(`[${this.name}] Generating diagnostic for: ${input.topic}`);

    const systemPrompt = `You are an expert in diagnostic assessment and learning progressions. You create assessments that efficiently identify student readiness and gaps.

Research basis:
- Vygotsky's Zone of Proximal Development
- Diagnostic Classification Models
- Learning progressions research

Effective diagnostic assessments:
1. Start with prerequisite knowledge
2. Progress to target concepts
3. Include items at multiple difficulty levels
4. Provide clear placement guidance
5. Identify specific gaps, not just overall level`;

    const prompt = `Create a diagnostic assessment for:

Topic: ${input.topic}
Key Concepts: ${JSON.stringify(input.concepts)}
Target Skills: ${JSON.stringify(input.targetSkills)}
Expected Student Level: ${input.studentLevel}

Generate 8-12 questions that:
1. Assess prerequisite knowledge first
2. Probe understanding at increasing levels
3. Identify specific gaps for remediation
4. Determine readiness for advanced content

Return JSON:
{
  "id": "<unique-id>",
  "topic": "${input.topic}",
  "questions": [
    {
      "id": "<q-id>",
      "question": "<the question>",
      "type": "multiple-choice" | "short-answer" | "demonstration",
      "options": ["<opt A>", "<opt B>", "<opt C>", "<opt D>"] or null,
      "correctAnswer": "<correct answer>",
      "diagnosticValue": {
        "ifCorrect": {
          "mastery": ["<concept mastered>"],
          "readyFor": ["<next concept>"]
        },
        "ifIncorrect": {
          "gaps": ["<specific gap>"],
          "needsReview": ["<prerequisite to review>"]
        }
      }
    }
  ],
  "scoringRubric": {
    "remedialThreshold": <0-100 score for remedial track>,
    "standardThreshold": <0-100 score for standard track>,
    "advancedThreshold": <0-100 score for advanced track>
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<DiagnosticAssessment>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Generated diagnostic with ${result.questions.length} questions`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating diagnostic:`, error);
      return this.getFallbackDiagnostic(input);
    }
  }

  /**
   * Generate a learning pathway for a specific track
   */
  async generatePathway(input: PathwayInput): Promise<LearningPathway> {
    logger.info(`[${this.name}] Generating ${input.track} pathway for: ${input.topic}`);

    const systemPrompt = `You are an expert in adaptive learning design. You create learning pathways that maintain optimal challenge - not too easy (boredom) or too hard (anxiety).

Key principles:
- Scaffolding: Support that fades as competence grows
- Mastery learning: Don't advance until ready
- Just-in-time support: Insert prerequisites when needed
- Multiple representations: Different approaches for different learners
- Formative feedback: Continuous progress monitoring`;

    const trackDescriptions = {
      remedial: 'Additional support and prerequisite review for students with gaps',
      standard: 'Core content path for students meeting prerequisites',
      challenge: 'Extended depth and complexity for advanced students',
      accelerated: 'Compressed path for students demonstrating quick mastery'
    };

    const prompt = `Create a ${input.track} learning pathway:

Topic: ${input.topic}
Track Description: ${trackDescriptions[input.track]}
Prerequisites: ${JSON.stringify(input.prerequisites)}
Target Outcomes: ${JSON.stringify(input.targetOutcomes)}
Estimated Duration: ${input.estimatedDuration} minutes

Design a pathway with:
1. Appropriate scaffolding level for this track
2. Branching logic for struggles/successes
3. Just-in-time prerequisite modules
4. Completion criteria for each module

Return JSON:
{
  "id": "<unique-id>",
  "name": "${input.track} pathway for ${input.topic}",
  "track": "${input.track}",
  "entryRequirements": ["<requirement 1>"],
  "diagnosticCriteria": "<how to place students here>",
  "modules": [
    {
      "id": "<module-id>",
      "title": "<module title>",
      "type": "prerequisite-review" | "core-content" | "practice" | "extension" | "application",
      "content": "<what this module covers>",
      "estimatedTime": <minutes>,
      "completionCriteria": "<how to know it's mastered>",
      "onSuccess": "<next module id>",
      "onStruggle": "<support module id>"
    }
  ],
  "scaffoldingLevel": "${input.track === 'remedial' ? 'heavy' : input.track === 'standard' ? 'moderate' : 'light'}",
  "justInTimePrerequisites": [
    {
      "triggerCondition": "<when to insert>",
      "prerequisiteModule": "<module to insert>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<LearningPathway>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Generated pathway with ${result.modules.length} modules`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating pathway:`, error);
      return this.getFallbackPathway(input);
    }
  }

  /**
   * Generate challenge problems for advanced students
   */
  async generateChallengeProblems(input: ChallengeInput): Promise<Array<{
    id: string;
    title: string;
    description: string;
    difficulty: number;
    bloomLevel: BloomLevel;
    estimatedTime: number;
    solution: string;
    hints: string[];
  }>> {
    logger.info(`[${this.name}] Generating ${input.count} challenge problems for: ${input.topic}`);

    const systemPrompt = `You are an expert in creating challenge problems that extend learning for advanced students. Your problems:
1. Go beyond standard curriculum
2. Require synthesis and transfer
3. Have multiple valid approaches
4. Connect to real-world applications
5. Challenge assumptions and promote critical thinking`;

    const prompt = `Create ${input.count} challenge problems for advanced students:

Topic: ${input.topic}
Concepts Already Mastered: ${JSON.stringify(input.baseConceptsMastered)}
Target Bloom's Level: ${input.bloomLevel}

Generate problems that:
1. Extend beyond standard content
2. Require creative application
3. Have multiple solution paths
4. Connect to authentic contexts

Return JSON array:
[
  {
    "id": "<unique-id>",
    "title": "<problem title>",
    "description": "<the challenge problem>",
    "difficulty": <6-10 scale, above standard 1-5>,
    "bloomLevel": "${input.bloomLevel}",
    "estimatedTime": <minutes>,
    "solution": "<complete solution>",
    "hints": ["<hint 1>", "<hint 2>", "<hint 3>"]
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<Array<{
        id: string;
        title: string;
        description: string;
        difficulty: number;
        bloomLevel: BloomLevel;
        estimatedTime: number;
        solution: string;
        hints: string[];
      }>>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Generated ${result.length} challenge problems`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating challenges:`, error);
      return this.getFallbackChallenges(input);
    }
  }

  /**
   * Determine appropriate track based on diagnostic results
   */
  determineTrack(score: number, rubric: DiagnosticAssessment['scoringRubric']): {
    track: 'remedial' | 'standard' | 'challenge';
    rationale: string;
    recommendations: string[];
  } {
    if (score >= rubric.advancedThreshold) {
      return {
        track: 'challenge',
        rationale: `Score of ${score}% indicates strong foundation and readiness for advanced content`,
        recommendations: [
          'Skip prerequisite review modules',
          'Begin with application-level content',
          'Consider acceleration options'
        ]
      };
    } else if (score >= rubric.standardThreshold) {
      return {
        track: 'standard',
        rationale: `Score of ${score}% indicates adequate preparation for core content`,
        recommendations: [
          'Brief prerequisite review as needed',
          'Standard pacing through content',
          'Regular formative checks'
        ]
      };
    } else {
      return {
        track: 'remedial',
        rationale: `Score of ${score}% indicates gaps requiring additional support`,
        recommendations: [
          'Complete prerequisite modules first',
          'Additional practice opportunities',
          'More scaffolded instruction'
        ]
      };
    }
  }

  /**
   * Create a complete adaptive system for a topic
   */
  async createAdaptiveSystem(
    topic: string,
    concepts: string[],
    targetOutcomes: string[]
  ): Promise<AdaptiveDifficultySystem> {
    logger.info(`[${this.name}] Creating complete adaptive system for: ${topic}`);

    const diagnostic = await this.generateDiagnostic({
      topic,
      concepts,
      targetSkills: targetOutcomes,
      studentLevel: 'intermediate'
    });

    const pathways = await Promise.all([
      this.generatePathway({ topic, track: 'remedial', prerequisites: concepts, targetOutcomes, estimatedDuration: 90 }),
      this.generatePathway({ topic, track: 'standard', prerequisites: concepts, targetOutcomes, estimatedDuration: 60 }),
      this.generatePathway({ topic, track: 'challenge', prerequisites: concepts, targetOutcomes, estimatedDuration: 45 })
    ]);

    const challenges = await this.generateChallengeProblems({
      topic,
      baseConceptsMastered: concepts,
      bloomLevel: 'analyze',
      count: 3
    });

    return {
      courseId: `course-${Date.now()}`,
      topic,
      diagnosticAssessment: diagnostic,
      pathways,
      challengeBank: challenges,
      masteryBasedProgression: {
        enabled: true,
        masteryThreshold: 85,
        assessmentAttempts: 3,
        remediation: 'Return to previous module with additional practice'
      }
    };
  }

  private getFallbackDiagnostic(input: DiagnosticInput): DiagnosticAssessment {
    return {
      id: `diagnostic-${Date.now()}`,
      topic: input.topic,
      questions: input.concepts.map((concept, idx) => ({
        id: `q-${idx + 1}`,
        question: `Explain your understanding of ${concept}.`,
        type: 'short-answer' as const,
        options: undefined,
        correctAnswer: `A complete answer addresses key aspects of ${concept}`,
        diagnosticValue: {
          ifCorrect: {
            mastery: [concept],
            readyFor: input.concepts[idx + 1] ? [input.concepts[idx + 1]] : []
          },
          ifIncorrect: {
            gaps: [`Understanding of ${concept}`],
            needsReview: [`Foundational concepts for ${concept}`]
          }
        }
      })),
      scoringRubric: {
        remedialThreshold: 50,
        standardThreshold: 70,
        advancedThreshold: 85
      }
    };
  }

  private getFallbackPathway(input: PathwayInput): LearningPathway {
    const scaffolding = input.track === 'remedial' ? 'heavy' : input.track === 'standard' ? 'moderate' : 'light';

    return {
      id: `pathway-${input.track}-${Date.now()}`,
      name: `${input.track} pathway for ${input.topic}`,
      track: input.track,
      entryRequirements: input.prerequisites,
      diagnosticCriteria: `Based on diagnostic assessment score`,
      modules: [
        {
          id: 'mod-1',
          title: 'Introduction',
          type: input.track === 'remedial' ? 'prerequisite-review' : 'core-content',
          content: `Introduction to ${input.topic}`,
          estimatedTime: Math.round(input.estimatedDuration * 0.3),
          completionCriteria: 'Complete introduction activities',
          onSuccess: 'mod-2',
          onStruggle: 'mod-support-1'
        },
        {
          id: 'mod-2',
          title: 'Core Concepts',
          type: 'core-content',
          content: `Main concepts of ${input.topic}`,
          estimatedTime: Math.round(input.estimatedDuration * 0.4),
          completionCriteria: 'Pass formative check with 80%+',
          onSuccess: 'mod-3',
          onStruggle: 'mod-1'
        },
        {
          id: 'mod-3',
          title: input.track === 'challenge' ? 'Extension' : 'Practice',
          type: input.track === 'challenge' ? 'extension' : 'practice',
          content: `Application of ${input.topic}`,
          estimatedTime: Math.round(input.estimatedDuration * 0.3),
          completionCriteria: 'Complete practice activities',
          onSuccess: 'complete',
          onStruggle: 'mod-2'
        }
      ],
      scaffoldingLevel: scaffolding,
      justInTimePrerequisites: input.prerequisites.map((prereq, idx) => ({
        triggerCondition: `Struggle with content requiring ${prereq}`,
        prerequisiteModule: `prereq-${idx + 1}`
      }))
    };
  }

  private getFallbackChallenges(input: ChallengeInput): Array<{
    id: string;
    title: string;
    description: string;
    difficulty: number;
    bloomLevel: BloomLevel;
    estimatedTime: number;
    solution: string;
    hints: string[];
  }> {
    return Array.from({ length: input.count }, (_, idx) => ({
      id: `challenge-${idx + 1}`,
      title: `Advanced Challenge ${idx + 1}: ${input.topic}`,
      description: `Apply your knowledge of ${input.topic} to solve this complex problem.`,
      difficulty: 7 + idx,
      bloomLevel: input.bloomLevel,
      estimatedTime: 20 + (idx * 5),
      solution: `This challenge requires synthesis of ${input.baseConceptsMastered.join(', ')}`,
      hints: [
        'Consider how the concepts connect',
        'Think about edge cases',
        'Try a different approach'
      ]
    }));
  }
}
