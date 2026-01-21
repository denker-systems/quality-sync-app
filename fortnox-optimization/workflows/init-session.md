---
description: Start a new work session and load context for the web application
---

# Init Session (Web)

Run this workflow at the start of every development session for the web application to establish context, set clear goals, and initialize the session log.

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
    -   Read `ROADMAP.md` (if available) or check the latest documentation to understand the current progress.
    -   Check `package.json` to review dependencies, scripts, and versions.
    -   Review `netlify.toml` to understand the deployment configuration.

3.  **Verify Environment**
    -   Check if `.env` exists (do not read values unless necessary for debugging) to ensure environment variables are set.
    -   Verify connection to Supabase if applicable.

4.  **Analyze Recent History**
    -   Run `git log --oneline -5` to see the most recent changes and who made them.
    -   Check for any uncommitted changes with `git status`.

5.  **Define Session Goals**
    -   Based on the project status and git history, define 1-3 concrete goals for this session.
    -   Fill in the goals in the created `session-init.md` file.
    -   Use the `todo_list` tool to create a tracked plan.

## Tools
-   `run_command`: To check date/time and git history.
-   `write_to_file`: To create the log file.
-   `read_file`: Access documentation and config.
-   `todo_list`: Manage session tasks.
