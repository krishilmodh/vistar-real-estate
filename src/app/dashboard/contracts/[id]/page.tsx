import { getContract } from "@/lib/actions/contracts";
import { deleteContract } from "@/lib/actions/contracts";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { User, Building2, Home, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { DropdownActions } from "@/components/ui/dropdown-actions";

interface ViewContractPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewContractPage({ params }: ViewContractPageProps) {
  const { id } = await params;
  const contract = await getContract(id);

  if (!contract) {
    notFound();
  }

  const handleDelete = async () => {
    await deleteContract(id);
    redirect("/dashboard/contracts");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contracts" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contract.contract_number}</h1>
            <p className="text-gray-500">Contract Details</p>
          </div>
        </div>
        <DropdownActions entityId={id} entityType="contract" onDelete={handleDelete} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Contract Number</label>
                <p className="text-lg font-mono font-medium">{contract.contract_number}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={cn("capitalize", STATUS_COLORS[contract.status])}>
                  {contract.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  {contract.customers?.name || "—"}
                  {contract.customers?.mobile && (
                    <span className="text-gray-500 ml-2">({contract.customers.mobile})</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Property</label>
                <p className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  {contract.properties?.name || "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Flat</label>
                <p className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  {contract.flats?.flat_number || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(contract.start_date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Monthly Rent</label>
                <p className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  {formatCurrency(contract.monthly_rent)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Security Deposit</label>
                <p className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  {formatCurrency(contract.security_deposit)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Billing Day</label>
                <p>{contract.billing_day}{contract.billing_day === 1 ? "st" : contract.billing_day === 2 ? "nd" : contract.billing_day === 3 ? "rd" : "th"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Due Date</label>
                <p>{contract.due_date}{contract.due_date === 1 ? "st" : contract.due_date === 2 ? "nd" : contract.due_date === 3 ? "rd" : "th"}</p>
              </div>
            </div>

            {contract.notes && (
              <div className="space-y-1 pt-4 border-t">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{contract.notes}</p>
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
              <p className="text-gray-900">{new Date(contract.created_at).toLocaleDateString()}</p>
            </div>
            {contract.updated_at && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(contract.updated_at).toLocaleDateString()}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900 font-mono text-sm">{contract.created_by || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}