# Quality Sync App - Design System

## 🎨 Design Inspiration

Baserat på följande Behance-projekt:
- **ZocDog** (Healthcare) - Primär inspiration ⭐
- **AIVA** (AI Financial Management)
- **Productivity Task Management**
- **Smart Community Super App**

---

## 🎯 Design Principer

### 1. Visuellt Lugnande (ZocDog-stil)
- **Mjuka, avrundade former** - 16-24px border-radius
- **Generöst whitespace** - Andningsrum mellan element
- **Subtila skuggor** - Ej hårda kanter
- **Lugnande färgpalett** - Teal/mint toner med neutrala grunder

### 2. Klarhet & Enkelhet (AIVA-stil)
- **Tydlig hierarki** - Stor kontrast mellan rubriker och brödtext
- **Ikon-driven navigation** - Minimalt text-brus
- **Fokuserade vyer** - En primär åtgärd per skärm
- **Real-time feedback** - Tydlig visuell respons

### 3. Produktivitetsfokus (Task Management-stil)
- **Snabb skanning** - Viktig info synlig direkt
- **Progressindikatorer** - Visa framsteg tydligt
- **Batch-actions** - Effektiv hantering av listor
- **Smart defaults** - Minimera användarens arbete

---

## 🌈 Färgpalett (ZocDog-inspired)

### Light Mode

```
┌─────────────────────────────────────────────────────────────────┐
│  BACKGROUND LAYERS (ZocDog exact)                               │
├─────────────────────────────────────────────────────────────────┤
│  background-0    #FFFFFF   Pure white (cards)                   │
│  background-50   #F5F7F5   Off-white (main bg) ⭐                │
│  background-100  #EEF2EE   Light gray-green                     │
│  background-200  #E5EAE5   Medium gray (dividers)               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY (Mint Green - ZocDog exact)                            │
├─────────────────────────────────────────────────────────────────┤
│  primary-50      #EDF5EC   Lightest mint                        │
│  primary-100     #D4E8D1   Light mint (card bg) ⭐               │
│  primary-200     #C5E1A5   Soft mint (hero bg)                  │
│  primary-300     #A8D5A2   Medium mint                          │
│  primary-400     #8BC985   Bright mint                          │
│  primary-500     #6BBD68   DEFAULT - Main mint ⭐                │
│  primary-600     #5AAD57   Dark mint                            │
│  primary-700     #489A45   Darker mint                          │
│  primary-800     #367833   Very dark mint                       │
│  primary-900     #245622   Deepest mint                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ACCENT (Purple - för variation, ZocDog-stil)                   │
├─────────────────────────────────────────────────────────────────┤
│  accent-100      #F3E8F7   Light purple bg                      │
│  accent-200      #E8D8F0   Soft purple (card bg)                │
│  accent-500      #9C7BAE   Medium purple                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SECONDARY (Gold/Accent)                                        │
├─────────────────────────────────────────────────────────────────┤
│  secondary-300   #F6D365   Light gold                           │
│  secondary-500   #D4A636   DEFAULT - Gold ⭐                     │
│  secondary-700   #997328   Dark gold                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SEMANTIC                                                       │
├─────────────────────────────────────────────────────────────────┤
│  success         #10B981   Green (Emerald 500)                  │
│  success-light   #D1FAE5   Green bg                             │
│  warning         #F59E0B   Amber                                │
│  warning-light   #FEF3C7   Amber bg                             │
│  error           #EF4444   Red                                  │
│  error-light     #FEE2E2   Red bg                               │
│  info            #3B82F6   Blue                                 │
│  info-light      #DBEAFE   Blue bg                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TEXT                                                           │
├─────────────────────────────────────────────────────────────────┤
│  text-primary    #171717   Near black (headings)                │
│  text-secondary  #525252   Dark gray (body)                     │
│  text-muted      #737373   Medium gray (captions)               │
│  text-disabled   #A3A3A3   Light gray                           │
└─────────────────────────────────────────────────────────────────┘
```

