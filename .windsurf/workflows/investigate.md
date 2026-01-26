---
description: Perform a deep dive investigation into a specific part of the codebase
auto_execution_mode: 3
---

# Investigate Codebase

This workflow guides you through a targeted yet comprehensive analysis of the codebase to understand a feature, component, or bug context effectively.

## Steps

1.  **Understand the Goal**
    - **Ask:** What specifically are we investigating? (Bug, Feature, Architecture?)
    - **Scope:** Identify potential directories/files.
    - **Context:** Check if there are related issues or recent discussions.

2.  **Explore File Structure**
    - Use `list_dir` on relevant paths (e.g., `src/screens`, `src/hooks`).
    - Identify entry points (e.g., `App.tsx`, `navigation/AppNavigator.tsx`).

3.  **Analyze Key Files**
    - Use `read_file` to inspect critical files.
    - **State Management:** Identify usage of React Query (`useQuery`), Context, or local state.
    - **Data Flow:** Trace data from source (Supabase/API) to UI.
    - **Dependencies:** Note imports (hooks, components, utils).
    - **Exports:** What is exposed to other parts of the app?

4.  **Deep Search & Usage Analysis**
    - **Pattern Matching:** Use `grep_search` for specific patterns (e.g., error codes, variable names).
    - **References:** Find where components/functions are used with `grep_search`.
    - **Related Files:** Use `find_by_name` to locate tests (`*.test.tsx`) or styles.

5.  **Check Configuration & Environment**
    - Review `app.config.js` or `package.json` if relevant to the issue.
    - Check for environment variable usage patterns (`process.env`).

6.  **Synthesize & Report**
    - **Summary:** Briefly explain what the code does.
    - **Architecture:** Describe the component hierarchy or logic flow.
    - **Observations:** Highlight bugs, performance bottlenecks, or tech debt.
    - **Next Steps:** Recommend actions (refactor, fix, test).

## Tools

- `list_dir`: View directory contents.
- `read_file`: Read file contents.
- `grep_search`: Search for string patterns.
- `find_by_name`: Find files by name/pattern.

## Tips

- **Traceability:** Always follow the data. Where does it come from? Where does it go?
- **Config:** Don't ignore `babel.config.js` or `tsconfig.json` if dealing with build/alias issues.
- **Navigation:** `src/navigation` is the backbone of the app structure.
