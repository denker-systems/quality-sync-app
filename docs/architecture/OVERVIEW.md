# Architecture Overview

High-level architecture and design decisions for Quality Sync Mobile.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   React     │  │    React     │  │  React Native    │   │
│  │  Navigation │  │    Query     │  │     Paper        │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Application Layer                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │ Screens  │  │ Features │  │  Shared Hooks    │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Service Layer                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │   Auth   │  │   MFA    │  │  Data Services   │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Supabase Client                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │   Auth   │  │ Database │  │    Real-time     │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │   Auth API   │  │   Real-time      │  │
│  │   Database   │  │   (GoTrue)   │  │   Subscriptions  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. Feature-Based Architecture
Code is organized by features rather than technical layers. Each feature is self-contained with its own components, hooks, services, and types.

**Benefits:**
- Easy to locate related code
- Clear feature boundaries
- Simplified testing
- Better scalability

### 2. Separation of Concerns
Clear separation between:
- **Presentation Layer:** React components and screens
- **Business Logic:** Hooks and services
- **Data Layer:** Supabase client and queries

### 3. Composition Over Inheritance
Use React hooks and composition patterns instead of class inheritance.

### 4. Type Safety
Strict TypeScript usage throughout the codebase with no `any` types.

### 5. Single Source of Truth
- Authentication state managed by Supabase
- UI state managed by React Query
- Navigation state managed by React Navigation

## Core Patterns

### Authentication Flow

```typescript
User Login
    ↓
Supabase Auth (PKCE)
    ↓
Check MFA Status
    ↓
┌─────────────┬─────────────┐
│ Not Enrolled│  Enrolled   │
↓             ↓             ↓
MFA Enrollment  MFA Challenge
    ↓             ↓
    └─────────────┘
          ↓
    Session Created
          ↓
    Navigate to App
```

### Data Fetching Pattern

```typescript
Component
    ↓
Custom Hook (useMyEmployee)
    ↓
React Query (useQuery)
    ↓
Supabase Client
    ↓
PostgreSQL Database
```

### State Management Strategy

1. **Server State:** React Query
   - User data
   - Company data
   - Employee data

2. **Authentication State:** Supabase Auth
   - Session
   - User object
   - MFA status

3. **UI State:** React useState/useReducer
   - Form inputs
   - Modal visibility
   - Loading states

4. **Navigation State:** React Navigation
   - Current screen
   - Navigation history
   - Route parameters

## Key Components

### MFAGate
Wrapper component that enforces MFA requirements.

```typescript
<MFAGate>
  <AppNavigator />
</MFAGate>
```

**Responsibilities:**
- Check MFA enrollment status
- Show enrollment screen if needed
- Show challenge screen if enrolled
- Allow access when verified

### AppNavigator
Main navigation structure.

```typescript
<AppNavigator>
  {user ? <MainStack /> : <AuthStack />}
</AppNavigator>
```

**Responsibilities:**
- Route based on authentication state
- Manage navigation stack
- Handle deep linking

## Security Architecture

### Authentication Security
- **PKCE Flow:** Secure OAuth flow for mobile apps
- **Token Storage:** Secure storage using AsyncStorage
- **Auto-refresh:** Automatic token refresh before expiry
- **MFA:** Time-based One-Time Password (TOTP)

### Data Security
- **Row Level Security (RLS):** Database-level access control
- **Type Safety:** Compile-time type checking
- **Input Validation:** Zod schemas for form validation
- **HTTPS Only:** All API calls over secure connection

### Session Management
- Sessions stored securely in AsyncStorage
- Automatic session refresh
- Secure logout (clears all local data)
- Session expiry handling

## Performance Considerations

### Optimization Strategies

1. **React Query Caching**
   - Automatic background refetching
   - Stale-while-revalidate pattern
   - Optimistic updates

2. **Image Optimization**
   - Use Expo Image for caching
   - Lazy loading for images
   - Proper image sizing

3. **Code Splitting**
   - Feature-based modules
   - Lazy loading for heavy components
   - Dynamic imports where appropriate

4. **Memoization**
   - `useMemo` for expensive computations
   - `useCallback` for function props
   - `React.memo` for pure components

## Error Handling

### Error Boundaries
React error boundaries catch component errors and show fallback UI.

### API Error Handling
```typescript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
}
```

### Network Error Handling
- Retry logic for failed requests
- Offline detection
- User feedback for network issues

## Scalability

### Horizontal Scalability
- Feature modules can be developed independently
- Easy to add new features without affecting existing code
- Clear boundaries between features

### Code Maintainability
- TypeScript for type safety
- Clear naming conventions
- Comprehensive documentation
- Development logs for tracking changes

## Technology Decisions

### Why React Native + Expo?
- **Cross-platform:** Single codebase for iOS and Android
- **Fast development:** Hot reloading and OTA updates
- **Rich ecosystem:** Large library of packages
- **Native performance:** Access to native APIs

### Why Supabase?
- **Real-time:** Built-in real-time subscriptions
- **Authentication:** Complete auth system with MFA
- **PostgreSQL:** Powerful relational database
- **Row Level Security:** Database-level access control
- **Shared backend:** Same database as web app

### Why React Query?
- **Caching:** Automatic caching and invalidation
- **Background updates:** Keep data fresh
- **Optimistic updates:** Better UX
- **DevTools:** Excellent debugging tools

### Why React Navigation?
- **Native feel:** Platform-specific navigation patterns
- **Deep linking:** Support for URL schemes
- **Type-safe:** TypeScript support
- **Customizable:** Flexible configuration

## Future Considerations

### Planned Improvements
- **Offline mode:** Local data persistence
- **Push notifications:** Real-time alerts
- **Analytics:** User behavior tracking
- **Performance monitoring:** Crash reporting and metrics

### Potential Challenges
- **Large datasets:** Pagination and virtualization
- **Complex forms:** Multi-step forms with validation
- **File uploads:** Image and document handling
- **Background tasks:** Sync and notifications

## Next Steps

- Learn about [Tech Stack](./TECH_STACK.md) in detail
- Understand [Data Flow](./DATA_FLOW.md)
- Review [State Management](./STATE_MANAGEMENT.md)

---

**Last Updated:** 2026-01-20
