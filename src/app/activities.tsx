import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import ProgressBar from "../components/ProgressBar";

import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

import { getProgression } from "../utils/progression";

// ============================================================
// TYPES
// ============================================================

type ActivityProgress = {
  key: string;
  title: string;
  icon: string;
  totalXP: number;
  entries: number;
  level: number;
  xpInLevel: number;
  xpForLevel: number;
  progress: number;
};

// ============================================================
// SCREEN
// ============================================================

export default function ActivitiesScreen() {
  const {
    activities,
  } = useApp();

  const {
    theme,
  } = useTheme();

  // ==========================================================
  // GROUP ACTIVITY LOGS INTO SKILLS
  // ==========================================================

  const activityMap = new Map<
    string,
    {
      key: string;
      title: string;
      icon: string;
      totalXP: number;
      entries: number;
    }
  >();

  activities.forEach(
    (activity) => {
      const key =
        activity.title
          .trim()
          .toLowerCase();

      const existing =
        activityMap.get(key);

      if (existing) {
        existing.totalXP +=
          activity.xp;

        existing.entries += 1;

        existing.icon =
          activity.icon;
      } else {
        activityMap.set(
          key,
          {
            key,
            title:
              activity.title,
            icon:
              activity.icon,
            totalXP:
              activity.xp,
            entries: 1,
          }
        );
      }
    }
  );

  // ==========================================================
  // PROGRESSION
  // ==========================================================

  const skills: ActivityProgress[] =
    Array.from(
      activityMap.values()
    )
      .map((activity) => {
        const progression =
          getProgression(
            activity.totalXP
          );

        return {
          ...activity,

          level:
            progression.level,

          xpInLevel:
            progression.xpInLevel,

          xpForLevel:
            progression.xpForLevel,

          progress:
            progression.progress,
        };
      })
      .sort(
        (a, b) =>
          b.totalXP -
          a.totalXP
      );

  // ==========================================================
  // TOTALS
  // ==========================================================

  const totalSkillXP =
    skills.reduce(
      (sum, skill) =>
        sum +
        skill.totalXP,
      0
    );

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function openSkill(
    title: string
  ) {
    router.push({
      pathname: "/skill",
      params: {
        title,
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

        <View
          style={
            styles.headerText
          }
        >
          <AppText
            variant="pageTitle"
          >
            Activities
          </AppText>

          <AppText
            variant="secondary"
          >
            Your real-life skills
          </AppText>
        </View>
      </View>

      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <View
        style={[
          styles.summary,
          {
            backgroundColor:
              theme.colors.card,

            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <View
          style={
            styles.summaryStat
          }
        >
          <AppText
            variant="label"
          >
            SKILLS
          </AppText>

          <AppText
            style={[
              styles.summaryValue,
              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            {skills.length}
          </AppText>
        </View>

        <View
          style={[
            styles.summaryDivider,
            {
              backgroundColor:
                theme.colors.border,
            },
          ]}
        />

        <View
          style={
            styles.summaryStat
          }
        >
          <AppText
            variant="label"
          >
            ENTRIES
          </AppText>

          <AppText
            style={
              styles.summaryValue
            }
          >
            {activities.length}
          </AppText>
        </View>

        <View
          style={[
            styles.summaryDivider,
            {
              backgroundColor:
                theme.colors.border,
            },
          ]}
        />

        <View
          style={
            styles.summaryStat
          }
        >
          <AppText
            variant="label"
          >
            XP
          </AppText>

          <AppText
            style={[
              styles.summaryValue,
              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            {totalSkillXP}
          </AppText>
        </View>
      </View>

      {/* ======================================================
          SKILL LIST HEADER
          ====================================================== */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <View>
          <AppText
            variant="title"
            style={
              styles.sectionTitle
            }
          >
            All Skills
          </AppText>

          <AppText
            variant="caption"
          >
            Ranked by lifetime XP
          </AppText>
        </View>

        <AppText
          variant="caption"
        >
          {skills.length} total
        </AppText>
      </View>

      {/* ======================================================
          EMPTY STATE
          ====================================================== */}

      {skills.length === 0 ? (
        <View
          style={[
            styles.emptyState,
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
              styles.emptyIcon
            }
          >
            ✦
          </AppText>

          <AppText
            variant="title"
          >
            No skills yet
          </AppText>

          <AppText
            variant="secondary"
            style={
              styles.emptyText
            }
          >
            Log an activity and
            your first skill will
            appear here.
          </AppText>

          <Pressable
            onPress={() =>
              router.push(
                "/(tabs)/add"
              )
            }
            style={[
              styles.addButton,
              {
                backgroundColor:
                  theme.colors.xp,
              },
            ]}
          >
            <AppText
              style={
                styles.addButtonText
              }
            >
              + Add Activity
            </AppText>
          </Pressable>
        </View>
      ) : (
        // ====================================================
        // ALL SKILLS
        // ====================================================

        <View
          style={
            styles.skillList
          }
        >
          {skills.map(
            (
              skill,
              index
            ) => (
              <Pressable
                key={
                  skill.key
                }
                onPress={() =>
                  openSkill(
                    skill.title
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.skillRow,

                  {
                    backgroundColor:
                      theme.colors
                        .card,

                    borderColor:
                      theme.colors
                        .border,

                    opacity:
                      pressed
                        ? 0.7
                        : 1,
                  },
                ]}
              >
                {/* GOLD ACCENT */}

                <View
                  style={[
                    styles.accent,
                    {
                      backgroundColor:
                        theme.colors
                          .xp,
                    },
                  ]}
                />

                {/* RANK */}

                <View
                  style={
                    styles.rank
                  }
                >
                  <AppText
                    variant="caption"
                    style={
                      styles.rankText
                    }
                  >
                    #
                    {index + 1}
                  </AppText>
                </View>

                {/* ICON */}

                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor:
                        theme.colors
                          .cardAlt,
                    },
                  ]}
                >
                  <AppText
                    style={
                      styles.icon
                    }
                  >
                    {
                      skill.icon
                    }
                  </AppText>
                </View>

                {/* MAIN */}

                <View
                  style={
                    styles.skillMain
                  }
                >
                  <View
                    style={
                      styles.skillTop
                    }
                  >
                    <View
                      style={
                        styles.flex
                      }
                    >
                      <AppText
                        variant="title"
                        style={
                          styles.skillTitle
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {
                          skill.title
                        }
                      </AppText>

                      <AppText
                        variant="caption"
                      >
                        {
                          skill.entries
                        }{" "}
                        {skill.entries ===
                        1
                          ? "entry"
                          : "entries"}
                        {" · "}
                        {
                          skill.totalXP
                        }{" "}
                        lifetime XP
                      </AppText>
                    </View>

                    {/* LEVEL */}

                    <View
                      style={
                        styles.level
                      }
                    >
                      <AppText
                        variant="caption"
                        style={
                          styles.levelLabel
                        }
                      >
                        LV.
                      </AppText>

                      <AppText
                        variant="xp"
                        style={
                          styles.levelNumber
                        }
                      >
                        {
                          skill.level
                        }
                      </AppText>
                    </View>
                  </View>

                  {/* XP */}

                  <View
                    style={
                      styles.progressRow
                    }
                  >
                    <View
                      style={
                        styles.progressBar
                      }
                    >
                      <ProgressBar
                        progress={
                          skill.progress
                        }
                      />
                    </View>

                    <AppText
                      variant="caption"
                      style={
                        styles.progressText
                      }
                    >
                      {
                        skill.xpInLevel
                      }
                      /
                      {
                        skill.xpForLevel
                      }
                    </AppText>
                  </View>
                </View>

                {/* ARROW */}

                <AppText
                  style={[
                    styles.rowArrow,
                    {
                      color:
                        theme.colors
                          .muted,
                    },
                  ]}
                >
                  ›
                </AppText>
              </Pressable>
            )
          )}
        </View>
      )}

      {/* ======================================================
          ADD MORE
          ====================================================== */}

      {skills.length > 0 && (
        <Pressable
          onPress={() =>
            router.push(
              "/(tabs)/add"
            )
          }
          style={({
            pressed,
          }) => [
            styles.addMore,

            {
              borderColor:
                theme.colors
                  .border,

              opacity:
                pressed
                  ? 0.65
                  : 1,
            },
          ]}
        >
          <View>
            <AppText
              style={[
                styles.addMoreTitle,
                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              + Log another activity
            </AppText>

            <AppText
              variant="caption"
            >
              Keep building your
              save file
            </AppText>
          </View>

          <AppText
            style={[
              styles.addMoreArrow,
              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            →
          </AppText>
        </Pressable>
      )}
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
    // SUMMARY
    // --------------------------------------------------------

    summary: {
      minHeight: 76,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 22,
    },

    summaryStat: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    summaryDivider: {
      width:
        StyleSheet.hairlineWidth,
      height: 35,
    },

    summaryValue: {
      fontSize: 21,
      lineHeight: 26,
      fontWeight: "900",
      marginTop: 3,
    },

    // --------------------------------------------------------
    // SECTION
    // --------------------------------------------------------

    sectionHeader: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent:
        "space-between",
      marginBottom: 9,
    },

    sectionTitle: {
      fontSize: 18,
      lineHeight: 22,
    },

    // --------------------------------------------------------
    // LIST
    // --------------------------------------------------------

    skillList: {
      gap: 7,
    },

    skillRow: {
      minHeight: 76,
      borderRadius: 11,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      paddingRight: 8,
    },

    accent: {
      width: 4,
      alignSelf: "stretch",
    },

    rank: {
      width: 34,
      alignItems: "center",
    },

    rankText: {
      fontSize: 9,
      fontWeight: "800",
    },

    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 9,
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 10,
    },

    icon: {
      fontSize: 21,
    },

    skillMain: {
      flex: 1,
      paddingVertical: 9,
    },

    skillTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    skillTitle: {
      fontSize: 14,
      lineHeight: 18,
    },

    level: {
      minWidth: 42,
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent:
        "flex-end",
      marginLeft: 7,
    },

    levelLabel: {
      fontSize: 8,
      fontWeight: "800",
      marginRight: 3,
    },

    levelNumber: {
      fontSize: 14,
    },

    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },

    progressBar: {
      flex: 1,
    },

    progressText: {
      width: 65,
      marginLeft: 8,
      textAlign: "right",
      fontSize: 9,
      fontWeight: "700",
    },

    rowArrow: {
      fontSize: 22,
      marginLeft: 5,
    },

    // --------------------------------------------------------
    // EMPTY
    // --------------------------------------------------------

    emptyState: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
    },

    emptyIcon: {
      fontSize: 28,
      marginBottom: 9,
    },

    emptyText: {
      textAlign: "center",
      marginTop: 5,
      maxWidth: 230,
    },

    addButton: {
      borderRadius: 10,
      paddingHorizontal: 18,
      paddingVertical: 11,
      marginTop: 17,
    },

    addButtonText: {
      fontSize: 12,
      fontWeight: "900",
      color: "#111111",
    },

    // --------------------------------------------------------
    // ADD MORE
    // --------------------------------------------------------

    addMore: {
      minHeight: 62,
      borderTopWidth:
        StyleSheet.hairlineWidth,
      borderBottomWidth:
        StyleSheet.hairlineWidth,
      marginTop: 16,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    addMoreTitle: {
      fontSize: 12,
      fontWeight: "800",
      marginBottom: 2,
    },

    addMoreArrow: {
      fontSize: 18,
      fontWeight: "800",
    },

    // --------------------------------------------------------
    // SHARED
    // --------------------------------------------------------

    flex: {
      flex: 1,
    },
  });