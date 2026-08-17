-- Seed data for development
-- This will be run after migrations

-- Note: You need to create users in Supabase Auth first, then this will create profiles
-- Run this after setting up auth users

-- Example: Insert a default admin user (replace with actual auth user ID)
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('your-auth-user-id', 'admin@example.com', 'Admin User', 'admin')
-- ON CONFLICT (id) DO NOTHING;

-- Sample properties based on your example data
INSERT INTO properties (name, address, city, area, status) VALUES
('Applewood', 'Applewood Society', 'Ahmedabad', 'SG Highway', 'active'),
('Shilp', 'Shilp Residency', 'Ahmedabad', 'Bopal', 'active'),
('Turquoise', 'Turquoise Heights', 'Ahmedabad', 'Thaltej', 'active'),
('Kavisha', 'Kavisha Apartments', 'Ahmedabad', 'Satellite', 'active'),
('Shyam', 'Shyam Villa', 'Ahmedabad', 'Vastrapur', 'active'),
('Kameshwar', 'Kameshwar Enclave', 'Ahmedabad', 'Prahlad Nagar', 'active'),
('Drive In', 'Drive In Road', 'Ahmedabad', 'Drive In', 'active'),
('Eden', 'Eden Gardens', 'Ahmedabad', 'Bopal', 'active'),
('Green Glads', 'Green Glads Society', 'Ahmedabad', 'Thaltej', 'active'),
('Avalon', 'Avalon Heights', 'Ahmedabad', 'Bopal', 'active'),
('Megnet', 'Megnet Residency', 'Ahmedabad', 'Bopal', 'active'),
('Samarna', 'Samarna Apartments', 'Ahmedabad', 'Satellite', 'active'),
('Harpal', 'Harpal Society', 'Ahmedabad', 'Thaltej', 'active'),
('Jineshwar', 'Jineshwar Society', 'Ahmedabad', 'Bopal', 'active'),
('Chankyapuri', 'Chankyapuri Sector', 'Ahmedabad', 'Chankyapuri', 'active'),
('Vani', 'Vani Apartments', 'Ahmedabad', 'Bopal', 'active')
ON CONFLICT DO NOTHING;