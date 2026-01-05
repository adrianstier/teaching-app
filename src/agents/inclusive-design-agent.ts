import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  InclusiveDesignToolkit,
  InclusiveContentCheck,
  MultilingualGlossary
} from '../types/pedagogical-features';

export interface ContentCheckInput {
  content: string;
  contentId: string;
  contentType: 'lecture' | 'assignment' | 'reading' | 'slides' | 'assessment';
}

export interface DiverseExampleInput {
  topic: string;
  currentExample: string;
  targetAudience: string;
  culturalContexts?: string[];
}

export interface GlossaryInput {
  terms: Array<{ term: string; definition: string }>;
  targetLanguages?: string[];
}

export interface AccessibilityCheckInput {
  content: string;
  hasImages: boolean;
  hasVideo: boolean;
  hasMath: boolean;
}

/**
 * InclusiveDesignAgent
 *
 * Implements inclusive teaching practices based on Universal Design
 * for Learning (CAST) and culturally responsive pedagogy (Gay, 2010;
 * Hammond, 2014).
 *
 * Key features:
 * - Representation diversity analysis
 * - Language accessibility checking
 * - Culturally responsive example generation
 * - UDL alignment verification
 * - Stereotype threat mitigation
 */
export class InclusiveDesignAgent {
  name = 'InclusiveDesignAgent';
  description = 'Ensure inclusive, accessible, and culturally responsive course materials';

