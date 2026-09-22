import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

import {
  GoalMetric,
  useApp,
} from "../context/AppContext";

import { useTheme } from "../context/ThemeContext";

type MetricOption = {
  metric: GoalMetric;
  title: string;
  icon: string;
  unit: string;
  description: string;
};

const metricOptions: MetricOption[] = [
  {
    metric: "distance",
    title: "Distance",
    icon: "📍",
    unit: "km",
    description: "Track total kilometers",
  },
  {
    metric: "time",
    title: "Time",
    icon: "⏱️",
    unit: "min",
    description: "Track total minutes",
  },
];

export default function CreateGoalScreen() {
  const { addGoal } = useApp();
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [metric, setMetric] =
    useState<GoalMetric>("distance");

  const selectedMetric =
    metricOptions.find(
      (option) => option.metric === metric
    ) ?? metricOptions[0];

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/goals");
    }
  }

  function handleCreateGoal() {
    const targetNumber = Number(
      target.replace(",", ".")
    );

    if (title.trim().length === 0) {
      Alert.alert(
        "Goal title required",
        "Give your goal a name."
      );
      return;
    }

    if (
      !Number.isFinite(targetNumber) ||
      targetNumber <= 0
    ) {
      Alert.alert(
        "Invalid target",
        "Enter a target greater than 0."
      );
      return;
    }

    addGoal({
      title: title.trim(),
      icon: "🏃",
      activityType: "running",
      metric,
      target: targetNumber,
      unit: selectedMetric.unit,
      deadline: null,
    });

    router.replace("/goals");
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
          style={styles.headerTitle}
        >
          Create Goal
        </AppText>

        <View style={styles.headerSpacer} />
      </View>

      <AppText
        variant="label"
        style={styles.sectionLabel}
      >
        ACTIVITY
      </AppText>

      <AppCard style={styles.activityCard}>
        <View
          style={[
            styles.activityIcon,
            {
              backgroundColor:
                theme.colors.cardAlt,
            },
          ]}
        >
          <AppText
            style={styles.activityEmoji}
          >
            🏃
          </AppText>
        </View>

        <View style={styles.activityInfo}>
          <AppText variant="title">
            Running
          </AppText>

          <AppText variant="secondary">
            Running goals automatically
            update when you log a run.
          </AppText>
        </View>
      </AppCard>

      <AppText
        variant="label"
        style={styles.fieldLabel}
      >
        GOAL NAME
      </AppText>

      <AppInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Run 20 km"
      />

      <AppText
        variant="label"
        style={styles.fieldLabel}
      >
        TRACK
      </AppText>

      <View style={styles.metricList}>
        {metricOptions.map((option) => {
          const isSelected =
            metric === option.metric;

          return (
            <Pressable
              key={option.metric}
              onPress={() =>
                setMetric(option.metric)
              }
              style={({ pressed }) => [
                styles.metricCard,
                {
                  backgroundColor:
                    isSelected
                      ? theme.colors.cardAlt
                      : theme.colors.card,

                  borderColor:
                    isSelected
                      ? theme.colors.primary
                      : theme.colors.border,

                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.metricIcon,
                  {
                    backgroundColor:
                      theme.colors.cardAlt,
                  },
                ]}
              >
                <AppText
                  style={styles.metricEmoji}
                >
                  {option.icon}
                </AppText>
              </View>

              <View style={styles.metricInfo}>
                <AppText
                  variant="title"
                  style={styles.metricTitle}
                >
                  {option.title}
                </AppText>

                <AppText variant="secondary">
                  {option.description}
                </AppText>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor:
                      isSelected
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
                        backgroundColor:
                          theme.colors.primary,
                      },
                    ]}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <AppText
        variant="label"
        style={styles.fieldLabel}
      >
        TARGET
      </AppText>

      <View style={styles.targetRow}>
        <View style={styles.targetInput}>
          <AppInput
            value={target}
            onChangeText={setTarget}
            placeholder={
              metric === "distance"
                ? "20"
                : "300"
            }
            keyboardType="decimal-pad"
          />
        </View>

        <View
          style={[
            styles.unitBox,
            {
              backgroundColor:
                theme.colors.cardAlt,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <AppText
            style={styles.unitText}
          >
            {selectedMetric.unit}
          </AppText>
        </View>
      </View>

      <AppCard style={styles.previewCard}>
        <AppText
          variant="label"
          style={styles.previewLabel}
        >
          GOAL PREVIEW
        </AppText>

        <View style={styles.previewRow}>
          <AppText
            style={styles.previewEmoji}
          >
            🏃
          </AppText>

          <View style={styles.previewInfo}>
            <AppText variant="title">
              {title.trim() ||
                "Your running goal"}
            </AppText>

            <AppText variant="secondary">
              {target || "0"}{" "}
              {selectedMetric.unit} •{" "}
              {selectedMetric.title}
            </AppText>
          </View>
        </View>
      </AppCard>

      <View style={styles.createButton}>
        <AppButton
          title="Create Goal"
          onPress={handleCreateGoal}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 30,
    lineHeight: 32,
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 24,
  },

  headerSpacer: {
    width: 42,
  },

  sectionLabel: {
    marginBottom: 10,
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  activityIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  activityEmoji: {
    fontSize: 27,
  },

  activityInfo: {
    flex: 1,
    gap: 4,
  },

  fieldLabel: {
    marginTop: 28,
    marginBottom: 10,
  },

  metricList: {
    gap: 10,
  },

  metricCard: {
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  metricIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  metricEmoji: {
    fontSize: 22,
  },

  metricInfo: {
    flex: 1,
  },

  metricTitle: {
    fontSize: 16,
    marginBottom: 2,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  targetRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },

  targetInput: {
    flex: 1,
  },

  unitBox: {
    minWidth: 76,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  unitText: {
    fontSize: 16,
    fontWeight: "800",
  },

  previewCard: {
    marginTop: 28,
    padding: 18,
  },

  previewLabel: {
    marginBottom: 14,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  previewEmoji: {
    fontSize: 30,
    marginRight: 14,
  },

  previewInfo: {
    flex: 1,
    gap: 3,
  },

  createButton: {
    marginTop: 24,
  },
});