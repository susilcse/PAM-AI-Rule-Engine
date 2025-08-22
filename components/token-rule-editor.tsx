"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Plus, Trash2, Copy, Edit2, Download, Save, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TokenRule {
  id: string
  name: string
  tokens: Array<{
    id: string
    type: "variable" | "operator" | "value" | "keyword"
    value: string
    editable: boolean
  }>
}

interface RuleGroup {
  id: string
  name: string
  expanded: boolean
  rules: TokenRule[]
}

export function TokenRuleEditor() {
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([
    {
      id: "financial",
      name: "Financial Rules",
      expanded: true,
      rules: [
        {
          id: "revenue-share",
          name: "Revenue Share Rate",
          tokens: [
            { id: "1", type: "variable", value: "Revshare_rate", editable: true },
            { id: "2", type: "operator", value: "=", editable: true },
            { id: "3", type: "value", value: "60%", editable: true },
          ],
        },
        {
          id: "cost-sales",
          name: "Cost of Sales",
          tokens: [
            { id: "4", type: "variable", value: "cost_of_sales", editable: true },
            { id: "5", type: "operator", value: "=", editable: true },
            { id: "6", type: "value", value: "75%", editable: true },
          ],
        },
      ],
    },
    {
      id: "performance",
      name: "Traffic Quality Rules",
      expanded: true,
      rules: [
        {
          id: "traffic-quality",
          name: "Traffic Quality Bonus",
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
      ],
    },
  ])

  const toggleGroup = (groupId: string) => {
    setRuleGroups((groups) =>
      groups.map((group) => (group.id === groupId ? { ...group, expanded: !group.expanded } : group)),
    )
  }

  const updateToken = (groupId: string, ruleId: string, tokenId: string, newValue: string) => {
    setRuleGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: group.rules.map((rule) =>
                rule.id === ruleId
                  ? {
                      ...rule,
                      tokens: rule.tokens.map((token) =>
                        token.id === tokenId ? { ...token, value: newValue } : token,
                      ),
                    }
                  : rule,
              ),
            }
          : group,
      ),
    )
  }

  const deleteRule = (groupId: string, ruleId: string) => {
    setRuleGroups((groups) =>
      groups.map((group) =>
        group.id === groupId ? { ...group, rules: group.rules.filter((rule) => rule.id !== ruleId) } : group,
      ),
    )
  }

  const copyRule = (groupId: string, ruleId: string) => {
    setRuleGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: [
                ...group.rules,
                {
                  ...group.rules.find((r) => r.id === ruleId)!,
                  id: `${ruleId}-copy-${Date.now()}`,
                  name: `${group.rules.find((r) => r.id === ruleId)!.name} (Copy)`,
                },
              ],
            }
          : group,
      ),
    )
  }

  const addRule = (groupId: string) => {
    const newRule: TokenRule = {
      id: `rule-${Date.now()}`,
      name: "New Rule",
      tokens: [
        { id: `token-${Date.now()}-1`, type: "variable", value: "variable_name", editable: true },
        { id: `token-${Date.now()}-2`, type: "operator", value: "=", editable: true },
        { id: `token-${Date.now()}-3`, type: "value", value: "value", editable: true },
      ],
    }

    setRuleGroups((groups) =>
      groups.map((group) => (group.id === groupId ? { ...group, rules: [...group.rules, newRule] } : group)),
    )
  }

  const addGroup = () => {
    const newGroup: RuleGroup = {
      id: `group-${Date.now()}`,
      name: "New Group",
      expanded: true,
      rules: [],
    }
    setRuleGroups((groups) => [...groups, newGroup])
  }

  const getTokenColor = (type: string) => {
    switch (type) {
      case "variable":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "operator":
        return "bg-green-100 text-green-800 border-green-200"
      case "value":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "keyword":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const operatorOptions = ["=", ">", "<", ">=", "<=", "!="]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Rules</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Modify contract rules using editable tokens</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={addGroup} className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Group
          </Button>
        </div>
      </div>

      {/* Rule Groups */}
      <div className="space-y-6">
        {ruleGroups.map((group) => (
          <Card key={group.id} className="border border-slate-200">
            <div className="p-4">
              {/* Group Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => toggleGroup(group.id)} className="p-0 h-auto">
                    {group.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {group.name}
                    <Edit2 className="h-4 w-4 text-slate-400" />
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {group.rules.length} rule{group.rules.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addRule(group.id)}
                    className="gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Rules */}
              {group.expanded && (
                <div className="space-y-4 ml-7">
                  {group.rules.map((rule) => (
                    <div key={rule.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          {rule.name}
                          <Edit2 className="h-3 w-3 text-slate-400" />
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyRule(group.id, rule.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRule(group.id, rule.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Tokens */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {rule.tokens.map((token, index) => (
                          <div key={token.id} className="flex items-center gap-1">
                            {token.editable ? (
                              token.type === "operator" ? (
                                <Select
                                  value={token.value}
                                  onValueChange={(value) => updateToken(group.id, rule.id, token.id, value)}
                                >
                                  <SelectTrigger
                                    className={`h-8 w-auto min-w-[60px] border ${getTokenColor(token.type)} font-mono text-sm`}
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
                                  onChange={(e) => updateToken(group.id, rule.id, token.id, e.target.value)}
                                  className={`px-2 py-1 rounded border ${getTokenColor(token.type)} font-mono text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                              )
                            ) : (
                              <span
                                className={`px-2 py-1 rounded border ${getTokenColor(token.type)} font-mono text-sm`}
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
        ))}
      </div>

      {ruleGroups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Edit2 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No rule groups</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Create your first rule group to get started</p>
          <Button onClick={addGroup} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Group
          </Button>
        </div>
      )}
    </div>
  )
}
