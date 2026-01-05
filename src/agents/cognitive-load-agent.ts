import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  CognitiveLoadOptimizer,
  WorkedExample,
  SlideComplexityAnalysis,
  ChunkingRecommendation
} from '../types/pedagogical-features';

export interface WorkedExampleInput {
  topic: string;
  problemType: string;
  problem: string;
  solution: string;
  targetFadingLevel: 'full' | 'partial-1' | 'partial-2' | 'completion' | 'problem-only';
}

export interface SlideAnalysisInput {
  slideContent: string;
  slideNumber: number;
  hasImages: boolean;
  hasAnimations: boolean;
}

export interface ChunkingInput {
  content: string;
  contentId: string;
  targetAudience: 'novice' | 'intermediate' | 'advanced';
}

export interface CourseLoadInput {
  lectures: Array<{
    id: string;
    title: string;
    content: string;
    duration: number;
    concepts: string[];
  }>;
}

/**
 * CognitiveLoadAgent
 *
 * Implements cognitive load optimization based on Sweller's Cognitive
 * Load Theory (2011) and Mayer's Multimedia Learning Principles (2009).
 *
 * Key features:
 * - Worked example generation with fading
 * - Slide complexity analysis
 * - Information chunking recommendations
 * - Multimedia principle checking
 * - Course-level load profiling
 */
export class CognitiveLoadAgent {
  name = 'CognitiveLoadAgent';
  description = 'Optimize instructional materials for cognitive load management';

  /**
   * Generate a worked example with fading structure
   */
  async generateWorkedExample(input: WorkedExampleInput): Promise<WorkedExample> {
    logger.info(`[${this.name}] Generating worked example for: ${input.topic}`);

    const systemPrompt = `You are an expert in cognitive load theory and worked examples. You create worked examples that:
1. Use subgoal labels to chunk solution steps
2. Include self-explanation prompts
3. Support fading from full examples to independent practice
4. Anticipate common errors

Research basis:
- Sweller on worked example effect
- Atkinson et al. on fading
- Catrambone on subgoal learning
- Chi on self-explanation`;

    const fadingDescriptions = {
      'full': 'Complete worked example with all steps shown',
      'partial-1': 'Most steps shown, 1-2 steps for student to complete',
      'partial-2': 'Half the steps shown, half for student',
      'completion': 'Only first steps shown, student completes the rest',
      'problem-only': 'No steps shown, student solves independently'
    };

    const prompt = `Create a worked example:

Topic: ${input.topic}
Problem Type: ${input.problemType}
Problem: ${input.problem}
Solution: ${input.solution}
Fading Level: ${input.targetFadingLevel} - ${fadingDescriptions[input.targetFadingLevel]}

Generate:
1. Step-by-step solution with subgoal labels
2. Self-explanation prompts after key steps
3. Common errors at each step
4. Appropriate fading based on level

Return JSON:
{
  "id": "<unique-id>",
  "topic": "${input.topic}",
  "problemType": "${input.problemType}",
  "problem": "${input.problem}",
  "solution": [
    {
      "stepNumber": <number>,
      "action": "<what to do>",
      "explanation": "<why this step>",
      "subgoalLabel": "<subgoal category>"
    }
  ],
  "fadingLevel": "${input.targetFadingLevel}",
  "fadedSteps": [<step numbers that are blanked for student>],
  "selfExplanationPrompts": [
    {
      "afterStep": <step number>,
      "prompt": "<self-explanation question>"
    }
  ],
  "commonErrors": [
    {
      "atStep": <step number>,
      "error": "<common mistake>",
      "correction": "<how to fix>"
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<WorkedExample>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated worked example with ${result.solution.length} steps`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating worked example:`, error);
      return this.getFallbackWorkedExample(input);
    }
  }

  /**
   * Analyze slide complexity
   */
  async analyzeSlideComplexity(input: SlideAnalysisInput): Promise<SlideComplexityAnalysis> {
    logger.info(`[${this.name}] Analyzing slide ${input.slideNumber} complexity`);

    const systemPrompt = `You are an expert in multimedia learning and presentation design. You analyze slides against cognitive load principles and Mayer's multimedia principles:

1. Coherence: No extraneous material
2. Signaling: Key information highlighted
3. Redundancy: Don't duplicate narration as on-screen text
4. Spatial Contiguity: Words near related graphics
5. Temporal Contiguity: Narration synced with graphics
6. Segmenting: Learner-paced segments
7. Pre-training: Key terms pre-taught
8. Modality: Prefer narration over on-screen text
9. Personalization: Conversational style`;

    const prompt = `Analyze this slide for cognitive load:

Slide Number: ${input.slideNumber}
Has Images: ${input.hasImages}
Has Animations: ${input.hasAnimations}

Slide Content:
"""
${input.slideContent}
"""

Analyze for:
1. Word count and density
2. Cognitive load levels (intrinsic, extraneous, germane)
3. Multimedia principle violations
4. Specific issues and fixes

Return JSON:
{
  "slideId": "slide-${input.slideNumber}",
  "slideNumber": ${input.slideNumber},
  "metrics": {
    "wordCount": <number>,
    "bulletPoints": <number>,
    "images": <count or estimate>,
    "diagrams": <count or estimate>,
    "animations": ${input.hasAnimations ? '<estimated count>' : '0'},
    "intrinsicLoad": <1-10>,
    "extraneousLoad": <1-10>,
    "germaneLoad": <1-10>,
    "totalEstimatedLoad": <1-10>
  },
  "issues": [
    {
      "type": "text-overload" | "split-attention" | "redundancy" | "transient-info" | "missing-visual" | "decorative-visual" | "poor-chunking",
      "description": "<what the issue is>",
      "location": "<where on the slide>",
      "fix": "<how to fix>"
    }
  ],
  "multimediaPrinciples": {
    "coherence": true | false,
    "signaling": true | false,
    "redundancy": true | false,
    "spatialContiguity": true | false,
    "temporalContiguity": true | false,
    "segmenting": true | false,
    "pretraining": true | false,
    "modality": true | false,
    "personalization": true | false
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<SlideComplexityAnalysis>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Slide analysis complete. Total load: ${result.metrics.totalEstimatedLoad}/10`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error analyzing slide:`, error);
      return this.getFallbackSlideAnalysis(input);
    }
  }

