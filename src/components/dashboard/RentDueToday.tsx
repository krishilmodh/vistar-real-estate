"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { ExternalLink, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface RentDueTodayItem {
  id: string;
  billing_month: string;
  due_date: string;
  rent_amount: number;
  paid_amount: number;
  balance: number;
  status: string;
  customers: Array<{ name: string; mobile: string | null }>;
  flats: Array<{ flat_number: string; properties: Array<{ name: string }> }>;
}

export function RentDueToday() {
  const [data, setData] = useState<RentDueTodayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    supabase
      .from("monthly_rent")
      .select(`
        id,
        billing_month,
        due_date,
        rent_amount,
        paid_amount,
        balance,
        status,
        customers!inner(name, mobile),
        flats!inner(flat_number, properties!inner(name))
      `)
      .eq("due_date", today)
      .in("status", ["pending", "partial", "overdue"])
      .order("due_date")
      .limit(10)
      .then(({ data }: { data: RentDueTodayItem[] | null }) => {
        setData(data || []);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      partial: "default",
      overdue: "destructive",
      paid: "outline",
    };
    return <Badge variant={variants[status] || "secondary"} className="capitalize">{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Rent Due Today</CardTitle>
        <Link href="/rent?filter=due_today" className="text-sm text-primary hover:underline">
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
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-2" />
            <p>No rent due today</p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 font-medium text-gray-500">Customer</th>
                  <th className="text-left pb-2 font-medium text-gray-500">Flat</th>
                  <th className="text-right pb-2 font-medium text-gray-500">Amount</th>
                  <th className="text-center pb-2 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const customer = item.customers[0];
                  const flat = item.flats[0];
                  const property = flat?.properties[0];
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-medium">{customer?.name}</p>
                        <p className="text-xs text-gray-500">{customer?.mobile}</p>
                      </td>
                      <td className="py-3">
                        <p>{property?.name} - {flat?.flat_number}</p>
                      </td>
                      <td className="py-3 text-right font-medium">
                        {formatCurrency(item.balance)}
                      </td>
                      <td className="py-3 text-center">{getStatusBadge(item.status)}</td>
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