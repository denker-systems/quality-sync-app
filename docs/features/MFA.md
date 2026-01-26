# Multi-Factor Authentication (MFA)

Complete guide to MFA implementation using TOTP (Time-based One-Time Password).

## Overview

Quality Sync Mobile implements MFA using Supabase's built-in MFA functionality with TOTP (Google Authenticator compatible).

## MFA Flow

```
User Authenticated
       │
       ▼
Check Assurance Level
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
   aal2 (MFA)   aal1 (No MFA)  No factors
       │             │             │
       │             ▼             ▼
       │      ┌──────────────────────┐
       │      │  MFA Enrollment      │
       │      │  1. Generate QR      │
       │      │  2. Scan with app    │
       │      │  3. Verify code      │
       │      └──────────┬───────────┘
       │                 │
       │                 ▼
       │         ┌──────────────┐
       │         │ MFA Challenge│
       │         │ Enter 6-digit│
       │         │ code         │
       │         └──────┬───────┘
       │                │
       └────────────────┘
                │
                ▼
        Access Granted
```

## Components

### MFAGate

Wrapper component that enforces MFA requirements.

**Location:** `src/features/mfa/components/MFAGate.tsx`

```typescript
export function MFAGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { needsEnrollment, needsChallenge, loading } = useMFAStatus();

  if (loading) return <LoadingScreen />;
  if (!user) return <>{children}</>;
  if (needsEnrollment) return <MFAEnrollment />;
  if (needsChallenge) return <MFAChallengeScreen />;

  return <>{children}</>;
}
```

**Usage in App.tsx:**

```typescript
<MFAGate>
  <AppNavigator />
</MFAGate>
```

### MFAEnrollment

Screen for enrolling in MFA with QR code.

**Location:** `src/features/mfa/components/MFAEnrollment.tsx`

**Features:**

- Generates TOTP secret
- Displays QR code for scanning
- Shows manual entry code
- Verifies enrollment with test code

```typescript
export function MFAEnrollment() {
  const { enrollMFA } = useMFA();
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');

  const handleEnroll = async () => {
    const { qr, secret } = await enrollMFA();
    setQrCode(qr);
    setSecret(secret);
  };

  return (
    <View>
      <Image source={{ uri: qrCode }} />
      <Text>Secret: {secret}</Text>
      {/* Verification input */}
    </View>
  );
}
```

### MFAChallengeScreen

Screen for entering MFA verification code.

**Location:** `src/features/mfa/components/MFAChallengeScreen.tsx`

**Features:**

- 6-digit code input
- Real-time validation
- Error handling
- Retry logic

```typescript
export function MFAChallengeScreen() {
  const { verifyMFA } = useMFA();
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      await verifyMFA(code);
      // Access granted
    } catch (error) {
      Alert.alert('Invalid code');
    }
  };

  return (
    <View>
      <TextInput
        value={code}
        onChangeText={setCode}
        maxLength={6}
        keyboardType="number-pad"
      />
      <Button onPress={handleVerify}>Verify</Button>
    </View>
  );
}
```

## Hooks

### useMFA

Main hook for MFA operations.

**Location:** `src/features/mfa/hooks/useMFA.ts`

```typescript
export function useMFA() {
  const enrollMFA = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });
    if (error) throw error;
    return {
      qr: data.totp.qr_code,
      secret: data.totp.secret,
      factorId: data.id,
    };
  };

  const verifyMFA = async (code: string, factorId: string) => {
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    });
    if (error) throw error;
    return data;
  };

  const unenrollMFA = async (factorId: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;
  };

  return { enrollMFA, verifyMFA, unenrollMFA };
}
```

### useMFAStatus

Hook for checking MFA status and requirements.

**Location:** `src/features/mfa/hooks/useMFAStatus.ts`

```typescript
export function useMFAStatus() {
  const { user } = useAuth();
  const [needsEnrollment, setNeedsEnrollment] = useState(false);
  const [needsChallenge, setNeedsChallenge] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMFAStatus();
  }, [user]);

  const checkMFAStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const {
      data: { aal },
    } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const { data: factors } = await supabase.auth.mfa.listFactors();

    const hasFactors = factors && factors.totp.length > 0;
    const isAAL2 = aal?.current_level === 'aal2';

    setNeedsEnrollment(!hasFactors);
    setNeedsChallenge(hasFactors && !isAAL2);
    setLoading(false);
  };

  return { needsEnrollment, needsChallenge, loading, refresh: checkMFAStatus };
}
```

## Service Layer

### MFA Service

Business logic for MFA operations.

**Location:** `src/features/mfa/services/mfa.service.ts`

