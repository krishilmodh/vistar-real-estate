"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Banknote, CreditCard, Wallet, Smartphone } from "lucide-react";

interface RecentPaymentItem {
  id: string;
  payment_number: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  transaction_ref: string | null;
  customers: Array<{ name: string }>;
  monthly_rent: Array<{ billing_month: string }> | null;
}

export function RecentPayments() {
  const [data, setData] = useState<RecentPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("payments")
      .select(`
        id,
        payment_number,
        amount,
        payment_date,
        payment_method,
        transaction_ref,
        customers!inner(name),
        monthly_rent!left(billing_month)
      `)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }: { data: RecentPaymentItem[] | null }) => {
        setData(data || []);
        setLoading(false);
      });
  }, []);

  const methodIcons: Record<string, React.ReactNode> = {
    cash: <Wallet className="h-4 w-4" />,
    bank_transfer: <Banknote className="h-4 w-4" />,
    upi: <Smartphone className="h-4 w-4" />,
    other: <CreditCard className="h-4 w-4" />,
  };

  const methodLabels: Record<string, string> = {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    upi: "UPI",
    other: "Other",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Payments</CardTitle>
        <Link href="/payments" className="text-sm text-primary hover:underline">
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
          <div className="text-center py-8 text-gray-500">No payments recorded</div>
        ) : (
          <ScrollArea className="max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 font-medium text-gray-500">Payment #</th>
                  <th className="text-left pb-2 font-medium text-gray-500">Customer</th>
                  <th className="text-center pb-2 font-medium text-gray-500">Method</th>
                  <th className="text-right pb-2 font-medium text-gray-500">Amount</th>
                  <th className="text-left pb-2 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const customer = item.customers[0];
                  const rent = item.monthly_rent?.[0];
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-mono text-xs">{item.payment_number}</td>
                      <td className="py-3">{customer?.name}</td>
                      <td className="py-3 text-center">
                        <span className="flex items-center justify-center gap-1 text-gray-600">
                          {methodIcons[item.payment_method]}
                          {methodLabels[item.payment_method]}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                      <td className="py-3 text-gray-500">{formatDate(item.payment_date)}</td>
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