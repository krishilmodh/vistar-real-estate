"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { paymentSchema, type PaymentFormData } from "@/lib/validations/schemas";

function normalizeMobile(mobile: string): string {
  return mobile.replace(/\D/g, "");
}

export async function createPayment(formData: PaymentFormData) {
  const validated = paymentSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      ...validated,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Update the monthly_rent paid_amount and balance if linked
  if (validated.monthly_rent_id) {
    const { data: rent } = await supabase
      .from("monthly_rent")
      .select("paid_amount, rent_amount")
      .eq("id", validated.monthly_rent_id)
      .single();

    if (rent) {
      const newPaidAmount = (rent.paid_amount || 0) + validated.amount;
      const balance = rent.rent_amount - newPaidAmount;
      let status = "pending";
      if (balance <= 0) status = "paid";
      else if (newPaidAmount > 0) status = "partial";

      await supabase
        .from("monthly_rent")
        .update({ paid_amount: newPaidAmount, balance, status, updated_at: new Date().toISOString() })
        .eq("id", validated.monthly_rent_id);
    }
  }

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/rent");
  return { success: true, data };
}

export async function updatePayment(id: string, formData: PaymentFormData) {
  const validated = paymentSchema.parse(formData);

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Get the old payment to calculate difference for monthly_rent update
  const { data: oldPayment } = await supabase
    .from("payments")
    .select("amount, monthly_rent_id")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("payments")
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

  // Update monthly_rent if linked and amount changed
  if (validated.monthly_rent_id && oldPayment && oldPayment.amount !== validated.amount) {
    const { data: rent } = await supabase
      .from("monthly_rent")
      .select("paid_amount, rent_amount")
      .eq("id", validated.monthly_rent_id)
      .single();

    if (rent) {
      const newPaidAmount = (rent.paid_amount || 0) - (oldPayment.amount || 0) + validated.amount;
      const balance = rent.rent_amount - newPaidAmount;
      let status = "pending";
      if (balance <= 0) status = "paid";
      else if (newPaidAmount > 0) status = "partial";

      await supabase
        .from("monthly_rent")
        .update({ paid_amount: newPaidAmount, balance, status, updated_at: new Date().toISOString() })
        .eq("id", validated.monthly_rent_id);
    }
  }

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/rent");
  revalidatePath(`/dashboard/payments/${id}`);
  return { success: true, data };
}

export async function deletePayment(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Get the payment to update monthly_rent
  const { data: payment } = await supabase
    .from("payments")
    .select("amount, monthly_rent_id")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  // Update monthly_rent if linked
  if (payment?.monthly_rent_id) {
    const { data: rent } = await supabase
      .from("monthly_rent")
      .select("paid_amount, rent_amount")
      .eq("id", payment.monthly_rent_id)
      .single();

    if (rent) {
      const newPaidAmount = (rent.paid_amount || 0) - (payment.amount || 0);
      const balance = rent.rent_amount - newPaidAmount;
      let status = "pending";
      if (balance <= 0) status = "paid";
      else if (newPaidAmount > 0) status = "partial";

      await supabase
        .from("monthly_rent")
        .update({ paid_amount: newPaidAmount, balance, status, updated_at: new Date().toISOString() })
        .eq("id", payment.monthly_rent_id);
    }
  }

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/rent");
  return { success: true };
}

export async function getPayment(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      customers:customer_id (id, name, mobile),
      contracts:contract_id (id, contract_number, properties:property_id (id, name), flats:flat_id (id, flat_number)),
      monthly_rent:monthly_rent_id (id, billing_month)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPayments(page = 1, pageSize = 10, search = "", method = "all", month = "all") {
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select(`
      *,
      customers:customer_id (id, name, mobile),
      contracts:contract_id (id, contract_number, properties:property_id (id, name), flats:flat_id (id, flat_number)),
      monthly_rent:monthly_rent_id (id, billing_month)
    `, { count: "exact" })
    .order("payment_date", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`payment_number.ilike.%${search}%,customers.name.ilike.%${search}%,contracts.contract_number.ilike.%${search}%,transaction_ref.ilike.%${search}%`);
  }

  if (method !== "all") {
    query = query.eq("payment_method", method);
  }

  if (month !== "all") {
    query = query.eq("monthly_rent.billing_month", month);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}

export async function getCustomersForPaymentSelect() {
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

export async function getContractsForPaymentSelect() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rental_contracts")
    .select(`
      id,
      contract_number,
      customers:customer_id (id, name, mobile),
      properties:property_id (id, name),
      flats:flat_id (id, flat_number)
    `)
    .eq("status", "active")
    .order("contract_number");

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(item => ({
    ...item,
    customers: Array.isArray(item.customers) ? item.customers[0] : item.customers,
    properties: Array.isArray(item.properties) ? item.properties[0] : item.properties,
    flats: Array.isArray(item.flats) ? item.flats[0] : item.flats,
  }));
}

export async function getMonthlyRentsForPaymentSelect() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("monthly_rent")
    .select(`
      id,
      billing_month,
      contracts:contract_id (contract_number),
      customers:customer_id (name)
    `)
    .in("status", ["pending", "partial", "overdue"])
    .order("billing_month", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(item => ({
    ...item,
    contracts: Array.isArray(item.contracts) ? item.contracts[0] : item.contracts,
    customers: Array.isArray(item.customers) ? item.customers[0] : item.customers,
  }));
}