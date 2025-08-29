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
import { Upload, FileText, Bot, ArrowLeft } from "lucide-react";
import { TokenRuleEditor } from "@/components/token-rule-editor";
import { StandaloneChat } from "@/components/standalone-chat";

interface Contract {
  id: string;
  contractNumber: string;
  partnerName: string;
  product: string;
  uploadedAt: Date;
  fileName: string;
}

type PageView = "home" | "contracts" | "ruleEditor" | "chat";

export default function RuleEngineApp() {
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: "1",
      contractNumber: "CTR-2024-001",
      partnerName: "TechCorp Solutions",
      product: "Software License",
      uploadedAt: new Date("2024-01-15"),
      fileName: "techcorp_contract.pdf",
    },
    {
      id: "2",
      contractNumber: "CTR-2024-002",
      partnerName: "Global Media Inc",
      product: "Content Distribution",
      uploadedAt: new Date("2024-02-01"),
      fileName: "global_media_agreement.pdf",
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate contract upload
      const newContract: Contract = {
        id: Date.now().toString(),
        contractNumber: `CTR-2024-${contracts.length + 1}`.padStart(11, "0"),
        partnerName: file.name.split(".")[0].replace(/[_-]/g, " "),
        product: "Uploaded Contract",
        uploadedAt: new Date(),
        fileName: file.name,
      };
      setContracts([...contracts, newContract]);
      setCurrentPage("contracts");
    }
  };

  const handleContractSelect = (contractId: string) => {
    setSelectedContractId(contractId);
    setCurrentPage("ruleEditor");
  };

  const selectedContract = contracts.find((c) => c.id === selectedContractId);

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
            <div className="flex items-center gap-2">
              {currentPage !== "home" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage("home")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              )}
              {currentPage === "ruleEditor" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage("contracts")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Contracts
                </Button>
              )}
              {currentPage === "home" && contracts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage("contracts")}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Contracts ({contracts.length})
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("chat")}
                className="gap-2"
              >
                <Bot className="h-4 w-4" />
                Chat
              </Button>
            </div>
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
                    <Button
                      onClick={() =>
                        document.getElementById("contract-upload")?.click()
                      }
                      className="w-full"
                    >
                      Choose File
                    </Button>
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Your Contracts
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Select a contract to create and edit rules
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contracts.map((contract) => (
                <Card
                  key={contract.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleContractSelect(contract.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {contract.contractNumber}
                    </CardTitle>
                    <CardDescription>{contract.partnerName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Product:
                        </span>
                        <span className="font-medium">{contract.product}</span>
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
                  </CardContent>
                </Card>
              ))}
            </div>

            {contracts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No contracts uploaded yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Go back to home to upload your first contract
                </p>
                <Button onClick={() => setCurrentPage("home")}>
                  Upload Contract
                </Button>
              </div>
            )}
          </div>
        )}

        {currentPage === "ruleEditor" && selectedContract && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Rule Editor
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedContract.contractNumber} -{" "}
                {selectedContract.partnerName}
              </p>
            </div>

            {/* Import the existing TokenRuleEditor component */}
            <TokenRuleEditor />
          </div>
        )}

        {currentPage === "chat" && (
          <div className="mx-auto max-w-4xl">
            <StandaloneChat />
          </div>
        )}
      </div>
    </div>
  );
}
