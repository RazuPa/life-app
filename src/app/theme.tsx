import { router } from "expo-router";

import { Pressable, StyleSheet, View } from "react-native";

import AppCard from "../components/AppCard";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

import { useTheme } from "../context/ThemeContext";

import { ThemeName, themes } from "../theme/themes";

const themeOptions: ThemeName[] = ["nature", "dark", "game"];

export default function ThemeScreen() {
  const { theme, themeName, setTheme } = useTheme();

  function selectTheme(selectedTheme: ThemeName) {
    setTheme(selectedTheme);
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: theme.colors.card,

              borderColor: theme.colors.border,
            },

            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <AppText style={styles.backButtonText}>‹</AppText>
        </Pressable>

        <AppText variant="title" style={styles.title}>
          Theme
        </AppText>

        <View style={styles.headerSpacer} />
      </View>

      <AppText variant="pageTitle" style={styles.heading}>
        Choose your experience
      </AppText>

      <AppText variant="subtitle" style={styles.subtitle}>
        Change how your Life app looks and feels. You can switch modes whenever
        you want.
      </AppText>

      <View style={styles.themeList}>
        {themeOptions.map((optionName) => {
          const option = themes[optionName];

          const isSelected = themeName === optionName;

          return (
            <AppCard
              key={optionName}
              onPress={() => selectTheme(optionName)}
              style={[
                styles.themeCard,

                {
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,

                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: option.colors.cardAlt,
                  },
                ]}
              >
                <AppText style={styles.themeIcon}>{option.icon}</AppText>
              </View>

              <View style={styles.themeInfo}>
                <AppText variant="title" style={styles.themeName}>
                  {option.displayName}
                </AppText>

                <AppText variant="secondary" style={styles.themeDescription}>
                  {option.description}
                </AppText>

                <View style={styles.colorPreview}>
                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: option.colors.background,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: option.colors.primary,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: option.colors.card,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: option.colors.xp,
                      },
                    ]}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.muted,
                  },
                ]}
              >
                {isSelected && (
                  <View
                    style={[
                      styles.radioInner,
                      {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                )}
              </View>
            </AppCard>
          );
        })}
      </View>

      <AppCard variant="alt" style={styles.infoCard}>
        <AppText style={styles.infoEmoji}>✨</AppText>

        <View style={styles.infoContent}>
          <AppText variant="title" style={styles.infoTitle}>
            Your progress stays the same
          </AppText>

          <AppText variant="secondary">
            Changing theme does not affect your XP, activities, levels, goals or
            history.
          </AppText>
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 34,
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 21,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  backButtonPressed: {
    opacity: 0.65,
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

  heading: {
    fontSize: 28,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,

    maxWidth: 330,
  },

  themeList: {
    gap: 14,
  },

  themeCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 17,
  },

  iconContainer: {
    width: 58,
    height: 58,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 15,
  },

  themeIcon: {
    fontSize: 29,
  },

  themeInfo: {
    flex: 1,
  },

  themeName: {
    fontSize: 17,
  },

  themeDescription: {
    marginTop: 3,
  },

  colorPreview: {
    flexDirection: "row",

    marginTop: 10,

    gap: 6,
  },

  colorDot: {
    width: 14,
    height: 14,

    borderRadius: 7,

    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.25)",
  },

  radioOuter: {
    width: 24,
    height: 24,

    borderRadius: 12,
    borderWidth: 2,

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 12,
  },

  radioInner: {
    width: 12,
    height: 12,

    borderRadius: 6,
  },

  infoCard: {
    flexDirection: "row",

    padding: 18,

    marginTop: 28,
  },

  infoEmoji: {
    fontSize: 24,

    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,

    marginBottom: 5,
  },
});
