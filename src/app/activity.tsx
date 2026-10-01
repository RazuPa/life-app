import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useMemo,
  useState,
} from "react";

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

import {
  useApp,
} from "../context/AppContext";

import type {
  Activity,
  ActivityMetric,
  ActivityType,
  BuddyLifeStat,
} from "../context/AppContext";

import {
  useTheme,
} from "../context/ThemeContext";

import {
  getAchievements,
} from "../utils/achievements";

import type {
  Achievement,
} from "../utils/achievements";

import {
  didLevelUp,
  getProgression,
} from "../utils/progression";

// ============================================================
// TYPES
// ============================================================

type ActivityConfig = {
  title: string;
  icon: string;
  metric: ActivityMetric;
  metricLabel: string;
  unit: string;
  placeholder: string;
};

// ============================================================
// PRESET ACTIVITY CONFIGURATION
// ============================================================

const configs = {
  running: {
    title: "Running",
    icon: "🏃",
    metric: "distance",
    metricLabel: "DISTANCE",
    unit: "km",
    placeholder: "5",
  },

  walking: {
    title: "Walking",
    icon: "🚶",
    metric: "distance",
    metricLabel: "DISTANCE",
    unit: "km",
    placeholder: "5",
  },

  reading: {
    title: "Reading",
    icon: "📚",
    metric: "pages",
    metricLabel: "PAGES",
    unit: "pages",
    placeholder: "30",
  },

  gym: {
    title: "Gym",
    icon: "🏋️",
    metric: "sessions",
    metricLabel: "SESSIONS",
    unit: "sessions",
    placeholder: "1",
  },

  coding: {
    title: "Coding",
    icon: "💻",
    metric: "time",
    metricLabel: "TIME",
    unit: "min",
    placeholder: "60",
  },

  studying: {
    title: "Studying",
    icon: "🧠",
    metric: "time",
    metricLabel: "TIME",
    unit: "min",
    placeholder: "60",
  },
} satisfies Record<
  string,
  ActivityConfig
>;

type SupportedType =
  keyof typeof configs;

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

  unlockedAchievements:
    Achievement[];
};

// ============================================================
// HELPERS
// ============================================================

function getMetricLabel(
  metric: ActivityMetric
) {
  switch (metric) {
    case "distance":
      return "DISTANCE";

    case "time":
      return "TIME";

    case "pages":
      return "PAGES";

    case "sessions":
      return "SESSIONS";

    case "amount":
      return "AMOUNT";

    case "custom":
      return "AMOUNT";
  }
}

function getPlaceholder(
  metric: ActivityMetric
) {
  switch (metric) {
    case "distance":
      return "5";

    case "time":
      return "60";

    case "pages":
      return "30";

    case "sessions":
      return "1";

    case "amount":
      return "10";

    case "custom":
      return "10";
  }
}

function getDefaultUnit(
  metric: ActivityMetric
) {
  switch (metric) {
    case "distance":
      return "km";

    case "time":
      return "min";

    case "pages":
      return "pages";

    case "sessions":
      return "sessions";

    case "amount":
      return "units";

    case "custom":
      return "units";
  }
}

function isActivityMetric(
  value?: string
): value is ActivityMetric {
  return (
    value === "distance" ||
    value === "time" ||
    value === "pages" ||
    value === "sessions" ||
    value === "amount" ||
    value === "custom"
  );
}

function isBuddyLifeStat(
  value: string
): value is BuddyLifeStat {
  return (
    value === "vitality" ||
    value === "power" ||
    value === "agility" ||
    value === "intelligence"
  );
}

function parseLifeStats(
  value?: string
): BuddyLifeStat[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map(
          item =>
            item.trim()
        )
        .filter(
          isBuddyLifeStat
        )
    )
  );
}

function getLifeStatIcon(
  stat: BuddyLifeStat
) {
  switch (stat) {
    case "vitality":
      return "❤️";

    case "power":
      return "⚔️";

    case "agility":
      return "🏃";

    case "intelligence":
      return "🧠";
  }
}

