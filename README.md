# VISTAR Real Estate - Furniture Rental Management

Production-ready furniture rental management system for managing properties, flats, customers, contracts, rent, and payments.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel + Cloudflare
- **Validation**: Zod + React Hook Form
- **File Processing**: SheetJS (xlsx)

## Features

### Phase 1 (Current)
- �� Authentication (Email/Password)
- �� Role-based Access Control (Admin, Manager, Staff)
- �� Properties Management
- �� Flats Management
- �� Customers/Tenants Management
- �� Rental Contracts Management
- �� Monthly Rent Generation
- �� Payment Recording (Cash, Bank Transfer, UPI, Other)
- �� Excel/CSV Import with Validation
- �� Dashboard with Key Metrics
- �� Reports (Collection, Pending, Overdue, Customer-wise, Property-wise)
- �� Settings & User Management

### Phase 2 (Planned)
- Furniture Inventory
- Individual Furniture IDs
- Furniture Assignment & Handover
- Returns & Damage Tracking
- Maintenance Scheduling

### Phase 3 (Planned)
- WhatsApp Reminders
- Automatic Payment Reminders
- Online Payments Integration
- Customer Portal
- Digital Agreements
- Document Storage
- Advanced Reports

## Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm
- Supabase Account
- Vercel Account (for deployment)

### Installation

```bash
# Clone and install
cd vistar-real-estate
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CURRENCY=INR
```

### Database Setup

1. Create a new Supabase project
2. Run migrations:
```bash
npx supabase db push
```
Or manually run the SQL in `supabase/migrations/20240101000000_initial_schema.sql`

3. (Optional) Run seed data:
```bash
npx supabase db seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login)
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── properties/    # Properties CRUD
│   │   ├── flats/         # Flats CRUD
│   │   ├── customers/     # Customers CRUD
│   │   ├── contracts/     # Contracts CRUD
│   │   ├── rent/          # Monthly rent
│   │   ├── payments/      # Payments
│   │   ├── imports/       # CSV/Excel import
│   │   ├── reports/       # Reports
│   │   └── settings/      # Settings
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── forms/             # Form components
│   ├── tables/            # DataTable component
│   ├── dashboard/         # Dashboard widgets
│   └── import/            # Import wizard components
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── utils/             # Utility functions
│   ├── validations/       # Zod schemas
│   ├── constants/         # Enums & constants
│   └── import/            # Import processing
├── hooks/                 # Custom React hooks
��── types/                 # TypeScript types
```

## Database Schema

Key tables:
- `profiles` - User profiles (extends auth.users)
- `properties` - Rental properties
- `flats` - Individual flats within properties
- `customers` - Tenants/customers
- `rental_contracts` - Furniture rental agreements
- `monthly_rent` - Generated monthly rent records
- `payments` - Payment records
- `import_logs` - Import history

All monetary values use `NUMERIC(12,2)` for precision (INR currency).

## Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy

### Cloudflare + Vercel
1. Add domain to Cloudflare
2. Configure DNS: A record → Vercel IP, CNAME www → cname.vercel-dns.com
3. Enable Cloudflare WAF, Bot Protection, TLS 1.3

## Security

- Row Level Security (RLS) on all tables
- Role-based permissions (Admin/Manager/Staff)
- Input validation with Zod
- CSRF protection via SameSite cookies
- Rate limiting on auth endpoints
- Secure headers via middleware

## License

Proprietary - VISTAR Real Estate