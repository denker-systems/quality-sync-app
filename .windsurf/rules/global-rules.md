---
trigger: manual
---

# Global Workspace Rules - Quality Sync Mobile

## ⛔ GIT & GITHUB - STRICT RULES

### ALLOWED:

- ✅ `git status` - Show status (auto-OK)
- ✅ `git log` - Show history (auto-OK)
- ✅ `git diff` - Show changes (auto-OK)

### REQUIRES USER APPROVAL:

- ⚠️ `git commit` - Only when explicitly asked or as part of a workflow
- ⚠️ `git push` - Only when explicitly asked or as part of a workflow

### ABSOLUTELY FORBIDDEN (NEVER RUN):

- ❌ **git merge** - NEVER
- ❌ **git rebase** - NEVER
- ❌ **git reset** - NEVER
- ❌ **git branch** - NEVER
- ❌ **GitHub API changes** - NEVER

### Summary:

**Cascade MUST NOT run commit and push automatically.**
Commit and push occur only:

1. When the user explicitly requests it
2. As part of /end-session, /daily-report, or another workflow
3. NEVER in the middle of work before changes are verified

## CORE PRINCIPLES

### 1. Methodical Approach

- ALWAYS INVESTIGATE before acting
- Read relevant memories and rules FIRST
- Use Sequential Thinking for complex decisions
- Document every step and decision

### 2. Caution

- NEVER make destructive changes without confirmation
- ASK when uncertain instead of guessing
- Test in small steps, verify after every change
- Always maintain backup capability (git)

### 3. Responsible MCP Usage

- Use MCP tools PROACTIVELY when they fit
- Verify results before proceeding
- Log all MCP calls for traceability

---

## MCP TOOLS - WHEN AND HOW

### Context7 (PRIMARY for documentation)

USE WHEN:

- You need to understand a library (Expo, React Native, React Navigation)
- You are implementing new functionality
- You seek best practices

COMMANDS:

- `mcp0_resolve-library-id(libraryName)`
- `mcp0_get-library-docs(context7CompatibleLibraryID, topic, mode)`

### Supabase MCP

USE WHEN:

- Working with the shared database
- Checking tables/schema
- Creating migrations
- Checking logs

COMMANDS:

- `mcp4_list_tables(schemas: ["public"])`
- `mcp4_execute_sql(query)` - for SELECT
- `mcp4_apply_migration(name, query)` - for DDL
- `mcp4_get_advisors(type: "security")`
- `mcp4_get_logs(service)`

### Sequential Thinking

USE WHEN:

- The problem is complex
- You need to structure thoughts
- You are planning a feature
- You are debugging difficult bugs

COMMAND:

- `mcp3_sequentialthinking(thought, thoughtNumber, totalThoughts, nextThoughtNeeded)`

### Web Search

USE WHEN:

- Checking specific error messages
- Looking up very recent Expo/React Native changes not in Context7
- Finding community solutions (StackOverflow, GitHub Issues)

COMMAND:

- `search_web(query)`

---

## WORKFLOW TRIGGERS

### Automatic Workflow Activation

- `/init-session` - At session start
- `/end-session` - At session end
- `/daily-report` - At end of day
- `/git-commit` - After changes
- `/investigate` - When deep analysis is needed
- `/update-docs` - When documentation needs updating

---

## DECISION PROCESS

### Before every change:

1. **INVESTIGATE**
   - Read relevant memories
   - Check existing code
   - Understand context

2. **PLAN**
   - Use Sequential Thinking if needed
   - List all affected files
   - Identify risks (especially breaking changes in New Architecture)

3. **CONFIRM**
   - Ask user when uncertain
   - Double confirmation for auth/security changes
   - Show plan before implementation

4. **IMPLEMENT**
   - Small steps
   - Verify after each step
   - Document changes

5. **VERIFY**
   - Test functionality (compile check)
   - Verify linting
   - Check for regressions

---

## PROTECTED AREAS

### Auth Files (DOUBLE CONFIRMATION)

- `src/hooks/useAuth.ts`
- `src/features/auth/*`
- `src/features/mfa/*`
- `src/navigation/AppNavigator.tsx` (AuthGuard logic)

### Database (MIGRATION REQUIRED)

- All schema changes must go through the shared `fortnox-quinyx-sync` workflow or explicit SQL execution via MCP.
- Remember: Database is shared with the Web App.

### Secrets (NEVER EXPOSE)

- All keys in `.env`
- Use `process.env.EXPO_PUBLIC_*` for public keys
- NEVER use hardcoded values for secrets

---

## CODE STYLE

### TypeScript

- Strict mode
- Interfaces over types for objects
- Named exports (NOT default)
- Validate with Zod

### React Native

- Functional components
- Custom hooks for logic
- `StyleSheet.create` for styles
- `react-native-paper` for UI
- Handle platform differences (`Platform.OS`)

### Commits

- Conventional Commits format
- `feat/fix/refactor/docs/style/test/chore`
- Scope in parentheses

---

## ERROR HANDLING

### On Error:

1. Read the error message carefully (check Metro/Expo logs)
2. Search documentation with Context7
3. Use Sequential Thinking for analysis
4. Implement fix in small steps
5. Verify that the error is resolved

### On Uncertainty:

1. ASK the user
2. Show alternatives
3. Recommend the safest path
4. Document the decision

---

## ACTIVATION MODES FOR RULES

### Always On

- `global-rules.md`
- `project-tech-stack-rules.md`

### Glob Pattern

- `react-native-expo-rules.md` - `*.tsx`, `*.ts`, `app.config.js`
- `styling-ui-rules.md` - `src/components/**/*.tsx`, `src/screens/**/*.tsx`

---

## CHECKLIST BEFORE EVERY CHANGE

1. [ ] Read relevant memories?
2. [ ] Checked project rules?
3. [ ] Identified affected files?
4. [ ] Planned with Sequential Thinking?
5. [ ] Confirmed with user?
6. [ ] Implemented in small steps?
7. [ ] Verified with tools?
8. [ ] Documented the change?
9. [ ] Committed with correct format?