```typescript
export const mfaService = {
  async enroll() {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Quality Sync Mobile',
    });
    if (error) throw error;
    return data;
  },

  async verify(factorId: string, code: string) {
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) throw challenge.error;

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code,
    });
    if (verify.error) throw verify.error;
    return verify.data;
  },

  async listFactors() {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw error;
    return data;
  },

  async unenroll(factorId: string) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;
  },

  async getAAL() {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) throw error;
    return data;
  },
};
```

## Assurance Levels

### AAL1 (Assurance Level 1)

- Basic authentication (email/password)
- No MFA required
- Lower security

### AAL2 (Assurance Level 2)

- MFA verified
- Higher security
- Required for sensitive operations

### Checking AAL

```typescript
const {
  data: { aal },
} = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

if (aal?.current_level === 'aal2') {
  // User has completed MFA
} else {
  // User needs to complete MFA
}
```

## TOTP Implementation

### What is TOTP?

Time-based One-Time Password:

- 6-digit code
- Changes every 30 seconds
- Based on shared secret
- Compatible with Google Authenticator, Authy, etc.

### QR Code Format

```
otpauth://totp/Quality%20Sync:user@example.com?secret=SECRET&issuer=Quality%20Sync
```

**Components:**

- **Protocol:** `otpauth://totp/`
- **Label:** `Quality Sync:user@example.com`
- **Secret:** Base32 encoded secret
- **Issuer:** `Quality Sync`

### Manual Entry

If QR scanning fails, users can manually enter:

- **Account:** user@example.com
- **Key:** SECRET (base32)
- **Type:** Time-based
- **Algorithm:** SHA1
- **Digits:** 6
- **Period:** 30 seconds

## Security Considerations

### Secret Storage

- Secrets never stored on client
- Generated server-side by Supabase
- Transmitted only during enrollment

### Code Validation

- 30-second time window
- Allows for clock drift
- One-time use per code
- Rate limiting on attempts

### Backup Codes

Currently not implemented. Future consideration:

- Generate backup codes during enrollment
- Store encrypted in database
- Allow one-time use

## User Experience

### Enrollment Flow

1. User logs in successfully
2. System detects no MFA factors
3. Show enrollment screen
4. Display QR code
5. User scans with authenticator app
6. User enters verification code
7. System verifies and completes enrollment
8. User proceeds to app

### Challenge Flow

1. User logs in successfully
2. System detects MFA factor exists
3. Check current AAL level
4. If not AAL2, show challenge screen
5. User enters 6-digit code
6. System verifies code
7. Session upgraded to AAL2
8. User proceeds to app

### Error Handling

```typescript
try {
  await verifyMFA(code, factorId);
} catch (error) {
  if (error.message.includes('Invalid code')) {
    Alert.alert('Invalid Code', 'Please check and try again');
  } else if (error.message.includes('Expired')) {
    Alert.alert('Code Expired', 'Please use a new code');
  } else {
    Alert.alert('Error', 'Something went wrong');
  }
}
```

## Testing MFA

### Setup Test Environment

1. Install Google Authenticator on test device
2. Run app in development mode
3. Create test user account
4. Trigger MFA enrollment

### Test Scenarios

- [ ] Enroll new factor
- [ ] Scan QR code successfully
- [ ] Enter manual secret
- [ ] Verify with correct code
- [ ] Verify with incorrect code
- [ ] Verify with expired code
- [ ] Unenroll factor
- [ ] Multiple factors (future)

### Manual Testing

```typescript
// Test enrollment
const { qr, secret } = await enrollMFA();
console.log('QR:', qr);
console.log('Secret:', secret);

// Test verification
const result = await verifyMFA('123456', factorId);
console.log('Verified:', result);

// Test AAL check
const { aal } = await getAAL();
console.log('Current AAL:', aal.current_level);
```

## Troubleshooting

### QR Code Not Displaying

**Problem:** QR code image not showing

**Solutions:**

1. Check network connection
2. Verify Supabase MFA is enabled
3. Check console for errors
4. Try manual entry instead

### Invalid Code Error

**Problem:** Correct code shows as invalid

**Solutions:**

1. Check device time synchronization
2. Verify 30-second window hasn't passed
3. Ensure code hasn't been used already
4. Check for typos in manual entry

### Enrollment Fails

**Problem:** Cannot complete enrollment

**Solutions:**

1. Verify user is authenticated
2. Check Supabase MFA configuration
3. Ensure no existing factors conflict
4. Review server logs

## Best Practices

1. **Clear instructions** - Guide users through enrollment
2. **Manual fallback** - Provide manual entry option
3. **Error messages** - Show helpful error messages
4. **Time sync** - Warn about device time issues
5. **Backup options** - Consider backup codes (future)
6. **Testing** - Test with multiple authenticator apps

## Related Documentation

- [Authentication](./AUTHENTICATION.md)
- [Supabase Setup](../backend/SUPABASE.md)
- [Security Best Practices](../reference/SECURITY.md)

---

**Last Updated:** 2026-01-20
