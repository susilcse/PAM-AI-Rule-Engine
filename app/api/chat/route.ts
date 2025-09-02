import { NextRequest, NextResponse } from "next/server";
import { createAIChatService } from "@/lib/ai-chat-service";

export async function POST(request: NextRequest) {
  try {
    const { message, rules, contractContext } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!rules || !Array.isArray(rules)) {
      return NextResponse.json(
        { error: "Rules array is required" },
        { status: 400 }
      );
    }

    // Create AI chat service with the provided rules and context
    const chatService = createAIChatService(rules, contractContext || "");
    const result = await chatService.processMessage(message);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("❌ Chat API failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
