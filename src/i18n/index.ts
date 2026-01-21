import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en from './translations/en';
import sv from './translations/sv';

// Create i18n instance
const i18n = new I18n({
  en,
  sv,
});

// Set default locale based on device settings
const deviceLocale = getLocales()[0]?.languageCode ?? 'sv';
i18n.locale = deviceLocale === 'sv' || deviceLocale === 'en' ? deviceLocale : 'sv';

// Enable fallback to default language when translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'sv';

export default i18n;
export { i18n };
