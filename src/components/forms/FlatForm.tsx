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
import { flatSchema } from "@/lib/validations/schemas";

interface FormData {
  property_id: string;
  flat_number: string;
  block?: string;
  floor?: string;
  owner_name?: string;
  owner_contact?: string;
  notes?: string;
  status: "available" | "occupied" | "reserved" | "under_maintenance";
}

interface FlatFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  action: (data: FormData) => Promise<{ success: boolean; data?: unknown }>;
  properties: { id: string; name: string }[];
  onCancel?: () => void;
}

export function FlatForm({ initialData, isEditing = false, action, properties, onCancel }: FlatFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(flatSchema) as any,
    defaultValues: {
      property_id: "",
      flat_number: "",
      block: "",
      floor: "",
      owner_name: "",
      owner_contact: "",
      notes: "",
      status: "available",
      ...initialData,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await action(data);
      if (result.success) {
        router.push("/dashboard/flats");
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
        <CardTitle>{isEditing ? "Edit Flat" : "Add Flat"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update flat details" : "Create a new flat"}
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
            <Label htmlFor="property_id">Property *</Label>
            <Select {...register("property_id")}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property_id && (
              <p className="text-sm text-red-500">{errors.property_id.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="flat_number">Flat Number *</Label>
              <Input
                id="flat_number"
                placeholder="e.g., A-101"
                {...register("flat_number")}
                disabled={isSubmitting}
              />
              {errors.flat_number && (
                <p className="text-sm text-red-500">{errors.flat_number.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="block">Block</Label>
              <Input
                id="block"
                placeholder="e.g., A"
                {...register("block")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                placeholder="e.g., 1"
                {...register("floor")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="owner_name">Owner Name</Label>
              <Input
                id="owner_name"
                placeholder="Owner's name"
                {...register("owner_name")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="owner_contact">Owner Contact</Label>
              <Input
                id="owner_contact"
                placeholder="Owner's phone"
                {...register("owner_contact")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <Select {...register("status")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
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
            <Link href="/dashboard/flats">
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
                isEditing ? "Update Flat" : "Create Flat"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}