import { NextRequest, NextResponse } from "next/server";
import { loadContractRules } from "@/lib/file-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;

    if (!contractId) {
      return NextResponse.json(
        { error: "Contract ID is required" },
        { status: 400 }
      );
    }

    // Try to load original rules first
    const originalRules = loadContractRules(contractId, "original");

    if (!originalRules) {
      return NextResponse.json(
        {
          error: "Rules not found",
          message:
            "Contract has not been analyzed yet. Please upload and analyze the contract first.",
        },
        { status: 404 }
      );
    }

    // Try to load edited rules if they exist
    const editedRules = loadContractRules(contractId, "edited");

    return NextResponse.json({
      success: true,
      contractId,
      rules: {
        original: originalRules,
        edited: editedRules,
        current: editedRules || originalRules, // Return edited version if available, otherwise original
      },
      hasEdited: !!editedRules,
    });
  } catch (error: any) {
    console.error("❌ Failed to retrieve contract rules:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve rules",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
