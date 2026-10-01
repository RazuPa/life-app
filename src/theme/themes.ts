/*
 * LIFE APP THEMES
 *
 * Three visual worlds:
 *
 * Nature  = vibrant cozy forest
 * Dungeon = dark fantasy RPG
 * Future  = futuristic Life OS
 */

export type ThemeName =
  | "nature"
  | "dungeon"
  | "future";

export type AppTheme = {
  name: ThemeName;

  displayName: string;
  icon: string;
  description: string;

  colors: {
    background: string;

    card: string;
    cardAlt: string;

    primary: string;
    secondary: string;

    text: string;
    textSecondary: string;
    muted: string;

    border: string;

    xp: string;
    success: string;
    danger: string;

    input: string;
    tabBar: string;
  };
};

// ============================================================
// THEMES
// ============================================================

export const themes: Record<
  ThemeName,
  AppTheme
> = {
  // ==========================================================
  // NATURE
  //
  // Cozy forest / adventure journal.
  // Much more vibrant than the old Nature theme.
  // ==========================================================

  nature: {
    name: "nature",

    displayName: "Pocket Forest",

    icon: "🌿",

    description:
      "A vibrant cozy forest adventure",

    colors: {
      // Warm parchment-like forest background
      background: "#F2EEDB",

      // Warm cream cards
      card: "#FFF9E8",

      // Moss-tinted secondary cards
      cardAlt: "#DCE7C8",

      // Strong forest green
      primary: "#3F7D4A",

      // Warm golden accent
      secondary: "#D9A441",

      // Deep forest text
      text: "#243526",

      // Softer natural text
      textSecondary: "#5E6E59",

      // Muted moss
      muted: "#8A9682",

      // Natural borders
      border: "#C9D2B7",

      // Golden progression / XP
      xp: "#D89B2B",

      // Positive green
      success: "#4E9B59",

      // Warm red
      danger: "#C9574F",

      // Inputs
      input: "#FFFDF4",

      // Navigation
      tabBar: "#FFF9E8",
    },
  },

  // ==========================================================
  // DUNGEON
  //
  // Dark fantasy / DoomDepths-inspired atmosphere.
  //
  // Near-black stone backgrounds.
  // Blood red progression.
  // Bronze / ember secondary accents.
  // ==========================================================

  dungeon: {
    name: "dungeon",

    displayName: "Doom Depths",

    icon: "⚔️",

    description:
      "Dark fantasy forged in the depths",

    colors: {
      // Deep dungeon
      background: "#090807",

      // Stone panels
      card: "#171310",

      // Raised dungeon panels
      cardAlt: "#241B16",

      // Blood / ember red
      primary: "#C94A3D",

      // Bronze
      secondary: "#A8793B",

      // Bone white
      text: "#F1E6D2",

      // Weathered parchment
      textSecondary: "#B9A995",

      // Dark stone metadata
      muted: "#756A60",

      // Stone borders
      border: "#3A2C24",

      // XP / progression
      xp: "#E0A447",

      // Healing / completion
      success: "#739B62",

      // Damage
      danger: "#D43F3F",

      // Inputs
      input: "#14110F",

      // Navigation
      tabBar: "#110E0C",
    },
  },

  // ==========================================================
  // FUTURE
  //
  // Futuristic operating-system / cyber interface.
  //
  // Navy-black background.
  // Electric cyan.
  // Violet secondary accent.
  // ==========================================================

  future: {
    name: "future",

    displayName: "Future OS",

    icon: "🚀",

    description:
      "A futuristic interface for your life",

    colors: {
      // Deep space navy
      background: "#050A12",

      // Main glass-like panels
      card: "#0C1522",

      // Raised panels
      cardAlt: "#122235",

      // Electric cyan
      primary: "#38D9FF",

      // Neon violet
      secondary: "#8A6CFF",

      // Cold white
      text: "#ECF8FF",

      // Blue-grey
      textSecondary: "#91AABD",

      // Quiet metadata
      muted: "#536B7C",

      // Tech borders
      border: "#19364A",

      // XP / energy
      xp: "#38D9FF",

      // System success
      success: "#42E6A4",

      // Alert
      danger: "#FF5576",

      // Inputs
      input: "#09131F",

      // Navigation
      tabBar: "#07101A",
    },
  },
};

// ============================================================
// DEFAULT
// ============================================================

export const defaultTheme: ThemeName =
  "nature";