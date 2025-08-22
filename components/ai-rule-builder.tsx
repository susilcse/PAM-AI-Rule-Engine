"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Sparkles, FileText } from "lucide-react"

interface AIRuleBuilderProps {
  contracts: any[]
  onCreateRule: (rule: any) => void
  onSelectContract: (contractId: string) => void
}

interface ParsedRule {
  name: string
  description: string
  category: string
  priority: string
  fields: Array<{
    name: string
    type: "text" | "number" | "percentage" | "currency"
    value: string
    editable: boolean
    required: boolean
    validation?: { min?: number; max?: number }
  }>
}

export function AIRuleBuilder({ contracts, onCreateRule, onSelectContract }: AIRuleBuilderProps) {
  const [selectedContract, setSelectedContract] = useState<string>("")
  const [parsedRule, setParsedRule] = useState<ParsedRule | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const parseUserInput = (input: string): ParsedRule => {
    const lowerInput = input.toLowerCase()

    // Determine rule category based on keywords
    let category = "other"
    let priority = "medium"

    if (lowerInput.includes("revenue") || lowerInput.includes("share") || lowerInput.includes("commission")) {
      category = "revenue"
    } else if (lowerInput.includes("quality") || lowerInput.includes("traffic")) {
      category = "quality"
    } else if (lowerInput.includes("performance") || lowerInput.includes("metric")) {
      category = "performance"
    } else if (lowerInput.includes("compliance") || lowerInput.includes("legal")) {
      category = "compliance"
    }

    if (lowerInput.includes("critical") || lowerInput.includes("urgent")) {
      priority = "critical"
    } else if (lowerInput.includes("high") || lowerInput.includes("important")) {
      priority = "high"
    } else if (lowerInput.includes("low")) {
      priority = "low"
    }

    // Extract potential fields based on common patterns
    const fields: ParsedRule["fields"] = []

    // Revenue share patterns
    if (lowerInput.includes("revenue share") || lowerInput.includes("revshare")) {
      const match = input.match(/(\d+)%?\s*revenue\s*share/i) || input.match(/revshare.*?(\d+)%?/i)
      const value = match ? match[1] : "25"
      fields.push({
        name: "Revenue Share Rate",
        type: "percentage",
        value,
        editable: true,
        required: true,
        validation: { min: 0, max: 50 },
      })
    }

    // Traffic quality patterns
    if (lowerInput.includes("traffic quality") || lowerInput.includes("quality threshold")) {
      const match = input.match(/(\d+)%?\s*traffic\s*quality/i) || input.match(/quality.*?(\d+)%?/i)
      const value = match ? match[1] : "85"
      fields.push({
        name: "Traffic Quality",
        type: "percentage",
        value,
        editable: true,
        required: true,
        validation: { min: 0, max: 100 },
      })
    }

    // Organic traffic patterns
    if (lowerInput.includes("organic traffic") || lowerInput.includes("organic")) {
      const match = input.match(/(\d+)%?\s*organic/i)
      const value = match ? match[1] : "60"
      fields.push({
        name: "Organic Traffic",
        type: "percentage",
        value,
        editable: true,
        required: false,
        validation: { min: 0, max: 100 },
      })
    }

    // Fixed fee patterns
    if (lowerInput.includes("fixed fee") || lowerInput.includes("flat fee")) {
      const match =
        input.match(/\$?(\d+(?:,\d{3})*)\s*(?:fixed|flat)\s*fee/i) ||
        input.match(/(?:fixed|flat)\s*fee.*?\$?(\d+(?:,\d{3})*)/i)
      const value = match ? match[1].replace(/,/g, "") : "5000"
      fields.push({
        name: "Fixed Fee",
        type: "currency",
        value,
        editable: false,
        required: true,
      })
    }

    // Cost of sale patterns
    if (lowerInput.includes("cost of sale") || lowerInput.includes("cos")) {
      const match = input.match(/(\d+)%?\s*cost\s*of\s*sale/i) || input.match(/cos.*?(\d+)%?/i)
      const value = match ? match[1] : "15"
      fields.push({
        name: "Cost of Sale",
        type: "percentage",
        value,
        editable: true,
        required: false,
        validation: { min: 0, max: 30 },
      })
    }

    // Minimum values patterns
    if (lowerInput.includes("minimum") && (lowerInput.includes("views") || lowerInput.includes("impressions"))) {
      const match = input.match(/minimum.*?(\d+(?:,\d{3})*)/i)
      const value = match ? match[1].replace(/,/g, "") : "10000"
      const fieldName = lowerInput.includes("views") ? "Minimum Views" : "Minimum Impressions"
      fields.push({
        name: fieldName,
        type: "number",
        value,
        editable: true,
        required: true,
        validation: { min: 1000 },
      })
    }

    // Default fields if none detected
    if (fields.length === 0) {
      fields.push({
        name: "Value",
        type: "text",
        value: "",
        editable: true,
        required: true,
      })
    }

    // Generate rule name and description
    const ruleName =
      input.length > 50
        ? `${category.charAt(0).toUpperCase() + category.slice(1)} Rule`
        : input.split(".")[0].trim() || `${category.charAt(0).toUpperCase() + category.slice(1)} Rule`

    const description =
      input.length > 100 ? input.substring(0, 100) + "..." : input || `Defines ${category} requirements and thresholds`

    return {
      name: ruleName,
      description,
      category,
      priority,
      fields,
    }
  }

  const handleGenerateRule = (userInput: string) => {
    setIsGenerating(true)

    // Simulate AI processing time
    setTimeout(() => {
      const rule = parseUserInput(userInput)
      setParsedRule(rule)
      setIsGenerating(false)
    }, 1500)
  }

  const handleCreateRule = () => {
    if (parsedRule && selectedContract) {
      const newRule = {
        ...parsedRule,
        id: Date.now().toString(),
        contractId: selectedContract,
        active: true,
        createdAt: new Date(),
        fields: parsedRule.fields.map((field, index) => ({
          ...field,
          id: `field-${Date.now()}-${index}`,
        })),
      }
      onCreateRule(newRule)
      setParsedRule(null)
      setSelectedContract("")
    }
  }

  const selectedContractData = contracts.find((c) => c.id === selectedContract)

  return (
    <div className="space-y-6">
      {parsedRule && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Sparkles className="h-5 w-5" />
              AI Generated Rule
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Review and customize the rule before creating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rule Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-green-800 dark:text-green-200">Rule Name</Label>
                <p className="mt-1 font-semibold">{parsedRule.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800 dark:text-green-200">Category</Label>
                <Badge className="mt-1 bg-green-600 text-white">{parsedRule.category}</Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-green-800 dark:text-green-200">Description</Label>
              <p className="mt-1">{parsedRule.description}</p>
            </div>

            {/* Contract Selection */}
            <div>
              <Label className="text-sm font-medium text-green-800 dark:text-green-200">Apply to Contract</Label>
              <Select value={selectedContract} onValueChange={setSelectedContract}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a contract" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          {contract.contractNumber} - {contract.partnerName}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedContractData && (
                <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded border">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Product:</span>
                      <span className="font-medium">{selectedContractData.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Market:</span>
                      <span className="font-medium">{selectedContractData.market}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Fields */}
            <div>
              <Label className="text-sm font-medium text-green-800 dark:text-green-200">Generated Fields</Label>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                {parsedRule.fields.map((field, index) => (
                  <Card key={index} className="border-green-300 dark:border-green-700">
                    <CardContent className="pt-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{field.name}</span>
                          <div className="flex gap-1">
                            {field.required && (
                              <Badge variant="outline" className="text-xs">
                                Required
                              </Badge>
                            )}
                            {field.editable ? (
                              <Badge variant="secondary" className="text-xs">
                                Editable
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Fixed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Input
                          value={
                            field.value + (field.type === "percentage" ? "%" : field.type === "currency" ? " USD" : "")
                          }
                          readOnly
                          className="text-sm bg-white dark:bg-slate-800"
                        />
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Type: {field.type}
                          {field.validation &&
                            (field.validation.min !== undefined || field.validation.max !== undefined) && (
                              <span className="ml-2">
                                Range: {field.validation.min || 0} - {field.validation.max || "∞"}
                              </span>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button onClick={handleCreateRule} disabled={!selectedContract} className="flex-1 gap-2">
                <CheckCircle className="h-4 w-4" />
                Create Rule
              </Button>
              <Button variant="outline" onClick={() => setParsedRule(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">Analyzing your request...</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">AI is parsing your rule requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// export { handleGenerateRule }
