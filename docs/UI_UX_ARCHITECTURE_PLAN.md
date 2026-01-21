# Quality Sync App - UI/UX Architecture Plan

## Executive Summary

Detta dokument beskriver en komplett UI/UX-arkitektur för Quality Sync App med centraliserad theming, mörkt/ljust läge, och moderna komponenter.

---

## ✅ Implementation Status (2026-01-20)

### Färdigt

| Komponent | Status | Fil |
|-----------|--------|-----|
| **NativeWind v5** | ✅ Installerat | `tailwind.config.js`, `metro.config.js` |
| **Design Tokens** | ✅ Skapad | `src/config/colors.ts` |
| **CSS Variables** | ✅ Konfigurerad | `src/styles/global.css` |
| **Text Component** | ✅ Implementerad | `src/components/ui/Text.tsx` |
| **Button Component** | ✅ Implementerad | `src/components/ui/Button.tsx` |
| **Card Component** | ✅ Implementerad | `src/components/ui/Card.tsx` |
| **FloatingTabBar** | ✅ Implementerad | `src/components/ui/FloatingTabBar.tsx` |
| **FullscreenMenu** | ✅ Implementerad | `src/components/ui/FullscreenMenu.tsx` |
| **Input Component** | ✅ Implementerad | `src/components/ui/Input.tsx` |
| **Avatar Component** | ✅ Implementerad | `src/components/ui/Avatar.tsx` |
| **Badge Component** | ✅ Implementerad | `src/components/ui/Badge.tsx` |
| **Divider Component** | ✅ Implementerad | `src/components/ui/Divider.tsx` |
| **IconButton Component** | ✅ Implementerad | `src/components/ui/IconButton.tsx` |
| **HomeScreen** | ✅ Implementerad | `src/screens/home/HomeScreen.tsx` |
| **SearchScreen** | ✅ Implementerad | `src/screens/search/SearchScreen.tsx` |
| **MainTabNavigator** | ✅ Implementerad | `src/navigation/MainTabNavigator.tsx` |
| **PostCSS Config** | ✅ Skapad | `postcss.config.js` |

### Design Inspiration
Baserat på **ZocDog Healthcare App** (Behance):
- Mintgrön färgpalett (#D4E8D1 → #6BBD68)
- Svarta CTA-knappar med pill-form
- Överlappande cirkulär tab bar
- Avanza-stil fullscreen meny
- Lufga typsnitt (geometric sans-serif)

Se `docs/DESIGN_SYSTEM.md` för komplett specifikation.

---

## 🔍 Research Resultat

### Populära React Native UI Libraries 2025

| Library | Fördelar | Nackdelar | Rekommendation |
|---------|----------|-----------|----------------|
| **NativeWind v5** | Tailwind CSS för RN, 97+ snippets, Benchmark: 72.6 | Kräver PostCSS setup | ⭐ **REKOMMENDERAD** |
| **Gluestack UI** | Copy-paste komponenter, NativeWind-baserad, 844 snippets | Relativt nytt | ⭐ **REKOMMENDERAD** |
| **React Native Paper** | Material Design, redan installerad, 848 snippets | Begränsad styling-flexibilitet | ✅ Behåll som bas |
| **Uniwind** | Snabbaste Tailwind-bindningar, 1091 snippets | Mindre dokumentation | Alternativ |
| **Tamagui** | Universal styling, animations | Komplex setup | Avancerat alternativ |

### Rekommenderad Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  NativeWind v5 (Tailwind CSS)                                   │
│  └── Universal styling med dark: prefix                         │
├─────────────────────────────────────────────────────────────────┤
│  Gluestack UI                                                   │
│  └── Copy-paste komponenter (Button, Card, Input, etc.)         │
├─────────────────────────────────────────────────────────────────┤
│  React Native Paper (befintlig)                                 │
│  └── Material Design komponenter för komplexare widgets         │
├─────────────────────────────────────────────────────────────────┤
│  Centraliserad ThemeContext                                     │
│  └── Dark/Light/System med CSS-variabler                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arkitektur Översikt

### Nuvarande Problem

1. **Fragmenterad styling** - `StyleSheet.create()` med hårdkodade färger i varje fil
2. **Inkonsekvent theming** - Vissa komponenter använder `paperTheme.colors.*`, andra har hårdkodade värden
3. **Duplicering** - Samma stilar definieras om och om igen
4. **Begränsad dark mode** - Fungerar men kräver manuell prop-passing överallt

### Föreslagna Lösningar

```
src/
├── components/
│   └── ui/                          # 🆕 Centraliserade UI-komponenter
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Text.tsx
│       ├── Input.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Dialog.tsx
│       ├── List.tsx
│       ├── Divider.tsx
│       ├── IconButton.tsx
│       ├── gluestack-ui-provider/   # Gluestack provider
│       └── index.ts                 # Barrel export
├── config/
│   ├── theme.ts                     # ✅ Befintlig (utöka)
│   ├── colors.ts                    # 🆕 Centraliserade färger
│   ├── tokens.ts                    # 🆕 Design tokens
│   └── nativewind.config.ts         # 🆕 NativeWind CSS-variabler
├── contexts/
│   └── ThemeContext.tsx             # ✅ Befintlig (förbättra)
├── styles/
│   ├── global.css                   # 🆕 Tailwind/NativeWind globals
│   └── tailwind.config.js           # 🆕 Tailwind konfiguration
└── hooks/
    └── useThemedStyles.ts           # 🆕 Theme-aware style hook
```

---

## 📦 Fas 1: Installation (2-3 timmar)

### 1.1 Installera NativeWind v5

```bash
# Installera NativeWind och beroenden
npx expo install nativewind tailwindcss @tailwindcss/postcss postcss

# Skapa konfigurationsfiler
npx tailwindcss init
```

### 1.2 Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class", // Använd class-baserad dark mode
  theme: {
    extend: {
      colors: {
        // Brand colors (matchar web app)
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "#997328",
          light: "#d4a636",
          dark: "#614a19",
        },
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--color-card) / <alpha-value>)",
          foreground: "rgb(var(--color-card-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        success: "#22c55e",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
      },
    },
  },
  plugins: [],
};
```

### 1.3 PostCSS Config

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 1.4 Global CSS

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables för theming */
:root {
  --color-primary: 23 23 23;          /* #171717 */
  --color-primary-foreground: 255 255 255;
  --color-background: 255 255 255;    /* #ffffff */
  --color-foreground: 23 23 23;       /* #171717 */
  --color-card: 255 255 255;
  --color-card-foreground: 23 23 23;
  --color-muted: 245 245 245;         /* #f5f5f5 */
  --color-muted-foreground: 102 102 102;
  --color-border: 229 229 229;        /* #e5e5e5 */
}

.dark {
  --color-primary: 250 250 250;       /* #fafafa */
  --color-primary-foreground: 10 10 10;
  --color-background: 10 10 10;       /* #0a0a0a */
  --color-foreground: 250 250 250;    /* #fafafa */
  --color-card: 20 20 20;             /* #141414 */
  --color-card-foreground: 250 250 250;
  --color-muted: 31 31 31;            /* #1f1f1f */
  --color-muted-foreground: 166 166 166;
  --color-border: 46 46 46;           /* #2e2e2e */
}
```

