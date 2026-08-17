"use client";

import { Plus, Users, Search, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Customer {
  id: string;
  name: string;
  mobile: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  id_type: string | null;
  id_number: string | null;
  status: string;
  created_at: string;
}

interface CustomersTableProps {
  customers: Customer[];
  count: number;
  pageNum: number;
  search: string;
}

export function CustomersTable({ customers, count, pageNum, search }: CustomersTableProps) {
  const columns = [
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "mobile",
      header: "Mobile",
      sortable: true,
      render: (row: Customer) => (
        <div>
          <p className="font-medium">{row.mobile || "—"}</p>
          {row.whatsapp && row.whatsapp !== row.mobile && (
            <p className="text-xs text-gray-500">WA: {row.whatsapp}</p>
          )}
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (row: Customer) => row.email || <span className="text-gray-400">—</span>,
    },
    {
      key: "address",
      header: "Address",
      sortable: false,
      render: (row: Customer) => (
        <p className="text-sm max-w-xs truncate" title={row.address || ""}>{row.address || "—"}</p>
      ),
    },
    {
      key: "id_type",
      header: "ID",
      sortable: true,
      render: (row: Customer) => (
        <div>
          <p className="font-medium text-xs">{row.id_type || "—"}</p>
          <p className="text-xs text-gray-500 font-mono">{row.id_number || "—"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Customer) => (
        <Badge className={cn("capitalize", STATUS_COLORS[row.status])}>{row.status}</Badge>
      ),
    },
    {
      key: "created_at",
      header: "Added",
      sortable: true,
      render: (row: Customer) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const actions = (row: Customer) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-1 hover:bg-gray-100 rounded transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/customers/${row.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/customers/${row.id}/edit`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (confirm("Are you sure you want to delete this customer?")) {
              window.location.href = `/dashboard/customers?page=${pageNum}${search ? `&search=${search}` : ""}&delete=${row.id}`;
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500">Manage tenants and customers</p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </Link>
      </div>

      <div className="relative w-full sm:w-64 mb-4">
        <form action={`/dashboard/customers?${searchParamsObj.toString()}`} method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="search"
            placeholder="Search customers..."
            defaultValue={search}
            className="pl-10"
          />
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({count} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<Customer>
            data={customers}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchable={false}
            sortable={false}
            actions={actions}
            emptyMessage="No customers found. Add your first customer to get started."
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Page {pageNum} of {totalPages} ({count} total)
              </span>
              <div className="flex gap-2">
                {pageNum > 1 && (
                  <a
                    href={`/dashboard/customers?page=${pageNum - 1}${search ? `&search=${search}` : ""}`}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}
                {pageNum < totalPages && (
                  <a
                    href={`/dashboard/customers?page=${pageNum + 1}${search ? `&search=${search}` : ""}`}
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