"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { paymentSchema } from "@/lib/validations/schemas";
import { formatCurrency } from "@/lib/utils/currency";
import { z } from "zod";

interface FormData {
  payment_number: string;
  customer_id: string;
  contract_id: string;
  monthly_rent_id?: string | null;
  amount: number;
  payment_date: string;
  payment_method: "cash" | "bank_transfer" | "upi" | "other";
  transaction_ref?: string;
  notes?: string;
}

interface PaymentFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  action: (data: FormData) => Promise<{ success: boolean; data?: unknown }>;
  customers: { id: string; name: string; mobile: string | null }[];
  contracts: Array<{
    id: string;
    contract_number: string;
    customers: { id: string; name: string; mobile: string | null } | null;
    properties: { id: string; name: string } | null;
    flats: { id: string; flat_number: string } | null;
  }>;
  monthlyRents: Array<{
    id: string;
    billing_month: string;
    contracts: { contract_number: string } | null;
    customers: { name: string } | null;
  }>;
  onCancel?: () => void;
}

export function PaymentForm({ initialData, isEditing = false, action, customers, contracts, monthlyRents, onCancel }: PaymentFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      payment_number: "",
      customer_id: "",
      contract_id: "",
      monthly_rent_id: "",
      amount: 0,
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "cash",
      transaction_ref: "",
      notes: "",
      ...initialData,
    },
  });

  const watchedContractId = form.watch("contract_id");
  const watchedCustomerId = form.watch("customer_id");
  const selectedContract = contracts.find(c => c.id === watchedContractId);
  const selectedCustomer = customers.find(c => c.id === watchedCustomerId);
  const availableRents = monthlyRents.filter(r => 
    r.contracts?.contract_number && 
    contracts.find(c => c.id === watchedContractId && c.contract_number === r.contracts?.contract_number)
  );

  useEffect(() => {
    if (selectedContract) {
      form.setValue("customer_id", selectedContract.customers?.id || "", { shouldValidate: true });
    }
  }, [selectedContract]);

  useEffect(() => {
    if (selectedCustomer && !watchedContractId) {
      // Could auto-select contract based on customer, but let user choose
    }
  }, [selectedCustomer]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await action({
        ...data,
        monthly_rent_id: data.monthly_rent_id || null,
      });
      if (result.success) {
        router.push("/dashboard/payments");
        router.refresh();
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Payment" : "Record Payment"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update payment details" : "Record a new payment"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1">
            <Label htmlFor="payment_number">Payment Number *</Label>
            <Input
              id="payment_number"
              placeholder="e.g., PAY-2024-001"
              {...form.register("payment_number")}
              disabled={isSubmitting}
            />
            {form.formState.errors.payment_number && (
              <p className="text-sm text-red-500">{form.formState.errors.payment_number.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="customer_id">Customer *</Label>
              <Select {...form.register("customer_id")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.mobile ? `(${c.mobile})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.customer_id && (
                <p className="text-sm text-red-500">{form.formState.errors.customer_id.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="contract_id">Contract *</Label>
              <Select {...form.register("contract_id")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contract" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.contract_number} - {c.customers?.name} ({c.properties?.name} - {c.flats?.flat_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.contract_id && (
                <p className="text-sm text-red-500">{form.formState.errors.contract_id.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="monthly_rent_id">Rent Record (Optional)</Label>
              <Select {...form.register("monthly_rent_id")}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to rent record" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {availableRents.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.contracts?.contract_number} - {r.billing_month} - {r.customers?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="1"
                {...form.register("amount", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="payment_date">Payment Date *</Label>
              <Input
                id="payment_date"
                type="date"
                {...form.register("payment_date")}
                disabled={isSubmitting}
              />
              {form.formState.errors.payment_date && (
                <p className="text-sm text-red-500">{form.formState.errors.payment_date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="payment_method">Payment Method *</Label>
              <Select {...form.register("payment_method")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="transaction_ref">Transaction Reference</Label>
              <Input
                id="transaction_ref"
                placeholder="TXN reference / UPI ID / Cheque no."
                {...form.register("transaction_ref")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Additional notes"
              {...form.register("notes")}
              disabled={isSubmitting}
            />
          </div>

          {selectedContract && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Contract Info</p>
              <p className="text-sm text-gray-600">
                {selectedContract.contract_number} - {selectedContract.customers?.name} 
                ({selectedContract.properties?.name} - {selectedContract.flats?.flat_number})
              </p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/dashboard/payments">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? "Update Payment" : "Record Payment"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}