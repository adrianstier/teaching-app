import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  protected anthropic: Anthropic | null = null;
  protected model: string;
  protected temperature: number;
  protected useMock: boolean;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    this.useMock = process.env.USE_MOCK_AI === 'true' || !apiKey;

    if (!apiKey && !this.useMock) {
      console.warn('⚠️  ANTHROPIC_API_KEY not found. Using mock mode.');
      this.useMock = true;
    }

    if (apiKey && !this.useMock) {
      try {
        this.anthropic = new Anthropic({ apiKey });
      } catch (error) {
        console.error('Failed to initialize Anthropic client:', error);
        console.warn('Falling back to mock mode.');
        this.useMock = true;
      }
    }

    this.model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    this.temperature = parseFloat(process.env.TEMPERATURE || '0.7');

    if (this.useMock) {
      console.log('🤖 Running in MOCK mode - no API calls will be made');
    } else {
      console.log(`🤖 AI Service initialized with model: ${this.model}`);
    }
  }

  async generateCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'text' | 'json';
    }
  ): Promise<string> {
    if (this.useMock || !this.anthropic) {
      // Return mock response for testing
      return this.generateMockCompletion(messages, options);
    }

    try {
      // Extract system message and convert to Anthropic format
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const conversationMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

      // Add JSON instruction to system message if needed
      let finalSystem = systemMessage;
      if (options?.responseFormat === 'json') {
        finalSystem += '\n\nIMPORTANT: You must respond with valid JSON only. No markdown formatting, no code blocks, just raw JSON.';
      }

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: options?.maxTokens || 4096,
        system: finalSystem,
        messages: conversationMessages,
      });

      // Extract text from response
      const textContent = response.content.find(c => c.type === 'text');
      return textContent?.text || '';
    } catch (error: any) {
      console.error('Error generating completion:', error);

      // Handle specific Anthropic errors
      if (error?.status === 401) {
        throw new Error('Invalid API key. Please check your ANTHROPIC_API_KEY.');
      } else if (error?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error?.status === 500) {
        throw new Error('Anthropic service error. Please try again.');
      }

      throw new Error(`AI Service error: ${error?.message || 'Unknown error'}`);
    }
  }

  async generateStructuredOutput<T>(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    schema: any,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<T> {
    const systemMessage = {
      role: 'system' as const,
      content: `${messages[0].content}\n\nYou must respond with valid JSON that matches this schema:\n${JSON.stringify(schema, null, 2)}`
    };

    const updatedMessages = [systemMessage, ...messages.slice(1)];

    const response = await this.generateCompletion(updatedMessages, {
      ...options,
      responseFormat: 'json'
    });

    try {
      return JSON.parse(response) as T;
    } catch (error) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('Failed to parse structured output from AI');
    }
  }

  private generateMockCompletion(messages: any[], options?: any): string {
    // Generate contextual mock responses
    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    if (options?.responseFormat === 'json') {
      if (lastMessage.includes('objective')) {
        return JSON.stringify({
          objectives: [
            { objective: "Understand core concepts", bloomLevel: "understand", measurable: true },
            { objective: "Apply techniques", bloomLevel: "apply", measurable: true }
          ]
        });
      }
      if (lastMessage.includes('concept')) {
        return JSON.stringify({
          concepts: [
            { id: "1", name: "Introduction", description: "Basic concepts", complexity: "basic", estimatedTime: 10 }
          ]
        });
      }
      return JSON.stringify({ result: "Mock structured response" });
    }

    return `Mock response for: "${lastMessage.substring(0, 50)}..."`;
  }
}