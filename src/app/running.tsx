import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AnimatedXPBar from "../components/AnimatedXPBar";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import ProgressBar from "../components/ProgressBar";

import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

import {
  didLevelUp,
  getProgression,
} from "../utils/progression";

// ============================================================
// REWARD RESULT
// ============================================================

type RewardResult = {
  earnedXP: number;

  activityXPBefore: number;
  activityXPAfter: number;

  activityLevelBefore: number;
  activityLevelAfter: number;

  activityLeveledUp: boolean;

  playerXPBefore: number;
  playerXPAfter: number;

  playerLevelBefore: number;
  playerLevelAfter: number;

  playerLeveledUp: boolean;
};

// ============================================================
// SCREEN
// ============================================================

export default function RunningScreen() {
  const {
    activities,
    addRun,
    totalXP,
  } = useApp();

  const { theme } = useTheme();

  const [distance, setDistance] =
    useState("");

  const [time, setTime] =
    useState("");

  const [note, setNote] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    rewardResult,
    setRewardResult,
  ] =
    useState<RewardResult | null>(
      null
    );

  // ============================================================
  // INPUT VALUES
  // ============================================================

  const d =
    Number(
      distance.replace(",", ".")
    ) || 0;

  const t =
    Number(
      time.replace(",", ".")
    ) || 0;

  // Running XP:
  //
  // distance * 10
  // +
  // time * 0.5

  const xp = useMemo(
    () =>
      Math.max(
        0,
        Math.round(
          d * 10 +
            t * 0.5
        )
      ),
    [d, t]
  );

  // ============================================================
  // CURRENT RUNNING XP
  //
  // Running's lifetime XP is calculated from permanent history.
  // ============================================================

  const currentRunningXP =
    useMemo(() => {
      return activities
        .filter(
          (activity) =>
            activity.title
              .trim()
              .toLowerCase() ===
            "running"
        )
        .reduce(
          (
            sum,
            activity
          ) =>
            sum +
            activity.xp,
          0
        );
    }, [activities]);

  // Shared progression engine.
  const currentRunningProgression =
    getProgression(
      currentRunningXP
    );

  // ============================================================
  // SAVE RUN
  // ============================================================

  function save() {
    if (isSaving) {
      return;
    }

    if (
      d <= 0 ||
      t <= 0
    ) {
      Alert.alert(
        "Missing information",
        "Enter both distance and time."
      );

      return;
    }

    setIsSaving(true);

    const finalXP =
      Math.max(
        1,
        xp
      );

    // ==========================================================
    // RUNNING PROGRESSION
    // ==========================================================

    const activityXPBefore =
      currentRunningXP;

    const activityXPAfter =
      activityXPBefore +
      finalXP;

    const activityBefore =
      getProgression(
        activityXPBefore
      );

    const activityAfter =
      getProgression(
        activityXPAfter
      );

    const activityLeveledUp =
      didLevelUp(
        activityXPBefore,
        activityXPAfter
      );

    // ==========================================================
    // PLAYER PROGRESSION
    // ==========================================================

    const playerXPBefore =
      totalXP;

    const playerXPAfter =
      playerXPBefore +
      finalXP;

    const playerBefore =
      getProgression(
        playerXPBefore
      );

    const playerAfter =
      getProgression(
        playerXPAfter
      );

    const playerLeveledUp =
      didLevelUp(
        playerXPBefore,
        playerXPAfter
      );

    // ==========================================================
    // SAVE PERMANENT RUN
    // ==========================================================

    addRun({
      distance: d,
      time: t,
      note:
        note.trim(),
      xp:
        finalXP,
    });

    // ==========================================================
    // OPEN REWARD SCREEN
    // ==========================================================

    setRewardResult({
      earnedXP:
        finalXP,

      activityXPBefore,
      activityXPAfter,

      activityLevelBefore:
        activityBefore.level,

      activityLevelAfter:
        activityAfter.level,

      activityLeveledUp,

      playerXPBefore,
      playerXPAfter,

      playerLevelBefore:
        playerBefore.level,

      playerLevelAfter:
        playerAfter.level,

      playerLeveledUp,
    });

    setIsSaving(false);
  }

  // ============================================================
  // REWARD SCREEN
  // ============================================================

  if (rewardResult) {
    return (
      <AppScreen>
        <View
          style={
            styles.rewardScreen
          }
        >
          {/* ====================================================
              RUNNING ICON
              ==================================================== */}

          <View
            style={[
              styles.bigIcon,
              {
                backgroundColor:
                  theme.colors
                    .cardAlt,

                borderColor:
                  rewardResult
                    .activityLeveledUp
                    ? theme.colors
                        .xp
                    : theme.colors
                        .border,
              },
            ]}
          >
            <AppText
              style={
                styles.bigEmoji
              }
            >
              🏃
            </AppText>
          </View>

          {/* ====================================================
              XP REWARD
              ==================================================== */}

          <AppText
            variant="xp"
            style={
              styles.bigXP
            }
          >
            +
            {
              rewardResult.earnedXP
            }{" "}
            XP
          </AppText>

          <AppText
            variant="title"
            style={
              styles.rewardTitle
            }
          >
            Running
          </AppText>

          {/* ====================================================
              LEVEL STATUS
              ==================================================== */}

          {rewardResult
            .activityLeveledUp ? (
            <View
              style={[
                styles.levelUpCard,
                {
                  backgroundColor:
                    theme.colors
                      .cardAlt,

                  borderColor:
                    theme.colors
                      .xp,
                },
              ]}
            >
              <AppText
                style={[
                  styles.levelUpText,
                  {
                    color:
                      theme.colors
                        .xp,
                  },
                ]}
              >
                LEVEL UP!
              </AppText>

              <View
                style={
                  styles.levelChange
                }
              >
                <AppText
                  variant="secondary"
                >
                  LV.{" "}
                  {
                    rewardResult
                      .activityLevelBefore
                  }
                </AppText>

                <AppText
                  style={[
                    styles.arrow,
                    {
                      color:
                        theme.colors
                          .xp,
                    },
                  ]}
                >
                  →
                </AppText>

                <AppText
                  style={[
                    styles.newLevel,
                    {
                      color:
                        theme.colors
                          .xp,
                    },
                  ]}
                >
                  LV.{" "}
                  {
                    rewardResult
                      .activityLevelAfter
                  }
                </AppText>
              </View>
            </View>
          ) : (
            <View
              style={
                styles.normalLevel
              }
            >
              <AppText
                variant="secondary"
              >
                Activity level
              </AppText>

              <AppText
                variant="xp"
              >
                LV.{" "}
                {
                  rewardResult
                    .activityLevelAfter
                }
              </AppText>
            </View>
          )}

          {/* ====================================================
              ANIMATED RUNNING XP
              ==================================================== */}

          <AppCard
            style={
              styles.progressCard
            }
          >
            <AppText
              variant="label"
              style={
                styles.progressTitle
              }
            >
              RUNNING PROGRESS
            </AppText>

            {/*
             * AnimatedXPBar starts at the XP Running had BEFORE
             * this run, then visually awards the new XP.
             *
             * If it crosses a level:
             *
             * 480 / 500
             *      ↓
             * 500 / 500
             *      ↓
             * 🎉 LEVEL UP
             *      ↓
             * Level 2
             *      ↓
             * 0 / 500 -> remaining XP
             */}

            <AnimatedXPBar
              xpBefore={
                rewardResult
                  .activityXPBefore
              }
              xpAfter={
                rewardResult
                  .activityXPAfter
              }
            />
          </AppCard>

          {/* ====================================================
              PLAYER PROGRESS
              ==================================================== */}

          <View
            style={[
              styles.playerReward,
              {
                borderTopColor:
                  theme.colors
                    .border,

                borderBottomColor:
                  theme.colors
                    .border,
              },
            ]}
          >
            <View>
              <AppText
                variant="label"
              >
                PLAYER
              </AppText>

              <AppText
                variant="secondary"
              >
                Lifetime progression
              </AppText>
            </View>

            <View
              style={
                styles.playerRewardRight
              }
            >
              <AppText
                variant="xp"
              >
                +
                {
                  rewardResult
                    .earnedXP
                }{" "}
                XP
              </AppText>

              {rewardResult
                .playerLeveledUp ? (
                <AppText
                  style={[
                    styles.playerLevelUp,
                    {
                      color:
                        theme.colors
                          .xp,
                    },
                  ]}
                >
                  LV.{" "}
                  {
                    rewardResult
                      .playerLevelBefore
                  }{" "}
                  → LV.{" "}
                  {
                    rewardResult
                      .playerLevelAfter
                  }
                </AppText>
              ) : (
                <AppText
                  variant="caption"
                >
                  Level{" "}
                  {
                    rewardResult
                      .playerLevelAfter
                  }
                </AppText>
              )}
            </View>
          </View>

          {/* ====================================================
              RUN SUMMARY
              ==================================================== */}

          <View
            style={[
              styles.runSummary,
              {
                backgroundColor:
                  theme.colors.card,

                borderColor:
                  theme.colors
                    .border,
              },
            ]}
          >
            <View
              style={
                styles.summaryItem
              }
            >
              <AppText
                variant="caption"
              >
                DISTANCE
              </AppText>

              <AppText
                variant="title"
              >
                {d} km
              </AppText>
            </View>

            <View
              style={[
                styles.summaryDivider,
                {
                  backgroundColor:
                    theme.colors
                      .border,
                },
              ]}
            />

            <View
              style={
                styles.summaryItem
              }
            >
              <AppText
                variant="caption"
              >
                TIME
              </AppText>

              <AppText
                variant="title"
              >
                {t} min
              </AppText>
            </View>
          </View>

          {/* ====================================================
              CONTINUE
              ==================================================== */}

          <View
            style={
              styles.continueButton
            }
          >
            <AppButton
              title="Continue"
              onPress={() =>
                router.replace(
                  "/"
                )
              }
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  // ============================================================
  // RUN LOGGER
  // ============================================================

  return (
    <AppScreen>
      {/* ========================================================
          HEADER
          ======================================================== */}

      <View
        style={
          styles.header
        }
      >
        <Pressable
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace(
                  "/"
                )
          }
          style={[
            styles.back,
            {
              backgroundColor:
                theme.colors.card,

              borderColor:
                theme.colors
                  .border,
            },
          ]}
        >
          <AppText
            style={
              styles.backText
            }
          >
            ‹
          </AppText>
        </Pressable>

        <AppText
          variant="title"
        >
          🏃 Running
        </AppText>

        <View
          style={
            styles.spacer
          }
        />
      </View>

      {/* ========================================================
          CURRENT RUNNING LEVEL
          ======================================================== */}

      <View
        style={[
          styles.currentSkill,
          {
            borderBottomColor:
              theme.colors
                .border,
          },
        ]}
      >
        <View>
          <AppText
            variant="label"
          >
            CURRENT SKILL
          </AppText>

          <AppText
            variant="title"
            style={
              styles.skillLevel
            }
          >
            Running · Level{" "}
            {
              currentRunningProgression
                .level
            }
          </AppText>
        </View>

        <View
          style={
            styles.skillProgress
          }
        >
          <AppText
            variant="caption"
            style={
              styles.skillXP
            }
          >
            {
              currentRunningProgression
                .xpInLevel
            }{" "}
            /{" "}
            {
              currentRunningProgression
                .xpForLevel
            }{" "}
            XP
          </AppText>

          <ProgressBar
            progress={
              currentRunningProgression
                .progress
            }
          />
        </View>
      </View>

      {/* ========================================================
          ESTIMATED REWARD
          ======================================================== */}

      <AppCard
        variant="alt"
        style={
          styles.reward
        }
      >
        <AppText
          style={
            styles.rewardIcon
          }
        >
          ⚡
        </AppText>

        <View>
          <AppText
            variant="label"
          >
            ESTIMATED REWARD
          </AppText>

          <AppText
            variant="xp"
          >
            +{xp} XP
          </AppText>
        </View>
      </AppCard>

      {/* ========================================================
          DISTANCE
          ======================================================== */}

      <AppText
        variant="label"
        style={
          styles.label
        }
      >
        DISTANCE (KM)
      </AppText>

      <AppInput
        value={distance}
        onChangeText={
          setDistance
        }
        placeholder="5"
        keyboardType="decimal-pad"
      />

      {/* ========================================================
          TIME
          ======================================================== */}

      <AppText
        variant="label"
        style={
          styles.label
        }
      >
        TIME (MIN)
      </AppText>

      <AppInput
        value={time}
        onChangeText={
          setTime
        }
        placeholder="30"
        keyboardType="decimal-pad"
      />

      {/* ========================================================
          NOTE
          ======================================================== */}

      <AppText
        variant="label"
        style={
          styles.label
        }
      >
        NOTE (OPTIONAL)
      </AppText>

      <AppInput
        value={note}
        onChangeText={
          setNote
        }
        placeholder="How did it go?"
        multiline
      />

      {/* ========================================================
          SAVE
          ======================================================== */}

      <View
        style={
          styles.button
        }
      >
        <AppButton
          title="Save Run"
          onPress={save}
          disabled={
            isSaving
          }
        />
      </View>
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // ----------------------------------------------------------
    // LOGGER
    // ----------------------------------------------------------

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 20,
    },

    back: {
      width: 40,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    backText: {
      fontSize: 28,
      lineHeight: 30,
      marginTop: -3,
    },

    spacer: {
      width: 40,
    },

    currentSkill: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 14,
      marginBottom: 14,

      borderBottomWidth:
        StyleSheet.hairlineWidth,
    },

    skillLevel: {
      fontSize: 14,
      marginTop: 2,
    },

    skillProgress: {
      flex: 1,
      marginLeft: 20,
    },

    skillXP: {
      textAlign: "right",
      marginBottom: 5,
      fontSize: 10,
      fontWeight: "700",
    },

    reward: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    rewardIcon: {
      fontSize: 24,
    },

    label: {
      marginTop: 22,
      marginBottom: 8,
    },

    button: {
      marginTop: 26,
    },

    // ----------------------------------------------------------
    // REWARD SCREEN
    // ----------------------------------------------------------

    rewardScreen: {
      flex: 1,
      alignItems: "center",
      paddingTop: 18,
    },

    bigIcon: {
      width: 72,
      height: 72,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    bigEmoji: {
      fontSize: 36,
    },

    bigXP: {
      fontSize: 32,
      lineHeight: 38,
      fontWeight: "900",
      marginTop: 15,
    },

    rewardTitle: {
      fontSize: 18,
      marginTop: 2,
    },

    // ----------------------------------------------------------
    // LEVEL UP
    // ----------------------------------------------------------

    levelUpCard: {
      width: "100%",
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      paddingVertical: 13,
      marginTop: 18,
    },

    levelUpText: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 2,
    },

    levelChange: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },

    arrow: {
      fontSize: 18,
      fontWeight: "900",
      marginHorizontal: 14,
    },

    newLevel: {
      fontSize: 20,
      fontWeight: "900",
    },

    normalLevel: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginTop: 20,
    },

    // ----------------------------------------------------------
    // PROGRESS
    // ----------------------------------------------------------

    progressCard: {
      width: "100%",
      marginTop: 12,
    },

    progressTitle: {
      marginBottom: 9,
    },

    // ----------------------------------------------------------
    // PLAYER
    // ----------------------------------------------------------

    playerReward: {
      width: "100%",
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",

      paddingVertical: 12,
      marginTop: 14,

      borderTopWidth:
        StyleSheet.hairlineWidth,

      borderBottomWidth:
        StyleSheet.hairlineWidth,
    },

    playerRewardRight: {
      alignItems:
        "flex-end",
    },

    playerLevelUp: {
      fontSize: 11,
      fontWeight: "800",
      marginTop: 2,
    },

    // ----------------------------------------------------------
    // RUN SUMMARY
    // ----------------------------------------------------------

    runSummary: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      marginTop: 14,
      paddingVertical: 10,
    },

    summaryItem: {
      flex: 1,
      alignItems: "center",
    },

    summaryDivider: {
      width:
        StyleSheet.hairlineWidth,
      height: 30,
    },

    continueButton: {
      width: "100%",
      marginTop: 18,
    },
  });