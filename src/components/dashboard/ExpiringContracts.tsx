"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, daysUntilDue } from "@/lib/utils/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpiringContractItem {
  id: string;
  contract_number: string;
  end_date: string | null;
  monthly_rent: number;
  status: string;
  customers: Array<{ name: string; mobile: string | null }>;
  flats: Array<{ flat_number: string; properties: Array<{ name: string }> }>;
}

export function ExpiringContracts() {
  const [data, setData] = useState<ExpiringContractItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    supabase
      .from("rental_contracts")
      .select(`
        id,
        contract_number,
        end_date,
        monthly_rent,
        status,
        customers!inner(name, mobile),
        flats!inner(flat_number, properties!inner(name))
      `)
      .eq("status", "active")
      .not("end_date", "is", null)
      .lte("end_date", ninetyDaysFromNow)
      .order("end_date")
      .limit(10)
      .then(({ data }: { data: ExpiringContractItem[] | null }) => {
        setData(data || []);
        setLoading(false);
      });
  }, []);

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const days = daysUntilDue(endDate);
    return days >= 0 ? days : 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Expiring Contracts (90 days)
        </CardTitle>
        <Link href="/dashboard/contracts?filter=expiring" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3 h-48">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-green-400 mb-2" />
            <p>No contracts expiring soon</p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 font-medium text-gray-500">Contract</th>
                  <th className="text-left pb-2 font-medium text-gray-500">Customer / Flat</th>
                  <th className="text-center pb-2 font-medium text-gray-500">Ends In</th>
                  <th className="text-right pb-2 font-medium text-gray-500">Monthly Rent</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const days = getDaysRemaining(item.end_date);
                  const isUrgent = days !== null && days <= 30;
                  const customer = item.customers[0];
                  const flat = item.flats[0];
                  const property = flat?.properties[0];
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-medium font-mono text-xs">{item.contract_number}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-medium">{customer?.name}</p>
                        <p className="text-xs text-gray-500">{property?.name} - {flat?.flat_number}</p>
                      </td>
                      <td className="py-3 text-center">
                        {days !== null ? (
                          <span className={cn("font-medium", isUrgent ? "text-red-600" : "text-gray-600")}>
                            {days} days
                          </span>
                        ) : (
                          <Badge variant="secondary">No end date</Badge>
                        )}
                      </td>
                      <td className="py-3 text-right font-medium">{formatCurrency(item.monthly_rent)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}