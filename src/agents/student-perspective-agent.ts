import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  StudentPerspectiveSimulator,
  NoviceMentalModel,
  PrerequisiteGapDetector,
  ConfusionPointPredictor,
  ReadabilityAnalysis,
  TimeOnTaskEstimator
} from '../types/pedagogical-features';

export interface NoviceModelInput {
  concept: string;
  domain: string;
  priorKnowledge: string[];
  commonBackgrounds: string[];
}

export interface PrerequisiteInput {
  targetConcept: string;
  intendedPrerequisites: string[];
  studentPopulation: string;
}

export interface ConfusionInput {
  content: string;
  topic: string;
  studentLevel: 'introductory' | 'intermediate' | 'advanced';
}

export interface TimeEstimationInput {
  tasks: Array<{
    task: string;
    type: 'reading' | 'watching' | 'practice' | 'problem-solving' | 'writing' | 'research' | 'collaboration' | 'reflection';
    instructorEstimate: number; // minutes
  }>;
  studentLevel: 'introductory' | 'intermediate' | 'advanced';
}

/**
 * StudentPerspectiveAgent
 *
 * Helps instructors anticipate student experiences and struggles
 * by simulating how novice learners might perceive content.
 *
 * Key features:
 * - Novice mental model simulation
 * - Prerequisite gap detection
 * - Confusion point prediction
 * - Readability analysis
 * - Realistic time-on-task estimation
 */
export class StudentPerspectiveAgent {
  name = 'StudentPerspectiveAgent';
  description = 'Anticipate student struggles and experiences from the learner perspective';