  /**
   * Generate chunking recommendations
   */
  async generateChunkingRecommendations(input: ChunkingInput): Promise<ChunkingRecommendation> {
    logger.info(`[${this.name}] Generating chunking recommendations for: ${input.contentId}`);

    const systemPrompt = `You are an expert in information processing and chunking. You help instructors break complex content into digestible pieces based on:
- Miller's 7±2 working memory limit
- Sweller's element interactivity
- Schema theory and prior knowledge`;

    const prompt = `Analyze and chunk this content:

Content ID: ${input.contentId}
Target Audience: ${input.targetAudience}

Content:
"""
${input.content.substring(0, 4000)}
"""

Analyze current structure and provide:
1. Assessment of current chunking
2. Recommended hierarchy
3. Chunked version with labels

Return JSON:
{
  "contentId": "${input.contentId}",
  "originalContent": "<first 200 chars>...",
  "analysis": {
    "currentChunks": <estimated current chunks>,
    "idealChunks": <recommended number>,
    "elementsToGroup": [["element1", "element2"], ["element3", "element4"]],
    "suggestedHierarchy": [
      {
        "level": <1 is top>,
        "label": "<section label>",
        "content": ["<item 1>", "<item 2>"]
      }
    ]
  },
  "chunkedVersion": [
    {
      "chunkId": "<chunk-id>",
      "chunkLabel": "<descriptive label>",
      "content": "<chunked content>",
      "estimatedProcessingTime": <seconds>
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<ChunkingRecommendation>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Generated ${result.chunkedVersion.length} chunks`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating chunks:`, error);
      return this.getFallbackChunking(input);
    }
  }

  /**
   * Analyze cognitive load across a course
   */
  async analyzeCourseLoad(input: CourseLoadInput): Promise<{
    lectureByLectureLoad: Array<{
      lectureId: string;
      averageLoad: number;
      peakLoad: number;
      recommendations: string[];
    }>;
    overallBalance: 'well-balanced' | 'front-loaded' | 'back-loaded' | 'uneven';
    suggestions: string[];
  }> {
    logger.info(`[${this.name}] Analyzing cognitive load for ${input.lectures.length} lectures`);

    const systemPrompt = `You are an expert in course design and cognitive load management. You analyze load distribution across a course to optimize learning.`;

    const prompt = `Analyze cognitive load distribution:

Lectures:
${JSON.stringify(input.lectures.map(l => ({
  id: l.id,
  title: l.title,
  conceptCount: l.concepts.length,
  duration: l.duration,
  contentPreview: l.content.substring(0, 200)
})), null, 2)}

Analyze:
1. Load per lecture (complexity × concept count / duration)
2. Overall distribution pattern
3. Recommendations for balancing

Return JSON:
{
  "lectureByLectureLoad": [
    {
      "lectureId": "<id>",
      "averageLoad": <1-10>,
      "peakLoad": <1-10>,
      "recommendations": ["<recommendation>"]
    }
  ],
  "overallBalance": "well-balanced" | "front-loaded" | "back-loaded" | "uneven",
  "suggestions": ["<suggestion for course-level improvement>"]
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        lectureByLectureLoad: Array<{
          lectureId: string;
          averageLoad: number;
          peakLoad: number;
          recommendations: string[];
        }>;
        overallBalance: 'well-balanced' | 'front-loaded' | 'back-loaded' | 'uneven';
        suggestions: string[];
      }>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error analyzing course load:`, error);
      return {
        lectureByLectureLoad: input.lectures.map(l => ({
          lectureId: l.id,
          averageLoad: 5,
          peakLoad: 7,
          recommendations: ['Review for optimization opportunities']
        })),
        overallBalance: 'uneven',
        suggestions: ['Consider spreading complex concepts across multiple sessions']
      };
    }
  }

  /**
   * Generate a complete cognitive load optimization report
   */
  async generateOptimizationReport(
    slides: SlideAnalysisInput[],
    topic: string
  ): Promise<CognitiveLoadOptimizer> {
    logger.info(`[${this.name}] Generating optimization report for: ${topic}`);

    const analyses = await Promise.all(
      slides.slice(0, 10).map(s => this.analyzeSlideComplexity(s))
    );

    const averageLoad = analyses.reduce((sum, a) => sum + a.metrics.totalEstimatedLoad, 0) / analyses.length;

    return {
      courseId: `course-${Date.now()}`,
      workedExamples: [],
      slideAnalyses: analyses,
      chunkingRecommendations: [],
      courseLoadProfile: {
        lectureByLectureLoad: [{
          lectureId: 'current',
          averageLoad,
          peakLoad: Math.max(...analyses.map(a => a.metrics.totalEstimatedLoad)),
          recommendations: averageLoad > 7
            ? ['Reduce slide complexity', 'Add more visuals', 'Break into smaller segments']
            : ['Current load level is appropriate']
        }],
        overallBalance: averageLoad <= 5 ? 'well-balanced' : averageLoad <= 7 ? 'front-loaded' : 'uneven',
        suggestions: [
          'Consider adding worked examples before complex problems',
          'Use progressive disclosure for complex information',
          'Add pauses for processing after dense content'
        ]
      }
    };
  }

  private getFallbackWorkedExample(input: WorkedExampleInput): WorkedExample {
    return {
      id: `we-${Date.now()}`,
      topic: input.topic,
      problemType: input.problemType,
      problem: input.problem,
      solution: [
        {
          stepNumber: 1,
          action: 'Identify the given information',
          explanation: 'Start by understanding what you have',
          subgoalLabel: 'Setup'
        },
        {
          stepNumber: 2,
          action: 'Apply the relevant concept',
          explanation: 'Use your knowledge of the topic',
          subgoalLabel: 'Application'
        },
        {
          stepNumber: 3,
          action: 'Compute/derive the answer',
          explanation: 'Work through the logic or calculation',
          subgoalLabel: 'Solution'
        },
        {
          stepNumber: 4,
          action: 'Verify the result',
          explanation: 'Check that the answer makes sense',
          subgoalLabel: 'Verification'
        }
      ],
      fadingLevel: input.targetFadingLevel,
      fadedSteps: input.targetFadingLevel === 'full' ? [] :
                  input.targetFadingLevel === 'partial-1' ? [4] :
                  input.targetFadingLevel === 'partial-2' ? [3, 4] :
                  input.targetFadingLevel === 'completion' ? [2, 3, 4] : [1, 2, 3, 4],
      selfExplanationPrompts: [
        { afterStep: 1, prompt: 'Why is this information relevant?' },
        { afterStep: 2, prompt: 'How does this concept apply here?' }
      ],
      commonErrors: [
        { atStep: 1, error: 'Missing key information', correction: 'Read the problem carefully again' },
        { atStep: 2, error: 'Wrong concept applied', correction: 'Review which concept fits this situation' }
      ]
    };
  }

  private getFallbackSlideAnalysis(input: SlideAnalysisInput): SlideComplexityAnalysis {
    const wordCount = input.slideContent.split(/\s+/).length;

    return {
      slideId: `slide-${input.slideNumber}`,
      slideNumber: input.slideNumber,
      metrics: {
        wordCount,
        bulletPoints: (input.slideContent.match(/^[-•*]/gm) || []).length,
        images: input.hasImages ? 1 : 0,
        diagrams: 0,
        animations: input.hasAnimations ? 1 : 0,
        intrinsicLoad: 5,
        extraneousLoad: wordCount > 100 ? 7 : 4,
        germaneLoad: 5,
        totalEstimatedLoad: wordCount > 100 ? 7 : 5
      },
      issues: wordCount > 100 ? [{
        type: 'text-overload',
        description: 'Slide contains too much text',
        location: 'Main content',
        fix: 'Reduce to key points and use visuals'
      }] : [],
      multimediaPrinciples: {
        coherence: true,
        signaling: false,
        redundancy: true,
        spatialContiguity: true,
        temporalContiguity: true,
        segmenting: false,
        pretraining: false,
        modality: false,
        personalization: false
      }
    };
  }

  private getFallbackChunking(input: ChunkingInput): ChunkingRecommendation {
    const paragraphs = input.content.split(/\n\n+/);

    return {
      contentId: input.contentId,
      originalContent: input.content.substring(0, 200) + '...',
      analysis: {
        currentChunks: paragraphs.length,
        idealChunks: Math.min(7, Math.max(3, paragraphs.length)),
        elementsToGroup: [],
        suggestedHierarchy: [{
          level: 1,
          label: 'Main Content',
          content: paragraphs.slice(0, 3).map(p => p.substring(0, 50))
        }]
      },
      chunkedVersion: paragraphs.slice(0, 5).map((p, i) => ({
        chunkId: `chunk-${i + 1}`,
        chunkLabel: `Section ${i + 1}`,
        content: p,
        estimatedProcessingTime: Math.ceil(p.split(/\s+/).length / 3) // ~3 words per second
      }))
    };
  }
}
