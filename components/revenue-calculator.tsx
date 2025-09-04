"use client";

import { useState, useRef } from "react";
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
  Calculator,
  TrendingUp,
  DollarSign,
  Upload,
  X,
  FileText,
  Download,
} from "lucide-react";
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
  customCalculation: number; // (revenue post cos * cost of content) + (yahoo revenue share)
}

// Sample data based on sample_input_2.csv
const sampleData: RevenueData[] = [
  {
    id: "1",
    contentType: "OneFootball - Borussia Dortmund",
    mediaType: "Text",
    grossRevenue: 4.1,
  },
  {
    id: "2",
    contentType: "OneFootball - Borussia Dortmund",
    mediaType: "Video",
    grossRevenue: 8.25,
  },
  {
    id: "3",
    contentType: "OneFootball - Borussia Mönchengladbach",
    mediaType: "Video",
    grossRevenue: 3.87,
  },
];

export function RevenueCalculator({
  rules,
  contractInfo,
  onBack,
}: RevenueCalculatorProps) {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [uploadedData, setUploadedData] = useState<RevenueData[]>([]);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Use hardcoded default values as specified (ignoring extracted rules)
    const cos = 10; // Cost of Sales: Always 10%
    const coc = data.mediaType.toLowerCase() === "text" ? 12 : 50; // Cost of Content: 12% for text, 50% for video
    const yahooRevShare = 60; // Yahoo Revenue Share: Always 60%
    const onefootballRevShare = 40; // OneFootball Revenue Share: Always 40%

    // Step 1: Apply COS - Revenue Post COS = Gross Revenue * (1 - COS%)
    const revenuePostCOS = data.grossRevenue * (1 - cos / 100);

    // Step 2: Apply COC - Revenue Post COC = Revenue Post COS * (1 - COC%)
    const revenuePostCOC = revenuePostCOS * (1 - coc / 100);

    // Step 3: Calculate COC amount for final calculation
    const cocAmount = (coc / 100) * revenuePostCOS;

    // Step 4: Calculate RevShare = Yahoo RevShare % * Revenue Post COC
    const yahooAmount = (yahooRevShare / 100) * revenuePostCOC;
    const onefootballAmount = (onefootballRevShare / 100) * revenuePostCOC;

    // Step 5: Yahoo Final = RevShare (pure revenue share calculation)
    const yahooFinal = yahooAmount;
    const onefootballFinal = onefootballAmount;

    // Step 6: Custom calculation: (Revenue Post COS * Cost of Content %) + (Yahoo Revenue Share)
    const customCalculation = (revenuePostCOS * coc) / 100 + yahooAmount;

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
      customCalculation,
    };
  };

  // CSV parsing function that handles commas in numbers
  const parseCSV = (csvText: string): RevenueData[] => {
    const lines = csvText.trim().split("\n");

    // Skip the first line (stat,stat,,,stat,stat/rule,,stat,rule,,rule,,rule,,)
    // Use the second line as headers
    const headerLine = lines[1];

    // Parse CSV line properly handling quoted fields and commas in numbers
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase());

    // Debug: Let's see what we're working with
    console.log("Raw CSV first line:", lines[0]);
    console.log("Raw CSV header line:", headerLine);
    console.log("Headers after processing:", headers);

    // Find column indices - more flexible matching
    const contentTypeIndex = headers.findIndex(
      (h) =>
        h.includes("name") ||
        h.includes("content") ||
        h.includes("license") ||
        h.includes("partner")
    );
    const mediaTypeIndex = headers.findIndex(
      (h) => h.includes("license") || h.includes("media") || h.includes("type")
    );
    const revenueIndex = headers.findIndex(
      (h) => h.includes("revenue") || h.includes("gross")
    );

    // Debug: Show what we found
    console.log(
      "Content Type Index:",
      contentTypeIndex,
      "Media Type Index:",
      mediaTypeIndex,
      "Revenue Index:",
      revenueIndex
    );

    if (
      contentTypeIndex === -1 ||
      mediaTypeIndex === -1 ||
      revenueIndex === -1
    ) {
      throw new Error(
        "CSV must contain columns for content type, media type, and gross revenue"
      );
    }

    const data: RevenueData[] = [];

    for (let i = 2; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);

      if (
        values.length >=
        Math.max(contentTypeIndex, mediaTypeIndex, revenueIndex) + 1
      ) {
        // Remove commas from numbers (thousands separators) and parse
        const grossRevenueStr = values[revenueIndex].replace(/,/g, "");
        const grossRevenue = parseFloat(grossRevenueStr);

        if (!isNaN(grossRevenue)) {
          // Extract content type and media type from the name field
          const nameField = values[contentTypeIndex] || "";
          const licenseTypeField = values[mediaTypeIndex] || "";

          // Parse content type and media type from name field like "OneFootball - Borussia Dortmund (text)"
          let contentType = nameField;
          let mediaType = licenseTypeField || "Text";

          // If name field contains media type in parentheses, extract it
          const mediaTypeMatch = nameField.match(/\(([^)]+)\)$/);
          if (mediaTypeMatch) {
            contentType = nameField.replace(/\s*\([^)]+\)$/, ""); // Remove (text) or (video) from end
            mediaType = mediaTypeMatch[1]; // Extract text or video
          }

          data.push({
            id: i.toString(),
            contentType: contentType || "Unknown",
            mediaType: mediaType || "Text",
            grossRevenue: grossRevenue,
          });
        }
      }
    }

    return data;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);

        if (parsedData.length === 0) {
          setUploadError("No valid data found in CSV file");
          return;
        }

        setUploadedData(parsedData);
        setHasUploadedFile(true);
        setUploadError("");
        setResults([]); // Clear previous results
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Error parsing CSV file"
        );
      }
    };

    reader.readAsText(file);
  };

  // Clear uploaded file
  const clearUploadedFile = () => {
    setUploadedData([]);
    setHasUploadedFile(false);
    setUploadError("");
    setResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyRules = async () => {
    setIsCalculating(true);

    // Simulate processing time for demo effect
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Use uploaded data if available, otherwise fall back to sample data
    const dataToProcess = hasUploadedFile ? uploadedData : sampleData;

    const calculatedResults = dataToProcess.map((data) => {
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

  // Download results as CSV
  const downloadResultsAsCSV = () => {
    if (results.length === 0) return;

    // Create CSV headers
    const headers = [
      "Content Type",
      "Media Type",
      "Gross Revenue",
      "COS %",
      "Revenue Post COS",
      "COC %",
      "COC Amount",
      "Revenue Post COC",
      "Yahoo %",
      "OneFootball %",
      "Yahoo Final",
      "OneFootball Payout",
      "RevShare + COC",
    ];

    // Create CSV rows
    const csvRows = results.map((result) => [
      result.contentType,
      result.mediaType,
      result.grossRevenue.toFixed(2),
      (result.cos * 100).toFixed(1),
      result.revenuePostCOS.toFixed(2),
      (result.coc * 100).toFixed(1),
      result.cocAmount.toFixed(2),
      result.revenuePostCOC.toFixed(2),
      (result.yahooRevShare * 100).toFixed(1),
      (result.onefootballRevShare * 100).toFixed(1),
      result.yahooFinal.toFixed(2),
      result.onefootballFinal.toFixed(2),
      (result.yahooFinal + result.onefootballFinal).toFixed(2),
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `revenue_calculation_results_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* CSV Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Revenue Data
          </CardTitle>
          <CardDescription>
            Upload a CSV file with your revenue data to calculate distributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasUploadedFile ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Upload a CSV file with columns for content type, media type,
                  and gross revenue
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose CSV File
                </Button>
              </div>
              {uploadError && (
                <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {uploadError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      CSV file uploaded successfully
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {uploadedData.length} records loaded
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearUploadedFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Data Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {hasUploadedFile ? "Uploaded Revenue Data" : "Sample Revenue Data"}
          </CardTitle>
          <CardDescription>
            {hasUploadedFile
              ? `${uploadedData.length} records from uploaded CSV - Ready for rule application`
              : "Sample data from July 2025 - Ready for rule application"}
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
              {(hasUploadedFile ? uploadedData : sampleData).map((data) => (
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Calculation Results
                </CardTitle>
                <CardDescription>
                  Detailed breakdown showing COS, COC, and revenue share
                  calculations
                </CardDescription>
              </div>
              <Button
                onClick={downloadResultsAsCSV}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
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
                      OneFootball Payout
                    </TableHead>
                    <TableHead className="text-right">RevShare + COC</TableHead>
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
                      <TableCell className="text-right font-mono font-bold text-purple-600">
                        {formatCurrency(result.customCalculation)}
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
                    Total OneFootball Payout
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
