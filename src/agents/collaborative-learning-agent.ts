import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  CollaborativeLearningOrchestrator,
  GroupFormationCriteria,
  CollaborativeActivity,
  PeerFeedbackFramework,
  GroupRole
} from '../types/pedagogical-features';

export interface GroupFormationInput {
  classSize: number;
  strategy: 'heterogeneous' | 'homogeneous' | 'random' | 'interest-based' | 'complementary-skills';
  groupSizePreference: { min: number; max: number; ideal: number };
  studentData?: Array<{
    id: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    interests?: string[];
    background?: string;
  }>;
}

export interface CollaborativeActivityInput {
  type: 'jigsaw' | 'think-pair-share' | 'peer-teaching' | 'group-problem-solving' |
        'structured-controversy' | 'reciprocal-teaching' | 'peer-review' | 'fishbowl';
  topic: string;
  duration: number;
  groupSize: number;
  learningObjective: string;
  includeRoles?: boolean;
}

export interface PeerFeedbackInput {
  activityType: string;
  criteria: string[];
  includeTraining: boolean;
}

/**
 * CollaborativeLearningAgent
 *
 * Implements evidence-based collaborative learning strategies based on
 * research by Johnson & Johnson (2009) and Slavin (1996).
 *
 * Key features:
 * - Group formation algorithms (heterogeneous, homogeneous, etc.)
 * - Role assignment with accountability
 * - Peer feedback frameworks
 * - Structured collaborative activities
 */
export class CollaborativeLearningAgent {
  name = 'CollaborativeLearningAgent';
  description = 'Orchestrate effective collaborative learning with group formation and peer feedback';

