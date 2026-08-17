import { getCustomersForSelect } from "@/lib/actions/contracts";
import { getPropertiesForSelect } from "@/lib/actions/contracts";
import { getFlatsForSelect } from "@/lib/actions/contracts";
import { createContract } from "@/lib/actions/contracts";
import { ContractForm } from "@/components/forms/ContractForm";
import Link from "next/link";

export default async function NewContractPage() {
  const [customers, properties, flats] = await Promise.all([
    getCustomersForSelect(),
    getPropertiesForSelect(),
    getFlatsForSelect(),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contracts" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Contract</h1>
          <p className="text-gray-500">Create a new rental contract</p>
        </div>
      </div>

      <ContractForm
        action={createContract}
        isEditing={false}
        customers={customers}
        properties={properties}
        flats={flats}
      />
    </div>
  );
}