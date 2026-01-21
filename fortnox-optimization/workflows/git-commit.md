---
description: Create a structured git commit following Conventional Commits
---

# Git Commit

This workflow helps you create a clean, standardized Conventional Commit message to maintain a high-quality git history.

## Steps

1.  **Analyze Changes**
    -   Run `git status` to see which files are modified.
    -   Run `git diff --cached` (if staged) or `git diff` to inspect the actual code changes.
    -   Identify the primary type of change:
        -   `feat`: A new feature
        -   `fix`: A bug fix
        -   `docs`: Documentation only changes
        -   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
        -   `refactor`: A code change that neither fixes a bug nor adds a feature
        -   `perf`: A code change that improves performance
        -   `test`: Adding missing tests or correcting existing tests
        -   `chore`: Changes to the build process or auxiliary tools and libraries

2.  **Formulate Message**
    -   **Format:** `<type>(<scope>): <description>`
    -   **Scope:** The specific part of the codebase affected (e.g., `api`, `ui`, `navigation`, `api`).
    -   **Description:** A short, imperative summary (e.g., "add login screen", "fix crash on logout").
    -   **Example:** `feat(auth): implement mfa enrollment screen`

3.  **Create Commit**
    -   Propose the git command: `git commit -m "..."`
    -   Ask for user confirmation before running.

## Tools
-   `run_command`: To execute git commands.
