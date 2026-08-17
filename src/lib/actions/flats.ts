"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { flatSchema, type FlatFormData } from "@/lib/validations/schemas";

export async function createFlat(formData: FlatFormData) {
  const validated = flatSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("flats")
    .insert({
      ...validated,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/flats");
  return { success: true, data };
}

export async function updateFlat(id: string, formData: FlatFormData) {
  const validated = flatSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("flats")
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

  revalidatePath("/dashboard/flats");
  revalidatePath(`/dashboard/flats/${id}`);
  return { success: true, data };
}

export async function deleteFlat(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("flats")
    .update({ status: "under_maintenance", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/flats");
  return { success: true };
}

export async function getFlat(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("flats")
    .select(`
      *,
      properties:property_id (id, name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getFlats(page = 1, pageSize = 10, search = "") {
  const supabase = await createClient();

  let query = supabase
    .from("flats")
    .select(`
      *,
      properties:property_id (id, name)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`flat_number.ilike.%${search}%,block.ilike.%${search}%,owner_name.ilike.%${search}%,properties.name.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
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