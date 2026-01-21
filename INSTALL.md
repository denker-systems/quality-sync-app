# Installation Instructions

## Quick Start

```bash
# 1. Installera dependencies
npm install

# 2. Skapa .env fil
cp .env.example .env
# Fyll i Supabase credentials från fortnox-quinyx-sync projektet

# 3. Starta development server
npm start

# 4. Kör på iOS eller Android
npm run ios    # macOS endast
npm run android
```

## Detailed Setup

Se [SETUP.md](./SETUP.md) för detaljerade instruktioner.

## Environment Variables

Kopiera följande från `fortnox-quinyx-sync/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://gezwyczyzvzkujfsohyt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Verifiering

Appen är korrekt installerad när:
- ✅ `npm start` startar utan errors
- ✅ Login-skärmen visas i simulator/emulator
- ✅ Du kan logga in med samma credentials som webb-appen
- ✅ Profil-skärmen visar din användardata

## Troubleshooting

**Problem:** Module not found errors  
**Lösning:** `npm install` och `npm start -- --clear`

**Problem:** Simulator startar inte  
**Lösning:** Öppna simulator/emulator manuellt först

Se [SETUP.md](./SETUP.md) för fler lösningar.
