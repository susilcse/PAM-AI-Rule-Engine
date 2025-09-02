import OpenAI from "openai";
import { config as appConfig, validateConfig } from "./config";

// Validate configuration on import
validateConfig();

const client = new OpenAI({ apiKey: appConfig.openai.apiKey });

/**
 * Test OpenAI connection before main processing
 * Exact copy from project-m
 */
export async function testOpenAIConnection(): Promise<boolean> {
  console.log("🧪 Testing OpenAI API connection...");
  console.log("🔑 API Key present:", appConfig.openai.apiKey ? "YES" : "NO");
  console.log(
    "🔑 API Key preview:",
    appConfig.openai.apiKey
      ? appConfig.openai.apiKey.slice(0, 7) + "..."
      : "MISSING"
  );

  try {
    const testResp = await client.chat.completions.create({
      model: appConfig.openai.model,
      messages: [
        {
          role: "user",
          content:
            "Respond with exactly: 'OpenAI API working - timestamp: ' followed by the current time",
        },
      ],
    });

    console.log("✅ OpenAI Response Received!");
    console.log("   Model used:", testResp.model);
    console.log("   Response ID:", testResp.id);
    console.log("   Tokens used:", testResp.usage?.total_tokens);
    console.log("   Response:", testResp.choices[0].message.content);
    console.log(
      "   Created at:",
      new Date(testResp.created * 1000).toISOString()
    );
    return true;
  } catch (error: any) {
    console.error("❌ OpenAI API Test FAILED:");
    console.error("   Error type:", error.constructor.name);
    console.error("   Error message:", error.message);
    if (error.response) {
      console.error("   HTTP status:", error.response.status);
      console.error("   HTTP data:", error.response.data);
    }
    return false;
  }
}

/**
 * Check which organization this API key belongs to
 * Exact copy from project-m
 */
export async function checkOrg(): Promise<string | null> {
  console.log("🔍 Checking organization tied to API key...");
  try {
    // Make a simple API call to get headers (org info comes back in headers)
    const resp = await client.models.list();
    // Note: Organization info may not be available in headers for all API versions
    console.log("✅ Models list retrieved successfully");
    return null; // Simplified for now since header access is complex
  } catch (err: any) {
    console.error("❌ Could not fetch organization info:", err.message);
    return null;
  }
}

/**
 * Extract summary + rules from contract text
 * Exact copy from project-m
 */
export async function extractRules(text: string): Promise<any> {
  const system = `
You are a contract rules extractor that converts revenue sharing information into editable token-based rules.

SEARCH STRATEGY:
1. First look for "Exhibit D" or similar exhibits/appendices
2. Look for any tables with revenue sharing data
3. Search for content type classifications and percentage splits
4. Look for terms like: "Content Type", "Revenue Share", "Cost of Content", "Yahoo", "OneFootball"

TOKENIZATION RULES:
- Convert ALL revenue sharing rules into IF-THEN token sequences
- Break complex rules into multiple simple rules
- Use snake_case for variable names (content_type, yahoo_rev, onefootball_rev)
- Convert percentages to numbers without % symbol (100% becomes 100)
- Use logical keywords: "if", "and", "or", "then"
- Use operators: "==", "!=", ">", "<", ">=", "<=", "="

VARIABLE NAMING EXAMPLES:
- content_type (Yahoo Original, OneFootball Partner, etc.)
- media_type (Text, Video)
- yahoo_rev (revenue percentage for Yahoo)
- onefootball_rev (revenue percentage for OneFootball)
- cost_of_content (cost percentage)
- revenue_threshold (dollar amounts)

TOKEN TYPES:
- "keyword": if, and, or, then (editable: false)
- "variable": field names in snake_case (editable: true)
- "operator": ==, !=, >, <, >=, <=, = (editable: true)
- "value": actual values, numbers, text (editable: true)

Return JSON with this schema:
{
  "docType": "contract",
  "summary": "What revenue sharing information was found and where",
  "searchResults": {
    "exhibitDFound": true/false,
    "tablesFound": number,
    "revenueTermsFound": ["list of revenue-related terms found"]
  },
  "rules": [
    {
      "id": "rule_1",
      "name": "Rule 1",
      "source": "where this was found (e.g., 'Exhibit D', 'Section 5', etc.)",
      "tokens": [
        { "id": "1", "type": "keyword", "value": "if", "editable": false },
        { "id": "2", "type": "variable", "value": "content_type", "editable": true },
        { "id": "3", "type": "operator", "value": "==", "editable": true },
        { "id": "4", "type": "value", "value": "Yahoo Original", "editable": true },
        { "id": "5", "type": "keyword", "value": "and", "editable": false },
        { "id": "6", "type": "variable", "value": "media_type", "editable": true },
        { "id": "7", "type": "operator", "value": "==", "editable": true },
        { "id": "8", "type": "value", "value": "Text", "editable": true },
        { "id": "9", "type": "keyword", "value": "then", "editable": false },
        { "id": "10", "type": "variable", "value": "yahoo_rev", "editable": true },
        { "id": "11", "type": "operator", "value": "=", "editable": true },
        { "id": "12", "type": "value", "value": "100", "editable": true }
      ]
    }
  ]
}

IMPORTANT: 
- Each rule should be a simple IF-THEN statement
- Break complex conditions into multiple rules
- Generate unique sequential IDs for rules and tokens
- Extract ALL revenue sharing logic, including thresholds and special conditions`;

  const resp = await client.chat.completions.create({
    model: appConfig.openai.model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `Search this entire contract for ANY revenue sharing information. Look especially for Exhibit D, tables, content types, and percentage splits. Here's the full text:\n\n${text}`,
      },
    ],
  });

  console.log("🔍 OpenAI API Response metadata:");
  console.log(`   Model used: ${resp.model}`);
  console.log(`   Tokens used: ${resp.usage?.total_tokens || "unknown"}`);
  console.log(`   Response ID: ${resp.id}`);
  console.log(`   Created: ${new Date(resp.created * 1000).toISOString()}`);
  console.log(
    "📝 Raw OpenAI response preview:",
    resp.choices[0]?.message?.content?.slice(0, 200) + "..."
  );

  try {
    const content = resp.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    return JSON.parse(content);
  } catch (err) {
    console.error(
      "❌ Failed to parse JSON from OpenAI:",
      resp.choices[0]?.message?.content
    );
    throw err;
  }
}

/**
 * Apply an instruction to edit existing rules JSON
 * Exact copy from project-m
 */
export async function editRules(rules: any, instruction: string): Promise<any> {
  const system = `
You are a contract rule editor.
Update the given rules JSON according to the instruction.
Maintain the same schema structure.
Return the complete updated rules object with all existing rules plus modifications.`;

  const resp = await client.chat.completions.create({
    model: appConfig.openai.model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: "Current rules: " + JSON.stringify(rules, null, 2),
      },
      { role: "user", content: "Instruction: " + instruction },
    ],
  });

  try {
    const content = resp.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    return JSON.parse(content);
  } catch (err) {
    console.error(
      "❌ Failed to parse JSON from OpenAI:",
      resp.choices[0]?.message?.content
    );
    throw err;
  }
}
