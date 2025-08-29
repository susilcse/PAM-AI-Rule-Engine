"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Edit2,
  ArrowLeft,
  Bot,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Sparkles } from "lucide-react";

interface TokenRule {
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

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface TokenRuleEditorProps {
  onBack?: () => void;
  contractInfo?: {
    contractNumber: string;
    partnerName: string;
  };
}

export function TokenRuleEditor({
  onBack,
  contractInfo,
}: TokenRuleEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I can help you modify and create rules using natural language. Try saying something like 'Change the revenue share to 30%' or 'Add a new performance rule'.",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [rules, setRules] = useState<TokenRule[]>([
    {
      id: "revenue-share",
      name: "Revenue Share Rate",
      category: "financial",
      tokens: [
        { id: "1", type: "variable", value: "Revshare_rate", editable: true },
        { id: "2", type: "operator", value: "=", editable: true },
        { id: "3", type: "value", value: "60%", editable: true },
      ],
    },
    {
      id: "cost-sales",
      name: "Cost of Sales",
      category: "financial",
      tokens: [
        { id: "4", type: "variable", value: "cost_of_sales", editable: true },
        { id: "5", type: "operator", value: "=", editable: true },
        { id: "6", type: "value", value: "75%", editable: true },
      ],
    },
    {
      id: "traffic-quality",
      name: "Traffic Quality Bonus",
      category: "traffic-quality",
      tokens: [
        { id: "7", type: "keyword", value: "if", editable: false },
        { id: "8", type: "variable", value: "traffic_quality", editable: true },
        { id: "9", type: "operator", value: ">", editable: true },
        { id: "10", type: "value", value: "70%", editable: true },
        { id: "11", type: "keyword", value: "then", editable: false },
        { id: "12", type: "variable", value: "bonus", editable: true },
        { id: "13", type: "operator", value: "=", editable: true },
        { id: "14", type: "value", value: "1000 usd", editable: true },
      ],
    },
  ]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const updateToken = (ruleId: string, tokenId: string, newValue: string) => {
    setRules((rules) =>
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              tokens: rule.tokens.map((token) =>
                token.id === tokenId ? { ...token, value: newValue } : token
              ),
            }
          : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setRules((rules) => rules.filter((rule) => rule.id !== ruleId));
  };

  const copyRule = (ruleId: string) => {
    const ruleToCopy = rules.find((r) => r.id === ruleId);
    if (ruleToCopy) {
      const newRule: TokenRule = {
        ...ruleToCopy,
        id: `${ruleToCopy.id}-copy-${Date.now()}`,
        name: `${ruleToCopy.name} (Copy)`,
      };
      setRules((rules) => [...rules, newRule]);
    }
  };

  const addRule = () => {
    const newRule: TokenRule = {
      id: `rule-${Date.now()}`,
      name: "New Rule",
      category: "financial",
      tokens: [
        {
          id: `token-${Date.now()}-1`,
          type: "variable",
          value: "variable_name",
          editable: true,
        },
        {
          id: `token-${Date.now()}-2`,
          type: "operator",
          value: "=",
          editable: true,
        },
        {
          id: `token-${Date.now()}-3`,
          type: "value",
          value: "value",
          editable: true,
        },
      ],
    };
    setRules((rules) => [...rules, newRule]);
  };

  const getTokenColor = (type: string) => {
    switch (type) {
      case "variable":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "operator":
        return "bg-green-100 text-green-800 border-green-200";
      case "value":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "keyword":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "financial":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "traffic-quality":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const operatorOptions = ["=", ">", "<", ">=", "<=", "!="];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simple AI response simulation for rule editing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I understand you want to: "${chatInput}". I can help you modify the rules. For now, please use the visual token editor on the left. This AI integration will be enhanced soon!`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setChatInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full mx-auto px-4">
      {/* Full height layout: AI panel spans from header to bottom */}
      <div
        className={`${showChatPanel ? "grid grid-cols-[75%_25%] gap-6" : ""}`}
      >
        {/* Left side: Header + Rules (75% when AI open, 100% when closed) */}
        <div className={`${showChatPanel ? "min-w-0" : "w-full"}`}>
          {/* Header */}
          <div className="mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Edit Rules
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {contractInfo
                    ? `Modify rules for ${contractInfo.contractNumber} - ${contractInfo.partnerName}`
                    : "Modify contract rules using editable tokens"}
                </p>
              </div>
            </div>
          </div>

          {/* Rules Panel - Scrollable */}
          <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
            <Card className="border border-slate-200">
              <div className="p-4">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleExpanded}
                      className="p-0 h-auto"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      Contract Rules
                      <Edit2 className="h-4 w-4 text-slate-400" />
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {rules.length} rule{rules.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={showChatPanel ? "default" : "outline"}
                      size="sm"
                      className="gap-2"
                      onClick={() => setShowChatPanel(!showChatPanel)}
                    >
                      <Bot className="h-4 w-4" />
                      {showChatPanel ? "Hide AI Assistant" : "Edit with AI"}
                    </Button>
                  </div>
                </div>

                {/* Rules Content */}
                {isExpanded && (
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="border border-slate-100 rounded-lg p-4 bg-slate-50/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                              {rule.name}
                              <Edit2 className="h-3 w-3 text-slate-400" />
                            </h5>
                            <Badge
                              className={`text-xs ${getCategoryColor(
                                rule.category
                              )}`}
                            >
                              {rule.category === "financial"
                                ? "Financial"
                                : "Traffic Quality"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyRule(rule.id)}
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRule(rule.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Tokens */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {rule.tokens.map((token, index) => (
                            <div
                              key={token.id}
                              className="flex items-center gap-1"
                            >
                              {token.editable ? (
                                token.type === "operator" ? (
                                  <Select
                                    value={token.value}
                                    onValueChange={(value) =>
                                      updateToken(rule.id, token.id, value)
                                    }
                                  >
                                    <SelectTrigger
                                      className={`h-8 w-auto min-w-[60px] border ${getTokenColor(
                                        token.type
                                      )} font-mono text-sm`}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {operatorOptions.map((op) => (
                                        <SelectItem key={op} value={op}>
                                          {op}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <input
                                    type="text"
                                    value={token.value}
                                    onChange={(e) =>
                                      updateToken(
                                        rule.id,
                                        token.id,
                                        e.target.value
                                      )
                                    }
                                    className={`px-2 py-1 rounded border ${getTokenColor(
                                      token.type
                                    )} font-mono text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  />
                                )
                              ) : (
                                <span
                                  className={`px-2 py-1 rounded border ${getTokenColor(
                                    token.type
                                  )} font-mono text-sm`}
                                >
                                  {token.value}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* AI Chat Panel - Fixed to screen height, spans full height */}
        {showChatPanel && (
          <div className="min-w-0">
            <Card className="h-[calc(100vh-200px)] border border-slate-200 sticky top-0">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatPanel(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col h-full">
                <ScrollArea className="flex-1 p-4 h-[calc(100vh-350px)]">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id}>
                        <div
                          className={`flex gap-3 ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[85%] gap-3 ${
                              message.type === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
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
                              className={`rounded-lg px-3 py-2 ${
                                message.type === "user"
                                  ? "bg-blue-600 text-white"
                                  : message.type === "system"
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
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

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me to modify rules..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* No rules message - should be inside the main content area */}
      {!showChatPanel && rules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Edit2 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No rules
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Create your first rule to get started
          </p>
          <Button onClick={addRule} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
        </div>
      )}
    </div>
  );
}
