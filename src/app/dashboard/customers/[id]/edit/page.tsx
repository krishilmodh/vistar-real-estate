import { getCustomer } from "@/lib/actions/customers";
import { updateCustomer } from "@/lib/actions/customers";
import { CustomerForm } from "@/components/forms/CustomerForm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/customers/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
          <p className="text-gray-500">Update customer details</p>
        </div>
      </div>

      <CustomerForm
        initialData={{
          name: customer.name,
          mobile: customer.mobile,
          whatsapp: customer.whatsapp,
          email: customer.email,
          address: customer.address,
          id_type: customer.id_type,
          id_number: customer.id_number,
          notes: customer.notes,
          status: customer.status,
        }}
        isEditing={true}
        action={(data) => updateCustomer(id, data)}
      />
    </div>
  );
}