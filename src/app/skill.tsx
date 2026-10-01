import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useMemo,
} from "react";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "../components/AppButton";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import ProgressBar from "../components/ProgressBar";

import {
  useApp,
} from "../context/AppContext";

import type {
  Activity,
  ActivityMetric,
  BuddyLifeStat,
} from "../context/AppContext";

import {
  useTheme,
} from "../context/ThemeContext";

import {
  getProgression,
} from "../utils/progression";

// ============================================================
// HELPERS
// ============================================================

function normalizeTitle(
  title: string
) {
  return title
    .trim()
    .toLowerCase();
}

function formatNumber(
  value: number
) {
  if (
    Number.isInteger(value)
  ) {
    return value.toString();
  }

  return value.toFixed(1);
}

function formatTime(
  minutes: number
) {
  const rounded =
    Math.round(minutes);

  if (rounded < 60) {
    return `${rounded} min`;
  }

  const hours =
    Math.floor(
      rounded / 60
    );

  const remainingMinutes =
    rounded % 60;

  if (
    remainingMinutes === 0
  ) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}

function getDefaultMetric(
  activity: Activity
): ActivityMetric {
  if (
    activity.metric
  ) {
    return activity.metric;
  }

  switch (
    activity.type
  ) {
    case "running":
    case "walking":
      return "distance";

    case "reading":
      return "pages";

    case "gym":
      return "sessions";

    case "coding":
    case "studying":
      return "time";

    case "custom":
      return "custom";
  }
}

function getDefaultUnit(
  activity: Activity,
  metric: ActivityMetric
) {
  if (
    activity.unit?.trim()
  ) {
    return activity.unit.trim();
  }

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
    case "custom":
      return "units";
  }
}

function getMetricValue(
  activity: Activity,
  metric: ActivityMetric
) {
  switch (metric) {
    case "distance":
      return (
        activity.distance ??
        0
      );

    case "time":
      return (
        activity.time ??
        0
      );

    case "pages":
      return (
        activity.pages ??
        0
      );

    case "sessions":
      return (
        activity.sessions ??
        0
      );

    case "amount":
      return (
        activity.amount ??
        0
      );

    case "custom":
      return (
        activity.custom ??
        0
      );
  }
}

function getMetricName(
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
      return "TOTAL";
  }
}

