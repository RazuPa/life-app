import type { ReactNode } from "react";

import {
  Platform,
  StyleSheet,
  Text,
} from "react-native";

import type {
  StyleProp,
  TextStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type Variant =
  | "pageTitle"
  | "title"
  | "subtitle"
  | "body"
  | "secondary"
  | "label"
  | "caption"
  | "xp";

// ============================================================
// COMPONENT
// ============================================================

export default function AppText({
  children,
  variant = "body",
  style,
  numberOfLines,
}: {
  children: ReactNode;
  variant?: Variant;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const {
    theme,
    themeName,
  } = useTheme();

  // ==========================================================
  // COLOR
  // ==========================================================

  const color =
    variant === "secondary" ||
    variant === "subtitle"
      ? theme.colors.textSecondary
      : variant === "label" ||
          variant === "caption"
        ? theme.colors.muted
        : variant === "xp"
          ? theme.colors.xp
          : theme.colors.text;

  // ==========================================================
  // THEME TYPOGRAPHY
  //
  // nature   = Serena Coastal
  // dungeon  = Doom Depths / Retro
  // future   = Futuristic
  // ==========================================================

  const themeTypography =
    themeName === "dungeon"
      ? getDungeonTypography(
          variant
        )
      : themeName === "future"
        ? getFutureTypography(
            variant
          )
        : getNatureTypography(
            variant
          );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Text
      numberOfLines={
        numberOfLines
      }
      style={[
        styles.base,
        styles[variant],
        themeTypography,
        {
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ============================================================
// NATURE / SERENA COASTAL TYPOGRAPHY
// ============================================================

function getNatureTypography(
  variant: Variant
): TextStyle {
  switch (variant) {
    case "pageTitle":
      return {
        letterSpacing: -0.8,
      };

    case "title":
      return {
        letterSpacing: -0.25,
      };

    case "label":
      return {
        letterSpacing: 1.5,
      };

    default:
      return {};
  }
}

// ============================================================
// DOOM DEPTHS / RETRO TYPOGRAPHY
// ============================================================

function getDungeonTypography(
  variant: Variant
): TextStyle {
  const retroFont =
    Platform.OS === "ios"
      ? "Menlo"
      : "monospace";

  switch (variant) {
    // --------------------------------------------------------
    // PAGE TITLE
    // --------------------------------------------------------

    case "pageTitle":
      return {
        fontFamily: retroFont,
        fontWeight: "900",
        letterSpacing: 1.4,
        textTransform: "uppercase",
      };

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    case "title":
      return {
        fontFamily: retroFont,
        fontWeight: "900",
        letterSpacing: 0.6,
      };

    // --------------------------------------------------------
    // SUBTITLE
    // --------------------------------------------------------

    case "subtitle":
      return {
        fontFamily: retroFont,
        fontWeight: "600",
        letterSpacing: 0.25,
      };

    // --------------------------------------------------------
    // BODY
    // --------------------------------------------------------

    case "body":
      return {
        fontFamily: retroFont,
        fontWeight: "600",
        letterSpacing: 0.15,
      };

    // --------------------------------------------------------
    // SECONDARY
    // --------------------------------------------------------

    case "secondary":
      return {
        fontFamily: retroFont,
        fontWeight: "500",
        letterSpacing: 0.15,
      };

    // --------------------------------------------------------
    // LABEL
    // --------------------------------------------------------

    case "label":
      return {
        fontFamily: retroFont,
        fontWeight: "900",
        letterSpacing: 2,
        textTransform: "uppercase",
      };

    // --------------------------------------------------------
    // CAPTION
    // --------------------------------------------------------

    case "caption":
      return {
        fontFamily: retroFont,
        fontWeight: "700",
        letterSpacing: 0.5,
      };

    // --------------------------------------------------------
    // XP / NUMBERS
    // --------------------------------------------------------

    case "xp":
      return {
        fontFamily: retroFont,
        fontWeight: "900",
        letterSpacing: 0.8,
      };

    default:
      return {};
  }
}

// ============================================================
// FUTURISTIC TYPOGRAPHY
// ============================================================

function getFutureTypography(
  variant: Variant
): TextStyle {
  switch (variant) {
    case "pageTitle":
      return {
        letterSpacing: 0.4,
      };

    case "title":
      return {
        letterSpacing: 0.15,
      };

    case "label":
      return {
        letterSpacing: 2,
        textTransform: "uppercase",
      };

    case "caption":
      return {
        letterSpacing: 0.35,
      };

    case "xp":
      return {
        letterSpacing: 0.45,
      };

    default:
      return {};
  }
}

// ============================================================
// BASE TYPOGRAPHY
// ============================================================

const styles =
  StyleSheet.create({
    base: {
      fontSize: 14,
    },

    pageTitle: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: "900",
    },

    title: {
      fontSize: 18,
      lineHeight: 23,
      fontWeight: "800",
    },

    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
    },

    body: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
    },

    secondary: {
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "500",
    },

    label: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: "800",
      textTransform: "uppercase",
    },

    caption: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "600",
    },

    xp: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: "900",
    },
  });