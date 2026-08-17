# VISTAR Real Estate - Development Instructions

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Database
npx supabase db push
npx supabase db seed
npx supabase migration new migration_name

# Test
npm run test
npm run test:e2e
```

## Architecture Rules

### Server vs Client Components
- **Default**: Server Components (no `'use client'`)
- **Use Client Components for**:
  - Interactive UI (forms, modals, dropdowns)
  - Browser APIs (localStorage, window)
  - React hooks (useState, useEffect)
  - Event handlers

### Data Fetching
- Use `createClient()` from `@/lib/supabase/server` in Server Components
- Use `createClient()` from `@/lib/supabase/client` in Client Components
- Use Server Actions for mutations (preferred over API routes)

### Supabase Patterns
```typescript
// Server Component
const supabase = await createClient();
const { data } = await supabase.from('table').select();

// Server Action
'use server';
const supabase = await createClient();
const { error } = await supabase.from('table').insert(data);

// Client Component
const supabase = createClient();
```

### Validation
- All forms use Zod schemas from `@/lib/validations/schemas.ts`
- Use `react-hook-form` with `@hookform/resolvers/zod`
- Validate on both client and server

### Currency Handling
- **Never use float** for money
- Use `NUMERIC(12,2)` in database
- Use `formatCurrency()` from `@/lib/utils/currency`
- Store as integer cents or numeric in database

### File Structure
```
src/
├── app/                    # Routes (App Router)
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── layout/            # Layout components
│   ├── forms/             # Form components
│   ├── tables/            # DataTable
│   ├── dashboard/         # Dashboard widgets
│   └── import/            # Import wizard
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── utils/             # Shared utilities
│   ├── validations/       # Zod schemas
│   └── constants/         # Enums, config
├── hooks/                 # Custom hooks
��── types/                 # TypeScript types
```

## Database Conventions

### Naming
- Tables: snake_case, plural (`rental_contracts`)
- Columns: snake_case (`monthly_rent`)
- Foreign keys: `{table}_id` (`customer_id`)
- Indexes: `idx_{table}_{column}`

### Constraints
- All monetary: `NUMERIC(12,2) CHECK (value >= 0)`
- UUIDs: `uuid_generate_v4()` default
- Timestamps: `TIMESTAMPTZ DEFAULT NOW()`
- Updated at: trigger function

### RLS
- Enable on ALL tables
- Policies per role (admin/manager/staff)
- Service role bypasses RLS (admin.ts client)

## Import System

### Flow
1. Upload → Parse (xlsx) → Map Columns → Validate → Preview → Confirm → Execute

### Duplicate Detection
| Entity | Unique Key |
|--------|------------|
| Properties | name (case-insensitive) |
| Flats | property_id + flat_number |
| Customers | mobile (normalized) |
| Contracts | contract_number |
| Payments | payment_number |

### Templates
Pre-defined CSV headers in `@/lib/import/templates.ts`

## Code Style

### Imports
```typescript
// External first
import { useState } from 'react';
import Link from 'next/link';

// Internal with @/
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

### Components
```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Client Component
'use client';
import { useState } from 'react';
export function Component() { ... }
```

### Server Actions
```typescript
'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('properties').insert({...});
  if (error) throw error;
  revalidatePath('/dashboard/properties');
}
```

## Testing

### Unit Tests
- Place in `__tests__` or `.test.tsx` alongside components
- Use Vitest + React Testing Library

### E2E Tests
- Use Playwright
- Place in `e2e/` directory

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase project configured
- [ ] RLS policies tested
- [ ] Build passes locally
- [ ] TypeScript compiles without errors
- [ ] Lint passes
- [ ] Database migrations applied
- [ ] Cloudflare DNS configured

## Common Patterns

### Pagination
```typescript
const { data, count } = await supabase
  .from('table')
  .select('*', { count: 'exact' })
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

### Optimistic Updates
```typescript
'use client';
const [data, setData] = useState(initialData);
async function handleAction() {
  setData(optimisticData);
  try {
    await serverAction();
  } catch {
    setData(initialData); // rollback
  }
}
```

### Error Handling
```typescript
try {
  const { error } = await supabase.from('table').insert(data);
  if (error) throw error;
} catch (error) {
  // Log to monitoring
  // Return user-friendly message
}
```

## Business Rules

1. One active contract per flat
2. Monthly rent generated from active contracts
3. No duplicate monthly_rent per contract/month
4. Payments can be partial
5. Balance = rent_amount - paid_amount (generated column)
6. Status: pending → partial → paid / overdue
7. Soft deletes only (status field)
8. Financial records never hard deleted

## Future Extensibility

- Phase 2: Add `furniture_items`, `furniture_assignments` tables
- Phase 3: Add `notifications`, `documents`, `customer_portal` tables
- Webhooks: Supabase Realtime for live updates