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

export default function SettingsScreen() {
  const { theme } = useTheme();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/profile");
    }
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor:
                theme.colors.card,
              borderColor:
                theme.colors.border,
              opacity: pressed ? 0.65 : 1,
            },
          ]}
        >
          <AppText
            style={styles.backButtonText}
          >
            ‹
          </AppText>
        </Pressable>

        <AppText
          variant="title"
          style={styles.title}
        >
          Settings
        </AppText>

        <View style={styles.headerSpacer} />
      </View>

      <AppText
        variant="label"
        style={styles.sectionLabel}
      >
        APPEARANCE
      </AppText>

      <AppCard
        onPress={() =>
          router.push("/theme")
        }
        style={styles.settingCard}
      >
        <View
          style={[
            styles.settingIcon,
            {
              backgroundColor:
                theme.colors.cardAlt,
            },
          ]}
        >
          <AppText
            style={styles.settingEmoji}
          >
            🎨
          </AppText>
        </View>

        <View style={styles.settingContent}>
          <AppText
            variant="title"
            style={styles.settingTitle}
          >
            Theme
          </AppText>

          <AppText variant="secondary">
            {theme.icon}{" "}
            {theme.displayName}
          </AppText>
        </View>

        <AppText
          style={[
            styles.chevron,
            {
              color: theme.colors.muted,
            },
          ]}
        >
          ›
        </AppText>
      </AppCard>

      <AppText
        variant="label"
        style={styles.accountLabel}
      >
        ACCOUNT
      </AppText>

      <AppCard style={styles.settingCard}>
        <View
          style={[
            styles.settingIcon,
            {
              backgroundColor:
                theme.colors.cardAlt,
            },
          ]}
        >
          <AppText
            style={styles.settingEmoji}
          >
            👤
          </AppText>
        </View>

        <View style={styles.settingContent}>
          <AppText
            variant="title"
            style={styles.settingTitle}
          >
            Account
          </AppText>

          <AppText variant="secondary">
            Account settings coming later
          </AppText>
        </View>

        <AppText
          style={[
            styles.chevron,
            {
              color: theme.colors.muted,
            },
          ]}
        >
          ›
        </AppText>
      </AppCard>

      <AppText
        variant="caption"
        style={styles.version}
      >
        Life App • Development Build
      </AppText>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 30,
    lineHeight: 32,
    marginTop: -3,
  },

  title: {
    fontSize: 24,
  },

  headerSpacer: {
    width: 42,
  },

  sectionLabel: {
    marginBottom: 10,
  },

  accountLabel: {
    marginTop: 30,
    marginBottom: 10,
  },

  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  settingEmoji: {
    fontSize: 23,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },

  chevron: {
    fontSize: 26,
    marginLeft: 10,
  },

  version: {
    textAlign: "center",
    marginTop: 50,
  },
});