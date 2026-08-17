"use client";

import { useState } from "react";
import { FileSpreadsheet, Download, Eye, AlertCircle, CheckCircle, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastProvider } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ImportLog {
  id: string;
  entity_type: string;
  file_name: string;
  total_rows: number;
  created_count: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  error_details: unknown;
  created_at: string;
  created_by: string | null;
}

interface ImportStep {
  id: number;
  title: string;
  description: string;
  complete: boolean;
  active: boolean;
}

const mockImportLogs: ImportLog[] = [
  {
    id: "1",
    entity_type: "customers",
    file_name: "customers_august_2024.xlsx",
    total_rows: 50,
    created_count: 45,
    updated_count: 3,
    skipped_count: 2,
    failed_count: 0,
    error_details: null,
    created_at: "2024-08-10T10:30:00Z",
    created_by: "admin@vistar.com",
  },
  {
    id: "2",
    entity_type: "flats",
    file_name: "flats_bulk_upload.xlsx",
    total_rows: 120,
    created_count: 110,
    updated_count: 5,
    skipped_count: 3,
    failed_count: 2,
    error_details: { rows: [5, 42] },
    created_at: "2024-08-05T14:20:00Z",
    created_by: "manager@vistar.com",
  },
  {
    id: "3",
    entity_type: "properties",
    file_name: "new_properties.xlsx",
    total_rows: 10,
    created_count: 10,
    updated_count: 0,
    skipped_count: 0,
    failed_count: 0,
    error_details: null,
    created_at: "2024-07-28T09:15:00Z",
    created_by: "admin@vistar.com",
  },
];

const entityOptions = [
  { value: "properties", label: "Properties" },
  { value: "flats", label: "Flats" },
  { value: "customers", label: "Customers" },
  { value: "contracts", label: "Contracts" },
  { value: "payments", label: "Payments" },
];

const importSteps: ImportStep[] = [
  { id: 1, title: "Upload File", description: "Select and upload your Excel/CSV file", complete: false, active: false },
  { id: 2, title: "Map Columns", description: "Match file columns to system fields", complete: false, active: false },
  { id: 3, title: "Validate Data", description: "Review and fix validation errors", complete: false, active: false },
  { id: 4, title: "Preview & Confirm", description: "Review changes before importing", complete: false, active: false },
  { id: 5, title: "Complete", description: "Import completed successfully", complete: false, active: false },
];

const templates: Record<string, string[]> = {
  properties: ["name", "address", "city", "area", "status", "notes"],
  flats: ["property_name", "flat_number", "block", "floor", "owner_name", "owner_contact", "status", "notes"],
  customers: ["name", "mobile", "whatsapp", "email", "address", "id_type", "id_number", "status", "notes"],
  contracts: ["contract_number", "customer_mobile", "property_name", "flat_number", "start_date", "end_date", "monthly_rent", "security_deposit", "billing_day", "due_date", "status", "notes"],
  payments: ["payment_number", "customer_mobile", "contract_number", "amount", "payment_date", "payment_method", "transaction_ref", "notes"],
};

