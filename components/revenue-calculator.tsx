"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, TrendingUp, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TokenRule {
  id: string;
  name: string;
  category: "financial" | "traffic-quality";
  tokens: Array<{
    id: string;
    type: "variable" | "operator" | "value" | "keyword";
    value: string;
    editable: boolean;
  }>;
}

interface RevenueCalculatorProps {
  rules: TokenRule[];
  contractInfo: {
    id: string;
    contractNumber: string;
    partnerName: string;
  };
  onBack: () => void;
}

interface RevenueData {
  id: string;
  contentType: string;
  mediaType: string;
  grossRevenue: number;
  cos?: number;
  coc?: number;
  yahooRev?: number;
  onefootballRev?: number;
}

interface CalculationResult {
  id: string;
  contentType: string;
  mediaType: string;
  grossRevenue: number;
  cos: number;
  revenuePostCOS: number;
  coc: number;
  cocAmount: number;
  revenuePostCOC: number;
  yahooRevShare: number;
  onefootballRevShare: number;
  yahooAmount: number;
  onefootballAmount: number;
  yahooFinal: number;
  onefootballFinal: number;
}

// Sample data based on your CSV
const sampleData: RevenueData[] = [
  {
    id: "1",
    contentType: "OneFootball - AC Milan",
    mediaType: "Text",
    grossRevenue: 12.11,
  },
  {
    id: "2",
    contentType: "OneFootball - AC Milan",
    mediaType: "Video",
    grossRevenue: 19.2,
  },
  {
    id: "3",
    contentType: "OneFootball - Absolute Chelsea",
    mediaType: "Text",
    grossRevenue: 0.53,
  },
  {
    id: "4",
    contentType: "OneFootball - AFC Ajax",
    mediaType: "Video",
    grossRevenue: 1.25,
  },
  {
    id: "5",
    contentType: "OneFootball - AS Monaco",
    mediaType: "Text",
    grossRevenue: 3.86,
  },
];

