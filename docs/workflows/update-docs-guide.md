# Update Docs - Quick Reference

Quick guide for updating documentation to match the new comprehensive structure.

## Documentation Sections

### Getting Started (`docs/getting-started/`)
- `QUICK_START.md` - Quick start guide
- `INSTALLATION.md` - Installation steps
- `ENVIRONMENT.md` - Environment config
- `PROJECT_STRUCTURE.md` - Project organization

**Update when:** Installation, dependencies, env vars, or structure changes

### Architecture (`docs/architecture/`)
- `OVERVIEW.md` - Architecture overview
- `TECH_STACK.md` - Technologies used

**Update when:** Architecture, libraries, or design decisions change

### Features (`docs/features/`)
- `AUTHENTICATION.md` - Auth with PKCE
- `MFA.md` - Multi-Factor Authentication
- Create new files for new features

**Update when:** Features added, modified, or removed

### Backend (`docs/backend/`)
- `SUPABASE.md` - Supabase setup
- `DATABASE_SCHEMA.md` - Database structure

**Update when:** Database schema, RLS policies, or Supabase config changes

### Development (`docs/development/`)
- `WORKFLOW.md` - Development workflow

**Update when:** Development practices or tools change

### Reference (`docs/reference/`)
- `TROUBLESHOOTING.md` - Common problems
- `FAQ.md` - Frequently asked questions

**Update when:** New issues discovered or common questions arise

### Root Files
- `README.md` - Project overview
- `ROADMAP.md` - Implementation roadmap
- `SETUP.md` - Setup guide

**Update when:** Major features added or project status changes

## Quick Workflow

1. **Identify what changed** in your code
2. **Find matching docs** from sections above
3. **Update files** with `edit` tool
4. **Create update log** in `docs/devlogs/YYYY/MM/DD/updates-HH-mm.md`

## Update Log Template

```markdown
# Documentation Update: YYYY-MM-DD HH:mm

## Updated Files
- docs/section/file.md

## Reason
- [Why the update was needed]
```

---

**Tip:** Keep docs in sync with code changes. Update as you code, not later.
