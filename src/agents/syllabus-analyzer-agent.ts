import { BaseAgent } from './base-agent';
import { AgentContext } from '../types';
import {
  SyllabusAnalysis,
  SyllabusAnalysisSchema,
  ConceptMap,
  WorkloadAnalysis,
  WeekPlan
} from '../types/extended-types';
import logger from '../utils/logger';

export class SyllabusAnalyzerAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(
      {
        name: 'Syllabus Analyzer',
        role: 'Course Design Specialist',
        description: 'Analyzes syllabi to create concept maps, detect workload issues, and suggest optimizations',
        systemPrompt: `You are an expert in course design, curriculum mapping, and educational scaffolding.

        Your role is to:
        1. Parse syllabus content and extract structure
        2. Build concept dependency maps
        3. Analyze student workload across weeks
        4. Identify coverage gaps in learning outcomes
        5. Suggest optimizations for better learning progression

        Key Principles:
        - Scaffolding: Prerequisites should come before dependent concepts
        - Distributed Practice: Important concepts should be revisited
        - Balanced Workload: Avoid overloading specific weeks
        - Alignment: Content should map to stated learning outcomes
        - Spacing: Challenging concepts need adequate time and review

        When analyzing:
        - Identify explicit and implicit prerequisites
        - Estimate cognitive load and time requirements
        - Flag concepts taught before their prerequisites
        - Detect weeks with excessive workload
        - Find outcomes with insufficient coverage

        Be specific and actionable in recommendations.`
      },
      context
    );
  }

  async execute(syllabusContent: string): Promise<SyllabusAnalysis> {
    logger.info('Analyzing syllabus structure and workload');

    try {
      // Step 1: Parse syllabus content
      const parsedData = await this.parseSyllabus(syllabusContent);

      // Step 2: Build concept map
      const conceptMap = await this.buildConceptMap(parsedData);

      // Step 3: Analyze workload
      const workloadAnalysis = await this.analyzeWorkload(parsedData);

      // Step 4: Calculate overall score
      const overallScore = this.calculateOverallScore(conceptMap, workloadAnalysis);

      // Step 5: Generate improvement priorities
      const improvementPriority = this.prioritizeImprovements(
        conceptMap,
        workloadAnalysis
      );

      const analysis: SyllabusAnalysis = {
        rawContent: syllabusContent,
        parsedData,
        conceptMap,
        workloadAnalysis,
        overallScore,
        improvementPriority
      };

      logger.info(`Syllabus analysis complete. Score: ${overallScore}/100`);
      return analysis;

    } catch (error) {
      logger.error('Syllabus analysis failed', error);
      throw error;
    }
  }

  private async parseSyllabus(content: string): Promise<any> {
    const prompt = `Parse this syllabus and extract structured information:

${content.substring(0, 8000)}

Extract:
1. Course title and term
2. Instructor name (if present)
3. All stated learning outcomes/objectives
4. Weekly schedule with:
   - Week number
   - Topics covered
   - Readings assigned
   - Assignments/assessments with due dates
   - Estimated student hours for each component

Return as JSON:
{
  "courseTitle": "string",
  "term": "string",
  "instructor": "string or null",
  "learningOutcomes": ["outcome 1", "outcome 2", ...],
  "weeklySchedule": [
    {
      "weekNumber": 1,
      "topics": ["topic 1", "topic 2"],
      "readings": ["reading 1"],
      "assignments": [
        {
          "title": "Assignment 1",
          "dueDate": "Week 2",
          "estimatedHours": 4
        }
      ],
      "estimatedStudentHours": 10
    }
  ]
}`;

    const response = await this.think(prompt, { responseFormat: 'json' });
    return JSON.parse(response);
  }

  private async buildConceptMap(parsedData: any): Promise<ConceptMap> {
    const topics = parsedData.weeklySchedule
      .flatMap((week: any) => week.topics)
      .filter((t: string) => t && t.length > 0);

    const prompt = `Build a concept dependency map for this course.

Course: ${parsedData.courseTitle}
Topics covered: ${topics.join(', ')}

For each major concept:
1. Identify its prerequisites (what must be learned first)
2. Classify complexity (basic, intermediate, advanced)
3. Determine dependencies (what it enables learning)

Return as JSON:
{
  "nodes": [
    {
      "id": "concept-1",
      "concept": "Concept name",
      "week": 1,
      "complexity": "basic" | "intermediate" | "advanced"
    }
  ],
  "edges": [
    {
      "from": "prerequisite-concept-id",
      "to": "dependent-concept-id",
      "strength": "required" | "recommended" | "related"
    }
  ]
}

Identify ordering issues where concepts are taught before their prerequisites.`;

    const response = await this.think(prompt, { responseFormat: 'json' });
    return JSON.parse(response);
  }

  private async analyzeWorkload(parsedData: any): Promise<WorkloadAnalysis> {
    const prompt = `Analyze the student workload for this course.

Course: ${parsedData.courseTitle}
Weekly Schedule:
${JSON.stringify(parsedData.weeklySchedule, null, 2)}

Learning Outcomes:
${parsedData.learningOutcomes.join('\n')}

For each week, calculate:
1. Number of new topics introduced
2. Assignment hours required
3. Reading pages/hours
4. Total cognitive load (weighted score considering complexity and quantity)
5. Workload status: light (<8hrs), moderate (8-12hrs), heavy (12-18hrs), overloaded (>18hrs)

Identify gaps:
1. Learning outcomes with no corresponding content
2. Weeks where prerequisites aren't met
3. Topics with insufficient practice time

Generate recommendations:
1. Weeks to split or merge
2. Topics to reorder for better scaffolding
3. Content to add for outcome coverage
4. Workload reductions needed

Return as JSON:
{
  "weeklyBreakdown": [
    {
      "week": 1,
      "topics": 3,
      "assignmentHours": 4,
      "readingPages": 50,
      "totalLoad": 12,
      "status": "moderate"
    }
  ],
  "gaps": [
    {
      "outcomeId": "outcome-1",
      "description": "No content for outcome X",
      "severity": "critical"
    }
  ],
  "recommendations": [
    {
      "type": "reorder",
      "description": "Move topic X before topic Y",
      "affectedWeeks": [3, 5]
    }
  ]
}`;

    const response = await this.think(prompt, { responseFormat: 'json' });
    return JSON.parse(response);
  }

  private calculateOverallScore(
    conceptMap: ConceptMap,
    workload: WorkloadAnalysis
  ): number {
    let score = 100;

    // Deduct for ordering issues
    const orderingIssues = conceptMap.edges.filter(edge => {
      const fromNode = conceptMap.nodes.find(n => n.id === edge.from);
      const toNode = conceptMap.nodes.find(n => n.id === edge.to);
      return fromNode && toNode && fromNode.week > toNode.week && edge.strength === 'required';
    });

    score -= orderingIssues.length * 10;

    // Deduct for workload issues
    const overloadedWeeks = workload.weeklyBreakdown.filter(
      w => w.status === 'overloaded'
    ).length;
    score -= overloadedWeeks * 15;

    // Deduct for critical gaps
    const criticalGaps = workload.gaps.filter(g => g.severity === 'critical').length;
    score -= criticalGaps * 20;

    // Deduct for moderate gaps
    const moderateGaps = workload.gaps.filter(g => g.severity === 'moderate').length;
    score -= moderateGaps * 10;

    return Math.max(0, Math.min(100, score));
  }

  private prioritizeImprovements(
    conceptMap: ConceptMap,
    workload: WorkloadAnalysis
  ): string[] {
    const priorities: string[] = [];

    // Critical gaps first
    const criticalGaps = workload.gaps.filter(g => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      priorities.push(
        `CRITICAL: Address ${criticalGaps.length} learning outcome gap(s)`
      );
    }

    // Ordering issues
    const orderingIssues = conceptMap.edges.filter(edge => {
      const fromNode = conceptMap.nodes.find(n => n.id === edge.from);
      const toNode = conceptMap.nodes.find(n => n.id === edge.to);
      return fromNode && toNode && fromNode.week > toNode.week && edge.strength === 'required';
    });

    if (orderingIssues.length > 0) {
      priorities.push(
        `HIGH: Fix ${orderingIssues.length} concept ordering issue(s)`
      );
    }

    // Overloaded weeks
    const overloaded = workload.weeklyBreakdown.filter(
      w => w.status === 'overloaded'
    );
    if (overloaded.length > 0) {
      priorities.push(
        `HIGH: Reduce workload in week(s) ${overloaded.map(w => w.week).join(', ')}`
      );
    }

    // Moderate issues
    const moderateGaps = workload.gaps.filter(g => g.severity === 'moderate');
    if (moderateGaps.length > 0) {
      priorities.push(
        `MEDIUM: Address ${moderateGaps.length} coverage gap(s)`
      );
    }

    // General recommendations
    const reorderRecs = workload.recommendations.filter(r => r.type === 'reorder');
    if (reorderRecs.length > 0) {
      priorities.push(
        `MEDIUM: Consider ${reorderRecs.length} reordering suggestion(s)`
      );
    }

    if (priorities.length === 0) {
      priorities.push('EXCELLENT: Syllabus is well-structured!');
    }

    return priorities;
  }

  async generateOptimizedSyllabus(
    analysis: SyllabusAnalysis
  ): Promise<{
    optimizedSchedule: WeekPlan[];
    changes: string[];
    rationale: string;
  }> {
    const prompt = `Generate an optimized weekly schedule based on this syllabus analysis.

Original Schedule:
${JSON.stringify(analysis.parsedData.weeklySchedule, null, 2)}

Issues Found:
${analysis.improvementPriority.join('\n')}

Workload Analysis:
${JSON.stringify(analysis.workloadAnalysis.weeklyBreakdown, null, 2)}

Recommendations:
${JSON.stringify(analysis.workloadAnalysis.recommendations, null, 2)}

Create an improved weekly schedule that:
1. Fixes concept ordering (prerequisites before dependents)
2. Balances workload across weeks
3. Ensures all learning outcomes are covered
4. Adds distributed practice for important concepts
5. Maintains the same total content

Return as JSON:
{
  "optimizedSchedule": [
    {
      "weekNumber": 1,
      "topics": ["topic 1", "topic 2"],
      "readings": ["reading 1"],
      "assignments": [...],
      "estimatedStudentHours": 10
    }
  ],
  "changes": ["Change 1: Moved topic X from week 3 to week 5", ...],
  "rationale": "Detailed explanation of optimization strategy"
}`;

    const response = await this.think(prompt, { responseFormat: 'json' });
    return JSON.parse(response);
  }

  async suggestScaffoldingActivities(
    conceptMap: ConceptMap,
    difficultConcept: string
  ): Promise<string[]> {
    const concept = conceptMap.nodes.find(n => n.concept === difficultConcept);
    if (!concept) {
      return [];
    }

    const prerequisites = conceptMap.edges
      .filter(e => e.to === concept.id)
      .map(e => conceptMap.nodes.find(n => n.id === e.from)?.concept)
      .filter(Boolean);

    const prompt = `Suggest scaffolding activities to help students master this concept.

Concept: ${difficultConcept}
Complexity: ${concept.complexity}
Prerequisites: ${prerequisites.join(', ')}

Suggest 3-5 activities that:
1. Review/reinforce prerequisites
2. Bridge to the new concept
3. Provide practice opportunities
4. Build from simple to complex

Return as JSON array of activity descriptions:
["Activity 1", "Activity 2", ...]`;

    const response = await this.think(prompt, { responseFormat: 'json' });
    return JSON.parse(response);
  }

  async validate(output: any): Promise<boolean> {
    try {
      SyllabusAnalysisSchema.parse(output);
      return true;
    } catch (error) {
      logger.error('Syllabus analysis validation failed', error);
      return false;
    }
  }
}