export function RevenueCalculator({
  rules,
  contractInfo,
  onBack,
}: RevenueCalculatorProps) {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Extract rule values from token arrays
  const extractRuleValues = (rule: TokenRule) => {
    const values: any = {};
    const tokens = rule.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === "variable" && i + 2 < tokens.length) {
        const operator = tokens[i + 1];
        const value = tokens[i + 2];
        if (operator.value === "=" && value.type === "value") {
          values[token.value] = parseFloat(value.value) || 0;
        }
      }
    }
    return values;
  };

  // Find matching rule for content type and media type
  const findMatchingRule = (contentType: string, mediaType: string) => {
    for (const rule of rules) {
      const tokens = rule.tokens;
      let contentMatch = false;
      let mediaMatch = false;

      for (let i = 0; i < tokens.length - 2; i++) {
        if (
          tokens[i].type === "variable" &&
          tokens[i].value === "content_type" &&
          tokens[i + 1].value === "==" &&
          tokens[i + 2].value
            .toLowerCase()
            .includes(
              contentType.toLowerCase().split(" ")[1] ||
                contentType.toLowerCase()
            )
        ) {
          contentMatch = true;
        }
        if (
          tokens[i].type === "variable" &&
          tokens[i].value === "media_type" &&
          tokens[i + 1].value === "==" &&
          tokens[i + 2].value.toLowerCase() === mediaType.toLowerCase()
        ) {
          mediaMatch = true;
        }
      }

      if (contentMatch && mediaMatch) {
        return extractRuleValues(rule);
      }
    }

    // Fallback: find rule that matches media type only
    for (const rule of rules) {
      const tokens = rule.tokens;
      for (let i = 0; i < tokens.length - 2; i++) {
        if (
          tokens[i].type === "variable" &&
          tokens[i].value === "media_type" &&
          tokens[i + 1].value === "==" &&
          tokens[i + 2].value.toLowerCase() === mediaType.toLowerCase()
        ) {
          return extractRuleValues(rule);
        }
      }
    }

    // Default values if no rule matches
    return {
      cos: 10,
      coc: mediaType.toLowerCase() === "text" ? 12 : 50,
      yahoo_rev: 60,
      onefootball_rev: 40,
    };
  };

  const calculateRevenue = (
    data: RevenueData,
    ruleValues: any
  ): CalculationResult => {
    const cos = ruleValues.cos || 10;
    const coc =
      ruleValues.coc || (data.mediaType.toLowerCase() === "text" ? 12 : 50);
    const yahooRevShare = ruleValues.yahoo_rev || 60;
    const onefootballRevShare = ruleValues.onefootball_rev || 40;

    // Step 1: Apply COS
    const revenuePostCOS = data.grossRevenue * (1 - cos / 100);

    // Step 2: Calculate COC amount
    const cocAmount = revenuePostCOS * (coc / 100);

    // Step 3: Revenue after COC deduction
    const revenuePostCOC = revenuePostCOS - cocAmount;

    // Step 4: Calculate revenue shares
    const yahooAmount = revenuePostCOC * (yahooRevShare / 100);
    const onefootballAmount = revenuePostCOC * (onefootballRevShare / 100);

    // Step 5: Final amounts (adding back COC)
    const yahooFinal = yahooAmount + (cocAmount * yahooRevShare) / 100;
    const onefootballFinal =
      onefootballAmount + (cocAmount * onefootballRevShare) / 100;

    return {
      id: data.id,
      contentType: data.contentType,
      mediaType: data.mediaType,
      grossRevenue: data.grossRevenue,
      cos,
      revenuePostCOS,
      coc,
      cocAmount,
      revenuePostCOC,
      yahooRevShare,
      onefootballRevShare,
      yahooAmount,
      onefootballAmount,
      yahooFinal,
      onefootballFinal,
    };
  };

  const handleApplyRules = async () => {
    setIsCalculating(true);

    // Simulate processing time for demo effect
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const calculatedResults = sampleData.map((data) => {
      const ruleValues = findMatchingRule(data.contentType, data.mediaType);
      return calculateRevenue(data, ruleValues);
    });

    setResults(calculatedResults);
    setIsCalculating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="w-full mx-auto px-4">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rules
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Revenue Calculator
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Apply finalized rules to calculate revenue distributions for{" "}
              {contractInfo.contractNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Rules Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Active Rules Summary
          </CardTitle>
          <CardDescription>
            {rules.length} rules loaded from {contractInfo.partnerName} contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {rules.slice(0, 6).map((rule) => (
              <Badge key={rule.id} variant="secondary">
                {rule.name}
              </Badge>
            ))}
            {rules.length > 6 && (
              <Badge variant="outline">+{rules.length - 6} more rules</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Sample Revenue Data
          </CardTitle>
          <CardDescription>
            Sample data from July 2025 - Ready for rule application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content Type</TableHead>
                <TableHead>Media Type</TableHead>
                <TableHead className="text-right">Gross Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">
                    {data.contentType}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        data.mediaType === "Text" ? "default" : "secondary"
                      }
                    >
                      {data.mediaType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(data.grossRevenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleApplyRules}
              disabled={isCalculating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              size="lg"
            >
              {isCalculating ? (
                <>
                  <Calculator className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Apply Rules & Calculate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Calculation Results
            </CardTitle>
            <CardDescription>
              Detailed breakdown showing COS, COC, and revenue share
              calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Gross Revenue</TableHead>
                    <TableHead className="text-right">COS %</TableHead>
                    <TableHead className="text-right">
                      Revenue Post COS
                    </TableHead>
                    <TableHead className="text-right">COC %</TableHead>
                    <TableHead className="text-right">COC Amount</TableHead>
                    <TableHead className="text-right">
                      Revenue Post COC
                    </TableHead>
                    <TableHead className="text-right">Yahoo %</TableHead>
                    <TableHead className="text-right">OneFootball %</TableHead>
                    <TableHead className="text-right">Yahoo Final</TableHead>
                    <TableHead className="text-right">
                      OneFootball Final
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {result.contentType}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            result.mediaType === "Text"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {result.mediaType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(result.grossRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(result.cos)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(result.revenuePostCOS)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(result.coc)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(result.cocAmount)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(result.revenuePostCOC)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(result.yahooRevShare)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(result.onefootballRevShare)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-600">
                        {formatCurrency(result.yahooFinal)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-blue-600">
                        {formatCurrency(result.onefootballFinal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-slate-600">
                    Total Gross Revenue
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      results.reduce((sum, r) => sum + r.grossRevenue, 0)
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-slate-600">
                    Total Yahoo Revenue
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      results.reduce((sum, r) => sum + r.yahooFinal, 0)
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-slate-600">
                    Total OneFootball Revenue
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      results.reduce((sum, r) => sum + r.onefootballFinal, 0)
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
