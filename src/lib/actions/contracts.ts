"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { contractSchema, type ContractFormData } from "@/lib/validations/schemas";

export async function createContract(formData: ContractFormData) {
  const validated = contractSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("rental_contracts")
    .insert({
      ...validated,
      end_date: validated.end_date || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/contracts");
  return { success: true, data };
}

export async function updateContract(id: string, formData: ContractFormData) {
  const validated = contractSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("rental_contracts")
    .update({
      ...validated,
      end_date: validated.end_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${id}`);
  return { success: true, data };
}

export async function deleteContract(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("rental_contracts")
    .update({ status: "terminated", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/contracts");
  return { success: true };
}

export async function getContract(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rental_contracts")
    .select(`
      *,
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

export async function getContracts(page = 1, pageSize = 10, search = "") {
  const supabase = await createClient();

  let query = supabase
    .from("rental_contracts")
    .select(`
      *,
      customers:customer_id (id, name, mobile),
      properties:property_id (id, name),
      flats:flat_id (id, flat_number)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`contract_number.ilike.%${search}%,customers.name.ilike.%${search}%,properties.name.ilike.%${search}%,flats.flat_number.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}

export async function getCustomersForSelect() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, mobile")
    .eq("status", "active")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getPropertiesForSelect() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getFlatsForSelect(propertyId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("flats")
    .select("id, flat_number, property_id")
    .eq("status", "available")
    .order("flat_number");

  if (propertyId) {
    query = query.eq("property_id", propertyId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}