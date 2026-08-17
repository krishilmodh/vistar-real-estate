import { getProperty } from "@/lib/actions/properties";
import { updateProperty } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/properties/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-500">Update property details</p>
        </div>
      </div>

      <PropertyForm
        initialData={{
          name: property.name,
          address: property.address,
          city: property.city,
          area: property.area,
          notes: property.notes,
          status: property.status,
        }}
        isEditing={true}
        action={(data) => updateProperty(id, data)}
      />
    </div>
  );
}