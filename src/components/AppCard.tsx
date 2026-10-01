import type { ReactNode } from "react";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  StyleProp,
  ViewStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type CardVariant =
  | "default"
  | "alt"
  | "flat";

type AppCardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  disabled?: boolean;
  variant?: CardVariant;
};

// ============================================================
// COMPONENT
// ============================================================

export default function AppCard({
  children,
  onPress,
  style,
  padding = 14,
  disabled = false,
  variant = "default",
}: AppCardProps) {
  const {
    theme,
    themeName,
  } = useTheme();

  // ==========================================================
  // BACKGROUND
  // ==========================================================

  const backgroundColor =
    variant === "alt"
      ? theme.colors.cardAlt
      : variant === "flat"
        ? "transparent"
        : theme.colors.card;

  const isFlat =
    variant === "flat";

  const isDungeon =
    themeName === "dungeon";

  const isFuture =
    themeName === "future";

  // ==========================================================
  // THEME STYLE
  // ==========================================================

  const themedStyle =
    getThemeCardStyle(
      themeName
    );

  // ==========================================================
  // BASE STYLE
  // ==========================================================

  const baseStyle: StyleProp<ViewStyle> = [
    styles.card,

    themedStyle,

    {
      backgroundColor,

      borderColor:
        isFlat
          ? "transparent"
          : theme.colors.border,

      borderWidth:
        isFlat
          ? 0
          : themedStyle.borderWidth ??
            1,
    },

    style,
  ];

  // ==========================================================
  // CONTENT
  // ==========================================================

  const content = (
    <>
      {/* ======================================================
          DOOM DEPTHS — INNER PIXEL FRAME
          ====================================================== */}

      {isDungeon &&
        !isFlat && (
          <>
            <View
              pointerEvents="none"
              style={[
                styles.dungeonInnerFrame,
                {
                  borderColor:
                    theme.colors.primary,
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.dungeonTopHighlight,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.dungeonBottomShadow,
                {
                  backgroundColor:
                    "#000000",
                },
              ]}
            />

            {/* PIXEL CORNERS */}

            <View
              pointerEvents="none"
              style={[
                styles.pixelCorner,
                styles.pixelTopLeft,
                {
                  backgroundColor:
                    theme.colors.xp,
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.pixelCorner,
                styles.pixelTopRight,
                {
                  backgroundColor:
                    theme.colors.xp,
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.pixelCorner,
                styles.pixelBottomLeft,
                {
                  backgroundColor:
                    theme.colors.xp,
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.pixelCorner,
                styles.pixelBottomRight,
                {
                  backgroundColor:
                    theme.colors.xp,
                },
              ]}
            />
          </>
        )}

      {/* ======================================================
          FUTURE OS — SPACESHIP HUD FRAME
          ====================================================== */}

      {isFuture &&
        !isFlat && (
          <>
            {/* Inner holographic frame */}

            <View
              pointerEvents="none"
              style={[
                styles.futureInnerFrame,
                {
                  borderColor:
                    theme.colors.primary,
                },
              ]}
            />

            {/* Top system line */}

            <View
              pointerEvents="none"
              style={[
                styles.futureTopLine,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
            />

            {/* Status indicator */}

            <View
              pointerEvents="none"
              style={[
                styles.futureStatusDot,
                {
                  backgroundColor:
                    theme.colors.success,
                },
              ]}
            />

            {/* Left HUD rail */}

            <View
              pointerEvents="none"
              style={[
                styles.futureLeftRail,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
            />

            {/* Bottom-right HUD corner */}

            <View
              pointerEvents="none"
              style={[
                styles.futureCornerHorizontal,
                {
                  backgroundColor:
                    theme.colors.secondary,
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.futureCornerVertical,
                {
                  backgroundColor:
                    theme.colors.secondary,
                },
              ]}
            />

            {/* Technical markers */}

            <View
              pointerEvents="none"
              style={[
                styles.futureMarkerOne,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.futureMarkerTwo,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
            />
          </>
        )}

      {/* ======================================================
          ACTUAL CARD CONTENT
          ====================================================== */}

      <View
        style={[
          styles.content,
          {
            padding,
          },
        ]}
      >
        {children}
      </View>
    </>
  );

  // ==========================================================
  // STATIC CARD
  // ==========================================================

  if (!onPress) {
    return (
      <View style={baseStyle}>
        {content}
      </View>
    );
  }

  // ==========================================================
  // PRESSABLE CARD
  // ==========================================================

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        baseStyle,

        pressed &&
          getPressedStyle(
            themeName
          ),

        disabled &&
          styles.disabled,
      ]}
    >
      {content}
    </Pressable>
  );
}

// ============================================================
// THEME CARD STYLE
// ============================================================

function getThemeCardStyle(
  themeName: string
): ViewStyle {
  switch (themeName) {
    // ========================================================
    // NATURE / SERENA COASTAL
    // ========================================================

    case "nature":
      return {
        borderRadius: 20,

        borderWidth: 1.5,

        shadowColor: "#43563B",

        shadowOffset: {
          width: 0,
          height: 3,
        },

        shadowOpacity: 0.07,

        shadowRadius: 5,

        elevation: 2,
      };

    // ========================================================
    // DOOM DEPTHS
    // ========================================================

    case "dungeon":
      return {
        borderRadius: 3,

        borderWidth: 2,

        shadowColor: "#000000",

        shadowOffset: {
          width: 4,
          height: 5,
        },

        shadowOpacity: 0.72,

        shadowRadius: 0,

        elevation: 6,
      };

    // ========================================================
    // FUTURE OS
    // ========================================================

    case "future":
      return {
        borderRadius: 6,

        borderWidth: 1,

        shadowColor: "#38D9FF",

        shadowOffset: {
          width: 0,
          height: 0,
        },

        shadowOpacity: 0.22,

        shadowRadius: 10,

        elevation: 3,
      };

    // ========================================================
    // FALLBACK
    // ========================================================

    default:
      return {
        borderRadius: 13,

        borderWidth: 1,
      };
  }
}

// ============================================================
// PRESS EFFECT
// ============================================================

function getPressedStyle(
  themeName: string
): ViewStyle {
  switch (themeName) {
    // ========================================================
    // NATURE / SERENA COASTAL
    // ========================================================

    case "nature":
      return {
        opacity: 0.82,

        transform: [
          {
            scale: 0.985,
          },
        ],
      };

    // ========================================================
    // DOOM DEPTHS
    // ========================================================

    case "dungeon":
      return {
        opacity: 0.76,

        transform: [
          {
            translateX: 2,
          },

          {
            translateY: 2,
          },
        ],
      };

    // ========================================================
    // FUTURE OS
    // ========================================================

    case "future":
      return {
        opacity: 0.82,

        transform: [
          {
            scale: 0.992,
          },
        ],
      };

    // ========================================================
    // FALLBACK
    // ========================================================

    default:
      return {
        opacity: 0.78,

        transform: [
          {
            scale: 0.99,
          },
        ],
      };
  }
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // ========================================================
    // CARD
    // ========================================================

    card: {
      position: "relative",

      overflow: "hidden",
    },

    // ========================================================
    // CONTENT
    // ========================================================

    content: {
      position: "relative",

      zIndex: 2,
    },

    // ========================================================
    // DOOM DEPTHS — INNER FRAME
    // ========================================================

    dungeonInnerFrame: {
      position: "absolute",

      top: 3,
      left: 3,
      right: 3,
      bottom: 3,

      borderWidth: 1,

      opacity: 0.32,

      zIndex: 1,
    },

    // ========================================================
    // DOOM DEPTHS — PIXEL HIGHLIGHT
    // ========================================================

    dungeonTopHighlight: {
      position: "absolute",

      top: 0,
      left: 7,
      right: 7,

      height: 1,

      opacity: 0.42,

      zIndex: 1,
    },

    // ========================================================
    // DOOM DEPTHS — LOWER SHADOW
    // ========================================================

    dungeonBottomShadow: {
      position: "absolute",

      left: 4,
      right: 4,
      bottom: 1,

      height: 2,

      opacity: 0.42,

      zIndex: 1,
    },

    // ========================================================
    // DOOM DEPTHS — PIXEL CORNERS
    // ========================================================

    pixelCorner: {
      position: "absolute",

      width: 4,
      height: 4,

      opacity: 0.72,

      zIndex: 3,
    },

    pixelTopLeft: {
      top: 1,
      left: 1,
    },

    pixelTopRight: {
      top: 1,
      right: 1,
    },

    pixelBottomLeft: {
      bottom: 1,
      left: 1,
    },

    pixelBottomRight: {
      bottom: 1,
      right: 1,
    },

    // ========================================================
    // FUTURE OS — INNER HUD FRAME
    // ========================================================

    futureInnerFrame: {
      position: "absolute",

      top: 3,
      left: 3,
      right: 3,
      bottom: 3,

      borderWidth: 1,

      borderRadius: 3,

      opacity: 0.12,

      zIndex: 1,
    },

    // ========================================================
    // FUTURE OS — TOP SYSTEM LINE
    // ========================================================

    futureTopLine: {
      position: "absolute",

      top: 0,
      left: 18,

      width: 52,
      height: 2,

      opacity: 0.75,

      zIndex: 3,
    },

    // ========================================================
    // FUTURE OS — STATUS LIGHT
    // ========================================================

    futureStatusDot: {
      position: "absolute",

      width: 4,
      height: 4,

      borderRadius: 2,

      top: 6,
      right: 7,

      opacity: 0.9,

      zIndex: 3,
    },

    // ========================================================
    // FUTURE OS — LEFT ENERGY RAIL
    // ========================================================

    futureLeftRail: {
      position: "absolute",

      width: 2,
      height: 20,

      top: 12,
      left: 0,

      opacity: 0.65,

      zIndex: 3,
    },

    // ========================================================
    // FUTURE OS — BOTTOM RIGHT HUD CORNER
    // ========================================================

    futureCornerHorizontal: {
      position: "absolute",

      width: 18,
      height: 1,

      right: 4,
      bottom: 4,

      opacity: 0.55,

      zIndex: 3,
    },

    futureCornerVertical: {
      position: "absolute",

      width: 1,
      height: 10,

      right: 4,
      bottom: 4,

      opacity: 0.55,

      zIndex: 3,
    },

    // ========================================================
    // FUTURE OS — TECHNICAL MARKERS
    // ========================================================

    futureMarkerOne: {
      position: "absolute",

      width: 3,
      height: 1,

      top: 7,
      left: 7,

      opacity: 0.55,

      zIndex: 3,
    },

    futureMarkerTwo: {
      position: "absolute",

      width: 7,
      height: 1,

      top: 7,
      left: 12,

      opacity: 0.28,

      zIndex: 3,
    },

    // ========================================================
    // STATES
    // ========================================================

    disabled: {
      opacity: 0.55,
    },
  });