/**
 * OpenRouter API client for AI resume content generation
 */

interface OpenRouterConfig {
  apiKey?: string;
  baseUrl: string;
  referrer: string;
  appTitle: string;
}

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
  model: string;
  created: number;
}

export class OpenRouterClient {
  private config: OpenRouterConfig;
  
  constructor(config: Partial<OpenRouterConfig> = {}) {
    this.config = {
      baseUrl: 'https://openrouter.ai/api/v1',
      referrer: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000',
      appTitle: 'AI Resume Builder',
      ...config
    };
  }
  
  /**
   * Generate content using OpenRouter API
   * @param prompt The user prompt
   * @param systemPrompt Optional system prompt to guide the model
   * @param model The model to use (default: gpt-3.5-turbo)
   * @returns The generated text
   */
  async generateContent(
    prompt: string,
    systemPrompt: string = 'You are a professional resume writer helping users create impressive resumes.',
    model: string = 'openai/gpt-3.5-turbo'
  ): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];
    
    const requestData: OpenRouterRequest = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    };
    
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': this.config.referrer,
          'X-Title': this.config.appTitle
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json() as OpenRouterResponse;
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }
  
  /**
   * Generate a resume summary
   * @param background Brief background information
   * @returns A professional summary for the resume
   */
  async generateSummary(background: string): Promise<string> {
    const prompt = `Write a professional resume summary (2-3 sentences) for someone with the following background: ${background}`;
    return this.generateContent(prompt);
  }
  
  /**
   * Generate job descriptions
   * @param jobInfo Information about the job position
   * @returns Bullet points for job responsibilities and achievements
   */
  async generateJobDescription(jobInfo: string): Promise<string> {
    const prompt = `Write 3-4 bullet points describing job responsibilities and achievements for this position: ${jobInfo}`;
    return this.generateContent(prompt);
  }
  
  /**
   * Generate a complete resume based on user background
   * @param background Comprehensive background information
   * @returns A structured resume in JSON format
   */
  async generateCompleteResume(background: string): Promise<string> {
    const prompt = `Create a professional resume based on the following background information. Format the response as JSON containing personalInfo (with firstName, lastName, email, phone, title, summary), education (array with institution, degree, fieldOfStudy, startDate, endDate, description), experience (array with company, position, startDate, endDate, description), skills (array with name), and projects (array with name, description, url, startDate, endDate). Background information: ${background}`;
    
    return this.generateContent(prompt);
  }
  
  /**
   * Set the API key
   * @param apiKey The OpenRouter API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }
}

// Create a singleton instance
export const openRouter = new OpenRouterClient();

export default openRouter;
