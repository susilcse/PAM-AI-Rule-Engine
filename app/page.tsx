"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Send, Bot, User, FileText, Settings, Plus, Search, Filter, Sparkles } from "lucide-react"
import { ContractForm } from "@/components/contract-form"
import { ContractDetails } from "@/components/contract-details"
import { RuleForm } from "@/components/rule-form"
import { RuleDetails } from "@/components/rule-details"
import { AIRuleBuilder } from "@/components/ai-rule-builder"
import { TokenRuleEditor } from "@/components/token-rule-editor"

interface Message {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  ruleGenerated?: boolean
}

interface Contract {
  id: string
  contractNumber: string
  partnerName: string
  product: string
  market: string
  status: "active" | "draft" | "pending" | "expired"
  startDate: string
  endDate: string
  description: string
  customFields: Array<{
    name: string
    value: string
  }>
}

interface Rule {
  id: string
  contractId: string
  name: string
  description: string
  category: string
  priority: string
  active: boolean
  fields: Array<{
    id: string
    name: string
    type: "text" | "number" | "percentage" | "currency"
    value: string
    editable: boolean
    required: boolean
    validation?: { min: number; max: number }
  }>
  createdAt: Date
  updatedAt?: Date
}

export default function RuleEngineApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm here to help you create and manage contract rules. You can describe what kind of rule you'd like to create in natural language, and I'll help you build it step by step. Try something like: 'Create a revenue sharing rule with 25% rate and 85% traffic quality threshold'",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "contracts" | "rules">("chat")
  const [showContractForm, setShowContractForm] = useState(false)
  const [showContractDetails, setShowContractDetails] = useState<string | null>(null)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [showRuleDetails, setShowRuleDetails] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [ruleSearchTerm, setRuleSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [pendingRuleGeneration, setPendingRuleGeneration] = useState<string | null>(null)

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: "1",
      contractNumber: "CTR-2024-001",
      partnerName: "TechCorp Solutions",
      product: "Software License",
      market: "North America",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: "Enterprise software licensing agreement with revenue sharing model",
      customFields: [
        { name: "Account Manager", value: "John Smith" },
        { name: "Renewal Date", value: "2024-12-31" },
      ],
    },
    {
      id: "2",
      contractNumber: "CTR-2024-002",
      partnerName: "Global Media Inc",
      product: "Content Distribution",
      market: "Europe",
      status: "draft",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      description: "Content distribution partnership for European markets",
      customFields: [
        { name: "Content Type", value: "Video Streaming" },
        { name: "Territory", value: "EU + UK" },
      ],
    },
    {
      id: "3",
      contractNumber: "CTR-2024-003",
      partnerName: "DataFlow Systems",
      product: "API Integration",
      market: "Asia Pacific",
      status: "pending",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      description: "API integration services with performance-based pricing",
      customFields: [],
    },
  ])

  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      contractId: "1",
      name: "Traffic Quality Rule",
      description: "Defines traffic quality thresholds and revenue sharing for high-performance campaigns",
      category: "quality",
      priority: "high",
      active: true,
      fields: [
        {
          id: "field-1",
          name: "Traffic Quality",
          type: "percentage",
          value: "85",
          editable: true,
          required: true,
          validation: { min: 0, max: 100 },
        },
        {
          id: "field-2",
          name: "Organic Traffic",
          type: "percentage",
          value: "60",
          editable: true,
          required: true,
          validation: { min: 0, max: 100 },
        },
        {
          id: "field-3",
          name: "Revenue Share Rate",
          type: "percentage",
          value: "25",
          editable: true,
          required: true,
          validation: { min: 0, max: 50 },
        },
      ],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      contractId: "2",
      name: "Content Performance Rule",
      description: "Performance metrics and revenue calculations for content distribution",
      category: "performance",
      priority: "medium",
      active: true,
      fields: [
        {
          id: "field-4",
          name: "Minimum Views",
          type: "number",
          value: "10000",
          editable: true,
          required: true,
          validation: { min: 1000, max: 1000000 },
        },
        {
          id: "field-5",
          name: "Fixed Fee",
          type: "currency",
          value: "5000",
          editable: false,
          required: true,
        },
        {
          id: "field-6",
          name: "Cost of Sale",
          type: "percentage",
          value: "15",
          editable: true,
          required: false,
          validation: { min: 0, max: 30 },
        },
      ],
      createdAt: new Date("2024-02-01"),
    },
  ])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    const isRuleRequest =
      inputValue.toLowerCase().includes("rule") ||
      inputValue.toLowerCase().includes("create") ||
      inputValue.toLowerCase().includes("revenue") ||
      inputValue.toLowerCase().includes("quality") ||
      inputValue.toLowerCase().includes("performance")

    if (isRuleRequest) {
      // Add system message for rule generation
      setTimeout(() => {
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "system",
          content: "I'll help you create that rule. Let me analyze your requirements...",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, systemMessage])

        // Set pending rule generation
        setPendingRuleGeneration(inputValue)
      }, 500)

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          content: `Perfect! I've analyzed your request: "${inputValue}". I've generated a rule based on your requirements. Please review the AI-generated rule below and select which contract to apply it to.`,
          timestamp: new Date(),
          ruleGenerated: true,
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 2000)
    } else {
      // Regular conversation
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `I understand you want to work with: "${inputValue}". To create a rule, try describing what you need. For example: "Create a revenue sharing rule with 25% rate" or "Set up quality thresholds for traffic". Which contract would you like to work with?`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }

    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSaveContract = (contractData: any) => {
    if (editingContract) {
      setContracts((prev) => prev.map((c) => (c.id === contractData.id ? contractData : c)))
    } else {
      setContracts((prev) => [...prev, contractData])
    }
    setEditingContract(null)
  }

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract)
    setShowContractForm(true)
    setShowContractDetails(null)
  }

  const handleDeleteContract = (contractId: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== contractId))
    setRules((prev) => prev.filter((r) => r.contractId !== contractId))
    setShowContractDetails(null)
  }

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(ruleSearchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(ruleSearchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || rule.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleSaveRule = (ruleData: any) => {
    if (editingRule) {
      setRules((prev) => prev.map((r) => (r.id === ruleData.id ? ruleData : r)))
    } else {
      setRules((prev) => [...prev, ruleData])
    }
    setEditingRule(null)
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setShowRuleForm(true)
    setShowRuleDetails(null)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId))
    setShowRuleDetails(null)
  }

  const handleUpdateRuleValues = (updatedRule: Rule) => {
    setRules((prev) => prev.map((r) => (r.id === updatedRule.id ? updatedRule : r)))
  }

  const handleAIRuleCreated = (newRule: Rule) => {
    setRules((prev) => [...prev, newRule])
    setPendingRuleGeneration(null)

    // Add success message
    const successMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: `Great! I've successfully created the rule "${newRule.name}" for ${contracts.find((c) => c.id === newRule.contractId)?.partnerName}. You can view and edit it in the Rules tab, or ask me to create another rule.`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, successMessage])
  }

  const handleSelectContract = (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId)
    if (contract) {
      setActiveTab("contracts")
      setShowContractDetails(contractId)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "revenue":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "quality":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "performance":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "compliance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Rule Engine</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Contract Administration Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("chat")}
                className="gap-2"
              >
                <Bot className="h-4 w-4" />
                Chat
              </Button>
              <Button
                variant={activeTab === "contracts" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("contracts")}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Contracts ({contracts.length})
              </Button>
              <Button
                variant={activeTab === "rules" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("rules")}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Rules ({rules.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {activeTab === "chat" && (
          <div className="mx-auto max-w-4xl">
            <Card className="h-[600px] shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  AI Rule Builder
                </CardTitle>
                <CardDescription>Describe your contract rule requirements in natural language</CardDescription>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4 pb-6">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id}>
                        <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
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
                              <p className="text-sm leading-relaxed">{message.content}</p>
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

                        {message.ruleGenerated && pendingRuleGeneration && (
                          <div className="mt-4">
                            <AIRuleBuilder
                              contracts={contracts}
                              onCreateRule={handleAIRuleCreated}
                              onSelectContract={handleSelectContract}
                            />
                          </div>
                        )}
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
                    onClick={() => setInputValue("Create a revenue sharing rule with 25% rate and 85% traffic quality")}
                    className="text-xs"
                  >
                    Revenue Rule Example
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue("Set up performance metrics with minimum 10,000 views and fixed fee")}
                    className="text-xs"
                  >
                    Performance Rule Example
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue("Create quality thresholds for organic traffic at 60%")}
                    className="text-xs"
                  >
                    Quality Rule Example
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contracts</h2>
                <p className="text-slate-600 dark:text-slate-400">Manage partner contracts and amendments</p>
              </div>
              <Button
                className="gap-2"
                onClick={() => {
                  setEditingContract(null)
                  setShowContractForm(true)
                }}
              >
                <Plus className="h-4 w-4" />
                New Contract
              </Button>
            </div>

            <div className="mb-6 flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContracts.map((contract) => {
                const contractRules = rules.filter((r) => r.contractId === contract.id)
                return (
                  <Card key={contract.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{contract.contractNumber}</CardTitle>
                        <Badge
                          variant={
                            contract.status === "active"
                              ? "default"
                              : contract.status === "draft"
                                ? "secondary"
                                : contract.status === "pending"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {contract.status}
                        </Badge>
                      </div>
                      <CardDescription>{contract.partnerName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Product:</span>
                          <span className="font-medium">{contract.product}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Market:</span>
                          <span className="font-medium">{contract.market}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Rules:</span>
                          <Badge variant="outline" className="text-xs">
                            {contractRules.length} rule{contractRules.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                        {contract.endDate && (
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">End Date:</span>
                            <span className="font-medium">{new Date(contract.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setShowContractDetails(contract.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleEditContract(contract)}
                        >
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredContracts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No contracts found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first contract to get started"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button onClick={() => setShowContractForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Contract
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "rules" && <TokenRuleEditor />}
      </div>

      {showContractForm && (
        <ContractForm
          contract={editingContract}
          onClose={() => {
            setShowContractForm(false)
            setEditingContract(null)
          }}
          onSave={handleSaveContract}
        />
      )}

      {showContractDetails && (
        <ContractDetails
          contract={contracts.find((c) => c.id === showContractDetails)!}
          rules={rules}
          onClose={() => setShowContractDetails(null)}
          onEdit={() => {
            const contract = contracts.find((c) => c.id === showContractDetails)!
            handleEditContract(contract)
          }}
          onDelete={() => handleDeleteContract(showContractDetails)}
          onCreateRule={() => {
            setShowContractDetails(null)
            setActiveTab("chat")
          }}
        />
      )}

      {showRuleForm && (
        <RuleForm
          rule={editingRule}
          contracts={contracts}
          onClose={() => {
            setShowRuleForm(false)
            setEditingRule(null)
          }}
          onSave={handleSaveRule}
        />
      )}

      {showRuleDetails && (
        <RuleDetails
          rule={rules.find((r) => r.id === showRuleDetails)!}
          contract={contracts.find((c) => c.id === rules.find((r) => r.id === showRuleDetails)?.contractId)!}
          onClose={() => setShowRuleDetails(null)}
          onEdit={() => {
            const rule = rules.find((r) => r.id === showRuleDetails)!
            handleEditRule(rule)
          }}
          onDelete={() => handleDeleteRule(showRuleDetails)}
          onSave={handleUpdateRuleValues}
        />
      )}
    </div>
  )
}
