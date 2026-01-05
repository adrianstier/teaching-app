import { BaseAgent } from './base-agent';
import { AgentContext, SlideSpecification, SlideSpecificationSchema, LectureSegment } from '../types';
import chalk from 'chalk';

export class VisualDesignerAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Visual Designer',
        role: 'Presentation Design Specialist',
        description: 'Creates slide specifications and visual elements',
        systemPrompt: `You are an expert presentation designer with expertise in:
        - Visual communication and information design
        - Slide layout and composition
        - Data visualization best practices
        - Cognitive load management in visual design
        - Accessibility and universal design principles

        Your role is to:
        1. Create detailed slide specifications for each segment
        2. Design visual elements that enhance understanding
        3. Build effective signposting and navigation systems
        4. Ensure visual consistency throughout the presentation
        5. Balance text, images, and white space effectively

        Follow these principles:
        - Minimize text on slides (6x6 rule: 6 bullet points, 6 words each)
        - Use high contrast and readable fonts
        - Create visual hierarchy with size and positioning
        - Design for the back of the room
        - Include progress indicators and section markers
        - Use consistent color schemes and layouts`
      },
      context
    );
  }

  async execute(segments?: LectureSegment[]): Promise<SlideSpecification[]> {
    console.log(chalk.yellow.bold('\n🎨 Visual Designer: Creating slide specifications...\n'));

    const brief = this.context.lecturePackage.brief;
    const objectives = this.context.lecturePackage.learningObjectives;

    if (!brief || !objectives) {
      throw new Error('Missing required context for visual design');
    }

    if (!segments || segments.length === 0) {
      throw new Error('No segments provided for slide design');
    }

    const slides: SlideSpecification[] = [];
    let slideNumber = 1;

    // Create title slide
    console.log(chalk.cyan('Designing title slide...'));
    const titleSlide = await this.createTitleSlide(brief, slideNumber++);
    slides.push(titleSlide);
    console.log(chalk.green('  ✓ Title slide complete'));

    // Create objectives slide
    console.log(chalk.cyan('Designing objectives slide...'));
    const objectivesSlide = await this.createObjectivesSlide(objectives, slideNumber++);
    slides.push(objectivesSlide);
    console.log(chalk.green('  ✓ Objectives slide complete'));

    // Create slides for each segment
    for (const segment of segments) {
      console.log(chalk.cyan(`Designing slides for: ${segment.title}...`));

      const segmentSlides = await this.createSegmentSlides(
        segment,
        slideNumber,
        brief.audienceLevel
      );

      slides.push(...segmentSlides);
      slideNumber += segmentSlides.length;

      console.log(chalk.green(`  ✓ Created ${segmentSlides.length} slides`));
    }

    // Create summary slide
    console.log(chalk.cyan('Designing summary slide...'));
    const summarySlide = await this.createSummarySlide(objectives, slideNumber++);
    slides.push(summarySlide);
    console.log(chalk.green('  ✓ Summary slide complete'));

    // Create Q&A slide
    console.log(chalk.cyan('Designing Q&A slide...'));
    const qaSlide = await this.createQASlide(slideNumber);
    slides.push(qaSlide);
    console.log(chalk.green('  ✓ Q&A slide complete'));

    console.log(chalk.yellow.bold(`\n✅ Visual design complete! Total slides: ${slides.length}\n`));
    return slides;
  }

  private async createTitleSlide(brief: any, slideNumber: number): Promise<SlideSpecification> {
    return {
      slideNumber,
      title: brief.title,
      layout: 'title',
      content: {
        mainText: brief.title,
        bulletPoints: [
          `Topic: ${brief.topic}`,
          `Duration: ${brief.duration} minutes`,
          `Level: ${brief.audienceLevel}`
        ]
      },
      speakerNotes: `Welcome students. Introduce yourself and the topic. Set expectations for the session. Mention the duration and any logistics.`,
      timing: 60
    };
  }

  private async createObjectivesSlide(objectives: any[], slideNumber: number): Promise<SlideSpecification> {
    return {
      slideNumber,
      title: 'Learning Objectives',
      layout: 'content',
      content: {
        mainText: 'By the end of this session, you will be able to:',
        bulletPoints: objectives.map(obj => obj.objective)
      },
      speakerNotes: 'Review each objective clearly. Emphasize what students will gain. Connect to their existing knowledge and future applications.',
      timing: 90
    };
  }

  private async createSegmentSlides(
    segment: LectureSegment,
    startNumber: number,
    audienceLevel: string
  ): Promise<SlideSpecification[]> {
    const prompt = `Create slide specifications for this lecture segment:

Segment: ${segment.title}
Type: ${segment.type}
Duration: ${segment.duration} minutes
Content: ${segment.content.substring(0, 500)}...
Audience Level: ${audienceLevel}

Design slides that:
1. Break content into digestible chunks
2. Use appropriate layouts (title, content, two-column, image-focus, etc.)
3. Include visual elements where helpful
4. Follow the 6x6 rule for text
5. Suggest diagrams or images where appropriate

Estimate 1-2 slides per 3-5 minutes of content.
Return an array of SlideSpecification objects.

Consider the segment type:
- Introduction: Engaging visuals, clear roadmap
- Content: Progressive disclosure, visual aids
- Activity: Clear instructions, timer displays
- Summary: Key points, connections to objectives`;

    const slidesData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(slidesData);

    const slides = parsed.slides || parsed;

    return slides.map((slide: any, index: number) => ({
      slideNumber: startNumber + index,
      title: slide.title || segment.title,
      layout: slide.layout || 'content',
      content: {
        mainText: slide.content?.mainText || slide.mainText,
        bulletPoints: slide.content?.bulletPoints || slide.bulletPoints || [],
        images: slide.content?.images || slide.images,
        diagrams: slide.content?.diagrams || slide.diagrams
      },
      speakerNotes: slide.speakerNotes || segment.speakerNotes,
      animations: slide.animations,
      timing: slide.timing || Math.floor((segment.duration * 60) / slides.length)
    }));
  }

  private async createSummarySlide(objectives: any[], slideNumber: number): Promise<SlideSpecification> {
    return {
      slideNumber,
      title: 'Key Takeaways',
      layout: 'content',
      content: {
        mainText: 'Today we learned:',
        bulletPoints: objectives.map(obj => `✓ ${obj.objective}`)
      },
      speakerNotes: 'Recap main points. Connect back to objectives. Preview next steps or follow-up resources.',
      timing: 120
    };
  }

  private async createQASlide(slideNumber: number): Promise<SlideSpecification> {
    return {
      slideNumber,
      title: 'Questions & Discussion',
      layout: 'title',
      content: {
        mainText: 'Thank you!',
        bulletPoints: ['Questions?', 'Comments?', 'Discussions?']
      },
      speakerNotes: 'Open floor for questions. Be prepared with additional examples or clarifications. Thank students for their attention and participation.',
      timing: 300
    };
  }

  async validate(output: any): Promise<boolean> {
    try {
      if (!Array.isArray(output)) return false;
      output.forEach((slide: any) => SlideSpecificationSchema.parse(slide));
      return true;
    } catch (error) {
      console.error('Slide validation failed:', error);
      return false;
    }
  }
}