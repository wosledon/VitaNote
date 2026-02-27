export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
}

export class AIChatService {
  private apiKey: string;
  private endpoint: string;
  private model: string;

  constructor(apiKey: string, endpoint: string = 'https://api.openai.com/v1/chat/completions', model: string = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.model = model;
  }

  async sendMessage(messages: ChatMessage[], systemPrompt?: string): Promise<string> {
    const requestMessages = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages] 
      : messages;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: requestMessages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }

  async getHealthAssistantResponse(_userId: string, messages: ChatMessage[]): Promise<string> {
    const systemPrompt = `你是一个专业的糖尿病健康管理助手。请根据用户的数据提供个性化的健康建议。

健康建议原则：
1. 血糖控制目标：空腹 4.4-7.0 mmol/L，餐后 <10.0 mmol/L
2. 饮食建议：控制碳水摄入，选择低GI食物
3. 运动建议：每天适量运动，避免低血糖
4. 用药提醒：按时服药/注射，不要随意更改剂量

请以专业、亲切的语气提供回答。`;

    return this.sendMessage(messages, systemPrompt);
  }
}
