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
import { propertySchema } from "@/lib/validations/schemas";

interface FormData {
  name: string;
  address?: string;
  city?: string;
  area?: string;
  notes?: string;
  status: "active" | "inactive" | "under_maintenance";
}

interface PropertyFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  action: (data: FormData) => Promise<{ success: boolean; data?: unknown }>;
  onCancel?: () => void;
}

export function PropertyForm({ initialData, isEditing = false, action, onCancel }: PropertyFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      name: "",
      address: "",
      city: "",
      area: "",
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
        router.push("/dashboard/properties");
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
        <CardTitle>{isEditing ? "Edit Property" : "Add Property"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update property details" : "Create a new property"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Property name"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
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
                  <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
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

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                {...register("city")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                placeholder="Area/Locality"
                {...register("area")}
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
            <Link href="/dashboard/properties">
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
                isEditing ? "Update Property" : "Create Property"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}