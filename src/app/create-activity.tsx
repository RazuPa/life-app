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

import { useTheme } from "../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type MetricType =
  | "distance"
  | "time"
  | "sessions"
  | "pages"
  | "amount"
  | "custom";

type MetricOption = {
  id: MetricType;
  icon: string;
  title: string;
  description: string;
  unit: string;
};

type LifeStatType =
  | "vitality"
  | "power"
  | "agility"
  | "intelligence";

type LifeStatOption = {
  id: LifeStatType;
  icon: string;
  shortName: string;
  title: string;
  description: string;
};

// ============================================================
// OPTIONS
// ============================================================

const emojiOptions = [
  "🐎",
  "🏊",
  "🚴",
  "🥾",
  "⚽",
  "🎾",
  "🏀",
  "🧘",
  "🎸",
  "🎹",
  "🎨",
  "📷",
  "🍳",
  "🧹",
  "🌱",
  "💰",
  "🇯🇵",
  "✍️",
  "🎮",
  "⭐",
];

const metricOptions: MetricOption[] = [
  {
    id: "time",
    icon: "⏱️",
    title: "Time",
    description: "Minutes spent",
    unit: "min",
  },
  {
    id: "distance",
    icon: "📍",
    title: "Distance",
    description: "Distance travelled",
    unit: "km",
  },
  {
    id: "sessions",
    icon: "✓",
    title: "Sessions",
    description: "Times completed",
    unit: "sessions",
  },
  {
    id: "pages",
    icon: "📖",
    title: "Pages",
    description: "Pages completed",
    unit: "pages",
  },
  {
    id: "amount",
    icon: "🔢",
    title: "Amount",
    description: "A numeric amount",
    unit: "units",
  },
  {
    id: "custom",
    icon: "✦",
    title: "Custom",
    description: "Choose your own unit",
    unit: "",
  },
];

const lifeStatOptions: LifeStatOption[] = [
  {
    id: "vitality",
    icon: "❤️",
    shortName: "VIT",
    title: "Vitality",
    description:
      "Endurance, stamina and physical conditioning.",
  },
  {
    id: "power",
    icon: "⚔️",
    shortName: "POW",
    title: "Power",
    description:
      "Strength, force and physical power.",
  },
  {
    id: "agility",
    icon: "🏃",
    shortName: "AGI",
    title: "Agility",
    description:
      "Speed, movement, coordination and athletic skill.",
  },
  {
    id: "intelligence",
    icon: "🧠",
    shortName: "INT",
    title: "Intelligence",
    description:
      "Learning, knowledge, creativity and mental skill.",
  },
];

// ============================================================
// SCREEN
// ============================================================

