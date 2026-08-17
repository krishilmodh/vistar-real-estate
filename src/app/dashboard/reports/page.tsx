"use client";

import { useState } from "react";
import { BarChart3, DollarSign, Users, Building2, Home, FileText, Download, Calendar, Filter, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface ReportData {
  collection: {
    month: string;
    collected: number;
    expected: number;
    pending: number;
    overdue: number;
  }[];
  propertyWise: {
    property: string;
    flats: number;
    occupied: number;
    expected: number;
    collected: number;
    pending: number;
  }[];
  customerWise: {
    customer: string;
    flat: string;
    contract: string;
    monthlyRent: number;
    paid: number;
    balance: number;
    status: string;
  }[];
  pending: {
    customer: string;
    flat: string;
    property: string;
    dueDate: string;
    amount: number;
    daysOverdue: number;
  }[];
  overdue: {
    customer: string;
    flat: string;
    property: string;
    dueDate: string;
    amount: number;
    daysOverdue: number;
  }[];
}

const mockReportData: ReportData = {
  collection: [
    { month: "2024-03", collected: 450000, expected: 500000, pending: 30000, overdue: 20000 },
    { month: "2024-04", collected: 480000, expected: 520000, pending: 25000, overdue: 15000 },
    { month: "2024-05", collected: 510000, expected: 510000, pending: 0, overdue: 0 },
    { month: "2024-06", collected: 490000, expected: 530000, pending: 20000, overdue: 20000 },
    { month: "2024-07", collected: 520000, expected: 520000, pending: 0, overdue: 0 },
    { month: "2024-08", collected: 380000, expected: 550000, pending: 120000, overdue: 50000 },
  ],
  propertyWise: [
    { property: "Applewood", flats: 12, occupied: 10, expected: 150000, collected: 140000, pending: 10000 },
    { property: "Shilp", flats: 20, occupied: 18, expected: 320000, collected: 300000, pending: 20000 },
    { property: "Turquoise", flats: 8, occupied: 6, expected: 132000, collected: 110000, pending: 22000 },
    { property: "Kavisha", flats: 15, occupied: 12, expected: 180000, collected: 165000, pending: 15000 },
    { property: "Shyam", flats: 10, occupied: 8, expected: 128000, collected: 120000, pending: 8000 },
  ],
  customerWise: [
    { customer: "Applewood J-902", flat: "J-902", contract: "CON-2024-001", monthlyRent: 15000, paid: 15000, balance: 0, status: "paid" },
    { customer: "Shilp I-1404", flat: "I-1404", contract: "CON-2024-002", monthlyRent: 18000, paid: 10000, balance: 8000, status: "partial" },
    { customer: "Turquoise A-901", flat: "A-901", contract: "CON-2024-003", monthlyRent: 22000, paid: 0, balance: 22000, status: "pending" },
    { customer: "Kavisha C-903", flat: "C-903", contract: "CON-2024-004", monthlyRent: 12000, paid: 0, balance: 12000, status: "overdue" },
    { customer: "Shyam F-703", flat: "F-703", contract: "CON-2024-005", monthlyRent: 16000, paid: 16000, balance: 0, status: "paid" },
  ],
  pending: [
    { customer: "Shilp I-1404", flat: "I-1404", property: "Shilp", dueDate: "2024-08-05", amount: 8000, daysOverdue: 0 },
    { customer: "Turquoise A-901", flat: "A-901", property: "Turquoise", dueDate: "2024-08-05", amount: 22000, daysOverdue: 0 },
    { customer: "Kavisha C-903", flat: "C-903", property: "Kavisha", dueDate: "2024-07-05", amount: 12000, daysOverdue: 27 },
  ],
  overdue: [
    { customer: "Kavisha C-903", flat: "C-903", property: "Kavisha", dueDate: "2024-07-05", amount: 12000, daysOverdue: 27 },
    { customer: "Applewood J-902", flat: "J-902", property: "Applewood", dueDate: "2024-07-05", amount: 15000, daysOverdue: 27 },
  ],
};

const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  return { value: date.toISOString().slice(0, 7), label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }) };
});

