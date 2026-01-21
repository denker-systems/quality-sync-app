---
description: Create a daily report of work done
auto_execution_mode: 3
---

# Daily Report (Web)

This workflow helps you generate a structured daily report of your progress, challenges, and next steps for the web application, stored systematically.

## Steps

1.  **Review Session History**
    -   Determine current date (YYYY-MM-DD).
    -   Check `ROADMAP.md` for completed items.
    -   Check git history (`git log --since="midnight" --oneline`) to see what was committed today.
    -   Read any session logs in `docs/devlogs/YYYY/MM/DD/` to gather context.

2.  **Generate Report Content**
    -   **Date:** Today's date.
    -   **Summary:** High-level overview of the day.
    -   **Completed Tasks:** List of features, fixes, or docs completed.
    -   **Work In Progress:** What is currently being worked on?
    -   **Blockers/Issues:** Any technical hurdles encountered?
    -   **Next Steps:** Plan for tomorrow.

3.  **Save Report**
    -   Target file: `docs/devlogs/YYYY/MM/DD/daily-report.md`.
    -   If the file exists, append the new information (timestamped).
    -   If it doesn't exist, create it.

## Tools
-   `read_file`: Read roadmap, git logs, and existing session logs.
-   `run_command`: Get git history.
-   `write_to_file` / `edit`: Save the report.