### Dark Mode (ZocDog-adapted)

```
┌─────────────────────────────────────────────────────────────────┐
│  BACKGROUND LAYERS                                              │
├─────────────────────────────────────────────────────────────────┤
│  background-0    #0F0F0F   Near black (main bg) ⭐               │
│  background-50   #1A1A1A   Dark gray (cards)                    │
│  background-100  #242424   Medium dark (sections)               │
│  background-200  #2E2E2E   Lighter dark (hover)                 │
│  background-300  #3D3D3D   Borders                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY (Mint - brighter for dark mode)                        │
├─────────────────────────────────────────────────────────────────┤
│  primary-300     #A8D5A2   Bright mint (buttons) ⭐              │
│  primary-400     #8BC985   Medium mint                          │
│  primary-500     #6BBD68   Default mint                         │
│  primary-900     #1A2E1A   Mint overlay bg (subtle)             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TEXT                                                           │
├─────────────────────────────────────────────────────────────────┤
│  text-primary    #FAFAFA   Off-white (headings) ⭐               │
│  text-secondary  #D4D4D4   Light gray (body)                    │
│  text-muted      #A3A3A3   Medium gray (captions)               │
│  text-disabled   #525252   Dark gray                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CTA / BUTTONS (Dark mode)                                      │
├─────────────────────────────────────────────────────────────────┤
│  cta-primary     #FAFAFA   White buttons (inverted) ⭐           │
│  cta-text        #0F0F0F   Black text on white                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 Spacing & Grid System (ZocDog exact - Bild 4)

```
┌───────────────────────────────────────────────────┐
│  GRID SYSTEM (from ZocDog)                        │
├───────────────────────────────────────────────────┤
│  Columns:      5 columns × 60px each              │
│  Gutter:       16px between columns               │
│  Side margin:  16px left/right                    │
│  Total width:  5×60 + 4×16 = 364px (iPhone)       │
│  Safe area:    33px bottom, 84px top (with notch) │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  SPACING SCALE (16px base - ZocDog uses 16px)     │
├───────────────────────────────────────────────────┤
│  space-0.5    2px     Minimal gap                 │
│  space-1      4px     Tight spacing               │
│  space-2      8px     Small gaps                  │
│  space-3      12px    Compact                     │
│  space-4      16px    DEFAULT ⭐ (base unit)       │
│  space-5      20px    Comfortable                 │
│  space-6      24px    Card padding                │
│  space-8      32px    Section spacing             │
│  space-10     40px    Large sections              │
│  space-12     48px    Hero spacing                │
│  space-16     64px    Major sections              │
│  space-20     80px    Page top padding            │
└───────────────────────────────────────────────────┘
```

---

## 🔲 Border Radius

```
┌───────────────────────────────────────────────────┐
│  RADIUS SCALE (ZocDog-inspired, soft/rounded)     │
├───────────────────────────────────────────────────┤
│  radius-sm     8px     Small buttons, badges      │
│  radius-md     12px    Inputs, small cards        │
│  radius-lg     16px    Cards, modals ⭐            │
│  radius-xl     20px    Large cards                │
│  radius-2xl    24px    Hero sections              │
│  radius-full   9999px  Pills, avatars             │
└───────────────────────────────────────────────────┘
```

---

## 🔤 Typography (ZocDog: Lufga)

```
┌───────────────────────────────────────────────────────────────┐
│  FONT FAMILY (from ZocDog design)                             │
├───────────────────────────────────────────────────────────────┤
│  Primary: Lufga (geometric sans-serif)                        │
│           Fallback: Inter, SF Pro, System UI                  │
│  Monospace: JetBrains Mono (for code/numbers)                 │
│                                                               │
│  Weights available:                                           │
│    - Light (300)                                              │
│    - Regular (400) ⭐                                          │
│    - Medium (500)                                             │
│    - SemiBold (600) ⭐                                         │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  TYPE SCALE (ZocDog-inspired)                                 │
├───────────────────────────────────────────────────────────────┤
│  display     36px   SemiBold  Hero headings ("Good Afternoon")│
│  h1          28px   SemiBold  Page titles                     │
│  h2          24px   SemiBold  Section headers ("Our Specialist")│
│  h3          20px   Medium    Card titles ("Dr. Jessica")     │
│  h4          17px   Medium    Subsections                     │
│  body-lg     16px   Regular   Primary content ⭐               │
│  body        14px   Regular   Default text                    │
│  body-sm     13px   Regular   Secondary ("Cardiology")        │
│  caption     12px   Regular   Labels, hints                   │
│  tiny        11px   Medium    Badges ("Online", "$120")       │
│  price       18px   SemiBold  Prices ("$120 /session")        │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  LINE HEIGHT                                                  │
├───────────────────────────────────────────────────────────────┤
│  tight       1.2     Headings, display                        │
│  snug        1.35    Card titles                              │
│  normal      1.5     Body text ⭐                              │
│  relaxed     1.65    Long-form content                        │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  LETTER SPACING                                               │
├───────────────────────────────────────────────────────────────┤
│  tight      -0.02em  Display headings                         │
│  normal      0       Body text ⭐                              │
│  wide        0.02em  Buttons, labels                          │
│  wider       0.05em  All caps, badges                         │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎭 Shadows

