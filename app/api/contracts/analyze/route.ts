import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import {
  testOpenAIConnection,
  checkOrg,
  extractRules,
} from "@/lib/openai-service";
import {
  saveContractRules,
  ensureDirectoryExists,
  cleanupTempFiles,
} from "@/lib/file-utils";
import { config as appConfig } from "@/lib/config";

// Disable Next.js body parsing to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log("📄 Starting contract analysis...");

    // Test OpenAI connection first (like project-m)
    console.log("🧪 Testing OpenAI connection...");
    const connectionWorking = await testOpenAIConnection();
    if (!connectionWorking) {
      console.log("❌ OpenAI connection failed. Please check:");
      console.log("   1. Your API key in .env.local file");
      console.log("   2. Your OpenAI account has credits");
      console.log("   3. You're checking the right OpenAI account");
      return NextResponse.json(
        {
          error:
            "OpenAI connection failed. Please check your API key and account.",
        },
        { status: 500 }
      );
    }

    // Check organization
    await checkOrg();

    // Clean up old temp files
    cleanupTempFiles(60); // Clean files older than 60 minutes

    // Parse the multipart form data
    const data = await request.formData();
    const file = data.get("contract") as File;
    const contractId = data.get("contractId") as string;

    if (!file || !contractId) {
      return NextResponse.json(
        { error: "Missing file or contract ID" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name?.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Create temp directory
    const tempDir = path.join(
      process.cwd(),
      appConfig.paths.tempContractsDir,
      "uploads"
    );
    ensureDirectoryExists(tempDir);

    // Save file temporarily
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    const tempFilePath = path.join(tempDir, `${contractId}-${timestamp}.pdf`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(tempFilePath, buffer);

    console.log("✅ Loaded PDF, size:", buffer.length);

    try {
      // Use pdf-parse with Next.js external configuration
      const pdfParse = require("pdf-parse");

      // Parse PDF (like project-m)
      const pdfData = await pdfParse(buffer);
      console.log("✅ PDF parsed, pages:", pdfData.numpages);

      // Search for Exhibit D in the text (like project-m)
      const exhibitDIndex = pdfData.text.toLowerCase().indexOf("exhibit d");
      if (exhibitDIndex !== -1) {
        console.log(`✅ Found "Exhibit D" at position ${exhibitDIndex}`);
        // Extract text around Exhibit D (2000 chars before and after)
        const start = Math.max(0, exhibitDIndex - 1000);
        const end = Math.min(pdfData.text.length, exhibitDIndex + 3000);
        const exhibitDSection = pdfData.text.slice(start, end);
        console.log(
          "📋 Exhibit D section preview:",
          exhibitDSection.slice(0, 500) + "..."
        );
      } else {
        console.log("❌ 'Exhibit D' not found in document");
        // Search for common table-related terms (like project-m)
        const searchTerms = [
          "content type",
          "revenue share",
          "cost of content",
          "yahoo",
          "onefootball",
        ];
        searchTerms.forEach((term) => {
          const index = pdfData.text.toLowerCase().indexOf(term);
          if (index !== -1) {
            console.log(`✅ Found "${term}" at position ${index}`);
          }
        });
      }

      // Extract rules with OpenAI
      console.log("📄 Extracting rules from contract...");
      const extract = await extractRules(pdfData.text);

      console.log("✅ Summary:", extract.summary);
      console.log(
        "✅ Search Results:",
        JSON.stringify(extract.searchResults, null, 2)
      );
      console.log(
        "✅ Revenue Sharing Rules:",
        JSON.stringify(extract.rules, null, 2)
      );

      // Save original extraction
      const savedPath = saveContractRules(contractId, extract, "");
      console.log(`💾 Results saved to: ${savedPath}`);

      // Clean up temp file
      fs.unlinkSync(tempFilePath);
      console.log("🧹 Cleaned up temporary PDF file");

      return NextResponse.json({
        success: true,
        contractId,
        rules: extract,
        savedPath,
        metadata: {
          pages: pdfData.numpages,
          textLength: pdfData.text.length,
          exhibitDFound: exhibitDIndex !== -1,
        },
      });
    } catch (pdfError) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw pdfError;
    }
  } catch (error: any) {
    console.error("❌ Contract analysis failed:", error);
    return NextResponse.json(
      {
        error: "Contract analysis failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
