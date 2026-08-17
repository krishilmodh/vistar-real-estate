"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
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

type MonthlyRentFormData = z.infer<typeof monthlyRentSchema>;

export async function createMonthlyRent(formData: MonthlyRentFormData) {
  const validated = monthlyRentSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const balance = validated.rent_amount - validated.paid_amount;
  let status = validated.status;
  if (balance <= 0) status = "paid";
  else if (validated.paid_amount > 0) status = "partial";

  const { data, error } = await supabase
    .from("monthly_rent")
    .insert({
      ...validated,
      balance,
      status,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/rent");
  return { success: true, data };
}

export async function updateMonthlyRent(id: string, formData: MonthlyRentFormData) {
  const validated = monthlyRentSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const balance = validated.rent_amount - validated.paid_amount;
  let status = validated.status;
  if (balance <= 0) status = "paid";
  else if (validated.paid_amount > 0) status = "partial";

  const { data, error } = await supabase
    .from("monthly_rent")
    .update({
      ...validated,
      balance,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/rent");
  revalidatePath(`/dashboard/rent/${id}`);
  return { success: true, data };
}

export async function deleteMonthlyRent(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("monthly_rent")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/rent");
  return { success: true };
}

export async function getMonthlyRent(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("monthly_rent")
    .select(`
      *,
      contracts:contract_id (id, contract_number, monthly_rent),
      customers:customer_id (id, name, mobile),
      properties:property_id (id, name),
      flats:flat_id (id, flat_number)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMonthlyRents(page = 1, pageSize = 10, search = "", status = "all", month = "all") {
  const supabase = await createClient();

  let query = supabase
    .from("monthly_rent")
    .select(`
      *,
      contracts:contract_id (id, contract_number, monthly_rent),
      customers:customer_id (id, name, mobile),
      properties:property_id (id, name),
      flats:flat_id (id, flat_number)
    `, { count: "exact" })
    .order("billing_month", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`contracts.contract_number.ilike.%${search}%,customers.name.ilike.%${search}%,properties.name.ilike.%${search}%,flats.flat_number.ilike.%${search}%`);
  }

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (month !== "all") {
    query = query.eq("billing_month", month);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}

export async function getContractsForRentSelect() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rental_contracts")
    .select(`
      id,
      contract_number,
      monthly_rent,
      customers:customer_id (id, name, mobile),
      properties:property_id (id, name),
      flats:flat_id (id, flat_number)
    `)
    .eq("status", "active")
    .order("contract_number");

  if (error) {
    throw new Error(error.message);
  }

  // Transform array relationships to single objects
  return (data || []).map(item => ({
    ...item,
    customers: Array.isArray(item.customers) ? item.customers[0] : item.customers,
    properties: Array.isArray(item.properties) ? item.properties[0] : item.properties,
    flats: Array.isArray(item.flats) ? item.flats[0] : item.flats,
  }));
}