import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import { useApp } from "../context/AppContext";
import type { ActivityType, GoalMetric } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

/*
 * GENERIC GOAL CREATOR
 *
 * The user first chooses an activity. We then show metrics that make
 * sense for that activity. This keeps one goal system for the whole app.
 */
const activityOptions: { type: ActivityType; title: string; icon: string; metrics: GoalMetric[] }[] = [
  { type: "running", title: "Running", icon: "🏃", metrics: ["distance", "time"] },
  { type: "walking", title: "Walking", icon: "🚶", metrics: ["distance", "time"] },
  { type: "reading", title: "Reading", icon: "📚", metrics: ["pages", "time"] },
  { type: "gym", title: "Gym", icon: "🏋️", metrics: ["sessions", "time"] },
  { type: "coding", title: "Coding", icon: "💻", metrics: ["time"] },
  { type: "studying", title: "Studying", icon: "🧠", metrics: ["time"] },
];

const metricInfo: Record<GoalMetric, { title: string; unit: string }> = {
  distance: { title: "Distance", unit: "km" },
  time: { title: "Time", unit: "min" },
  pages: { title: "Pages", unit: "pages" },
  sessions: { title: "Sessions", unit: "sessions" },
  amount: { title: "Amount", unit: "" },
  custom: { title: "Custom", unit: "" },
};

export default function CreateGoalScreen() {
  const { addGoal } = useApp();
  const { theme } = useTheme();
  const [activityType, setActivityType] = useState<ActivityType>("running");
  const activity = activityOptions.find(a => a.type === activityType)!;
  const [metric, setMetric] = useState<GoalMetric>("distance");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");

  const availableMetrics = useMemo(() => activity.metrics, [activity]);
  const selectedMetric = availableMetrics.includes(metric) ? metric : availableMetrics[0];

  function chooseActivity(type: ActivityType) {
    const next = activityOptions.find(a => a.type === type)!;
    setActivityType(type);
    setMetric(next.metrics[0]);
  }

  function create() {
    const targetNumber = Number(target.replace(",", "."));
    if (!title.trim()) return Alert.alert("Goal title required", "Give your goal a name.");
    if (!Number.isFinite(targetNumber) || targetNumber <= 0) return Alert.alert("Invalid target", "Enter a target greater than 0.");

    addGoal({
      title: title.trim(), icon: activity.icon, activityType,
      metric: selectedMetric, target: targetNumber,
      unit: metricInfo[selectedMetric].unit, deadline: null,
    });
    router.replace("/goals");
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/goals")}
          style={[styles.back, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <AppText style={styles.backText}>‹</AppText>
        </Pressable>
        <AppText variant="title">Create Goal</AppText><View style={styles.spacer} />
      </View>

      <AppText variant="label" style={styles.label}>ACTIVITY</AppText>
      <View style={styles.wrap}>
        {activityOptions.map(option => (
          <AppCard key={option.type} onPress={() => chooseActivity(option.type)}
            style={[styles.choice, { borderColor: option.type === activityType ? theme.colors.primary : theme.colors.border }]}>
            <AppText style={styles.choiceEmoji}>{option.icon}</AppText>
            <AppText variant="title" style={styles.choiceText}>{option.title}</AppText>
          </AppCard>
        ))}
      </View>

      <AppText variant="label" style={styles.label}>GOAL NAME</AppText>
      <AppInput value={title} onChangeText={setTitle} placeholder={`e.g. ${activity.title} challenge`} />

      <AppText variant="label" style={styles.label}>TRACK</AppText>
      <View style={styles.metricRow}>
        {availableMetrics.map(m => (
          <AppCard key={m} onPress={() => setMetric(m)}
            style={[styles.metric, { borderColor: m === selectedMetric ? theme.colors.primary : theme.colors.border }]}>
            <AppText variant="title" style={styles.metricText}>{metricInfo[m].title}</AppText>
          </AppCard>
        ))}
      </View>

      <AppText variant="label" style={styles.label}>TARGET ({metricInfo[selectedMetric].unit.toUpperCase()})</AppText>
      <AppInput value={target} onChangeText={setTarget} placeholder="100" keyboardType="decimal-pad" />

      <AppCard variant="alt" style={styles.preview}>
        <AppText variant="label">GOAL PREVIEW</AppText>
        <AppText variant="title" style={styles.previewTitle}>{activity.icon} {title.trim() || "Your new goal"}</AppText>
        <AppText variant="secondary">{target || "0"} {metricInfo[selectedMetric].unit} • {metricInfo[selectedMetric].title}</AppText>
      </AppCard>

      <View style={styles.button}><AppButton title="Create Goal" onPress={create} /></View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 30 },
  back: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 30, lineHeight: 32, marginTop: -3 }, spacer: { width: 42 },
  label: { marginTop: 26, marginBottom: 10 }, wrap: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  choice: { width: "48%", flexDirection: "row", alignItems: "center", padding: 12 },
  choiceEmoji: { fontSize: 21, marginRight: 8 }, choiceText: { fontSize: 14 },
  metricRow: { flexDirection: "row", gap: 10 }, metric: { flex: 1, alignItems: "center" }, metricText: { fontSize: 15 },
  preview: { marginTop: 28 }, previewTitle: { marginTop: 10, marginBottom: 4 }, button: { marginTop: 24 },
});