  /**
   * Generate group formation recommendations
   */
  async formGroups(input: GroupFormationInput): Promise<{
    groups: Array<{ id: string; members: string[]; roles?: Record<string, string> }>;
    rationale: string;
    tips: string[];
  }> {
    logger.info(`[${this.name}] Forming groups for ${input.classSize} students using ${input.strategy} strategy`);

    const systemPrompt = `You are an expert in cooperative learning and group dynamics. You help instructors form effective learning groups based on research.

Key principles (Johnson & Johnson):
1. Positive interdependence - Students need each other to succeed
2. Individual accountability - Each person must contribute
3. Promotive interaction - Students help each other learn
4. Social skills - Teach collaboration explicitly
5. Group processing - Reflect on group effectiveness

Group formation strategies:
- Heterogeneous: Mix skill levels for peer learning
- Homogeneous: Same level for targeted instruction
- Random: Quick, reduces social dynamics
- Interest-based: Shared motivation
- Complementary skills: Different strengths combine`;

    const studentIds = input.studentData?.map(s => s.id) ||
      Array.from({ length: input.classSize }, (_, i) => `student-${i + 1}`);

    const prompt = `Form learning groups for this class:

Class Size: ${input.classSize}
Strategy: ${input.strategy}
Group Size: ${JSON.stringify(input.groupSizePreference)}
${input.studentData ? `Student Data: ${JSON.stringify(input.studentData)}` : ''}

Create balanced groups and explain:
1. The grouping assignments
2. Why this grouping supports learning
3. Tips for monitoring these groups

Return JSON:
{
  "groups": [
    {
      "id": "group-1",
      "members": ["student-id-1", "student-id-2", ...],
      "roles": { "student-id": "role-name" }
    }
  ],
  "rationale": "<why this grouping works>",
  "tips": ["<tip 1>", "<tip 2>"]
}`;

    try {
      const result = await claudeAPI.generateJSON<{
        groups: Array<{ id: string; members: string[]; roles?: Record<string, string> }>;
        rationale: string;
        tips: string[];
      }>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Formed ${result.groups.length} groups`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error forming groups:`, error);
      return this.getFallbackGroups(input, studentIds);
    }
  }

  /**
   * Generate a complete collaborative activity
   */
  async generateCollaborativeActivity(input: CollaborativeActivityInput): Promise<CollaborativeActivity> {
    logger.info(`[${this.name}] Generating ${input.type} activity for: ${input.topic}`);

    const systemPrompt = `You are an expert in cooperative learning structures and collaborative pedagogy. You design structured activities that ensure:
1. Every student participates meaningfully
2. Learning is deeper than individual study
3. Positive interdependence is built in
4. Individual accountability is maintained
5. Social skills are practiced`;

    const activityDescriptions: Record<string, string> = {
      'jigsaw': 'Students become experts on subtopics and teach each other',
      'think-pair-share': 'Individual thinking, pair discussion, class sharing',
      'peer-teaching': 'Students teach concepts to each other',
      'group-problem-solving': 'Teams tackle complex problems together',
      'structured-controversy': 'Argue both sides of an issue, then synthesize',
      'reciprocal-teaching': 'Students take turns leading instruction',
      'peer-review': 'Students give and receive feedback on work',
      'fishbowl': 'Inner group discusses while outer group observes'
    };

    const prompt = `Design a ${input.type} activity:

Topic: ${input.topic}
Duration: ${input.duration} minutes
Group Size: ${input.groupSize} students
Learning Objective: ${input.learningObjective}
Include Roles: ${input.includeRoles}

Activity Type: ${activityDescriptions[input.type]}

Create a complete activity with:
1. Clear phases with timing
2. Student-facing instructions
3. Instructor facilitation notes
4. Accountability structures
5. Materials needed

Return JSON:
{
  "id": "<unique-id>",
  "name": "<activity name>",
  "type": "${input.type}",
  "duration": ${input.duration},
  "groupSize": ${input.groupSize},
  "phases": [
    {
      "name": "<phase name>",
      "duration": <minutes>,
      "instructions": "<instructor instructions>",
      "studentFacing": "<what students see/do>"
    }
  ],
  "roles": ${input.includeRoles ? `[
    {
      "name": "<role name>",
      "responsibilities": ["<responsibility 1>"],
      "rotationFrequency": "each-activity",
      "promptsForRole": ["<prompt 1>"],
      "accountabilityMeasures": ["<measure 1>"]
    }
  ]` : '[]'},
  "individualAccountability": {
    "method": "individual-quiz" | "random-call" | "written-reflection" | "peer-rating" | "individual-product",
    "description": "<how individual learning is assessed>"
  },
  "positiveInterdependence": {
    "type": "goal" | "resource" | "role" | "reward" | "task",
    "description": "<how students need each other>"
  },
  "instructorActions": [
    {
      "timing": "<when>",
      "action": "<what to do>",
      "lookFor": ["<indicator 1>"]
    }
  ],
  "materials": {
    "instructorGuide": "<full instructor script>",
    "studentHandout": "<printable handout>",
    "peerFeedbackRubric": "<rubric if applicable>"
  }
}`;

    try {
      const result = await claudeAPI.generateJSON<CollaborativeActivity>(prompt, systemPrompt, 6144);
      logger.info(`[${this.name}] Generated activity with ${result.phases.length} phases`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating activity:`, error);
      return this.getFallbackActivity(input);
    }
  }

  /**
   * Generate a peer feedback framework
   */
  async generatePeerFeedbackFramework(input: PeerFeedbackInput): Promise<PeerFeedbackFramework> {
    logger.info(`[${this.name}] Generating peer feedback framework for: ${input.activityType}`);

    const systemPrompt = `You are an expert in peer assessment and feedback. You design frameworks that help students give and receive constructive feedback effectively.

Research basis:
- Topping (1998) on peer assessment
- Nicol & Macfarlane-Dick on feedback principles
- Chi on peer learning

Key elements of effective peer feedback:
1. Clear criteria students understand
2. Sentence starters to scaffold feedback
3. Focus on work, not person
4. Balance of strengths and improvements
5. Specific and actionable suggestions
6. Training before first use`;

    const prompt = `Create a peer feedback framework for:

Activity Type: ${input.activityType}
Criteria to Assess: ${JSON.stringify(input.criteria)}
Include Training Materials: ${input.includeTraining}

Design a complete framework including:
1. Feedback criteria with levels
2. Sentence starters for different types of feedback
3. Training materials if requested
4. Quality control measures

Return JSON:
{
  "id": "<unique-id>",
  "name": "<framework name>",
  "trainingRequired": ${input.includeTraining},
  ${input.includeTraining ? `"trainingMaterials": [
    {
      "title": "<training module>",
      "content": "<training content>",
      "duration": <minutes>
    }
  ],` : '"trainingMaterials": [],'}
  "feedbackCriteria": [
    {
      "criterion": "<criterion name>",
      "description": "<what to look for>",
      "levels": [
        { "level": 4, "description": "<exemplary>" },
        { "level": 3, "description": "<proficient>" },
        { "level": 2, "description": "<developing>" },
        { "level": 1, "description": "<beginning>" }
      ]
    }
  ],
  "feedbackPrompts": {
    "strengths": ["<sentence starter for strength>"],
    "improvements": ["<sentence starter for improvement>"],
    "questions": ["<clarifying question starter>"]
  },
  "feedbackOnFeedback": true,
  "instructorModeration": true
}`;

    try {
      const result = await claudeAPI.generateJSON<PeerFeedbackFramework>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated peer feedback framework`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating framework:`, error);
      return this.getFallbackPeerFeedback(input);
    }
  }

  /**
   * Generate group roles for an activity
   */
  async generateGroupRoles(activityType: string, groupSize: number): Promise<GroupRole[]> {
    logger.info(`[${this.name}] Generating roles for ${groupSize}-person ${activityType}`);

    const systemPrompt = `You are an expert in cooperative learning roles. You design roles that ensure equitable participation and skill development.

Common effective roles:
- Facilitator: Keeps discussion on track
- Recorder: Documents key points
- Timekeeper: Manages pacing
- Questioner: Asks clarifying questions
- Summarizer: Synthesizes discussion
- Presenter: Shares with larger group
- Devil's Advocate: Challenges assumptions
- Resource Manager: Handles materials`;

    const prompt = `Generate ${groupSize} complementary roles for a ${activityType} activity.

Each role should:
1. Have clear responsibilities
2. Be equally important to success
3. Develop different skills
4. Include specific prompts for the role
5. Have accountability measures

Return JSON array:
[
  {
    "name": "<role name>",
    "responsibilities": ["<responsibility 1>", "<responsibility 2>"],
    "rotationFrequency": "each-activity" | "weekly" | "unit" | "never",
    "promptsForRole": ["<what this person should ask/say>"],
    "accountabilityMeasures": ["<how to verify contribution>"]
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<GroupRole[]>(prompt, systemPrompt, 2048);
      logger.info(`[${this.name}] Generated ${result.length} roles`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating roles:`, error);
      return this.getFallbackRoles(groupSize);
    }
  }

  private getFallbackGroups(input: GroupFormationInput, studentIds: string[]): {
    groups: Array<{ id: string; members: string[]; roles?: Record<string, string> }>;
    rationale: string;
    tips: string[];
  } {
    const idealSize = input.groupSizePreference.ideal;
    const groups: Array<{ id: string; members: string[] }> = [];

    for (let i = 0; i < studentIds.length; i += idealSize) {
      groups.push({
        id: `group-${groups.length + 1}`,
        members: studentIds.slice(i, i + idealSize)
      });
    }

    return {
      groups,
      rationale: `Groups of ${idealSize} using ${input.strategy} grouping strategy`,
      tips: [
        'Monitor groups for balanced participation',
        'Intervene if one person dominates',
        'Rotate roles in subsequent activities'
      ]
    };
  }

  private getFallbackActivity(input: CollaborativeActivityInput): CollaborativeActivity {
    return {
      id: `activity-${Date.now()}`,
      name: `${input.type.replace(/-/g, ' ')} on ${input.topic}`,
      type: input.type,
      duration: input.duration,
      groupSize: input.groupSize,
      phases: [
        {
          name: 'Setup',
          duration: Math.round(input.duration * 0.1),
          instructions: `Explain the activity and form groups of ${input.groupSize}`,
          studentFacing: 'Form your groups and review the instructions'
        },
        {
          name: 'Main Activity',
          duration: Math.round(input.duration * 0.7),
          instructions: 'Circulate and monitor groups, intervening as needed',
          studentFacing: `Work with your group on ${input.topic}`
        },
        {
          name: 'Debrief',
          duration: Math.round(input.duration * 0.2),
          instructions: 'Facilitate whole-class discussion of key insights',
          studentFacing: 'Share your group\'s findings with the class'
        }
      ],
      roles: input.includeRoles ? [
        {
          name: 'Facilitator',
          responsibilities: ['Keep discussion on track', 'Ensure everyone participates'],
          rotationFrequency: 'each-activity',
          promptsForRole: ['What do others think?', 'Let\'s make sure we address all parts'],
          accountabilityMeasures: ['Self-assessment', 'Peer rating']
        }
      ] : [],
      individualAccountability: {
        method: 'random-call',
        description: 'Any member may be called to explain the group\'s work'
      },
      positiveInterdependence: {
        type: 'goal',
        description: 'The group succeeds only when all members understand'
      },
      instructorActions: [
        {
          timing: 'During activity',
          action: 'Circulate and listen to discussions',
          lookFor: ['Balanced participation', 'On-task behavior', 'Conceptual accuracy']
        }
      ],
      materials: {
        instructorGuide: `Guide students through the ${input.type} activity on ${input.topic}`,
        studentHandout: `Topic: ${input.topic}\nObjective: ${input.learningObjective}`,
        peerFeedbackRubric: undefined
      }
    };
  }

  private getFallbackPeerFeedback(input: PeerFeedbackInput): PeerFeedbackFramework {
    return {
      id: `peer-feedback-${Date.now()}`,
      name: `Peer Feedback for ${input.activityType}`,
      trainingRequired: input.includeTraining,
      trainingMaterials: input.includeTraining ? [
        {
          title: 'Giving Effective Peer Feedback',
          content: 'Good feedback is specific, actionable, and focuses on the work rather than the person.',
          duration: 10
        }
      ] : [],
      feedbackCriteria: input.criteria.map((c, i) => ({
        criterion: c,
        description: `Evaluate the quality of ${c.toLowerCase()}`,
        levels: [
          { level: 4, description: 'Exemplary' },
          { level: 3, description: 'Proficient' },
          { level: 2, description: 'Developing' },
          { level: 1, description: 'Beginning' }
        ]
      })),
      feedbackPrompts: {
        strengths: ['One thing that works well is...', 'I was impressed by...'],
        improvements: ['One area to strengthen might be...', 'Consider revising...'],
        questions: ['I\'m curious about...', 'Could you clarify...']
      },
      feedbackOnFeedback: true,
      instructorModeration: true
    };
  }

  private getFallbackRoles(groupSize: number): GroupRole[] {
    const baseRoles: GroupRole[] = [
      {
        name: 'Facilitator',
        responsibilities: ['Guide discussion', 'Ensure everyone participates'],
        rotationFrequency: 'each-activity',
        promptsForRole: ['What do you think?', 'Let\'s hear from everyone'],
        accountabilityMeasures: ['Self-reflection', 'Peer feedback']
      },
      {
        name: 'Recorder',
        responsibilities: ['Take notes', 'Document key points'],
        rotationFrequency: 'each-activity',
        promptsForRole: ['Let me capture that', 'So the main points are...'],
        accountabilityMeasures: ['Complete notes', 'Accuracy check']
      },
      {
        name: 'Timekeeper',
        responsibilities: ['Track time', 'Keep group on pace'],
        rotationFrequency: 'each-activity',
        promptsForRole: ['We have X minutes left', 'Let\'s move to the next part'],
        accountabilityMeasures: ['Time adherence', 'Completed phases']
      },
      {
        name: 'Reporter',
        responsibilities: ['Summarize for class', 'Represent group'],
        rotationFrequency: 'each-activity',
        promptsForRole: ['Our group found...', 'We discussed...'],
        accountabilityMeasures: ['Clear presentation', 'Accurate summary']
      }
    ];

    return baseRoles.slice(0, groupSize);
  }
}
