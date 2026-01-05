import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';

export type ActivityType =
  | 'think-pair-share'
  | 'peer-instruction'
  | 'jigsaw'
  | 'case-study'
  | 'minute-paper'
  | 'concept-map'
  | 'problem-based-learning'
  | 'debate';

export interface ActivityTemplate {
  name: string;
  type: ActivityType;
  duration: {
    min: number;
    max: number;
    flexible: boolean;
  };
  classSize: {
    min: number;
    max: number;
    idealSize: string;
  };
  bloomLevel: string[];
  materials: {
    instructorScript: string;
    studentHandout: string;
    timingGuide: Array<{ time: number; action: string; who: 'instructor' | 'students' }>;
    facilitationTips: string[];
  };
  customizable: {
    topic: string;
    specificQuestion?: string;
    groupSize?: number;
    assessmentMethod?: string;
  };
}

export interface ActivityGenerationInput {
  type: ActivityType;
  topic: string;
  duration: number;
  classSize: number;
  specificQuestion?: string;
  bloomLevel?: string;
}

export class ActiveLearningAgent {
  name = 'ActiveLearningAgent';
  description = 'Generate evidence-based active learning activity templates using Claude AI';

  async execute(input: ActivityGenerationInput): Promise<ActivityTemplate> {
    logger.info(`[${this.name}] Generating ${input.type} activity for: ${input.topic}`);

    return this.generateTemplate(input);
  }

  private async generateTemplate(input: ActivityGenerationInput): Promise<ActivityTemplate> {
    const activityInfo = this.getActivityInfo(input.type);

    const systemPrompt = `You are an expert instructional designer specializing in evidence-based active learning strategies. You help university instructors design effective classroom activities based on pedagogical research.`;

    const prompt = `Generate a complete ${activityInfo.name} activity for teaching about "${input.topic}".

Activity Details:
- Type: ${activityInfo.name}
- Topic: ${input.topic}
- Duration: ${input.duration} minutes
- Class Size: ${input.classSize} students
${input.specificQuestion ? `- Specific Question: ${input.specificQuestion}` : ''}
${input.bloomLevel ? `- Bloom's Taxonomy Level: ${input.bloomLevel}` : ''}

Activity Description: ${activityInfo.description}

Generate a complete activity package including:
1. Detailed instructor script with exact timing and verbal prompts
2. Student handout with clear instructions and any worksheets needed
3. Minute-by-minute timing guide showing who does what
4. Evidence-based facilitation tips

Return your response as a JSON object with this exact structure:
{
  "name": "${activityInfo.name}",
  "type": "${input.type}",
  "duration": {
    "min": <number>,
    "max": <number>,
    "flexible": <boolean>
  },
  "classSize": {
    "min": <number>,
    "max": <number>,
    "idealSize": "<string>"
  },
  "bloomLevel": [<array of cognitive levels>],
  "materials": {
    "instructorScript": "<detailed script with timing>",
    "studentHandout": "<printable handout text>",
    "timingGuide": [
      { "time": <minutes>, "action": "<what happens>", "who": "instructor" or "students" }
    ],
    "facilitationTips": [<array of practical tips>]
  },
  "customizable": {
    "topic": "${input.topic}",
    ${input.specificQuestion ? `"specificQuestion": "${input.specificQuestion}",` : ''}
    "groupSize": <recommended group size>,
    "assessmentMethod": "<how to assess learning>"
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<ActivityTemplate>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Successfully generated activity template`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating template, falling back to basic template:`, error);
      // Fallback to basic template if API fails
      return this.getFallbackTemplate(input, activityInfo);
    }
  }

  private getActivityInfo(type: ActivityType): { name: string; description: string } {
    const info: Record<ActivityType, { name: string; description: string }> = {
      'think-pair-share': {
        name: 'Think-Pair-Share',
        description: 'Students think individually, discuss in pairs, then share with class'
      },
      'peer-instruction': {
        name: 'Peer Instruction',
        description: 'Conceptual question with individual voting, peer discussion, and revote'
      },
      'jigsaw': {
        name: 'Jigsaw',
        description: 'Students become experts on sub-topics then teach each other'
      },
      'case-study': {
        name: 'Case Study Analysis',
        description: 'Analyze realistic scenarios and make recommendations'
      },
      'minute-paper': {
        name: 'Minute Paper',
        description: 'Quick reflection on what was learned or what was confusing'
      },
      'concept-map': {
        name: 'Concept Mapping',
        description: 'Visual diagram showing how concepts connect and relate'
      },
      'problem-based-learning': {
        name: 'Problem-Based Learning',
        description: 'Complex authentic problem requiring research and solution development'
      },
      'debate': {
        name: 'Structured Debate',
        description: 'Students argue both sides of a debatable proposition'
      }
    };
    return info[type];
  }

  private getFallbackTemplate(input: ActivityGenerationInput, activityInfo: { name: string; description: string }): ActivityTemplate {
    // Basic fallback template
    return {
      name: activityInfo.name,
      type: input.type,
      duration: { min: Math.floor(input.duration * 0.8), max: Math.ceil(input.duration * 1.2), flexible: true },
      classSize: { min: 10, max: 500, idealSize: 'Any size' },
      bloomLevel: ['understand', 'apply'],
      materials: {
        instructorScript: `Activity: ${activityInfo.name}\nTopic: ${input.topic}\nDuration: ${input.duration} minutes\n\nThis is a fallback template. Please try again for a fully customized activity.`,
        studentHandout: `Activity: ${activityInfo.name}\nTopic: ${input.topic}\n\nPlease work with your group to explore this topic.`,
        timingGuide: [
          { time: 2, action: 'Introduce activity', who: 'instructor' as const },
          { time: input.duration - 4, action: 'Complete activity', who: 'students' as const },
          { time: 2, action: 'Debrief and summarize', who: 'instructor' as const }
        ],
        facilitationTips: [
          'Monitor groups for engagement',
          'Provide clear time warnings',
          'Ensure all students participate'
        ]
      },
      customizable: {
        topic: input.topic,
        specificQuestion: input.specificQuestion,
        groupSize: 3,
        assessmentMethod: 'Observation and discussion'
      }
    };
  }
}
