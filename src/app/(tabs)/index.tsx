import { useRouter } from "expo-router";

import { StyleSheet, View } from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import ProgressBar from "../../components/ProgressBar";
import SectionHeader from "../../components/SectionHeader";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

export default function HomeScreen() {
  const router = useRouter();

  const {
    totalXP,
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    activities,
    isLoading,
  } = useApp();

  const { theme } = useTheme();

  const today = new Date();

  const todaysActivities = activities.filter(
    (activity) => activity.createdAt.toDateString() === today.toDateString(),
  );

  const todaysXP = todaysActivities.reduce(
    (total, activity) => total + activity.xp,
    0,
  );

  const xpUntilNextLevel = xpNeededForNextLevel - xpInCurrentLevel;

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="secondary">Good evening 👋</AppText>

          <AppText variant="pageTitle">Razmus</AppText>
        </View>

        <AppCard
          padding={0}
          style={styles.avatar}
          onPress={() => router.push("/profile")}
        >
          <AppText style={styles.avatarText}>👤</AppText>
        </AppCard>
      </View>

      <AppCard variant="alt" style={styles.levelCard}>
        <View style={styles.levelTop}>
          <View>
            <AppText variant="label">CURRENT LEVEL</AppText>

            <AppText style={styles.levelNumber}>{level}</AppText>
          </View>

          <View style={styles.xpRight}>
            <AppText variant="xp">{totalXP} XP</AppText>

            <AppText variant="caption">Lifetime XP</AppText>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <AppText variant="secondary">
              {xpInCurrentLevel} / {xpNeededForNextLevel} XP
            </AppText>

            <AppText variant="secondary">
              {xpUntilNextLevel} XP to Level {level + 1}
            </AppText>
          </View>

          <ProgressBar value={xpInCurrentLevel} max={xpNeededForNextLevel} />
        </View>
      </AppCard>

      <View style={styles.section}>
        <SectionHeader
          title="Today"
          actionLabel={activities.length > 0 ? "Journey" : undefined}
          onActionPress={
            activities.length > 0 ? () => router.push("/journey") : undefined
          }
        />

        <AppCard>
          <View style={styles.todayTop}>
            <View>
              <AppText variant="label">TODAY'S XP</AppText>

              <AppText variant="xp" style={styles.todayXP}>
                +{todaysXP} XP
              </AppText>
            </View>

            <View style={styles.todayCount}>
              <AppText variant="title">{todaysActivities.length}</AppText>

              <AppText variant="caption">
                {todaysActivities.length === 1 ? "activity" : "activities"}
              </AppText>
            </View>
          </View>
        </AppCard>

        <View style={styles.activityList}>
          {isLoading ? (
            <AppCard>
              <AppText variant="secondary">Loading activities...</AppText>
            </AppCard>
          ) : todaysActivities.length === 0 ? (
            <AppCard variant="alt" onPress={() => router.push("/add")}>
              <View style={styles.emptyState}>
                <AppText style={styles.emptyIcon}>⚡</AppText>

                <AppText variant="title">Start earning XP</AppText>

                <AppText variant="secondary" style={styles.emptyDescription}>
                  Track something you did today and start building your lifetime
                  progress.
                </AppText>

                <AppText
                  style={{
                    color: theme.colors.primary,
                    fontWeight: "800",
                  }}
                >
                  Add activity →
                </AppText>
              </View>
            </AppCard>
          ) : (
            todaysActivities.slice(0, 3).map((activity) => (
              <AppCard
                key={activity.id}
                onPress={() => router.push("/journey")}
              >
                <View style={styles.activityRow}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor: theme.colors.cardAlt,
                      },
                    ]}
                  >
                    <AppText style={styles.activityEmoji}>
                      {activity.icon}
                    </AppText>
                  </View>

                  <View style={styles.activityInfo}>
                    <AppText variant="title" style={styles.activityTitle}>
                      {activity.title}
                    </AppText>

                    <AppText variant="secondary">{activity.details}</AppText>
                  </View>

                  <AppText variant="xp">+{activity.xp}</AppText>
                </View>
              </AppCard>
            ))
          )}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Active goals" />

        <AppCard variant="alt" onPress={() => router.push("/goals")}>
          <View style={styles.goalRow}>
            <View style={styles.goalIcon}>
              <AppText style={styles.goalEmoji}>🎯</AppText>
            </View>

            <View style={styles.goalInfo}>
              <AppText variant="title">Your goals</AppText>

              <AppText variant="secondary">
                Create goals and turn progress into XP.
              </AppText>
            </View>

            <AppText
              style={{
                color: theme.colors.primary,
                fontWeight: "800",
              }}
            >
              →
            </AppText>
          </View>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 24,
  },

  headerText: {
    flex: 1,
  },

  avatar: {
    width: 52,
    height: 52,

    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 23,
  },

  levelCard: {
    marginBottom: 30,
  },

  levelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  levelNumber: {
    fontSize: 48,
    lineHeight: 55,
    fontWeight: "900",

    marginTop: 2,
  },

  xpRight: {
    alignItems: "flex-end",

    paddingTop: 4,
  },

  progressSection: {
    marginTop: 20,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 8,
  },

  section: {
    marginBottom: 30,
  },

  todayTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  todayXP: {
    fontSize: 25,

    marginTop: 3,
  },

  todayCount: {
    alignItems: "flex-end",
  },

  activityList: {
    gap: 10,

    marginTop: 10,
  },

  emptyState: {
    alignItems: "center",

    paddingVertical: 16,
    paddingHorizontal: 10,
  },

  emptyIcon: {
    fontSize: 30,

    marginBottom: 10,
  },

  emptyDescription: {
    textAlign: "center",

    marginTop: 6,
    marginBottom: 14,

    maxWidth: 280,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  activityIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  activityEmoji: {
    fontSize: 22,
  },

  activityInfo: {
    flex: 1,

    marginRight: 10,
  },

  activityTitle: {
    fontSize: 15,

    marginBottom: 2,
  },

  goalRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  goalIcon: {
    width: 48,
    height: 48,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  goalEmoji: {
    fontSize: 27,
  },

  goalInfo: {
    flex: 1,

    gap: 2,
  },
});