```
┌───────────────────────────────────────────────────────────────┐
│  SHADOW SCALE (Subtle, ZocDog-inspired)                       │
├───────────────────────────────────────────────────────────────┤
│  shadow-xs    0 1px 2px rgba(0,0,0,0.04)                      │
│  shadow-sm    0 2px 4px rgba(0,0,0,0.06)    Buttons           │
│  shadow-md    0 4px 8px rgba(0,0,0,0.08)    Cards ⭐           │
│  shadow-lg    0 8px 16px rgba(0,0,0,0.10)   Modals            │
│  shadow-xl    0 16px 32px rgba(0,0,0,0.12)  Sheets            │
└───────────────────────────────────────────────────────────────┘

│  DARK MODE SHADOWS                                            │
├───────────────────────────────────────────────────────────────┤
│  shadow-md    0 4px 8px rgba(0,0,0,0.40)    Stronger          │
│  + subtle glow: 0 0 0 1px rgba(255,255,255,0.05)              │
└───────────────────────────────────────────────────────────────┘
```

---

## 🧱 Component Specs

### Cards (ZocDog-style)
```
┌─────────────────────────────────────┐
│  padding: 16px (space-4)            │
│  border-radius: 16px (radius-lg)    │
│  background: background-0           │
│  shadow: shadow-md                  │
│  border: 1px solid border (subtle)  │
│  margin-bottom: 12px                │
└─────────────────────────────────────┘
```

### Buttons (ZocDog-style - from Bild 2, 5, 7, 8)
```
┌─────────────────────────────────────────────────────┐
│  VARIANTS                                           │
├─────────────────────────────────────────────────────┤
│  Primary:    bg-#1A1A1A (black), text-white ⭐       │
│              hover: bg-#2A2A2A                      │
│              active: bg-#0A0A0A                     │
│              (ZocDog uses black CTAs)               │
│                                                     │
│  Primary-Alt: bg-primary-100 (#D4E8D1), text-black  │
│              hover: bg-primary-200                  │
│              (Mint background buttons)              │
│                                                     │
│  Outline:    border-#E5E5E5, text-#1A1A1A           │
│              hover: bg-#F5F5F5                      │
│              (Chip/filter style)                    │
│                                                     │
│  Ghost:      bg-transparent, text-#1A1A1A           │
│              hover: bg-#F5F5F5                      │
│                                                     │
│  Icon:       bg-#1A1A1A, icon-white (circular)      │
│              size: 44px × 44px                      │
│              (Like send button, mic button)         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  SIZES                                              │
├─────────────────────────────────────────────────────┤
│  sm:  height 36px, padding 12px 16px, text 13px     │
│  md:  height 48px, padding 14px 24px, text 14px ⭐   │
│  lg:  height 56px, padding 16px 32px, text 16px     │
│  icon: 44px × 44px (circular)                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  COMMON STYLES                                      │
├─────────────────────────────────────────────────────┤
│  border-radius: radius-full (pill shape) ⭐          │
│  font-weight: 500 (medium)                          │
│  transition: 150ms ease                             │
│  min-touch-target: 44px x 44px                      │
│  shadow: none (flat design)                         │
└─────────────────────────────────────────────────────┘
```

