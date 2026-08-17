"use client";

import { Plus, DollarSign, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, AlertCircle, CheckCircle, Clock, Home, Building2, User, Filter } from "lucide-react";
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

export interface MonthlyRent {
  id: string;
  billing_month: string;
  due_date: string;
  rent_amount: number;
  paid_amount: number;
  balance: number;
  status: string;
  contracts: {
    contract_number: string;
    customers: { name: string; mobile: string | null } | null;
    properties: { name: string } | null;
    flats: { flat_number: string } | null;
  } | null;
  created_at: string;
}

interface RentTableProps {
  rentRecords: MonthlyRent[];
  count: number;
  pageNum: number;
  search: string;
  status: string;
  month: string;
}

export function RentTable({ rentRecords, count, pageNum, search, status, month }: RentTableProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7) + "-01";
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const columns = [
    {
      key: "billing_month",
      header: "Billing Month",
      sortable: true,
      render: (row: MonthlyRent) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-mono">{row.billing_month ? new Date(row.billing_month).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}</span>
        </div>
      ),
    },
    {
      key: "contracts.contract_number",
      header: "Contract",
      sortable: true,
      render: (row: MonthlyRent) => (
        <p className="font-mono text-sm">{row.contracts?.contract_number || "—"}</p>
      ),
    },
    {
      key: "contracts.customers.name",
      header: "Customer",
      sortable: true,
      render: (row: MonthlyRent) => (
        <div>
          <p className="font-medium">{row.contracts?.customers?.name || "—"}</p>
          <p className="text-xs text-gray-500">{row.contracts?.customers?.mobile || "—"}</p>
        </div>
      ),
    },
    {
      key: "contracts.properties.name",
      header: "Property",
      sortable: true,
      render: (row: MonthlyRent) => (
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
      render: (row: MonthlyRent) => (
        <div className="flex items-center gap-2">
          <Home className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-mono">{row.contracts?.flats?.flat_number || "—"}</span>
        </div>
      ),
    },
    {
      key: "due_date",
      header: "Due Date",
      sortable: true,
      render: (row: MonthlyRent) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>{row.due_date ? new Date(row.due_date).toLocaleDateString() : "—"}</span>
        </div>
      ),
    },
    {
      key: "rent_amount",
      header: "Rent Amount",
      sortable: true,
      render: (row: MonthlyRent) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          <span>{formatCurrency(row.rent_amount)}</span>
        </div>
      ),
    },
    {
      key: "paid_amount",
      header: "Paid",
      sortable: true,
      render: (row: MonthlyRent) => (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>{formatCurrency(row.paid_amount)}</span>
        </div>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      sortable: true,
      render: (row: MonthlyRent) => (
        <div className={cn("flex items-center gap-2", row.balance > 0 ? "text-red-600" : "text-green-600")}>
          {row.balance > 0 ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
          <span className="font-medium">{formatCurrency(row.balance)}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: MonthlyRent) => (
        <Badge className={cn("capitalize", STATUS_COLORS[row.status])}>{row.status}</Badge>
      ),
    },
  ];

  const actions = (row: MonthlyRent) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-1 hover:bg-gray-100 rounded transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/rent/${row.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/rent/${row.id}/edit`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Record Payment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 flex items-center gap-2 cursor-pointer" onClick={() => {}}>
          <Trash2 className="h-4 w-4" />
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const totalPages = Math.ceil(count / 10);
  const searchParamsObj = new URLSearchParams({ page: pageNum.toString() });
  if (search) searchParamsObj.set("search", search);
  if (status !== "all") searchParamsObj.set("status", status);
  if (month !== "all") searchParamsObj.set("month", month);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Rent</h1>
          <p className="text-gray-500">Track and manage monthly rent collections</p>
        </div>
        <Link href="/dashboard/rent/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Rent Record
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 pt-0">
          <form action={`/dashboard/rent?${searchParamsObj.toString()}`} method="GET" className="flex flex-wrap gap-4 items-end">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Search rent records..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Select name="status" defaultValue={status}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
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
          <CardTitle>Monthly Rent Records ({count} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<MonthlyRent>
            data={rentRecords}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchable={false}
            sortable={false}
            actions={actions}
            emptyMessage="No rent records found."
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Page {pageNum} of {totalPages} ({count} total)
              </span>
              <div className="flex gap-2">
                {pageNum > 1 && (
                  <a
                    href={`/dashboard/rent?page=${pageNum - 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}${month !== "all" ? `&month=${month}` : ""}`}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}
                {pageNum < totalPages && (
                  <a
                    href={`/dashboard/rent?page=${pageNum + 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}${month !== "all" ? `&month=${month}` : ""}`}
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