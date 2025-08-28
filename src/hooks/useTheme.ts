import { useState, useEffect, useCallback } from "react";

// Define Theme type
export type Theme = "light" | "dark" | "system";

// ---- Helpers ----
const STORAGE_KEY = "theme";

// Save theme to localStorage
const setStoredTheme = (theme: Theme) => {
  localStorage.setItem(STORAGE_KEY, theme);
};

// Get stored theme from localStorage (or default to "system")
const getStoredTheme = (): Theme => {
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
};

// Detect system theme
const getSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Resolve effective theme
const getResolvedTheme = (theme: Theme): "light" | "dark" => {
  return theme === "system" ? getSystemTheme() : theme;
};

// Apply theme class to <html>
const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
};

// ---- Hook ----
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Initialize theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    const resolved = getResolvedTheme(stored);

    setTheme(stored);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      applyTheme(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Toggle between light/dark
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setResolvedTheme(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  }, [resolvedTheme]);

  // Set theme explicitly
  const setThemeMode = useCallback((newTheme: Theme) => {
    const resolved = getResolvedTheme(newTheme);
    setTheme(newTheme);
    setResolvedTheme(resolved);
    setStoredTheme(newTheme);
    applyTheme(resolved);
  }, []);

  return {
    theme,          // "light" | "dark" | "system"
    resolvedTheme,  // actual resolved "light" | "dark"
    toggleTheme,    // toggle between light/dark
    setTheme: setThemeMode,
  };
}