### Inputs
```
┌─────────────────────────────────────────────────────┐
│  height: 48px                                       │
│  padding: 12px 16px                                 │
│  border-radius: radius-md (12px)                    │
│  border: 1px solid border                           │
│  background: background-50                          │
│  focus: border-primary-500, ring 2px primary-100    │
│  placeholder: text-muted                            │
└─────────────────────────────────────────────────────┘
```

### Avatars
```
┌─────────────────────────────────────────────────────┐
│  xs:  24px   Inline, lists                          │
│  sm:  32px   Comments                               │
│  md:  40px   Cards ⭐                                │
│  lg:  56px   Profile headers                        │
│  xl:  80px   Profile page                           │
│  2xl: 120px  Hero profile                           │
│                                                     │
│  border-radius: radius-full                         │
│  border: 2px solid background-0 (for overlap)       │
└─────────────────────────────────────────────────────┘
```

### Badges/Pills (ZocDog-style)
```
┌─────────────────────────────────────────────────────┐
│  height: 24px                                       │
│  padding: 4px 12px                                  │
│  border-radius: radius-full                         │
│  font-size: tiny (11px)                             │
│  font-weight: 500                                   │
│                                                     │
│  Variants:                                          │
│    online:  bg-#E8F5E9, text-#2E7D32 + green dot ⭐  │
│    success: bg-success-light, text-success          │
│    warning: bg-warning-light, text-warning          │
│    error:   bg-error-light, text-error              │
│    neutral: bg-#F5F5F5, text-#525252                │
│    primary: bg-primary-100, text-primary-700        │
└─────────────────────────────────────────────────────┘
```

### Bottom Navigation (ZocDog Floating Pills Style) ⭐
```
┌─────────────────────────────────────────────────────┐
│  VISUAL DESIGN (Overlapping Circles)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│       ┌───┐ ┌───┐ ┌───┐ ┌───┐                       │
│      ( 🏠 )( 🔍 )( 📅 )( ⚙️ )  ← Overlapping        │
│       └───┘ └───┘ └───┘ └───┘                       │
│              ↑                                      │
│         Active = Black filled                       │
│                                                     │
│  Circles overlap by ~12px for connected look        │
│  Creates a "pill chain" effect                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CONTAINER                                          │
├─────────────────────────────────────────────────────┤
│  position: absolute, bottom                         │
│  background: transparent (floating)                 │
│  padding-bottom: 24px (safe area)                   │
│  justify-content: center                            │
│  z-index: 100                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CIRCLE BUTTONS                                     │
├─────────────────────────────────────────────────────┤
│  size: 56px × 56px (each circle)                    │
│  margin-left: -12px (overlap, except first)         │
│  border-radius: radius-full (28px)                  │
│  shadow: 0 4px 12px rgba(0,0,0,0.08)                │
│                                                     │
│  INACTIVE STATE:                                    │
│    background: #FFFFFF                              │
│    border: 1px solid #E5E5E5                        │
│    icon: 24px, #737373, outline style               │
│                                                     │
│  ACTIVE STATE: ⭐                                    │
│    background: #1A1A1A (black)                      │
│    border: none                                     │
│    icon: 24px, #FFFFFF (white), filled style        │
│    scale: 1.05 (slightly larger)                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ACTIVE LABEL (Optional)                            │
├─────────────────────────────────────────────────────┤
│  position: below active circle                      │
│  text: "Book Appointment" or screen name            │
│  font-size: 11px                                    │
│  color: #525252                                     │
│  margin-top: 4px                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ICONS (4 items for Quality Sync)                   │
├─────────────────────────────────────────────────────┤
│  1. Home      → lucide: "home"                      │
│  2. Search    → lucide: "search"                    │
│  3. Schedule  → lucide: "calendar-check"            │
│  4. Profile   → lucide: "settings" or "user"        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DARK MODE                                          │
├─────────────────────────────────────────────────────┤
│  INACTIVE:                                          │
│    background: #2A2A2A                              │
│    border: 1px solid #3D3D3D                        │
│    icon: #A3A3A3                                    │
│                                                     │
│  ACTIVE:                                            │
│    background: #FAFAFA (white)                      │
│    icon: #0F0F0F (black)                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ANIMATION                                          │
├─────────────────────────────────────────────────────┤
│  transition: all 200ms ease-out                     │
│  active scale: transform: scale(1.05)               │
│  press feedback: scale(0.95) on press               │
└─────────────────────────────────────────────────────┘
```

