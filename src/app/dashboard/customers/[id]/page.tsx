import { getCustomer } from "@/lib/actions/customers";
import { deleteCustomer } from "@/lib/actions/customers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Phone, Mail, MapPin, IdCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { cn } from "@/lib/utils";
import { DropdownActions } from "@/components/ui/dropdown-actions";

interface ViewCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewCustomerPage({ params }: ViewCustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  const handleDelete = async () => {
    await deleteCustomer(id);
    redirect("/dashboard/customers");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customers" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-500">Customer Details</p>
          </div>
        </div>
        <DropdownActions entityId={id} entityType="customer" onDelete={handleDelete} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-medium">{customer.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={cn("capitalize", STATUS_COLORS[customer.status])}>
                  {customer.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Mobile</label>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {customer.mobile || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {customer.whatsapp || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {customer.email || "—"}
              </p>
            </div>

            <div className="space-y-1 pt-4 border-t">
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {customer.address || "—"}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">ID Type</label>
                <p className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-gray-400" />
                  {customer.id_type || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">ID Number</label>
                <p className="flex items-center gap-2 font-mono text-sm">
                  <IdCard className="h-4 w-4 text-gray-400" />
                  {customer.id_number || "—"}
                </p>
              </div>
            </div>

            {customer.notes && (
              <div className="space-y-1 pt-4 border-t">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{customer.notes}</p>
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
              <p className="text-gray-900">{new Date(customer.created_at).toLocaleDateString()}</p>
            </div>
            {customer.updated_at && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(customer.updated_at).toLocaleDateString()}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900 font-mono text-sm">{customer.created_by || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}