### 1.5 Babel Config Update

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
          },
        },
      ],
    ],
  };
};
```

### 1.6 Metro Config Update

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });
```

---

## 📦 Fas 2: Gluestack UI Installation (1-2 timmar)

### 2.1 Installera Gluestack UI

```bash
npx gluestack-ui init
```

### 2.2 Lägg till komponenter

```bash
# Lägg till de mest använda komponenterna
npx gluestack-ui add button card text input avatar badge divider
npx gluestack-ui add dialog alert-dialog toast
npx gluestack-ui add icon pressable box
```

### 2.3 GluestackUIProvider Setup

```tsx
// src/components/ui/gluestack-ui-provider/index.tsx
import { vars } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const lightTheme = vars({
  '--color-primary': '23 23 23',
  '--color-background': '255 255 255',
  '--color-foreground': '23 23 23',
  '--color-card': '255 255 255',
  '--color-muted': '245 245 245',
  '--color-border': '229 229 229',
});

const darkTheme = vars({
  '--color-primary': '250 250 250',
  '--color-background': '10 10 10',
  '--color-foreground': '250 250 250',
  '--color-card': '20 20 20',
  '--color-muted': '31 31 31',
  '--color-border': '46 46 46',
});

interface GluestackUIProviderProps {
  children: React.ReactNode;
  mode?: 'light' | 'dark';
}

export function GluestackUIProvider({ children, mode }: GluestackUIProviderProps) {
  const { resolvedTheme } = useTheme();
  const currentMode = mode ?? resolvedTheme;
  
  return (
    <View style={[{ flex: 1 }, currentMode === 'dark' ? darkTheme : lightTheme]}>
      {children}
    </View>
  );
}
```

---

## 📦 Fas 3: Centraliserade UI-komponenter (4-6 timmar)

### 3.1 Wrapper-komponenter

Skapa wrapper-komponenter som kombinerar NativeWind med React Native Paper:

```tsx
// src/components/ui/Button.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'flex-row items-center justify-center rounded-lg px-4 py-3',
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      outline: 'border border-border bg-transparent',
      ghost: 'bg-transparent',
      destructive: 'bg-error',
    },
    size: {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const textVariants = tv({
  base: 'font-semibold',
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-white',
      outline: 'text-foreground',
      ghost: 'text-foreground',
      destructive: 'text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  onPress,
  className,
  icon,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={buttonVariants({ variant, size, disabled, className })}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text className={textVariants({ variant, size })}>
        {children}
      </Text>
    </Pressable>
  );
}
```

```tsx
// src/components/ui/Card.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv } from 'tailwind-variants';

const cardVariants = tv({
  base: 'rounded-xl bg-card p-4 shadow-sm',
  variants: {
    variant: {
      default: 'border border-border',
      elevated: 'shadow-md',
      outline: 'border-2 border-border bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outline';
  className?: string;
}

export function Card({ children, variant, className, ...props }: CardProps) {
  return (
    <View className={cardVariants({ variant, className })} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={`mb-3 ${className}`}>{children}</View>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={className}>{children}</View>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={`mt-3 flex-row justify-end ${className}`}>{children}</View>;
}
```