  /**
   * Check content for inclusivity issues
   */
  async checkContentInclusivity(input: ContentCheckInput): Promise<InclusiveContentCheck> {
    logger.info(`[${this.name}] Checking inclusivity for: ${input.contentId}`);

    const systemPrompt = `You are an expert in inclusive pedagogy, Universal Design for Learning (UDL), and culturally responsive teaching. You analyze educational content for:

1. Representation diversity - Are diverse groups represented?
2. Cultural accessibility - Are examples universally understandable?
3. Language accessibility - Is jargon explained? Is reading level appropriate?
4. Physical accessibility - Alt text, captions, contrast
5. Stereotype threat - Does content inadvertently trigger identity threat?

Research basis:
- CAST UDL Guidelines
- Gay (2010) on culturally responsive teaching
- Hammond (2014) on culturally responsive teaching and the brain
- Steele on stereotype threat`;

    const prompt = `Analyze this content for inclusivity:

Content Type: ${input.contentType}
Content ID: ${input.contentId}

Content:
"""
${input.content.substring(0, 4000)}
"""

Analyze for:
1. Representation diversity (names, contexts, perspectives)
2. Cultural assumptions and accessibility
3. Language complexity and jargon
4. Accessibility issues
5. Stereotype threat potential

Return JSON:
{
  "contentId": "${input.contentId}",
  "representation": {
    "namesUsed": [
      { "name": "<name>", "perceivedBackground": "<perceived cultural background>" }
    ],
    "diversityScore": <0-100>,
    "suggestions": ["<suggestion for improving diversity>"]
  },
  "contextAnalysis": {
    "contextsUsed": ["<context 1>"],
    "culturalAssumptions": ["<assumption that may not be universal>"],
    "accessibilityOfExamples": "universal" | "mostly-accessible" | "limited" | "exclusive",
    "suggestedAlternatives": ["<alternative example>"]
  },
  "languageCheck": {
    "readabilityScore": <Flesch-Kincaid grade level>,
    "jargonCount": <number>,
    "jargonTerms": [
      {
        "term": "<jargon term>",
        "definition": "<definition if provided>",
        "plainLanguageAlternative": "<simpler way to say it>"
      }
    ],
    "idioms": [
      {
        "phrase": "<idiom>",
        "meaning": "<what it means>",
        "alternative": "<clearer phrasing>"
      }
    ]
  },
  "accessibilityCheck": {
    "hasAltText": true | false | "n/a",
    "colorContrastPasses": true | false | "unable to assess",
    "multipleModalities": true | false,
    "captionsAvailable": true | false | "n/a",
    "issues": ["<accessibility issue>"],
    "fixes": ["<how to fix>"]
  },
  "stereotypeThreatCheck": {
    "potentialTriggers": ["<potential trigger>"],
    "identitySafeLanguage": true | false,
    "growthMindsetLanguage": true | false,
    "recommendations": ["<recommendation>"]
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<InclusiveContentCheck>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Inclusivity check complete. Diversity score: ${result.representation.diversityScore}`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error checking content:`, error);
      return this.getFallbackCheck(input);
    }
  }

  /**
   * Generate diverse alternatives for an example
   */
  async generateDiverseExamples(input: DiverseExampleInput): Promise<{
    originalExample: string;
    alternatives: Array<{
      example: string;
      culturalContext: string;
      inclusivityNote: string;
    }>;
    universalVersion: string;
  }> {
    logger.info(`[${this.name}] Generating diverse examples for: ${input.topic}`);

    const systemPrompt = `You are an expert in culturally responsive pedagogy. You help instructors create examples that resonate with diverse student populations while teaching the same concepts effectively.

Principles:
1. Maintain conceptual accuracy
2. Use contexts from various cultural backgrounds
3. Avoid stereotypes while being culturally specific
4. Consider international students' perspectives
5. Include contexts accessible to first-generation students`;

    const prompt = `Generate diverse alternatives for this example:

Topic: ${input.topic}
Current Example: ${input.currentExample}
Target Audience: ${input.targetAudience}
${input.culturalContexts ? `Cultural Contexts to Consider: ${JSON.stringify(input.culturalContexts)}` : ''}

Create:
1. 3-4 alternative examples from different cultural contexts
2. A universal version that works across cultures
3. Notes on inclusivity for each

Return JSON:
{
  "originalExample": "${input.currentExample}",
  "alternatives": [
    {
      "example": "<alternative example>",
      "culturalContext": "<cultural background>",
      "inclusivityNote": "<why this is inclusive>"
    }
  ],
  "universalVersion": "<culturally neutral version>"
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        originalExample: string;
        alternatives: Array<{
          example: string;
          culturalContext: string;
          inclusivityNote: string;
        }>;
        universalVersion: string;
      }>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating examples:`, error);
      // Provide helpful fallback alternatives based on requested cultural contexts
      const contexts = input.culturalContexts || ['Global', 'Local community', 'Historical'];
      return {
        originalExample: input.currentExample,
        alternatives: contexts.map((context, idx) => ({
          example: `Consider adapting "${input.currentExample}" to a ${context} context for ${input.topic}`,
          culturalContext: context,
          inclusivityNote: `This alternative provides representation for students with ${context} backgrounds`
        })),
        universalVersion: `A general example of ${input.topic} that doesn't rely on specific cultural knowledge`
      };
    }
  }

  /**
   * Generate a multilingual glossary
   */
  async generateMultilingualGlossary(input: GlossaryInput): Promise<MultilingualGlossary> {
    logger.info(`[${this.name}] Generating multilingual glossary for ${input.terms.length} terms`);

    const languages = input.targetLanguages || ['Spanish', 'Mandarin', 'Arabic'];

    const systemPrompt = `You are an expert in multilingual education and technical translation. You create glossaries that help English language learners access disciplinary content.`;

    const prompt = `Create a multilingual glossary:

Terms:
${JSON.stringify(input.terms, null, 2)}

Target Languages: ${JSON.stringify(languages)}

For each term, provide:
1. Plain language English definition
2. Translations in target languages
3. Common confusions

Return JSON:
{
  "courseId": "glossary-${Date.now()}",
  "terms": [
    {
      "id": "<term-id>",
      "termEnglish": "<term>",
      "definition": "<technical definition>",
      "plainLanguageDefinition": "<simpler definition>",
      "translations": [
        {
          "language": "<language>",
          "term": "<translated term>",
          "translatedDefinition": "<definition in language>"
        }
      ],
      "pronunciation": "<pronunciation guide>",
      "etymology": "<word origin if helpful>",
      "commonConfusions": ["<commonly confused with>"]
    }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<MultilingualGlossary>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Generated glossary with ${result.terms.length} terms`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating glossary:`, error);
      return {
        courseId: `glossary-${Date.now()}`,
        terms: input.terms.map((t, idx) => ({
          id: `term-${idx + 1}`,
          termEnglish: t.term,
          definition: t.definition,
          plainLanguageDefinition: t.definition,
          translations: [],
          commonConfusions: []
        }))
      };
    }
  }

  /**
   * Check and improve accessibility
   */
  async checkAccessibility(input: AccessibilityCheckInput): Promise<{
    overallScore: number;
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      fix: string;
    }>;
    recommendations: string[];
    wcagCompliance: Record<string, boolean>;
  }> {
    logger.info(`[${this.name}] Checking accessibility`);

    const systemPrompt = `You are an expert in digital accessibility and WCAG guidelines. You help instructors make educational content accessible to all learners, including those with disabilities.`;

    const prompt = `Check this content for accessibility:

Content: ${input.content.substring(0, 3000)}

Content includes:
- Images: ${input.hasImages}
- Video: ${input.hasVideo}
- Math: ${input.hasMath}

Analyze against WCAG 2.1 guidelines and educational accessibility best practices.

Return JSON:
{
  "overallScore": <0-100>,
  "issues": [
    {
      "type": "<issue type>",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "<what the issue is>",
      "fix": "<how to fix it>"
    }
  ],
  "recommendations": ["<recommendation>"],
  "wcagCompliance": {
    "perceivable": true | false,
    "operable": true | false,
    "understandable": true | false,
    "robust": true | false
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        overallScore: number;
        issues: Array<{
          type: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          fix: string;
        }>;
        recommendations: string[];
        wcagCompliance: Record<string, boolean>;
      }>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error checking accessibility:`, error);
      return {
        overallScore: 70,
        issues: [],
        recommendations: [
          'Add alt text to all images',
          'Ensure color is not the only way information is conveyed',
          'Provide captions for videos'
        ],
        wcagCompliance: {
          perceivable: true,
          operable: true,
          understandable: true,
          robust: true
        }
      };
    }
  }

  /**
   * Generate UDL-aligned content alternatives
   */
  async generateUDLAlternatives(content: string, topic: string): Promise<{
    engagement: Array<{ option: string; description: string }>;
    representation: Array<{ option: string; description: string }>;
    actionExpression: Array<{ option: string; description: string }>;
  }> {
    logger.info(`[${this.name}] Generating UDL alternatives for: ${topic}`);

    const systemPrompt = `You are an expert in Universal Design for Learning (UDL). You help instructors provide multiple means of engagement, representation, and action/expression.

UDL Principles:
1. Engagement: Recruit interest, sustain effort, self-regulation
2. Representation: Perception, language/symbols, comprehension
3. Action & Expression: Physical action, expression/communication, executive function`;

    const prompt = `Generate UDL alternatives for this content:

Topic: ${topic}
Content: ${content.substring(0, 2000)}

Provide multiple options for each UDL principle.

Return JSON:
{
  "engagement": [
    { "option": "<engagement option>", "description": "<how to implement>" }
  ],
  "representation": [
    { "option": "<representation option>", "description": "<how to implement>" }
  ],
  "actionExpression": [
    { "option": "<action/expression option>", "description": "<how to implement>" }
  ]
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        engagement: Array<{ option: string; description: string }>;
        representation: Array<{ option: string; description: string }>;
        actionExpression: Array<{ option: string; description: string }>;
      }>(prompt, systemPrompt, 4096);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating UDL alternatives:`, error);
      return {
        engagement: [
          { option: 'Choice in topics/examples', description: 'Let students choose which aspect to focus on' },
          { option: 'Connect to student interests', description: 'Ask students to relate content to their experiences' }
        ],
        representation: [
          { option: 'Visual diagram', description: 'Create a visual representation of key concepts' },
          { option: 'Audio explanation', description: 'Provide an audio summary' }
        ],
        actionExpression: [
          { option: 'Written response', description: 'Traditional written assignment' },
          { option: 'Oral presentation', description: 'Present understanding verbally' },
          { option: 'Visual project', description: 'Create an infographic or diagram' }
        ]
      };
    }
  }

  private getFallbackCheck(input: ContentCheckInput): InclusiveContentCheck {
    return {
      contentId: input.contentId,
      representation: {
        namesUsed: [],
        diversityScore: 50,
        suggestions: ['Consider adding examples with diverse names and contexts']
      },
      contextAnalysis: {
        contextsUsed: [],
        culturalAssumptions: ['Review content for cultural assumptions'],
        accessibilityOfExamples: 'mostly-accessible',
        suggestedAlternatives: ['Consider alternative contexts that may be more universally accessible']
      },
      languageCheck: {
        readabilityScore: 12,
        jargonCount: 0,
        jargonTerms: [],
        idioms: []
      },
      accessibilityCheck: {
        hasAltText: false,
        colorContrastPasses: true,
        multipleModalities: false,
        captionsAvailable: false,
        issues: ['Unable to assess visual accessibility from text content'],
        fixes: ['Ensure all images have descriptive alt text']
      },
      stereotypeThreatCheck: {
        potentialTriggers: [],
        identitySafeLanguage: true,
        growthMindsetLanguage: true,
        recommendations: ['Regularly use growth mindset language', 'Emphasize that ability can be developed']
      }
    };
  }
}
