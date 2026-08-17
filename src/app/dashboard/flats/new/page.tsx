import { getPropertiesForSelect } from "@/lib/actions/flats";
import { createFlat } from "@/lib/actions/flats";
import { FlatForm } from "@/components/forms/FlatForm";
import Link from "next/link";

export default async function NewFlatPage() {
  const properties = await getPropertiesForSelect();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/flats" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Flat</h1>
          <p className="text-gray-500">Add a new flat to your portfolio</p>
        </div>
      </div>

      <FlatForm
        action={createFlat}
        isEditing={false}
        properties={properties}
      />
    </div>
  );
}