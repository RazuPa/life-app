import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AppTheme,
  defaultTheme,
  ThemeName,
  themes,
} from "../theme/themes";

// ============================================================
// STORAGE
// ============================================================

const THEME_STORAGE_KEY = "life-app-theme";

// ============================================================
// TYPES
// ============================================================

type ThemeContextType = {
  theme: AppTheme;
  themeName: ThemeName;

  setTheme: (
    themeName: ThemeName
  ) => Promise<void>;
};

// ============================================================
// CONTEXT
// ============================================================

const ThemeContext =
  createContext<
    ThemeContextType | undefined
  >(undefined);

// ============================================================
// HELPERS
// ============================================================

function isThemeName(
  value: string
): value is ThemeName {
  return (
    value === "nature" ||
    value === "dungeon" ||
    value === "future"
  );
}

/*
 * Converts themes from the old version of the app
 * into the new theme system.
 *
 * Old:
 * nature
 * dark
 * game
 *
 * New:
 * nature
 * dungeon
 * future
 */
function migrateTheme(
  value: string | null
): ThemeName {
  if (!value) {
    return defaultTheme;
  }

  // Already valid.
  if (isThemeName(value)) {
    return value;
  }

  // ----------------------------------------------------------
  // OLD THEME MIGRATION
  // ----------------------------------------------------------

  if (value === "dark") {
    return "future";
  }

  if (value === "game") {
    return "dungeon";
  }

  // Unknown / corrupted value.
  return defaultTheme;
}

// ============================================================
// PROVIDER
// ============================================================

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    themeName,
    setThemeName,
  ] = useState<ThemeName>(
    defaultTheme
  );

  // ==========================================================
  // LOAD SAVED THEME
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadTheme() {
      try {
        const savedTheme =
          await AsyncStorage.getItem(
            THEME_STORAGE_KEY
          );

        const migratedTheme =
          migrateTheme(savedTheme);

        if (!mounted) {
          return;
        }

        setThemeName(
          migratedTheme
        );

        /*
         * Rewrite storage if an old or invalid
         * theme value was found.
         */
        if (
          savedTheme !==
          migratedTheme
        ) {
          await AsyncStorage.setItem(
            THEME_STORAGE_KEY,
            migratedTheme
          );
        }
      } catch (error) {
        console.warn(
          "Could not load theme:",
          error
        );

        if (mounted) {
          setThemeName(
            defaultTheme
          );
        }
      }
    }

    loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // CHANGE THEME
  // ==========================================================

  async function setTheme(
    newThemeName: ThemeName
  ) {
    /*
     * Defensive check.
     *
     * TypeScript protects us during development,
     * but this also protects against unexpected
     * runtime values.
     */
    const safeTheme =
      themes[newThemeName]
        ? newThemeName
        : defaultTheme;

    setThemeName(safeTheme);

    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        safeTheme
      );
    } catch (error) {
      console.warn(
        "Could not save theme:",
        error
      );
    }
  }

  // ==========================================================
  // CURRENT THEME
  // ==========================================================

  /*
   * The fallback is important.
   *
   * theme must NEVER be undefined because every
   * screen expects:
   *
   * theme.colors.background
   * theme.colors.card
   * theme.colors.primary
   * etc.
   */
  const theme =
    themes[themeName] ??
    themes[defaultTheme];

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value =
    useMemo<ThemeContextType>(
      () => ({
        theme,
        themeName,
        setTheme,
      }),
      [theme, themeName]
    );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}