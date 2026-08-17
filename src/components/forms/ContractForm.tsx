"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { contractSchema } from "@/lib/validations/schemas";

interface FormData {
  contract_number: string;
  customer_id: string;
  property_id: string;
  flat_id: string;
  start_date: string;
  end_date?: string;
  monthly_rent: number;
  security_deposit: number;
  billing_day: number;
  due_date: number;
  notes?: string;
  status: "draft" | "active" | "expired" | "terminated" | "renewed";
}

interface ContractFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  action: (data: FormData) => Promise<{ success: boolean; data?: unknown }>;
  customers: { id: string; name: string; mobile: string | null }[];
  properties: { id: string; name: string }[];
  flats: { id: string; flat_number: string; property_id: string }[];
  onCancel?: () => void;
}

export function ContractForm({ initialData, isEditing = false, action, customers, properties, flats, onCancel }: ContractFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedPropertyId = useWatch({ control: useForm({}).control, name: "property_id" });

  const form = useForm<FormData>({
    resolver: zodResolver(contractSchema) as any,
    defaultValues: {
      contract_number: "",
      customer_id: "",
      property_id: "",
      flat_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      monthly_rent: 0,
      security_deposit: 0,
      billing_day: 1,
      due_date: 5,
      notes: "",
      status: "draft",
      ...initialData,
    },
  });

  const watchedPropertyId = form.watch("property_id");
  const availableFlats = flats.filter(f => !watchedPropertyId || f.property_id === watchedPropertyId);

  useEffect(() => {
    if (initialData?.property_id && !initialData.flat_id) {
      form.setValue("flat_id", "");
    }
  }, [initialData?.property_id]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await action(data);
      if (result.success) {
        router.push("/dashboard/contracts");
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
        <CardTitle>{isEditing ? "Edit Contract" : "Add Contract"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update contract details" : "Create a new rental contract"}
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
            <Label htmlFor="contract_number">Contract Number *</Label>
            <Input
              id="contract_number"
              placeholder="e.g., CON-2024-001"
              {...form.register("contract_number")}
              disabled={isSubmitting}
            />
            {form.formState.errors.contract_number && (
              <p className="text-sm text-red-500">{form.formState.errors.contract_number.message}</p>
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
              <Label htmlFor="property_id">Property *</Label>
              <Select {...form.register("property_id")} onValueChange={(v) => form.setValue("flat_id", "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.property_id && (
                <p className="text-sm text-red-500">{form.formState.errors.property_id.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="flat_id">Flat *</Label>
              <Select {...form.register("flat_id")} disabled={availableFlats.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={availableFlats.length === 0 ? "Select property first" : "Select flat"} />
                </SelectTrigger>
                <SelectContent>
                  {availableFlats.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.flat_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.flat_id && (
                <p className="text-sm text-red-500">{form.formState.errors.flat_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                {...form.register("start_date")}
                disabled={isSubmitting}
              />
              {form.formState.errors.start_date && (
                <p className="text-sm text-red-500">{form.formState.errors.start_date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...form.register("end_date")}
                disabled={isSubmitting}
              />
              {form.formState.errors.end_date && (
                <p className="text-sm text-red-500">{form.formState.errors.end_date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select {...form.register("status")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="renewed">Renewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <Label htmlFor="monthly_rent">Monthly Rent (₹) *</Label>
              <Input
                id="monthly_rent"
                type="number"
                min="0"
                step="1"
                {...form.register("monthly_rent", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {form.formState.errors.monthly_rent && (
                <p className="text-sm text-red-500">{form.formState.errors.monthly_rent.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="security_deposit">Security Deposit (₹)</Label>
              <Input
                id="security_deposit"
                type="number"
                min="0"
                step="1"
                {...form.register("security_deposit", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="billing_day">Billing Day</Label>
              <Input
                id="billing_day"
                type="number"
                min="1"
                max="28"
                {...form.register("billing_day", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="number"
                min="1"
                max="28"
                {...form.register("due_date", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes"
              {...form.register("notes")}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/dashboard/contracts">
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
                isEditing ? "Update Contract" : "Create Contract"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}