function getLifeStatShortName(
  stat: BuddyLifeStat
) {
  switch (stat) {
    case "vitality":
      return "VIT";

    case "power":
      return "POW";

    case "agility":
      return "AGI";

    case "intelligence":
      return "INT";
  }
}

// ============================================================
// SCREEN
// ============================================================

export default function ActivityScreen() {
  const params =
    useLocalSearchParams<{
      type?: string;
      title?: string;
      icon?: string;
      metric?: string;
      unit?: string;
      lifeStats?: string;
    }>();

  const {
    activities,
    addActivity,
    totalXP,
  } = useApp();

  const { theme } =
    useTheme();

  const [
    value,
    setValue,
  ] = useState("");

  const [
    extraTime,
    setExtraTime,
  ] = useState("");

  const [
    note,
    setNote,
  ] = useState("");

  const [
    rewardResult,
    setRewardResult,
  ] =
    useState<RewardResult | null>(
      null
    );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  // ============================================================
  // ROUTE PARAMETERS
  // ============================================================

  const {
    type,
    title,
    icon,
    metric,
    unit,
    lifeStats,
  } = params;

  // ============================================================
  // PRESET OR CUSTOM
  // ============================================================

  const isPreset =
    Boolean(
      type &&
        type in configs
    );

  const isCustom =
    type === "custom";

  // ============================================================
  // CUSTOM LIFE STATS
  // ============================================================

  const selectedLifeStats =
    useMemo(
      () =>
        parseLifeStats(
          lifeStats
        ),
      [lifeStats]
    );

  // ============================================================
  // ACTIVITY CONFIG
  // ============================================================

  const config: ActivityConfig =
    useMemo(() => {
      if (
        isPreset &&
        type
      ) {
        return configs[
          type as SupportedType
        ];
      }

      if (isCustom) {
        const customMetric:
          ActivityMetric =
          isActivityMetric(
            metric
          )
            ? metric
            : "time";

        return {
          title:
            title?.trim() ||
            "Custom Activity",

          icon:
            icon?.trim() ||
            "⭐",

          metric:
            customMetric,

          metricLabel:
            getMetricLabel(
              customMetric
            ),

          unit:
            unit?.trim() ||
            getDefaultUnit(
              customMetric
            ),

          placeholder:
            getPlaceholder(
              customMetric
            ),
        };
      }

      return {
        title:
          "Custom Activity",

        icon:
          "⭐",

        metric:
          "time",

        metricLabel:
          "TIME",

        unit:
          "min",

        placeholder:
          "60",
      };
    }, [
      icon,
      isCustom,
      isPreset,
      metric,
      title,
      type,
      unit,
    ]);

  // ============================================================
  // TYPE USED FOR STORAGE
  // ============================================================

  const storedActivityType:
    ActivityType =
    isPreset
      ? (type as ActivityType)
      : "custom";

  // ============================================================
  // INPUT VALUES
  // ============================================================

  const numericValue =
    Number(
      value.replace(
        ",",
        "."
      )
    ) || 0;

  const timeValue =
    Number(
      extraTime.replace(
        ",",
        "."
      )
    ) || 0;

  // ============================================================
  // XP REWARD
  // ============================================================

  const earnedXP =
    useMemo(() => {
      if (
        config.metric ===
        "distance"
      ) {
        return Math.round(
          numericValue * 10 +
            timeValue * 0.5
        );
      }

      if (
        config.metric ===
        "pages"
      ) {
        return Math.round(
          numericValue +
            timeValue * 0.25
        );
      }

      if (
        config.metric ===
        "sessions"
      ) {
        return Math.round(
          numericValue * 40 +
            timeValue * 0.5
        );
      }

      if (
        config.metric ===
        "time"
      ) {
        return Math.round(
          numericValue * 0.75
        );
      }

      /*
       * Generic amount/custom values
       * use a slower square-root XP
       * curve.
       *
       * This prevents large arbitrary
       * numbers such as money from
       * producing enormous XP.
       */

      return Math.round(
        Math.sqrt(
          Math.max(
            0,
            numericValue
          )
        ) *
          10 +
          timeValue * 0.25
      );
    }, [
      numericValue,
      timeValue,
      config.metric,
    ]);

  // ============================================================
  // CURRENT ACTIVITY XP
  // ============================================================

  const currentActivityXP =
    useMemo(() => {
      const normalizedTitle =
        config.title
          .trim()
          .toLowerCase();

      return activities
        .filter(
          activity =>
            activity.title
              .trim()
              .toLowerCase() ===
            normalizedTitle
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
    }, [
      activities,
      config.title,
    ]);

  const currentActivityProgression =
    getProgression(
      currentActivityXP
    );

  // ============================================================
  // SAVE
  // ============================================================

  function save() {
    if (isSaving) {
      return;
    }

    if (
      numericValue <= 0
    ) {
      Alert.alert(
        "Invalid value",
        `Enter a ${config.metricLabel.toLowerCase()} value greater than 0.`
      );

      return;
    }

    if (
      isCustom &&
      selectedLifeStats.length ===
        0
    ) {
      Alert.alert(
        "Life Stats missing",
        "Go back and choose at least one Life Stat for this activity."
      );

      return;
    }

    setIsSaving(
      true
    );

    const finalXP =
      Math.max(
        1,
        earnedXP
      );

    const metricDetails =
      `${numericValue} ${config.unit}`;

    const details =
      config.metric ===
        "time" ||
      timeValue <= 0
        ? metricDetails
        : `${metricDetails} • ${timeValue} min`;

    // ==========================================================
    // ACTIVITY PROGRESSION
    // ==========================================================

    const activityXPBefore =
      currentActivityXP;

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
    // STRUCTURED METRICS
    // ==========================================================

    const distance =
      config.metric ===
      "distance"
        ? numericValue
        : undefined;

    const pages =
      config.metric ===
      "pages"
        ? numericValue
        : undefined;

    const sessions =
      config.metric ===
      "sessions"
        ? numericValue
        : undefined;

    const amount =
      config.metric ===
      "amount"
        ? numericValue
        : undefined;

    const custom =
      config.metric ===
      "custom"
        ? numericValue
        : undefined;

    const activityTime =
      config.metric ===
      "time"
        ? numericValue
        : timeValue > 0
          ? timeValue
          : undefined;

    // ==========================================================
    // NEW ACTIVITY DATA
    //
    // lifeStats is stored with custom activity entries.
    // Buddy progression handles the internal stat calculation.
    // ==========================================================

    const newActivityData = {
      type:
        storedActivityType,

      icon:
        config.icon,

      title:
        config.title,

      metric:
        config.metric,

      unit:
        config.unit,

      details,

      note:
        note.trim(),

      xp:
        finalXP,

      distance,

      time:
        activityTime,

      pages,

      sessions,

      amount,

      custom,

      lifeStats:
        isCustom
          ? selectedLifeStats
          : undefined,
    };

    // ==========================================================
    // ACHIEVEMENTS BEFORE
    // ==========================================================

    const beforeAchievementSummary =
      getAchievements(
        activities,
        playerXPBefore
      );

    const unlockedBefore =
      new Set(
        beforeAchievementSummary
          .achievements
          .filter(
            achievement =>
              achievement.unlocked
          )
          .map(
            achievement =>
              achievement.id
          )
      );

    // ==========================================================
    // PROJECTED ACTIVITY
    // ==========================================================

    const projectedActivity:
      Activity = {
      id: -1,

      ...newActivityData,

      createdAt:
        new Date(),
    };

    const projectedActivities = [
      ...activities,
      projectedActivity,
    ];

    // ==========================================================
    // ACHIEVEMENTS AFTER
    // ==========================================================

    const afterAchievementSummary =
      getAchievements(
        projectedActivities,
        playerXPAfter
      );

    const newlyUnlockedAchievements =
      afterAchievementSummary
        .achievements
        .filter(
          achievement =>
            achievement.unlocked &&
            !unlockedBefore.has(
              achievement.id
            )
        );

    // ==========================================================
    // SAVE REAL ACTIVITY
    // ==========================================================

    addActivity(
      newActivityData
    );

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

      unlockedAchievements:
        newlyUnlockedAchievements,
    });

    setIsSaving(
      false
    );
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
          <View
            style={[
              styles.rewardActivityIcon,
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
                styles.rewardActivityEmoji
              }
            >
              {config.icon}
            </AppText>
          </View>

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
              styles.rewardActivityName
            }
          >
            {config.title}
          </AppText>

          {rewardResult
            .activityLeveledUp ? (
            <View
              style={[
                styles.levelUpBox,
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
                  styles.levelUpLabel,
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
                  styles.levelChangeRow
                }
              >
                <AppText
                  variant="secondary"
                  style={
                    styles.oldLevel
                  }
                >
                  LV.{" "}
                  {
                    rewardResult
                      .activityLevelBefore
                  }
                </AppText>

                <AppText
                  style={[
                    styles.levelArrow,
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
                styles.normalLevelRow
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
              {config.title.toUpperCase()}{" "}
              PROGRESS
            </AppText>

            <AnimatedXPBar
              xpBefore={
                rewardResult
                  .activityXPBefore
              }
              xpAfter={
                rewardResult
                  .activityXPAfter
              }
              unlockedAchievements={
                rewardResult
                  .unlockedAchievements
              }
            />
          </AppCard>

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
  // ACTIVITY LOGGER
  // ============================================================

  return (
    <AppScreen>
      {/* ======================================================
          HEADER
          ====================================================== */}

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
          numberOfLines={1}
          style={
            styles.headerTitle
          }
        >
          {config.icon}{" "}
          {config.title}
        </AppText>

        <View
          style={
            styles.spacer
          }
        />
      </View>

      {/* ======================================================
          CURRENT SKILL
          ====================================================== */}

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
              styles.currentSkillLevel
            }
          >
            Level{" "}
            {
              currentActivityProgression
                .level
            }
          </AppText>
        </View>

        <View
          style={
            styles.currentSkillProgress
          }
        >
          <AppText
            variant="caption"
            style={
              styles.currentSkillXP
            }
          >
            {
              currentActivityProgression
                .xpInLevel
            }{" "}
            /{" "}
            {
              currentActivityProgression
                .xpForLevel
            }{" "}
            XP
          </AppText>

          <ProgressBar
            progress={
              currentActivityProgression
                .progress
            }
          />
        </View>
      </View>

      {/* ======================================================
          REWARD PREVIEW
          ====================================================== */}

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
            +
            {Math.max(
              0,
              earnedXP
            )}{" "}
            XP
          </AppText>
        </View>
      </AppCard>

      {/* ======================================================
          TRAINED LIFE STATS
          ====================================================== */}

      {isCustom &&
        selectedLifeStats.length >
          0 && (
          <View
            style={[
              styles.trainedStats,
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
                TRAINS
              </AppText>

              <AppText
                variant="caption"
                style={
                  styles.trainedStatsSubtitle
                }
              >
                Buddy Life Stats
              </AppText>
            </View>

            <View
              style={
                styles.trainedStatList
              }
            >
              {selectedLifeStats.map(
                stat => (
                  <View
                    key={stat}
                    style={[
                      styles.trainedStat,
                      {
                        backgroundColor:
                          theme.colors
                            .cardAlt,

                        borderColor:
                          theme.colors
                            .border,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.trainedStatText
                      }
                    >
                      {getLifeStatIcon(
                        stat
                      )}{" "}
                      {getLifeStatShortName(
                        stat
                      )}
                    </AppText>
                  </View>
                )
              )}
            </View>
          </View>
        )}

      {/* ======================================================
          MAIN METRIC
          ====================================================== */}

      <AppText
        variant="label"
        style={
          styles.label
        }
      >
        {config.metricLabel}
        {config.unit
          ? ` (${config.unit})`
          : ""}
      </AppText>

      <AppInput
        value={value}
        onChangeText={
          setValue
        }
        placeholder={
          config.placeholder
        }
        keyboardType="decimal-pad"
      />

      {/* ======================================================
          OPTIONAL TIME
          ====================================================== */}

      {config.metric !==
        "time" && (
        <>
          <AppText
            variant="label"
            style={
              styles.label
            }
          >
            TIME (OPTIONAL)
          </AppText>

          <AppInput
            value={
              extraTime
            }
            onChangeText={
              setExtraTime
            }
            placeholder="30"
            keyboardType="decimal-pad"
          />
        </>
      )}

      {/* ======================================================
          NOTE
          ====================================================== */}

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

      {/* ======================================================
          SAVE
          ====================================================== */}

      <View
        style={
          styles.button
        }
      >
        <AppButton
          title={`Save ${config.title}`}
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
    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 20,
    },

    headerTitle: {
      flex: 1,
      textAlign: "center",
      marginHorizontal: 8,
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

    // --------------------------------------------------------
    // CURRENT SKILL
    // --------------------------------------------------------

    currentSkill: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth:
        StyleSheet.hairlineWidth,
      paddingBottom: 14,
      marginBottom: 14,
    },

    currentSkillLevel: {
      fontSize: 16,
      marginTop: 2,
    },

    currentSkillProgress: {
      flex: 1,
      marginLeft: 24,
    },

    currentSkillXP: {
      textAlign: "right",
      marginBottom: 5,
      fontSize: 10,
      fontWeight: "700",
    },

    // --------------------------------------------------------
    // REWARD PREVIEW
    // --------------------------------------------------------

    reward: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    rewardIcon: {
      fontSize: 24,
    },

    // --------------------------------------------------------
    // TRAINED STATS
    // --------------------------------------------------------

    trainedStats: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      gap: 12,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      paddingVertical: 13,
      marginTop: 10,
    },

    trainedStatsSubtitle: {
      marginTop: 2,
    },

    trainedStatList: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "flex-end",
      gap: 6,
    },

    trainedStat: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },

    trainedStatText: {
      fontSize: 10,
      lineHeight: 13,
      fontWeight: "800",
    },

    // --------------------------------------------------------
    // INPUTS
    // --------------------------------------------------------

    label: {
      marginTop: 22,
      marginBottom: 8,
    },

    button: {
      marginTop: 26,
    },

    // --------------------------------------------------------
    // REWARD SCREEN
    // --------------------------------------------------------

    rewardScreen: {
      flex: 1,
      alignItems: "center",
      paddingTop: 22,
    },

    rewardActivityIcon: {
      width: 72,
      height: 72,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    rewardActivityEmoji: {
      fontSize: 36,
    },

    bigXP: {
      fontSize: 32,
      lineHeight: 38,
      marginTop: 16,
      fontWeight: "900",
    },

    rewardActivityName: {
      fontSize: 18,
      marginTop: 2,
    },

    levelUpBox: {
      width: "100%",
      borderWidth: 1,
      borderRadius: 12,
      alignItems: "center",
      paddingVertical: 14,
      marginTop: 20,
    },

    levelUpLabel: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 2,
    },

    levelChangeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 7,
    },

    oldLevel: {
      fontSize: 14,
      fontWeight: "700",
    },

    levelArrow: {
      fontSize: 18,
      fontWeight: "900",
      marginHorizontal: 14,
    },

    newLevel: {
      fontSize: 20,
      fontWeight: "900",
    },

    normalLevelRow: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginTop: 22,
    },

    progressCard: {
      width: "100%",
      marginTop: 12,
    },

    progressTitle: {
      marginBottom: 9,
    },

    playerReward: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      borderTopWidth:
        StyleSheet.hairlineWidth,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      paddingVertical: 13,
      marginTop: 16,
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

    continueButton: {
      width: "100%",
      marginTop: 20,
    },
  });