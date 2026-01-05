import { AIService } from './ai-service';
import { LectureBrief, LearningObjective, ConceptNode, LectureSegment, Activity, SlideSpecification } from '../types';

export class MockAIService extends AIService {
  constructor() {
    // Initialize without requiring API key
    super();
  }

  async generateCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: any
  ): Promise<string> {
    // Simulate AI response with deterministic mock data
    await this.simulateDelay();

    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    if (lastMessage.includes('learning objective')) {
      return JSON.stringify({
        objectives: [
          {
            objective: "Explain the fundamental concepts of machine learning",
            bloomLevel: "understand",
            measurable: true,
            assessmentStrategy: "Concept mapping exercise"
          },
          {
            objective: "Apply supervised learning algorithms to simple datasets",
            bloomLevel: "apply",
            measurable: true,
            assessmentStrategy: "Hands-on coding exercise"
          },
          {
            objective: "Analyze the differences between classification and regression",
            bloomLevel: "analyze",
            measurable: true,
            assessmentStrategy: "Comparative analysis task"
          }
        ]
      });
    }

    if (lastMessage.includes('concept map')) {
      return JSON.stringify({
        concepts: [
          {
            id: "concept-1",
            name: "Machine Learning Basics",
            description: "Introduction to ML concepts and terminology",
            prerequisites: [],
            relatedConcepts: ["concept-2"],
            complexity: "basic",
            estimatedTime: 10
          },
          {
            id: "concept-2",
            name: "Supervised Learning",
            description: "Learning from labeled data",
            prerequisites: ["concept-1"],
            relatedConcepts: ["concept-3"],
            complexity: "intermediate",
            estimatedTime: 15
          },
          {
            id: "concept-3",
            name: "Model Evaluation",
            description: "Metrics and validation techniques",
            prerequisites: ["concept-2"],
            relatedConcepts: [],
            complexity: "intermediate",
            estimatedTime: 10
          }
        ]
      });
    }

    if (lastMessage.includes('lecture structure')) {
      return JSON.stringify({
        segments: [
          {
            title: "Introduction & Overview",
            duration: 5,
            type: "introduction",
            description: "Welcome and learning objectives"
          },
          {
            title: "Core Concepts",
            duration: 20,
            type: "content",
            description: "Main content delivery"
          },
          {
            title: "Interactive Exercise",
            duration: 10,
            type: "activity",
            description: "Hands-on practice"
          },
          {
            title: "Summary & Q&A",
            duration: 10,
            type: "summary",
            description: "Recap and questions"
          }
        ]
      });
    }

    // Default response
    return "Mock AI response for: " + lastMessage.substring(0, 50);
  }

  async generateStructuredOutput<T>(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    schema: any,
    options?: any
  ): Promise<T> {
    const response = await this.generateCompletion(messages, options);
    try {
      return JSON.parse(response) as T;
    } catch {
      // Return mock structured data based on schema
      return this.generateMockData(schema) as T;
    }
  }

  private async simulateDelay(): Promise<void> {
    // Simulate network delay
    const delay = Math.random() * 500 + 200; // 200-700ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateMockData(schema: any): any {
    // Generate mock data based on schema structure
    const mockBrief: LectureBrief = {
      title: "Introduction to Machine Learning",
      duration: 50,
      topic: "Machine Learning Fundamentals",
      audienceLevel: "beginner",
      prerequisites: ["Basic programming", "Statistics basics"],
      mainGoals: [
        "Understand ML concepts",
        "Identify ML problems",
        "Know key algorithms"
      ],
      constraints: ["No advanced math required"],
      preferredStyle: "Interactive with examples",
      specialRequirements: ["Include real-world examples"]
    };

    const mockObjectives: LearningObjective[] = [
      {
        id: "obj-1",
        objective: "Define machine learning and its applications",
        bloomLevel: "remember",
        measurable: true,
        assessmentStrategy: "Quiz questions"
      }
    ];

    const mockSegments: LectureSegment[] = [
      {
        id: "seg-1",
        title: "Introduction",
        duration: 5,
        type: "introduction",
        content: "Welcome to Machine Learning",
        speakerNotes: "Start with enthusiasm",
        visualElements: ["Title slide"],
        activities: []
      }
    ];

    const mockActivities: Activity[] = [
      {
        id: "act-1",
        name: "ML Concept Discussion",
        type: "think-pair-share",
        duration: 5,
        instructions: "Discuss ML applications you use daily",
        materials: [],
        expectedOutcomes: ["Awareness of ML in daily life"],
        facilitation: "Guide discussion towards practical examples"
      }
    ];

    const mockSlides: SlideSpecification[] = [
      {
        slideNumber: 1,
        title: "Welcome",
        layout: "title",
        content: {
          mainText: "Introduction to Machine Learning",
          bulletPoints: ["What is ML?", "Why it matters", "Course overview"]
        },
        speakerNotes: "Welcome students warmly",
        timing: 60
      }
    ];

    // Return appropriate mock data based on context
    if (schema === 'LectureBrief') return mockBrief;
    if (schema === 'LearningObjective') return mockObjectives;
    if (schema === 'LectureSegment') return mockSegments;
    if (schema === 'Activity') return mockActivities;
    if (schema === 'SlideSpecification') return mockSlides;

    // Default: return first mock that matches
    return mockBrief;
  }
}

// Factory function to create appropriate service
export function createAIService(): AIService {
  const useMock = process.env.USE_MOCK_AI === 'true' || !process.env.OPENAI_API_KEY;

  if (useMock) {
    console.log('🤖 Using Mock AI Service (no OpenAI API key required)');
    return new MockAIService();
  }

  return new AIService();
}