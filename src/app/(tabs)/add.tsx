import { router } from "expo-router";

import { StyleSheet, View } from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";

import { useTheme } from "../../context/ThemeContext";

type ActivityOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: "/running";
};

const activities: ActivityOption[] = [
  {
    id: "running",
    title: "Running",
    description: "Distance & time",
    icon: "🏃",
    route: "/running",
  },
  {
    id: "reading",
    title: "Reading",
    description: "Pages & time",
    icon: "📚",
  },
  {
    id: "gym",
    title: "Gym",
    description: "Workout & time",
    icon: "🏋️",
  },
  {
    id: "coding",
    title: "Coding",
    description: "Projects & time",
    icon: "💻",
  },
  {
    id: "studying",
    title: "Studying",
    description: "Subject & time",
    icon: "🧠",
  },
  {
    id: "walking",
    title: "Walking",
    description: "Distance & time",
    icon: "🚶",
  },
];

export default function AddScreen() {
  const { theme } = useTheme();

  function handleActivityPress(activity: ActivityOption) {
    if (activity.route) {
      router.push(activity.route);
    }
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="pageTitle">Add Activity</AppText>

          <AppText variant="secondary">What did you do?</AppText>
        </View>

        <AppCard variant="alt" padding={0} style={styles.headerIcon}>
          <AppText style={styles.headerEmoji}>⚡</AppText>
        </AppCard>
      </View>

      <AppCard variant="alt" style={styles.xpInfoCard}>
        <AppText style={styles.xpInfoEmoji}>✨</AppText>

        <View style={styles.xpInfoContent}>
          <AppText variant="title" style={styles.xpInfoTitle}>
            Everything counts
          </AppText>

          <AppText variant="secondary">
            Track the things you do in real life and turn your progress into XP.
          </AppText>
        </View>
      </AppCard>

      <AppText variant="label" style={styles.sectionLabel}>
        POPULAR ACTIVITIES
      </AppText>

      <View style={styles.activityGrid}>
        {activities.map((activity) => {
          const isAvailable = activity.route !== undefined;

          return (
            <AppCard
              key={activity.id}
              padding={16}
              disabled={!isAvailable}
              onPress={
                isAvailable ? () => handleActivityPress(activity) : undefined
              }
              style={[
                styles.activityCard,
                {
                  borderColor: isAvailable
                    ? theme.colors.primary
                    : theme.colors.border,
                },
                !isAvailable && styles.unavailableCard,
              ]}
            >
              <View
                style={[
                  styles.activityIconContainer,
                  {
                    backgroundColor: theme.colors.cardAlt,
                  },
                ]}
              >
                <AppText style={styles.activityIcon}>{activity.icon}</AppText>
              </View>

              <AppText variant="title" style={styles.activityTitle}>
                {activity.title}
              </AppText>

              <AppText variant="caption" style={styles.activityDescription}>
                {activity.description}
              </AppText>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: theme.colors.cardAlt,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.badgeText,
                    {
                      color: isAvailable
                        ? theme.colors.primary
                        : theme.colors.muted,
                    },
                  ]}
                >
                  {isAvailable ? "READY" : "SOON"}
                </AppText>
              </View>
            </AppCard>
          );
        })}
      </View>

      <AppText variant="label" style={styles.customSectionLabel}>
        YOUR ACTIVITIES
      </AppText>

      <AppCard style={styles.customCard}>
        <View
          style={[
            styles.customIconContainer,
            {
              backgroundColor: theme.colors.cardAlt,
            },
          ]}
        >
          <AppText style={styles.customIcon}>＋</AppText>
        </View>

        <View style={styles.customContent}>
          <AppText variant="title" style={styles.customTitle}>
            Create custom activity
          </AppText>

          <AppText variant="caption">
            Track anything that matters to you
          </AppText>
        </View>

        <View
          style={[
            styles.badge,
            styles.customBadge,
            {
              backgroundColor: theme.colors.cardAlt,
            },
          ]}
        >
          <AppText
            style={[
              styles.badgeText,
              {
                color: theme.colors.muted,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 24,
  },

  headerText: {
    flex: 1,
  },

  headerIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  headerEmoji: {
    fontSize: 23,
  },

  xpInfoCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 16,

    marginBottom: 30,
  },

  xpInfoEmoji: {
    fontSize: 24,

    marginRight: 13,
  },

  xpInfoContent: {
    flex: 1,
  },

  xpInfoTitle: {
    fontSize: 14,

    marginBottom: 3,
  },

  sectionLabel: {
    marginBottom: 12,
  },

  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

    rowGap: 12,
  },

  activityCard: {
    width: "48.5%",
    minHeight: 178,
  },

  unavailableCard: {
    opacity: 0.72,
  },

  activityIconContainer: {
    width: 50,
    height: 50,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 15,
  },

  activityIcon: {
    fontSize: 25,
  },

  activityTitle: {
    fontSize: 16,
  },

  activityDescription: {
    marginTop: 4,
  },

  badge: {
    alignSelf: "flex-start",

    borderRadius: 8,

    paddingHorizontal: 8,
    paddingVertical: 5,

    marginTop: 13,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  customSectionLabel: {
    marginTop: 30,
    marginBottom: 12,
  },

  customCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 16,
  },

  customIconContainer: {
    width: 50,
    height: 50,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  customIcon: {
    fontSize: 28,
    fontWeight: "400",
  },

  customContent: {
    flex: 1,

    paddingRight: 8,
  },

  customTitle: {
    fontSize: 15,

    marginBottom: 4,
  },

  customBadge: {
    marginTop: 0,
  },
});
