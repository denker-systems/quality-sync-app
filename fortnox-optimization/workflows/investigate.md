---
description: Perform a deep dive investigation into a specific part of the web application
---

# Investigate Codebase (Web)

This workflow guides you through a targeted analysis of the web application codebase, covering Frontend (React), Backend (Netlify Functions), and Database (Supabase).

## Steps

1.  **Understand the Goal**
    -   **Ask:** What specific question needs answering? (e.g., "How does the sync logic work?", "Why is the login failing?")
    -   **Layer:** Is this a Frontend, Backend, or Database issue? Or a combination?
    -   **Scope:** Identify relevant directories (`src/`, `netlify/functions/`, `supabase/`).
    -   **Context:** Check if there are related issues or recent discussions.

2.  **Explore File Structure**
    -   Use `list_dir` to inspect relevant directories.
    -   **Frontend:** Look for pages in `src/pages` and components in `src/components`.
    -   **Backend:** Look for functions in `netlify/functions`.
    -   **Database:** Look for types in `src/types/database.types.ts` or migrations in `supabase/migrations`.

3.  **Analyze Key Files**
    -   Use `read_file` to examine content.
    -   **Frontend Analysis:**
        -   Identify React Query hooks (`useQuery`, `useMutation`).
        -   Trace data flow from components to hooks to services/API clients.
        -   Check state management (Context, local state).
    -   **Backend Analysis (Netlify Functions):**
        -   Identify the handler function and its entry point.
        -   Check for environment variable usage (`process.env`).
        -   Trace API calls to external services (Fortnox, Quinyx).
        -   Verify CORS headers and error handling mechanisms.
    -   **Database Analysis:**
        -   Identify Supabase client usage (`supabase.from(...)`).
        -   Check Row Level Security (RLS) policies if access issues are suspected.

4.  **Deep Search & Usage Analysis**
    -   **Pattern Matching:** Use `grep_search` to find specific usage patterns.
    -   **Example:** `grep_search(Query="fortnox_tokens", SearchPath="netlify/functions")` to see where tokens are accessed.
    -   **Cross-References:** Find where backend functions are called from the frontend.

5.  **Check Configuration & Environment**
    -   Review `netlify.toml` for build and redirect settings.
    -   Check `vite.config.ts` for build optimizations or proxies.
    -   Verify environment variable requirements in `.env` (or `.env.example`).

6.  **Synthesize & Report**
    -   **Summary:** Briefly explain what the code does.
    -   **Architecture:** Describe the component hierarchy or function logic flow.
    -   **Data Flow:** Step-by-step path of data (User -> Component -> Hook -> Function -> External API -> Database).
    -   **Dependencies:** Key libraries involved.
    -   **Observations:** Potential bottlenecks, security risks, or bugs.
    -   **Next Steps:** Recommend actions (refactor, fix, test).

## Tools
-   `list_dir`
-   `read_file`
-   `grep_search`
-   `find_by_name`

## Tips
-   For API issues, always check `netlify/functions` code and `src/services` clients.
-   For Database issues, check `src/integrations/supabase/types.ts` for schema definitions.
-   Use `mcp0_resolve-library-id` via Context7 if you encounter unfamiliar libraries.
