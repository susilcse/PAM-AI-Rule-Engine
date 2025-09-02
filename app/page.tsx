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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  FileText,
  Bot,
  ArrowLeft,
  Home,
  FileBarChart,
  Loader2,
} from "lucide-react";

import { ContractSummaryPanel } from "@/components/contract-summary-panel";
import { RulesDisplayPage } from "@/components/rules-display-page";

interface Contract {
  id: string;
  contractNumber: string;
  partnerName: string;
  product: string;
  uploadedAt: Date;
  fileName: string;
}

type PageView = "home" | "contracts" | "rules";

export default function RuleEngineApp() {
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [summaryContractId, setSummaryContractId] = useState<string | null>(
    null
  );

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingContractId, setProcessingContractId] = useState<
    string | null
  >(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a PDF file only.");
      return;
    }

    // Create contract entry immediately
    const contractId = Date.now().toString();
    const newContract: Contract = {
      id: contractId,
      contractNumber: `CTR-2024-${String(contracts.length + 1).padStart(
        3,
        "0"
      )}`,
      partnerName: file.name
        .split(".")[0]
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      product: "Uploaded Contract",
      uploadedAt: new Date(),
      fileName: file.name,
    };

    // Add contract to list and show contracts page
    setContracts([...contracts, newContract]);
    setCurrentPage("contracts");

    // Start processing in background
    setIsProcessing(true);
    setProcessingContractId(contractId);

    try {
      console.log("🚀 Starting PDF analysis for:", file.name);

      // Prepare form data
      const formData = new FormData();
      formData.append("contract", file);
      formData.append("contractId", contractId);

      // Call our backend API
      const response = await fetch("/api/contracts/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze contract");
      }

      const result = await response.json();
      console.log("✅ Contract analysis completed:", result);

      alert(
        `Contract analysis completed! Found ${
          result.rules?.rules?.length || 0
        } rules.`
      );
    } catch (error: any) {
      console.error("❌ Contract analysis failed:", error);
      alert(`Failed to analyze contract: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setProcessingContractId(null);
    }

    // Clear the file input
    event.target.value = "";
  };

  const handleContractSelect = (contractId: string) => {
    setSelectedContractId(contractId);
    setCurrentPage("rules");
  };

  const handleSummaryToggle = (contractId: string) => {
    if (showSummaryPanel && summaryContractId === contractId) {
      setShowSummaryPanel(false);
      setSummaryContractId(null);
    } else {
      setShowSummaryPanel(true);
      setSummaryContractId(contractId);
    }
  };

  const selectedContract = contracts.find((c) => c.id === selectedContractId);
  const summaryContract = contracts.find((c) => c.id === summaryContractId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  PAM Rule Engine
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Contract Administration Assistant
                </p>
              </div>
            </div>
            <TooltipProvider>
              <div className="flex items-center gap-2">
                {currentPage !== "home" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage("home")}
                      >
                        <Home className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to Home</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {currentPage === "rules" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage("contracts")}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Back to Contracts</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {currentPage === "home" && contracts.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage("contracts")}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Contracts ({contracts.length})</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {currentPage === "home" && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Welcome to PAM Rule Engine
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Upload your contract to get started with AI-powered rule
                creation
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Upload className="h-5 w-5" />
                  Upload Contract
                </CardTitle>
                <CardDescription>
                  Select a contract file to begin creating rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-slate-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Drop your contract file here or click to browse
                    </p>
                    <input
                      type="file"
                      id="contract-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              document
                                .getElementById("contract-upload")
                                ?.click()
                            }
                            size="icon"
                            className="mx-auto"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentPage === "contracts" && (
          <div className="w-full mx-auto px-4">
            <div
              className={`${
                showSummaryPanel ? "grid grid-cols-[75%_25%] gap-6" : ""
              }`}
            >
              {/* Left side: Header + Contracts (75% when summary open, 100% when closed) */}
              <div className={`${showSummaryPanel ? "min-w-0" : "w-full"}`}>
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Your Contracts
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Select a contract to create rules or view AI-generated
                    summaries
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {contracts.map((contract) => (
                    <Card
                      key={contract.id}
                      className={`relative hover:shadow-lg transition-shadow ${
                        summaryContractId === contract.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {contract.contractNumber}
                        </CardTitle>
                        <CardDescription>
                          {contract.partnerName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">
                              Product:
                            </span>
                            <span className="font-medium">
                              {contract.product}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">
                              Uploaded:
                            </span>
                            <span className="font-medium">
                              {contract.uploadedAt.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">
                              File:
                            </span>
                            <span className="font-medium text-xs truncate">
                              {contract.fileName}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContractSelect(contract.id);
                                  }}
                                  disabled={
                                    processingContractId === contract.id
                                  }
                                >
                                  {processingContractId === contract.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Bot className="h-4 w-4 mr-2" />
                                      Rules
                                    </>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Create and edit rules</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={
                                    summaryContractId === contract.id
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSummaryToggle(contract.id);
                                  }}
                                >
                                  <FileBarChart className="h-4 w-4 mr-2" />
                                  Summary
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View AI-generated summary</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* No contracts message */}
                {contracts.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      No contracts uploaded yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Go back to home to upload your first contract
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setCurrentPage("home")}
                            size="icon"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload Contract</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>

              {/* Summary Panel */}
              {showSummaryPanel && summaryContract && (
                <ContractSummaryPanel
                  contract={summaryContract}
                  onClose={() => {
                    setShowSummaryPanel(false);
                    setSummaryContractId(null);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {currentPage === "rules" && selectedContract && (
          <RulesDisplayPage
            contract={selectedContract}
            onBack={() => setCurrentPage("contracts")}
          />
        )}
      </div>
    </div>
  );
}
