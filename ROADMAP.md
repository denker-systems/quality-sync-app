# Quality Sync Mobile - Implementation Roadmap

## Projektöversikt
React Native-app för Quality Sync som delar samma Supabase-databas som webb-appen. Fokus på auth och profil-funktionalitet.

## Mål
- [x] Användare kan logga in med samma credentials som webb-appen
- [ ] Användare kan se sin profil med samma data som webb-appen
- [x] Fungerar på både iOS och Android (testat på fysisk iPhone)
- [x] Säker auth med PKCE flow
- [x] Session persistence mellan app-starter

---

## Fas 1: Projekt Setup 
### 1.1 Initiera Projekt
- [x] Skapa Expo TypeScript-projekt
- [x] Konfigurera Git
- [x] Skapa `.gitignore`
- [x] Skapa `.env` och `.env.example`

### 1.2 Dependencies Installation
- [x] Installera React Navigation
- [x] Installera Supabase client
- [x] Installera React Query
- [x] Installera React Hook Form + Zod
- [x] Installera React Native Paper (UI)
- [x] Installera AsyncStorage
- [x] Installera `dotenv` för environment variables
- [x] Installera `react-native-webview` för MFA

### 1.3 Projektstruktur
- [x] Skapa `src/` mapp
- [x] Skapa `src/config/`
- [x] Skapa `src/types/`
- [x] Skapa `src/hooks/`
- [x] Skapa `src/screens/`
- [x] Skapa `src/components/`
- [x] Skapa `src/navigation/`
- [x] Skapa `src/utils/`
- [x] Skapa `src/features/mfa/`

### 1.4 TypeScript Configuration
- [x] Konfigurera `tsconfig.json`
- [x] Sätt upp path aliases (@/)
- [x] Kopiera database types från webb-appen (eller placeholder för nu)

---

## Fas 2: Supabase Integration 

### 2.1 Supabase Client Setup
- [x] Skapa `src/config/supabase.ts`
- [x] Konfigurera med AsyncStorage
- [x] Konfigurera PKCE flow
- [x] Sätt upp environment variables (via app.config.js)
- [x] Testa connection

### 2.2 Auth Hook
- [x] Skapa `src/hooks/useAuth.ts`
- [x] Implementera `signIn()`
- [x] Implementera `signOut()`
- [x] Implementera session listener
- [x] Implementera auto-refresh
- [x] Testa auth state management

### 2.3 Data Hooks
- [x] Skapa `src/hooks/useMyEmployee.ts`
- [x] Skapa `src/hooks/useCompanyData.ts`
- [ ] Implementera React Query integration (delvis klar)
- [ ] Testa data fetching

### 2.4 Type Definitions
- [x] Kopiera `database.types.ts` från webb-appen
- [x] Skapa `src/types/index.ts` med UserProfile, Company, etc.
- [x] Skapa navigation types

---

## Fas 11: Multi-Factor Authentication (MFA) 

### 11.1 MFA Core
- [x] Skapa `src/features/mfa/services/mfa.service.ts`
- [x] Implementera enrollment (TOTP)
- [x] Implementera verification (Challenge/Verify)
- [x] Implementera assurance level check

### 11.2 MFA Hooks
- [x] Skapa `src/features/mfa/hooks/useMFA.ts`
- [x] Skapa `src/features/mfa/hooks/useMFAStatus.ts`

### 11.3 MFA UI Components
- [x] Skapa `MFAChallengeScreen.tsx`
- [x] Skapa `MFAEnrollment.tsx`
- [x] Skapa `MFAGate.tsx`

### 11.4 MFA Integration
- [x] Integrera `MFAGate` i `App.tsx`
- [x] Verifiera att 2FA krävs för användare med aktiverat skydd

---

## Fas 3: Navigation Setup 

### 3.1 Navigation Structure
- [x] Skapa `src/navigation/AppNavigator.tsx`
- [ ] Skapa `src/navigation/AuthNavigator.tsx`
- [ ] Skapa `src/navigation/MainNavigator.tsx`
- [x] Konfigurera navigation types

### 3.2 Auth Guard Logic
- [x] Implementera conditional navigation baserat på auth state
- [x] Lägg till loading screen
- [x] Testa navigation flow

---

## Fas 5: Login Screen 

### 5.1 Login UI
- [x] Skapa `src/screens/auth/LoginScreen.tsx`
- [ ] Skapa `src/components/auth/LoginForm.tsx` (inbäddad i LoginScreen för nu)
- [x] Implementera layout med KeyboardAvoidingView
- [x] Lägg till Quality Sync logo/branding

### 5.2 Login Form Logic
- [x] Implementera React Hook Form
- [x] Lägg till Zod validation
- [x] Implementera email input
- [x] Implementera password input
- [x] Lägg till submit button med loading state

### 5.3 Login Error Handling
- [x] Visa error messages från Supabase
- [x] Implementera toast/snackbar för feedback
- [ ] Hantera network errors
- [ ] Lägg till retry logic

