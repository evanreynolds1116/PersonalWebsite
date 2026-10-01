export type Theme = 'dark' | 'light';

/**
 * localStorage key for an explicit user choice. Keep in sync with the inline
 * script in BaseLayout.astro, which applies the theme before first paint.
 */
export const THEME_STORAGE_KEY = 'theme';

const root = document.documentElement;

export function getTheme(): Theme {
  return root.dataset.theme === 'light' ? 'light' : 'dark';
}

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    // Storage can throw in private modes or when site data is blocked.
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Not persisting is fine; the choice still applies to this page.
  }
}

/** Applies a theme and syncs the browser UI color to the new background. */
export function applyTheme(theme: Theme): void {
  root.dataset.theme = theme;
  const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
  document.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: theme }));
}