export default function CreateActivityScreen() {
  const { theme } = useTheme();

  const [
    name,
    setName,
  ] = useState("");

  const [
    selectedEmoji,
    setSelectedEmoji,
  ] = useState(
    emojiOptions[0]
  );

  const [
    selectedMetric,
    setSelectedMetric,
  ] = useState<MetricType>(
    "time"
  );

  const [
    customUnit,
    setCustomUnit,
  ] = useState("");

  const [
    selectedLifeStats,
    setSelectedLifeStats,
  ] = useState<LifeStatType[]>(
    []
  );

  // ==========================================================
  // SELECTED METRIC
  // ==========================================================

  const metric =
    metricOptions.find(
      (option) =>
        option.id ===
        selectedMetric
    ) ??
    metricOptions[0];

  // ==========================================================
  // LIFE STATS
  // ==========================================================

  function toggleLifeStat(
    stat: LifeStatType
  ) {
    setSelectedLifeStats(
      (current) => {
        if (
          current.includes(
            stat
          )
        ) {
          return current.filter(
            (item) =>
              item !== stat
          );
        }

        return [
          ...current,
          stat,
        ];
      }
    );
  }

  // ==========================================================
  // CREATE
  // ==========================================================

  function createActivity() {
    const cleanName =
      name.trim();

    if (!cleanName) {
      Alert.alert(
        "Activity name",
        "Give your activity a name."
      );

      return;
    }

    if (
      selectedMetric ===
        "custom" &&
      !customUnit.trim()
    ) {
      Alert.alert(
        "Custom unit",
        "Enter what you want to measure."
      );

      return;
    }

    if (
      selectedLifeStats.length ===
      0
    ) {
      Alert.alert(
        "Life Stat",
        "Choose at least one Life Stat this activity should train."
      );

      return;
    }

    const unit =
      selectedMetric ===
      "custom"
        ? customUnit.trim()
        : metric.unit;

    // --------------------------------------------------------
    // Open the generic activity logger.
    //
    // lifeStats is passed as a comma-separated route value:
    //
    // vitality,power
    // agility,vitality
    // intelligence
    //
    // The logger will persist this association with the
    // activity entry in the next step.
    // --------------------------------------------------------

    router.push({
      pathname:
        "/activity",

      params: {
        type:
          "custom",

        title:
          cleanName,

        icon:
          selectedEmoji,

        metric:
          selectedMetric,

        unit,

        lifeStats:
          selectedLifeStats.join(
            ","
          ),
      },
    });
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <AppScreen
      bottomPadding={40}
    >
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
                  "/(tabs)/add"
                )
          }
          style={[
            styles.backButton,
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

        <View
          style={
            styles.headerText
          }
        >
          <AppText
            variant="pageTitle"
          >
            New Activity
          </AppText>

          <AppText
            variant="secondary"
          >
            Turn anything into a skill
          </AppText>
        </View>
      </View>

      {/* ======================================================
          PREVIEW
          ====================================================== */}

      <AppCard
        variant="alt"
        style={
          styles.preview
        }
      >
        <View
          style={[
            styles.previewIcon,
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
              styles.previewEmoji
            }
          >
            {selectedEmoji}
          </AppText>
        </View>

        <View
          style={
            styles.previewText
          }
        >
          <AppText
            variant="label"
          >
            NEW SKILL
          </AppText>

          <AppText
            variant="title"
            style={
              styles.previewTitle
            }
            numberOfLines={1}
          >
            {name.trim() ||
              "Your Activity"}
          </AppText>

          <AppText
            variant="caption"
          >
            Measure by{" "}
            {metric.title.toLowerCase()}
          </AppText>
        </View>

        <View
          style={
            styles.levelPreview
          }
        >
          <AppText
            variant="caption"
          >
            LV.
          </AppText>

          <AppText
            variant="xp"
            style={
              styles.levelPreviewNumber
            }
          >
            1
          </AppText>
        </View>
      </AppCard>

      {/* ======================================================
          NAME
          ====================================================== */}

      <AppText
        variant="label"
        style={
          styles.sectionLabel
        }
      >
        ACTIVITY NAME
      </AppText>

      <AppInput
        value={name}
        onChangeText={
          setName
        }
        placeholder="Horse Riding"
      />

      {/* ======================================================
          EMOJI
          ====================================================== */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <View>
          <AppText
            variant="label"
          >
            ICON
          </AppText>

          <AppText
            variant="caption"
            style={
              styles.sectionSubtitle
            }
          >
            Choose a symbol for
            your skill
          </AppText>
        </View>

        <AppText
          style={
            styles.selectedEmoji
          }
        >
          {selectedEmoji}
        </AppText>
      </View>

      <View
        style={
          styles.emojiGrid
        }
      >
        {emojiOptions.map(
          (emoji) => {
            const selected =
              emoji ===
              selectedEmoji;

            return (
              <Pressable
                key={emoji}
                onPress={() =>
                  setSelectedEmoji(
                    emoji
                  )
                }
                style={[
                  styles.emojiButton,
                  {
                    backgroundColor:
                      selected
                        ? theme.colors
                            .cardAlt
                        : theme.colors
                            .card,

                    borderColor:
                      selected
                        ? theme.colors
                            .xp
                        : theme.colors
                            .border,
                  },
                ]}
              >
                <AppText
                  style={
                    styles.emoji
                  }
                >
                  {emoji}
                </AppText>
              </Pressable>
            );
          }
        )}
      </View>

      {/* ======================================================
          MEASUREMENT
          ====================================================== */}

      <View
        style={
          styles.measureHeader
        }
      >
        <AppText
          variant="label"
        >
          WHAT DO YOU WANT TO TRACK?
        </AppText>

        <AppText
          variant="caption"
          style={
            styles.sectionSubtitle
          }
        >
          This becomes the main
          measurement for this
          activity.
        </AppText>
      </View>

      <View
        style={
          styles.metricList
        }
      >
        {metricOptions.map(
          (option) => {
            const selected =
              option.id ===
              selectedMetric;

            return (
              <Pressable
                key={
                  option.id
                }
                onPress={() =>
                  setSelectedMetric(
                    option.id
                  )
                }
                style={[
                  styles.metricRow,
                  {
                    backgroundColor:
                      theme.colors
                        .card,

                    borderColor:
                      selected
                        ? theme.colors
                            .xp
                        : theme.colors
                            .border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.metricIcon,
                    {
                      backgroundColor:
                        theme.colors
                          .cardAlt,
                    },
                  ]}
                >
                  <AppText
                    style={
                      styles.metricEmoji
                    }
                  >
                    {
                      option.icon
                    }
                  </AppText>
                </View>

                <View
                  style={
                    styles.metricText
                  }
                >
                  <AppText
                    variant="title"
                    style={
                      styles.metricTitle
                    }
                  >
                    {
                      option.title
                    }
                  </AppText>

                  <AppText
                    variant="caption"
                  >
                    {
                      option.description
                    }
                  </AppText>
                </View>

                {option.unit ? (
                  <AppText
                    variant="caption"
                    style={
                      styles.metricUnit
                    }
                  >
                    {option.unit}
                  </AppText>
                ) : null}

                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor:
                        selected
                          ? theme.colors
                              .xp
                          : theme.colors
                              .muted,
                    },
                  ]}
                >
                  {selected && (
                    <View
                      style={[
                        styles.radioInner,
                        {
                          backgroundColor:
                            theme.colors
                              .xp,
                        },
                      ]}
                    />
                  )}
                </View>
              </Pressable>
            );
          }
        )}
      </View>

      {/* ======================================================
          CUSTOM UNIT
          ====================================================== */}

      {selectedMetric ===
        "custom" && (
        <>
          <AppText
            variant="label"
            style={
              styles.customUnitLabel
            }
          >
            CUSTOM UNIT
          </AppText>

          <AppInput
            value={
              customUnit
            }
            onChangeText={
              setCustomUnit
            }
            placeholder="e.g. songs, words, laps"
          />
        </>
      )}

      {/* ======================================================
          LIFE STATS
          ====================================================== */}

      <View
        style={
          styles.lifeStatHeader
        }
      >
        <View
          style={
            styles.lifeStatHeaderText
          }
        >
          <AppText
            variant="label"
          >
            WHAT DOES THIS TRAIN?
          </AppText>

          <AppText
            variant="caption"
            style={
              styles.sectionSubtitle
            }
          >
            Choose every Life Stat
            this activity should
            improve.
          </AppText>
        </View>

        <View
          style={[
            styles.lifeStatCount,
            {
              backgroundColor:
                selectedLifeStats.length >
                0
                  ? theme.colors.cardAlt
                  : theme.colors.card,

              borderColor:
                selectedLifeStats.length >
                0
                  ? theme.colors.xp
                  : theme.colors.border,
            },
          ]}
        >
          <AppText
            variant="xp"
            style={
              styles.lifeStatCountNumber
            }
          >
            {
              selectedLifeStats.length
            }
          </AppText>

          <AppText
            variant="caption"
            style={
              styles.lifeStatCountLabel
            }
          >
            SELECTED
          </AppText>
        </View>
      </View>

      <View
        style={
          styles.lifeStatList
        }
      >
        {lifeStatOptions.map(
          (option) => {
            const selected =
              selectedLifeStats.includes(
                option.id
              );

            return (
              <Pressable
                key={option.id}
                onPress={() =>
                  toggleLifeStat(
                    option.id
                  )
                }
                style={[
                  styles.lifeStatRow,
                  {
                    backgroundColor:
                      selected
                        ? theme.colors
                            .cardAlt
                        : theme.colors
                            .card,

                    borderColor:
                      selected
                        ? theme.colors
                            .xp
                        : theme.colors
                            .border,
                  },
                ]}
              >
                <View
                  style={
                    styles.lifeStatIdentity
                  }
                >
                  <View
                    style={[
                      styles.lifeStatIconBox,
                      {
                        backgroundColor:
                          theme.colors
                            .card,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.lifeStatIcon
                      }
                    >
                      {
                        option.icon
                      }
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.lifeStatText
                    }
                  >
                    <View
                      style={
                        styles.lifeStatTitleRow
                      }
                    >
                      <AppText
                        variant="title"
                        style={
                          styles.lifeStatTitle
                        }
                      >
                        {
                          option.title
                        }
                      </AppText>

                      <View
                        style={[
                          styles.lifeStatBadge,
                          {
                            backgroundColor:
                              selected
                                ? theme
                                    .colors
                                    .xp
                                : theme
                                    .colors
                                    .cardAlt,
                          },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.lifeStatBadgeText,
                            {
                              color:
                                selected
                                  ? theme
                                      .colors
                                      .background
                                  : theme
                                      .colors
                                      .text,
                            },
                          ]}
                        >
                          {
                            option.shortName
                          }
                        </AppText>
                      </View>
                    </View>

                    <AppText
                      variant="caption"
                      style={
                        styles.lifeStatDescription
                      }
                    >
                      {
                        option.description
                      }
                    </AppText>
                  </View>
                </View>

                <View
                  style={[
                    styles.checkOuter,
                    {
                      backgroundColor:
                        selected
                          ? theme.colors
                              .xp
                          : "transparent",

                      borderColor:
                        selected
                          ? theme.colors
                              .xp
                          : theme.colors
                              .muted,
                    },
                  ]}
                >
                  {selected && (
                    <AppText
                      style={[
                        styles.checkMark,
                        {
                          color:
                            theme.colors
                              .background,
                        },
                      ]}
                    >
                      ✓
                    </AppText>
                  )}
                </View>
              </Pressable>
            );
          }
        )}
      </View>

      {/* ======================================================
          STAT EXPLANATION
          ====================================================== */}

      <AppCard
        variant="alt"
        style={
          styles.statExplanation
        }
      >
        <AppText
          style={
            styles.statExplanationIcon
          }
        >
          🎮
        </AppText>

        <View
          style={
            styles.explanationText
          }
        >
          <AppText
            variant="title"
            style={
              styles.explanationTitle
            }
          >
            Real life powers your Buddy
          </AppText>

          <AppText
            variant="caption"
          >
            XP earned from this
            activity will contribute
            to the Life Stats you
            selected above.
          </AppText>
        </View>
      </AppCard>

      {/* ======================================================
          ACTIVITY EXPLANATION
          ====================================================== */}

      <View
        style={[
          styles.explanation,
          {
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <AppText
          style={
            styles.explanationIcon
          }
        >
          ✦
        </AppText>

        <View
          style={
            styles.explanationText
          }
        >
          <AppText
            variant="title"
            style={
              styles.explanationTitle
            }
          >
            This becomes a skill
          </AppText>

          <AppText
            variant="caption"
          >
            Every time you log{" "}
            {name.trim() ||
              "this activity"}
            , it earns XP and
            contributes to its
            permanent level and
            history.
          </AppText>
        </View>
      </View>

      {/* ======================================================
          CREATE
          ====================================================== */}

      <View
        style={
          styles.createButton
        }
      >
        <AppButton
          title="Continue to Log"
          onPress={
            createActivity
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
      marginBottom: 20,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 13,
    },

    backText: {
      fontSize: 28,
      lineHeight: 30,
      marginTop: -3,
    },

    headerText: {
      flex: 1,
    },

    // --------------------------------------------------------
    // PREVIEW
    // --------------------------------------------------------

    preview: {
      flexDirection: "row",
      alignItems: "center",
    },

    previewIcon: {
      width: 58,
      height: 58,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    previewEmoji: {
      fontSize: 30,
    },

    previewText: {
      flex: 1,
      marginLeft: 13,
    },

    previewTitle: {
      fontSize: 18,
      lineHeight: 22,
      marginTop: 2,
    },

    levelPreview: {
      flexDirection: "row",
      alignItems: "baseline",
      marginLeft: 8,
    },

    levelPreviewNumber: {
      fontSize: 18,
      marginLeft: 3,
    },

    // --------------------------------------------------------
    // SECTIONS
    // --------------------------------------------------------

    sectionLabel: {
      marginTop: 24,
      marginBottom: 8,
    },

    sectionHeader: {
      marginTop: 24,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent:
        "space-between",
    },

    sectionSubtitle: {
      marginTop: 3,
    },

    selectedEmoji: {
      fontSize: 25,
    },

    measureHeader: {
      marginTop: 26,
      marginBottom: 10,
    },

    // --------------------------------------------------------
    // EMOJIS
    // --------------------------------------------------------

    emojiGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    emojiButton: {
      width: 48,
      height: 48,
      borderRadius: 11,
      borderWidth: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    emoji: {
      fontSize: 23,
    },

    // --------------------------------------------------------
    // METRICS
    // --------------------------------------------------------

    metricList: {
      gap: 8,
    },

    metricRow: {
      minHeight: 64,
      borderRadius: 11,
      borderWidth: 1,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
    },

    metricIcon: {
      width: 38,
      height: 38,
      borderRadius: 9,
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 10,
    },

    metricEmoji: {
      fontSize: 18,
    },

    metricText: {
      flex: 1,
    },

    metricTitle: {
      fontSize: 14,
      lineHeight: 17,
    },

    metricUnit: {
      marginRight: 12,
      fontWeight: "700",
    },

    radioOuter: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent:
        "center",
    },

    radioInner: {
      width: 9,
      height: 9,
      borderRadius: 5,
    },

    // --------------------------------------------------------
    // CUSTOM UNIT
    // --------------------------------------------------------

    customUnitLabel: {
      marginTop: 18,
      marginBottom: 8,
    },

    // --------------------------------------------------------
    // LIFE STATS
    // --------------------------------------------------------

    lifeStatHeader: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent:
        "space-between",
      gap: 12,
      marginTop: 28,
      marginBottom: 10,
    },

    lifeStatHeaderText: {
      flex: 1,
    },

    lifeStatCount: {
      minWidth: 60,
      borderWidth: 1,
      borderRadius: 11,
      paddingHorizontal: 8,
      paddingVertical: 6,
      alignItems: "center",
    },

    lifeStatCountNumber: {
      fontSize: 16,
      lineHeight: 19,
    },

    lifeStatCountLabel: {
      fontSize: 7,
      lineHeight: 9,
      marginTop: 1,
      fontWeight: "800",
    },

    lifeStatList: {
      gap: 8,
    },

    lifeStatRow: {
      minHeight: 78,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 11,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
    },

    lifeStatIdentity: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },

    lifeStatIconBox: {
      width: 42,
      height: 42,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    lifeStatIcon: {
      fontSize: 20,
    },

    lifeStatText: {
      flex: 1,
    },

    lifeStatTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    lifeStatTitle: {
      fontSize: 14,
      lineHeight: 18,
    },

    lifeStatBadge: {
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },

    lifeStatBadgeText: {
      fontSize: 8,
      lineHeight: 10,
      fontWeight: "900",
    },

    lifeStatDescription: {
      marginTop: 3,
      paddingRight: 6,
    },

    checkOuter: {
      width: 22,
      height: 22,
      borderRadius: 7,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 9,
    },

    checkMark: {
      fontSize: 12,
      lineHeight: 14,
      fontWeight: "900",
    },

    // --------------------------------------------------------
    // EXPLANATION
    // --------------------------------------------------------

    statExplanation: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
    },

    statExplanationIcon: {
      fontSize: 25,
      marginRight: 11,
    },

    explanation: {
      borderTopWidth:
        StyleSheet.hairlineWidth,
      borderBottomWidth:
        StyleSheet.hairlineWidth,
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      paddingVertical: 14,
    },

    explanationIcon: {
      fontSize: 18,
      marginRight: 11,
    },

    explanationText: {
      flex: 1,
    },

    explanationTitle: {
      fontSize: 13,
      marginBottom: 3,
    },

    // --------------------------------------------------------
    // BUTTON
    // --------------------------------------------------------

    createButton: {
      marginTop: 22,
      marginBottom: 24,
    },
  });