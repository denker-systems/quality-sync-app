# Generate Pull Request

Workflow for creating detailed pull requests with all commits since last push/PR.

## Steps

1. **Get Commit History**
   - Run `git log origin/main..HEAD --oneline` to see unpushed commits
   - Run `git log origin/main..HEAD --format="%h - %s%n%b"` for detailed info
   - Note all commit hashes, types, and descriptions

2. **Analyze Changes**
   - Group commits by type (feat, fix, docs, refactor, etc.)
   - Identify affected areas (auth, mfa, docs, backend, etc.)
   - Note breaking changes or important updates

3. **Generate PR Description**
   - **Title:** Use format `type(scope): summary of changes`
   - **Description Template:**

     ```markdown
     ## Summary

     [Brief overview of what this PR does]

     ## Changes

     ### Features

     - [List new features from feat commits]

     ### Bug Fixes

     - [List fixes from fix commits]

     ### Documentation

     - [List doc updates from docs commits]

     ### Other

     - [List refactoring, chores, etc.]

     ## Commits

     [List all commits with hashes]

     ## Testing

     - [ ] Tested on iOS
     - [ ] Tested on Android
     - [ ] No console errors
     - [ ] TypeScript check passes

     ## Related Issues

     Closes #[issue number]
     ```

4. **Review Before Creating**
   - Verify all commits are included
   - Check that description is clear
   - Ensure testing checklist is relevant

## Tools

- `run_command`: To execute git commands
- Generate formatted PR description

## Example

**Commits:**

```
a1b2c3d - feat(auth): implement MFA enrollment
e4f5g6h - docs: add MFA documentation
i7j8k9l - fix(mfa): resolve QR code display issue
```

**PR Title:**

```
feat(auth): add multi-factor authentication
```

**PR Description:**

```markdown
## Summary

Implements TOTP-based Multi-Factor Authentication using Supabase MFA API.

## Changes

### Features

- MFA enrollment with QR code (a1b2c3d)
- MFA challenge screen for verification
- MFA gate component to enforce 2FA

### Bug Fixes

- Fixed QR code display issue (i7j8k9l)

### Documentation

- Added comprehensive MFA documentation (e4f5g6h)
- Updated authentication guide

## Commits

- a1b2c3d - feat(auth): implement MFA enrollment
- e4f5g6h - docs: add MFA documentation
- i7j8k9l - fix(mfa): resolve QR code display issue

## Testing

- [x] Tested on iOS
- [x] Tested on Android
- [x] No console errors
- [x] TypeScript check passes

## Related Issues

Closes #42
```

---

**Tip:** Run this workflow before creating PR to ensure nothing is missed.
