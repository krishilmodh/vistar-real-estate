-- Enum types
CREATE TYPE property_status AS ENUM ('active', 'inactive', 'under_maintenance');
CREATE TYPE flat_status AS ENUM ('available', 'occupied', 'reserved', 'under_maintenance');
CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'blacklisted');
CREATE TYPE contract_status AS ENUM ('draft', 'active', 'expired', 'terminated', 'renewed');
CREATE TYPE rent_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'upi', 'other');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE import_entity AS ENUM ('properties', 'flats', 'customers', 'contracts', 'payments');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'staff',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    area TEXT,
    notes TEXT,
    status property_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Flats
CREATE TABLE flats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    flat_number TEXT NOT NULL,
    block TEXT,
    floor TEXT,
    owner_name TEXT,
    owner_contact TEXT,
    status flat_status DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    UNIQUE (property_id, flat_number)
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mobile TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    id_type TEXT,
    id_number TEXT,
    notes TEXT,
    status customer_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Rental Contracts
CREATE TABLE rental_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rent NUMERIC(12,2) NOT NULL CHECK (monthly_rent >= 0),
    security_deposit NUMERIC(12,2) DEFAULT 0 CHECK (security_deposit >= 0),
    billing_day INT NOT NULL DEFAULT 1 CHECK (billing_day BETWEEN 1 AND 28),
    due_date INT NOT NULL DEFAULT 5 CHECK (due_date BETWEEN 1 AND 28),
    status contract_status DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Monthly Rent
CREATE TABLE monthly_rent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES rental_contracts(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE RESTRICT,
    billing_month DATE NOT NULL,
    due_date DATE NOT NULL,
    rent_amount NUMERIC(12,2) NOT NULL CHECK (rent_amount >= 0),
    paid_amount NUMERIC(12,2) DEFAULT 0 CHECK (paid_amount >= 0),
    balance NUMERIC(12,2) GENERATED ALWAYS AS (rent_amount - paid_amount) STORED,
    status rent_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (contract_id, billing_month)
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    contract_id UUID NOT NULL REFERENCES rental_contracts(id) ON DELETE RESTRICT,
    monthly_rent_id UUID REFERENCES monthly_rent(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method payment_method NOT NULL,
    transaction_ref TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Import Logs
CREATE TABLE import_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type import_entity NOT NULL,
    file_name TEXT NOT NULL,
    total_rows INT DEFAULT 0,
    created_count INT DEFAULT 0,
    updated_count INT DEFAULT 0,
    skipped_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    errors JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Indexes
CREATE INDEX idx_flats_property ON flats(property_id);
CREATE INDEX idx_contracts_customer ON rental_contracts(customer_id);
CREATE INDEX idx_contracts_flat ON rental_contracts(flat_id);
CREATE INDEX idx_contracts_status ON rental_contracts(status);
CREATE INDEX idx_monthly_rent_contract ON monthly_rent(contract_id);
CREATE INDEX idx_monthly_rent_billing_month ON monthly_rent(billing_month);
CREATE INDEX idx_monthly_rent_status ON monthly_rent(status);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_monthly_rent ON payments(monthly_rent_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_customers_mobile ON customers(mobile);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_flats_status ON flats(status);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_flats_updated_at BEFORE UPDATE ON flats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON rental_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_monthly_rent_updated_at BEFORE UPDATE ON monthly_rent FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_rent ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Properties policies
CREATE POLICY "properties_select_all" ON properties FOR SELECT USING (true);
CREATE POLICY "properties_insert_manager" ON properties FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "properties_update_manager" ON properties FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "properties_delete_admin" ON properties FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Flats policies
CREATE POLICY "flats_select_all" ON flats FOR SELECT USING (true);
CREATE POLICY "flats_insert_manager" ON flats FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "flats_update_manager" ON flats FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "flats_delete_admin" ON flats FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Customers policies
CREATE POLICY "customers_select_all" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_insert_staff" ON customers FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);
CREATE POLICY "customers_update_staff" ON customers FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);
CREATE POLICY "customers_delete_admin" ON customers FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contracts policies
CREATE POLICY "contracts_select_all" ON rental_contracts FOR SELECT USING (true);
CREATE POLICY "contracts_insert_manager" ON rental_contracts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);
CREATE POLICY "contracts_update_manager" ON rental_contracts FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);
CREATE POLICY "contracts_delete_admin" ON rental_contracts FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Monthly Rent policies
CREATE POLICY "monthly_rent_select_all" ON monthly_rent FOR SELECT USING (true);
CREATE POLICY "monthly_rent_insert_manager" ON monthly_rent FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);
CREATE POLICY "monthly_rent_update_manager" ON monthly_rent FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

-- Payments policies
CREATE POLICY "payments_select_all" ON payments FOR SELECT USING (true);
CREATE POLICY "payments_insert_staff" ON payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);
CREATE POLICY "payments_update_manager" ON payments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "payments_delete_admin" ON payments FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Import logs policies
CREATE POLICY "import_logs_select_own" ON import_logs FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "import_logs_insert_staff" ON import_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);