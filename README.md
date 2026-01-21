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
│   ├── config/          # Konfiguration (Supabase, etc.)
│   ├── types/           # TypeScript types
│   ├── hooks/           # Custom React hooks
│   ├── screens/         # Screen components
│   ├── components/      # Reusable components
│   ├── navigation/      # Navigation setup
│   └── utils/           # Utility functions
├── assets/              # Images, fonts, etc.
├── App.tsx              # Root component
└── package.json
```

## 🔐 Authentication

Appen använder Supabase Auth med samma credentials som webb-appen:
- Email/password login
- PKCE flow för säkerhet
- Session persistence med AsyncStorage
- Auto-refresh av tokens

## 📱 Features

### v1.0 (Current)
- ✅ Login med email/password
- ✅ Visa användarprofil
- ✅ Logout

### Planned
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