const reportTypes = [
  { id: "collection", label: "Collection Report", icon: DollarSign, description: "Monthly collection vs expected" },
  { id: "property", label: "Property-wise Report", icon: Building2, description: "Revenue per property" },
  { id: "customer", label: "Customer-wise Report", icon: Users, description: "Individual customer balances" },
  { id: "pending", label: "Pending Report", icon: FileText, description: "Current pending payments" },
  { id: "overdue", label: "Overdue Report", icon: TrendingDown, description: "Overdue payments tracking" },
];

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(months[0].value);
  const [activeReport, setActiveReport] = useState<string>("collection");
  const handleMonthChange = (value: string | null) => { if (value) setSelectedMonth(value); };

  const currentMonthData = mockReportData.collection.find(m => m.month === selectedMonth) || mockReportData.collection[0];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-800",
      partial: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
    };
    return <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", colors[status])}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">View and export business reports</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Expected</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonthData.expected)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Collected</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(currentMonthData.collected)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(currentMonthData.pending)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(currentMonthData.overdue)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Trend Chart (placeholder) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Collection Trend</CardTitle>
          <CardDescription>Last 6 months collection vs expected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around gap-2 px-4 py-4">
            {mockReportData.collection.map((month, i) => (
              <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex gap-1 justify-center h-48 items-end">
                  <div
                    className="w-8 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${(month.expected / 550000) * 100}%` }}
                    title={`Expected: ${formatCurrency(month.expected)}`}
                  />
                  <div
                    className="w-8 bg-green-500 rounded-t transition-all hover:bg-green-600"
                    style={{ height: `${(month.collected / 550000) * 100}%` }}
                    title={`Collected: ${formatCurrency(month.collected)}`}
                  />
                </div>
                <span className="text-xs text-gray-500">{month.month.slice(5)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> Expected</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> Collected</div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="collection" onValueChange={setActiveReport}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          {reportTypes.map(type => (
            <TabsTrigger key={type.id} value={type.id} className="gap-2 py-3">
              <type.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{type.label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="collection">
          <Card>
            <CardHeader>
              <CardTitle>Collection Report - {months.find(m => m.value === selectedMonth)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expected</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Collected</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Collection %</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pending</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockReportData.collection.map(row => (
                      <tr key={row.month} className={cn("hover:bg-gray-50", row.month === selectedMonth && "bg-blue-50 font-medium")}>
                        <td className="px-4 py-3 text-sm">{row.month.slice(0, 7)}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(row.expected)}</td>
                        <td className="px-4 py-3 text-sm text-green-600">{formatCurrency(row.collected)}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {row.expected > 0 ? `${((row.collected / row.expected) * 100).toFixed(1)}%` : "0%"}
                        </td>
                        <td className="px-4 py-3 text-sm text-yellow-600">{formatCurrency(row.pending)}</td>
                        <td className="px-4 py-3 text-sm text-red-600">{formatCurrency(row.overdue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="property">
          <Card>
            <CardHeader>
              <CardTitle>Property-wise Revenue Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Flats</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Occupied</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Occupancy %</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expected</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Collected</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockReportData.propertyWise.map(row => (
                      <tr key={row.property} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{row.property}</td>
                        <td className="px-4 py-3 text-sm">{row.flats}</td>
                        <td className="px-4 py-3 text-sm">{row.occupied}</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600">
                          {((row.occupied / row.flats) * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(row.expected)}</td>
                        <td className="px-4 py-3 text-sm text-green-600">{formatCurrency(row.collected)}</td>
                        <td className="px-4 py-3 text-sm text-yellow-600">{formatCurrency(row.pending)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Customer-wise Balance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Flat</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contract</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Monthly Rent</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Paid</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockReportData.customerWise.map(row => (
                      <tr key={row.customer} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{row.customer}</td>
                        <td className="px-4 py-3 text-sm font-mono">{row.flat}</td>
                        <td className="px-4 py-3 text-sm font-mono text-xs">{row.contract}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(row.monthlyRent)}</td>
                        <td className="px-4 py-3 text-sm text-green-600">{formatCurrency(row.paid)}</td>
                        <td className={cn("px-4 py-3 text-sm font-medium", row.balance > 0 ? "text-red-600" : "text-green-600")}>
                          {formatCurrency(row.balance)}
                        </td>
                        <td className="px-4 py-3 text-sm">{getStatusBadge(row.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Flat</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockReportData.pending.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{row.customer}</td>
                        <td className="px-4 py-3 text-sm font-mono">{row.flat}</td>
                        <td className="px-4 py-3 text-sm">{row.property}</td>
                        <td className="px-4 py-3 text-sm">{new Date(row.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatCurrency(row.amount)}</td>
                        <td className={cn("px-4 py-3 text-sm font-medium", row.daysOverdue > 0 ? "text-red-600" : "text-gray-900")}>
                          {row.daysOverdue > 0 ? `${row.daysOverdue} days` : "Due today"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payments Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Flat</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockReportData.overdue.map((row, i) => (
                      <tr key={i} className="hover:bg-red-50">
                        <td className="px-4 py-3 text-sm font-medium">{row.customer}</td>
                        <td className="px-4 py-3 text-sm font-mono">{row.flat}</td>
                        <td className="px-4 py-3 text-sm">{row.property}</td>
                        <td className="px-4 py-3 text-sm">{new Date(row.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-red-600">{formatCurrency(row.amount)}</td>
                        <td className="px-4 py-3 text-sm font-bold text-red-600">{row.daysOverdue} days</td>
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
  );
}