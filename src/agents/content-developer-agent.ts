import { BaseAgent } from './base-agent';
import { AgentContext, LectureSegment, LectureSegmentSchema } from '../types';
import chalk from 'chalk';

export class ContentDeveloperAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Content Developer',
        role: 'Subject Matter Expert & Content Creator',
        description: 'Develops detailed content for each lecture segment',
        systemPrompt: `You are an expert content developer and subject matter specialist with expertise in:
        - Creating clear, engaging educational content
        - Developing relevant examples and analogies
        - Writing smooth transitions between topics
        - Balancing depth with accessibility
        - Incorporating storytelling and real-world applications

        Your role is to:
        1. Develop comprehensive content for each lecture segment
        2. Create relevant, relatable examples for complex concepts
        3. Write natural transitions that maintain flow
        4. Ensure content matches the audience level
        5. Include speaker notes with timing and delivery tips

        Focus on:
        - Clarity and precision in explanations
        - Progressive complexity building
        - Memorable examples and analogies
        - Engaging narrative flow
        - Practical applications`
      },
      context
    );
  }

  async execute(structure?: any): Promise<LectureSegment[]> {
    console.log(chalk.green.bold('\n📝 Content Developer: Building lecture content...\n'));

    const brief = this.context.lecturePackage.brief;
    const objectives = this.context.lecturePackage.learningObjectives;
    const concepts = this.context.lecturePackage.conceptMap;

    if (!brief || !objectives || !concepts) {
      throw new Error('Missing required context for content development');
    }

    const segments: LectureSegment[] = [];

    // Develop content for each segment in the structure
    if (structure && structure.segments) {
      for (const [index, structSegment] of structure.segments.entries()) {
        console.log(chalk.cyan(`Developing: ${structSegment.title}...`));

        const segment = await this.developSegment(
          structSegment,
          index,
          brief,
          objectives,
          concepts
        );

        segments.push(segment);

        // Show progress
        console.log(chalk.green(`  ✓ Completed: ${segment.title}`));
      }
    }

    console.log(chalk.green.bold('\n✅ Content development complete!\n'));
    return segments;
  }

  private async developSegment(
    structSegment: any,
    index: number,
    brief: any,
    objectives: any,
    concepts: any
  ): Promise<LectureSegment> {
    // Check for uploaded document context
    const uploadedDoc = (this.context as any).uploadedDocument;
    let contextSection = '';

    if (uploadedDoc && uploadedDoc.extractedContext?.existingStructure) {
      // Find relevant existing content for this segment
      const relevantContent = uploadedDoc.extractedContext.existingStructure.find(
        (s: any) => s.title?.toLowerCase().includes(structSegment.title.toLowerCase()) ||
                    structSegment.title.toLowerCase().includes(s.title?.toLowerCase())
      );

      if (relevantContent) {
        contextSection = `

RELEVANT EXISTING CONTENT:
Title: ${relevantContent.title}
Content: ${relevantContent.content?.substring(0, 500) || 'Not available'}

Please adapt and enhance this existing content to fit the new structure and learning objectives.`;
      }
    }

    const prompt = `Develop detailed content for this lecture segment:

Segment: ${structSegment.title}
Type: ${structSegment.type}
Duration: ${structSegment.duration} minutes
Description: ${structSegment.description}
Position: ${index + 1} of ${structSegment.length || 'multiple'} segments

Context:
- Topic: ${brief.topic}
- Audience: ${brief.audienceLevel}
- Learning Objectives: ${objectives.map((o: any) => o.objective).join('; ')}
- Key Concepts: ${concepts.map((c: any) => c.name).join(', ')}${contextSection}

Create comprehensive content that includes:
1. Main content (what to present)
2. Detailed speaker notes (how to present, timing, emphasis)
3. Specific examples or case studies
4. Transition phrases to next segment
5. Key points to emphasize

For ${structSegment.type} segments, ensure appropriate:
- Introduction: Hook, objectives overview, relevance
- Content: Clear explanations, examples, applications
- Activity: Clear instructions, expected outcomes
- Transition: Summary of previous, preview of next
- Summary: Key takeaways, connections to objectives

Return as a LectureSegment object with full content and speaker notes.`;

    const segmentData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(segmentData);

    const segment: LectureSegment = {
      id: `seg-${index + 1}`,
      title: parsed.title || structSegment.title,
      duration: structSegment.duration,
      type: structSegment.type,
      content: parsed.content || parsed.mainContent || '',
      speakerNotes: parsed.speakerNotes || parsed.notes || '',
      visualElements: parsed.visualElements || [],
      activities: parsed.activities || []
    };

    return segment;
  }

  async validate(output: any): Promise<boolean> {
    try {
      if (!Array.isArray(output)) return false;
      output.forEach((segment: any) => LectureSegmentSchema.parse(segment));
      return true;
    } catch (error) {
      console.error('Content validation failed:', error);
      return false;
    }
  }
}