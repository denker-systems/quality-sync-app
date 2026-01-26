# Quality Sync Mobile - Setup Guide

## 📋 Prerequisites

- **Node.js 18+** installerat
- **npm** eller **yarn**
- **Expo CLI** (installeras automatiskt)
- **iOS Simulator** (macOS) eller **Android Emulator**

## 🚀 Installation

### 1. Klona och navigera till projektet

```bash
cd quality-sync-app
```

### 2. Installera dependencies

```bash
npm install
```

Detta installerar alla nödvändiga paket inklusive:

- React Native & Expo
- Supabase client
- React Navigation
- React Native Paper (UI)
- React Hook Form + Zod
- React Query

### 3. Konfigurera environment variables

```bash
# Kopiera .env.example till .env
cp .env.example .env
```

Öppna `.env` och fyll i Supabase credentials från fortnox-quinyx-sync projektet:

```env
EXPO_PUBLIC_SUPABASE_URL=https://gezwyczyzvzkujfsohyt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Hitta credentials:**

1. Öppna `fortnox-quinyx-sync/.env`
2. Kopiera `VITE_SUPABASE_URL` → `EXPO_PUBLIC_SUPABASE_URL`
3. Kopiera `VITE_SUPABASE_ANON_KEY` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 4. Starta development server

```bash
npm start
```

Detta öppnar Expo Developer Tools i din browser.

### 5. Kör appen

**iOS (macOS endast):**

```bash
npm run ios
```

**Android:**

```bash
npm run android
```

**Web (för testing):**

```bash
npm run web
```

## 📱 Testa appen

### Login Credentials

Använd samma credentials som för webb-appen:

- Email: din email från fortnox-quinyx-sync
- Password: ditt lösenord

### Förväntat beteende

1. **Login Screen** visas först
2. Fyll i email och password
3. Klicka "Logga in"
4. **MFA Flow** (om användaren har MFA aktiverat):
   - Om inte enrollad: **MFA Enrollment Screen** visas med QR-kod
   - Om enrollad: **MFA Challenge Screen** visas för att ange 6-siffrig kod
5. **Profile Screen** visas med din användarinfo
6. Pull-to-refresh för att uppdatera data
7. Klicka "Logga ut" för att logga ut

## 🔧 Troubleshooting

### Problem: "Cannot find module 'expo'"

**Lösning:** Kör `npm install` igen

### Problem: "Metro bundler error"

**Lösning:**

```bash
npm start -- --clear
```

### Problem: iOS Simulator startar inte

**Lösning:**

```bash
# Öppna Simulator manuellt först
open -a Simulator

# Kör sedan
npm run ios
```

### Problem: Android Emulator startar inte

**Lösning:**

1. Öppna Android Studio
2. Starta en emulator från AVD Manager
3. Kör `npm run android`

### Problem: "Unable to resolve module @/"

**Lösning:**

```bash
# Rensa cache
npm start -- --clear

# Om det inte hjälper, ta bort node_modules och installera igen
rm -rf node_modules
npm install
```

## 🎨 UI Komponenter

Appen använder **React Native Paper** för UI:

- Material Design 3
- Färger matchade med webb-appen
- Responsiv design

## 🔐 Auth Flow

1. **Login** → Supabase Auth med email/password
2. **MFA Check** → Kontrollera assurance level (aal1/aal2)
3. **MFA Enrollment** → Om inte enrollad, visa QR-kod för Google Authenticator
4. **MFA Challenge** → Om enrollad, kräv 6-siffrig verifieringskod
5. **Session** → Sparas i AsyncStorage
6. **Auto-refresh** → Tokens uppdateras automatiskt
7. **Logout** → Rensar session

## 📊 Data Flow

```
LoginScreen
  └─ useAuth.signIn()
      └─ Supabase Auth
          └─ Session sparas i AsyncStorage

ProfileScreen
  └─ useAuth (hämtar user)
  └─ useMyEmployee (hämtar employee data)
  └─ useCompanyData (hämtar company data)
      └─ Supabase queries
```

## 🧪 Testing

### Manuell testning

1. ✅ Login med giltiga credentials
2. ✅ Login med ogiltiga credentials (ska visa error)
3. ✅ Visa profil-data
4. ✅ Pull-to-refresh
5. ✅ Logout
6. ✅ Session persistence (stäng och öppna app)

### Platform testing

- [ ] iOS Simulator
- [ ] Android Emulator
- [ ] Fysisk iPhone (optional)
- [ ] Fysisk Android (optional)

## 📝 Nästa Steg

Efter att grundfunktionaliteten fungerar:

1. Lägg till avatar upload
2. Lägg till edit profile
3. Lägg till fler profil-sektioner (onboarding, contracts, etc.)
4. Implementera push notifications
5. Lägg till offline mode

## 🆘 Support

Om du stöter på problem:

1. Kolla ROADMAP.md för implementation status
2. Kolla denna guide för troubleshooting
3. Kontakta utvecklingsteamet

## 📚 Resurser

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [React Navigation](https://reactnavigation.org/)
