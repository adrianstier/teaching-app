import logger from '../utils/logger';
import claudeAPI from '../services/claude-api';
import {
  FormativeAssessmentDashboard,
  LivePoll,
  MisconceptionTracker,
  ExitTicket
} from '../types/pedagogical-features';

export interface LivePollInput {
  topic: string;
  concept: string;
  type: 'multiple-choice' | 'numeric' | 'word-cloud' | 'short-answer' | 'confidence-weighted';
  targetMisconception?: string;
  bloomLevel?: string;
}

export interface ExitTicketInput {
  lectureId: string;
  topic: string;
  keyConceptsCovered: string[];
  includeTypes: ('muddy-point' | 'main-takeaway' | 'question' | 'confidence' | 'application')[];
}

export interface MisconceptionTrackingInput {
  topic: string;
  discipline: string;
  concepts: string[];
}

export interface AnalyzeResponsesInput {
  exitTicket: ExitTicket;
}

/**
 * FormativeAssessmentAgent
 *
 * Implements real-time formative assessment and feedback based on
 * research by Black & Wiliam (1998) and Hattie & Timperley (2007).
 *
 * Key features:
 * - Live polling with misconception detection
 * - Exit ticket generation and analysis
 * - Real-time difficulty adjustment
 * - Confusion alerts and intervention suggestions
 */
export class FormativeAssessmentAgent {
  name = 'FormativeAssessmentAgent';
  description = 'Generate and analyze formative assessments for real-time learning feedback';

