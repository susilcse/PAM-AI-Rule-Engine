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
  // AI analysis data
  searchResults?: {
    exhibitDFound: boolean;
    tablesFound: number;
    revenueTermsFound: string[];
  };
  rules?: Array<{
    id: string;
    name: string;
    source: string;
    tokens: Array<{
      id: string;
      type: string;
      value: string;
      editable: boolean;
    }>;
  }>;
}

interface ContractSummaryPanelProps {
  contract: any;
  summary?: any; // Raw AI analysis data
  onClose: () => void;
}

export function ContractSummaryPanel({
  contract,
  summary,
  onClose,
}: ContractSummaryPanelProps) {
  // Use real AI-generated summary data if available, otherwise fallback to mock
  const currentSummary: ContractSummary = summary
    ? {
        id: "summary-" + contract.id,
        contractId: contract.id,
        summary:
          summary.summary || `AI analysis of ${contract.partnerName} contract`,
        keyPoints: summary.searchResults?.revenueTermsFound || [
          "Revenue sharing information extracted",
          "Contract terms analyzed",
          "Rules generated from content",
        ],
        financialTerms: {
          totalValue: "Analyzed",
          paymentTerms: "Extracted from contract",
          currency: "USD",
        },
        timeline: {
          startDate: contract.startDate
            ? new Date(contract.startDate)
            : new Date(),
          endDate: contract.endDate
            ? new Date(contract.endDate)
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          renewalDate: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000),
        },
        risks: [
          "Contract analysis completed",
          "Revenue sharing rules extracted",
          "Terms and conditions reviewed",
        ],
        opportunities: [
          "AI-powered rule extraction successful",
          "Contract terms digitized",
          "Editable rules created",
        ],
        status: "processed",
        lastUpdated: new Date(),
      }
    : {
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
          startDate: contract.startDate
            ? new Date(contract.startDate)
            : new Date(),
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

            {/* AI Analysis Results */}
            {summary && (
              <div>
                <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  AI Analysis Results
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Analysis Summary:
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                      {summary.summary}
                    </p>
                  </div>

                  {summary.searchResults && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Search Results:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              summary.searchResults.exhibitDFound
                                ? "default"
                                : "secondary"
                            }
                          >
                            {summary.searchResults.exhibitDFound
                              ? "✓ Exhibit D Found"
                              : "✗ Exhibit D Not Found"}
                          </Badge>
                          <Badge variant="outline">
                            {summary.searchResults.tablesFound} Tables
                          </Badge>
                        </div>

                        {summary.searchResults.revenueTermsFound &&
                          summary.searchResults.revenueTermsFound.length >
                            0 && (
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                Revenue Terms Found:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {summary.searchResults.revenueTermsFound.map(
                                  (term: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {term}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {summary.rules && summary.rules.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Extracted Rules:
                      </p>
                      <div className="space-y-2">
                        {summary.rules
                          .slice(0, 3)
                          .map((rule: any, index: number) => (
                            <div
                              key={index}
                              className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-sm"
                            >
                              <p className="font-medium">{rule.name}</p>
                              <p className="text-slate-600 dark:text-slate-400 text-xs">
                                Source: {rule.source}
                              </p>
                            </div>
                          ))}
                        {summary.rules.length > 3 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            +{summary.rules.length - 3} more rules...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
