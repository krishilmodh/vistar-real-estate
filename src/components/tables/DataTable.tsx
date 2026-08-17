"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  sortable?: boolean;
  defaultSort?: { key: string; direction: "asc" | "desc" };
  selectable?: boolean;
  onSelectionChange?: (selected: Set<string>) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchKeys = [],
  sortable = true,
  defaultSort,
  selectable = false,
  onSelectionChange,
  emptyMessage = "No data available",
  className,
  rowClassName,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(defaultSort || null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(data.map(keyExtractor)) : new Set<string>();
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selected);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const filteredData = useMemo(() => {
    let result = data;

    if (search && searchKeys.length > 0) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const value = row[key];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key as keyof T];
        const bVal = b[sortConfig.key as keyof T];
        if (aVal === bVal) return 0;
        const direction = sortConfig.direction === "asc" ? 1 : -1;
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        return aStr > bStr ? direction : -direction;
      });
    }

    return result;
  }, [data, search, searchKeys, sortConfig]);

  const handleSort = (key: string) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const SortIcon = ({ key }: { key: string }) => {
    if (!sortConfig || sortConfig.key !== key) return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary" />
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectable && selected.size > 0 && (
            <div className="text-sm text-gray-500">{selected.size} selected</div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selected.size === filteredData.length && filteredData.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider",
                    column.className,
                    column.sortable && sortable && "cursor-pointer hover:bg-gray-100 select-none"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortable && <SortIcon key={column.key} />}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className={cn("hover:bg-gray-50 transition-colors", rowClassName?.(row))}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.has(keyExtractor(row))}
                        onCheckedChange={(checked) => handleSelectRow(keyExtractor(row), checked as boolean)}
                        aria-label="Select row"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-4 py-3 text-sm text-gray-900", column.className)}>
                      {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">{actions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {filteredData.length} of {data.length} results</span>
      </div>
    </div>
  );
}