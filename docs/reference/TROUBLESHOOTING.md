# Troubleshooting Guide

Common problems and solutions for Quality Sync Mobile.

## Installation Issues

### Cannot Find Module 'expo'

**Problem:** Error when running `npm start`

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
npm install
```

### Metro Bundler Won't Start

**Problem:** Metro bundler fails to start or crashes

**Solutions:**
```bash
# Clear Metro cache
npm start -- --clear

# Kill existing Metro processes
# macOS/Linux:
killall -9 node

# Windows:
taskkill /F /IM node.exe

# Restart Metro
npm start
```

### Module Resolution Errors

**Problem:** Cannot resolve '@/...' imports

**Solutions:**
```bash
# Clear Metro cache
npm start -- --clear

# Verify babel.config.js has module-resolver
# Restart TypeScript server in VS Code
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

## iOS Issues

### Simulator Won't Start

**Problem:** iOS Simulator doesn't launch

**Solutions:**
```bash
# Open Simulator manually first
open -a Simulator

# Then run app
npm run ios

# Or specify simulator
npm run ios -- --simulator="iPhone 14"
```

### Build Fails on iOS

**Problem:** iOS build errors

**Solutions:**
```bash
# Install/update CocoaPods
cd ios
pod install
cd ..

# Clean build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Rebuild
npm run ios
```

### "No bundle URL present" Error

**Problem:** App shows "No bundle URL present"

**Solutions:**
```bash
# Ensure Metro is running
npm start

# Clear cache and restart
npm start -- --clear

# Check firewall settings
# Allow Metro bundler through firewall
```

## Android Issues

### Emulator Won't Start

**Problem:** Android Emulator doesn't launch

**Solutions:**
1. Open Android Studio
2. Tools → AVD Manager
3. Start emulator manually
4. Then run: `npm run android`

### Build Fails on Android

**Problem:** Android build errors

**Solutions:**
```bash
# Clean Gradle cache
cd android
./gradlew clean
cd ..

# Rebuild
npm run android

# If still failing, check:
# - ANDROID_HOME is set correctly
# - Java JDK is installed
# - Android SDK is up to date
```

### "Unable to load script" Error

**Problem:** App shows "Unable to load script"

**Solutions:**
```bash
# Ensure Metro is running
npm start

# Check device/emulator can reach Metro
# Try using IP address instead of localhost

# Reload app
# Press 'r' in Metro terminal
# Or shake device → Reload
```

## Authentication Issues

### Login Fails Silently

**Problem:** No error message when login fails

**Solutions:**
1. Check network connection
2. Verify Supabase URL and anon key in `.env`
3. Check console for errors
4. Verify user exists in Supabase dashboard
5. Check Supabase project status

### Session Not Persisting

**Problem:** User logged out after app restart

**Solutions:**
```typescript
// Verify supabase config
auth: {
  storage: AsyncStorage,
  persistSession: true,  // Must be true
  autoRefreshToken: true,
}

// Clear AsyncStorage and retry
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

### Token Refresh Fails

**Problem:** User logged out unexpectedly

**Solutions:**
1. Check network connectivity
2. Verify `autoRefreshToken: true` in config
3. Check Supabase project status
4. Review Supabase logs for errors

## MFA Issues

### QR Code Not Displaying

**Problem:** MFA QR code doesn't show

**Solutions:**
1. Check network connection
2. Verify Supabase MFA is enabled in dashboard
3. Check console for errors
4. Try manual entry instead
5. Verify user is authenticated

### Invalid Code Error

**Problem:** Correct MFA code shows as invalid

**Solutions:**
1. **Check device time** - Must be synchronized
   - iOS: Settings → General → Date & Time → Set Automatically
   - Android: Settings → System → Date & Time → Automatic
2. Ensure code hasn't expired (30-second window)
3. Verify code hasn't been used already
4. Check for typos in manual entry

### Enrollment Fails

**Problem:** Cannot complete MFA enrollment

**Solutions:**
1. Verify user is authenticated
2. Check Supabase MFA configuration
3. Ensure no existing factors conflict
4. Review Supabase logs
5. Try unenrolling and re-enrolling

## Data Loading Issues

### Data Not Loading

**Problem:** Profile or company data doesn't load

**Solutions:**
1. Check network connection
2. Verify user is authenticated
3. Check RLS policies in Supabase
4. Review console for errors
5. Test query in Supabase dashboard

### RLS Blocking Queries

**Problem:** Queries return empty despite data existing

**Solutions:**
1. Verify user is authenticated
2. Check RLS policies exist for table
3. Verify policy conditions match user
4. Test in Supabase SQL editor:
   ```sql
   SELECT * FROM employees WHERE user_id = 'user-id';
   ```
5. Check user_id matches auth.uid()

## Network Issues

### "Network request failed"

**Problem:** All API calls fail

**Solutions:**
1. Check internet connection
2. Verify Supabase URL is correct
3. Check firewall settings
4. Try different network (WiFi vs cellular)
5. Verify Supabase project is active

### Slow Performance

**Problem:** App is slow or laggy

**Solutions:**
1. Clear Metro cache: `npm start -- --clear`
2. Restart app
3. Check network speed
4. Optimize queries (select specific columns)
5. Enable React Query caching

## Environment Issues

### Environment Variables Not Loading

**Problem:** `process.env.EXPO_PUBLIC_*` is undefined

**Solutions:**
```bash
# Verify .env file exists
ls -la .env

