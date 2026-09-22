import { router } from "expo-router";

import { StyleSheet, View } from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import ProgressBar from "../../components/ProgressBar";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileScreen() {
  const { totalXP, level, xpInCurrentLevel, xpNeededForNextLevel, activities } =
    useApp();

  const { theme } = useTheme();

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <View style={styles.topBarText}>
          <AppText variant="pageTitle">Profile</AppText>

          <AppText variant="secondary">Your life, your progress</AppText>
        </View>

        <AppCard
          padding={0}
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
        >
          <AppText style={styles.settingsIcon}>⚙️</AppText>
        </AppCard>
      </View>

      <AppCard style={styles.profileCard}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: theme.colors.cardAlt,

              borderColor: theme.colors.primary,
            },
          ]}
        >
          <AppText
            style={[
              styles.avatarText,
              {
                color: theme.colors.primary,
              },
            ]}
          >
            R
          </AppText>
        </View>

        <AppText variant="pageTitle" style={styles.name}>
          Razmus
        </AppText>

        <AppText
          style={[
            styles.level,
            {
              color: theme.colors.primary,
            },
          ]}
        >
          Level {level}
        </AppText>

        <ProgressBar
          value={xpInCurrentLevel}
          max={xpNeededForNextLevel}
          height={10}
          style={styles.progressBar}
        />

        <View style={styles.progressInfo}>
          <AppText variant="caption">{xpInCurrentLevel} XP</AppText>

          <AppText variant="caption">{xpNeededForNextLevel} XP</AppText>
        </View>
      </AppCard>

      <AppText variant="label" style={styles.sectionLabel}>
        LIFETIME
      </AppText>

      <View style={styles.statsRow}>
        <AppCard style={styles.statCard}>
          <AppText style={styles.statEmoji}>✨</AppText>

          <AppText variant="xp" style={styles.statNumber}>
            {totalXP}
          </AppText>

          <AppText variant="caption">XP</AppText>
        </AppCard>

        <AppCard style={styles.statCard}>
          <AppText style={styles.statEmoji}>⚡</AppText>

          <AppText style={styles.statNumber}>{activities.length}</AppText>

          <AppText variant="caption">Activities</AppText>
        </AppCard>

        <AppCard style={styles.statCard}>
          <AppText style={styles.statEmoji}>🏆</AppText>

          <AppText style={styles.statNumber}>0</AppText>

          <AppText variant="caption">Awards</AppText>
        </AppCard>
      </View>

      <AppText variant="label" style={styles.journeyLabel}>
        YOUR JOURNEY
      </AppText>

      <AppCard onPress={() => router.push("/journey")} style={styles.menuCard}>
        <View
          style={[
            styles.menuIconContainer,
            {
              backgroundColor: theme.colors.cardAlt,
            },
          ]}
        >
          <AppText style={styles.menuIcon}>📖</AppText>
        </View>

        <View style={styles.menuContent}>
          <AppText variant="title" style={styles.menuTitle}>
            Activity history
          </AppText>

          <AppText variant="secondary">See everything you've done</AppText>
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

      <AppCard style={styles.companionCard}>
        <View
          style={[
            styles.companionIcon,
            {
              backgroundColor: theme.colors.cardAlt,
            },
          ]}
        >
          <AppText style={styles.companionEmoji}>✨</AppText>
        </View>

        <View style={styles.companionContent}>
          <AppText variant="title" style={styles.companionTitle}>
            Life Companion
          </AppText>

          <AppText variant="secondary">
            Your companion will grow with your real-life journey.
          </AppText>
        </View>

        <View
          style={[
            styles.comingSoonBadge,
            {
              backgroundColor: theme.colors.cardAlt,
            },
          ]}
        >
          <AppText
            style={[
              styles.comingSoonText,
              {
                color: theme.colors.primary,
              },
            ]}
          >
            SOON
          </AppText>
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 28,
  },

  topBarText: {
    flex: 1,
  },

  settingsButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    justifyContent: "center",
    alignItems: "center",
  },

  settingsIcon: {
    fontSize: 21,
  },

  profileCard: {
    paddingHorizontal: 22,
    paddingVertical: 26,

    alignItems: "center",

    marginBottom: 30,
  },

  avatar: {
    width: 82,
    height: 82,

    borderRadius: 41,
    borderWidth: 2,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 14,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: "900",
  },

  name: {
    fontSize: 24,
  },

  level: {
    fontSize: 14,
    fontWeight: "800",

    marginTop: 5,
  },

  progressBar: {
    marginTop: 22,
  },

  progressInfo: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: 8,
  },

  sectionLabel: {
    marginBottom: 11,
  },

  statsRow: {
    flexDirection: "row",

    gap: 10,
  },

  statCard: {
    flex: 1,

    paddingHorizontal: 5,
    paddingVertical: 17,

    alignItems: "center",
  },

  statEmoji: {
    fontSize: 20,

    marginBottom: 7,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "900",

    marginBottom: 3,
  },

  journeyLabel: {
    marginTop: 30,
    marginBottom: 11,
  },

  menuCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 15,

    marginBottom: 12,
  },

  menuIconContainer: {
    width: 50,
    height: 50,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  menuIcon: {
    fontSize: 24,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,

    marginBottom: 4,
  },

  chevron: {
    fontSize: 26,

    marginLeft: 8,
  },

  companionCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 15,
  },

  companionIcon: {
    width: 50,
    height: 50,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  companionEmoji: {
    fontSize: 24,
  },

  companionContent: {
    flex: 1,
  },

  companionTitle: {
    fontSize: 15,

    marginBottom: 4,
  },

  comingSoonBadge: {
    borderRadius: 9,

    paddingHorizontal: 8,
    paddingVertical: 5,

    marginLeft: 8,
  },

  comingSoonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
});
