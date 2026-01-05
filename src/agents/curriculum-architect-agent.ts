import { BaseAgent } from './base-agent';
import {
  AgentContext,
  LearningObjective,
  ConceptNode,
  LectureBrief,
  LearningObjectiveSchema,
  ConceptNodeSchema
} from '../types';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface ArchitectureOutput {
  learningObjectives: LearningObjective[];
  conceptMap: ConceptNode[];
  proposedStructure: {
    segments: Array<{
      title: string;
      duration: number;
      type: string;
      description: string;
    }>;
    totalDuration: number;
  };
}

export class CurriculumArchitectAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Curriculum Architect',
        role: 'Learning Design Specialist',
        description: 'Designs learning objectives, concept maps, and lecture structure',
        systemPrompt: `You are an expert curriculum designer and learning architect with deep knowledge of:
        - Bloom's Taxonomy and learning objective design
        - Concept mapping and knowledge structures
        - Instructional design principles (ADDIE, SAM, Gagne's Nine Events)
        - Cognitive load theory and information processing
        - Active learning strategies and engagement techniques

        Your role is to:
        1. Transform lecture goals into measurable learning objectives using Bloom's Taxonomy
        2. Create concept maps that show relationships between key ideas
        3. Design optimal lecture structures with appropriate pacing and transitions
        4. Ensure content aligns with audience level and time constraints
        5. Balance content delivery with active learning opportunities

        Consider:
        - Prior knowledge and prerequisites
        - Logical sequencing of concepts
        - Scaffolding and progressive disclosure
        - Opportunities for formative assessment
        - Time management and pacing`
      },
      context
    );
  }

  async execute(input?: any): Promise<ArchitectureOutput> {
    console.log(chalk.magenta.bold('\n═══════════════════════════════════════════'));
    console.log(chalk.magenta.bold('  PHASE 2: CURRICULUM ARCHITECTURE'));
    console.log(chalk.magenta.bold('═══════════════════════════════════════════\n'));

    const brief = this.context.lecturePackage.brief;
    if (!brief) {
      throw new Error('Lecture brief not found in context');
    }

    // Draft learning objectives
    console.log(chalk.cyan('📚 Drafting Learning Objectives...\n'));
    const objectives = await this.draftLearningObjectives(brief);
    await this.displayLearningObjectives(objectives);

    // Create concept map
    console.log(chalk.cyan('\n🗺️  Creating Concept Map...\n'));
    const conceptMap = await this.createConceptMap(brief, objectives);
    await this.displayConceptMap(conceptMap);

    // Propose lecture structure
    console.log(chalk.cyan('\n🏗️  Proposing Lecture Structure...\n'));
    const structure = await this.proposeLectureStructure(brief, objectives, conceptMap);
    await this.displayStructure(structure);

    // Checkpoint: Get instructor approval
    const approved = await this.getInstructorApproval(objectives, conceptMap, structure);

    if (approved) {
      // Update context with architecture
      this.updateContext({
        lecturePackage: {
          ...this.context.lecturePackage,
          learningObjectives: objectives,
          conceptMap: conceptMap
        }
      });

      console.log(chalk.green('\n✅ Curriculum architecture approved!\n'));

      return {
        learningObjectives: objectives,
        conceptMap: conceptMap,
        proposedStructure: structure
      };
    } else {
      console.log(chalk.yellow('\n⚠️  Architecture requires revision.\n'));
      return {
        learningObjectives: objectives,
        conceptMap: conceptMap,
        proposedStructure: structure
      };
    }
  }

  private async draftLearningObjectives(brief: LectureBrief): Promise<LearningObjective[]> {
    const prompt = `Based on this lecture brief, create specific, measurable learning objectives:

Title: ${brief.title}
Topic: ${brief.topic}
Duration: ${brief.duration} minutes
Audience Level: ${brief.audienceLevel}
Main Goals: ${brief.mainGoals.join('; ')}
Prerequisites: ${brief.prerequisites.join('; ')}

Create 3-5 learning objectives that:
1. Use appropriate Bloom's Taxonomy levels for the audience
2. Are specific and measurable
3. Can realistically be achieved in the time available
4. Build on the stated prerequisites
5. Address the main goals

For each objective:
- Use action verbs (e.g., identify, explain, analyze, create)
- Include what students will be able to do
- Suggest how it could be assessed
- Assign appropriate Bloom's level

Return an array of LearningObjective objects.`;

    const objectivesData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(objectivesData);

    // Ensure we have an array of objectives
    const objectivesArray = parsed.objectives || parsed;

    // Generate IDs and validate each objective
    const objectives: LearningObjective[] = objectivesArray.map((obj: any, index: number) => ({
      id: `obj-${index + 1}`,
      objective: obj.objective || obj.description || obj.text,
      bloomLevel: obj.bloomLevel || this.inferBloomLevel(obj.objective || obj.description || obj.text),
      measurable: obj.measurable !== false,
      assessmentStrategy: obj.assessmentStrategy || obj.assessment || 'Formative assessment through discussion'
    }));

    return objectives;
  }

  private inferBloomLevel(objective: string): LearningObjective['bloomLevel'] {
    const text = objective.toLowerCase();
    if (text.includes('create') || text.includes('design') || text.includes('develop')) return 'create';
    if (text.includes('evaluate') || text.includes('judge') || text.includes('critique')) return 'evaluate';
    if (text.includes('analyze') || text.includes('compare') || text.includes('examine')) return 'analyze';
    if (text.includes('apply') || text.includes('use') || text.includes('implement')) return 'apply';
    if (text.includes('explain') || text.includes('describe') || text.includes('discuss')) return 'understand';
    return 'remember';
  }

  private async createConceptMap(brief: LectureBrief, objectives: LearningObjective[]): Promise<ConceptNode[]> {
    const prompt = `Create a concept map for this lecture:

Topic: ${brief.topic}
Duration: ${brief.duration} minutes
Learning Objectives: ${objectives.map(o => o.objective).join('; ')}

Design a concept map with 5-8 key concepts that:
1. Cover all learning objectives
2. Show clear relationships between concepts
3. Progress from basic to complex (considering audience level: ${brief.audienceLevel})
4. Can be covered in the available time
5. Build on prerequisites: ${brief.prerequisites.join(', ')}

For each concept node, include:
- Unique identifier
- Clear name and description
- Prerequisites (other concept IDs)
- Related concepts
- Complexity level
- Estimated teaching time

Return an array of ConceptNode objects.`;

    const conceptsData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(conceptsData);

    // Ensure we have an array of concepts
    const conceptsArray = parsed.concepts || parsed.conceptMap || parsed;

    const concepts: ConceptNode[] = conceptsArray.map((concept: any, index: number) => ({
      id: concept.id || `concept-${index + 1}`,
      name: concept.name || concept.title || `Concept ${index + 1}`,
      description: concept.description || concept.details || '',
      prerequisites: concept.prerequisites || [],
      relatedConcepts: concept.relatedConcepts || concept.related || [],
      complexity: concept.complexity || 'intermediate',
      estimatedTime: concept.estimatedTime || Math.floor(brief.duration / conceptsArray.length)
    }));

    return concepts;
  }

  private async proposeLectureStructure(
    brief: LectureBrief,
    objectives: LearningObjective[],
    conceptMap: ConceptNode[]
  ): Promise<any> {
    const prompt = `Design the lecture structure based on:

Duration: ${brief.duration} minutes
Objectives: ${objectives.map(o => o.objective).join('; ')}
Key Concepts: ${conceptMap.map(c => c.name).join(', ')}
Teaching Style: ${brief.preferredStyle || 'Interactive'}

Create a detailed structure that:
1. Includes introduction, content segments, activities, and summary
2. Allocates time appropriately
3. Includes transitions between segments
4. Incorporates active learning (Think-Pair-Share, polls, discussions)
5. Builds concepts progressively
6. Leaves time for questions

Return a structure with segments, each having:
- Title
- Duration (minutes)
- Type (introduction/content/activity/transition/summary/assessment)
- Description`;

    const structureData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(structureData);

    const segments = parsed.segments || parsed.structure || [];
    const totalDuration = segments.reduce((sum: number, seg: any) => sum + (seg.duration || 0), 0);

    return {
      segments: segments.map((seg: any) => ({
        title: seg.title || seg.name || 'Segment',
        duration: seg.duration || 5,
        type: seg.type || 'content',
        description: seg.description || seg.details || ''
      })),
      totalDuration
    };
  }

  private async displayLearningObjectives(objectives: LearningObjective[]): Promise<void> {
    console.log(chalk.bold('Learning Objectives:'));
    objectives.forEach((obj, index) => {
      console.log(chalk.green(`\n${index + 1}. ${obj.objective}`));
      console.log(chalk.gray(`   Bloom's Level: ${obj.bloomLevel}`));
      console.log(chalk.gray(`   Assessment: ${obj.assessmentStrategy}`));
    });
  }

  private async displayConceptMap(conceptMap: ConceptNode[]): Promise<void> {
    console.log(chalk.bold('Concept Map:'));
    conceptMap.forEach((concept) => {
      console.log(chalk.blue(`\n📌 ${concept.name}`));
      console.log(`   ${concept.description}`);
      console.log(chalk.gray(`   Complexity: ${concept.complexity}`));
      console.log(chalk.gray(`   Time: ${concept.estimatedTime} min`));
      if (concept.prerequisites.length > 0) {
        console.log(chalk.gray(`   Prerequisites: ${concept.prerequisites.join(', ')}`));
      }
    });
  }

  private async displayStructure(structure: any): Promise<void> {
    console.log(chalk.bold('Proposed Structure:'));
    console.log(chalk.gray(`Total Duration: ${structure.totalDuration} minutes\n`));

    structure.segments.forEach((segment: any, index: number) => {
      const icon = this.getSegmentIcon(segment.type);
      console.log(`${icon} ${chalk.bold(`[${segment.duration} min]`)} ${segment.title}`);
      console.log(chalk.gray(`   ${segment.description}`));
    });
  }

  private getSegmentIcon(type: string): string {
    const icons: { [key: string]: string } = {
      introduction: '🎯',
      content: '📖',
      activity: '💡',
      transition: '➡️',
      summary: '📋',
      assessment: '✅'
    };
    return icons[type] || '•';
  }

  private async getInstructorApproval(
    objectives: LearningObjective[],
    conceptMap: ConceptNode[],
    structure: any
  ): Promise<boolean> {
    console.log(chalk.yellow('\n' + '═'.repeat(50)));
    console.log(chalk.yellow.bold('CHECKPOINT: Architecture Review'));
    console.log(chalk.yellow('═'.repeat(50) + '\n'));

    const { approved } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'approved',
        message: 'Do you approve the learning objectives, concept map, and structure?',
        default: true
      }
    ]);

    return approved;
  }

  async validate(output: any): Promise<boolean> {
    try {
      // Validate learning objectives
      if (!Array.isArray(output.learningObjectives)) return false;
      output.learningObjectives.forEach((obj: any) => LearningObjectiveSchema.parse(obj));

      // Validate concept map
      if (!Array.isArray(output.conceptMap)) return false;
      output.conceptMap.forEach((concept: any) => ConceptNodeSchema.parse(concept));

      // Validate structure
      if (!output.proposedStructure || !Array.isArray(output.proposedStructure.segments)) return false;

      return true;
    } catch (error) {
      console.error('Architecture validation failed:', error);
      return false;
    }
  }
}