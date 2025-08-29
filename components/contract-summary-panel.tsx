"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  FileText,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ContractSummary {
  id: string;
  contractId: string;
  summary: string;
  keyPoints: string[];
  financialTerms: {
    totalValue?: string;
    paymentTerms?: string;
    currency?: string;
  };
  timeline: {
    startDate?: Date;
    endDate?: Date;
    renewalDate?: Date;
  };
  risks: string[];
  opportunities: string[];
  status: "processed" | "processing" | "error";
  lastUpdated: Date;
}

interface ContractSummaryPanelProps {
  contract: any;
  summary?: ContractSummary;
  onClose: () => void;
}

export function ContractSummaryPanel({
  contract,
  summary,
  onClose,
}: ContractSummaryPanelProps) {
  // Mock summary data for demonstration
  const mockSummary: ContractSummary = summary || {
    id: "summary-" + contract.id,
    contractId: contract.id,
    summary: `This is a comprehensive ${contract.product} agreement with ${contract.partnerName}. The contract establishes the terms and conditions for partnership collaboration, including revenue sharing, performance metrics, and operational guidelines. The agreement covers multiple territories and includes provisions for scalability and performance optimization.`,
    keyPoints: [
      "Revenue sharing model with tiered percentages",
      "Quarterly performance reviews required",
      "Automatic renewal clause included",
      "Territory expansion rights reserved",
      "Data protection compliance mandatory",
    ],
    financialTerms: {
      totalValue: "$2.5M",
      paymentTerms: "Net 30 days",
      currency: "USD",
    },
    timeline: {
      startDate: contract.startDate ? new Date(contract.startDate) : new Date(),
      endDate: contract.endDate
        ? new Date(contract.endDate)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      renewalDate: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000),
    },
    risks: [
      "Market volatility may affect revenue projections",
      "Dependency on third-party integrations",
      "Regulatory changes in target markets",
    ],
    opportunities: [
      "Potential for early renewal with improved terms",
      "Expansion to additional product lines",
      "Joint marketing initiatives possibility",
    ],
    status: "processed",
    lastUpdated: new Date(),
  };

  const currentSummary = summary || mockSummary;

  return (
    <div className="min-w-0">
      <Card className="h-[calc(100vh-200px)] border border-slate-200 sticky top-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Contract Summary</h3>
            <Badge
              variant={
                currentSummary.status === "processed"
                  ? "default"
                  : currentSummary.status === "processing"
                  ? "secondary"
                  : "destructive"
              }
              className="ml-2"
            >
              {currentSummary.status === "processed" && (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {currentSummary.status === "processing" && (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {currentSummary.status === "error" && (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {currentSummary.status}
            </Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close Summary Panel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 h-[calc(100vh-350px)]">
          <div className="p-4 space-y-6">
            {/* Contract Overview */}
            <div>
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Contract Overview
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Contract:
                  </span>
                  <span className="font-medium">{contract.contractNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Partner:
                  </span>
                  <span className="font-medium">{contract.partnerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Last Updated:
                  </span>
                  <span className="font-medium">
                    {currentSummary.lastUpdated.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Executive Summary */}
            <div>
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Executive Summary
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {currentSummary.summary}
              </p>
            </div>

            <Separator />

            {/* Key Points */}
            <div>
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Key Points
              </h4>
              <ul className="space-y-2">
                {currentSummary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Financial Terms */}
            <div>
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Terms
              </h4>
              <div className="space-y-2">
                {currentSummary.financialTerms.totalValue && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Total Value:
                    </span>
                    <Badge variant="secondary" className="font-medium">
                      {currentSummary.financialTerms.totalValue}
                    </Badge>
                  </div>
                )}
                {currentSummary.financialTerms.paymentTerms && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Payment Terms:
                    </span>
                    <span className="font-medium">
                      {currentSummary.financialTerms.paymentTerms}
                    </span>
                  </div>
                )}
                {currentSummary.financialTerms.currency && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Currency:
                    </span>
                    <span className="font-medium">
                      {currentSummary.financialTerms.currency}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div>
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </h4>
              <div className="space-y-2">
                {currentSummary.timeline.startDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Start Date:
                    </span>
                    <span className="font-medium">
                      {currentSummary.timeline.startDate.toLocaleDateString()}
                    </span>
                  </div>
                )}
                {currentSummary.timeline.endDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      End Date:
                    </span>
                    <span className="font-medium">
                      {currentSummary.timeline.endDate.toLocaleDateString()}
                    </span>
                  </div>
                )}
                {currentSummary.timeline.renewalDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Renewal Due:
                    </span>
                    <span className="font-medium">
                      {currentSummary.timeline.renewalDate.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Risks */}
            <div>
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Identified Risks
              </h4>
              <ul className="space-y-2">
                {currentSummary.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {risk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Opportunities */}
            <div>
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Opportunities
              </h4>
              <ul className="space-y-2">
                {currentSummary.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {opportunity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Summary generated by AI • Last updated{" "}
            {currentSummary.lastUpdated.toLocaleString()}
          </p>
        </div>
      </Card>
    </div>
  );
}
