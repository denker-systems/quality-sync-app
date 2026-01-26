# Supabase Setup

Complete guide to Supabase configuration and usage in Quality Sync Mobile.

## Overview

Quality Sync Mobile uses Supabase as its backend-as-a-service, providing:

- **Authentication:** User management and MFA
- **Database:** PostgreSQL with Row Level Security
- **Real-time:** Live data subscriptions
- **Storage:** File uploads (future)

## Shared Backend

The mobile app shares the same Supabase project as the Quality Sync web application:

- Same database schema
- Same authentication system
- Same RLS policies
- Same API endpoints

## Configuration

### Environment Variables

**Location:** `.env`

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Client Setup

**Location:** `src/config/supabase.ts`

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Key Configuration Options

#### `storage: AsyncStorage`

- Stores session in device storage
- Persists across app restarts
- Secure on both iOS and Android

#### `autoRefreshToken: true`

- Automatically refreshes access tokens
- Prevents session expiry
- Happens in background

#### `persistSession: true`

- Saves session to storage
- Restores on app launch
- Required for "remember me" functionality

#### `detectSessionInUrl: false`

- Disables URL-based session detection
- Not needed for mobile apps
- Prevents unnecessary checks

## Authentication

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

if (error) {
  console.error('Login error:', error.message);
} else {
  console.log('User:', data.user);
  console.log('Session:', data.session);
}
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut();

if (error) {
  console.error('Logout error:', error.message);
}
```

### Get Current User

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();

if (user) {
  console.log('Logged in as:', user.email);
} else {
  console.log('Not logged in');
}
```

### Auth State Listener

```typescript
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);

  if (event === 'SIGNED_IN') {
    // User signed in
  } else if (event === 'SIGNED_OUT') {
    // User signed out
  } else if (event === 'TOKEN_REFRESHED') {
    // Token was refreshed
  }
});

// Cleanup
subscription.unsubscribe();
```

## Database Queries

### Select Data

```typescript
const { data, error } = await supabase.from('employees').select('*').eq('user_id', userId).single();

if (error) {
  console.error('Query error:', error.message);
} else {
  console.log('Employee:', data);
}
```

### Select with Joins

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

### Insert Data

```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert({
    column1: 'value1',
    column2: 'value2',
  })
  .select()
  .single();
```

### Update Data

```typescript
const { data, error } = await supabase
  .from('table_name')
  .update({ column1: 'new_value' })
  .eq('id', recordId)
  .select()
  .single();
```

### Delete Data

```typescript
const { error } = await supabase.from('table_name').delete().eq('id', recordId);
```

## Real-time Subscriptions

### Subscribe to Changes

```typescript
const subscription = supabase
  .channel('employees-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'employees',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Change received:', payload);
      // Update local state
    },
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

### Event Types

- `INSERT` - New row created
- `UPDATE` - Row updated
- `DELETE` - Row deleted
- `*` - All events

## Row Level Security (RLS)

### What is RLS?

Row Level Security ensures users can only access data they're authorized to see:

- Enforced at database level
- Cannot be bypassed
- Applies to all queries

### Example Policy

```sql
-- Users can only see their own employee record
CREATE POLICY "Users can view own employee"
ON employees FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own employee record
CREATE POLICY "Users can update own employee"
ON employees FOR UPDATE
USING (auth.uid() = user_id);
```

### Checking Policies

If a query returns no data, check:

1. RLS is enabled on the table
2. Appropriate policies exist
3. User is authenticated
4. Policy conditions are met

## Multi-Factor Authentication

### Enroll Factor

```typescript
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Quality Sync Mobile',
});

if (!error) {
  console.log('QR Code:', data.totp.qr_code);
  console.log('Secret:', data.totp.secret);
  console.log('Factor ID:', data.id);
}
```

### Verify Factor

```typescript
// Create challenge
const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });

// Verify code
const { data, error } = await supabase.auth.mfa.verify({
  factorId,
  challengeId: challenge.id,
  code: '123456',
});
```

### List Factors

```typescript
const { data, error } = await supabase.auth.mfa.listFactors();

if (!error) {
  console.log('TOTP factors:', data.totp);
  console.log('All factors:', data.all);
}
```

### Get Assurance Level

```typescript
const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

if (!error) {
  console.log('Current level:', data.currentLevel); // 'aal1' or 'aal2'
  console.log('Next level:', data.nextLevel);
}
```

## Error Handling

### Common Errors

```typescript
try {
  const { data, error } = await supabase.from('table').select();

  if (error) throw error;

  return data;
} catch (error) {
  if (error.code === 'PGRST116') {
    // No rows returned
  } else if (error.code === '42501') {
    // Insufficient privileges (RLS)
  } else if (error.message.includes('JWT')) {
    // Authentication error
  } else {
    // Generic error
    console.error('Supabase error:', error);
  }
}
```

### Network Errors

```typescript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
} catch (error) {
  if (error.message.includes('Failed to fetch')) {
    Alert.alert('Network Error', 'Please check your connection');
  }
}
```

## TypeScript Types

### Generate Types

Generate TypeScript types from your database schema:

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

### Using Types

```typescript
import { Database } from '@/types/database.types';

type Employee = Database['public']['Tables']['employees']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];

const employee: Employee = {
  id: '123',
  user_id: '456',
  first_name: 'John',
  last_name: 'Doe',
  // ... other fields
};
```

### Type-Safe Queries

```typescript
const { data, error } = await supabase.from('employees').select('*').returns<Employee[]>();
```

## Best Practices

### 1. Error Handling

Always check for errors:

```typescript
const { data, error } = await supabase.from('table').select();
if (error) {
  // Handle error
  console.error(error);
  return;
}
// Use data
```

### 2. Type Safety

Use generated types for type safety:

```typescript
import { Database } from '@/types/database.types';
type Tables = Database['public']['Tables'];
```

### 3. Query Optimization

Select only needed columns:

```typescript
// ❌ Bad - fetches all columns
.select('*')

// ✅ Good - fetches specific columns
.select('id, first_name, last_name')
```

### 4. Connection Pooling

Reuse the supabase client:

```typescript
// ✅ Good - single instance
export const supabase = createClient(url, key);

// ❌ Bad - multiple instances
const supabase = createClient(url, key); // Don't repeat
```

### 5. Secure Storage

Never expose service role key in mobile app:

```typescript
// ✅ Good - anon key
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// ❌ Bad - service role key
const supabaseServiceKey = '...'; // NEVER in mobile app
```

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to Supabase

**Solutions:**

1. Verify URL and anon key in `.env`
2. Check network connection
3. Verify Supabase project is active
4. Test URL in browser

### RLS Blocking Queries

**Problem:** Queries return empty even though data exists

**Solutions:**

1. Check if user is authenticated
2. Verify RLS policies exist
3. Test query in Supabase dashboard
4. Check policy conditions

### Session Not Persisting

**Problem:** User logged out after app restart

**Solutions:**

1. Verify `persistSession: true`
2. Check AsyncStorage permissions
3. Clear app data and retry

### Token Refresh Fails

**Problem:** User logged out unexpectedly

**Solutions:**

1. Verify `autoRefreshToken: true`
2. Check network connectivity
3. Verify token hasn't been revoked

## Related Documentation

- [Authentication](../features/AUTHENTICATION.md)
- [Multi-Factor Authentication](../features/MFA.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Reference](./API_REFERENCE.md)

---

**Last Updated:** 2026-01-20
