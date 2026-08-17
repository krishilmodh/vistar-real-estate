import { getMonthlyRent } from "@/lib/actions/rent";
import { getContractsForRentSelect } from "@/lib/actions/rent";
import { updateMonthlyRent } from "@/lib/actions/rent";
import { RentForm } from "@/components/forms/RentForm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface EditRentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRentPage({ params }: EditRentPageProps) {
  const { id } = await params;
  const [rent, contracts] = await Promise.all([
    getMonthlyRent(id),
    getContractsForRentSelect(),
  ]);

  if (!rent) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/rent/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Rent Record</h1>
          <p className="text-gray-500">Update monthly rent details</p>
        </div>
      </div>

      <RentForm
        initialData={{
          contract_id: rent.contract_id,
          customer_id: rent.customer_id,
          property_id: rent.property_id,
          flat_id: rent.flat_id,
          billing_month: rent.billing_month,
          due_date: rent.due_date,
          rent_amount: rent.rent_amount,
          paid_amount: rent.paid_amount,
          status: rent.status,
        }}
        isEditing={true}
        action={(data) => updateMonthlyRent(id, data)}
        contracts={contracts}
      />
    </div>
  );
}