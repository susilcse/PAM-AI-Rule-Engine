/**
 * Configuration for contract analysis
 *
 * Make sure to create a .env.local file with:
 * OPENAI_API_KEY=your_openai_api_key_here
 */

export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
  },

  // File paths
  paths: {
    contractRulesDir: "./contract-rules",
    tempContractsDir: "./temp-contracts",
  },

  // File limits
  limits: {
    maxPdfSize: 50 * 1024 * 1024, // 50MB in bytes
  },
} as const;

// Validate required environment variables
export function validateConfig() {
  if (!config.openai.apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required. Please add it to your .env.local file."
    );
  }
}
