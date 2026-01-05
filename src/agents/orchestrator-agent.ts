import { BaseAgent } from './base-agent';
import { AgentContext, LectureBrief, LectureBriefSchema } from '../types';
import inquirer from 'inquirer';
import chalk from 'chalk';

interface IntakeQuestions {
  title: string;
  topic: string;
  duration: number;
  audienceLevel: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  mainGoals: string[];
  constraints?: string[];
  preferredStyle?: string;
  specialRequirements?: string[];
}

export class OrchestratorAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Orchestrator',
        role: 'Intake Specialist',
        description: 'Conducts structured interviews and generates comprehensive lecture briefs',
        systemPrompt: `You are an expert educational consultant specializing in lecture design and curriculum development.
        Your role is to conduct thorough intake interviews with instructors to understand their exact needs and constraints.

        You should:
        1. Ask clarifying questions to fully understand the lecture requirements
        2. Identify implicit needs that the instructor might not have articulated
        3. Generate comprehensive lecture briefs that capture all requirements
        4. Ensure alignment between instructor expectations and deliverables
        5. Consider pedagogical best practices while respecting instructor preferences

        Always be thorough, professional, and focused on creating actionable documentation.`
      },
      context
    );
  }

  async execute(input?: any): Promise<LectureBrief> {
    console.log(chalk.blue.bold('\n═══════════════════════════════════════════'));
    console.log(chalk.blue.bold('  PHASE 1: LECTURE INTAKE PROCESS'));
    console.log(chalk.blue.bold('═══════════════════════════════════════════\n'));

    // Conduct the structured interview
    const responses = await this.conductInterview();

    // Generate the lecture brief
    const brief = await this.generateLectureBrief(responses);

    // Confirm with the instructor
    const confirmed = await this.confirmBrief(brief);

    if (confirmed) {
      // Update context with the confirmed brief
      this.updateContext({
        lecturePackage: {
          ...this.context.lecturePackage,
          brief
        }
      });

      console.log(chalk.green('\n✅ Lecture brief confirmed and saved!\n'));
      return brief;
    } else {
      // In a real system, we'd loop back to refine
      console.log(chalk.yellow('\n⚠️  Brief requires refinement. In production, this would restart the process.\n'));
      return brief;
    }
  }

  private async conductInterview(): Promise<IntakeQuestions> {
    console.log(chalk.cyan('📋 Starting Structured Interview...\n'));

    const basicQuestions = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of your lecture?',
        default: 'Introduction to Machine Learning',
        validate: (input) => input.length > 0 || 'Title is required'
      },
      {
        type: 'input',
        name: 'topic',
        message: 'What is the main topic or subject area?',
        default: 'Machine Learning Fundamentals',
        validate: (input) => input.length > 0 || 'Topic is required'
      },
      {
        type: 'number',
        name: 'duration',
        message: 'How long is the lecture (in minutes)?',
        default: 50,
        validate: (input) => input > 0 || 'Duration must be positive'
      },
      {
        type: 'list',
        name: 'audienceLevel',
        message: 'What is the audience level?',
        choices: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      }
    ]);

    const detailedQuestions = await inquirer.prompt([
      {
        type: 'input',
        name: 'prerequisites',
        message: 'What are the prerequisites? (comma-separated)',
        default: 'Basic programming, Basic statistics',
        filter: (input) => input.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      },
      {
        type: 'input',
        name: 'mainGoals',
        message: 'What are the main learning goals? (comma-separated)',
        default: 'Understand ML basics, Identify ML problems, Know key algorithms',
        filter: (input) => input.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      },
      {
        type: 'input',
        name: 'constraints',
        message: 'Any constraints or limitations? (comma-separated, or press enter to skip)',
        filter: (input) => input ? input.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : []
      },
      {
        type: 'input',
        name: 'preferredStyle',
        message: 'Preferred teaching style? (or press enter to skip)',
        default: 'Interactive with examples'
      },
      {
        type: 'input',
        name: 'specialRequirements',
        message: 'Any special requirements? (comma-separated, or press enter to skip)',
        filter: (input) => input ? input.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : []
      }
    ]);

    return { ...basicQuestions, ...detailedQuestions };
  }

  private async generateLectureBrief(responses: IntakeQuestions): Promise<LectureBrief> {
    console.log(chalk.cyan('\n🤖 Generating comprehensive lecture brief...\n'));

    // Check for uploaded document context
    const uploadedDoc = (this.context as any).uploadedDocument;
    let contextSection = '';

    if (uploadedDoc) {
      console.log(chalk.yellow('📄 Incorporating uploaded document context...'));
      contextSection = `

UPLOADED DOCUMENT CONTEXT:
- File: ${uploadedDoc.fileName}
- Extracted Topics: ${uploadedDoc.extractedContext?.keyTopics?.join(', ') || 'None'}
- Existing Structure: ${uploadedDoc.extractedContext?.existingStructure?.length || 0} sections detected
- Document Summary: ${uploadedDoc.parsedContent?.text?.substring(0, 500) || 'Not available'}

Please incorporate relevant information from the uploaded document into the lecture brief,
ensuring compatibility with the instructor's requirements while leveraging existing content.`;
    }

    const prompt = `Based on the following interview responses, generate a comprehensive lecture brief:

Title: ${responses.title}
Topic: ${responses.topic}
Duration: ${responses.duration} minutes
Audience Level: ${responses.audienceLevel}
Prerequisites: ${responses.prerequisites.join(', ')}
Main Goals: ${responses.mainGoals.join(', ')}
Constraints: ${responses.constraints?.join(', ') || 'None specified'}
Preferred Style: ${responses.preferredStyle || 'Not specified'}
Special Requirements: ${responses.specialRequirements?.join(', ') || 'None'}${contextSection}

Please analyze these requirements and generate a detailed lecture brief that:
1. Expands on the main goals with specific, measurable objectives
2. Identifies any implicit requirements based on the topic and audience
3. Suggests additional considerations for effective delivery
4. Ensures all elements are pedagogically sound
${uploadedDoc ? '5. Integrates relevant content from the uploaded document' : ''}

Return a JSON object matching the LectureBrief schema.`;

    const brief = await this.thinkStructured<LectureBrief>(
      prompt,
      LectureBriefSchema,
      { temperature: 0.7 }
    );

    return brief;
  }

  private async confirmBrief(brief: LectureBrief): Promise<boolean> {
    console.log(chalk.cyan('\n📄 Generated Lecture Brief:\n'));
    console.log(chalk.white('━'.repeat(50)));

    console.log(chalk.bold('\nTitle:'), brief.title);
    console.log(chalk.bold('Duration:'), `${brief.duration} minutes`);
    console.log(chalk.bold('Topic:'), brief.topic);
    console.log(chalk.bold('Audience Level:'), brief.audienceLevel);

    console.log(chalk.bold('\nPrerequisites:'));
    brief.prerequisites.forEach(p => console.log(`  • ${p}`));

    console.log(chalk.bold('\nMain Goals:'));
    brief.mainGoals.forEach(g => console.log(`  • ${g}`));

    if (brief.constraints && brief.constraints.length > 0) {
      console.log(chalk.bold('\nConstraints:'));
      brief.constraints.forEach(c => console.log(`  • ${c}`));
    }

    if (brief.preferredStyle) {
      console.log(chalk.bold('\nPreferred Style:'), brief.preferredStyle);
    }

    if (brief.specialRequirements && brief.specialRequirements.length > 0) {
      console.log(chalk.bold('\nSpecial Requirements:'));
      brief.specialRequirements.forEach(r => console.log(`  • ${r}`));
    }

    console.log(chalk.white('\n' + '━'.repeat(50)));

    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Do you approve this lecture brief?',
        default: true
      }
    ]);

    return confirmed;
  }

  async validate(output: any): Promise<boolean> {
    try {
      LectureBriefSchema.parse(output);
      return true;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  }
}