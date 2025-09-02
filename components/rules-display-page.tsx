"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bot,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface Contract {
  id: string;
  contractNumber: string;
  partnerName: string;
  product: string;
  uploadedAt: Date;
  fileName: string;
}

interface RulesDisplayPageProps {
  contract: Contract;
  onBack: () => void;
}

interface Rule {
  id: string;
  name: string;
  source: string;
  tokens: Array<{
    id: string;
    type: "variable" | "operator" | "value" | "keyword";
    value: string;
    editable: boolean;
  }>;
}

interface RulesData {
  docType: string;
  summary: string;
  searchResults: {
    exhibitDFound: boolean;
    tablesFound: number;
    revenueTermsFound: string[];
  };
  rules: Rule[];
}

export function RulesDisplayPage({ contract, onBack }: RulesDisplayPageProps) {
  const [rulesData, setRulesData] = useState<RulesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/contracts/${contract.id}/rules`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(
              "No rules found. Please upload and analyze the contract first."
            );
          } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to load rules");
          }
          return;
        }

        const data = await response.json();
        setRulesData(data.rules.current);
      } catch (err: any) {
        setError(`Failed to load rules: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, [contract.id]);

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Rules for {contract.partnerName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Contract: {contract.contractNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                Loading rules...
              </p>
            </div>
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {rulesData && (
          <>
            {/* Summary Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">
                  {rulesData.summary}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      rulesData.searchResults.exhibitDFound
                        ? "default"
                        : "secondary"
                    }
                  >
                    {rulesData.searchResults.exhibitDFound
                      ? "✓ Exhibit D Found"
                      : "✗ Exhibit D Not Found"}
                  </Badge>
                  <Badge variant="outline">
                    {rulesData.searchResults.tablesFound} Table
                    {rulesData.searchResults.tablesFound !== 1 ? "s" : ""} Found
                  </Badge>
                  <Badge variant="outline">
                    {rulesData.rules.length} Rule
                    {rulesData.rules.length !== 1 ? "s" : ""} Extracted
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Revenue Terms Found:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {rulesData.searchResults.revenueTermsFound.map(
                      (term, index) => (
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
              </CardContent>
            </Card>

            {/* Rules Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Revenue Sharing Rules ({rulesData.rules.length})
              </h2>

              {rulesData.rules.map((rule, index) => (
                <Card key={rule.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mr-2">
                            {rule.source}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                        Rule Logic:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {rule.tokens.map((token) => (
                          <Badge
                            key={token.id}
                            variant="outline"
                            className={getTokenColor(token.type)}
                          >
                            {token.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Raw JSON Section (Collapsible) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Raw JSON Data
                </CardTitle>
                <CardDescription>
                  Complete extracted data for technical reference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{JSON.stringify(rulesData, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
