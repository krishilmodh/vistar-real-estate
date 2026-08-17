"use client";

import { Plus, FileText, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, DollarSign, Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Contract {
  id: string;
  contract_number: string;
  customers: { id: string; name: string; mobile: string | null } | null;
  properties: { id: string; name: string } | null;
  flats: { id: string; flat_number: string } | null;
  start_date: string;
  end_date: string | null;
  monthly_rent: number;
  security_deposit: number;
  billing_day: number;
  due_date: number;
  status: string;
  created_at: string;
}

interface ContractsTableProps {
  contracts: Contract[];
  count: number;
  pageNum: number;
  search: string;
}

export function ContractsTable({ contracts, count, pageNum, search }: ContractsTableProps) {
  const columns = [
    {
      key: "contract_number",
      header: "Contract No.",
      sortable: true,
      render: (row: Contract) => (
        <div>
          <p className="font-medium font-mono text-sm">{row.contract_number}</p>
          <p className="text-xs text-gray-500">Billing: {row.billing_day} | Due: {row.due_date}</p>
        </div>
      ),
    },
    {
      key: "customers.name",
      header: "Customer",
      sortable: true,
      render: (row: Contract) => (
        <div>
          <p className="font-medium">{row.customers?.name || "—"}</p>
          <p className="text-xs text-gray-500">{row.customers?.mobile || "—"}</p>
        </div>
      ),
    },
    {
      key: "properties.name",
      header: "Property",
      sortable: true,
      render: (row: Contract) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-gray-400" />
          <span>{row.properties?.name || "—"}</span>
        </div>
      ),
    },
    {
      key: "flats.flat_number",
      header: "Flat",
      sortable: true,
      render: (row: Contract) => (
        <div className="flex items-center gap-2">
          <Home className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-mono">{row.flats?.flat_number || "—"}</span>
        </div>
      ),
    },
    {
      key: "monthly_rent",
      header: "Monthly Rent",
      sortable: true,
      render: (row: Contract) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          <span>{formatCurrency(row.monthly_rent)}</span>
        </div>
      ),
    },
    {
      key: "security_deposit",
      header: "Deposit",
      sortable: true,
      render: (row: Contract) => formatCurrency(row.security_deposit),
    },
    {
      key: "start_date",
      header: "Start Date",
      sortable: true,
      render: (row: Contract) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>{new Date(row.start_date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: "end_date",
      header: "End Date",
      sortable: true,
      render: (row: Contract) => row.end_date
        ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{new Date(row.end_date).toLocaleDateString()}</span>
          </div>
        )
        : <span className="text-gray-400">—</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Contract) => (
        <Badge className={cn("capitalize", STATUS_COLORS[row.status])}>{row.status}</Badge>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      sortable: true,
      render: (row: Contract) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const actions = (row: Contract) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-1 hover:bg-gray-100 rounded transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/contracts/${row.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/contracts/${row.id}/edit`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (confirm("Are you sure you want to delete this contract?")) {
              window.location.href = `/dashboard/contracts?page=${pageNum}${search ? `&search=${search}` : ""}&delete=${row.id}`;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-500">Manage rental contracts</p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contract
          </Button>
        </Link>
      </div>

      <div className="relative w-full sm:w-64 mb-4">
        <form action={`/dashboard/contracts?${searchParamsObj.toString()}`} method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="search"
            placeholder="Search contracts..."
            defaultValue={search}
            className="pl-10"
          />
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contracts ({count} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<Contract>
            data={contracts}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchable={false}
            sortable={false}
            actions={actions}
            emptyMessage="No contracts found. Add your first contract to get started."
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Page {pageNum} of {totalPages} ({count} total)
              </span>
              <div className="flex gap-2">
                {pageNum > 1 && (
                  <a
                    href={`/dashboard/contracts?page=${pageNum - 1}${search ? `&search=${search}` : ""}`}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}
                {pageNum < totalPages && (
                  <a
                    href={`/dashboard/contracts?page=${pageNum + 1}${search ? `&search=${search}` : ""}`}
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