// AI Service - OpenAI GPT-4 Integration

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-30219bc58d0c41ad-x8gv9t-83b19c4e',
  baseURL: process.env.OPENAI_BASE_URL || 'http://43.156.177.86:20128/v1',
});

export interface AIAnalysisInput {
  from: string;
  to: string;
  value: string;
  data: string;
  gasUsed?: string;
  stateChanges?: any;
}

export interface AIAnalysisResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedThreats: string[];
  explanation: string;
  recommendation: 'APPROVE' | 'WARN' | 'REJECT';
  confidence: number;
}

export class AIService {
  /**
   * Analyze transaction with GPT-4
   */
  static async analyzeTransaction(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    // If no API key, return mock analysis
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return this.mockAnalysis(input);
    }

    try {
      const prompt = `Analyze this blockchain transaction for security threats:

From: ${input.from}
To: ${input.to}
Value: ${input.value} wei
Data: ${input.data}
${input.gasUsed ? `Gas Used: ${input.gasUsed}` : ''}
${input.stateChanges ? `State Changes: ${JSON.stringify(input.stateChanges)}` : ''}

Provide a JSON response with:
{
  "riskScore": number (0-100),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "detectedThreats": string[] (array of threat types),
  "explanation": string (detailed explanation),
  "recommendation": "APPROVE" | "WARN" | "REJECT",
  "confidence": number (0-100)
}

Consider:
- Contract interactions vs simple transfers
- Known malicious patterns
- Unusual gas usage
- State changes that could drain funds
- Approval mechanisms
- Reentrancy risks`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a blockchain security expert analyzing transactions for threats. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as AIAnalysisResult;
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to mock analysis
      return this.mockAnalysis(input);
    }
  }

  /**
   * Mock analysis for testing without API key
   */
  private static mockAnalysis(input: AIAnalysisInput): AIAnalysisResult {
    // Simple heuristic-based analysis
    const isContract = input.data && input.data !== '0x';
    const hasValue = BigInt(input.value) > BigInt(0);

    let riskScore = 10;
    let detectedThreats: string[] = [];
    let explanation = '';

    if (isContract) {
      riskScore += 20;
      detectedThreats.push('CONTRACT_INTERACTION');
      explanation = 'Transaction interacts with a smart contract. ';
    }

    if (hasValue && isContract) {
      riskScore += 15;
      explanation += 'Sending value to a contract. ';
    }

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (riskScore >= 80) riskLevel = 'CRITICAL';
    else if (riskScore >= 60) riskLevel = 'HIGH';
    else if (riskScore >= 40) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';

    // Recommendation
    let recommendation: 'APPROVE' | 'WARN' | 'REJECT';
    if (riskScore >= 80) recommendation = 'REJECT';
    else if (riskScore >= 40) recommendation = 'WARN';
    else recommendation = 'APPROVE';

    if (!explanation) {
      explanation = '✅ LOW RISK. No significant threats detected. Transaction appears safe.';
    }

    return {
      riskScore,
      riskLevel,
      detectedThreats,
      explanation: explanation.trim(),
      recommendation,
      confidence: 75,
    };
  }

  /**
   * Batch analyze multiple transactions
   */
  static async analyzeTransactions(inputs: AIAnalysisInput[]): Promise<AIAnalysisResult[]> {
    return Promise.all(inputs.map((input) => this.analyzeTransaction(input)));
  }
}
