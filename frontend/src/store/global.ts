import { defineStore } from 'pinia';
import { ref } from 'vue';
import useAuthStore from './auth.js';
import { AuthState, LocalStorage, type LanguageTag, type Theme } from '@/types.js';
import { identity } from '@/scripts/shared.js';

export const availableLanguages: ReadonlyArray<[LanguageTag, string]> = [
  ['en-US', 'English (US)'],
  ['hr-HR', 'Hrvatski'],
  ['it-IT', 'Italiano'],
];

export const defaultLanguage = availableLanguages[0][0];

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark').matches ? 'dark' : 'light';
}

function getValidTheme(theme: any): Theme {
  return theme == 'dark' ? 'dark' : 'light';
}

/**
 * Manages global states available regardless of whether the user is authenticated or not.
 */
const useGlobalStore = defineStore('global', () => {
  const theme = ref<Theme>('light');
  const language = ref<LanguageTag>('en-US');

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    localStorage.setItem(LocalStorage.THEME, theme.value);

    document.documentElement.classList.toggle('dark', theme.value == 'dark');
  }

  function nextTheme() {
    setTheme(theme.value == 'dark' ? 'light' : 'dark');
  }

  function setLanguage(newLanguage: LanguageTag) {
    language.value = newLanguage;
    document.documentElement.lang = newLanguage;
  }

  /**
   * Sets the current theme by priority to the theme:
   * 1. Stored in current authenticated user
   * 2. The one stored in localStorage,
   * 3. Default one used by the browser or system.
   */
  async function loadPreferredTheme() {
    const auth = useAuthStore();

    await auth.authReady;

    const newTheme: Theme = [
      auth.state == AuthState.LoggedIn && getValidTheme(auth.user.theme),
      getValidTheme(localStorage.getItem(LocalStorage.THEME)),
      getSystemTheme(),
    ].find(identity) as Theme;

    setTheme(newTheme);
  }

  function loadPreferredLanguage() {
    const potentialMatches = new Set(availableLanguages.map(([tag]) => tag));
    const found = [localStorage.getItem(LocalStorage.LOCALE), ...window.navigator.languages]
      .map(identity)
      .find((tag) => potentialMatches.has(tag as any)) as any;

    setLanguage(found ?? defaultLanguage);
  }

  loadPreferredTheme();
  loadPreferredLanguage();

  return {
    theme,
    language,
    setTheme,
    nextTheme,
    loadPreferredTheme,
    loadPreferredLanguage,
  };
});

export default useGlobalStore;
