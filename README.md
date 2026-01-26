# Quality Sync Mobile App

React Native-app för Quality Sync som delar samma Supabase-databas som webb-appen.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installerat
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) eller Android Emulator

### Installation

```bash
# Installera dependencies
npm install

# Kopiera environment variables
cp .env.example .env
# Fyll i EXPO_PUBLIC_SUPABASE_ANON_KEY från fortnox-quinyx-sync projektet

# Starta development server
npm start
```

### Köra appen

```bash
# iOS
npm run ios

# Android
npm run android

# Web (för testing)
npm run web
```

## 📁 Projektstruktur

```
quality-sync-app/
├── src/
│   ├── config/          # Konfiguration (Supabase, theme)
│   ├── types/           # TypeScript types (database, index)
│   ├── hooks/           # Custom React hooks (useAuth, useCompanyData, useMyEmployee)
│   ├── screens/         # Screen components
│   │   ├── auth/        # Authentication screens (LoginScreen)
│   │   └── profile/     # Profile screens (ProfileScreen)
│   ├── features/        # Feature modules
│   │   └── mfa/         # Multi-Factor Authentication
│   │       ├── components/  # MFA UI components
│   │       ├── hooks/       # MFA hooks
│   │       ├── services/    # MFA service layer
│   │       └── types/       # MFA types
│   ├── navigation/      # Navigation setup (AppNavigator)
│   └── utils/           # Utility functions
├── docs/                # Documentation and dev logs
│   └── devlogs/         # Date-based development logs
├── assets/              # Images, fonts, etc.
├── .windsurf/           # Windsurf workflows and rules
├── App.tsx              # Root component with MFAGate
└── package.json
```

## 🔐 Authentication

Appen använder Supabase Auth med samma credentials som webb-appen:

- Email/password login
- PKCE flow för säkerhet
- Session persistence med AsyncStorage
- Auto-refresh av tokens
- **Multi-Factor Authentication (MFA)** med TOTP

## 📱 Features

### v1.0 (Current)

- ✅ Login med email/password
- ✅ Multi-Factor Authentication (MFA)
  - ✅ TOTP enrollment med QR-kod (Google Authenticator)
  - ✅ MFA challenge screen för verifiering
  - ✅ MFA gate för att kräva 2FA vid behov
  - ✅ Assurance level check (aal1/aal2)
- ✅ Visa användarprofil
- ✅ Logout
- ✅ Session persistence

### Planned

- [ ] Company data display i profil
- [ ] Employee data display i profil
- [ ] Avatar upload
- [ ] Edit profile
- [ ] Push notifications
- [ ] Offline mode

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Navigation:** React Navigation
- **State Management:** React Query
- **Forms:** React Hook Form + Zod
- **UI Library:** React Native Paper
- **Backend:** Supabase
- **Language:** TypeScript

## 📚 Documentation

Se [ROADMAP.md](./ROADMAP.md) för detaljerad implementation plan.

## 🤝 Contributing

Detta projekt delar databas med fortnox-quinyx-sync webb-appen. Se till att ändringar är kompatibla med båda plattformarna.

## 📄 License

Private - Dopatec AB
