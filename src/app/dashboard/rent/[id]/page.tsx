import { getMonthlyRent } from "@/lib/actions/rent";
import { deleteMonthlyRent } from "@/lib/actions/rent";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, DollarSign, User, Building2, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { DropdownActions } from "@/components/ui/dropdown-actions";

interface ViewRentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewRentPage({ params }: ViewRentPageProps) {
  const { id } = await params;
  const rent = await getMonthlyRent(id);

  if (!rent) {
    notFound();
  }

  const balance = rent.rent_amount - rent.paid_amount;
  const handleDelete = async () => {
    await deleteMonthlyRent(id);
    redirect("/dashboard/rent");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/rent" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{rent.contracts?.contract_number || "Rent Record"}</h1>
            <p className="text-gray-500">{rent.billing_month ? new Date(rent.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Monthly Rent"}</p>
          </div>
        </div>
        <DropdownActions entityId={id} entityType="rent" onDelete={handleDelete} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Contract</label>
                <p className="font-mono font-medium">{rent.contracts?.contract_number || "—"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={cn("capitalize", STATUS_COLORS[rent.status])}>
                  {rent.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  {rent.customers?.name || "—"}
                  {rent.customers?.mobile && <span className="text-gray-500 ml-2">({rent.customers.mobile})</span>}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Property</label>
                <p className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  {rent.properties?.name || "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Flat</label>
                <p className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  {rent.flats?.flat_number || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Billing Month</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {rent.billing_month ? new Date(rent.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Due Date</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {rent.due_date ? new Date(rent.due_date).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Rent Amount</label>
                <p className="flex items-center gap-2 font-medium">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  {formatCurrency(rent.rent_amount)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Paid Amount</label>
                <p className="flex items-center gap-2 font-medium text-green-600">
                  <DollarSign className="h-4 w-4" />
                  {formatCurrency(rent.paid_amount)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Balance</label>
                <p className="flex items-center gap-2 font-medium" style={{ color: balance > 0 ? "#dc2626" : "#16a34a" }}>
                  <DollarSign className="h-4 w-4" />
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{new Date(rent.created_at).toLocaleDateString()}</p>
            </div>
            {rent.updated_at && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(rent.updated_at).toLocaleDateString()}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900 font-mono text-sm">{rent.created_by || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}