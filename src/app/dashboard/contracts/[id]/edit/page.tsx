import { getContract } from "@/lib/actions/contracts";
import { getCustomersForSelect } from "@/lib/actions/contracts";
import { getPropertiesForSelect } from "@/lib/actions/contracts";
import { getFlatsForSelect } from "@/lib/actions/contracts";
import { updateContract } from "@/lib/actions/contracts";
import { ContractForm } from "@/components/forms/ContractForm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface EditContractPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContractPage({ params }: EditContractPageProps) {
  const { id } = await params;
  const [contract, customers, properties, flats] = await Promise.all([
    getContract(id),
    getCustomersForSelect(),
    getPropertiesForSelect(),
    getFlatsForSelect(),
  ]);

  if (!contract) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/contracts/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Contract</h1>
          <p className="text-gray-500">Update contract details</p>
        </div>
      </div>

      <ContractForm
        initialData={{
          contract_number: contract.contract_number,
          customer_id: contract.customer_id,
          property_id: contract.property_id,
          flat_id: contract.flat_id,
          start_date: contract.start_date,
          end_date: contract.end_date || "",
          monthly_rent: contract.monthly_rent,
          security_deposit: contract.security_deposit,
          billing_day: contract.billing_day,
          due_date: contract.due_date,
          notes: contract.notes,
          status: contract.status,
        }}
        isEditing={true}
        action={(data) => updateContract(id, data)}
        customers={customers}
        properties={properties}
        flats={flats}
      />
    </div>
  );
}