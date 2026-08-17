"use client";

import { Plus, CreditCard, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, Building2, Home, User, DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  other: "Other",
};

export interface Payment {
  id: string;
  payment_number: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  transaction_ref: string | null;
  notes: string | null;
  customers: { name: string; mobile: string | null } | null;
  contracts: { 
    contract_number: string; 
    properties: { name: string } | null; 
    flats: { flat_number: string } | null 
  } | null;
  monthly_rent: { billing_month: string } | null;
  created_at: string;
}

interface PaymentsTableProps {
  payments: Payment[];
  count: number;
  pageNum: number;
  search: string;
  method: string;
  month: string;
}

export function PaymentsTable({ payments, count, pageNum, search, method, month }: PaymentsTableProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7) + "-01";
  });

  const methodOptions = [
    { value: "all", label: "All Methods" },
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "upi", label: "UPI" },
    { value: "other", label: "Other" },
  ];

  const columns = [
    {
      key: "payment_number",
      header: "Payment No.",
      sortable: true,
      render: (row: Payment) => (
        <p className="font-mono text-sm">{row.payment_number}</p>
      ),
    },
    {
      key: "payment_date",
      header: "Date",
      sortable: true,
      render: (row: Payment) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>{new Date(row.payment_date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: "customers.name",
      header: "Customer",
      sortable: true,
      render: (row: Payment) => (
        <div>
          <p className="font-medium">{row.customers?.name || "—"}</p>
          <p className="text-xs text-gray-500">{row.customers?.mobile || "—"}</p>
        </div>
      ),
    },
    {
      key: "contracts.contract_number",
      header: "Contract",
      sortable: true,
      render: (row: Payment) => (
        <p className="font-mono text-sm">{row.contracts?.contract_number || "—"}</p>
      ),
    },
    {
      key: "contracts.properties.name",
      header: "Property",
      sortable: true,
      render: (row: Payment) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-gray-400" />
          <span>{row.contracts?.properties?.name || "—"}</span>
        </div>
      ),
    },
    {
      key: "contracts.flats.flat_number",
      header: "Flat",
      sortable: true,
      render: (row: Payment) => (
        <div className="flex items-center gap-2">
          <Home className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-mono">{row.contracts?.flats?.flat_number || "—"}</span>
        </div>
      ),
    },
    {
      key: "monthly_rent.billing_month",
      header: "Billing Month",
      sortable: true,
      render: (row: Payment) => row.monthly_rent
        ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{new Date(row.monthly_rent.billing_month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
          </div>
        )
        : <span className="text-gray-400">— (Deposit)</span>,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (row: Payment) => (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <DollarSign className="h-3.5 w-3.5" />
          <span>{formatCurrency(row.amount)}</span>
        </div>
      ),
    },
    {
      key: "payment_method",
      header: "Method",
      sortable: true,
      render: (row: Payment) => (
        <Badge className="bg-blue-100 text-blue-800 capitalize">
          {PAYMENT_METHOD_LABELS[row.payment_method] || row.payment_method}
        </Badge>
      ),
    },
    {
      key: "transaction_ref",
      header: "Ref. Number",
      sortable: true,
      render: (row: Payment) => (
        <p className="font-mono text-xs text-gray-600">{row.transaction_ref || <span className="text-gray-400">—</span>}</p>
      ),
    },
  ];

  const actions = (row: Payment) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-1 hover:bg-gray-100 rounded transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/payments/${row.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/payments/${row.id}/edit`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (confirm("Are you sure you want to delete this payment?")) {
              const params = new URLSearchParams({ page: pageNum.toString() });
              if (search) params.set("search", search);
              if (method !== "all") params.set("method", method);
              if (month !== "all") params.set("month", month);
              params.set("delete", row.id);
              window.location.href = `/dashboard/payments?${params.toString()}`;
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const totalPages = Math.ceil(count / 10);
  const searchParamsObj = new URLSearchParams({ page: pageNum.toString() });
  if (search) searchParamsObj.set("search", search);
  if (method !== "all") searchParamsObj.set("method", method);
  if (month !== "all") searchParamsObj.set("month", month);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Manage rent payments and collections</p>
        </div>
        <Link href="/dashboard/payments/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 pt-0">
          <form action={`/dashboard/payments?${searchParamsObj.toString()}`} method="GET" className="flex flex-wrap gap-4 items-end">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Search payments..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Select name="method" defaultValue={method}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="month" defaultValue={month}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {new Date(month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Payments ({count} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<Payment>
            data={payments}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchable={false}
            sortable={false}
            actions={actions}
            emptyMessage="No payments found. Record your first payment to get started."
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Page {pageNum} of {totalPages} ({count} total)
              </span>
              <div className="flex gap-2">
                {pageNum > 1 && (
                  <a
                    href={`/dashboard/payments?page=${pageNum - 1}${search ? `&search=${search}` : ""}${method !== "all" ? `&method=${method}` : ""}${month !== "all" ? `&month=${month}` : ""}`}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}
                {pageNum < totalPages && (
                  <a
                    href={`/dashboard/payments?page=${pageNum + 1}${search ? `&search=${search}` : ""}${method !== "all" ? `&method=${method}` : ""}${month !== "all" ? `&month=${month}` : ""}`}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Next
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}