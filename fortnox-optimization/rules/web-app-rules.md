# React Web App Rules (Fortnox Quinyx Sync)

## Tech Stack
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **UI Library:** shadcn/ui + TailwindCSS
- **State/Data:** TanStack React Query
- **Backend/Auth:** Supabase + Netlify Functions
- **Deployment:** Netlify

## Best Practices

### UI & Styling
- **Components:** Use `shadcn/ui` components from `@/components/ui` as the foundation.
- **Styling:** Use TailwindCSS for layout and styling. Adopt a mobile-first approach using responsive prefixes (e.g., `md:`, `lg:`).
- **Accessibility:** Ensure WCAG 2.1 AA compliance. Use Radix UI primitives for complex interactive components to guarantee keyboard navigation and screen reader support.
- **Icons:** Use `lucide-react` for icons.

### React Components
- **Structure:** Use functional components with named exports.
- **Logic:** Encapsulate complex logic in custom hooks (`useAuth`, `useQuery`) to keep components clean.
- **Granularity:** Avoid large monolithic components. Break them down into smaller, focused parts with single responsibilities.
- **Performance:** Use `React.memo`, `useMemo`, and `useCallback` judiciously to prevent unnecessary re-renders.

### Data Fetching
- **Server State:** Use React Query for all server state management. Do not use global state (Context/Redux) for API data.
- **States:** Handle `isLoading` and `isError` states gracefully in the UI.
- **Types:** Use generated Supabase types (`src/types/database.types.ts`) for strict type safety.

### Netlify Functions
- **Usage:** Use Serverless Functions for sensitive operations (e.g., interacting with Fortnox API, handling OAuth tokens).
- **Location:** Place all functions in `netlify/functions/`.
- **Security:** Use strict CORS headers and validate request origins. **NEVER** expose API secrets in the frontend code.
- **Error Handling:** Return appropriate HTTP status codes and standardized error JSON.

### Database (Supabase)
- **Security:** Adhere strictly to Row Level Security (RLS) policies.
- **Client:** Use the singleton client from `src/integrations/supabase/client.ts`.
- **Schema:** Keep the database schema documentation updated when making changes.

## Directory Structure
- `src/components`: UI and feature-specific components.
- `src/pages`: Route-level components (pages).
- `src/hooks`: Custom hooks for logic, auth, and utilities.
- `src/services`: API interaction logic, adapters, and helpers.
- `src/integrations`: Configuration for external services (Supabase, etc.).
- `src/types`: TypeScript definitions (database types, API interfaces).
- `netlify/functions`: Backend serverless functions.

## Coding Standards
- **Imports:** Use absolute imports with `@/` alias.
- **Exports:** Prefer named exports over default exports.
- **Formatting:** Prettier and ESLint should be respected.
- **Comments:** Comment complex logic, especially in Netlify Functions and auth flows.
