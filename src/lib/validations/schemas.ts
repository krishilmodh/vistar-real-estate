import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  area: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(["active", "inactive", "under_maintenance"]).optional().default("active"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const flatSchema = z.object({
  property_id: z.string().uuid("Invalid property"),
  flat_number: z.string().min(1, "Flat number is required").max(20),
  block: z.string().max(20).optional(),
  floor: z.string().max(20).optional(),
  owner_name: z.string().max(100).optional(),
  owner_contact: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(["available", "occupied", "reserved", "under_maintenance"]).default("available"),
});

export type FlatFormData = z.infer<typeof flatSchema>;

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  mobile: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email("Invalid email").max(100).optional().or(z.literal("")),
  address: z.string().max(300).optional(),
  id_type: z.string().max(50).optional(),
  id_number: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(["active", "inactive", "blacklisted"]).default("active"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const contractSchema = z.object({
  contract_number: z.string().min(1, "Contract number is required").max(30),
  customer_id: z.string().uuid("Invalid customer"),
  property_id: z.string().uuid("Invalid property"),
  flat_id: z.string().uuid("Invalid flat"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional().or(z.literal("")),
  monthly_rent: z.number().min(0, "Rent must be positive"),
  security_deposit: z.number().min(0).default(0),
  billing_day: z.number().int().min(1).max(28).default(1),
  due_date: z.number().int().min(1).max(28).default(5),
  notes: z.string().max(500).optional(),
  status: z.enum(["draft", "active", "expired", "terminated", "renewed"]).default("draft"),
}).refine((data) => {
  if (data.end_date && data.end_date !== "") {
    return data.end_date >= data.start_date;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export type ContractFormData = z.infer<typeof contractSchema>;

export const paymentSchema = z.object({
  payment_number: z.string().min(1, "Payment number is required").max(30),
  customer_id: z.string().uuid("Invalid customer"),
  contract_id: z.string().uuid("Invalid contract"),
  monthly_rent_id: z.string().uuid().optional().nullable(),
  amount: z.number().min(0.01, "Amount must be positive"),
  payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  payment_method: z.enum(["cash", "bank_transfer", "upi", "other"]),
  transaction_ref: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;