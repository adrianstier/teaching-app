import { BaseAgent } from './base-agent';
import { AgentContext, Activity, ActivitySchema } from '../types';
import chalk from 'chalk';

export class PedagogyDesignerAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Pedagogy Designer',
        role: 'Active Learning Specialist',
        description: 'Designs interactive activities and assessments',
        systemPrompt: `You are an expert in pedagogical design and active learning strategies with deep knowledge of:
        - Active learning techniques (Think-Pair-Share, Peer Instruction, etc.)
        - Formative and summative assessment design
        - Student engagement strategies
        - Collaborative learning methods
        - Cognitive science and learning theory

        Your role is to:
        1. Design interactive activities that reinforce learning objectives
        2. Create Think-Pair-Share prompts that encourage deep thinking
        3. Develop formative assessments to check understanding
        4. Plan engagement strategies for different learning styles
        5. Design collaborative exercises that build community

        Consider:
        - Bloom's Taxonomy alignment
        - Time constraints for activities
        - Diverse learning preferences
        - Scalability for different class sizes
        - Clear facilitation instructions`
      },
      context
    );
  }

  async execute(structure?: any): Promise<Activity[]> {
    console.log(chalk.blue.bold('\n💡 Pedagogy Designer: Creating activities and assessments...\n'));

    const brief = this.context.lecturePackage.brief;
    const objectives = this.context.lecturePackage.learningObjectives;
    const concepts = this.context.lecturePackage.conceptMap;

    if (!brief || !objectives || !concepts) {
      throw new Error('Missing required context for pedagogy design');
    }

    const activities: Activity[] = [];

    // Design activities based on the structure
    if (structure && structure.segments) {
      // Identify activity segments
      const activitySegments = structure.segments.filter(
        (seg: any) => seg.type === 'activity' || seg.type === 'assessment'
      );

      // Also create activities for content segments that could benefit from interaction
      const contentSegments = structure.segments.filter(
        (seg: any) => seg.type === 'content' && seg.duration >= 10
      );

      // Design specific activities for activity segments
      for (const segment of activitySegments) {
        console.log(chalk.cyan(`Designing activity: ${segment.title}...`));
        const activity = await this.designActivity(segment, objectives, concepts);
        activities.push(activity);
        console.log(chalk.green(`  ✓ Created: ${activity.name}`));
      }

      // Design optional activities for longer content segments
      for (const segment of contentSegments) {
        console.log(chalk.cyan(`Designing optional activity for: ${segment.title}...`));
        const activity = await this.designMiniActivity(segment, objectives);
        activities.push(activity);
        console.log(chalk.green(`  ✓ Created: ${activity.name}`));
      }
    }

    // Add Think-Pair-Share prompts
    console.log(chalk.cyan('\nGenerating Think-Pair-Share prompts...'));
    const tpsPrompts = await this.generateTPSPrompts(objectives, concepts);
    activities.push(...tpsPrompts);

    console.log(chalk.blue.bold('\n✅ Pedagogy design complete!\n'));
    return activities;
  }

  private async designActivity(segment: any, objectives: any[], concepts: any[]): Promise<Activity> {
    const prompt = `Design an interactive learning activity:

Segment: ${segment.title}
Duration: ${segment.duration} minutes
Type: ${segment.type}

Learning Objectives:
${objectives.map((o: any) => `- ${o.objective} (${o.bloomLevel})`).join('\n')}

Key Concepts:
${concepts.map((c: any) => `- ${c.name}: ${c.description}`).join('\n')}

Create an engaging activity that:
1. Directly supports one or more learning objectives
2. Can be completed in ${segment.duration} minutes
3. Encourages active participation
4. Provides immediate feedback opportunity
5. Scales for different class sizes

Include:
- Clear instructions for students
- Materials needed (if any)
- Expected outcomes
- Facilitation tips for instructor

Activity types to consider:
- Think-Pair-Share
- Polling/Voting
- Small group discussion
- Problem-solving exercise
- Peer review
- Quick quiz

Return as an Activity object.`;

    const activityData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(activityData);

    const activity: Activity = {
      id: `act-${Date.now()}`,
      name: parsed.name || segment.title,
      type: parsed.type || 'discussion',
      duration: segment.duration,
      instructions: parsed.instructions || '',
      materials: parsed.materials || [],
      expectedOutcomes: parsed.expectedOutcomes || [],
      facilitation: parsed.facilitation || parsed.facilitationTips || ''
    };

    return activity;
  }

  private async designMiniActivity(segment: any, objectives: any[]): Promise<Activity> {
    const prompt = `Design a brief interactive element for this content segment:

Segment: ${segment.title}
Available time: 2-3 minutes within a ${segment.duration}-minute segment

Create a mini-activity that:
1. Provides a mental break from passive listening
2. Checks understanding of just-covered content
3. Requires minimal setup
4. Can be done individually or in pairs

Options:
- Quick reflection question
- Minute paper
- One-minute problem
- Peer explanation
- Concept check poll

Return as an Activity object.`;

    const activityData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(activityData);

    const activity: Activity = {
      id: `mini-${Date.now()}`,
      name: parsed.name || `Quick Check: ${segment.title}`,
      type: parsed.type || 'reflection',
      duration: parsed.duration || 2,
      instructions: parsed.instructions || '',
      materials: [],
      expectedOutcomes: parsed.expectedOutcomes || [],
      facilitation: parsed.facilitation || ''
    };

    return activity;
  }

  private async generateTPSPrompts(objectives: any[], concepts: any[]): Promise<Activity[]> {
    const prompt = `Generate 3-4 Think-Pair-Share prompts for this lecture:

Learning Objectives:
${objectives.map((o: any) => `- ${o.objective}`).join('\n')}

Concepts:
${concepts.map((c: any) => c.name).join(', ')}

Create thought-provoking prompts that:
1. Connect to real-world applications
2. Encourage critical thinking
3. Have no single correct answer
4. Promote discussion
5. Can be discussed in 3-5 minutes

For each prompt, include:
- The question/prompt
- Brief facilitation notes
- Potential discussion points

Return as an array of Activity objects with type "think-pair-share".`;

    const tpsData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(tpsData);

    const prompts = parsed.prompts || parsed;

    return prompts.map((prompt: any, index: number) => ({
      id: `tps-${index + 1}`,
      name: `TPS ${index + 1}: ${prompt.topic || 'Discussion'}`,
      type: 'think-pair-share' as const,
      duration: prompt.duration || 5,
      instructions: prompt.question || prompt.instructions || prompt.prompt || '',
      materials: [],
      expectedOutcomes: prompt.expectedOutcomes || ['Student engagement', 'Concept application'],
      facilitation: prompt.facilitation || prompt.notes || ''
    }));
  }

  async validate(output: any): Promise<boolean> {
    try {
      if (!Array.isArray(output)) return false;
      output.forEach((activity: any) => ActivitySchema.parse(activity));
      return true;
    } catch (error) {
      console.error('Activity validation failed:', error);
      return false;
    }
  }
}