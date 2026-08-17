"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { customerSchema } from "@/lib/validations/schemas";

interface FormData {
  name: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  id_type?: string;
  id_number?: string;
  notes?: string;
  status: "active" | "inactive" | "blacklisted";
}

interface CustomerFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  action: (data: FormData) => Promise<{ success: boolean; data?: unknown }>;
  onCancel?: () => void;
}

export function CustomerForm({ initialData, isEditing = false, action, onCancel }: CustomerFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: "",
      mobile: "",
      whatsapp: "",
      email: "",
      address: "",
      id_type: "",
      id_number: "",
      notes: "",
      status: "active",
      ...initialData,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await action(data);
      if (result.success) {
        router.push("/dashboard/customers");
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
        <CardTitle>{isEditing ? "Edit Customer" : "Add Customer"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update customer details" : "Create a new customer"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Customer name"
              {...register("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                placeholder="e.g., 9876543210"
                {...register("mobile")}
                disabled={isSubmitting}
              />
              {errors.mobile && (
                <p className="text-sm text-red-500">{errors.mobile.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="e.g., 9876543210"
                {...register("whatsapp")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select {...register("status")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Full address"
              {...register("address")}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="id_type">ID Type</Label>
              <Input
                id="id_type"
                placeholder="e.g., Aadhar, PAN, Passport"
                {...register("id_type")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="id_number">ID Number</Label>
              <Input
                id="id_number"
                placeholder="ID number"
                {...register("id_number")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes"
              {...register("notes")}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/dashboard/customers">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? "Update Customer" : "Create Customer"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}