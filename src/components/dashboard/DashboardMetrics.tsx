"use client";

import { Building2, Home, FileText, DollarSign, CheckCircle, Clock, AlertCircle, Users, Calendar } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface DashboardMetricsProps {
  metrics: Array<{
    label: string;
    value: number | string;
    icon: string;
    trend?: { value: number; label: string } | null;
    currency?: boolean;
  }>;
}

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  FileText: <FileText className="h-6 w-6" />,
  DollarSign: <DollarSign className="h-6 w-6" />,
  CheckCircle: <CheckCircle className="h-6 w-6" />,
  Clock: <Clock className="h-6 w-6" />,
  AlertCircle: <AlertCircle className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Calendar: <Calendar className="h-6 w-6" />,
};

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          label={metric.label}
          value={metric.value}
          icon={iconMap[metric.icon] || <div className="h-6 w-6" />}
          trend={metric.trend}
          currency={metric.currency}
        />
      ))}
    </div>
  );
}