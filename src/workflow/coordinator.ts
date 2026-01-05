import { AgentContext, LecturePackage } from '../types';
import { OrchestratorAgent } from '../agents/orchestrator-agent';
import { CurriculumArchitectAgent } from '../agents/curriculum-architect-agent';
import { ContentDeveloperAgent } from '../agents/content-developer-agent';
import { PedagogyDesignerAgent } from '../agents/pedagogy-designer-agent';
import { VisualDesignerAgent } from '../agents/visual-designer-agent';
import { IntegrationAgent } from '../agents/integration-agent';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class WorkflowCoordinator {
  private context: AgentContext;
  private checkpoints: Map<string, boolean> = new Map();

  constructor() {
    this.context = {
      lecturePackage: {},
      currentPhase: 0,
      checkpointsPassed: [],
      feedbackHistory: []
    };
  }

  async execute(): Promise<LecturePackage> {
    console.clear();
    this.displayBanner();

    try {
      // Phase 1: Intake
      await this.executePhase1();

      // Phase 2: Architecture
      await this.executePhase2();

      // Phase 3: Parallel Development
      await this.executePhase3();

      // Phase 4: Visual Design
      await this.executePhase4();

      // Phase 5: Integration
      const finalPackage = await this.executePhase5();

      this.displayCompletion();
      return finalPackage;

    } catch (error) {
      console.error(chalk.red('\n❌ Error in workflow:'), error);
      throw error;
    }
  }

  private async executePhase1(): Promise<void> {
    this.updatePhase(1);
    const orchestrator = new OrchestratorAgent(this.context);
    const brief = await orchestrator.execute();

    this.context.lecturePackage.brief = brief;
    this.recordCheckpoint('phase1-intake');
  }

  private async executePhase2(): Promise<void> {
    this.updatePhase(2);
    const architect = new CurriculumArchitectAgent(this.context);
    const architecture = await architect.execute();

    this.context.lecturePackage.learningObjectives = architecture.learningObjectives;
    this.context.lecturePackage.conceptMap = architecture.conceptMap;
    this.context.proposedStructure = architecture.proposedStructure;
    this.recordCheckpoint('phase2-architecture');
  }

  private async executePhase3(): Promise<void> {
    this.updatePhase(3);

    console.log(chalk.cyan.bold('\n═══════════════════════════════════════════'));
    console.log(chalk.cyan.bold('  PHASE 3: PARALLEL DEVELOPMENT'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════════\n'));

    // Run content developer and pedagogy designer in parallel
    const contentDeveloper = new ContentDeveloperAgent(this.context);
    const pedagogyDesigner = new PedagogyDesignerAgent(this.context);

    console.log(chalk.yellow('🚀 Starting parallel development...\n'));

    // Execute both agents simultaneously
    const [segments, activities] = await Promise.all([
      contentDeveloper.execute(this.context.proposedStructure),
      pedagogyDesigner.execute(this.context.proposedStructure)
    ]);

    // Checkpoint: Review content and activities fit
    const approved = await this.reviewContentActivityFit(segments, activities);

    if (approved) {
      this.context.lecturePackage.segments = segments;
      this.context.lecturePackage.activities = activities;
      this.recordCheckpoint('phase3-development');
    } else {
      console.log(chalk.yellow('⚠️  Content/Activity alignment needs refinement'));
      // In production, would iterate here
    }
  }

  private async executePhase4(): Promise<void> {
    this.updatePhase(4);
    const visualDesigner = new VisualDesignerAgent(this.context);
    const slides = await visualDesigner.execute(this.context.lecturePackage.segments);

    const approved = await this.reviewVisuals(slides);

    if (approved) {
      this.context.lecturePackage.slides = slides;
      this.recordCheckpoint('phase4-visual');
    }
  }

  private async executePhase5(): Promise<LecturePackage> {
    this.updatePhase(5);
    const integrationAgent = new IntegrationAgent(this.context);
    const finalPackage = await integrationAgent.execute();

    const approved = await this.finalReview(finalPackage);

    if (approved) {
      this.recordCheckpoint('phase5-integration');
      this.context.lecturePackage = finalPackage;
    }

    return finalPackage;
  }

  private async reviewContentActivityFit(segments: any[], activities: any[]): Promise<boolean> {
    console.log(chalk.yellow('\n' + '═'.repeat(50)));
    console.log(chalk.yellow.bold('CHECKPOINT: Content/Activity Review'));
    console.log(chalk.yellow('═'.repeat(50)));

    console.log(chalk.white(`\nContent Segments: ${segments.length}`));
    console.log(chalk.white(`Activities Designed: ${activities.length}`));

    const { approved } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'approved',
        message: 'Do content and activities align well?',
        default: true
      }
    ]);

    return approved;
  }

  private async reviewVisuals(slides: any[]): Promise<boolean> {
    console.log(chalk.yellow('\n' + '═'.repeat(50)));
    console.log(chalk.yellow.bold('CHECKPOINT: Visual Design Review'));
    console.log(chalk.yellow('═'.repeat(50)));

    console.log(chalk.white(`\nTotal Slides: ${slides.length}`));
    console.log(chalk.white(`Average time per slide: ${Math.round(
      slides.reduce((sum, s) => sum + s.timing, 0) / slides.length
    )} seconds`));

    const { approved } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'approved',
        message: 'Approve visual design?',
        default: true
      }
    ]);

    return approved;
  }

  private async finalReview(pkg: LecturePackage): Promise<boolean> {
    console.log(chalk.yellow('\n' + '═'.repeat(50)));
    console.log(chalk.yellow.bold('FINAL CHECKPOINT: Package Review'));
    console.log(chalk.yellow('═'.repeat(50)));

    console.log(chalk.white('\nPackage Contents:'));
    console.log(`  ✓ Lecture Brief: ${pkg.brief.title}`);
    console.log(`  ✓ Learning Objectives: ${pkg.learningObjectives.length}`);
    console.log(`  ✓ Concept Nodes: ${pkg.conceptMap.length}`);
    console.log(`  ✓ Content Segments: ${pkg.segments.length}`);
    console.log(`  ✓ Activities: ${pkg.activities.length}`);
    console.log(`  ✓ Slides: ${pkg.slides.length}`);
    console.log(`  ✓ Instructor Guide: Generated`);
    console.log(`  ✓ Timing Checklist: ${pkg.timingChecklist.length} checkpoints`);

    const { approved } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'approved',
        message: 'Approve final package?',
        default: true
      }
    ]);

    return approved;
  }

  private updatePhase(phase: number): void {
    this.context.currentPhase = phase;
  }

  private recordCheckpoint(checkpoint: string): void {
    this.checkpoints.set(checkpoint, true);
    this.context.checkpointsPassed.push(checkpoint);
  }

  private displayBanner(): void {
    console.log(chalk.blue.bold('\n' + '═'.repeat(60)));
    console.log(chalk.blue.bold('   🎓 AUTOMATED LECTURE DEVELOPMENT SYSTEM'));
    console.log(chalk.blue.bold('   Multi-Agent Collaborative Platform'));
    console.log(chalk.blue.bold('═'.repeat(60) + '\n'));

    console.log(chalk.gray('Phases:'));
    console.log(chalk.gray('1. Intake → 2. Architecture → 3. Development'));
    console.log(chalk.gray('4. Visual Design → 5. Integration'));
    console.log(chalk.gray('\n' + '─'.repeat(60) + '\n'));
  }

  private displayCompletion(): void {
    console.log(chalk.green.bold('\n' + '═'.repeat(60)));
    console.log(chalk.green.bold('   ✅ LECTURE DEVELOPMENT COMPLETE!'));
    console.log(chalk.green.bold('═'.repeat(60) + '\n'));

    console.log(chalk.white('Checkpoints Passed:'));
    this.context.checkpointsPassed.forEach(cp => {
      console.log(chalk.green(`  ✓ ${cp}`));
    });

    console.log(chalk.cyan('\n📦 Your lecture package is ready for delivery!\n'));
  }
}