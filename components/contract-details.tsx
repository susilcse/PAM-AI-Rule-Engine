"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Edit, Trash2, Plus, FileText } from "lucide-react"

interface ContractDetailsProps {
  contract: any
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onCreateRule: () => void
  rules: any[]
}

export function ContractDetails({ contract, onClose, onEdit, onDelete, onCreateRule, rules }: ContractDetailsProps) {
  const contractRules = rules.filter((rule) => rule.contractId === contract.id)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {contract.contractNumber}
            </CardTitle>
            <CardDescription>{contract.partnerName}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contract Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                <Badge
                  variant={
                    contract.status === "active" ? "default" : contract.status === "draft" ? "secondary" : "outline"
                  }
                  className="mt-1"
                >
                  {contract.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Product</p>
                <p className="font-medium">{contract.product}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Market</p>
                <p className="font-medium">{contract.market}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Partner</p>
                <p className="font-medium">{contract.partnerName}</p>
              </div>
            </div>

            {(contract.startDate || contract.endDate) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {contract.startDate && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Start Date</p>
                    <p className="font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                )}
                {contract.endDate && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">End Date</p>
                    <p className="font-medium">{new Date(contract.endDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}

            {contract.description && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Description</p>
                <p className="mt-1">{contract.description}</p>
              </div>
            )}

            {contract.customFields && contract.customFields.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Custom Fields</p>
                <div className="grid grid-cols-2 gap-2">
                  {contract.customFields.map((field: any, index: number) => (
                    <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <span className="text-sm font-medium">{field.name}: </span>
                      <span className="text-sm">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Rules Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Associated Rules</h3>
              <Button onClick={onCreateRule} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Rule
              </Button>
            </div>

            {contractRules.length > 0 ? (
              <div className="space-y-3">
                {contractRules.map((rule) => (
                  <Card key={rule.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {rule.fields.length} fields
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{rule.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {rule.fields.slice(0, 3).map((field: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {field.name}: {field.value}
                            {field.type === "percentage" ? "%" : ""}
                          </Badge>
                        ))}
                        {rule.fields.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{rule.fields.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No rules created for this contract yet.</p>
                <p className="text-sm">Create your first rule to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
