# Database Schema

Overview of the Quality Sync database schema and relationships.

## Overview

The Quality Sync mobile app uses a shared PostgreSQL database via Supabase with the web application. All tables use Row Level Security (RLS) for access control.

## Core Tables

### employees

Stores employee information linked to user accounts.

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  personal_number TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**

- `user_id` - Links to Supabase auth user
- `company_id` - Links to company
- `personal_number` - Swedish personnummer

**RLS Policies:**

- Users can view their own employee record
- Users can update their own employee record

### companies

Stores company information.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  org_number TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Sweden',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**

- Users can view companies they're associated with

## Relationships

```
auth.users (Supabase Auth)
    ↓ (1:1)
employees
    ↓ (N:1)
companies
```

## TypeScript Types

Generated types are in `src/types/database.types.ts`:

```typescript
export type Employee = Database['public']['Tables']['employees']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
```

## Queries

### Get Employee by User ID

```typescript
const { data, error } = await supabase.from('employees').select('*').eq('user_id', userId).single();
```

### Get Employee with Company

```typescript
const { data, error } = await supabase
  .from('employees')
  .select(
    `
    *,
    company:companies(*)
  `,
  )
  .eq('user_id', userId)
  .single();
```

## Row Level Security (RLS)

All tables have RLS enabled. Example policy:

```sql
-- Users can view their own employee record
CREATE POLICY "Users can view own employee"
ON employees FOR SELECT
USING (auth.uid() = user_id);
```

## Indexes

Key indexes for performance:

```sql
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_company_id ON employees(company_id);
```

## Migrations

Database changes are tracked in Supabase migrations. Contact backend team for schema changes.

---

**Last Updated:** 2026-01-20
