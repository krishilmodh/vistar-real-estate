import { getContractsForRentSelect } from "@/lib/actions/rent";
import { createMonthlyRent } from "@/lib/actions/rent";
import { RentForm } from "@/components/forms/RentForm";
import Link from "next/link";

export default async function NewRentPage() {
  const contracts = await getContractsForRentSelect();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/rent" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Rent Record</h1>
          <p className="text-gray-500">Create a new monthly rent record</p>
        </div>
      </div>

      <RentForm
        action={createMonthlyRent}
        isEditing={false}
        contracts={contracts}
      />
    </div>
  );
}