  /**
   * Generate a novice mental model for a concept
   */
  async generateNoviceMentalModel(input: NoviceModelInput): Promise<NoviceMentalModel> {
    logger.info(`[${this.name}] Generating novice mental model for: ${input.concept}`);

    const systemPrompt = `You are an expert in expert-novice differences and learning progressions. You understand how beginners think differently from experts.

Key expert-novice differences:
1. Knowledge organization (experts: schema-based; novices: surface features)
2. Pattern recognition (experts: see deep structure; novices: surface similarities)
3. Problem solving (experts: forward reasoning; novices: means-ends analysis)
4. Self-monitoring (experts: know what they don't know; novices: overconfident)
5. Chunking (experts: large meaningful chunks; novices: individual pieces)

You simulate novice thinking to help instructors anticipate student difficulties.`;

    const prompt = `Generate a novice mental model:

Concept: ${input.concept}
Domain: ${input.domain}
Assumed Prior Knowledge: ${JSON.stringify(input.priorKnowledge)}
Common Student Backgrounds: ${JSON.stringify(input.commonBackgrounds)}

Describe how a novice typically thinks about this concept.

Return JSON:
{
  "concept": "${input.concept}",
  "typicalNoviceModel": {
    "beliefs": ["<what novices typically believe>"],
    "assumptions": ["<hidden assumptions novices make>"],
    "missingConnections": ["<connections they don't see>"],
    "overSimplifications": ["<ways they oversimplify>"]
  },
  "expertNoviceContrast": [
    {
      "aspect": "<aspect of understanding>",
      "novicePerspective": "<how novices see it>",
      "expertPerspective": "<how experts see it>",
      "bridgingPath": "<how to move from novice to expert>"
    }
  ],
  "confusionSources": [
    {
      "source": "<what causes confusion>",
      "whyConfusing": "<why it's confusing for novices>",
      "howToAddress": "<instructional approach>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<NoviceMentalModel>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated novice model with ${result.confusionSources.length} confusion sources`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating model:`, error);
      return this.getFallbackNoviceModel(input);
    }
  }

  /**
   * Detect prerequisite gaps
   */
  async detectPrerequisiteGaps(input: PrerequisiteInput): Promise<PrerequisiteGapDetector> {
    logger.info(`[${this.name}] Detecting prerequisite gaps for: ${input.targetConcept}`);

    const systemPrompt = `You are an expert in learning progressions and prerequisite analysis. You identify what prior knowledge students need and common gaps.`;

    const prompt = `Analyze prerequisites:

Target Concept: ${input.targetConcept}
Intended Prerequisites: ${JSON.stringify(input.intendedPrerequisites)}
Student Population: ${input.studentPopulation}

Identify:
1. Required prior knowledge
2. How often students have each prerequisite
3. Signs of gaps
4. Just-in-time support options

Return JSON:
{
  "targetConcept": "${input.targetConcept}",
  "prerequisites": [
    {
      "concept": "<prerequisite concept>",
      "importance": "essential" | "helpful" | "nice-to-have",
      "typicallyMastered": <0-100 percent>,
      "gapIndicators": ["<sign that student lacks this>"],
      "justInTimeSupport": "<quick support/review option>"
    }
  ],
  "commonGapPatterns": [
    {
      "pattern": "<pattern name>",
      "affectedPrerequisites": ["<prereq 1>"],
      "typicalBackground": "<who has this pattern>",
      "interventionSuggestion": "<how to help>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<PrerequisiteGapDetector>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Detected ${result.prerequisites.length} prerequisites`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error detecting gaps:`, error);
      return this.getFallbackPrerequisites(input);
    }
  }

  /**
   * Predict confusion points in content
   */
  async predictConfusionPoints(input: ConfusionInput): Promise<ConfusionPointPredictor> {
    logger.info(`[${this.name}] Predicting confusion points for: ${input.topic}`);

    const systemPrompt = `You are an expert in anticipating student confusion. You identify points in content where students typically struggle.

Common confusion causes:
- Terminology: New or ambiguous terms
- Abstraction: Too abstract without concrete grounding
- Prerequisites: Missing foundational knowledge
- Counterintuitive: Conflicts with everyday intuition
- Information density: Too much at once
- Ambiguity: Multiple valid interpretations
- Notation: Unfamiliar symbols or conventions
- Hidden assumptions: Unstated premises`;

    const prompt = `Predict confusion points:

Content: ${input.content.substring(0, 3000)}
Topic: ${input.topic}
Student Level: ${input.studentLevel}

Identify where students are likely to get confused.

Return JSON:
{
  "contentId": "<content-id>",
  "topic": "${input.topic}",
  "predictedConfusionPoints": [
    {
      "location": "<where in the content>",
      "description": "<what's confusing>",
      "likelihood": "low" | "medium" | "high" | "very-high",
      "causes": ["terminology" | "abstraction-level" | "prerequisite-gap" | "counterintuitive" | "information-density" | "ambiguity" | "notation" | "hidden-assumptions"],
      "preventionStrategies": ["<how to prevent confusion>"],
      "recoveryStrategies": ["<how to address if confused>"]
    }
  ],
  "thresholdConcepts": [
    {
      "concept": "<threshold concept>",
      "whyThreshold": "<why it's transformative and troublesome>",
      "typicalStruggleDuration": "<how long students typically struggle>",
      "breakthroughIndicators": ["<signs of understanding>"],
      "supportStrategies": ["<how to support breakthrough>"]
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<ConfusionPointPredictor>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Predicted ${result.predictedConfusionPoints.length} confusion points`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error predicting confusion:`, error);
      return this.getFallbackConfusion(input);
    }
  }

  /**
   * Analyze content readability
   */
  async analyzeReadability(content: string, targetAudience: string): Promise<ReadabilityAnalysis> {
    logger.info(`[${this.name}] Analyzing readability for: ${targetAudience}`);

    const systemPrompt = `You are an expert in readability and clear communication. You analyze text for accessibility to different audiences.`;

    const prompt = `Analyze readability:

Content: ${content.substring(0, 3000)}
Target Audience: ${targetAudience}

Analyze for readability and accessibility.

Return JSON:
{
  "contentId": "<content-id>",
  "metrics": {
    "fleschKincaid": <grade level>,
    "fleschReadingEase": <0-100>,
    "averageSentenceLength": <words>,
    "averageSyllablesPerWord": <number>,
    "technicalTermDensity": <terms per 100 words>,
    "conceptDensity": <new concepts per paragraph>
  },
  "issues": [
    {
      "type": "long-sentence" | "passive-voice" | "jargon" | "concept-cluster" | "missing-transition" | "ambiguous-pronoun" | "undefined-term",
      "location": "<where>",
      "original": "<original text>",
      "suggestion": "<improved version>"
    }
  ],
  "audienceAppropriate": {
    "targetAudience": "${targetAudience}",
    "currentLevel": "<assessed level>",
    "match": "appropriate" | "too-simple" | "too-complex",
    "adjustmentSuggestions": ["<suggestion>"]
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<ReadabilityAnalysis>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Readability analysis complete. Level: ${result.audienceAppropriate.match}`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error analyzing readability:`, error);
      return this.getFallbackReadability(content, targetAudience);
    }
  }

  /**
   * Estimate realistic time on task
   */
  async estimateTimeOnTask(input: TimeEstimationInput): Promise<TimeOnTaskEstimator> {
    logger.info(`[${this.name}] Estimating time for ${input.tasks.length} tasks`);

    const systemPrompt = `You are an expert in student time estimation and workload analysis. You provide realistic time estimates from the student perspective.

Research shows instructors typically underestimate student time by 50% or more. Consider:
- Reading speed varies (150-400 wpm)
- Difficult content takes longer
- Problem-solving has high variance
- Writing requires planning, drafting, revision
- Novices take 2-3x longer than experts expect`;

    const prompt = `Estimate realistic time on task:

Tasks: ${JSON.stringify(input.tasks, null, 2)}
Student Level: ${input.studentLevel}

Provide realistic estimates from the student perspective.

Return JSON:
{
  "contentId": "<content-id>",
  "tasks": [
    {
      "task": "<task name>",
      "type": "<task type>",
      "instructorEstimate": <minutes>,
      "realisticEstimate": <minutes>,
      "rangeMin": <minutes>,
      "rangeMax": <minutes>,
      "variabilityFactors": ["<factor affecting time>"]
    }
  ],
  "weeklyTotal": {
    "instructorExpected": <minutes>,
    "realisticMean": <minutes>,
    "percentile90": <minutes for slower students>,
    "comparedToNorm": "light" | "typical" | "heavy" | "excessive"
  },
  "pacingAdvice": ["<advice for managing workload>"]
}`;

    try {
      const result = await claudeAPI.generateJSON<TimeOnTaskEstimator>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Time estimate: ${result.weeklyTotal.realisticMean} minutes (realistic) vs ${result.weeklyTotal.instructorExpected} (instructor)`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error estimating time:`, error);
      return this.getFallbackTimeEstimate(input);
    }
  }

  /**
   * Create a complete student perspective simulation
   */
  async createSimulation(
    courseId: string,
    concepts: string[],
    sampleContent: string
  ): Promise<StudentPerspectiveSimulator> {
    logger.info(`[${this.name}] Creating student perspective simulation for: ${courseId}`);

    const noviceModels = await Promise.all(
      concepts.slice(0, 2).map(concept =>
        this.generateNoviceMentalModel({
          concept,
          domain: 'course domain',
          priorKnowledge: [],
          commonBackgrounds: ['typical undergraduate']
        })
      )
    );

    const confusionPrediction = await this.predictConfusionPoints({
      content: sampleContent,
      topic: concepts[0],
      studentLevel: 'intermediate'
    });

    const readability = await this.analyzeReadability(sampleContent, 'undergraduate students');

    return {
      courseId,
      noviceMentalModels: noviceModels,
      prerequisiteAnalysis: [],
      confusionPredictions: [confusionPrediction],
      readabilityAnalyses: [readability],
      timeEstimates: [],
      overallExperiencePrediction: {
        engagementForecast: 'moderate',
        difficultyPerception: 'challenging',
        keyRisks: [
          {
            risk: 'Prerequisite gaps',
            likelihood: 'medium',
            mitigation: 'Provide just-in-time prerequisite support'
          },
          {
            risk: 'Cognitive overload',
            likelihood: 'medium',
            mitigation: 'Break content into smaller chunks'
          }
        ],
        recommendedAdjustments: [
          'Add more concrete examples early',
          'Provide vocabulary support for technical terms',
          'Include checkpoints for self-assessment'
        ]
      }
    };
  }

  private getFallbackNoviceModel(input: NoviceModelInput): NoviceMentalModel {
    return {
      concept: input.concept,
      typicalNoviceModel: {
        beliefs: [`${input.concept} is simpler than it actually is`],
        assumptions: ['All related concepts work the same way'],
        missingConnections: ['Connection to underlying principles'],
        overSimplifications: ['Treating exceptions as the rule']
      },
      expertNoviceContrast: [{
        aspect: 'Knowledge organization',
        novicePerspective: 'Isolated facts',
        expertPerspective: 'Interconnected schema',
        bridgingPath: 'Explicitly teach connections and organize around principles'
      }],
      confusionSources: [{
        source: 'Terminology',
        whyConfusing: 'New terms without clear definitions',
        howToAddress: 'Provide clear definitions with examples'
      }]
    };
  }

  private getFallbackPrerequisites(input: PrerequisiteInput): PrerequisiteGapDetector {
    return {
      targetConcept: input.targetConcept,
      prerequisites: input.intendedPrerequisites.map((prereq, i) => ({
        concept: prereq,
        importance: i === 0 ? 'essential' as const : 'helpful' as const,
        typicallyMastered: 70 - (i * 10),
        gapIndicators: [`Struggle with ${prereq}-related problems`],
        justInTimeSupport: `Brief review of ${prereq} concepts`
      })),
      commonGapPatterns: [{
        pattern: 'Foundation gaps',
        affectedPrerequisites: input.intendedPrerequisites.slice(0, 2),
        typicalBackground: 'Students who rushed through earlier material',
        interventionSuggestion: 'Diagnostic quiz with targeted review resources'
      }]
    };
  }

  private getFallbackConfusion(input: ConfusionInput): ConfusionPointPredictor {
    return {
      contentId: `content-${Date.now()}`,
      topic: input.topic,
      predictedConfusionPoints: [{
        location: 'Early in content',
        description: 'New terminology introduced without sufficient context',
        likelihood: 'medium',
        causes: ['terminology', 'information-density'],
        preventionStrategies: ['Define terms before use', 'Use familiar analogies'],
        recoveryStrategies: ['Pause and review definitions', 'Provide glossary']
      }],
      thresholdConcepts: [{
        concept: input.topic,
        whyThreshold: 'Requires fundamental shift in thinking',
        typicalStruggleDuration: '1-2 weeks',
        breakthroughIndicators: ['Can explain in own words', 'Can apply to new situations'],
        supportStrategies: ['Multiple representations', 'Peer discussion', 'Repeated exposure']
      }]
    };
  }

  private getFallbackReadability(content: string, targetAudience: string): ReadabilityAnalysis {
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = (content.match(/[.!?]+/g) || []).length || 1;

    return {
      contentId: `content-${Date.now()}`,
      metrics: {
        fleschKincaid: 12,
        fleschReadingEase: 50,
        averageSentenceLength: wordCount / sentenceCount,
        averageSyllablesPerWord: 1.5,
        technicalTermDensity: 3,
        conceptDensity: 2
      },
      issues: [],
      audienceAppropriate: {
        targetAudience,
        currentLevel: 'undergraduate',
        match: 'appropriate',
        adjustmentSuggestions: []
      }
    };
  }

  private getFallbackTimeEstimate(input: TimeEstimationInput): TimeOnTaskEstimator {
    const multiplier = input.studentLevel === 'introductory' ? 2.5 :
                       input.studentLevel === 'intermediate' ? 2.0 : 1.5;

    const tasks = input.tasks.map(task => ({
      task: task.task,
      type: task.type,
      instructorEstimate: task.instructorEstimate,
      realisticEstimate: Math.round(task.instructorEstimate * multiplier),
      rangeMin: Math.round(task.instructorEstimate * (multiplier - 0.5)),
      rangeMax: Math.round(task.instructorEstimate * (multiplier + 0.5)),
      variabilityFactors: ['Prior knowledge', 'Reading speed', 'Motivation']
    }));

    const instructorTotal = tasks.reduce((sum, t) => sum + t.instructorEstimate, 0);
    const realisticTotal = tasks.reduce((sum, t) => sum + t.realisticEstimate, 0);

    return {
      contentId: `content-${Date.now()}`,
      tasks,
      weeklyTotal: {
        instructorExpected: instructorTotal,
        realisticMean: realisticTotal,
        percentile90: Math.round(realisticTotal * 1.3),
        comparedToNorm: realisticTotal > 180 ? 'heavy' : realisticTotal > 120 ? 'typical' : 'light'
      },
      pacingAdvice: [
        'Consider breaking larger tasks into smaller chunks',
        'Provide estimated times to help students plan',
        'Build in buffer time for struggling students'
      ]
    };
  }
}