function formatMetricValue(
  value: number,
  metric: ActivityMetric,
  unit: string
) {
  if (
    metric === "time"
  ) {
    return formatTime(
      value
    );
  }

  const formatted =
    formatNumber(
      value
    );

  if (!unit) {
    return formatted;
  }

  return `${formatted} ${unit}`;
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

function getSavedLifeStats(
  activities: Activity[]
): BuddyLifeStat[] {
  for (
    const activity
    of activities
  ) {
    if (
      !activity.lifeStats
    ) {
      continue;
    }

    const validStats =
      activity.lifeStats.filter(
        isBuddyLifeStat
      );

    if (
      validStats.length >
      0
    ) {
      return Array.from(
        new Set(
          validStats
        )
      );
    }
  }

  return [];
}

// ============================================================
// SCREEN
// ============================================================

export default function SkillScreen() {
  const {
    title: routeTitle,
  } =
    useLocalSearchParams<{
      title?: string;
    }>();

  const {
    activities,
  } = useApp();

  const {
    theme,
  } = useTheme();

  // ==========================================================
  // TITLE
  // ==========================================================

  const requestedTitle =
    typeof routeTitle ===
    "string"
      ? routeTitle
      : "";

  const normalizedRequestedTitle =
    normalizeTitle(
      requestedTitle
    );

  // ==========================================================
  // MATCHING ACTIVITY HISTORY
  // ==========================================================

  const matchingActivities =
    useMemo(() => {
      return activities
        .filter(
          activity =>
            normalizeTitle(
              activity.title
            ) ===
            normalizedRequestedTitle
        )
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        );
    }, [
      activities,
      normalizedRequestedTitle,
    ]);

  // ==========================================================
  // CURRENT SKILL INFORMATION
  // ==========================================================

  const newestActivity =
    matchingActivities[0];

  const title =
    newestActivity?.title ||
    requestedTitle ||
    "Activity";

  const icon =
    newestActivity?.icon ||
    "⭐";

  const skillType =
    newestActivity?.type ??
    "custom";

  const metric:
    ActivityMetric =
    newestActivity
      ? getDefaultMetric(
          newestActivity
        )
      : "custom";

  const unit =
    newestActivity
      ? getDefaultUnit(
          newestActivity,
          metric
        )
      : "units";

  // ==========================================================
  // SAVED LIFE STATS
  //
  // We look through the skill history from newest to oldest
  // and use the most recent entry that contains Life Stats.
  //
  // This also keeps older saved activities compatible.
  // ==========================================================

  const savedLifeStats =
    useMemo(
      () =>
        getSavedLifeStats(
          matchingActivities
        ),
      [
        matchingActivities,
      ]
    );

  const lifeStatsRouteValue =
    savedLifeStats.join(
      ","
    );

  // ==========================================================
  // LIFETIME TOTALS
  // ==========================================================

  const totalXP =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        activity.xp,
      0
    );

  const totalDistance =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.distance ??
          0
        ),
      0
    );

  const totalTime =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.time ??
          0
        ),
      0
    );

  const totalPages =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.pages ??
          0
        ),
      0
    );

  const totalSessions =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.sessions ??
          0
        ),
      0
    );

  const totalAmount =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.amount ??
          0
        ),
      0
    );

  const totalCustom =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.custom ??
          0
        ),
      0
    );

  const primaryMetricTotal =
    matchingActivities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        getMetricValue(
          activity,
          metric
        ),
      0
    );

  // ==========================================================
  // PROGRESSION
  // ==========================================================

  const progression =
    getProgression(
      totalXP
    );

  // ==========================================================
  // AVERAGES
  // ==========================================================

  const entryCount =
    matchingActivities.length;

  const averageDistance =
    entryCount > 0
      ? totalDistance /
        entryCount
      : 0;

  const averagePages =
    entryCount > 0
      ? totalPages /
        entryCount
      : 0;

  const averageSessions =
    entryCount > 0
      ? totalSessions /
        entryCount
      : 0;

  const averageTime =
    entryCount > 0
      ? totalTime /
        entryCount
      : 0;

  const averagePrimaryMetric =
    entryCount > 0
      ? primaryMetricTotal /
        entryCount
      : 0;

  // ==========================================================
  // LOG ROUTE
  //
  // Presets only need their type.
  //
  // Custom skills carry their saved definition AND their
  // Life Stat association back into the generic logger.
  // ==========================================================

  const logRoute =
    useMemo(() => {
      if (!newestActivity) {
        return null;
      }

      if (
        skillType !==
        "custom"
      ) {
        return {
          pathname:
            "/activity" as const,

          params: {
            type:
              skillType,
          },
        };
      }

      return {
        pathname:
          "/activity" as const,

        params: {
          type:
            "custom",

          title,

          icon,

          metric,

          unit,

          lifeStats:
            lifeStatsRouteValue,
        },
      };
    }, [
      newestActivity,
      skillType,
      title,
      icon,
      metric,
      unit,
      lifeStatsRouteValue,
    ]);

  // ==========================================================
  // STAT GRID
  // ==========================================================

  const stats =
    useMemo(() => {
      // --------------------------------------------------------
      // CUSTOM SKILLS
      // --------------------------------------------------------

      if (
        skillType ===
        "custom"
      ) {
        if (
          metric ===
          "time"
        ) {
          return [
            {
              label:
                "TOTAL TIME",

              value:
                formatTime(
                  primaryMetricTotal
                ),
            },

            {
              label:
                "ENTRIES",

              value:
                entryCount.toString(),
            },

            {
              label:
                "AVG. SESSION",

              value:
                formatTime(
                  averagePrimaryMetric
                ),
            },

            {
              label:
                "TOTAL XP",

              value:
                totalXP.toString(),
            },
          ];
        }

        return [
          {
            label:
              getMetricName(
                metric
              ),

            value:
              formatMetricValue(
                primaryMetricTotal,
                metric,
                unit
              ),
          },

          {
            label:
              "ENTRIES",

            value:
              entryCount.toString(),
          },

          {
            label:
              `AVG. ${getMetricName(
                metric
              )}`,

            value:
              formatMetricValue(
                averagePrimaryMetric,
                metric,
                unit
              ),
          },

          {
            label:
              "TOTAL XP",

            value:
              totalXP.toString(),
          },
        ];
      }

      // --------------------------------------------------------
      // RUNNING / WALKING
      // --------------------------------------------------------

      if (
        skillType ===
          "running" ||
        skillType ===
          "walking"
      ) {
        return [
          {
            label:
              "DISTANCE",

            value:
              `${formatNumber(
                totalDistance
              )} km`,
          },

          {
            label:
              "TIME",

            value:
              formatTime(
                totalTime
              ),
          },

          {
            label:
              "ENTRIES",

            value:
              entryCount.toString(),
          },

          {
            label:
              "AVG. DISTANCE",

            value:
              `${formatNumber(
                averageDistance
              )} km`,
          },
        ];
      }

      // --------------------------------------------------------
      // READING
      // --------------------------------------------------------

      if (
        skillType ===
        "reading"
      ) {
        return [
          {
            label:
              "PAGES",

            value:
              formatNumber(
                totalPages
              ),
          },

          {
            label:
              "TIME",

            value:
              formatTime(
                totalTime
              ),
          },

          {
            label:
              "ENTRIES",

            value:
              entryCount.toString(),
          },

          {
            label:
              "AVG. PAGES",

            value:
              formatNumber(
                averagePages
              ),
          },
        ];
      }

      // --------------------------------------------------------
      // GYM
      // --------------------------------------------------------

      if (
        skillType ===
        "gym"
      ) {
        return [
          {
            label:
              "SESSIONS",

            value:
              formatNumber(
                totalSessions
              ),
          },

          {
            label:
              "TIME",

            value:
              formatTime(
                totalTime
              ),
          },

          {
            label:
              "ENTRIES",

            value:
              entryCount.toString(),
          },

          {
            label:
              "AVG. SESSION",

            value:
              formatNumber(
                averageSessions
              ),
          },
        ];
      }

      // --------------------------------------------------------
      // CODING / STUDYING
      // --------------------------------------------------------

      if (
        skillType ===
          "coding" ||
        skillType ===
          "studying"
      ) {
        return [
          {
            label:
              "TOTAL TIME",

            value:
              formatTime(
                totalTime
              ),
          },

          {
            label:
              "ENTRIES",

            value:
              entryCount.toString(),
          },

          {
            label:
              "AVG. SESSION",

            value:
              formatTime(
                averageTime
              ),
          },

          {
            label:
              "TOTAL XP",

            value:
              totalXP.toString(),
          },
        ];
      }

      // --------------------------------------------------------
      // FALLBACK
      // --------------------------------------------------------

      if (
        totalAmount > 0
      ) {
        return [
          {
            label:
              "TOTAL",

            value:
              formatNumber(
                totalAmount
              ),
          },

          {
            label:
              "ENTRIES",

            value:
              entryCount.toString(),
          },

          {
            label:
              "TOTAL XP",

            value:
              totalXP.toString(),
          },

          {
            label:
              "LEVEL",

            value:
              progression.level.toString(),
          },
        ];
      }

      if (
        totalCustom > 0
      ) {
        return [
          {
            label:
              "TOTAL",

            value:
              formatNumber(
                totalCustom
              ),
          },

          {
            label:
              "ENTRIES",

            value:
              entryCount.toString(),
          },

          {
            label:
              "TOTAL XP",

            value:
              totalXP.toString(),
          },

          {
            label:
              "LEVEL",

            value:
              progression.level.toString(),
          },
        ];
      }

      return [
        {
          label:
            "ENTRIES",

          value:
            entryCount.toString(),
        },

        {
          label:
            "TOTAL XP",

          value:
            totalXP.toString(),
        },

        {
          label:
            "LEVEL",

          value:
            progression.level.toString(),
        },

        {
          label:
            "XP TO NEXT",

          value:
            progression.xpToNextLevel.toString(),
        },
      ];
    }, [
      skillType,
      metric,
      unit,
      primaryMetricTotal,
      averagePrimaryMetric,
      totalDistance,
      totalTime,
      totalPages,
      totalSessions,
      totalAmount,
      totalCustom,
      totalXP,
      entryCount,
      averageDistance,
      averagePages,
      averageSessions,
      averageTime,
      progression.level,
      progression.xpToNextLevel,
    ]);

  // ==========================================================
  // UI
  // ==========================================================

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

        <AppText
          variant="label"
        >
          SKILL
        </AppText>

        <View
          style={
            styles.headerSpacer
          }
        />
      </View>

      {/* ======================================================
          LEVEL + LIFETIME XP
          ====================================================== */}

      <View
        style={
          styles.topStats
        }
      >
        <View>
          <AppText
            variant="label"
          >
            LEVEL
          </AppText>

          <AppText
            style={[
              styles.levelNumber,
              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            {
              progression.level
            }
          </AppText>
        </View>

        <View
          style={
            styles.lifetimeXP
          }
        >
          <AppText
            variant="label"
          >
            LIFETIME XP
          </AppText>

          <AppText
            variant="xp"
            style={
              styles.lifetimeXPValue
            }
          >
            {totalXP}
          </AppText>
        </View>
      </View>

      {/* ======================================================
          SKILL IDENTITY
          ====================================================== */}

      <View
        style={
          styles.skillIdentity
        }
      >
        <View
          style={[
            styles.iconBox,
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
              styles.skillIcon
            }
          >
            {icon}
          </AppText>
        </View>

        <View
          style={
            styles.skillIdentityText
          }
        >
          <AppText
            variant="title"
            style={
              styles.skillTitle
            }
          >
            {title}
          </AppText>

          <AppText
            variant="secondary"
          >
            {entryCount}{" "}
            {entryCount === 1
              ? "entry"
              : "entries"}
          </AppText>
        </View>
      </View>

      {/* ======================================================
          XP PROGRESS
          ====================================================== */}

      <View
        style={
          styles.progressSection
        }
      >
        <View
          style={
            styles.progressHeader
          }
        >
          <AppText
            variant="label"
          >
            LEVEL PROGRESS
          </AppText>

          <AppText
            variant="xp"
            style={
              styles.progressXP
            }
          >
            {
              progression
                .xpInLevel
            }{" "}
            /{" "}
            {
              progression
                .xpForLevel
            }{" "}
            XP
          </AppText>
        </View>

        <ProgressBar
          progress={
            progression.progress
          }
        />

        <AppText
          variant="caption"
          style={
            styles.nextLevelText
          }
        >
          {
            progression
              .xpToNextLevel
          }{" "}
          XP to Level{" "}
          {
            progression.level +
            1
          }
        </AppText>
      </View>

      {/* ======================================================
          LIFETIME STATS
          ====================================================== */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <AppText
          variant="label"
        >
          LIFETIME
        </AppText>
      </View>

      <View
        style={
          styles.statsGrid
        }
      >
        {stats.map(
          (
            stat,
            index
          ) => (
            <View
              key={
                `${stat.label}-${index}`
              }
              style={[
                styles.statCell,
                {
                  backgroundColor:
                    theme.colors
                      .card,

                  borderColor:
                    theme.colors
                      .border,
                },

                index % 2 ===
                  0
                  ? styles.statCellLeft
                  : styles.statCellRight,
              ]}
            >
              <AppText
                variant="label"
                numberOfLines={
                  1
                }
                style={
                  styles.statLabel
                }
              >
                {stat.label}
              </AppText>

              <AppText
                numberOfLines={
                  1
                }
                style={
                  styles.statValue
                }
              >
                {stat.value}
              </AppText>
            </View>
          )
        )}
      </View>

      {/* ======================================================
          RECENT ACTIVITY
          ====================================================== */}

      <View
        style={
          styles.recentHeader
        }
      >
        <AppText
          variant="label"
        >
          RECENT ACTIVITY
        </AppText>

        <AppText
          variant="caption"
        >
          Latest 5
        </AppText>
      </View>

      {matchingActivities.length ===
      0 ? (
        <View
          style={[
            styles.emptyState,
            {
              borderColor:
                theme.colors
                  .border,
            },
          ]}
        >
          <AppText
            variant="secondary"
          >
            No activity logged
            yet.
          </AppText>
        </View>
      ) : (
        <View
          style={
            styles.activityList
          }
        >
          {matchingActivities
            .slice(
              0,
              5
            )
            .map(
              activity => (
                <View
                  key={
                    activity.id
                  }
                  style={[
                    styles.activityRow,
                    {
                      backgroundColor:
                        theme.colors
                          .card,

                      borderColor:
                        theme.colors
                          .border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.activityAccent,
                      {
                        backgroundColor:
                          theme.colors
                            .xp,
                      },
                    ]}
                  />

                  <View
                    style={
                      styles.activityMain
                    }
                  >
                    <AppText
                      style={
                        styles.activityDetails
                      }
                    >
                      {
                        activity.details
                      }
                    </AppText>

                    {activity.note ? (
                      <AppText
                        variant="caption"
                        numberOfLines={
                          1
                        }
                        style={
                          styles.activityNote
                        }
                      >
                        {
                          activity.note
                        }
                      </AppText>
                    ) : null}
                  </View>

                  <AppText
                    variant="xp"
                    style={
                      styles.activityXP
                    }
                  >
                    +
                    {
                      activity.xp
                    }{" "}
                    XP
                  </AppText>
                </View>
              )
            )}
        </View>
      )}

      {/* ======================================================
          LOG ACTIVITY
          ====================================================== */}

      {logRoute && (
        <View
          style={
            styles.logButton
          }
        >
          <AppButton
            title={`Log ${title}`}
            onPress={() =>
              router.push(
                logRoute
              )
            }
          />
        </View>
      )}
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
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
    },

    backText: {
      fontSize: 28,
      lineHeight: 30,
      marginTop: -3,
    },

    headerSpacer: {
      width: 40,
    },

    // --------------------------------------------------------
    // TOP STATS
    // --------------------------------------------------------

    topStats: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent:
        "space-between",
    },

    levelNumber: {
      fontSize: 42,
      lineHeight: 46,
      fontWeight: "900",
    },

    lifetimeXP: {
      alignItems: "flex-end",
    },

    lifetimeXPValue: {
      fontSize: 22,
      lineHeight: 28,
      marginTop: 2,
    },

    // --------------------------------------------------------
    // IDENTITY
    // --------------------------------------------------------

    skillIdentity: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
    },

    iconBox: {
      width: 64,
      height: 64,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    skillIcon: {
      fontSize: 34,
    },

    skillIdentityText: {
      flex: 1,
      marginLeft: 14,
    },

    skillTitle: {
      fontSize: 24,
      lineHeight: 29,
    },

    // --------------------------------------------------------
    // PROGRESS
    // --------------------------------------------------------

    progressSection: {
      marginTop: 20,
    },

    progressHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 8,
    },

    progressXP: {
      fontSize: 12,
    },

    nextLevelText: {
      textAlign: "right",
      marginTop: 6,
    },

    // --------------------------------------------------------
    // SECTION
    // --------------------------------------------------------

    sectionHeader: {
      marginTop: 24,
      marginBottom: 8,
    },

    // --------------------------------------------------------
    // STATS
    // --------------------------------------------------------

    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    statCell: {
      width: "48.5%",
      minHeight: 78,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 11,
      marginBottom: 10,
      justifyContent:
        "space-between",
    },

    statCellLeft: {
      marginRight: "1.5%",
    },

    statCellRight: {
      marginLeft: "1.5%",
    },

    statLabel: {
      marginBottom: 7,
    },

    statValue: {
      fontSize: 20,
      lineHeight: 25,
      fontWeight: "800",
    },

    // --------------------------------------------------------
    // RECENT
    // --------------------------------------------------------

    recentHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginTop: 14,
      marginBottom: 8,
    },

    activityList: {
      gap: 8,
    },

    activityRow: {
      minHeight: 58,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 11,
      overflow: "hidden",
    },

    activityAccent: {
      width: 4,
      alignSelf: "stretch",
    },

    activityMain: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 11,
    },

    activityDetails: {
      fontSize: 14,
      fontWeight: "700",
    },

    activityNote: {
      marginTop: 2,
    },

    activityXP: {
      marginRight: 12,
      fontSize: 12,
    },

    emptyState: {
      borderWidth: 1,
      borderRadius: 11,
      padding: 18,
      alignItems: "center",
    },

    // --------------------------------------------------------
    // LOG
    // --------------------------------------------------------

    logButton: {
      marginTop: 18,
      marginBottom: 28,
    },
  });