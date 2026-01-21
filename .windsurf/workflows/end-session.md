---
description: End the session and document progress for the mobile app
auto_execution_mode: 3
---

# End Session (Mobile)

Run this workflow before finishing your work to ensure everything is documented, the codebase is clean, and the next steps are clear.

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
    -   Update `ROADMAP.md` by marking completed tasks with `[x]`.
    -   If new features were added, ensure they are listed in the roadmap or `README.md`.
    -   Document any significant architectural decisions in a new Memory or a design doc.

3.  **Update Daily Report**
    -   Check for `docs/devlogs/YYYY/MM/DD/daily-report.md`. Create if it doesn't exist.
    -   Append a brief summary of this session to the daily report.

4.  **Verify Code Quality**
    -   Run TypeScript check: `npx tsc --noEmit`.
    -   Run Linter (if configured): `npm run lint`.
    -   **Critical:** Scan for and remove any temporary `console.log` statements or commented-out code blocks used for debugging.

5.  **Summarize Work**
    -   Write a concise summary of what was achieved in this session in the end log.
    -   Explicitly list the immediate next steps for the next session to reduce context switching time.

## Tools
-   `edit`: To update `ROADMAP.md` and append to `daily-report.md`.
-   `write_to_file`: To create the session end log.
-   `run_command`: To run `tsc` or `lint`.
-   `create_memory`: To save important context.
