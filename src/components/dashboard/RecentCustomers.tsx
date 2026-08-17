"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Phone, Mail } from "lucide-react";

interface RecentCustomerItem {
  id: string;
  name: string;
  mobile: string | null;
  email: string | null;
  status: string;
  created_at: string;
}

export function RecentCustomers() {
  const [data, setData] = useState<RecentCustomerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("customers")
      .select("id, name, mobile, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }: { data: RecentCustomerItem[] | null }) => {
        setData(data || []);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      blacklisted: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"} className="capitalize">{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          Recent Customers
        </CardTitle>
        <Link href="/customers" className="text-sm text-primary hover:underline">
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
          <div className="text-center py-8 text-gray-500">No customers yet</div>
        ) : (
          <ScrollArea className="max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 font-medium text-gray-500">Name</th>
                  <th className="text-left pb-2 font-medium text-gray-500">Contact</th>
                  <th className="text-center pb-2 font-medium text-gray-500">Status</th>
                  <th className="text-left pb-2 font-medium text-gray-500">Added</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        {item.mobile && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.mobile}</span>}
                        {item.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{item.email}</span>}
                      </div>
                    </td>
                    <td className="py-3 text-center">{getStatusBadge(item.status)}</td>
                    <td className="py-3 text-gray-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}