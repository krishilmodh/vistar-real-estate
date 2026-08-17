import { createClient } from "@/lib/supabase/server";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { RentDueToday } from "@/components/dashboard/RentDueToday";
import { OverdueRent } from "@/components/dashboard/OverdueRent";
import { RecentPayments } from "@/components/dashboard/RecentPayments";
import { ExpiringContracts } from "@/components/dashboard/ExpiringContracts";
import { RecentCustomers } from "@/components/dashboard/RecentCustomers";

interface MonthlyRentItem { monthly_rent: number; }
interface PaidAmountItem { paid_amount: number; }
interface BalanceItem { balance: number; }

export default async function DashboardPage() {
  const supabase = await createClient();

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7) + "-01";
  const ninetyDaysLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

  const [
    propertiesResult,
    flatsResult,
    activeContractsResult,
    monthlyExpectedResult,
    currentMonthCollectedResult,
    currentMonthPendingResult,
    currentMonthOverdueResult,
    overdueCustomersResult,
    expiringContractsResult,
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("flats").select("*", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("rental_contracts").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("rental_contracts").select("monthly_rent").eq("status", "active"),
    supabase.from("monthly_rent").select("paid_amount").eq("billing_month", currentMonth),
    supabase.from("monthly_rent").select("balance").eq("billing_month", currentMonth).in("status", ["pending", "partial"]),
    supabase.from("monthly_rent").select("balance").eq("billing_month", currentMonth).eq("status", "overdue"),
    supabase.from("customers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("rental_contracts").select("*", { count: "exact", head: true }).eq("status", "active").lte("end_date", ninetyDaysLater),
  ]);

  const totalMonthlyExpected = (monthlyExpectedResult.data as MonthlyRentItem[] | null)?.reduce((sum: number, c) => sum + (c.monthly_rent || 0), 0) || 0;
  const collected = (currentMonthCollectedResult.data as PaidAmountItem[] | null)?.reduce((sum: number, m) => sum + (m.paid_amount || 0), 0) || 0;
  const pending = (currentMonthPendingResult.data as BalanceItem[] | null)?.reduce((sum: number, m) => sum + (m.balance || 0), 0) || 0;
  const overdue = (currentMonthOverdueResult.data as BalanceItem[] | null)?.reduce((sum: number, m) => sum + (m.balance || 0), 0) || 0;

  const metrics = [
    { label: "Total Properties", value: propertiesResult.count || 0, icon: "Building2", trend: null },
    { label: "Available Flats", value: flatsResult.count || 0, icon: "Home", trend: null },
    { label: "Active Contracts", value: activeContractsResult.count || 0, icon: "FileText", trend: null },
    { label: "Monthly Expected", value: totalMonthlyExpected, icon: "DollarSign", trend: null, currency: true },
    { label: "This Month Collected", value: collected, icon: "CheckCircle", trend: null, currency: true },
    { label: "This Month Pending", value: pending, icon: "Clock", trend: null, currency: true },
    { label: "This Month Overdue", value: overdue, icon: "AlertCircle", trend: null, currency: true },
    { label: "Overdue Customers", value: overdueCustomersResult.count || 0, icon: "Users", trend: null },
    { label: "Expiring Soon (90d)", value: expiringContractsResult.count || 0, icon: "Calendar", trend: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your furniture rental business</p>
        </div>
      </div>

      <DashboardMetrics metrics={metrics} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RentDueToday />
        <OverdueRent />
        <RecentPayments />
        <RecentCustomers />
        <ExpiringContracts />
      </div>
    </div>
  );
}