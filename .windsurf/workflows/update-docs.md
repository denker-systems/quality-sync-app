---
description: Update project documentation to reflect codebase changes
auto_execution_mode: 3
---

# Update Docs

This workflow ensures that the project documentation remains synchronized with the actual state of the codebase, and logs these updates systematically.

## Steps

1.  **Identify Changes**
    -   Have new features been implemented? -> Update `ROADMAP.md` and potentially `README.md`.
    -   Has the architecture or folder structure changed? -> Update architecture documentation.
    -   Have setup steps or dependencies changed? -> Update `SETUP.md` or `README.md`.
    -   Have API endpoints or database schemas changed? -> Update API docs or Schema docs.

2.  **Review Existing Docs**
    -   Use `read_file` to check the current content of the relevant markdown files.

3.  **Update Files**
    -   Use `edit` to make precise updates to the markdown files.
    -   Ensure clear language, correct formatting, and accurate information.

4.  **Log the Update**
    -   Determine current date (YYYY-MM-DD) and time (HH-mm).
    -   Create a log file: `docs/devlogs/YYYY/MM/DD/updates-HH-mm.md`.
    -   **Content Template:**
        ```markdown
        # Documentation Update: [Date] [Time]
        **Updated Files:**
        - [File Name]
        
        **Reason:**
        - [Reason for update]
        ```

## Tools
-   `read_file`: Read existing documentation.
-   `edit`: Modify documentation files.
-   `write_to_file`: Create the update log.
