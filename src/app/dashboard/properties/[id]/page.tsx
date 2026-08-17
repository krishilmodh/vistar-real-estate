import { getProperty } from "@/lib/actions/properties";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants/enums";
import { cn } from "@/lib/utils";
import { deleteProperty } from "@/lib/actions/properties";
import { DropdownActions } from "@/components/ui/dropdown-actions";

interface ViewPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPropertyPage({ params }: ViewPropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const handleDelete = async () => {
    await deleteProperty(id);
    redirect("/dashboard/properties");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/properties" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-500">Property Details</p>
          </div>
        </div>
        <DropdownActions entityId={id} entityType="property" onDelete={handleDelete} />
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
                <p className="text-lg font-medium">{property.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={cn("capitalize", STATUS_COLORS[property.status])}>
                  {property.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">City</label>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {property.city || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Area</label>
                <p className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-gray-400" />
                  {property.area || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t">
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                {property.address || "—"}
              </p>
            </div>

            {property.notes && (
              <div className="space-y-1 pt-4 border-t">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{property.notes}</p>
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
              <p className="text-gray-900">{new Date(property.created_at).toLocaleDateString()}</p>
            </div>
            {property.updated_at && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(property.updated_at).toLocaleDateString()}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900 font-mono text-sm">{property.created_by || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}