  /**
   * Generate a live poll question for real-time assessment
   */
  async generateLivePoll(input: LivePollInput): Promise<LivePoll> {
    logger.info(`[${this.name}] Generating ${input.type} poll for: ${input.concept}`);

    const systemPrompt = `You are an expert in formative assessment and real-time classroom polling. You create poll questions that:
1. Reveal student understanding and misconceptions
2. Promote productive discussion
3. Target specific learning objectives
4. Use distractors based on common errors

Research basis: Black & Wiliam (1998) on formative assessment, Mazur's peer instruction`;

    const prompt = `Create a ${input.type} poll question for assessing understanding of:

Topic: ${input.topic}
Concept: ${input.concept}
${input.targetMisconception ? `Target Misconception: ${input.targetMisconception}` : ''}
${input.bloomLevel ? `Bloom's Level: ${input.bloomLevel}` : ''}

Requirements:
- For multiple-choice: Include 4 options with distractors based on common misconceptions
- For confidence-weighted: Add a confidence scale (1-5)
- Question should reveal understanding, not just recall
- Include explanation for correct answer

Return JSON:
{
  "id": "<unique-id>",
  "type": "${input.type}",
  "question": "<the poll question>",
  "options": ${input.type === 'multiple-choice' || input.type === 'confidence-weighted' ? '["<option A>", "<option B>", "<option C>", "<option D>"]' : 'null'},
  "correctAnswer": "<correct answer or null for open-ended>",
  "responses": [],
  "status": "draft"
}`;

    try {
      const result = await claudeAPI.generateJSON<LivePoll>(prompt, systemPrompt, 2048);
      logger.info(`[${this.name}] Generated poll: ${result.question.substring(0, 50)}...`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating poll:`, error);
      return this.getFallbackPoll(input);
    }
  }

  /**
   * Generate an exit ticket for end-of-class reflection
   */
  async generateExitTicket(input: ExitTicketInput): Promise<ExitTicket> {
    logger.info(`[${this.name}] Generating exit ticket for: ${input.topic}`);

    const systemPrompt = `You are an expert in formative assessment, specializing in exit tickets and minute papers. You create quick reflection prompts that:
1. Capture student understanding in 2-3 minutes
2. Identify confusion points for next-class addressing
3. Promote metacognitive reflection
4. Provide actionable data for instructors

Types of exit ticket questions:
- Muddy point: What was confusing?
- Main takeaway: What's the most important thing you learned?
- Question: What question do you still have?
- Confidence: How confident are you in applying this?
- Application: How might you use this?`;

    const prompt = `Create an exit ticket for this lecture:

Lecture ID: ${input.lectureId}
Topic: ${input.topic}
Key Concepts Covered: ${JSON.stringify(input.keyConceptsCovered)}
Include Question Types: ${JSON.stringify(input.includeTypes)}

Generate 3-5 questions total, keeping it brief (students should complete in 2-3 minutes).

Return JSON:
{
  "id": "<unique-id>",
  "lectureId": "${input.lectureId}",
  "date": "${new Date().toISOString().split('T')[0]}",
  "questions": [
    {
      "id": "<question-id>",
      "type": "muddy-point" | "main-takeaway" | "question" | "confidence" | "application",
      "prompt": "<the question>",
      "required": true | false
    }
  ],
  "responses": []
}`;

    try {
      const result = await claudeAPI.generateJSON<ExitTicket>(prompt, systemPrompt, 2048);
      logger.info(`[${this.name}] Generated exit ticket with ${result.questions.length} questions`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating exit ticket:`, error);
      return this.getFallbackExitTicket(input);
    }
  }

  /**
   * Generate a misconception tracker for a topic
   */
  async generateMisconceptionTracker(input: MisconceptionTrackingInput): Promise<MisconceptionTracker[]> {
    logger.info(`[${this.name}] Generating misconception tracker for: ${input.topic}`);

    const systemPrompt = `You are an expert in student misconceptions and conceptual change. You help instructors identify and address common misunderstandings based on discipline-specific research.

Your knowledge includes:
- Research-documented misconceptions in various fields
- Diagnostic questions that reveal specific misunderstandings
- Effective corrective explanations
- Common wrong answers and what they indicate`;

    const prompt = `Create a misconception tracker for:

Topic: ${input.topic}
Discipline: ${input.discipline}
Concepts: ${JSON.stringify(input.concepts)}

For each concept, identify:
1. 2-3 common misconceptions from research/experience
2. Diagnostic questions that reveal each misconception
3. Corrective explanations
4. Related wrong answers to watch for

Return JSON array:
[
  {
    "conceptId": "<concept-id>",
    "conceptName": "<concept name>",
    "knownMisconceptions": [
      {
        "id": "<misconception-id>",
        "description": "<what students mistakenly believe>",
        "frequency": 0.0-1.0,
        "correctiveExplanation": "<how to address this>",
        "diagnosticQuestion": "<question that reveals this misconception>",
        "relatedWrongAnswers": ["<wrong answer 1>", "<wrong answer 2>"]
      }
    ],
    "detectedInSession": []
  }
]`;

    try {
      const result = await claudeAPI.generateJSON<MisconceptionTracker[]>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Generated trackers for ${result.length} concepts`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error generating misconception tracker:`, error);
      return this.getFallbackMisconceptionTracker(input);
    }
  }

  /**
   * Analyze exit ticket responses and generate insights
   */
  async analyzeResponses(input: AnalyzeResponsesInput): Promise<ExitTicket['analysis']> {
    logger.info(`[${this.name}] Analyzing ${input.exitTicket.responses.length} exit ticket responses`);

    if (input.exitTicket.responses.length === 0) {
      return {
        responseRate: 0,
        sentimentScore: 0,
        topConfusions: [],
        topTakeaways: [],
        questionsToAddress: [],
        comprehensionEstimate: 0,
        recommendedActions: ['No responses to analyze yet']
      };
    }

    const systemPrompt = `You are an expert in analyzing student feedback and formative assessment data. You identify patterns in student responses to help instructors improve teaching.

Your analysis includes:
- Sentiment analysis of student comments
- Theme extraction from open-ended responses
- Prioritization of issues to address
- Actionable recommendations`;

    const prompt = `Analyze these exit ticket responses:

Questions:
${JSON.stringify(input.exitTicket.questions, null, 2)}

Responses:
${JSON.stringify(input.exitTicket.responses, null, 2)}

Provide analysis including:
1. Response rate and overall sentiment
2. Top confusion themes (clustered similar responses)
3. Main takeaways students identified
4. Questions that need addressing next class
5. Estimated class comprehension level
6. Recommended instructor actions

Return JSON:
{
  "responseRate": <0-100>,
  "sentimentScore": <-1 to 1>,
  "topConfusions": [
    {
      "theme": "<confusion category>",
      "count": <number>,
      "sampleResponses": ["<response 1>", "<response 2>"]
    }
  ],
  "topTakeaways": ["<takeaway 1>", "<takeaway 2>"],
  "questionsToAddress": ["<question 1>", "<question 2>"],
  "comprehensionEstimate": <0-100>,
  "recommendedActions": ["<action 1>", "<action 2>"]
}`;

    try {
      const result = await claudeAPI.generateJSON<ExitTicket['analysis']>(prompt, systemPrompt, 4096);
      logger.info(`[${this.name}] Analysis complete: ${result?.comprehensionEstimate}% comprehension estimated`);
      return result;
    } catch (error) {
      logger.error(`[${this.name}] Error analyzing responses:`, error);
      return {
        responseRate: (input.exitTicket.responses.length / 30) * 100, // Assume 30 students
        sentimentScore: 0,
        topConfusions: [],
        topTakeaways: [],
        questionsToAddress: [],
        comprehensionEstimate: 70,
        recommendedActions: ['Review responses manually for detailed analysis']
      };
    }
  }

  /**
   * Suggest real-time difficulty adjustment based on poll results
   */
  suggestDifficultyAdjustment(pollResults: { correct: number; incorrect: number }): {
    currentLevel: number;
    recommendedAdjustment: 'easier' | 'maintain' | 'harder';
    reason: string;
  } {
    const total = pollResults.correct + pollResults.incorrect;
    if (total === 0) {
      return {
        currentLevel: 3,
        recommendedAdjustment: 'maintain',
        reason: 'No responses yet'
      };
    }

    const correctRate = pollResults.correct / total;

    if (correctRate < 0.4) {
      return {
        currentLevel: 4,
        recommendedAdjustment: 'easier',
        reason: `Only ${Math.round(correctRate * 100)}% correct - consider re-explaining the concept or providing more scaffolding`
      };
    } else if (correctRate > 0.85) {
      return {
        currentLevel: 2,
        recommendedAdjustment: 'harder',
        reason: `${Math.round(correctRate * 100)}% correct - students are ready for more challenge`
      };
    } else {
      return {
        currentLevel: 3,
        recommendedAdjustment: 'maintain',
        reason: `${Math.round(correctRate * 100)}% correct - good balance of challenge`
      };
    }
  }

  private getFallbackPoll(input: LivePollInput): LivePoll {
    return {
      id: `poll-${Date.now()}`,
      type: input.type,
      question: `What is your understanding of ${input.concept}?`,
      options: input.type === 'multiple-choice' ? [
        'I understand it completely',
        'I understand most of it',
        'I am somewhat confused',
        'I am very confused'
      ] : undefined,
      correctAnswer: undefined,
      responses: [],
      status: 'draft'
    };
  }

  private getFallbackExitTicket(input: ExitTicketInput): ExitTicket {
    return {
      id: `exit-${Date.now()}`,
      lectureId: input.lectureId,
      date: new Date().toISOString().split('T')[0],
      questions: [
        {
          id: 'q1',
          type: 'muddy-point',
          prompt: 'What was the most confusing part of today\'s lecture?',
          required: true
        },
        {
          id: 'q2',
          type: 'main-takeaway',
          prompt: 'What is the most important thing you learned today?',
          required: true
        },
        {
          id: 'q3',
          type: 'question',
          prompt: 'What question do you still have?',
          required: false
        }
      ],
      responses: []
    };
  }

  private getFallbackMisconceptionTracker(input: MisconceptionTrackingInput): MisconceptionTracker[] {
    return input.concepts.map((concept, idx) => ({
      conceptId: `concept-${idx}`,
      conceptName: concept,
      knownMisconceptions: [{
        id: `misc-${idx}-1`,
        description: `Common misunderstanding about ${concept}`,
        frequency: 0.3,
        correctiveExplanation: `The correct understanding of ${concept} is...`,
        diagnosticQuestion: `Which of the following best describes ${concept}?`,
        relatedWrongAnswers: ['Typical wrong answer 1', 'Typical wrong answer 2']
      }],
      detectedInSession: []
    }));
  }
}
