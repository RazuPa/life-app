import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

import type { ReactNode } from "react";

import { defaultTheme, themes } from "../theme/themes";

import type { AppTheme, ThemeName } from "../theme/themes";

type ThemeContextType = {
  themeName: ThemeName;

  theme: AppTheme;

  setTheme: (themeName: ThemeName) => void;

  isThemeLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@life_app_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);

  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isThemeLoading) {
      saveTheme(themeName);
    }
  }, [themeName, isThemeLoading]);

  async function loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme === null) {
        return;
      }

      /*
       * Support old development
       * theme names so existing
       * installations migrate
       * automatically.
       */

      if (savedTheme === "fitpulse") {
        setThemeName("nature");
        return;
      }

      if (savedTheme === "xui") {
        setThemeName("dark");
        return;
      }

      if (savedTheme === "raha") {
        setThemeName("game");
        return;
      }

      if (isThemeName(savedTheme)) {
        setThemeName(savedTheme);
      }
    } catch (error) {
      console.log("Could not load theme:", error);
    } finally {
      setIsThemeLoading(false);
    }
  }

  async function saveTheme(selectedTheme: ThemeName) {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    } catch (error) {
      console.log("Could not save theme:", error);
    }
  }

  function setTheme(selectedTheme: ThemeName) {
    setThemeName(selectedTheme);
  }

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme,
        setTheme,
        isThemeLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function isThemeName(value: string): value is ThemeName {
  return value === "nature" || value === "dark" || value === "game";
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