### Fullscreen Menu (Avanza-style) ⭐
```
┌─────────────────────────────────────────────────────┐
│  TRIGGER                                            │
├─────────────────────────────────────────────────────┤
│  Button: Settings (⚙️) in bottom nav (rightmost)    │
│  Action: Opens fullscreen menu from right           │
│  Animation: slide-in-right, 300ms ease-out          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CONTAINER                                          │
├─────────────────────────────────────────────────────┤
│  position: absolute, full screen                    │
│  background: #0F0F0F (dark) / #FFFFFF (light)       │
│  z-index: 200 (above everything)                    │
│  padding-top: safe-area-top                         │
│  padding-bottom: safe-area-bottom                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  HEADER                                             │
├─────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐     │
│  │  Meny          ⚙️  📬  [ Logga ut ]        │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  Title: "Meny" - h1, left-aligned                   │
│  Icons: Settings, Notifications (with badge)        │
│  Logout button: outline, text-error                 │
│  height: 60px                                       │
│  border-bottom: 1px solid border                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  QUICK ACTION CARD (Optional)                       │
├─────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐     │
│  │  🎧  Kundservice                      →    │     │
│  │      Sök upp svaret på din fråga direkt    │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  background: primary-900 (dark mint overlay)        │
│  border: 1px solid primary-700                      │
│  border-radius: 16px                                │
│  padding: 16px                                      │
│  margin: 16px                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  SECTION GROUPS                                     │
├─────────────────────────────────────────────────────┤
│  Section Title:                                     │
│    font-size: 14px, font-weight: 600                │
│    color: text-muted                                │
│    text-transform: none                             │
│    padding: 24px 16px 8px 16px                      │
│                                                     │
│  Example sections for Quality Sync:                 │
│    - "Huvudmeny"                                    │
│    - "HR & Personal"                                │
│    - "Inställningar"                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  MENU ITEMS                                         │
├─────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐     │
│  │  🏠  Dashboard                         →   │     │
│  │      Översikt och snabbval                 │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  Layout:                                            │
│    height: 64px                                     │
│    padding: 12px 16px                               │
│    flex-direction: row                              │
│    align-items: center                              │
│                                                     │
│  Icon container:                                    │
│    size: 40px circular                              │
│    background: primary-900 / primary-100            │
│    icon: 20px, primary-400 / primary-600            │
│                                                     │
│  Text:                                              │
│    Title: body-lg, text-primary                     │
│    Subtitle: body-sm, text-muted                    │
│                                                     │
│  Chevron:                                           │
│    icon: chevron-right, 20px, text-muted            │
│                                                     │
│  Hover/Press:                                       │
│    background: background-100                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  MENU ITEMS FOR QUALITY SYNC                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Huvudmeny:                                         │
│    📊 Dashboard       - Översikt                    │
│    📅 Mitt Schema     - Kommande skift              │
│    📝 Onboarding      - Starta din resa             │
│    📄 Mina Avtal      - Kontrakt och dokument       │
│                                                     │
│  HR & Personal:                                     │
│    👤 Min Profil      - Personuppgifter             │
│    🏢 Företag         - Företagsinformation         │
│                                                     │
│  Inställningar:                                     │
│    🎨 Utseende        - Tema (ljust/mörkt)          │
│    🔔 Notifikationer  - Push-inställningar          │
│    🔐 Säkerhet        - Lösenord, 2FA               │
│    ℹ️  Om appen        - Version, licenser          │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ANIMATION & GESTURES                               │
├─────────────────────────────────────────────────────┤
│  Open:                                              │
│    translateX: 100% → 0                             │
│    duration: 300ms                                  │
│    easing: ease-out                                 │
│    backdrop: fade-in rgba(0,0,0,0.5)                │
│                                                     │
│  Close:                                             │
│    translateX: 0 → 100%                             │
│    duration: 250ms                                  │
│    easing: ease-in                                  │
│                                                     │
│  Gestures:                                          │
│    Swipe right to close                             │
│    Tap backdrop to close                            │
│    Back button to close                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DARK MODE (Default för menu)                       │
├─────────────────────────────────────────────────────┤
│  background: #0F0F0F                                │
│  text-primary: #FAFAFA                              │
│  text-muted: #737373                                │
│  icon-container: rgba(107,189,104,0.15)             │
│  icon-color: #A8D5A2                                │
│  border: #2A2A2A                                    │
│  section-title: #525252                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  LIGHT MODE                                         │
├─────────────────────────────────────────────────────┤
│  background: #FFFFFF                                │
│  text-primary: #171717                              │
│  text-muted: #737373                                │
│  icon-container: #EDF5EC                            │
│  icon-color: #489A45                                │
│  border: #E5E5E5                                    │
│  section-title: #737373                             │
└─────────────────────────────────────────────────────┘
```

