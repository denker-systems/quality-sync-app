---
description: End the session and document progress for the web application
---

# End Session (Web)

Run this workflow before finishing your work on the web application to ensure everything is documented and the codebase is clean.

## Steps

1.  **Initialize End Log**
    -   Determine current date (YYYY-MM-DD) and time (HH-mm).
    -   Create file `docs/devlogs/YYYY/MM/DD/session-HH-mm-end.md`.
    -   **Content Template:**
        ```markdown
        # Session End: [Date] [Time]
        **Achievements:**
        - [ ] Achievement 1
        - [ ] Achievement 2
        
        **Next Steps:**
        - [ ] Next Step 1
        ```

2.  **Update Documentation**
    -   Update project documentation to reflect any changes made during the session.
    -   Document any new Netlify Functions, API endpoints, or database schema changes.

3.  **Update Daily Report**
    -   Check for `docs/devlogs/YYYY/MM/DD/daily-report.md`. Create if it doesn't exist.
    -   Append a brief summary of this session to the daily report.

4.  **Verify Code Quality**
    -   Run Linter: `npm run lint` (if available).
    -   Run TypeScript check: `tsc --noEmit` (if available).
    -   **Critical:** Scan for and remove any temporary `console.log` statements or debug code.

5.  **Summarize Work**
    -   Write a concise summary of what was achieved in this session in the end log.
    -   List clear next steps for the next session.

## Tools
-   `edit`: To update documentation and append to daily report.
-   `write_to_file`: To create the session end log.
-   `run_command`: To run linting or type checking.
