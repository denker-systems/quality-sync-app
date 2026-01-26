---
trigger: always_on
---

# Documentation & Logging Structure Rules

## Purpose

To maintain a systematic, date-based log of all development activities, sessions, and documentation updates. This ensures complete traceability and simplifies progress tracking.

## Directory Structure

All logs are stored under `docs/devlogs/`.

### Hierarchy Pattern

```
docs/devlogs/
  └── YYYY/
      └── MM/
          └── DD/
              ├── daily-report.md
              ├── session-{HH-mm}-init.md
              ├── session-{HH-mm}-end.md
              └── updates-{HH-mm}.md
```

### File Definitions

#### 1. Daily Report

- **Path:** `docs/devlogs/{YYYY}/{MM}/{DD}/daily-report.md`
- **Purpose:** Aggregated summary of the day's work.
- **Content:**
  - Date
  - Summary of all sessions
  - Completed Tasks
  - Next Steps for tomorrow

#### 2. Session Logs

- **Init:** `docs/devlogs/{YYYY}/{MM}/{DD}/session-{HH-mm}-init.md`
  - Captures goals, context, and starting state.
- **End:** `docs/devlogs/{YYYY}/{MM}/{DD}/session-{HH-mm}-end.md`
  - Captures achievements, committed code, and immediate next steps.

#### 3. Update Logs

- **Updates:** `docs/devlogs/{YYYY}/{MM}/{DD}/updates-{HH-mm}.md`
  - Logs specific documentation updates or significant architectural changes made outside of normal session flows.

## Implementation Guidelines

### For Workflows

- **init-session:** MUST calculate current date/time and create the `session-init.md` file.
- **end-session:** MUST create `session-end.md` AND append a summary to `daily-report.md`.
- **daily-report:** Used to generate/finalize the `daily-report.md` if it wasn't incrementally updated.

### Timestamp Format

- Date: `YYYY-MM-DD` (ISO 8601)
- Time: `HH-mm` (24-hour format) for filenames to ensure sorting.

## Example

If working on January 20, 2026 at 14:30:
Path: `docs/devlogs/2026/01/20/session-14-30-init.md`
