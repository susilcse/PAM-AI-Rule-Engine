"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, Edit, Trash2, Save, RotateCcw, Settings, AlertCircle } from "lucide-react"

interface RuleDetailsProps {
  rule: any
  contract: any
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onSave: (updatedRule: any) => void
}

export function RuleDetails({ rule, contract, onClose, onEdit, onDelete, onSave }: RuleDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedFields, setEditedFields] = useState(
    rule.fields.reduce((acc: any, field: any) => {
      acc[field.id || field.name] = field.value
      return acc
    }, {}),
  )
  const [hasChanges, setHasChanges] = useState(false)

  const handleFieldChange = (fieldId: string, value: string) => {
    setEditedFields((prev) => ({ ...prev, [fieldId]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    const updatedRule = {
      ...rule,
      fields: rule.fields.map((field: any) => ({
        ...field,
        value: editedFields[field.id || field.name] || field.value,
      })),
      updatedAt: new Date(),
    }
    onSave(updatedRule)
    setIsEditing(false)
    setHasChanges(false)
  }

  const handleReset = () => {
    setEditedFields(
      rule.fields.reduce((acc: any, field: any) => {
        acc[field.id || field.name] = field.value
        return acc
      }, {}),
    )
    setHasChanges(false)
  }

  const validateField = (field: any, value: string) => {
    if (field.required && !value.trim()) {
      return "This field is required"
    }

    if (field.type === "percentage") {
      const num = Number.parseFloat(value)
      if (isNaN(num)) return "Must be a valid number"
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return `Must be at least ${field.validation.min}%`
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return `Must be at most ${field.validation.max}%`
      }
    }

    if (field.type === "number") {
      const num = Number.parseFloat(value)
      if (isNaN(num)) return "Must be a valid number"
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return `Must be at least ${field.validation.min}`
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return `Must be at most ${field.validation.max}`
      }
    }

    return null
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="flex items-center gap-2">
                {rule.name}
                {!rule.active && (
                  <Badge variant="outline" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {contract.contractNumber} - {contract.partnerName}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="gap-2 bg-transparent"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false)
                    handleReset()
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Values
                </Button>
                <Button variant="outline" size="sm" onClick={onEdit} className="gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 gap-2 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rule Metadata */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Rule Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Category</p>
                <Badge className={`mt-1 ${getCategoryColor(rule.category)}`}>{rule.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Priority</p>
                <Badge variant={getPriorityColor(rule.priority)} className="mt-1">
                  {rule.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                <Badge variant={rule.active ? "default" : "secondary"} className="mt-1">
                  {rule.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Fields</p>
                <p className="font-medium">
                  {rule.fields.length} field{rule.fields.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {rule.description && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Description</p>
                <p className="mt-1">{rule.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Created</p>
                <p className="font-medium">{new Date(rule.createdAt).toLocaleDateString()}</p>
              </div>
              {rule.updatedAt && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Last Updated</p>
                  <p className="font-medium">{new Date(rule.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Rule Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Rule Fields</h3>
              {isEditing && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <AlertCircle className="h-4 w-4" />
                  Only editable fields can be modified
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rule.fields.map((field: any, index: number) => {
                const fieldId = field.id || field.name
                const currentValue = editedFields[fieldId] || field.value
                const validation = validateField(field, currentValue)
                const hasError = validation !== null

                return (
                  <Card
                    key={index}
                    className={`${!field.editable ? "bg-slate-50 dark:bg-slate-800" : ""} ${hasError ? "border-red-300" : ""}`}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">{field.name}</Label>
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
                                Read-only
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Input
                            value={
                              currentValue +
                              (field.type === "percentage" ? "%" : field.type === "currency" ? " USD" : "")
                            }
                            onChange={(e) => {
                              let value = e.target.value
                              if (field.type === "percentage") {
                                value = value.replace("%", "")
                              }
                              if (field.type === "currency") {
                                value = value.replace(" USD", "")
                              }
                              handleFieldChange(fieldId, value)
                            }}
                            disabled={!isEditing || !field.editable}
                            className={`${!field.editable ? "cursor-not-allowed" : ""} ${hasError ? "border-red-300" : ""}`}
                            type={
                              field.type === "number" || field.type === "percentage" || field.type === "currency"
                                ? "number"
                                : field.type === "date"
                                  ? "date"
                                  : "text"
                            }
                          />
                          {hasError && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {validation}
                            </p>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          <p>Type: {field.type}</p>
                          {field.validation &&
                            (field.validation.min !== undefined || field.validation.max !== undefined) && (
                              <p>
                                Range: {field.validation.min || 0} - {field.validation.max || "∞"}
                                {field.type === "percentage" ? "%" : ""}
                              </p>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
