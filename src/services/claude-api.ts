import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import logger from '../utils/logger';

// Load environment variables before creating singleton, with override to ensure .env takes precedence
dotenv.config({ override: true });

class ClaudeAPIService {
  private client: Anthropic;
  private model: string;
  private temperature: number;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    this.client = new Anthropic({
      apiKey: apiKey,
    });

    this.model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    this.temperature = parseFloat(process.env.TEMPERATURE || '0.7');

    logger.info(`Claude API Service initialized with model: ${this.model}`);
  }

  async generateText(prompt: string, systemPrompt?: string, maxTokens: number = 4096): Promise<string> {
    try {
      logger.info('[ClaudeAPI] Generating text with Claude...');

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        logger.info('[ClaudeAPI] Successfully generated text');
        return content.text;
      }

      throw new Error('Unexpected response format from Claude API');
    } catch (error) {
      logger.error('[ClaudeAPI] Error generating text:', error);
      throw error;
    }
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string, maxTokens: number = 4096): Promise<T> {
    try {
      logger.info('[ClaudeAPI] Generating JSON with Claude...');

      const enhancedPrompt = `${prompt}\n\nIMPORTANT: Your response must be valid JSON only. Do not include any markdown formatting, code blocks, or explanatory text. Return only the raw JSON object.`;

      const text = await this.generateText(enhancedPrompt, systemPrompt, maxTokens);

      // Clean up any potential markdown code blocks
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const parsed = JSON.parse(cleanedText);
      logger.info('[ClaudeAPI] Successfully generated and parsed JSON');
      return parsed as T;
    } catch (error) {
      logger.error('[ClaudeAPI] Error generating JSON:', error);
      throw error;
    }
  }

  async chat(messages: Array<{ role: 'user' | 'assistant'; content: string }>, systemPrompt?: string, maxTokens: number = 4096): Promise<string> {
    try {
      logger.info('[ClaudeAPI] Starting chat conversation...');

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: messages,
      });

      const content = response.content[0];
      if (content.type === 'text') {
        logger.info('[ClaudeAPI] Chat response received');
        return content.text;
      }

      throw new Error('Unexpected response format from Claude API');
    } catch (error) {
      logger.error('[ClaudeAPI] Error in chat:', error);
      throw error;
    }
  }

  getModel(): string {
    return this.model;
  }

  getTemperature(): number {
    return this.temperature;
  }
}

// Export singleton instance
export const claudeAPI = new ClaudeAPIService();
export default claudeAPI;
