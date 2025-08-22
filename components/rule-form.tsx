"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Trash2, GripVertical } from "lucide-react"

interface RuleField {
  id: string
  name: string
  type: "text" | "number" | "percentage" | "currency" | "date"
  value: string
  editable: boolean
  required: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

interface RuleFormProps {
  onClose: () => void
  onSave: (rule: any) => void
  rule?: any
  contracts: any[]
}

export function RuleForm({ onClose, onSave, rule, contracts }: RuleFormProps) {
  const [formData, setFormData] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    contractId: rule?.contractId || "",
    category: rule?.category || "revenue",
    priority: rule?.priority || "medium",
    active: rule?.active ?? true,
  })

  const [fields, setFields] = useState<RuleField[]>(
    rule?.fields?.map((f: any, index: number) => ({
      id: f.id || `field-${index}`,
      name: f.name,
      type: f.type,
      value: f.value,
      editable: f.editable,
      required: f.required || false,
      validation: f.validation || {},
    })) || [
      {
        id: "field-1",
        name: "Revenue Share Rate",
        type: "percentage",
        value: "25",
        editable: true,
        required: true,
        validation: { min: 0, max: 100 },
      },
    ],
  )

  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState<RuleField["type"]>("text")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: rule?.id || Date.now().toString(),
      fields: fields,
      createdAt: rule?.createdAt || new Date(),
      updatedAt: new Date(),
    })
    onClose()
  }

  const addField = () => {
    if (newFieldName.trim()) {
      const newField: RuleField = {
        id: `field-${Date.now()}`,
        name: newFieldName,
        type: newFieldType,
        value: newFieldType === "percentage" ? "0" : "",
        editable: true,
        required: false,
        validation: newFieldType === "percentage" ? { min: 0, max: 100 } : {},
      }
      setFields([...fields, newField])
      setNewFieldName("")
      setNewFieldType("text")
    }
  }

  const updateField = (id: string, updates: Partial<RuleField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex((f) => f.id === id)
    if ((direction === "up" && index > 0) || (direction === "down" && index < fields.length - 1)) {
      const newFields = [...fields]
      const targetIndex = direction === "up" ? index - 1 : index + 1
      ;[newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
      setFields(newFields)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{rule ? "Edit Rule" : "Create New Rule"}</CardTitle>
            <CardDescription>
              {rule ? "Update rule configuration and fields" : "Define a new contract rule with flexible fields"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Traffic Quality Rule"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractId">Associated Contract</Label>
                <Select
                  value={formData.contractId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, contractId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contract" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.contractNumber} - {contract.partnerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this rule governs..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active" className="text-sm">
                    {formData.active ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Rule Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Rule Fields</Label>
                <Badge variant="secondary" className="text-xs">
                  {fields.length} field{fields.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <Card key={field.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-1 flex flex-col items-center gap-2 pt-2">
                          <GripVertical className="h-4 w-4 text-slate-400" />
                          <div className="flex flex-col gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => moveField(field.id, "up")}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => moveField(field.id, "down")}
                              disabled={index === fields.length - 1}
                            >
                              ↓
                            </Button>
                          </div>
                        </div>

                        <div className="col-span-3 space-y-2">
                          <Label className="text-xs">Field Name</Label>
                          <Input
                            value={field.name}
                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                            placeholder="Field name"
                            className="text-sm"
                          />
                        </div>

                        <div className="col-span-2 space-y-2">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: RuleField["type"]) => updateField(field.id, { type: value })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="currency">Currency</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2 space-y-2">
                          <Label className="text-xs">Default Value</Label>
                          <Input
                            value={field.value}
                            onChange={(e) => updateField(field.id, { value: e.target.value })}
                            placeholder="Default value"
                            className="text-sm"
                            type={
                              field.type === "number" || field.type === "percentage"
                                ? "number"
                                : field.type === "date"
                                  ? "date"
                                  : "text"
                            }
                          />
                        </div>

                        <div className="col-span-3 space-y-2">
                          <Label className="text-xs">Options</Label>
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center space-x-1">
                              <Switch
                                checked={field.editable}
                                onCheckedChange={(checked) => updateField(field.id, { editable: checked })}
                                className="scale-75"
                              />
                              <span className="text-xs">Editable</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Switch
                                checked={field.required}
                                onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                className="scale-75"
                              />
                              <span className="text-xs">Required</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-1 flex justify-end pt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {(field.type === "number" || field.type === "percentage") && (
                        <div className="grid grid-cols-2 gap-4 mt-3 ml-16">
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Min Value</Label>
                            <Input
                              type="number"
                              value={field.validation?.min || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  validation: {
                                    ...field.validation,
                                    min: e.target.value ? Number(e.target.value) : undefined,
                                  },
                                })
                              }
                              placeholder="Min"
                              className="text-sm h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Max Value</Label>
                            <Input
                              type="number"
                              value={field.validation?.max || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  validation: {
                                    ...field.validation,
                                    max: e.target.value ? Number(e.target.value) : undefined,
                                  },
                                })
                              }
                              placeholder="Max"
                              className="text-sm h-8"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add New Field */}
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm">Add New Field</Label>
                      <Input
                        placeholder="Field name"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Type</Label>
                      <Select value={newFieldType} onValueChange={setNewFieldType}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="currency">Currency</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={addField} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Field
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {rule ? "Update Rule" : "Create Rule"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
