import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import ProgressBar from "../../components/ProgressBar";

import { Goal, useApp } from "../../context/AppContext";

import { useTheme } from "../../context/ThemeContext";

export default function GoalsScreen() {
  const { goals, deleteGoal, isLoading } = useApp();

  const { theme } = useTheme();

  function handleDeleteGoal(goal: Goal) {
    Alert.alert(
      "Delete goal?",
      `Are you sure you want to delete "${goal.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteGoal(goal.id);
          },
        },
      ],
    );
  }

  function getProgress(goal: Goal) {
    if (goal.target <= 0) {
      return 0;
    }

    return Math.min(goal.current / goal.target, 1);
  }

  function getPercentage(goal: Goal) {
    return Math.round(getProgress(goal) * 100);
  }

  function formatNumber(value: number) {
    if (Number.isInteger(value)) {
      return value.toString();
    }

    return value.toFixed(1).replace(/\.0$/, "");
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (isLoading) {
    return (
      <AppScreen>
        <AppText variant="pageTitle">Goals</AppText>

        <AppText variant="secondary" style={styles.subtitle}>
          Loading your goals...
        </AppText>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="pageTitle">Goals</AppText>

          <AppText variant="secondary" style={styles.subtitle}>
            Turn your real-life progress into something you can see.
          </AppText>
        </View>

        {goals.length > 0 && (
          <Pressable
            onPress={() => router.push("/create-goal")}
            style={({ pressed }) => [
              styles.addGoalButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <AppText style={styles.addGoalButtonText}>+ Goal</AppText>
          </Pressable>
        )}
      </View>

      {goals.length === 0 ? (
        <AppCard style={styles.emptyCard}>
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor: theme.colors.cardAlt,
              },
            ]}
          >
            <AppText style={styles.emptyIconText}>🎯</AppText>
          </View>

          <AppText variant="title" style={styles.emptyTitle}>
            Create your first goal
          </AppText>

          <AppText variant="secondary" style={styles.emptyDescription}>
            Set a target and your activities will automatically move you closer
            to it.
          </AppText>

          <Pressable
            onPress={() => router.push("/create-goal")}
            style={({ pressed }) => [
              styles.createButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <AppText style={styles.createButtonText}>Create Goal</AppText>
          </Pressable>
        </AppCard>
      ) : (
        <View style={styles.goalList}>
          {goals.map((goal) => {
            const progress = getProgress(goal);

            const percentage = getPercentage(goal);

            const isCompleted = goal.current >= goal.target;

            return (
              <AppCard key={goal.id} style={styles.goalCard}>
                <View style={styles.goalTopRow}>
                  <View
                    style={[
                      styles.goalIcon,
                      {
                        backgroundColor: theme.colors.cardAlt,
                      },
                    ]}
                  >
                    <AppText style={styles.goalIconText}>{goal.icon}</AppText>
                  </View>

                  <View style={styles.goalInfo}>
                    <View style={styles.titleRow}>
                      <AppText
                        variant="title"
                        style={styles.goalTitle}
                        numberOfLines={2}
                      >
                        {goal.title}
                      </AppText>

                      {isCompleted && (
                        <View
                          style={[
                            styles.completedBadge,
                            {
                              backgroundColor: theme.colors.success,
                            },
                          ]}
                        >
                          <AppText style={styles.completedText}>DONE</AppText>
                        </View>
                      )}
                    </View>

                    <AppText variant="secondary">
                      {goal.activityType === "running"
                        ? "Running"
                        : goal.activityType}
                      {" • "}
                      {goal.metric === "distance"
                        ? "Distance"
                        : goal.metric === "time"
                          ? "Time"
                          : goal.metric}
                    </AppText>
                  </View>
                </View>

                <View style={styles.progressHeader}>
                  <AppText style={styles.progressValue}>
                    {formatNumber(goal.current)} / {formatNumber(goal.target)}{" "}
                    {goal.unit}
                  </AppText>

                  <AppText variant="xp">{percentage}%</AppText>
                </View>

                <ProgressBar progress={progress} />

                <View style={styles.bottomRow}>
                  <AppText variant="caption">
                    Created {formatDate(goal.createdAt)}
                  </AppText>

                  <Pressable
                    onPress={() => handleDeleteGoal(goal)}
                    hitSlop={10}
                  >
                    {({ pressed }) => (
                      <AppText
                        style={[
                          styles.deleteText,
                          {
                            color: theme.colors.danger,
                            opacity: pressed ? 0.5 : 1,
                          },
                        ]}
                      >
                        Delete
                      </AppText>
                    )}
                  </Pressable>
                </View>
              </AppCard>
            );
          })}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },

  headerText: {
    flex: 1,
  },

  subtitle: {
    marginTop: 6,
  },

  addGoalButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  addGoalButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  emptyCard: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyIconText: {
    fontSize: 34,
  },

  emptyTitle: {
    textAlign: "center",
  },

  emptyDescription: {
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
  },

  createButton: {
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  goalList: {
    gap: 14,
  },

  goalCard: {
    padding: 18,
  },

  goalTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  goalIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  goalIconText: {
    fontSize: 27,
  },

  goalInfo: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },

  goalTitle: {
    flex: 1,
  },

  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  completedText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 9,
  },

  progressValue: {
    fontWeight: "700",
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },

  deleteText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
