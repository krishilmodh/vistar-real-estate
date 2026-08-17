import { getFlat } from "@/lib/actions/flats";
import { deleteFlat } from "@/lib/actions/flats";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Home, Building2, User, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { cn } from "@/lib/utils";
import { DropdownActions } from "@/components/ui/dropdown-actions";

interface ViewFlatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewFlatPage({ params }: ViewFlatPageProps) {
  const { id } = await params;
  const flat = await getFlat(id);

  if (!flat) {
    notFound();
  }

  const handleDelete = async () => {
    await deleteFlat(id);
    redirect("/dashboard/flats");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/flats" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{flat.flat_number}</h1>
            <p className="text-gray-500">{flat.properties?.name || "Unknown Property"}</p>
          </div>
        </div>
        <DropdownActions entityId={id} entityType="flat" onDelete={handleDelete} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Flat Number</label>
                <p className="text-lg font-medium">{flat.flat_number}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={cn("capitalize", STATUS_COLORS[flat.status])}>
                  {flat.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Block</label>
                <p className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  {flat.block || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Floor</label>
                <p className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  {flat.floor || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t">
              <label className="text-sm font-medium text-gray-500">Property</label>
              <p className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                {flat.properties?.name || "—"}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Owner Name</label>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  {flat.owner_name || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Owner Contact</label>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {flat.owner_contact || "—"}
                </p>
              </div>
            </div>

            {flat.notes && (
              <div className="space-y-1 pt-4 border-t">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{flat.notes}</p>
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
              <p className="text-gray-900">{new Date(flat.created_at).toLocaleDateString()}</p>
            </div>
            {flat.updated_at && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(flat.updated_at).toLocaleDateString()}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900 font-mono text-sm">{flat.created_by || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}