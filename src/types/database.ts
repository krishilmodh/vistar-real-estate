export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "manager" | "staff";
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "manager" | "staff";
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "manager" | "staff";
          created_at?: string;
          last_login?: string | null;
        };
      };
      properties: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          city: string | null;
          area: string | null;
          notes: string | null;
          status: "active" | "inactive" | "under_maintenance";
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          city?: string | null;
          area?: string | null;
          notes?: string | null;
          status?: "active" | "inactive" | "under_maintenance";
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          city?: string | null;
          area?: string | null;
          notes?: string | null;
          status?: "active" | "inactive" | "under_maintenance";
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      flats: {
        Row: {
          id: string;
          property_id: string;
          flat_number: string;
          block: string | null;
          floor: string | null;
          owner_name: string | null;
          owner_contact: string | null;
          status: "available" | "occupied" | "reserved" | "under_maintenance";
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          property_id: string;
          flat_number: string;
          block?: string | null;
          floor?: string | null;
          owner_name?: string | null;
          owner_contact?: string | null;
          status?: "available" | "occupied" | "reserved" | "under_maintenance";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          flat_number?: string;
          block?: string | null;
          floor?: string | null;
          owner_name?: string | null;
          owner_contact?: string | null;
          status?: "available" | "occupied" | "reserved" | "under_maintenance";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          mobile: string | null;
          whatsapp: string | null;
          email: string | null;
          address: string | null;
          id_type: string | null;
          id_number: string | null;
          notes: string | null;
          status: "active" | "inactive" | "blacklisted";
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          mobile?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          address?: string | null;
          id_type?: string | null;
          id_number?: string | null;
          notes?: string | null;
          status?: "active" | "inactive" | "blacklisted";
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          mobile?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          address?: string | null;
          id_type?: string | null;
          id_number?: string | null;
          notes?: string | null;
          status?: "active" | "inactive" | "blacklisted";
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      rental_contracts: {
        Row: {
          id: string;
          contract_number: string;
          customer_id: string;
          property_id: string;
          flat_id: string;
          start_date: string;
          end_date: string | null;
          monthly_rent: number;
          security_deposit: number;
          billing_day: number;
          due_date: number;
          status: "draft" | "active" | "expired" | "terminated" | "renewed";
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          contract_number: string;
          customer_id: string;
          property_id: string;
          flat_id: string;
          start_date: string;
          end_date?: string | null;
          monthly_rent: number;
          security_deposit?: number;
          billing_day?: number;
          due_date?: number;
          status?: "draft" | "active" | "expired" | "terminated" | "renewed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          contract_number?: string;
          customer_id?: string;
          property_id?: string;
          flat_id?: string;
          start_date?: string;
          end_date?: string | null;
          monthly_rent?: number;
          security_deposit?: number;
          billing_day?: number;
          due_date?: number;
          status?: "draft" | "active" | "expired" | "terminated" | "renewed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      monthly_rent: {
        Row: {
          id: string;
          contract_id: string;
          customer_id: string;
          property_id: string;
          flat_id: string;
          billing_month: string;
          due_date: string;
          rent_amount: number;
          paid_amount: number;
          balance: number;
          status: "pending" | "partial" | "paid" | "overdue" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          customer_id: string;
          property_id: string;
          flat_id: string;
          billing_month: string;
          due_date: string;
          rent_amount: number;
          paid_amount?: number;
          status?: "pending" | "partial" | "paid" | "overdue" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contract_id?: string;
          customer_id?: string;
          property_id?: string;
          flat_id?: string;
          billing_month?: string;
          due_date?: string;
          rent_amount?: number;
          paid_amount?: number;
          status?: "pending" | "partial" | "paid" | "overdue" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          payment_number: string;
          customer_id: string;
          contract_id: string;
          monthly_rent_id: string | null;
          amount: number;
          payment_date: string;
          payment_method: "cash" | "bank_transfer" | "upi" | "other";
          transaction_ref: string | null;
          notes: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          payment_number: string;
          customer_id: string;
          contract_id: string;
          monthly_rent_id?: string | null;
          amount: number;
          payment_date?: string;
          payment_method: "cash" | "bank_transfer" | "upi" | "other";
          transaction_ref?: string | null;
          notes?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          payment_number?: string;
          customer_id?: string;
          contract_id?: string;
          monthly_rent_id?: string | null;
          amount?: number;
          payment_date?: string;
          payment_method?: "cash" | "bank_transfer" | "upi" | "other";
          transaction_ref?: string | null;
          notes?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
      import_logs: {
        Row: {
          id: string;
          entity_type: "properties" | "flats" | "customers" | "contracts" | "payments";
          file_name: string;
          total_rows: number;
          created_count: number;
          updated_count: number;
          skipped_count: number;
          failed_count: number;
          error_details: Json;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          entity_type: "properties" | "flats" | "customers" | "contracts" | "payments";
          file_name: string;
          total_rows?: number;
          created_count?: number;
          updated_count?: number;
          skipped_count?: number;
          failed_count?: number;
          error_details?: Json;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          entity_type?: "properties" | "flats" | "customers" | "contracts" | "payments";
          file_name?: string;
          total_rows?: number;
          created_count?: number;
          updated_count?: number;
          skipped_count?: number;
          failed_count?: number;
          error_details?: Json;
          created_at?: string;
          created_by?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      property_status: "active" | "inactive" | "under_maintenance";
      flat_status: "available" | "occupied" | "reserved" | "under_maintenance";
      customer_status: "active" | "inactive" | "blacklisted";
      contract_status: "draft" | "active" | "expired" | "terminated" | "renewed";
      rent_status: "pending" | "partial" | "paid" | "overdue" | "cancelled";
      payment_method: "cash" | "bank_transfer" | "upi" | "other";
      user_role: "admin" | "manager" | "staff";
      import_entity: "properties" | "flats" | "customers" | "contracts" | "payments";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];