### 5.4 Login Testing
- [x] Testa med giltiga credentials
- [x] Testa med ogiltiga credentials
- [ ] Testa network error scenarios
- [x] Testa keyboard behavior
- [ ] Testa på iOS simulator
- [ ] Testa på Android emulator

---

## Fas 6: Profile Screen 

### 6.1 Profile UI Structure
- [x] Skapa `src/screens/profile/ProfileScreen.tsx`
- [ ] Skapa header med avatar
- [ ] Skapa info-kort layout
- [x] Lägg till ScrollView

### 6.2 Profile Components
- [ ] Skapa `src/components/profile/ProfileHeader.tsx`
- [ ] Skapa `src/components/profile/ProfileInfo.tsx`
- [ ] Skapa `src/components/profile/ProfileActions.tsx`

### 6.3 Profile Data Display
- [ ] Visa användarnamn (first_name + last_name)
- [ ] Visa företagsnamn
- [ ] Visa email
- [ ] Visa telefon
- [ ] Visa roll
- [ ] Visa personnummer (om tillgängligt)

### 6.4 Profile Actions
- [x] Implementera logout-knapp
- [ ] Lägg till confirmation dialog för logout
- [ ] Implementera edit profile (optional för v1)
- [ ] Implementera avatar upload (optional för v1)

### 6.5 Profile Loading States
- [ ] Visa loading spinner när data hämtas
- [ ] Visa skeleton screens (optional)
- [ ] Hantera error states
- [ ] Implementera pull-to-refresh

### 6.6 Profile Testing
- [ ] Testa data visning
- [x] Testa logout-flöde
- [ ] Testa med olika user types
- [ ] Testa på iOS simulator
- [ ] Testa på Android emulator

---

## Fas 8: Error Handling & UX 

### 8.1 Global Error Handling
- [ ] Skapa global error handler
- [ ] Implementera network error detection
- [ ] Lägg till offline mode indicator

### 8.2 User Feedback
- [x] Implementera toast/snackbar system (LoginScreen)
- [ ] Lägg till success messages
- [x] Lägg till error messages
- [x] Lägg till loading indicators

### 8.3 Accessibility
- [ ] Lägg till accessibility labels
- [ ] Testa med screen reader
- [ ] Säkerställ touch targets är minst 44pt

---

## Fas 9: Testing & QA 

### 9.1 Functional Testing
- [x] Testa komplett auth-flöde (login → profile → logout)
- [x] Testa session persistence
- [ ] Testa med olika användare
- [ ] Testa med olika företag
- [x] Testa error scenarios (vid login)

### 9.2 Platform Testing
- [ ] Testa på iOS simulator (olika versioner)
- [ ] Testa på Android emulator (olika versioner)
- [x] Testa på fysisk iPhone (om tillgänglig)

---

## Fas 10: Documentation & Deployment 

### 10.1 Documentation
- [x] Skapa README.md
- [x] Dokumentera setup-process
- [x] Dokumentera environment variables
- [ ] Skapa development guide
- [ ] Dokumentera known issues

### 10.2 Build Configuration
- [x] Konfigurera app.json/app.config.js
- [x] Sätt app name och bundle identifier
- [ ] Konfigurera app icons
- [ ] Konfigurera splash screen

### 10.3 Deployment Prep
- [ ] Skapa development build
- [ ] Testa development build
- [ ] Förbered för TestFlight (iOS)
- [ ] Förbered för Google Play Internal Testing (Android)

---

## Definition of Done

En feature är klar när:
- Koden är skriven och testad
- Fungerar på både iOS och Android
- Error handling är implementerat
- Loading states är implementerade
- UX är smooth och responsiv
- Ingen console warnings/errors
- Dokumentation är uppdaterad

---

## Progress Tracking

**Total Progress: ~55/115+ tasks**

- Fas 1: 14/14 
- Fas 2: 12/14 
- Fas 11: 10/10 
- Fas 3: 4/6 
- Fas 4: 2/5 
- Fas 5: 12/16 
- Fas 6: 2/22 
- Fas 7: 3/5 
- Fas 8: 3/11 
- Fas 9: 4/11 
- Fas 10: 5/10 

---

## Quick Start Commands

# Initiera projekt
npx create-expo-app quality-sync-app --template blank-typescript

# Installera dependencies
cd quality-sync-app
npm install

# Starta development server
npm start -- --clear

# Kör på iOS
npm run ios

# Kör på Android
npm run android

---

## Notes

- Använd samma Supabase project som webb-appen
- Dela samma database types
- Följ samma naming conventions
- Matcha UI-design med webb-appen där möjligt
- Prioritera iOS först, sedan Android
- Håll koden enkel och maintainable
- **MFA Implementation:** TOTP (Google Authenticator) via Supabase MFA API.
- **Environment:** `app.config.js` laddar `.env` via `dotenv` för att stödja både webb och native.

---

**Skapad:** 2026-01-20  
**Senast uppdaterad:** 2026-01-20 20:47  
**Status:** In Progress (Auth & MFA Ready, Initial Commit Done)
