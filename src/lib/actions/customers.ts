"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { customerSchema, type CustomerFormData } from "@/lib/validations/schemas";

function normalizeMobile(mobile: string): string {
  return mobile.replace(/\D/g, "");
}

export async function createCustomer(formData: CustomerFormData) {
  const validated = customerSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const mobileNormalized = validated.mobile ? normalizeMobile(validated.mobile) : null;

  const { data, error } = await supabase
    .from("customers")
    .insert({
      ...validated,
      mobile: mobileNormalized,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/customers");
  return { success: true, data };
}

export async function updateCustomer(id: string, formData: CustomerFormData) {
  const validated = customerSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const mobileNormalized = validated.mobile ? normalizeMobile(validated.mobile) : null;

  const { data, error } = await supabase
    .from("customers")
    .update({
      ...validated,
      mobile: mobileNormalized,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
  return { success: true, data };
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("customers")
    .update({ status: "inactive", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/customers");
  return { success: true };
}

export async function getCustomer(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCustomers(page = 1, pageSize = 10, search = "") {
  const supabase = await createClient();

  let query = supabase
    .from("customers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    const normalizedSearch = normalizeMobile(search);
    query = query.or(`name.ilike.%${search}%,mobile.ilike.%${normalizedSearch}%,email.ilike.%${search}%,id_number.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}