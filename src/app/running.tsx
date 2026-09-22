import { router } from "expo-router";
import { useRef, useState } from "react";

import {
    Animated,
    Easing,
    Keyboard,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from "react-native";

import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

export default function RunningScreen() {
  const { addRun, level, xpInCurrentLevel, xpNeededForNextLevel } = useApp();

  const { theme } = useTheme();

  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  const [showReward, setShowReward] = useState(false);

  const [earnedXP, setEarnedXP] = useState(0);

  const [isSaving, setIsSaving] = useState(false);

  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const cardScale = useRef(new Animated.Value(0.85)).current;

  const xpScale = useRef(new Animated.Value(0.5)).current;

  const progressAnimation = useRef(new Animated.Value(0)).current;

  const distanceNumber = parseFloat(distance.replace(",", ".")) || 0;

  const timeNumber = parseInt(time, 10) || 0;

  const calculatedXP =
    Math.round(distanceNumber * 10) + Math.floor(timeNumber / 5);

  const xpAfterRun = xpInCurrentLevel + earnedXP;

  const levelsGained = Math.floor(xpAfterRun / xpNeededForNextLevel);

  const rewardLevel = level + levelsGained;

  const rewardLevelXP = xpAfterRun % xpNeededForNextLevel;

  const rewardXPRemaining =
    rewardLevelXP === 0 && xpAfterRun > 0
      ? xpNeededForNextLevel
      : xpNeededForNextLevel - rewardLevelXP;

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, xpNeededForNextLevel],

    outputRange: ["0%", "100%"],

    extrapolate: "clamp",
  });

  function completeRun() {
    Keyboard.dismiss();

    if (distanceNumber <= 0 && timeNumber <= 0) {
      return;
    }

    if (showReward) {
      return;
    }

    setEarnedXP(calculatedXP);
    setShowReward(true);

    overlayOpacity.setValue(0);
    cardScale.setValue(0.85);
    xpScale.setValue(0.5);

    progressAnimation.setValue(xpInCurrentLevel);

    const finalProgress =
      (xpInCurrentLevel + calculatedXP) % xpNeededForNextLevel;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.spring(cardScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),

      Animated.spring(xpScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),

      Animated.timing(progressAnimation, {
        toValue: finalProgress,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }

  function continueToHome() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    addRun({
      distance: distanceNumber,
      time: timeNumber,
      note,
      xp: earnedXP,
    });

    setShowReward(false);

    router.replace("/");
  }

  return (
    <>
      <AppScreen>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            Keyboard.dismiss();
            router.back();
          }}
        >
          <AppText
            style={{
              color: theme.colors.primary,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            ‹ Back
          </AppText>
        </Pressable>

        <View style={styles.header}>
          <AppCard variant="alt" padding={0} style={styles.iconContainer}>
            <AppText style={styles.icon}>🏃</AppText>
          </AppCard>

          <View style={styles.headerText}>
            <AppText variant="pageTitle">Running</AppText>

            <AppText variant="secondary">Track your run</AppText>
          </View>
        </View>

        <View style={styles.inputSection}>
          <AppInput
            label="DISTANCE"
            value={distance}
            onChangeText={setDistance}
            placeholder="0.0"
            keyboardType="decimal-pad"
            unit="km"
          />

          <AppInput
            label="TIME"
            value={time}
            onChangeText={setTime}
            placeholder="0"
            keyboardType="number-pad"
            unit="minutes"
          />

          <AppInput
            label="NOTE"
            value={note}
            onChangeText={setNote}
            placeholder="How did the run go?"
            multiline
            maxLength={200}
          />
        </View>

        <AppCard style={styles.xpCard}>
          <View>
            <AppText variant="label">ESTIMATED REWARD</AppText>

            <AppText variant="title" style={styles.xpTitle}>
              Running XP
            </AppText>
          </View>

          <AppText variant="xp" style={styles.xpAmount}>
            +{calculatedXP} XP
          </AppText>
        </AppCard>

        <AppButton
          title="Complete Run"
          onPress={completeRun}
          disabled={distanceNumber <= 0 && timeNumber <= 0}
          style={styles.completeButton}
        />
      </AppScreen>

      <Modal
        visible={showReward}
        transparent
        animationType="none"
        onRequestClose={() => {}}
      >
        <Animated.View
          style={[
            styles.modalBackground,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.rewardCard,
              {
                backgroundColor: theme.colors.card,

                borderColor: theme.colors.border,

                transform: [
                  {
                    scale: cardScale,
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.rewardIcon,
                {
                  backgroundColor: theme.colors.cardAlt,
                },
              ]}
            >
              <AppText style={styles.rewardEmoji}>🏃</AppText>
            </View>

            <AppText variant="pageTitle" style={styles.rewardTitle}>
              RUN COMPLETE!
            </AppText>

            <AppText variant="secondary" style={styles.rewardSubtitle}>
              Nice work. Your journey continues.
            </AppText>

            <Animated.View
              style={{
                transform: [
                  {
                    scale: xpScale,
                  },
                ],
              }}
            >
              <AppText variant="xp" style={styles.bigXP}>
                +{earnedXP} XP
              </AppText>
            </Animated.View>

            <View style={styles.levelRow}>
              <AppText style={styles.levelText}>Level {rewardLevel}</AppText>

              <AppText variant="secondary">
                {rewardLevelXP} / {xpNeededForNextLevel} XP
              </AppText>
            </View>

            <View
              style={[
                styles.progressBackground,
                {
                  backgroundColor: theme.colors.secondary,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,

                    backgroundColor: theme.colors.xp,
                  },
                ]}
              />
            </View>

            <AppText variant="caption" style={styles.nextLevelText}>
              {rewardXPRemaining} XP until Level {rewardLevel + 1}
            </AppText>

            <View
              style={[
                styles.summary,
                {
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              <View style={styles.summaryItem}>
                <AppText style={styles.summaryNumber}>{distanceNumber}</AppText>

                <AppText variant="label">KM</AppText>
              </View>

              <View
                style={[
                  styles.summaryDivider,
                  {
                    backgroundColor: theme.colors.border,
                  },
                ]}
              />

              <View style={styles.summaryItem}>
                <AppText style={styles.summaryNumber}>{timeNumber}</AppText>

                <AppText variant="label">MINUTES</AppText>
              </View>

              <View
                style={[
                  styles.summaryDivider,
                  {
                    backgroundColor: theme.colors.border,
                  },
                ]}
              />

              <View style={styles.summaryItem}>
                <AppText variant="xp" style={styles.summaryNumber}>
                  +{earnedXP}
                </AppText>

                <AppText variant="label">XP</AppText>
              </View>
            </View>

            <AppButton
              title={isSaving ? "Saving..." : "Continue"}
              onPress={continueToHome}
              disabled={isSaving}
              style={styles.continueButton}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",

    marginBottom: 28,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 38,
  },

  headerText: {
    flex: 1,
  },

  iconContainer: {
    width: 64,
    height: 64,

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  icon: {
    fontSize: 34,
  },

  inputSection: {
    gap: 20,
  },

  xpCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 20,

    marginTop: 28,
  },

  xpTitle: {
    fontSize: 17,

    marginTop: 4,
  },

  xpAmount: {
    fontSize: 22,
  },

  completeButton: {
    marginTop: 20,
  },

  modalBackground: {
    flex: 1,

    backgroundColor: "rgba(5, 6, 10, 0.94)",

    justifyContent: "center",

    paddingHorizontal: 20,
  },

  rewardCard: {
    borderRadius: 30,
    borderWidth: 1,

    paddingHorizontal: 24,
    paddingVertical: 30,

    alignItems: "center",
  },

  rewardIcon: {
    width: 82,
    height: 82,

    borderRadius: 41,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },

  rewardEmoji: {
    fontSize: 42,
  },

  rewardTitle: {
    fontSize: 27,
    letterSpacing: 0.5,

    textAlign: "center",
  },

  rewardSubtitle: {
    marginTop: 7,

    textAlign: "center",
  },

  bigXP: {
    fontSize: 44,

    marginTop: 26,
    marginBottom: 28,
  },

  levelRow: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  levelText: {
    fontSize: 15,
    fontWeight: "800",
  },

  progressBackground: {
    width: "100%",
    height: 12,

    borderRadius: 20,

    overflow: "hidden",

    marginTop: 12,
  },

  progressFill: {
    height: "100%",

    borderRadius: 20,
  },

  nextLevelText: {
    alignSelf: "flex-start",

    marginTop: 9,
  },

  summary: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    borderRadius: 20,

    paddingVertical: 18,

    marginTop: 26,
  },

  summaryItem: {
    flex: 1,

    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 20,
    fontWeight: "800",
  },

  summaryDivider: {
    width: 1,
    height: 32,
  },

  continueButton: {
    width: "100%",

    marginTop: 24,
  },
});
