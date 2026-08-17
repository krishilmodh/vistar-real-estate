"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { propertySchema, type PropertyFormData } from "@/lib/validations/schemas";

export async function createProperty(formData: PropertyFormData) {
  const validated = propertySchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({
      ...validated,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/properties");
  return { success: true, data };
}

export async function updateProperty(id: string, formData: PropertyFormData) {
  const validated = propertySchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("properties")
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${id}`);
  return { success: true, data };
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("properties")
    .update({ status: "inactive", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/properties");
  return { success: true };
}

export async function getProperty(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProperties(page = 1, pageSize = 10, search = "") {
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%,area.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}