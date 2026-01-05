import { BaseAgent } from './base-agent';
import { AgentContext, LectureBrief } from '../types';
import logger from '../utils/logger';

interface ExtractedContext {
  suggestedTitle?: string;
  suggestedTopic?: string;
  suggestedDuration?: number;
  suggestedPrerequisites?: string[];
  suggestedGoals?: string[];
  keyTopics?: string[];
  existingStructure?: Array<{
    title: string;
    content: string;
    slideNumber?: number;
  }>;
  extractedText: string;
  confidence: number;
}

export class ContextExtractorAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Context Extractor',
        role: 'Document Analysis Specialist',
        description: 'Analyzes uploaded documents to extract context and suggest intake values',
        systemPrompt: `You are an expert at analyzing educational documents like lecture slides, outlines, and course materials.

        Your role is to:
        1. Extract key information from uploaded documents
        2. Identify the main topic and learning objectives
        3. Recognize the structure and flow of existing content
        4. Suggest appropriate values for the intake form
        5. Preserve valuable content that can be reused

        You should extract:
        - Title and topic of the lecture
        - Estimated duration based on content volume
        - Prerequisites mentioned or implied
        - Learning goals or objectives
        - Key topics and concepts covered
        - Existing structure and organization
        - Important examples or case studies

        Provide confidence scores for your extractions and be conservative in your suggestions.`
      },
      context
    );
  }

  async execute(documentContent: string, documentType: string = 'unknown'): Promise<ExtractedContext> {
    logger.info(`Context Extractor analyzing ${documentType} document`);

    const analysisPrompt = `Analyze this educational document and extract relevant information for creating or improving a lecture.

Document Type: ${documentType}
Document Content:
${documentContent.substring(0, 10000)} // Limit to first 10k characters

Extract and structure the following information:
1. Suggested title for the lecture
2. Main topic or subject area
3. Estimated duration (based on content density)
4. Prerequisites (explicit or implied)
5. Learning goals/objectives (explicit or inferred)
6. Key topics and concepts
7. Existing structure (sections/slides with titles)
8. Notable examples, case studies, or activities

Return a JSON object with:
- suggestedTitle: string
- suggestedTopic: string
- suggestedDuration: number (minutes)
- suggestedPrerequisites: string[]
- suggestedGoals: string[]
- keyTopics: string[]
- existingStructure: array of {title, content, slideNumber?}
- confidence: number (0-1, how confident you are in the extraction)

Be conservative and only suggest values you're reasonably confident about.`;

    try {
      const response = await this.think(analysisPrompt, { responseFormat: 'json' });
      const extracted = JSON.parse(response);

      // Validate and clean the extracted data
      const result: ExtractedContext = {
        suggestedTitle: this.cleanString(extracted.suggestedTitle),
        suggestedTopic: this.cleanString(extracted.suggestedTopic),
        suggestedDuration: this.validateDuration(extracted.suggestedDuration),
        suggestedPrerequisites: this.cleanArray(extracted.suggestedPrerequisites),
        suggestedGoals: this.cleanArray(extracted.suggestedGoals),
        keyTopics: this.cleanArray(extracted.keyTopics),
        existingStructure: this.validateStructure(extracted.existingStructure),
        extractedText: documentContent.substring(0, 5000), // Store first 5k chars for reference
        confidence: Math.min(1, Math.max(0, extracted.confidence || 0.5))
      };

      logger.info(`Extraction complete with confidence: ${result.confidence}`);
      return result;

    } catch (error) {
      logger.error('Failed to extract context from document', error);

      // Return minimal extraction on error
      return {
        extractedText: documentContent.substring(0, 5000),
        confidence: 0,
        keyTopics: this.extractBasicTopics(documentContent)
      };
    }
  }

  private cleanString(str: any): string | undefined {
    if (!str || typeof str !== 'string') return undefined;
    const cleaned = str.trim();
    return cleaned.length > 0 ? cleaned : undefined;
  }

  private cleanArray(arr: any): string[] | undefined {
    if (!Array.isArray(arr)) return undefined;
    const cleaned = arr
      .filter(item => typeof item === 'string' && item.trim().length > 0)
      .map(item => item.trim());
    return cleaned.length > 0 ? cleaned : undefined;
  }

  private validateDuration(duration: any): number | undefined {
    const num = Number(duration);
    if (isNaN(num) || num < 10 || num > 480) return undefined;
    return Math.round(num);
  }

  private validateStructure(structure: any): any[] | undefined {
    if (!Array.isArray(structure)) return undefined;

    const validated = structure
      .filter(item => item && typeof item === 'object')
      .map(item => ({
        title: this.cleanString(item.title) || 'Untitled',
        content: this.cleanString(item.content) || '',
        slideNumber: Number.isInteger(item.slideNumber) ? item.slideNumber : undefined
      }));

    return validated.length > 0 ? validated : undefined;
  }

  private extractBasicTopics(content: string): string[] {
    // Basic keyword extraction as fallback
    const words = content.toLowerCase().split(/\W+/);
    const wordFreq: Record<string, number> = {};

    // Count word frequency
    words.forEach(word => {
      if (word.length > 4 && !this.isCommonWord(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Get top 10 most frequent words as topics
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private isCommonWord(word: string): boolean {
    const common = ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'which', 'their', 'would', 'could', 'should', 'about', 'after', 'before'];
    return common.includes(word);
  }

  async enhanceIntakeWithContext(
    intakeData: Partial<LectureBrief>,
    extractedContext: ExtractedContext
  ): Promise<LectureBrief> {
    const prompt = `Given the extracted context from an uploaded document and partial intake data,
    create a complete and enhanced lecture brief.

Extracted Context:
- Title suggestion: ${extractedContext.suggestedTitle || 'None'}
- Topic: ${extractedContext.suggestedTopic || 'None'}
- Duration: ${extractedContext.suggestedDuration || 'Unknown'}
- Prerequisites: ${extractedContext.suggestedPrerequisites?.join(', ') || 'None'}
- Goals: ${extractedContext.suggestedGoals?.join(', ') || 'None'}
- Key Topics: ${extractedContext.keyTopics?.join(', ') || 'None'}
- Confidence: ${extractedContext.confidence}

User's Intake Data:
${JSON.stringify(intakeData, null, 2)}

Merge this information intelligently:
1. Prefer user-provided values when present
2. Use extracted values to fill gaps
3. Enhance goals and prerequisites based on document analysis
4. Add any valuable context from the document

Return a complete LectureBrief object.`;

    const enhancedData = await this.think(prompt, { responseFormat: 'json' });
    const enhanced = JSON.parse(enhancedData);

    // Merge with defaults and validation
    const brief: LectureBrief = {
      title: intakeData.title || extractedContext.suggestedTitle || enhanced.title || 'Untitled Lecture',
      topic: intakeData.topic || extractedContext.suggestedTopic || enhanced.topic || 'General Topic',
      duration: intakeData.duration || extractedContext.suggestedDuration || enhanced.duration || 50,
      audienceLevel: intakeData.audienceLevel || enhanced.audienceLevel || 'intermediate',
      prerequisites: this.mergeArrays(
        intakeData.prerequisites,
        extractedContext.suggestedPrerequisites,
        enhanced.prerequisites
      ),
      mainGoals: this.mergeArrays(
        intakeData.mainGoals,
        extractedContext.suggestedGoals,
        enhanced.mainGoals
      ),
      constraints: intakeData.constraints || enhanced.constraints,
      preferredStyle: intakeData.preferredStyle || enhanced.preferredStyle,
      specialRequirements: intakeData.specialRequirements || enhanced.specialRequirements
    };

    return brief;
  }

  private mergeArrays(...arrays: (string[] | undefined)[]): string[] {
    const merged = new Set<string>();

    arrays.forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item && item.trim()) {
            merged.add(item.trim());
          }
        });
      }
    });

    return Array.from(merged);
  }

  async validate(output: any): Promise<boolean> {
    return output && typeof output === 'object' && 'extractedText' in output;
  }
}