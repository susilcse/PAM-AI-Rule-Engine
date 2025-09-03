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
import { X, Plus } from "lucide-react"

interface ContractFormProps {
  onClose: () => void
  onSave: (contract: any) => void
  contract?: any
}

export function ContractForm({ onClose, onSave, contract }: ContractFormProps) {
  const [formData, setFormData] = useState({
    contractNumber: contract?.contractNumber || "",
    partnerName: contract?.partnerName || "",
    product: contract?.product || "",
    market: contract?.market || "",
    status: contract?.status || "draft",
    startDate: contract?.startDate || "",
    endDate: contract?.endDate || "",
    description: contract?.description || "",
    customFields: contract?.customFields || [],
  })

  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldValue, setNewFieldValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: contract?.id || Date.now().toString(),
    })
    onClose()
  }

  const addCustomField = () => {
    if (newFieldName && newFieldValue) {
      setFormData((prev) => ({
        ...prev,
        customFields: [...prev.customFields, { name: newFieldName, value: newFieldValue }],
      }))
      setNewFieldName("")
      setNewFieldValue("")
    }
  }

  const removeCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{contract ? "Edit Contract" : "New Contract"}</CardTitle>
            <CardDescription>{contract ? "Update contract details" : "Create a new partner contract"}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractNumber">Contract Number</Label>
                <Input
                  id="contractNumber"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contractNumber: e.target.value }))}
                  placeholder="CTR-2024-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerName">Partner Name</Label>
              <Input
                id="partnerName"
                value={formData.partnerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, partnerName: e.target.value }))}
                placeholder="Partner Company Name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Input
                  id="product"
                  value={formData.product}
                  onChange={(e) => setFormData((prev) => ({ ...prev, product: e.target.value }))}
                  placeholder="Software License"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market">Market</Label>
                <Input
                  id="market"
                  value={formData.market}
                  onChange={(e) => setFormData((prev) => ({ ...prev, market: e.target.value }))}
                  placeholder="North America"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Contract description and notes..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Custom Fields</Label>
                <Badge variant="secondary" className="text-xs">
                  Optional
                </Badge>
              </div>

              {formData.customFields.length > 0 && (
                <div className="space-y-2">
                  {formData.customFields.map((field: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <span className="text-sm font-medium">{field.name}:</span>
                      <span className="text-sm">{field.value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto"
                        onClick={() => removeCustomField(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Field name"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Field value"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon" onClick={addCustomField}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {contract ? "Update Contract" : "Create Contract"}
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
