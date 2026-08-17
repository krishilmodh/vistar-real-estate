import { getPayment } from "@/lib/actions/payments";
import { getCustomersForPaymentSelect } from "@/lib/actions/payments";
import { getContractsForPaymentSelect } from "@/lib/actions/payments";
import { getMonthlyRentsForPaymentSelect } from "@/lib/actions/payments";
import { updatePayment } from "@/lib/actions/payments";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface EditPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  const { id } = await params;
  const [payment, customers, contracts, monthlyRents] = await Promise.all([
    getPayment(id),
    getCustomersForPaymentSelect(),
    getContractsForPaymentSelect(),
    getMonthlyRentsForPaymentSelect(),
  ]);

  if (!payment) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/payments/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Payment</h1>
          <p className="text-gray-500">Update payment details</p>
        </div>
      </div>

      <PaymentForm
        initialData={{
          payment_number: payment.payment_number,
          customer_id: payment.customer_id,
          contract_id: payment.contract_id,
          monthly_rent_id: payment.monthly_rent_id,
          amount: payment.amount,
          payment_date: payment.payment_date,
          payment_method: payment.payment_method,
          transaction_ref: payment.transaction_ref,
          notes: payment.notes,
        }}
        isEditing={true}
        action={(data) => updatePayment(id, data)}
        customers={customers}
        contracts={contracts}
        monthlyRents={monthlyRents}
      />
    </div>
  );
}