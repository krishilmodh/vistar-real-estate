"use client";

import { Plus, Home, Search, MoreHorizontal, Edit, Trash2, Eye, Building2, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Flat {
  id: string;
  flat_number: string;
  block: string | null;
  floor: string | null;
  owner_name: string | null;
  owner_contact: string | null;
  status: string;
  properties: { id: string; name: string } | null;
  created_at: string;
}

interface FlatsTableProps {
  flats: Flat[];
  count: number;
  pageNum: number;
  search: string;
}

export function FlatsTable({ flats, count, pageNum, search }: FlatsTableProps) {
  const columns = [
    {
      key: "flat_number",
      header: "Flat No.",
      sortable: true,
      render: (row: Flat) => (
        <div>
          <p className="font-medium">{row.flat_number}</p>
          <p className="text-xs text-gray-500">
            {row.block ? `Block ${row.block}` : ""} {row.floor ? `| Floor ${row.floor}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "properties.name",
      header: "Property",
      sortable: true,
      render: (row: Flat) => <span className="font-medium">{row.properties?.name || "—"}</span>,
    },
    {
      key: "owner_name",
      header: "Owner",
      sortable: true,
      render: (row: Flat) => (
        <div>
          <p className="font-medium">{row.owner_name || "—"}</p>
          <p className="text-xs text-gray-500">{row.owner_contact || "—"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Flat) => (
        <Badge className={cn("capitalize", STATUS_COLORS[row.status])}>{row.status.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      sortable: true,
      render: (row: Flat) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const actions = (row: Flat) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-1 hover:bg-gray-100 rounded transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/flats/${row.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.location.href = `/dashboard/flats/${row.id}/edit`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (confirm("Are you sure you want to delete this flat?")) {
              window.location.href = `/dashboard/flats?page=${pageNum}${search ? `&search=${search}` : ""}&delete=${row.id}`;
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
          <h1 className="text-2xl font-bold text-gray-900">Flats</h1>
          <p className="text-gray-500">Manage flats across properties</p>
        </div>
        <Link href="/dashboard/flats/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Flat
          </Button>
        </Link>
      </div>

      <div className="relative w-full sm:w-64 mb-4">
        <form action={`/dashboard/flats?${searchParamsObj.toString()}`} method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="search"
            placeholder="Search flats..."
            defaultValue={search}
            className="pl-10"
          />
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Flats ({count} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<Flat>
            data={flats}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchable={false}
            sortable={false}
            actions={actions}
            emptyMessage="No flats found. Add your first flat to get started."
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Page {pageNum} of {totalPages} ({count} total)
              </span>
              <div className="flex gap-2">
                {pageNum > 1 && (
                  <a
                    href={`/dashboard/flats?page=${pageNum - 1}${search ? `&search=${search}` : ""}`}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}
                {pageNum < totalPages && (
                  <a
                    href={`/dashboard/flats?page=${pageNum + 1}${search ? `&search=${search}` : ""}`}
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