import OpenAI from "openai";
import { config as appConfig } from "./config";

// Create OpenAI client lazily to ensure config is loaded
function getOpenAIClient() {
  if (!appConfig.openai.apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required. Please add it to your .env.local file."
    );
  }
  return new OpenAI({ apiKey: appConfig.openai.apiKey });
}

export interface TokenRule {
  id: string;
  name: string;
  category: "financial" | "traffic-quality";
  tokens: Array<{
    id: string;
    type: "variable" | "operator" | "value" | "keyword";
    value: string;
    editable: boolean;
  }>;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface RuleModification {
  action: "update" | "create" | "delete" | "copy";
  ruleId?: string;
  newRule?: TokenRule;
  tokenUpdates?: Array<{
    ruleId: string;
    tokenId: string;
    newValue: string;
  }>;
}

/**
 * AI Chat Service for Rule Modifications
 * Understands natural language and converts it to token operations
 */
export class AIChatService {
  private rules: TokenRule[] = [];
  private contractContext: string = "";

  constructor(rules: TokenRule[], contractContext: string = "") {
    this.rules = rules;
    this.contractContext = contractContext;
  }

  /**
   * Process user message and return AI response with rule modifications
   */
  async processMessage(userMessage: string): Promise<{
    response: string;
    modifications: RuleModification[];
  }> {
    const systemPrompt = this.buildSystemPrompt();

    try {
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: appConfig.openai.model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const parsed = JSON.parse(content);
      return {
        response: parsed.response,
        modifications: parsed.modifications || [],
      };
    } catch (error) {
      console.error("AI Chat Service Error:", error);
      return {
        response:
          "I apologize, but I'm having trouble processing your request right now. Please try again or use the visual editor.",
        modifications: [],
      };
    }
  }

  /**
   * Build the system prompt for the AI
   */
  private buildSystemPrompt(): string {
    return `You are an AI assistant that helps users modify contract rules using natural language.

CURRENT RULES CONTEXT:
${JSON.stringify(this.rules, null, 2)}

CONTRACT CONTEXT:
${this.contractContext}

YOUR TASK:
1. Understand what the user wants to do with the rules
2. Provide a helpful response explaining what you'll do
3. Return specific modifications in JSON format

RULE MODIFICATION PATTERNS:

1. VALUE CHANGES:
   - "Change revenue share to 30%" → Update yahoo_rev or onefootball_rev token value
   - "Set traffic quality to 85%" → Update traffic_quality token value
   - "Make cost of sales 20%" → Update cost_of_sales token value

2. RULE CREATION:
   - "Add a new rule for video content" → Create new rule with video-specific tokens
   - "Create a performance bonus rule" → Create new rule with performance metrics

3. RULE DELETION:
   - "Remove the traffic quality rule" → Delete specific rule
   - "Delete rule 2" → Delete rule by ID

4. RULE COPYING:
   - "Copy the revenue share rule" → Duplicate existing rule with new ID

5. TOKEN MODIFICATIONS:
   - "Make all percentages editable" → Update editable property on percentage tokens
   - "Change operator from = to >=" → Update operator token value

RESPONSE FORMAT:
{
  "response": "I'll help you [explain what you're doing]. [Additional context or suggestions]",
  "modifications": [
    {
      "action": "update|create|delete|copy",
      "ruleId": "rule_id_if_applicable",
      "newRule": { /* new rule object if creating */ },
      "tokenUpdates": [
        {
          "ruleId": "rule_id",
          "tokenId": "token_id", 
          "newValue": "new_value"
        }
      ]
    }
  ]
}

EXAMPLES:

User: "Change revenue share to 25%"
Response: {
  "response": "I'll update the revenue share rate to 25%. This will modify the yahoo_rev token in your revenue sharing rule.",
  "modifications": [
    {
      "action": "update",
      "ruleId": "revenue-share",
      "tokenUpdates": [
        {
          "ruleId": "revenue-share",
          "tokenId": "3",
          "newValue": "25"
        }
      ]
    }
  ]
}

User: "Add a new rule for video content with 40% revenue share"
Response: {
  "response": "I'll create a new rule for video content with a 40% revenue share. This will be added to your rules list.",
  "modifications": [
    {
      "action": "create",
      "newRule": {
        "id": "video-revenue-${Date.now()}",
        "name": "Video Content Revenue Share",
        "category": "financial",
        "tokens": [
          {"id": "1", "type": "keyword", "value": "if", "editable": false},
          {"id": "2", "type": "variable", "value": "content_type", "editable": true},
          {"id": "3", "type": "operator", "value": "==", "editable": true},
          {"id": "4", "type": "value", "value": "Video", "editable": true},
          {"id": "5", "type": "keyword", "value": "then", "editable": false},
          {"id": "6", "type": "variable", "value": "revenue_share", "editable": true},
          {"id": "7", "type": "operator", "value": "=", "editable": true},
          {"id": "8", "type": "value", "value": "40", "editable": true}
        ]
      }
    }
  ]
}

IMPORTANT:
- Always be helpful and explain what you're doing
- Only make modifications that make sense
- If the request is unclear, ask for clarification
- Use the exact rule and token IDs from the current context
- For new rules, generate unique IDs using timestamp patterns
- Keep responses concise but informative`;
  }

  /**
   * Update the rules context (called when rules change)
   */
  updateRulesContext(rules: TokenRule[]): void {
    this.rules = rules;
  }

  /**
   * Update the contract context
   */
  updateContractContext(context: string): void {
    this.contractContext = context;
  }
}

/**
 * Helper function to create a new AI Chat Service instance
 */
export function createAIChatService(
  rules: TokenRule[],
  contractContext: string = ""
): AIChatService {
  return new AIChatService(rules, contractContext);
}
