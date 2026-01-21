# Contributing Guide

Guidelines for contributing to Quality Sync Mobile.

## Getting Started

### Prerequisites

1. Read the [Installation Guide](../getting-started/INSTALLATION.md)
2. Set up your development environment
3. Familiarize yourself with the [Project Structure](../getting-started/PROJECT_STRUCTURE.md)
4. Review the [Development Workflow](../development/WORKFLOW.md)

### First Time Setup

```bash
# Clone repository
git clone <repository-url>
cd quality-sync-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development
npm start
```

## Development Process

### 1. Pick an Issue

- Check existing issues
- Comment that you're working on it
- Ask questions if unclear

### 2. Create a Branch

```bash
# Feature branch
git checkout -b feature/feature-name

# Bug fix branch
git checkout -b fix/bug-description
```

### 3. Make Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add comments for complex logic
- Keep commits small and focused

### 4. Test Your Changes

- Test on iOS simulator
- Test on Android emulator
- Test on physical device if possible
- Verify no console errors
- Run TypeScript check: `npx tsc --noEmit`

### 5. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "type(scope): description"
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```bash
git commit -m "feat(auth): add password reset"
git commit -m "fix(profile): resolve avatar loading issue"
git commit -m "docs: update installation guide"
```

### 6. Push Changes

```bash
git push origin feature/feature-name
```

### 7. Create Pull Request

- Use descriptive title
- Explain what and why
- Link related issues
- Add screenshots if UI changes
- Request review

## Code Standards

### TypeScript

```typescript
// ✅ Good - Explicit types
interface User {
  id: string;
  email: string;
}

function getUser(id: string): User {
  // ...
}

// ❌ Bad - Using any
function getUser(id: any): any {
  // ...
}
```

### Components

```typescript
// ✅ Good - Functional component with types
interface Props {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

// ❌ Bad - No types
export function Button({ title, onPress }) {
  // ...
}
```

### Hooks

```typescript
// ✅ Good - Custom hook with types
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  // ...
}
```

### Naming Conventions

- **Components:** PascalCase (`LoginScreen`, `MFAGate`)
- **Hooks:** camelCase with `use` prefix (`useAuth`, `useMFA`)
- **Functions:** camelCase (`signIn`, `fetchData`)
- **Constants:** SCREAMING_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Files:** Match component/hook name

## File Organization

### Adding a Component

```
src/features/feature-name/
├── components/
│   └── ComponentName.tsx
├── hooks/
│   └── useFeature.ts
├── services/
│   └── feature.service.ts
├── types/
│   └── feature.types.ts
└── index.ts
```

### Exporting

```typescript
// src/features/feature-name/index.ts
export { ComponentName } from './components/ComponentName';
export { useFeature } from './hooks/useFeature';
export type { FeatureType } from './types/feature.types';
```

## Documentation

### Code Comments

```typescript
/**
 * Authenticates user with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to user session
 * @throws {AuthError} If credentials are invalid
 */
async function signIn(email: string, password: string): Promise<Session> {
  // Implementation
}
```

### Feature Documentation

When adding a feature:
1. Create `docs/features/FEATURE_NAME.md`
2. Explain purpose and usage
3. Include code examples
4. Document edge cases

### Update Existing Docs

- Keep documentation in sync with code
- Update relevant docs when making changes
- Fix typos and improve clarity

## Testing

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Loading states display correctly
- [ ] Error states handled properly
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Navigation functions correctly
- [ ] Data persists correctly

### TypeScript Check

```bash
npx tsc --noEmit
```

Fix all type errors before submitting PR.

## Pull Request Guidelines

### PR Title

Use Conventional Commits format:
```
feat(auth): add password reset functionality
fix(profile): resolve avatar loading issue
docs: update contributing guide
```

### PR Description

Include:
- **What:** What changes were made
- **Why:** Why these changes were needed
- **How:** How the changes work
- **Testing:** How you tested the changes
- **Screenshots:** For UI changes

**Template:**
```markdown
## What
Brief description of changes

## Why
Explanation of why these changes are needed

## How
Technical details of implementation

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] No console errors
- [ ] TypeScript check passes

## Screenshots
(if applicable)
```

### Review Process

1. **Self-review** - Review your own PR first
2. **Request review** - Tag appropriate reviewers
3. **Address feedback** - Respond to comments
4. **Update PR** - Make requested changes
5. **Merge** - Once approved, merge or wait for maintainer

## Best Practices

### Do's ✅

- Write clean, readable code
- Add TypeScript types
- Test your changes thoroughly
- Write meaningful commit messages
- Keep PRs focused and small
- Update documentation
- Ask questions when unsure

### Don'ts ❌

- Don't use `any` type
- Don't commit console.logs
- Don't commit commented code
- Don't commit `.env` file
- Don't make unrelated changes
- Don't skip testing
- Don't ignore TypeScript errors

## Getting Help

### Resources

- [Documentation](../README.md)
- [Troubleshooting](../reference/TROUBLESHOOTING.md)
- [FAQ](../reference/FAQ.md)
- Development team

### Questions

- Check existing documentation first
- Search closed issues
- Ask in team chat
- Create discussion issue

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

**Thank you for contributing to Quality Sync Mobile!**

**Last Updated:** 2026-01-20
