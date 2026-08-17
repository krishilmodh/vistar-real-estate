import { getCustomersForPaymentSelect } from "@/lib/actions/payments";
import { getContractsForPaymentSelect } from "@/lib/actions/payments";
import { getMonthlyRentsForPaymentSelect } from "@/lib/actions/payments";
import { createPayment } from "@/lib/actions/payments";
import { PaymentForm } from "@/components/forms/PaymentForm";
import Link from "next/link";

export default async function NewPaymentPage() {
  const [customers, contracts, monthlyRents] = await Promise.all([
    getCustomersForPaymentSelect(),
    getContractsForPaymentSelect(),
    getMonthlyRentsForPaymentSelect(),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/payments" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
          <p className="text-gray-500">Record a new payment</p>
        </div>
      </div>

      <PaymentForm
        action={createPayment}
        isEditing={false}
        customers={customers}
        contracts={contracts}
        monthlyRents={monthlyRents}
      />
    </div>
  );
}