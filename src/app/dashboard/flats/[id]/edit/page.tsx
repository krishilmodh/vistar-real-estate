import { getFlat } from "@/lib/actions/flats";
import { getPropertiesForSelect } from "@/lib/actions/flats";
import { updateFlat } from "@/lib/actions/flats";
import { FlatForm } from "@/components/forms/FlatForm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface EditFlatPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFlatPage({ params }: EditFlatPageProps) {
  const { id } = await params;
  const [flat, properties] = await Promise.all([
    getFlat(id),
    getPropertiesForSelect(),
  ]);

  if (!flat) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/flats/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Flat</h1>
          <p className="text-gray-500">Update flat details</p>
        </div>
      </div>

      <FlatForm
        initialData={{
          property_id: flat.property_id,
          flat_number: flat.flat_number,
          block: flat.block,
          floor: flat.floor,
          owner_name: flat.owner_name,
          owner_contact: flat.owner_contact,
          notes: flat.notes,
          status: flat.status,
        }}
        isEditing={true}
        action={(data) => updateFlat(id, data)}
        properties={properties}
      />
    </div>
  );
}