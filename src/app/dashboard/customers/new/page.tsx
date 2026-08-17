"use client";

import { createCustomer } from "@/lib/actions/customers";
import { CustomerForm } from "@/components/forms/CustomerForm";
import Link from "next/link";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Customer</h1>
          <p className="text-gray-500">Add a new customer/tenant</p>
        </div>
      </div>

      <CustomerForm
        action={createCustomer}
        isEditing={false}
      />
    </div>
  );
}