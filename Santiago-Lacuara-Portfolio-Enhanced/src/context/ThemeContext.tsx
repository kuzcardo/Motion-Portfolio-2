import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const KEY = 'theme';

// index.html applies the saved theme before React loads (no dark→light flash);
// this just reads what's already on <html>.
const initialTheme = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light') ? 'light' : 'dark';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('theme-light', theme === 'light');
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F3EEE6' : '#050505');
    try { localStorage.setItem(KEY, theme); } catch { /* private mode: theme just isn't remembered */ }
  }, [theme]);

  const toggleTheme = () => {
    // short cross-fade of colors only while switching (not on every hover)
    const root = document.documentElement;
    root.classList.add('theme-switching');
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    window.setTimeout(() => root.classList.remove('theme-switching'), 500);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
