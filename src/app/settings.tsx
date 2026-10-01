import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AppCard from "../components/AppCard";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

import { useTheme } from "../context/ThemeContext";

// ============================================================
// SCREEN
// ============================================================

export default function SettingsScreen() {
  const { theme } = useTheme();

  // ============================================================
  // NAVIGATION
  // ============================================================

  function back() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/profile");
    }
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
            Settings
          </AppText>

          <AppText variant="caption">
            Customize your Life App
          </AppText>
        </View>
      </View>

      {/* ========================================================
          APPEARANCE
          ======================================================== */}

      <View style={styles.section}>
        <AppText variant="label">
          APPEARANCE
        </AppText>

        <AppText
          variant="caption"
          style={styles.sectionDescription}
        >
          Change how your world
          looks and feels.
        </AppText>
      </View>

      <AppCard
        onPress={() =>
          router.push("/theme")
        }
        style={styles.settingRow}
      >
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor:
                theme.colors.cardAlt,

              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <AppText
            style={styles.icon}
          >
            🎨
          </AppText>
        </View>

        <View style={styles.flex}>
          <AppText
            variant="title"
            style={styles.settingTitle}
          >
            Theme
          </AppText>

          <View
            style={
              styles.currentTheme
            }
          >
            <AppText
              style={
                styles.themeIcon
              }
            >
              {theme.icon}
            </AppText>

            <AppText
              variant="secondary"
              style={
                styles.themeName
              }
            >
              {theme.displayName}
            </AppText>
          </View>
        </View>

        <View
          style={[
            styles.arrowBox,
            {
              backgroundColor:
                theme.colors.cardAlt,

              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <AppText
            style={[
              styles.arrow,
              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            ›
          </AppText>
        </View>
      </AppCard>

      {/* ========================================================
          GAME
          ======================================================== */}

      <View style={styles.section}>
        <AppText variant="label">
          GAME
        </AppText>

        <AppText
          variant="caption"
          style={styles.sectionDescription}
        >
          Your progression and
          companion settings.
        </AppText>
      </View>

      <View
        style={[
          styles.infoRow,
          {
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.smallIconBox,
            {
              backgroundColor:
                theme.colors.cardAlt,
            },
          ]}
        >
          <AppText
            style={
              styles.smallIcon
            }
          >
            🎮
          </AppText>
        </View>

        <View style={styles.flex}>
          <AppText variant="title">
            Game progress
          </AppText>

          <AppText
            variant="caption"
            style={styles.infoText}
          >
            Saved automatically
            on this device
          </AppText>
        </View>

        <AppText
          style={[
            styles.status,
            {
              color:
                theme.colors.xp,
            },
          ]}
        >
          ✓
        </AppText>
      </View>

      {/* ========================================================
          ABOUT
          ======================================================== */}

      <View style={styles.section}>
        <AppText variant="label">
          ABOUT
        </AppText>
      </View>

      <View
        style={[
          styles.aboutBox,
          {
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <View style={styles.aboutTop}>
          <View>
            <AppText
              variant="title"
              style={styles.appName}
            >
              Life App
            </AppText>

            <AppText variant="caption">
              Turn real life into
              progression.
            </AppText>
          </View>

          <AppText
            style={styles.appIcon}
          >
            ✦
          </AppText>
        </View>

        <View
          style={[
            styles.aboutDivider,
            {
              backgroundColor:
                theme.colors.border,
            },
          ]}
        />

        <View
          style={styles.versionRow}
        >
          <AppText variant="caption">
            VERSION
          </AppText>

          <AppText
            variant="caption"
            style={styles.versionValue}
          >
            V2 Development Build
          </AppText>
        </View>
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
      marginBottom: 26,
    },

    backButton: {
      width: 42,
      height: 42,

      borderRadius: 13,
      borderWidth: 1,

      justifyContent: "center",
      alignItems: "center",

      marginRight: 13,
    },

    backText: {
      fontSize: 30,
      lineHeight: 32,
      marginTop: -3,
    },

    headerText: {
      flex: 1,
    },

    // ==========================================================
    // SECTIONS
    // ==========================================================

    section: {
      marginTop: 20,
      marginBottom: 9,
    },

    sectionDescription: {
      marginTop: 2,
    },

    // ==========================================================
    // THEME
    // ==========================================================

    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 13,
    },

    iconBox: {
      width: 44,
      height: 44,

      borderRadius: 12,
      borderWidth: 1,

      justifyContent: "center",
      alignItems: "center",

      marginRight: 12,
    },

    icon: {
      fontSize: 22,
    },

    settingTitle: {
      fontSize: 15,
      lineHeight: 19,
    },

    currentTheme: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },

    themeIcon: {
      fontSize: 12,
      marginRight: 5,
    },

    themeName: {
      fontSize: 11,
    },

    arrowBox: {
      width: 30,
      height: 30,

      borderRadius: 9,
      borderWidth: 1,

      alignItems: "center",
      justifyContent: "center",

      marginLeft: 10,
    },

    arrow: {
      fontSize: 22,
      lineHeight: 24,
      marginTop: -2,
    },

    // ==========================================================
    // GAME
    // ==========================================================

    infoRow: {
      minHeight: 58,

      borderTopWidth:
        StyleSheet.hairlineWidth,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      flexDirection: "row",
      alignItems: "center",

      paddingVertical: 9,
    },

    smallIconBox: {
      width: 38,
      height: 38,

      borderRadius: 10,

      alignItems: "center",
      justifyContent: "center",

      marginRight: 11,
    },

    smallIcon: {
      fontSize: 19,
    },

    infoText: {
      marginTop: 2,
    },

    status: {
      fontSize: 16,
      fontWeight: "900",
      marginLeft: 10,
    },

    // ==========================================================
    // ABOUT
    // ==========================================================

    aboutBox: {
      borderWidth: 1,
      borderRadius: 14,
      padding: 14,
    },

    aboutTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    appName: {
      fontSize: 16,
      lineHeight: 20,
    },

    appIcon: {
      fontSize: 22,
    },

    aboutDivider: {
      height:
        StyleSheet.hairlineWidth,

      marginVertical: 12,
    },

    versionRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    versionValue: {
      fontWeight: "700",
    },

    // ==========================================================
    // SHARED
    // ==========================================================

    flex: {
      flex: 1,
    },
  });