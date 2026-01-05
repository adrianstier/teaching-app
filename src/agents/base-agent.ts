import { AIService } from '../services/ai-service';
import { AgentContext, AgentMessage } from '../types';

export interface AgentCapability {
  name: string;
  description: string;
  execute: (input: any) => Promise<any>;
}

export interface AgentConfig {
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  capabilities?: AgentCapability[];
}

export abstract class BaseAgent {
  protected aiService: AIService;
  protected config: AgentConfig;
  protected context: AgentContext;
  protected conversationHistory: AgentMessage[] = [];

  constructor(config: AgentConfig, context: AgentContext) {
    this.aiService = new AIService();
    this.config = config;
    this.context = context;
    this.initializeConversation();
  }

  private initializeConversation(): void {
    this.conversationHistory.push({
      role: 'system',
      content: this.config.systemPrompt
    });
  }

  protected async think(prompt: string, options?: any): Promise<string> {
    this.conversationHistory.push({
      role: 'user',
      content: prompt
    });

    const response = await this.aiService.generateCompletion(
      this.conversationHistory,
      options
    );

    this.conversationHistory.push({
      role: 'assistant',
      content: response
    });

    return response;
  }

  protected async thinkStructured<T>(
    prompt: string,
    schema: any,
    options?: any
  ): Promise<T> {
    this.conversationHistory.push({
      role: 'user',
      content: prompt
    });

    const response = await this.aiService.generateStructuredOutput<T>(
      this.conversationHistory,
      schema,
      options
    );

    this.conversationHistory.push({
      role: 'assistant',
      content: JSON.stringify(response)
    });

    return response;
  }

  public getContext(): AgentContext {
    return this.context;
  }

  public updateContext(updates: Partial<AgentContext>): void {
    this.context = { ...this.context, ...updates };
  }

  public abstract execute(input: any): Promise<any>;

  public abstract validate(output: any): Promise<boolean>;

  public getName(): string {
    return this.config.name;
  }

  public getRole(): string {
    return this.config.role;
  }

  public getDescription(): string {
    return this.config.description;
  }

  public getConversationHistory(): AgentMessage[] {
    return this.conversationHistory;
  }

  public async checkpoint(message: string): Promise<boolean> {
    // This would involve human review in a real system
    console.log(`\n🔍 CHECKPOINT - ${this.config.name}: ${message}`);
    console.log('Automatic approval for development. In production, this would require human review.');
    return true;
  }
}