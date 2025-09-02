import fs from "fs";
import path from "path";
import { config as appConfig } from "./config";

/**
 * Ensure directory exists, create if it doesn't
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generate timestamped filename like project-m
 */
export function generateTimestampedFilename(
  prefix: string,
  suffix: string = ""
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${prefix}-${timestamp}${suffix}`;
}

/**
 * Save results to contract-specific directory with timestamped filename
 */
export function saveContractRules(
  contractId: string,
  data: any,
  suffix: string = ""
): string {
  const contractDir = path.join(appConfig.paths.contractRulesDir, contractId);
  ensureDirectoryExists(contractDir);

  const filename = suffix
    ? `contract-rules-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19)}${suffix}.json`
    : "original.json";

  const filePath = path.join(contractDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return filePath;
}

/**
 * Load contract rules if they exist
 */
export function loadContractRules(
  contractId: string,
  type: "original" | "edited" = "original"
): any | null {
  const contractDir = path.join(appConfig.paths.contractRulesDir, contractId);
  const filename = type === "original" ? "original.json" : "edited.json";
  const filePath = path.join(contractDir, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading contract rules: ${error}`);
    return null;
  }
}

/**
 * Clean up temporary files older than specified minutes
 */
export function cleanupTempFiles(maxAgeMinutes: number = 60): void {
  const tempDir = appConfig.paths.tempContractsDir;
  if (!fs.existsSync(tempDir)) return;

  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds

  try {
    const files = fs.readdirSync(tempDir, { withFileTypes: true });

    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(tempDir, file.name);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtime.getTime();

        if (age > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up temp file: ${file.name}`);
        }
      }
    });
  } catch (error) {
    console.error(`Error cleaning up temp files: ${error}`);
  }
}
