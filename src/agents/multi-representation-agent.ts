import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';

export interface MultiRepresentation {
  concept: string;
  representations: {
    formal: string;
    plain: string;
    example: string;
    visual: {
      description: string;
      suggestedDiagram: string;
      altText: string;
    };
    mathematical?: string;
    historical?: string;
    misconception?: string;
  };
  teachingSequence: string[];
  disciplineSpecific: boolean;
}

export interface MultiRepresentationInput {
  concept: string;
  discipline?: string;
  audienceLevel?: 'novice' | 'intermediate' | 'advanced';
  includeHistorical?: boolean;
  includeMathematical?: boolean;
}

export class MultiRepresentationAgent {
  name = 'MultiRepresentationAgent';
  description = 'Generate multiple ways to explain the same concept for inclusive teaching using Claude AI';

  async execute(input: MultiRepresentationInput): Promise<MultiRepresentation> {
    logger.info(`[${this.name}] Generating multiple representations for: ${input.concept}`);

    const representations = await this.generateRepresentations(input);
    const teachingSequence = this.determineTeachingSequence(input.audienceLevel || 'intermediate');

    return {
      concept: input.concept,
      representations,
      teachingSequence,
      disciplineSpecific: !!input.discipline,
    };
  }

  private async generateRepresentations(input: MultiRepresentationInput): Promise<MultiRepresentation['representations']> {
    const systemPrompt = `You are an expert instructional designer specializing in Universal Design for Learning (UDL) and inclusive teaching practices. You help educators explain concepts in multiple ways to reach diverse learners.`;

    const prompt = `Generate multiple representations for teaching the concept: "${input.concept}"

Context:
${input.discipline ? `- Discipline: ${input.discipline}` : ''}
- Audience Level: ${input.audienceLevel || 'intermediate'}
${input.includeMathematical ? '- Include mathematical representation' : ''}
${input.includeHistorical ? '- Include historical context' : ''}

Create diverse representations that would help different types of learners understand this concept:

1. **Formal Definition**: Academic/technical definition
2. **Plain Language**: Explain to someone with no background
3. **Real-World Example**: Concrete, relatable example ${input.discipline ? `from ${input.discipline}` : ''}
4. **Visual Metaphor**: Describe a visual/diagram and provide alt text
${input.includeMathematical ? '5. **Mathematical Formulation**: Equations or formal notation' : ''}
${input.includeHistorical ? '6. **Historical Context**: How the concept developed over time' : ''}
7. **Common Misconception**: What students often get wrong

Return your response as a JSON object with this structure:
{
  "formal": "<formal academic definition>",
  "plain": "<plain language explanation>",
  "example": "<real-world example>",
  "visual": {
    "description": "<visual metaphor description>",
    "suggestedDiagram": "<what diagram would help>",
    "altText": "<accessibility text for visual>"
  }${input.includeMathematical ? ',\n  "mathematical": "<mathematical representation>"' : ''}${input.includeHistorical ? ',\n  "historical": "<historical context>"' : ''},
  "misconception": "<common misconception to address>"
}`;

    try {
      const result = await claudeAPI.generateJSON<MultiRepresentation['representations']>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Successfully generated representations`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating representations, using fallback:`, error);
      return this.getFallbackRepresentations(input);
    }
  }

  private determineTeachingSequence(audienceLevel: 'novice' | 'intermediate' | 'advanced'): string[] {
    const sequences = {
      novice: [
        'Start with plain language explanation',
        'Provide real-world example',
        'Show visual metaphor',
        'Address common misconception',
        'Introduce formal definition',
        'Add mathematical/historical if relevant',
      ],
      intermediate: [
        'Begin with formal definition',
        'Clarify with plain language',
        'Demonstrate with real-world example',
        'Support with visual metaphor',
        'Correct common misconceptions',
        'Deepen with mathematical/historical context',
      ],
      advanced: [
        'Present formal definition',
        'Explore mathematical formulation',
        'Discuss historical development',
        'Analyze through examples',
        'Challenge misconceptions',
        'Synthesize multiple perspectives',
      ],
    };

    return sequences[audienceLevel];
  }

  private getFallbackRepresentations(input: MultiRepresentationInput): MultiRepresentation['representations'] {
    return {
      formal: `Formal definition: ${input.concept} is a structured concept that involves systematic analysis and application of principles within its domain.`,
      plain: `In simple terms: ${input.concept} is a way of thinking about or working with ideas that helps us understand complex relationships.`,
      example: `For example: ${input.concept} appears in everyday situations when you solve problems or make decisions.`,
      visual: {
        description: `Think of ${input.concept} like a tree: it has roots (foundational ideas), a trunk (core principles), branches (applications), and leaves (specific examples).`,
        suggestedDiagram: 'Tree diagram with labeled components',
        altText: `A tree diagram illustrating ${input.concept} with roots, trunk, branches, and leaves representing different aspects`,
      },
      mathematical: input.includeMathematical ? `Mathematical representation of ${input.concept} (API unavailable)` : undefined,
      historical: input.includeHistorical ? `Historical context for ${input.concept} (API unavailable)` : undefined,
      misconception: `Common misconception: Students often confuse ${input.concept} with related but distinct ideas.`,
    };
  }
}
