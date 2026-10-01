import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

import {
  useTheme,
} from "../context/ThemeContext";

import {
  themes,
} from "../theme/themes";

import type {
  ThemeName,
} from "../theme/themes";

// ============================================================
// OPTIONS
// ============================================================

const options: ThemeName[] = [
  "nature",
  "dungeon",
  "future",
];

// ============================================================
// SCREEN
// ============================================================

export default function ThemeScreen() {
  const {
    theme,
    themeName,
    setTheme,
  } = useTheme();

  // ============================================================
  // NAVIGATION
  // ============================================================

  function back() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/settings");
    }
  }

  function done() {
    router.replace("/profile");
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <AppScreen>
      {/* ========================================================
          HEADER
          ======================================================== */}

      <View style={styles.header}>
        <Pressable
          onPress={back}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor:
                theme.colors.card,

              borderColor:
                theme.colors.border,

              opacity:
                pressed ? 0.65 : 1,
            },
          ]}
        >
          <AppText
            style={styles.backText}
          >
            ‹
          </AppText>
        </Pressable>

        <View style={styles.headerText}>
          <AppText variant="pageTitle">
            Theme
          </AppText>

          <AppText variant="caption">
            Choose your experience
          </AppText>
        </View>

        <Pressable
          onPress={done}
          style={({ pressed }) => [
            styles.doneButton,
            {
              backgroundColor:
                theme.colors.primary,

              opacity:
                pressed ? 0.7 : 1,
            },
          ]}
        >
          <AppText
            style={[
              styles.doneText,
              {
                color:
                  theme.colors.background,
              },
            ]}
          >
            Done
          </AppText>
        </Pressable>
      </View>

      {/* ========================================================
          INTRO
          ======================================================== */}

      <View style={styles.intro}>
        <AppText
          variant="title"
          style={styles.introTitle}
        >
          Choose your world
        </AppText>

        <AppText
          variant="secondary"
          style={
            styles.introDescription
          }
        >
          Your theme changes the
          atmosphere of Life App.
          Progress, XP and history
          stay exactly the same.
        </AppText>
      </View>

      {/* ========================================================
          THEMES
          ======================================================== */}

      <View style={styles.list}>
        {options.map((name) => {
          const option =
            themes[name];

          const selected =
            name === themeName;

          return (
            <Pressable
              key={name}
              onPress={() =>
                setTheme(name)
              }
              style={({ pressed }) => [
                styles.themeCard,

                {
                  backgroundColor:
                    option.colors.card,

                  borderColor:
                    selected
                      ? option.colors
                          .primary
                      : option.colors
                          .border,

                  borderWidth:
                    selected ? 2 : 1,

                  opacity:
                    pressed
                      ? 0.78
                      : 1,
                },
              ]}
            >
              {/* ================================================
                  THEME PREVIEW
                  ================================================ */}

              <View
                style={[
                  styles.preview,
                  {
                    backgroundColor:
                      option.colors
                        .background,

                    borderColor:
                      option.colors
                        .border,
                  },
                ]}
              >
                <View
                  style={
                    styles.previewTop
                  }
                >
                  <View
                    style={[
                      styles.previewAvatar,
                      {
                        backgroundColor:
                          option.colors
                            .primary,
                      },
                    ]}
                  />

                  <View
                    style={
                      styles.previewLines
                    }
                  >
                    <View
                      style={[
                        styles.previewLineLarge,
                        {
                          backgroundColor:
                            option.colors
                              .text,
                        },
                      ]}
                    />

                    <View
                      style={[
                        styles.previewLineSmall,
                        {
                          backgroundColor:
                            option.colors
                              .muted,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.previewCard,
                    {
                      backgroundColor:
                        option.colors
                          .cardAlt,

                      borderColor:
                        option.colors
                          .border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.previewIcon,
                      {
                        backgroundColor:
                          option.colors
                            .primary,
                      },
                    ]}
                  />

                  <View
                    style={
                      styles.previewBarArea
                    }
                  >
                    <View
                      style={[
                        styles.previewBarBackground,
                        {
                          backgroundColor:
                            option.colors
                              .border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.previewBar,
                          {
                            backgroundColor:
                              option.colors
                                .xp,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* ================================================
                  THEME INFO
                  ================================================ */}

              <View
                style={styles.themeInfo}
              >
                <View
                  style={
                    styles.themeTitleRow
                  }
                >
                  <View
                    style={
                      styles.themeIdentity
                    }
                  >
                    <AppText
                      style={
                        styles.themeIcon
                      }
                    >
                      {option.icon}
                    </AppText>

                    <AppText
                      style={[
                        styles.themeName,
                        {
                          color:
                            option.colors
                              .text,
                        },
                      ]}
                    >
                      {
                        option.displayName
                      }
                    </AppText>
                  </View>

                  {/* SELECTOR */}

                  <View
                    style={[
                      styles.selector,
                      {
                        borderColor:
                          selected
                            ? option.colors
                                .primary
                            : option.colors
                                .border,
                      },
                    ]}
                  >
                    {selected && (
                      <View
                        style={[
                          styles.selectorInner,
                          {
                            backgroundColor:
                              option.colors
                                .primary,
                          },
                        ]}
                      />
                    )}
                  </View>
                </View>

                <AppText
                  style={[
                    styles.description,
                    {
                      color:
                        option.colors
                          .textSecondary,
                    },
                  ]}
                >
                  {
                    option.description
                  }
                </AppText>

                {/* ACTIVE BADGE */}

                {selected && (
                  <View
                    style={[
                      styles.activeBadge,
                      {
                        backgroundColor:
                          option.colors
                            .cardAlt,
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.activeDot,
                        {
                          color:
                            option.colors
                              .primary,
                        },
                      ]}
                    >
                      ●
                    </AppText>

                    <AppText
                      style={[
                        styles.activeText,
                        {
                          color:
                            option.colors
                              .primary,
                        },
                      ]}
                    >
                      ACTIVE
                    </AppText>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ========================================================
          FOOTER
          ======================================================== */}

      <View
        style={[
          styles.footer,
          {
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <AppText
          style={styles.footerIcon}
        >
          ✦
        </AppText>

        <AppText
          variant="caption"
          style={styles.footerText}
        >
          Themes only change your
          visual experience. Your
          levels, Buddy, quests and
          history are permanent.
        </AppText>
      </View>
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // ==========================================================
    // HEADER
    // ==========================================================

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 22,
    },

    backButton: {
      width: 42,
      height: 42,

      borderRadius: 13,
      borderWidth: 1,

      justifyContent: "center",
      alignItems: "center",

      marginRight: 12,
    },

    backText: {
      fontSize: 30,
      lineHeight: 32,
      marginTop: -3,
    },

    headerText: {
      flex: 1,
    },

    doneButton: {
      minWidth: 62,
      height: 36,

      borderRadius: 10,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 12,
      marginLeft: 10,
    },

    doneText: {
      fontSize: 12,
      lineHeight: 15,
      fontWeight: "900",
    },

    // ==========================================================
    // INTRO
    // ==========================================================

    intro: {
      marginBottom: 17,
    },

    introTitle: {
      fontSize: 18,
      lineHeight: 22,
    },

    introDescription: {
      marginTop: 4,
      maxWidth: 330,
    },

    // ==========================================================
    // LIST
    // ==========================================================

    list: {
      gap: 10,
    },

    // ==========================================================
    // THEME CARD
    // ==========================================================

    themeCard: {
      minHeight: 132,

      borderRadius: 16,

      flexDirection: "row",
      alignItems: "center",

      padding: 12,
    },

    // ==========================================================
    // PREVIEW
    // ==========================================================

    preview: {
      width: 104,
      height: 104,

      borderRadius: 13,
      borderWidth: 1,

      padding: 9,

      justifyContent:
        "space-between",

      marginRight: 13,
    },

    previewTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    previewAvatar: {
      width: 21,
      height: 21,

      borderRadius: 7,

      marginRight: 7,
    },

    previewLines: {
      flex: 1,
      gap: 4,
    },

    previewLineLarge: {
      width: "70%",
      height: 5,

      borderRadius: 3,

      opacity: 0.8,
    },

    previewLineSmall: {
      width: "48%",
      height: 4,

      borderRadius: 2,

      opacity: 0.65,
    },

    previewCard: {
      height: 48,

      borderRadius: 8,
      borderWidth: 1,

      paddingHorizontal: 7,

      flexDirection: "row",
      alignItems: "center",
    },

    previewIcon: {
      width: 17,
      height: 17,

      borderRadius: 5,

      marginRight: 6,
    },

    previewBarArea: {
      flex: 1,
    },

    previewBarBackground: {
      width: "100%",
      height: 5,

      borderRadius: 3,

      overflow: "hidden",
    },

    previewBar: {
      width: "68%",
      height: "100%",

      borderRadius: 3,
    },

    // ==========================================================
    // THEME INFO
    // ==========================================================

    themeInfo: {
      flex: 1,
      minWidth: 0,
    },

    themeTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    themeIdentity: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    themeIcon: {
      fontSize: 18,
      marginRight: 7,
    },

    themeName: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: "900",
    },

    description: {
      fontSize: 11,
      lineHeight: 15,

      marginTop: 5,
      paddingRight: 4,
    },

    // ==========================================================
    // SELECTOR
    // ==========================================================

    selector: {
      width: 20,
      height: 20,

      borderRadius: 10,
      borderWidth: 2,

      alignItems: "center",
      justifyContent: "center",

      marginLeft: 8,
    },

    selectorInner: {
      width: 10,
      height: 10,

      borderRadius: 5,
    },

    // ==========================================================
    // ACTIVE
    // ==========================================================

    activeBadge: {
      alignSelf: "flex-start",

      flexDirection: "row",
      alignItems: "center",

      borderRadius: 6,

      paddingHorizontal: 6,
      paddingVertical: 3,

      marginTop: 8,
    },

    activeDot: {
      fontSize: 7,
      marginRight: 4,
    },

    activeText: {
      fontSize: 8,
      lineHeight: 10,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    // ==========================================================
    // FOOTER
    // ==========================================================

    footer: {
      flexDirection: "row",
      alignItems: "flex-start",

      borderTopWidth:
        StyleSheet.hairlineWidth,

      marginTop: 20,
      paddingTop: 14,
    },

    footerIcon: {
      fontSize: 13,
      marginRight: 8,
    },

    footerText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 15,
    },
  });