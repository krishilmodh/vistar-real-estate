import { getPayment } from "@/lib/actions/payments";
import { deletePayment } from "@/lib/actions/payments";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, DollarSign, FileText, User, Building2, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/currency";
import { DropdownActions } from "@/components/ui/dropdown-actions";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  other: "Other",
};

interface ViewPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPaymentPage({ params }: ViewPaymentPageProps) {
  const { id } = await params;
  const payment = await getPayment(id);

  if (!payment) {
    notFound();
  }

  const handleDelete = async () => {
    await deletePayment(id);
    redirect("/dashboard/payments");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/payments" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{payment.payment_number}</h1>
            <p className="text-gray-500">Payment Details</p>
          </div>
        </div>
        <DropdownActions entityId={id} entityType="payment" onDelete={handleDelete} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Payment Number</label>
                <p className="text-lg font-mono font-medium">{payment.payment_number}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Payment Date</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(payment.payment_date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  {payment.customers?.name || "—"}
                  {payment.customers?.mobile && <span className="text-gray-500 ml-2">({payment.customers.mobile})</span>}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Contract</label>
                <p className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {payment.contracts?.contract_number || "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Property</label>
                <p className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  {payment.contracts?.properties?.name || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Flat</label>
                <p className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  {payment.contracts?.flats?.flat_number || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Rent Month</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {payment.monthly_rent ? new Date(payment.monthly_rent.billing_month).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "— (Deposit)"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="flex items-center gap-2 font-medium text-green-600">
                  <DollarSign className="h-4 w-4" />
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Method</label>
                <Badge className="bg-blue-100 text-blue-800 capitalize">
                  {PAYMENT_METHOD_LABELS[payment.payment_method] || payment.payment_method}
                </Badge>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Transaction Ref</label>
                <p className="font-mono text-sm">{payment.transaction_ref || "—"}</p>
              </div>
            </div>

            {payment.notes && (
              <div className="space-y-1 pt-4 border-t">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{payment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{new Date(payment.created_at).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900 font-mono text-sm">{payment.created_by || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}