### Profile Header (ZocDog - Bild 5)
```
┌─────────────────────────────────────────────────────┐
│  LAYOUT                                             │
├─────────────────────────────────────────────────────┤
│  background: primary-100 (#D4E8D1) gradient         │
│  padding-top: 60px (safe area + space)              │
│  padding-bottom: 24px                               │
│  border-radius: 0 0 24px 24px (bottom corners)      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  AVATAR                                             │
├─────────────────────────────────────────────────────┤
│  size: 80px                                         │
│  border-radius: radius-full                         │
│  border: 3px solid #FFFFFF                          │
│  shadow: shadow-md                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  EDIT BUTTON                                        │
├─────────────────────────────────────────────────────┤
│  size: 36px circular                                │
│  background: #FFFFFF                                │
│  icon: pencil, 16px, #1A1A1A                        │
│  position: absolute, right side of header           │
│  shadow: shadow-sm                                  │
└─────────────────────────────────────────────────────┘
```

### List Items (ZocDog - Bild 5)
```
┌─────────────────────────────────────────────────────┐
│  LAYOUT                                             │
├─────────────────────────────────────────────────────┤
│  padding: 16px                                      │
│  min-height: 56px                                   │
│  border-bottom: 1px solid #F0F0F0                   │
│  background: #FFFFFF                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  LEFT ICON                                          │
├─────────────────────────────────────────────────────┤
│  Container: 40px circular, bg-#F5F5F5               │
│  Icon: 20px, #525252                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  RIGHT CHEVRON                                      │
├─────────────────────────────────────────────────────┤
│  Icon: chevron-right, 20px, #A3A3A3                 │
└─────────────────────────────────────────────────────┘
```

