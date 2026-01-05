import { BaseAgent } from './base-agent';
import { AgentContext, LecturePackage } from '../types';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export class IntegrationAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Integration Specialist',
        role: 'Package Assembly & Quality Assurance',
        description: 'Assembles complete lecture packages and generates supporting documents',
        systemPrompt: `You are an expert in instructional package assembly and quality assurance with expertise in:
        - Document integration and formatting
        - Quality control and consistency checking
        - Instructor guide development
        - Timeline and checklist creation
        - Material organization and packaging

        Your role is to:
        1. Assemble all components into a cohesive lecture package
        2. Generate comprehensive instructor guides
        3. Create timing checklists and run sheets
        4. Ensure consistency across all materials
        5. Package materials for easy delivery

        Focus on:
        - Completeness and accuracy
        - Clear organization and navigation
        - Practical usability for instructors
        - Alignment with original objectives
        - Professional presentation`
      },
      context
    );
  }

  async execute(input?: any): Promise<LecturePackage> {
    console.log(chalk.magenta.bold('\n═══════════════════════════════════════════'));
    console.log(chalk.magenta.bold('  PHASE 5: INTEGRATION & PACKAGING'));
    console.log(chalk.magenta.bold('═══════════════════════════════════════════\n'));

    // Verify all components are present
    console.log(chalk.cyan('🔍 Verifying components...'));
    this.verifyComponents();

    // Generate instructor guide
    console.log(chalk.cyan('\n📘 Generating instructor guide...'));
    const instructorGuide = await this.generateInstructorGuide();

    // Create timing checklist
    console.log(chalk.cyan('\n⏱️  Creating timing checklist...'));
    const timingChecklist = await this.createTimingChecklist();

    // Assemble complete package
    console.log(chalk.cyan('\n📦 Assembling complete package...'));
    const lecturePackage = this.assemblePackage(instructorGuide, timingChecklist);

    // Generate export files
    console.log(chalk.cyan('\n💾 Generating export files...'));
    await this.exportPackage(lecturePackage);

    console.log(chalk.magenta.bold('\n✅ Integration complete! Lecture package ready.\n'));

    return lecturePackage;
  }

  private verifyComponents(): void {
    const missing: string[] = [];

    if (!this.context.lecturePackage.brief) missing.push('Lecture Brief');
    if (!this.context.lecturePackage.learningObjectives) missing.push('Learning Objectives');
    if (!this.context.lecturePackage.conceptMap) missing.push('Concept Map');
    if (!this.context.lecturePackage.segments) missing.push('Content Segments');
    if (!this.context.lecturePackage.activities) missing.push('Activities');
    if (!this.context.lecturePackage.slides) missing.push('Slide Specifications');

    if (missing.length > 0) {
      console.log(chalk.yellow(`⚠️  Missing components: ${missing.join(', ')}`));
      console.log(chalk.yellow('Proceeding with available components...'));
    } else {
      console.log(chalk.green('✓ All components verified'));
    }
  }

  private async generateInstructorGuide(): Promise<string> {
    const brief = this.context.lecturePackage.brief;
    const objectives = this.context.lecturePackage.learningObjectives || [];
    const segments = this.context.lecturePackage.segments || [];
    const activities = this.context.lecturePackage.activities || [];

    const prompt = `Generate a comprehensive instructor guide for this lecture:

Title: ${brief?.title}
Duration: ${brief?.duration} minutes
Topic: ${brief?.topic}

Learning Objectives:
${objectives.map((o: any) => `- ${o.objective}`).join('\n')}

Segments:
${segments.map((s: any) => `- ${s.title} (${s.duration} min)`).join('\n')}

Activities:
${activities.map((a: any) => `- ${a.name} (${a.type})`).join('\n')}

Create a detailed guide that includes:
1. Pre-lecture preparation checklist
2. Materials and technology needed
3. Segment-by-segment teaching notes
4. Activity facilitation tips
5. Common questions and answers
6. Troubleshooting guide
7. Assessment strategies
8. Follow-up resources

Format as a clear, practical document an instructor can use during delivery.`;

    const guide = await this.think(prompt);
    return guide;
  }

  private async createTimingChecklist(): Promise<any[]> {
    const segments = this.context.lecturePackage.segments || [];
    const activities = this.context.lecturePackage.activities || [];
    const duration = this.context.lecturePackage.brief?.duration || 50;

    const prompt = `Create a detailed timing checklist for this ${duration}-minute lecture:

Segments:
${segments.map((s: any) => `- ${s.title} (${s.duration} min, ${s.type})`).join('\n')}

Activities:
${activities.map((a: any) => `- ${a.name} (${a.duration} min)`).join('\n')}

Generate a minute-by-minute runsheet that includes:
1. Specific times (e.g., "0:00", "5:00", "10:00")
2. Actions to take at each time
3. Materials needed for each segment
4. Transition cues
5. Buffer time for questions

Return as an array of timing checkpoint objects with: time, action, and materials.`;

    const checklistData = await this.think(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(checklistData);

    return parsed.checklist || parsed.timing || parsed;
  }

  private assemblePackage(instructorGuide: string, timingChecklist: any[]): LecturePackage {
    const now = new Date();

    return {
      brief: this.context.lecturePackage.brief!,
      learningObjectives: this.context.lecturePackage.learningObjectives || [],
      conceptMap: this.context.lecturePackage.conceptMap || [],
      segments: this.context.lecturePackage.segments || [],
      activities: this.context.lecturePackage.activities || [],
      slides: this.context.lecturePackage.slides || [],
      instructorGuide,
      timingChecklist,
      metadata: {
        createdAt: now,
        version: '1.0.0',
        lastModified: now,
        approvalStatus: 'final'
      }
    };
  }

  private async exportPackage(lecturePackage: LecturePackage): Promise<void> {
    // Create output directory
    const outputDir = path.join(process.cwd(), 'output', `lecture-${Date.now()}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Export main package as JSON
    fs.writeFileSync(
      path.join(outputDir, 'lecture-package.json'),
      JSON.stringify(lecturePackage, null, 2)
    );
    console.log(chalk.green(`  ✓ Exported: lecture-package.json`));

    // Export instructor guide as markdown
    fs.writeFileSync(
      path.join(outputDir, 'instructor-guide.md'),
      this.formatInstructorGuide(lecturePackage)
    );
    console.log(chalk.green(`  ✓ Exported: instructor-guide.md`));

    // Export slides as markdown
    fs.writeFileSync(
      path.join(outputDir, 'slides.md'),
      this.formatSlides(lecturePackage)
    );
    console.log(chalk.green(`  ✓ Exported: slides.md`));

    // Export timing checklist as CSV
    fs.writeFileSync(
      path.join(outputDir, 'timing-checklist.csv'),
      this.formatTimingCSV(lecturePackage)
    );
    console.log(chalk.green(`  ✓ Exported: timing-checklist.csv`));

    console.log(chalk.cyan(`\n📁 All files exported to: ${outputDir}`));
  }

  private formatInstructorGuide(pkg: LecturePackage): string {
    let markdown = `# Instructor Guide: ${pkg.brief.title}\n\n`;
    markdown += `## Overview\n`;
    markdown += `- **Duration**: ${pkg.brief.duration} minutes\n`;
    markdown += `- **Topic**: ${pkg.brief.topic}\n`;
    markdown += `- **Level**: ${pkg.brief.audienceLevel}\n\n`;

    markdown += `## Learning Objectives\n`;
    pkg.learningObjectives.forEach((obj, i) => {
      markdown += `${i + 1}. ${obj.objective}\n`;
    });

    markdown += `\n## Detailed Guide\n\n`;
    markdown += pkg.instructorGuide;

    return markdown;
  }

  private formatSlides(pkg: LecturePackage): string {
    let markdown = `# Slide Specifications\n\n`;

    pkg.slides.forEach(slide => {
      markdown += `## Slide ${slide.slideNumber}: ${slide.title}\n`;
      markdown += `**Layout**: ${slide.layout}\n`;
      markdown += `**Duration**: ${slide.timing} seconds\n\n`;

      if (slide.content.mainText) {
        markdown += `### Main Content\n${slide.content.mainText}\n\n`;
      }

      if (slide.content.bulletPoints && slide.content.bulletPoints.length > 0) {
        markdown += `### Bullet Points\n`;
        slide.content.bulletPoints.forEach(point => {
          markdown += `- ${point}\n`;
        });
        markdown += '\n';
      }

      markdown += `### Speaker Notes\n${slide.speakerNotes}\n\n`;
      markdown += '---\n\n';
    });

    return markdown;
  }

  private formatTimingCSV(pkg: LecturePackage): string {
    let csv = 'Time,Action,Materials\n';

    pkg.timingChecklist.forEach(item => {
      const materials = item.materials?.join('; ') || 'None';
      csv += `"${item.time}","${item.action}","${materials}"\n`;
    });

    return csv;
  }

  async validate(output: any): Promise<boolean> {
    try {
      // Basic validation that we have a complete package
      return !!(
        output.brief &&
        output.learningObjectives &&
        output.instructorGuide &&
        output.metadata
      );
    } catch (error) {
      console.error('Package validation failed:', error);
      return false;
    }
  }
}