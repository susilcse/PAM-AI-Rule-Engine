"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export function StandaloneChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm here to help you create and manage contract rules. You can describe what kind of rule you'd like to create in natural language, and I'll help you build it step by step. Try something like: 'Create a revenue sharing rule with 25% rate and 85% traffic quality threshold'",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simple AI response simulation
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I understand you want to work with: "${inputValue}". This chat feature is currently standalone. To create actual rules, please use the main contract and rule editor workflow.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          AI Rule Builder
        </CardTitle>
        <CardDescription>
          Describe your contract rule requirements in natural language
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 pb-6">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] gap-3 ${
                      message.type === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : message.type === "system"
                          ? "bg-green-600 text-white"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-4 w-4" />
                      ) : message.type === "system" ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : message.type === "system"
                          ? "bg-green-600 text-white"
                          : "bg-white border text-slate-900 dark:bg-slate-800 dark:text-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          message.type === "user"
                            ? "text-blue-100"
                            : message.type === "system"
                            ? "text-green-100"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Describe the rule you want to create..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setInputValue(
                "Create a revenue sharing rule with 25% rate and 85% traffic quality"
              )
            }
            className="text-xs"
          >
            Revenue Rule Example
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setInputValue(
                "Set up performance metrics with minimum 10,000 views and fixed fee"
              )
            }
            className="text-xs"
          >
            Performance Rule Example
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setInputValue(
                "Create quality thresholds for organic traffic at 60%"
              )
            }
            className="text-xs"
          >
            Quality Rule Example
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
