"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; label: string } | null;
  currency?: boolean;
  className?: string;
}

export function MetricCard({ label, value, icon, trend, currency = false, className }: MetricCardProps) {
  const displayValue = currency && typeof value === "number" ? formatCurrency(value) : value;

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 truncate">{displayValue}</p>
          {trend && (
            <p className={cn("mt-1 text-sm", trend.value >= 0 ? "text-green-600" : "text-red-600")}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}