### Specialist Card (ZocDog - Bild 7, 8)
```
┌─────────────────────────────────────────────────────┐
│  LAYOUT                                             │
├─────────────────────────────────────────────────────┤
│  background: primary-100 (#D4E8D1) or accent-200    │
│  border-radius: 24px                                │
│  padding: 20px                                      │
│  min-height: 200px                                  │
│  overflow: hidden (for image)                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CONTENT                                            │
├─────────────────────────────────────────────────────┤
│  Online badge: top-left                             │
│  Specialty: body-sm, #525252                        │
│  Name: h3, #1A1A1A                                  │
│  Price: price style, "$120 /session"                │
│  Favorite: heart icon, top-right                    │
│  Image: right side, partial overflow                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CTA BUTTON                                         │
├─────────────────────────────────────────────────────┤
│  "Book Appointment"                                 │
│  bg: #FFFFFF, text: #1A1A1A                         │
│  border-radius: radius-full                         │
│  full-width within card                             │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Screen Layouts

### Profile Screen (ZocDog-inspired)
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │         HEADER CARD           │  │
│  │  ┌─────┐                      │  │
│  │  │ AVA │  Name                │  │
│  │  │ TAR │  Role • Company      │  │
│  │  └─────┘                      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  QUICK ACTIONS                │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐     │  │
│  │  │ 📅  │ │ 📝  │ │ ⚙️  │     │  │
│  │  │Schema│ │Edit │ │ Set │     │  │
│  │  └─────┘ └─────┘ └─────┘     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  SECTION CARD                 │  │
│  │  ─────────────────────────    │  │
│  │  List Item            →       │  │
│  │  ─────────────────────────    │  │
│  │  List Item            →       │  │
│  └───────────────────────────────┘  │
│                                     │
│  [ Logout Button ]                  │
└─────────────────────────────────────┘
```

---

## 🌗 Dark/Light Mode Implementation

### CSS Variables Approach (NativeWind)
```css
:root {
  /* Light mode defaults */
  --color-bg-0: 255 255 255;
  --color-bg-50: 250 250 250;
  --color-bg-100: 245 245 245;
  --color-primary: 13 148 136;
  --color-text-primary: 23 23 23;
  --color-text-secondary: 82 82 82;
  --color-border: 229 229 229;
}

.dark {
  /* Dark mode overrides */
  --color-bg-0: 10 10 10;
  --color-bg-50: 20 20 20;
  --color-bg-100: 31 31 31;
  --color-primary: 45 212 191;
  --color-text-primary: 250 250 250;
  --color-text-secondary: 212 212 212;
  --color-border: 61 61 61;
}
```

### Component Usage
```tsx
// Automatisk dark mode med NativeWind
<View className="bg-background-0 dark:bg-background-0">
  <Text className="text-primary dark:text-primary">
    Adapts automatically
  </Text>
</View>

// Eller med CSS-variabler
<View className="bg-[rgb(var(--color-bg-0))]">
  <Text className="text-[rgb(var(--color-text-primary))]">
    Uses CSS variables
  </Text>
</View>
```

---

## ✅ Design Checklist

### Per Komponent
- [ ] Fungerar i Light mode
- [ ] Fungerar i Dark mode
- [ ] Korrekt touch-target (44px minimum)
- [ ] Tillgänglig kontrast (WCAG AA)
- [ ] Konsekvent spacing
- [ ] Smooth transitions (150-200ms)

### Per Skärm
- [ ] Tydlig visuell hierarki
- [ ] Tillräckligt whitespace
- [ ] Fokuserad primär åtgärd
- [ ] Konsekvent med design system

---

*Baserat på ZocDog Healthcare UI, AIVA Finance, och moderna productivity app-designers.*
*Uppdaterad: 2026-01-20*
