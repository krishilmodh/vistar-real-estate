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
import { z } from "zod";

const monthlyRentSchema = z.object({
  contract_id: z.string().uuid("Invalid contract"),
  customer_id: z.string().uuid("Invalid customer"),
  property_id: z.string().uuid("Invalid property"),
  flat_id: z.string().uuid("Invalid flat"),
  billing_month: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  rent_amount: z.number().min(0, "Rent must be positive"),
  paid_amount: z.number().min(0).default(0),
  status: z.enum(["pending", "partial", "paid", "overdue", "cancelled"]).default("pending"),
});

type FormData = z.infer<typeof monthlyRentSchema>;

interface RentFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  action: (data: FormData) => Promise<{ success: boolean; data?: unknown }>;
  contracts: Array<{
    id: string;
    contract_number: string;
    monthly_rent: number;
    customers: { id: string; name: string; mobile: string | null } | null;
    properties: { id: string; name: string } | null;
    flats: { id: string; flat_number: string } | null;
  }>;
  onCancel?: () => void;
}

export function RentForm({ initialData, isEditing = false, action, contracts, onCancel }: RentFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(monthlyRentSchema) as any,
    defaultValues: {
      contract_id: "",
      customer_id: "",
      property_id: "",
      flat_id: "",
      billing_month: new Date().toISOString().split("T")[0].substring(0, 7) + "-01",
      due_date: new Date().toISOString().split("T")[0],
      rent_amount: 0,
      paid_amount: 0,
      status: "pending",
      ...initialData,
    },
  });

  const watchedContractId = form.watch("contract_id");
  const selectedContract = contracts.find(c => c.id === watchedContractId);

  useEffect(() => {
    if (selectedContract) {
      form.setValue("customer_id", selectedContract.customers?.id || "", { shouldValidate: true });
      form.setValue("property_id", selectedContract.properties?.id || "", { shouldValidate: true });
      form.setValue("flat_id", selectedContract.flats?.id || "", { shouldValidate: true });
      form.setValue("rent_amount", selectedContract.monthly_rent, { shouldValidate: true });
      // Set due date to 5th of next month based on billing month
      const billingMonth = form.getValues("billing_month");
      if (billingMonth) {
        const [year, month] = billingMonth.split("-");
        const dueDate = new Date(parseInt(year), parseInt(month) - 1, 5);
        form.setValue("due_date", dueDate.toISOString().split("T")[0], { shouldValidate: true });
      }
    }
  }, [selectedContract, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await action(data);
      if (result.success) {
        router.push("/dashboard/rent");
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
        <CardTitle>{isEditing ? "Edit Rent Record" : "Add Rent Record"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update monthly rent details" : "Create a new monthly rent record"}
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

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="billing_month">Billing Month *</Label>
              <Input
                id="billing_month"
                type="month"
                {...form.register("billing_month")}
                disabled={isSubmitting}
              />
              {form.formState.errors.billing_month && (
                <p className="text-sm text-red-500">{form.formState.errors.billing_month.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                {...form.register("due_date")}
                disabled={isSubmitting}
              />
              {form.formState.errors.due_date && (
                <p className="text-sm text-red-500">{form.formState.errors.due_date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select {...form.register("status")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <Label htmlFor="rent_amount">Rent Amount (₹) *</Label>
              <Input
                id="rent_amount"
                type="number"
                min="0"
                step="1"
                {...form.register("rent_amount", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {form.formState.errors.rent_amount && (
                <p className="text-sm text-red-500">{form.formState.errors.rent_amount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="paid_amount">Paid Amount (₹)</Label>
              <Input
                id="paid_amount"
                type="number"
                min="0"
                step="1"
                {...form.register("paid_amount", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="customer_id">Customer</Label>
              <Input
                id="customer_id"
                {...form.register("customer_id")}
                readOnly
                disabled
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="property_id">Property</Label>
              <Input
                id="property_id"
                {...form.register("property_id")}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/dashboard/rent">
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
                isEditing ? "Update Rent Record" : "Create Rent Record"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}