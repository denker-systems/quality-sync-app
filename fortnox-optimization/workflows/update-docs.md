---
description: Update project documentation to reflect codebase changes
auto_execution_mode: 3
---

# Update Docs

This workflow ensures that the web project documentation remains synchronized with the actual state of the codebase, and logs these updates systematically.

## Steps

1.  **Identify Changes**
    -   Have new features been implemented?
    -   Has the architecture changed (e.g., new Netlify Functions)?
    -   Have setup instructions changed?

2.  **Review Existing Docs**
    -   Use `read_file` to review existing docs.

3.  **Update Files**
    -   Use `edit` to make precise updates to markdown files.
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
