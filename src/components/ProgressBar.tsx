import {
  StyleSheet,
  View,
} from "react-native";

import type {
  ViewStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type ProgressBarProps = {
  progress: number;
};

// ============================================================
// COMPONENT
// ============================================================

export default function ProgressBar({
  progress,
}: ProgressBarProps) {
  const {
    theme,
    themeName,
  } = useTheme();

  // Keep progress safely between 0 and 1.
  const safeProgress = Math.max(
    0,
    Math.min(progress, 1)
  );

  const percentage =
    safeProgress * 100;

  // ============================================================
  // NATURE / SERENA COASTAL
  // ============================================================

  if (themeName === "nature") {
    return (
      <View
        style={[
          styles.natureTrack,
          {
            backgroundColor:
              theme.colors.cardAlt,

            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.natureFill,
            {
              width: `${percentage}%`,
              backgroundColor:
                theme.colors.xp,
            },
          ]}
        />

        {/* Soft highlight */}

        {safeProgress > 0 && (
          <View
            pointerEvents="none"
            style={[
              styles.natureHighlight,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        )}
      </View>
    );
  }

  // ============================================================
  // DOOM DEPTHS / RETRO
  // ============================================================

  if (themeName === "dungeon") {
    return (
      <View
        style={[
          styles.doomOuter,
          {
            backgroundColor:
              theme.colors.background,

            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.doomTrack,
            {
              backgroundColor:
                theme.colors.cardAlt,
            },
          ]}
        >
          <View
            style={[
              styles.doomFill,
              {
                width: `${percentage}%`,
                backgroundColor:
                  theme.colors.xp,
              },
            ]}
          />

          {/* Retro segment lines */}

          <View
            pointerEvents="none"
            style={
              styles.segmentLayer
            }
          >
            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />

            <View
              style={
                styles.segmentLine
              }
            />
          </View>
        </View>
      </View>
    );
  }

  // ============================================================
  // FUTURE OS
  // ============================================================

  return (
    <View
      style={[
        styles.futureOuter,
        {
          borderColor:
            theme.colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.futureTrack,
          {
            backgroundColor:
              theme.colors.cardAlt,
          },
        ]}
      >
        <View
          style={[
            styles.futureFill,
            {
              width: `${percentage}%`,
              backgroundColor:
                theme.colors.xp,

              shadowColor:
                theme.colors.xp,
            },
          ]}
        >
          {/* Neon core */}

          {safeProgress > 0 && (
            <View
              style={
                styles.futureCore
              }
            />
          )}
        </View>

        {/* Small HUD markers */}

        <View
          pointerEvents="none"
          style={
            styles.futureMarkers
          }
        >
          <View
            style={[
              styles.futureMarker,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          <View
            style={[
              styles.futureMarker,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          <View
            style={[
              styles.futureMarker,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // ==========================================================
    // NATURE / SERENA COASTAL
    // ==========================================================

    natureTrack: {
      width: "100%",

      height: 10,

      borderRadius: 6,

      borderWidth: 1,

      overflow: "hidden",

      position: "relative",
    },

    natureFill: {
      height: "100%",

      borderRadius: 5,
    },

    natureHighlight: {
      position: "absolute",

      top: 1,
      left: 1,

      height: 2,

      borderRadius: 2,

      backgroundColor:
        "rgba(255,255,255,0.42)",
    },

    // ==========================================================
    // DOOM DEPTHS / RETRO
    // ==========================================================

    doomOuter: {
      width: "100%",

      height: 12,

      borderWidth: 1,

      borderRadius: 2,

      padding: 2,

      overflow: "hidden",
    },

    doomTrack: {
      flex: 1,

      position: "relative",

      overflow: "hidden",

      borderRadius: 0,
    },

    doomFill: {
      position: "absolute",

      top: 0,
      bottom: 0,
      left: 0,

      borderRadius: 0,
    },

    segmentLayer: {
      ...StyleSheet.absoluteFill,

      flexDirection: "row",

      justifyContent:
        "space-evenly",
    },

    segmentLine: {
      width: 1,

      height: "100%",

      backgroundColor:
        "rgba(0,0,0,0.38)",
    },

    // ==========================================================
    // FUTURE OS
    // ==========================================================

    futureOuter: {
      width: "100%",

      height: 11,

      borderWidth: 1,

      borderRadius: 4,

      padding: 1,

      overflow: "hidden",
    },

    futureTrack: {
      flex: 1,

      position: "relative",

      overflow: "hidden",

      borderRadius: 2,
    },

    futureFill: {
      position: "absolute",

      top: 0,
      bottom: 0,
      left: 0,

      borderRadius: 2,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      shadowOpacity: 0.75,

      shadowRadius: 5,

      elevation: 3,
    },

    futureCore: {
      position: "absolute",

      top: 1,
      bottom: 1,

      left: 1,
      right: 1,

      backgroundColor:
        "rgba(255,255,255,0.18)",

      borderRadius: 1,
    },

    futureMarkers: {
      ...StyleSheet.absoluteFill,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-evenly",
    },

    futureMarker: {
      width: 1,

      height: "55%",

      opacity: 0.75,
    },
  });