export default function ImportsPage() {
  const [selectedEntity, setSelectedEntity] = useState<string>("customers");
  const handleEntityChange = (value: string | null) => { if (value) setSelectedEntity(value); };
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [importLogs] = useState<ImportLog[]>(mockImportLogs);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [toast, setToast] = useState<{ title: string; description: string; variant?: "default" | "destructive" } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setToast({ title: "Invalid file type", description: "Please upload an Excel (.xlsx, .xls) or CSV file", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      setCurrentStep(2);
      setToast({ title: "File uploaded", description: `${selectedFile.name} ready for import` });
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 3) {
        // Simulate validation
        setPreviewData([
          { name: "John Doe", mobile: "9876543210", email: "john@example.com", status: "active" },
          { name: "Jane Smith", mobile: "9876543211", email: "jane@example.com", status: "active" },
          { name: "Bob Wilson", mobile: "invalid", email: "bob@example.com", status: "active" }, // Error row
        ]);
      }
    }
  };

  const handleImport = async () => {
    setIsProcessing(true);
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setImportProgress(100);
      setIsProcessing(false);
      setCurrentStep(5);
      setToast({ title: "Import Complete", description: "Data imported successfully" });
      setFile(null);
    }, 2000);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setFile(null);
    setPreviewData([]);
    setImportProgress(0);
  };

  const downloadTemplate = () => {
    const headers = templates[selectedEntity];
    const csv = headers.join(",") + "\n" + headers.map(() => "").join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedEntity}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEntityLabel = (entity: string) => entityOptions.find(e => e.value === entity)?.label || entity;

  const getStatusColor = (log: ImportLog) => {
    if (log.failed_count > 0) return "bg-red-100 text-red-800";
    if (log.skipped_count > 0) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (log: ImportLog) => {
    if (log.failed_count > 0) return "Partial";
    if (log.skipped_count > 0) return "Completed (with skips)";
    return "Completed";
  };

  return (
    <ToastProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Import</h1>
            <p className="text-gray-500">Import properties, flats, customers, contracts, and payments from Excel/CSV files</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTemplate} disabled={!selectedEntity}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>

        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">
              <Plus className="h-4 w-4 mr-2" />
              New Import
            </TabsTrigger>
            <TabsTrigger value="history">
              Import History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Wizard</CardTitle>
                <CardDescription>Follow the steps to import your data</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {importSteps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center relative">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                            step.complete
                              ? "bg-green-500 text-white"
                              : step.active
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-200 text-gray-500"
                          )}
                        >
                          {step.complete ? <CheckCircle className="h-5 w-5" /> : step.id}
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-xs font-medium text-gray-900">{step.title}</p>
                          <p className="text-xs text-gray-500 max-w-[100px]">{step.description}</p>
                        </div>
                        {index < importSteps.length - 1 && (
                          <div
                            className={cn(
                              "absolute top-5 left-[50%] w-full h-1",
                              step.complete ? "bg-green-500" : "bg-gray-200"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900">Drag & drop your file here</p>
                      <p className="text-gray-500 mt-1">or click to browse</p>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        ref={(el) => el?.click()}
                      />
                      <Button variant="outline" className="mt-4" onClick={() => document.getElementById("file-upload")?.click()}>
                        Browse Files
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                      Supported formats: .xlsx, .xls, .csv (Max 10MB)
                    </div>

                    <div className="border-t pt-6">
                      <Label className="block text-sm font-medium mb-2">Entity Type</Label>
                      <Select value={selectedEntity} onValueChange={handleEntityChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select entity type" />
                        </SelectTrigger>
                        <SelectContent>
                          {entityOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">Download the template for the selected entity type</p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && file && (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="h-8 w-8 text-green-500" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB • {file.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => { setFile(null); setCurrentStep(1); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      File selected. Click Next to map columns.
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-500">Review column mappings and fix any issues</p>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">File Column</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">System Field</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {templates[selectedEntity].map(field => (
                            <tr key={field}>
                              <td className="px-4 py-3 text-sm">{field}</td>
                              <td className="px-4 py-3 text-sm">
                                <Select defaultValue={field}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {templates[selectedEntity].map(f => (
                                      <SelectItem key={f} value={f}>{f}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={cn(field === "mobile" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800")}>
                                  {field === "mobile" ? "Review" : "Mapped"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {currentStep === 4 && previewData.length > 0 && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-500">Preview first {previewData.length} rows. Fix errors before importing.</p>
                    <div className="border rounded-lg overflow-hidden max-h-96 overflow-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            {Object.keys(previewData[0]).map(key => (
                              <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{key}</th>
                            ))}
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {previewData.map((row, i) => (
                            <tr key={i} className={cn(i === 2 && "bg-red-50")}>
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="px-4 py-3 text-sm">{String(val)}</td>
                              ))}
                              <td className="px-4 py-3">
                                {i === 2 ? (
                                  <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Invalid mobile
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Valid
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> 2 valid</span>
                      <span className="flex items-center gap-1 text-red-600"><AlertCircle className="h-3.5 w-3.5" /> 1 error</span>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Completed!</h3>
                    <p className="text-gray-500 mb-6">Your data has been successfully imported.</p>
                    <Button onClick={resetWizard}>Import Another File</Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 5 && (
                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 1}>
                      Previous
                    </Button>
                    {currentStep === 4 ? (
                      <Button onClick={handleImport} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Importing... {importProgress}%
                          </>
                        ) : (
                          "Import Data"
                        )}
                      </Button>
                    ) : (
                      <Button onClick={handleNextStep} disabled={currentStep === 2 && !file}>
                        Next
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Import History</CardTitle>
                <CardDescription>Recent import operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">File Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Entity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Rows</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Updated</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Skipped</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Failed</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {importLogs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono">{log.file_name}</td>
                          <td className="px-4 py-3 text-sm capitalize">{getEntityLabel(log.entity_type)}</td>
                          <td className="px-4 py-3 text-sm">{log.total_rows}</td>
                          <td className="px-4 py-3 text-sm text-green-600">{log.created_count}</td>
                          <td className="px-4 py-3 text-sm text-blue-600">{log.updated_count}</td>
                          <td className="px-4 py-3 text-sm text-yellow-600">{log.skipped_count}</td>
                          <td className="px-4 py-3 text-sm text-red-600">{log.failed_count}</td>
                          <td className="px-4 py-3">
                            <Badge className={getStatusColor(log)}>{getStatusText(log)}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{new Date(log.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {toast && (
        <div className={cn(
          "fixed bottom-4 right-4 z-50 animate-slide-in px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]",
          toast.variant === "destructive" ? "bg-red-600 text-white" : "bg-green-600 text-white"
        )}>
          <div>
            <p className="font-medium">{toast.title}</p>
            <p className="text-sm opacity-90">{toast.description}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:text-gray-200" onClick={() => setToast(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </ToastProvider>
  );
}