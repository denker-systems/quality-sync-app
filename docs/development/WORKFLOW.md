# Development Workflow

Daily development practices and workflows for Quality Sync Mobile.

## Daily Workflow

### Starting a Session

1. **Pull latest changes**

   ```bash
   git pull origin main
   ```

2. **Install dependencies** (if package.json changed)

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**

   ```bash
   npm run ios     # iOS
   npm run android # Android
   ```

5. **Document session start** (optional)
   - Create session init log in `docs/devlogs/YYYY/MM/DD/`

### During Development

1. **Make changes** in small, focused commits
2. **Test changes** immediately
3. **Check for errors** in console
4. **Verify types** with TypeScript
5. **Document decisions** in code comments

### Ending a Session

1. **Run TypeScript check**

   ```bash
   npx tsc --noEmit
   ```

2. **Commit changes**

   ```bash
   git add .
   git commit -m "type(scope): description"
   ```

3. **Document session end**
   - Create session end log
   - Update daily report
   - Note next steps

## Git Workflow

### Branch Strategy

**Main branch:** `main`

- Production-ready code
- Protected branch
- Requires PR for changes

**Feature branches:** `feature/feature-name`

- New features
- Merged via PR

**Bugfix branches:** `fix/bug-description`

- Bug fixes
- Merged via PR

### Commit Messages

Follow Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(auth): implement MFA enrollment"
git commit -m "fix(profile): resolve data loading issue"
git commit -m "docs: update installation guide"
git commit -m "refactor(hooks): simplify useAuth logic"
```

### Creating a Feature

1. **Create branch**

   ```bash
   git checkout -b feature/feature-name
   ```

2. **Implement feature**
   - Write code
   - Add tests
   - Update docs

3. **Commit changes**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push branch**

   ```bash
   git push origin feature/feature-name
   ```

5. **Create Pull Request**
   - Describe changes
   - Link related issues
   - Request review

## Code Organization

### Adding a New Screen

1. **Create screen file**

   ```bash
   src/screens/category/ScreenName.tsx
   ```

2. **Implement screen**

   ```typescript
   export default function ScreenName() {
     return (
       <View>
         {/* Screen content */}
       </View>
     );
   }
   ```

3. **Add to navigation**

   ```typescript
   // src/navigation/AppNavigator.tsx
   <Stack.Screen name="ScreenName" component={ScreenName} />
   ```

4. **Add navigation types**
   ```typescript
   // src/types/index.ts
   export type RootStackParamList = {
     ScreenName: undefined;
     // ... other screens
   };
   ```

### Adding a New Feature

1. **Create feature directory**

   ```bash
   mkdir -p src/features/feature-name/{components,hooks,services,types}
   ```

2. **Create components**

   ```bash
   src/features/feature-name/components/Component.tsx
   ```

3. **Create hooks**

   ```bash
   src/features/feature-name/hooks/useFeature.ts
   ```

4. **Create services**

   ```bash
   src/features/feature-name/services/feature.service.ts
   ```

5. **Create types**

   ```bash
   src/features/feature-name/types/feature.types.ts
   ```

6. **Export public API**
   ```typescript
   // src/features/feature-name/index.ts
   export { Component } from './components/Component';
   export { useFeature } from './hooks/useFeature';
   export type { FeatureType } from './types/feature.types';
   ```

### Adding a New Hook

1. **Create hook file**

   ```bash
   src/hooks/useHookName.ts
   ```

2. **Implement hook**

   ```typescript
   export function useHookName() {
     const [state, setState] = useState();

     // Hook logic

     return { state, setState };
   }
   ```

3. **Add TypeScript types**

   ```typescript
   interface HookReturn {
     state: StateType;
     setState: (value: StateType) => void;
   }

   export function useHookName(): HookReturn {
     // ...
   }
   ```

## Testing

### Manual Testing

1. **Test on iOS Simulator**

   ```bash
   npm run ios
   ```

2. **Test on Android Emulator**

   ```bash
   npm run android
   ```

3. **Test on Physical Device**
   - Install Expo Go
   - Scan QR code
   - Test functionality

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Loading states work correctly
- [ ] Error states handled properly
- [ ] Navigation works correctly
- [ ] Data persists correctly
- [ ] Works on both iOS and Android

### TypeScript Validation

```bash
npx tsc --noEmit
```

Fix any type errors before committing.

## Debugging

### React Native DevTools

1. **Open DevTools**
   - Press `j` in terminal where Metro is running
   - Or shake device and select "Debug"

2. **Use Chrome DevTools**
   - Open `chrome://inspect`
   - Select your app
   - Use console, network, etc.

### Console Logging

```typescript
console.log('Debug:', variable);
console.error('Error:', error);
console.warn('Warning:', warning);
```

**Remember:** Remove console logs before committing!

### Common Issues

**Metro bundler cache:**

```bash
npm start -- --clear
```

**Module resolution:**

```bash
rm -rf node_modules
npm install
```

**iOS build issues:**

```bash
cd ios
pod install
cd ..
npm run ios
```

## Code Quality

### TypeScript

- **No `any` types** - Use specific types
- **Use interfaces** for object shapes
- **Export types** for reusability
- **Document complex types** with comments

### Code Style

- **Consistent formatting** - Use Prettier (future)
- **Meaningful names** - Clear variable/function names
- **Small functions** - Single responsibility
- **Comments** - Explain why, not what

### Best Practices

1. **Keep components small** - Split large components
2. **Use custom hooks** - Extract reusable logic
3. **Handle errors** - Always check for errors
4. **Loading states** - Show loading indicators
5. **Type safety** - Use TypeScript strictly

## Documentation

### Code Documentation

```typescript
/**
 * Custom hook for managing authentication state
 *
 * @returns {Object} Authentication state and methods
 * @property {User | null} user - Current user object
 * @property {boolean} loading - Loading state
 * @property {Function} signIn - Sign in method
 * @property {Function} signOut - Sign out method
 */
export function useAuth() {
  // ...
}
```

### Feature Documentation

When adding a feature:

1. Create doc in `docs/features/FEATURE_NAME.md`
2. Explain purpose and usage
3. Include code examples
4. Document edge cases

### Session Logs

Document development sessions:

- Session init: Goals and context
- Session end: Achievements and next steps
- Daily report: Summary of day's work

## Performance

### Optimization Tips

1. **Use React.memo** for expensive components
2. **Use useCallback** for function props
3. **Use useMemo** for expensive computations
4. **Lazy load** heavy components
5. **Optimize images** - Use proper sizes

### Monitoring

- Check Metro bundler output
- Monitor console for warnings
- Use React DevTools Profiler
- Test on lower-end devices

## Deployment Preparation

### Pre-deployment Checklist

- [ ] All features tested
- [ ] No console errors/warnings
- [ ] TypeScript check passes
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Build configuration verified

### Creating a Build

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform ios
```

## Windsurf Workflows

### Available Workflows

- `/init-session` - Start new work session
- `/end-session` - End session and document
- `/git-commit` - Create structured commit
- `/update-docs` - Update documentation
- `/daily-report` - Generate daily report

### Using Workflows

Simply mention the workflow in chat:

```
@[/init-session]
```

## Next Steps

- Review [Code Style Guide](./CODE_STYLE.md)
- Learn about [Testing](./TESTING.md)
- Understand [Debugging](./DEBUGGING.md)

---

**Last Updated:** 2026-01-20