```tsx
// src/components/ui/Text.tsx
import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { tv } from 'tailwind-variants';

const textVariants = tv({
  base: 'text-foreground',
  variants: {
    variant: {
      h1: 'text-3xl font-bold',
      h2: 'text-2xl font-bold',
      h3: 'text-xl font-semibold',
      h4: 'text-lg font-semibold',
      body: 'text-base',
      bodySmall: 'text-sm',
      caption: 'text-xs text-muted-foreground',
      label: 'text-sm font-medium',
    },
    muted: {
      true: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label';
  muted?: boolean;
  className?: string;
}

export function Text({ variant, muted, className, ...props }: CustomTextProps) {
  return (
    <RNText 
      className={textVariants({ variant, muted, className })} 
      {...props} 
    />
  );
}
```

### 3.2 Barrel Export

```tsx
// src/components/ui/index.ts
export { Button } from './Button';
export { Card, CardHeader, CardContent, CardFooter } from './Card';
export { Text } from './Text';
export { GluestackUIProvider } from './gluestack-ui-provider';
// ... fler komponenter
```

---

## 📦 Fas 4: App.tsx Integration (1 timme)

### 4.1 Uppdaterad App.tsx

```tsx
// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MFAGate } from './src/features/mfa';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { GluestackUIProvider } from './src/components/ui';
import { lightTheme, darkTheme } from './src/config/theme';
import './src/styles/global.css'; // 🆕 NativeWind global styles

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ThemedApp = () => {
  const { isDark, resolvedTheme } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <GluestackUIProvider mode={resolvedTheme}>
      <PaperProvider theme={theme}>
        <MFAGate>
          <AppNavigator />
        </MFAGate>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </PaperProvider>
    </GluestackUIProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <ThemedApp />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

---

## 📦 Fas 5: Migration av Befintliga Komponenter (6-10 timmar)

### 5.1 Migrationsstrategi

1. **Börja med nya komponenter** - Använd NativeWind för alla nya komponenter
2. **Gradvis migration** - Migrera en skärm åt gången
3. **Behåll React Native Paper** - För komplexa widgets (Dialog, Snackbar, etc.)
4. **Använd className istället för style** - Där möjligt

### 5.2 Exempel: ProfileScreen Migration

**Före:**
```tsx
<Card style={styles.card}>
  <Card.Content>
    <Text variant="titleMedium" style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
      Snabbval
    </Text>
  </Card.Content>
</Card>
```

**Efter:**
```tsx
<Card className="mx-4 mb-2">
  <CardContent>
    <Text variant="h4" className="mb-2">
      Snabbval
    </Text>
  </CardContent>
</Card>
```

### 5.3 Prioriterad Migrationsordning

1. `ProfileScreen.tsx` - Mest komplex, bra testfall
2. `LoginScreen.tsx` - Användarens första intryck
3. `ScheduleScreen.tsx` - Vanligt använd
4. Övriga skärmar

---

## 📦 Fas 6: TypeScript Types (1 timme)

### 6.1 NativeWind Type Declarations

```typescript
// src/types/nativewind.d.ts
/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
}
```

---

## 🎯 Fördelar med Denna Arkitektur

| Funktion | Fördel |
|----------|--------|
| **NativeWind** | Tailwind CSS syntax, `dark:` prefix för dark mode |
| **CSS Variables** | Centraliserade färger som uppdateras globalt |
| **Gluestack UI** | Produktionsfärdiga, tillgängliga komponenter |
| **React Native Paper** | Beprövade Material Design widgets |
| **Tailwind Variants** | Type-safe variants för komponenter |
| **Single Source of Truth** | En plats för alla färger och stilar |

---

## 📋 Implementationsordning

### Vecka 1
- [ ] Installera NativeWind v5
- [ ] Konfigurera Tailwind + PostCSS
- [ ] Skapa global.css med CSS-variabler
- [ ] Uppdatera babel.config.js och metro.config.js

### Vecka 2
- [ ] Installera Gluestack UI
- [ ] Skapa Button, Card, Text komponenter
- [ ] Uppdatera App.tsx med GluestackUIProvider
- [ ] Migrera ThemeContext för NativeWind-integration

### Vecka 3
- [ ] Migrera ProfileScreen
- [ ] Migrera LoginScreen
- [ ] Skapa fler UI-komponenter (Input, Avatar, Badge)

### Vecka 4
- [ ] Migrera övriga skärmar
- [ ] Dokumentation och cleanup
- [ ] Performance-testning

---

## 📚 Referenser

- [NativeWind v5 Docs](https://www.nativewind.dev/v5)
- [Gluestack UI](https://gluestack.io/ui/docs)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Tailwind Variants](https://www.tailwind-variants.org/)
- [Expo Color Themes](https://docs.expo.dev/develop/user-interface/color-themes/)

---

*Genererad: 2026-01-20*