# Check variable naming (must start with EXPO_PUBLIC_)
# Correct:
EXPO_PUBLIC_SUPABASE_URL=...

# Incorrect:
SUPABASE_URL=...

# Restart Metro with cache clear
npm start -- --clear
```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solutions:**
```bash
# Run TypeScript check
npx tsc --noEmit

# Common fixes:
# 1. Add missing types
# 2. Fix type mismatches
# 3. Update @types packages

# Restart TypeScript server in VS Code
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

## Build Issues

### EAS Build Fails

**Problem:** EAS build fails

**Solutions:**
1. Check `eas.json` configuration
2. Verify all dependencies are in `package.json`
3. Check build logs for specific errors
4. Ensure environment variables are set in EAS
5. Try local build first

### App Crashes on Launch

**Problem:** App crashes immediately after opening

**Solutions:**
1. Check console/logs for errors
2. Verify all native dependencies are linked
3. Clear app data and reinstall
4. Check for missing permissions
5. Review recent code changes

## Performance Issues

### App Freezes or Lags

**Problem:** UI is unresponsive

**Solutions:**
1. Check for infinite loops in useEffect
2. Optimize expensive computations with useMemo
3. Use React.memo for heavy components
4. Check for memory leaks
5. Profile with React DevTools

### Slow Startup

**Problem:** App takes long to load

**Solutions:**
1. Optimize initial data loading
2. Lazy load heavy components
3. Reduce bundle size
4. Check for blocking operations
5. Use splash screen effectively

## Debugging Tips

### Enable Debug Mode

```bash
# React Native DevTools
# Press 'j' in Metro terminal

# Or on device:
# iOS: Cmd+D in simulator
# Android: Cmd+M in emulator
# Physical: Shake device
```

### Check Logs

```bash
# iOS logs
npx react-native log-ios

# Android logs
npx react-native log-android

# Metro bundler logs
# Already visible in terminal
```

### Common Console Errors

**"Require cycle"**
- Circular dependency between modules
- Refactor to break the cycle

**"Can't find variable"**
- Missing import
- Typo in variable name

**"undefined is not an object"**
- Accessing property of undefined
- Add null checks

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Search console for error messages
3. Review recent code changes
4. Test on different device/simulator
5. Check Supabase dashboard for issues

### Where to Get Help

1. **Documentation** - Review relevant docs
2. **Dev Logs** - Check recent session logs
3. **Supabase Docs** - For backend issues
4. **Expo Docs** - For Expo-specific issues
5. **Team** - Contact development team

### Providing Information

When reporting an issue, include:
- Error message (full text)
- Steps to reproduce
- Device/simulator info
- OS version
- App version
- Recent changes
- Console logs
- Screenshots if applicable

## Prevention

### Best Practices

1. **Commit often** - Small, focused commits
2. **Test changes** - Before committing
3. **Clear cache** - When switching branches
4. **Update dependencies** - Regularly
5. **Document issues** - In dev logs

### Regular Maintenance

```bash
# Weekly:
npm update                    # Update dependencies
npm audit fix                 # Fix vulnerabilities
npm start -- --clear          # Clear cache

# Monthly:
npm outdated                  # Check for updates
npx expo-doctor               # Check Expo health
```

## Related Documentation

- [Installation Guide](../getting-started/INSTALLATION.md)
- [Development Workflow](../development/WORKFLOW.md)
- [FAQ](./FAQ.md)

---

**Last Updated:** 2026-01-20
