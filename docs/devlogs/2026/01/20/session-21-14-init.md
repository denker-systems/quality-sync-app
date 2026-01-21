# Session Init: 2026-01-20 21:14

## Mål
Implementera onboarding och avtalsignering i Quality Sync Mobile App baserat på webb-appens funktionalitet.

## Kontext från Webb-appen

### Onboarding System
**Databas-tabeller:**
- `employee_onboarding` - Status: pending, invited, in_progress, completed
- `onboarding_steps` - Företagsspecifika steg (welcome, personal_info, emergency_contact, bank_details, contract_signing, handbook, custom)
- `employee_onboarding_progress` - Progress tracking per steg

**Komponenter (webb):**
- `EmployeeOnboardingTab.tsx` - Huvudvy för employee
- `OnboardingWizardView.tsx` - Wizard-interface
- `HROnboardingService` - Business logic

### Contract System
**Databas-tabeller:**
- `employee_contracts` - Avtalmallar (employment, nda, custom)
- `signed_contracts` - Signerade avtal med PDF

**Komponenter (webb):**
- `ContractsSection.tsx` - Lista över signerade avtal
- `ContractViewerDialog.tsx` - Visa avtal
- `ContractSigningStep.tsx` - Signering i onboarding

### Employee Profile (Webb)
4 Tabs:
1. **Profil** - Grundinfo + AI Token Usage
2. **Onboarding** - Wizard med steg-för-steg process
3. **Avtal** - Signerade avtal med PDF-visning
4. **Säkerhet** - MFA settings

## Implementation Plan för Mobil

### Fas 1: Foundation (Pågående)
- [x] Analysera webb-appens struktur
- [ ] Skapa theme.ts med Material Design 3
- [ ] Skapa SafeAreaWrapper komponent
- [ ] Uppdatera ProfileScreen struktur

### Fas 2: Onboarding
- [ ] Skapa OnboardingScreen med wizard
- [ ] Implementera OnboardingStepCard komponenter
- [ ] Skapa useOnboarding hook
- [ ] Implementera progress tracking
- [ ] Hantera olika steg-typer (welcome, personal_info, etc.)

### Fas 3: Contracts
- [ ] Skapa ContractsScreen
- [ ] Implementera ContractCard komponenter
- [ ] Skapa useContracts hook
- [ ] Implementera PDF-visning (react-native-pdf eller WebView)
- [ ] Implementera contract signing i onboarding

### Fas 4: Integration
- [ ] Koppla onboarding till ProfileScreen
- [ ] Koppla contracts till ProfileScreen
- [ ] Implementera navigation mellan screens
- [ ] Testa hela flödet

## Tekniska Beslut

### React Native Paper Components
- **Card** - För avtal och onboarding-steg
- **ProgressBar** - För onboarding progress
- **Button** - contained/outlined/text modes
- **Surface** - För elevated content
- **Badge** - För status indicators

### Navigation
- Stack Navigator för onboarding wizard
- Tab Navigator för profile sections

### State Management
- React Query för API calls
- Local state för wizard steps
- AsyncStorage för progress caching

## Nästa Steg
1. Skapa theme.ts
2. Skapa SafeAreaWrapper
3. Uppdatera ProfileScreen med tabs
4. Implementera OnboardingScreen
5. Implementera ContractsScreen

## Anteckningar
- Använd samma Supabase-tabeller som webb-appen
- Följ Material Design 3 guidelines
- Säkerställ accessibility (touch targets 44px+)
- Implementera offline-support för onboarding progress
