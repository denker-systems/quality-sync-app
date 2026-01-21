---
description: Start a new work session and load context for the mobile app
auto_execution_mode: 3
---

# Init Session (Mobile)

Run this workflow at the start of every development session to establish context, set clear goals, and initialize the session log.

## Steps

1.  **Initialize Session Log**
    -   Determine the current date (YYYY-MM-DD) and time (HH-mm).
    -   Ensure the directory `docs/devlogs/YYYY/MM/DD` exists (create if missing).
    -   Create a new file `docs/devlogs/YYYY/MM/DD/session-HH-mm-init.md`.
    -   **Content Template:**
        ```markdown
        # Session Init: [Date] [Time]
        **Goals:**
        - [ ] Goal 1
        - [ ] Goal 2
        
        **Context:**
        - Starting from commit: [Git Hash]
        - Focus area: [Feature/Bug]
        ```

2.  **Review Project Status**
    -   Read `ROADMAP.md` to understand the current progress and identifying the next immediate tasks.
    -   Check `package.json` for script names or dependency updates.
    -   Inspect `app.config.js` or `app.json` to verify Expo configuration.

3.  **Verify Environment**
    -   Ensure `.env` exists and contains necessary keys (e.g., `EXPO_PUBLIC_SUPABASE_URL`).
    -   Check if the Supabase project is active/reachable (if relevant).

4.  **Analyze Recent History**
    -   Run `git log --oneline -5` to see the most recent changes.
    -   Check for any uncommitted changes with `git status`.

5.  **Define Session Goals**
    -   Based on the Roadmap and git history, define 1-3 concrete goals for this session.
    -   Fill in the goals in the created `session-init.md` file.
    -   Use the `todo_list` tool to create a tracked plan in the IDE.

## Tools
-   `run_command`: To check date/time and git history.
-   `write_to_file`: To create the log file.
-   `read_file`: Access documentation and config.
-   `todo_list`: Manage session tasks.
