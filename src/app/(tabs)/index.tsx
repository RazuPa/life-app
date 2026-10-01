import { useCallback, useRef } from "react";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import ProgressBar from "../../components/ProgressBar";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

import { getProgression } from "../../utils/progression";

// ============================================================
// TYPES
// ============================================================

type ActivityProgress = {
  key: string;
  title: string;
  icon: string;
  totalXP: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  progress: number;
  entries: number;
};

// ============================================================
// SCREEN
// ============================================================

export default function HomeScreen() {
  const {
    activities,
    goals,
    totalXP,
    activityXP,
    bonusXP,
    randomQuest,
    isQuestOnCooldown,
  } = useApp();

  const {
    theme,
    themeName,
  } = useTheme();

  const isDungeon =
    themeName === "dungeon";

  const isFuture =
    themeName === "future";

  // ============================================================
  // HOME ENTRANCE ANIMATIONS
  // ============================================================

  const playerAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const xpAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const skillsAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const goalsAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const bonusAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const journeyAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // ============================================================
  // THEME-SPECIFIC ANIMATION
  // ============================================================

  const entranceDistance =
    isDungeon
      ? 10
      : isFuture
        ? 18
        : 14;

  const entranceDuration =
    isDungeon
      ? 170
      : isFuture
        ? 260
        : 300;

  function entranceStyle(
    value: Animated.Value
  ) {
    return {
      opacity: value,

      transform: [
        {
          translateY:
            value.interpolate({
              inputRange: [0, 1],

              outputRange: [
                entranceDistance,
                0,
              ],
            }),
        },

        {
          scale:
            value.interpolate({
              inputRange: [0, 1],

              outputRange:
                isDungeon
                  ? [0.99, 1]
                  : isFuture
                    ? [0.97, 1]
                    : [0.985, 1],
            }),
        },
      ],
    };
  }

  // ============================================================
  // RUN ANIMATION WHEN HOME GETS FOCUS
  // ============================================================

  useFocusEffect(
    useCallback(() => {
      const values = [
        playerAnim,
        xpAnim,
        skillsAnim,
        goalsAnim,
        bonusAnim,
        journeyAnim,
      ];

      values.forEach(
        (value) => {
          value.stopAnimation();
          value.setValue(0);
        }
      );

      const createAnimation = (
        value: Animated.Value
      ) =>
        Animated.timing(
          value,
          {
            toValue: 1,

            duration:
              entranceDuration,

            useNativeDriver: true,
          }
        );

      const animation =
        Animated.stagger(
          isDungeon
            ? 55
            : isFuture
              ? 75
              : 85,

          [
            createAnimation(
              playerAnim
            ),

            createAnimation(
              xpAnim
            ),

            createAnimation(
              skillsAnim
            ),

            createAnimation(
              goalsAnim
            ),

            createAnimation(
              bonusAnim
            ),

            createAnimation(
              journeyAnim
            ),
          ]
        );

      animation.start();

      return () => {
        animation.stop();
      };
    }, [
      playerAnim,
      xpAnim,
      skillsAnim,
      goalsAnim,
      bonusAnim,
      journeyAnim,
      isDungeon,
      isFuture,
      entranceDuration,
    ])
  );

  // ============================================================
  // PLAYER PROGRESSION
  // ============================================================

  const playerProgression =
    getProgression(totalXP);

  // ============================================================
  // ACTIVITY PROGRESSION
  // ============================================================

  const activityMap =
    new Map<
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

  const activityProgress: ActivityProgress[] =
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

          xpForNextLevel:
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

  const topActivities =
    activityProgress.slice(
      0,
      3
    );

  const hiddenActivityCount =
    Math.max(
      0,
      activityProgress.length -
        3
    );

  const activeGoals =
    goals.slice(0, 3);

  const randomQuestProgress =
    randomQuest &&
    randomQuest.target > 0
      ? Math.min(
          randomQuest.progress /
            randomQuest.target,
          1
        )
      : 0;

  // ============================================================
  // THEME VALUES
  // ============================================================

  const panelRadius =
    isDungeon
      ? 3
      : isFuture
        ? 8
        : 16;

  const iconRadius =
    isDungeon
      ? 2
      : isFuture
        ? 7
        : 11;

  const panelBorderWidth =
    isDungeon ? 2 : 1;

  const panelBackground =
    isDungeon
      ? `${theme.colors.card}F2`
      : isFuture
        ? `${theme.colors.card}E8`
        : `${theme.colors.card}E6`;

  const altBackground =
    isDungeon
      ? theme.colors.cardAlt
      : `${theme.colors.cardAlt}E8`;

  // ============================================================
  // NAVIGATION
  // ============================================================

  function openPlayer() {
    router.push(
      "/profile" as never
    );
  }

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

  function openAllActivities() {
    router.push(
      "/activities" as never
    );
  }

  function openGoals() {
    router.push(
      "/goals" as never
    );
  }

  function createGoal() {
    router.push(
      "/create-goal" as never
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <AppScreen
      topPadding={10}
      bottomPadding={108}
    >
      {/* ======================================================
          PLAYER
      ====================================================== */}

      <Animated.View
        style={
          entranceStyle(
            playerAnim
          )
        }
      >
        <Pressable
          onPress={openPlayer}
          style={({
            pressed,
          }) => [
            styles.playerHeader,

            {
              backgroundColor:
                panelBackground,

              borderColor:
                isFuture
                  ? "#24536B"
                  : theme.colors
                      .border,

              borderRadius:
                panelRadius,

              borderWidth:
                panelBorderWidth,

              opacity:
                pressed
                  ? 0.72
                  : 1,
            },

            isDungeon &&
              styles.dungeonPanel,

            isFuture &&
              styles.futurePanel,
          ]}
        >
          {isFuture && (
            <View
              pointerEvents="none"
              style={
                styles.futureSystemTag
              }
            >
              <AppText
                style={[
                  styles.futureSystemTagText,

                  {
                    color:
                      theme.colors
                        .primary,
                  },
                ]}
              >
                01 // PLAYER SYSTEM
              </AppText>
            </View>
          )}

          <View
            style={[
              styles.characterBox,

              {
                backgroundColor:
                  altBackground,

                borderColor:
                  isDungeon
                    ? theme.colors
                        .primary
                    : isFuture
                      ? theme.colors
                          .primary
                      : theme.colors
                          .border,

                borderRadius:
                  iconRadius,
              },
            ]}
          >
            <AppText
              style={
                styles.character
              }
            >
              {isDungeon
                ? "🛡️"
                : isFuture
                  ? "🧑‍🚀"
                  : "🧭"}
            </AppText>
          </View>

          <View
            style={
              styles.playerInfo
            }
          >
            <AppText
              variant="caption"
              style={[
                styles.playerLevel,

                isDungeon && {
                  color:
                    theme.colors
                      .xp,
                },

                isFuture && {
                  color:
                    theme.colors
                      .primary,
                },
              ]}
            >
              {isDungeon
                ? `LV ${playerProgression.level}`
                : isFuture
                  ? `SYSTEM LEVEL ${playerProgression.level}`
                  : `LEVEL ${playerProgression.level}`}
            </AppText>

            <AppText
              variant="title"
              style={
                styles.playerName
              }
            >
              {isDungeon
                ? "PLAYER"
                : "Player"}
            </AppText>
          </View>

          <View
            style={
              styles.resources
            }
          >
            <View
              style={[
                styles.resourceBox,

                {
                  backgroundColor:
                    altBackground,

                  borderColor:
                    isFuture
                      ? theme.colors
                          .primary
                      : theme.colors
                          .border,

                  borderRadius:
                    isDungeon
                      ? 2
                      : isFuture
                        ? 4
                        : 8,
                },
              ]}
            >
              <AppText
                style={{
                  color:
                    theme.colors
                      .xp,
                }}
              >
                {isFuture
                  ? "◈"
                  : "✦"}
              </AppText>

              <AppText
                variant="xp"
                numberOfLines={
                  1
                }
                style={
                  styles.resourceText
                }
              >
                {totalXP}
              </AppText>
            </View>

            <AppText
              style={[
                styles.headerArrow,

                {
                  color:
                    isDungeon
                      ? theme.colors
                          .xp
                      : isFuture
                        ? theme.colors
                            .primary
                        : theme.colors
                            .muted,
                },
              ]}
            >
              ›
            </AppText>
          </View>
        </Pressable>
      </Animated.View>

      {/* ======================================================
          PLAYER XP
      ====================================================== */}

      <Animated.View
        style={
          entranceStyle(xpAnim)
        }
      >
        <View
          style={
            styles.playerXPRow
          }
        >
          <AppText
            style={[
              styles.xpIcon,

              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            {isDungeon
              ? "◆"
              : isFuture
                ? "◈"
                : "⚡"}
          </AppText>

          <View
            style={
              styles.playerXPBar
            }
          >
            <ProgressBar
              progress={
                playerProgression.progress
              }
            />
          </View>

          <AppText
            variant="caption"
            numberOfLines={1}
            style={[
              styles.playerXPNumber,

              isFuture && {
                color:
                  theme.colors
                    .primary,
              },
            ]}
          >
            {
              playerProgression.xpInLevel
            }
            /
            {
              playerProgression.xpForLevel
            }
          </AppText>
        </View>

        <View
          style={
            styles.xpBreakdown
          }
        >
          <AppText
            variant="caption"
            style={
              styles.smallText
            }
          >
            {isFuture
              ? `Skill data ${activityXP} XP`
              : `Skills ${activityXP} XP`}
          </AppText>

          {bonusXP > 0 && (
            <>
              <AppText
                variant="caption"
                style={
                  styles.dot
                }
              >
                •
              </AppText>

              <AppText
                variant="caption"
                style={[
                  styles.smallText,

                  {
                    color:
                      theme.colors
                        .xp,
                  },
                ]}
              >
                Bonus +{bonusXP}
              </AppText>
            </>
          )}
        </View>

        <View
          style={[
            styles.divider,

            {
              backgroundColor:
                theme.colors
                  .border,
            },
          ]}
        />
      </Animated.View>

      {/* ======================================================
          SKILLS
      ====================================================== */}

      <Animated.View
        style={
          entranceStyle(
            skillsAnim
          )
        }
      >
        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <AppText
              variant="label"
              style={
                isFuture
                  ? {
                      color:
                        theme.colors
                          .primary,

                      letterSpacing:
                        1.2,
                    }
                  : undefined
              }
            >
              {isFuture
                ? "SKILL MODULES"
                : "SKILLS"}
            </AppText>

            <AppText variant="caption">
              {isDungeon
                ? "Your trained abilities"
                : isFuture
                  ? "Active performance systems"
                  : "Your strongest activities"}
            </AppText>
          </View>

          {activityProgress.length >
            0 && (
            <Pressable
              onPress={
                openAllActivities
              }
            >
              <AppText
                style={[
                  styles.link,

                  {
                    color:
                      theme.colors
                        .xp,
                  },
                ]}
              >
                {isFuture
                  ? "VIEW ALL"
                  : "See all"}
              </AppText>
            </Pressable>
          )}
        </View>

        {activityProgress.length ===
        0 ? (
          <Pressable
            onPress={() =>
              router.push(
                "/add" as never
              )
            }
            style={[
              styles.emptyRow,

              {
                backgroundColor:
                  panelBackground,

                borderColor:
                  isFuture
                    ? "#24536B"
                    : theme.colors
                        .border,

                borderRadius:
                  panelRadius,

                borderWidth:
                  panelBorderWidth,
              },

              isDungeon &&
                styles.dungeonPanel,

              isFuture &&
                styles.futurePanel,
            ]}
          >
            <AppText
              style={[
                styles.emptyIcon,

                {
                  color:
                    theme.colors
                      .xp,
                },
              ]}
            >
              {isFuture
                ? "◈"
                : "✦"}
            </AppText>

            <View
              style={
                styles.flex
              }
            >
              <AppText
                variant="title"
                style={
                  styles.rowTitle
                }
              >
                {isFuture
                  ? "Initialize first skill"
                  : "Start your first skill"}
              </AppText>

              <AppText variant="caption">
                {isFuture
                  ? "Log activity data to begin"
                  : "Log an activity to begin"}
              </AppText>
            </View>
          </Pressable>
        ) : (
          <View
            style={
              styles.list
            }
          >
            {topActivities.map(
              (activity) => (
                <Pressable
                  key={
                    activity.key
                  }
                  onPress={() =>
                    openSkill(
                      activity.title
                    )
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.skillRow,

                    {
                      backgroundColor:
                        panelBackground,

                      borderColor:
                        isFuture
                          ? "#24536B"
                          : theme.colors
                              .border,

                      borderRadius:
                        panelRadius,

                      borderWidth:
                        panelBorderWidth,

                      opacity:
                        pressed
                          ? 0.72
                          : 1,
                    },

                    isDungeon &&
                      styles.dungeonPanel,

                    isFuture &&
                      styles.futurePanel,
                  ]}
                >
                  <View
                    style={[
                      styles.iconBox,

                      {
                        backgroundColor:
                          altBackground,

                        borderRadius:
                          iconRadius,

                        borderColor:
                          isDungeon
                            ? theme
                                .colors
                                .primary
                            : isFuture
                              ? theme
                                  .colors
                                  .primary
                              : "transparent",

                        borderWidth:
                          isDungeon ||
                          isFuture
                            ? 1
                            : 0,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.rowIcon
                      }
                    >
                      {
                        activity.icon
                      }
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.skillMain
                    }
                  >
                    <View
                      style={
                        styles.rowTop
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
                            styles.rowTitle
                          }
                          numberOfLines={
                            1
                          }
                        >
                          {
                            activity.title
                          }
                        </AppText>

                        <AppText
                          variant="caption"
                        >
                          {
                            activity.entries
                          }{" "}
                          {activity.entries ===
                          1
                            ? "entry"
                            : "entries"}
                        </AppText>
                      </View>

                      <AppText
                        variant="xp"
                        numberOfLines={
                          1
                        }
                        style={[
                          styles.level,

                          isFuture && {
                            color:
                              theme
                                .colors
                                .primary,
                          },
                        ]}
                      >
                        LV{" "}
                        {
                          activity.level
                        }
                      </AppText>
                    </View>

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
                            activity.progress
                          }
                        />
                      </View>

                      <AppText
                        variant="caption"
                        numberOfLines={
                          1
                        }
                        style={
                          styles.progressNumber
                        }
                      >
                        {
                          activity.xpInLevel
                        }
                        /
                        {
                          activity.xpForNextLevel
                        }
                      </AppText>
                    </View>
                  </View>
                </Pressable>
              )
            )}

            {hiddenActivityCount >
              0 && (
              <Pressable
                onPress={
                  openAllActivities
                }
                style={
                  styles.moreRow
                }
              >
                <AppText
                  style={[
                    styles.moreText,

                    {
                      color:
                        theme.colors
                          .xp,
                    },
                  ]}
                >
                  +
                  {
                    hiddenActivityCount
                  }{" "}
                  {isFuture
                    ? "MODULES"
                    : "more skills"}
                </AppText>

                <AppText
                  style={{
                    color:
                      theme.colors
                        .xp,
                  }}
                >
                  →
                </AppText>
              </Pressable>
            )}
          </View>
        )}
      </Animated.View>

      {/* ======================================================
          GOALS
      ====================================================== */}

      <Animated.View
        style={
          entranceStyle(
            goalsAnim
          )
        }
      >
        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <AppText
              variant="label"
              style={
                isFuture
                  ? {
                      color:
                        theme.colors
                          .primary,

                      letterSpacing:
                        1.2,
                    }
                  : undefined
              }
            >
              {isDungeon
                ? "QUESTS"
                : isFuture
                  ? "MISSION TARGETS"
                  : "GOALS"}
            </AppText>

            <AppText variant="caption">
              {isDungeon
                ? "Your active objectives"
                : isFuture
                  ? "Current mission objectives"
                  : "What you're working toward"}
            </AppText>
          </View>

          <Pressable
            onPress={openGoals}
          >
            <AppText
              style={[
                styles.link,

                {
                  color:
                    theme.colors
                      .xp,
                },
              ]}
            >
              {isFuture
                ? "VIEW ALL"
                : "See all"}
            </AppText>
          </Pressable>
        </View>

        {/* ====================================================
            CREATE GOAL
        ==================================================== */}

        <Pressable
          onPress={createGoal}
          style={({
            pressed,
          }) => [
            styles.createGoal,

            {
              borderColor:
                theme.colors.xp,

              backgroundColor:
                altBackground,

              borderRadius:
                panelRadius,

              borderWidth:
                isDungeon
                  ? 2
                  : 1,

              opacity:
                pressed
                  ? 0.7
                  : 1,
            },

            isDungeon &&
              styles.dungeonPanel,

            isFuture &&
              styles.futurePanel,
          ]}
        >
          <View
            style={[
              styles.createGoalPlus,

              {
                backgroundColor:
                  theme.colors.xp,

                borderRadius:
                  isDungeon
                    ? 2
                    : isFuture
                      ? 4
                      : 10,
              },
            ]}
          >
            <AppText
              style={[
                styles.createGoalPlusText,

                {
                  color:
                    theme.colors
                      .background,
                },
              ]}
            >
              +
            </AppText>
          </View>

          <View
            style={
              styles.flex
            }
          >
            <AppText
              variant="title"
              style={
                styles.createGoalTitle
              }
            >
              {isDungeon
                ? "New Quest"
                : isFuture
                  ? "New Mission"
                  : "Create Goal"}
            </AppText>

            <AppText variant="caption">
              {isDungeon
                ? "Choose your next objective"
                : isFuture
                  ? "Initialize a new objective"
                  : "Set a target for yourself"}
            </AppText>
          </View>

          <AppText
            style={[
              styles.rowArrow,

              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            ›
          </AppText>
        </Pressable>

        {/* ====================================================
            ACTIVE GOALS
        ==================================================== */}

        {activeGoals.length >
          0 && (
          <View
            style={[
              styles.list,
              styles.goalList,
            ]}
          >
            {activeGoals.map(
              (goal) => {
                const progress =
                  goal.target > 0
                    ? Math.min(
                        goal.current /
                          goal.target,
                        1
                      )
                    : 0;

                const percentage =
                  Math.round(
                    progress *
                      100
                  );

                return (
                  <Pressable
                    key={
                      goal.id
                    }
                    onPress={
                      openGoals
                    }
                    style={({
                      pressed,
                    }) => [
                      styles.goalRow,

                      {
                        backgroundColor:
                          panelBackground,

                        borderColor:
                          isFuture
                            ? "#24536B"
                            : theme
                                .colors
                                .border,

                        borderRadius:
                          panelRadius,

                        borderWidth:
                          panelBorderWidth,

                        opacity:
                          pressed
                            ? 0.72
                            : 1,
                      },

                      isDungeon &&
                        styles.dungeonPanel,

                      isFuture &&
                        styles.futurePanel,
                    ]}
                  >
                    <View
                      style={[
                        styles.iconBox,

                        {
                          backgroundColor:
                            altBackground,

                          borderRadius:
                            iconRadius,

                          borderColor:
                            isFuture
                              ? theme
                                  .colors
                                  .primary
                              : "transparent",

                          borderWidth:
                            isFuture
                              ? 1
                              : 0,
                        },
                      ]}
                    >
                      <AppText
                        style={
                          styles.rowIcon
                        }
                      >
                        {
                          goal.icon
                        }
                      </AppText>
                    </View>

                    <View
                      style={
                        styles.goalMain
                      }
                    >
                      <View
                        style={
                          styles.rowTop
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
                              styles.rowTitle
                            }
                            numberOfLines={
                              1
                            }
                          >
                            {
                              goal.title
                            }
                          </AppText>

                          <AppText
                            variant="caption"
                          >
                            {
                              goal.current
                            }{" "}
                            /{" "}
                            {
                              goal.target
                            }{" "}
                            {
                              goal.unit
                            }
                          </AppText>
                        </View>

                        <AppText
                          variant="xp"
                          numberOfLines={
                            1
                          }
                          style={[
                            styles.percentage,

                            isFuture && {
                              color:
                                theme
                                  .colors
                                  .primary,
                            },
                          ]}
                        >
                          {
                            percentage
                          }
                          %
                        </AppText>
                      </View>

                      <View
                        style={
                          styles.goalProgress
                        }
                      >
                        <ProgressBar
                          progress={
                            progress
                          }
                        />
                      </View>
                    </View>
                  </Pressable>
                );
              }
            )}
          </View>
        )}
      </Animated.View>

      {/* ======================================================
          BONUS CHALLENGE
      ====================================================== */}

      <Animated.View
        style={
          entranceStyle(
            bonusAnim
          )
        }
      >
        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <AppText
              variant="label"
              style={
                isFuture
                  ? {
                      color:
                        theme.colors
                          .primary,

                      letterSpacing:
                        1.2,
                    }
                  : undefined
              }
            >
              {isDungeon
                ? "BONUS QUEST"
                : isFuture
                  ? "SIDE MISSION"
                  : "BONUS CHALLENGE"}
            </AppText>

            <AppText variant="caption">
              {isFuture
                ? "Optional XP protocol"
                : "Optional extra XP"}
            </AppText>
          </View>
        </View>

        {randomQuest ? (
          <Pressable
            onPress={openGoals}
            style={({
              pressed,
            }) => [
              styles.bonusRow,

              {
                backgroundColor:
                  panelBackground,

                borderColor:
                  isFuture
                    ? "#24536B"
                    : theme.colors
                        .border,

                borderRadius:
                  panelRadius,

                borderWidth:
                  panelBorderWidth,

                opacity:
                  pressed
                    ? 0.72
                    : 1,
              },

              isDungeon &&
                styles.dungeonPanel,

              isFuture &&
                styles.futurePanel,
            ]}
          >
            <View
              style={[
                styles.iconBox,

                {
                  backgroundColor:
                    altBackground,

                  borderRadius:
                    iconRadius,

                  borderColor:
                    isFuture
                      ? theme.colors
                          .primary
                      : "transparent",

                  borderWidth:
                    isFuture
                      ? 1
                      : 0,
                },
              ]}
            >
              <AppText
                style={
                  styles.rowIcon
                }
              >
                {randomQuest.icon}
              </AppText>
            </View>

            <View
              style={
                styles.goalMain
              }
            >
              <View
                style={
                  styles.rowTop
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
                      styles.rowTitle
                    }
                    numberOfLines={
                      1
                    }
                  >
                    {
                      randomQuest.title
                    }
                  </AppText>

                  <AppText
                    variant="caption"
                  >
                    +
                    {
                      randomQuest.rewardXP
                    }{" "}
                    XP
                  </AppText>
                </View>

                <AppText
                  style={[
                    styles.rowArrow,

                    {
                      color:
                        theme.colors
                          .xp,
                    },
                  ]}
                >
                  ›
                </AppText>
              </View>

              {randomQuest.status !==
                "available" && (
                <View
                  style={
                    styles.goalProgress
                  }
                >
                  <ProgressBar
                    progress={
                      randomQuestProgress
                    }
                  />
                </View>
              )}
            </View>
          </Pressable>
        ) : isQuestOnCooldown ? (
          <View
            style={[
              styles.cooldownRow,

              {
                backgroundColor:
                  panelBackground,

                borderColor:
                  isFuture
                    ? "#24536B"
                    : theme.colors
                        .border,

                borderRadius:
                  panelRadius,

                borderWidth:
                  panelBorderWidth,
              },

              isDungeon &&
                styles.dungeonPanel,

              isFuture &&
                styles.futurePanel,
            ]}
          >
            <AppText
              style={
                styles.cooldownIcon
              }
            >
              ⏳
            </AppText>

            <View
              style={
                styles.flex
              }
            >
              <AppText
                variant="title"
                style={
                  styles.rowTitle
                }
              >
                {isFuture
                  ? "Protocol cooldown"
                  : "Challenge cooldown"}
              </AppText>

              <AppText variant="caption">
                {isFuture
                  ? "Next side mission is initializing"
                  : "Your next bonus challenge is preparing"}
              </AppText>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.cooldownRow,

              {
                backgroundColor:
                  panelBackground,

                borderColor:
                  isFuture
                    ? "#24536B"
                    : theme.colors
                        .border,

                borderRadius:
                  panelRadius,

                borderWidth:
                  panelBorderWidth,
              },

              isDungeon &&
                styles.dungeonPanel,

              isFuture &&
                styles.futurePanel,
            ]}
          >
            <AppText
              style={[
                styles.cooldownIcon,

                {
                  color:
                    theme.colors
                      .xp,
                },
              ]}
            >
              {isFuture
                ? "◈"
                : "✦"}
            </AppText>

            <AppText variant="caption">
              {isFuture
                ? "No side mission detected"
                : "No bonus challenge right now"}
            </AppText>
          </View>
        )}
      </Animated.View>

      {/* ======================================================
          JOURNEY SUMMARY
      ====================================================== */}

      <Animated.View
        style={
          entranceStyle(
            journeyAnim
          )
        }
      >
        <View
          style={[
            styles.divider,
            styles.footerDivider,

            {
              backgroundColor:
                theme.colors
                  .border,
            },
          ]}
        />

        <View
          style={
            styles.footer
          }
        >
          <View
            style={
              styles.footerText
            }
          >
            <AppText
              variant="label"
              style={
                isFuture
                  ? {
                      color:
                        theme.colors
                          .primary,

                      letterSpacing:
                        1.2,
                    }
                  : undefined
              }
            >
              {isFuture
                ? "MISSION LOG"
                : "JOURNEY"}
            </AppText>

            <AppText variant="caption">
              {isFuture
                ? "Lifetime system record"
                : "Your progress never resets"}
            </AppText>
          </View>

          <View
            style={
              styles.footerStats
            }
          >
            <View
              style={
                styles.footerStat
              }
            >
              <AppText variant="caption">
                {isFuture
                  ? "LOGS"
                  : "Entries"}
              </AppText>

              <AppText
                variant="title"
                numberOfLines={1}
              >
                {
                  activities.length
                }
              </AppText>
            </View>

            <View
              style={
                styles.footerStat
              }
            >
              <AppText variant="caption">
                XP
              </AppText>

              <AppText
                variant="xp"
                numberOfLines={1}
              >
                {totalXP}
              </AppText>
            </View>
          </View>
        </View>
      </Animated.View>
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    flex: {
      flex: 1,
      minWidth: 0,
    },

    // ========================================================
    // THEME PANELS
    // ========================================================

    dungeonPanel: {
      shadowColor: "#000000",

      shadowOffset: {
        width: 3,
        height: 4,
      },

      shadowOpacity: 0.65,
      shadowRadius: 0,

      elevation: 5,
    },

    futurePanel: {
      borderColor: "#24536B",

      shadowColor: "#38D9FF",

      shadowOffset: {
        width: 0,
        height: 0,
      },

      shadowOpacity: 0.16,
      shadowRadius: 9,

      elevation: 3,
    },

    // ========================================================
    // FUTURE HUD
    // ========================================================

    futureSystemTag: {
      position: "absolute",

      top: -8,
      left: 12,

      paddingHorizontal: 6,
      paddingVertical: 1,

      backgroundColor:
        "#07111C",

      zIndex: 5,
    },

    futureSystemTagText: {
      fontSize: 7,
      lineHeight: 10,

      fontWeight: "900",

      letterSpacing: 1,
    },

    // ========================================================
    // PLAYER
    // ========================================================

    playerHeader: {
      minHeight: 68,

      borderWidth: 1,

      paddingHorizontal: 11,
      paddingVertical: 9,

      flexDirection: "row",
      alignItems: "center",
    },

    characterBox: {
      width: 46,
      height: 46,

      borderWidth: 1,

      alignItems: "center",
      justifyContent: "center",

      marginRight: 10,
    },

    character: {
      fontSize: 25,
    },

    playerInfo: {
      flex: 1,
      minWidth: 0,
    },

    playerLevel: {
      fontSize: 9,
      lineHeight: 12,

      fontWeight: "800",

      letterSpacing: 0.5,
    },

    playerName: {
      fontSize: 17,
      lineHeight: 20,
    },

    resources: {
      flexDirection: "row",
      alignItems: "center",

      gap: 7,

      flexShrink: 0,
    },

    resourceBox: {
      minWidth: 58,
      maxWidth: 110,
      height: 31,

      paddingHorizontal: 8,

      borderWidth: 1,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 4,
    },

    resourceText: {
      fontSize: 11,

      flexShrink: 1,
    },

    headerArrow: {
      fontSize: 24,
      lineHeight: 26,
    },

    // ========================================================
    // XP
    // ========================================================

    playerXPRow: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 9,
    },

    xpIcon: {
      width: 18,

      fontSize: 13,

      marginRight: 5,

      textAlign: "center",
    },

    playerXPBar: {
      flex: 1,
      minWidth: 0,
    },

    playerXPNumber: {
      minWidth: 70,
      maxWidth: 96,

      marginLeft: 8,

      textAlign: "right",

      fontSize: 9,
      fontWeight: "700",

      flexShrink: 0,
    },

    xpBreakdown: {
      flexDirection: "row",
      alignItems: "center",

      paddingLeft: 23,

      marginTop: 4,
    },

    smallText: {
      fontSize: 9,
    },

    dot: {
      marginHorizontal: 6,

      fontSize: 8,
    },

    divider: {
      height:
        StyleSheet.hairlineWidth,

      marginTop: 13,
    },

    // ========================================================
    // SECTION
    // ========================================================

    sectionHeader: {
      marginTop: 19,
      marginBottom: 8,

      flexDirection: "row",
      alignItems: "flex-end",

      justifyContent:
        "space-between",

      gap: 12,
    },

    link: {
      fontSize: 12,
      fontWeight: "800",
    },

    list: {
      gap: 7,
    },

    // ========================================================
    // SHARED ROW
    // ========================================================

    iconBox: {
      width: 38,
      height: 38,

      alignItems: "center",
      justifyContent: "center",

      marginRight: 10,

      flexShrink: 0,
    },

    rowIcon: {
      fontSize: 18,
    },

    rowTitle: {
      fontSize: 14,
      lineHeight: 18,
    },

    rowTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    rowArrow: {
      fontSize: 23,
      lineHeight: 25,

      marginLeft: 8,
    },

    // ========================================================
    // SKILLS
    // ========================================================

    skillRow: {
      minHeight: 67,

      paddingHorizontal: 10,

      flexDirection: "row",
      alignItems: "center",
    },

    skillMain: {
      flex: 1,
      minWidth: 0,

      paddingVertical: 8,
    },

    level: {
      minWidth: 38,

      fontSize: 10,

      marginLeft: 8,

      textAlign: "right",

      flexShrink: 0,
    },

    progressRow: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 5,
    },

    progressBar: {
      flex: 1,
      minWidth: 0,
    },

    progressNumber: {
      minWidth: 68,
      maxWidth: 90,

      marginLeft: 7,

      textAlign: "right",

      fontSize: 8,

      flexShrink: 0,
    },

    emptyRow: {
      minHeight: 61,

      paddingHorizontal: 12,

      flexDirection: "row",
      alignItems: "center",
    },

    emptyIcon: {
      fontSize: 20,

      marginRight: 12,
    },

    moreRow: {
      minHeight: 34,

      paddingHorizontal: 4,

      flexDirection: "row",
      alignItems: "center",

      justifyContent:
        "space-between",
    },

    moreText: {
      fontSize: 11,
      fontWeight: "800",
    },

    // ========================================================
    // CREATE GOAL
    // ========================================================

    createGoal: {
      minHeight: 61,

      paddingHorizontal: 11,

      flexDirection: "row",
      alignItems: "center",
    },

    createGoalPlus: {
      width: 35,
      height: 35,

      alignItems: "center",
      justifyContent: "center",

      marginRight: 10,
    },

    createGoalPlusText: {
      fontSize: 24,
      lineHeight: 26,

      fontWeight: "600",
    },

    createGoalTitle: {
      fontSize: 14,
      lineHeight: 17,
    },

    goalList: {
      marginTop: 7,
    },

    goalRow: {
      minHeight: 65,

      paddingHorizontal: 10,

      flexDirection: "row",
      alignItems: "center",
    },

    goalMain: {
      flex: 1,
      minWidth: 0,

      paddingVertical: 8,
    },

    percentage: {
      minWidth: 38,

      fontSize: 10,

      marginLeft: 8,

      textAlign: "right",

      flexShrink: 0,
    },

    goalProgress: {
      marginTop: 5,
    },

    // ========================================================
    // BONUS
    // ========================================================

    bonusRow: {
      minHeight: 65,

      paddingHorizontal: 10,

      flexDirection: "row",
      alignItems: "center",
    },

    cooldownRow: {
      minHeight: 59,

      paddingHorizontal: 12,

      flexDirection: "row",
      alignItems: "center",
    },

    cooldownIcon: {
      fontSize: 19,

      marginRight: 11,
    },

    // ========================================================
    // FOOTER
    // ========================================================

    footerDivider: {
      marginTop: 20,
    },

    footer: {
      paddingTop: 12,

      flexDirection: "row",
      alignItems: "center",

      justifyContent:
        "space-between",

      gap: 12,
    },

    footerText: {
      flex: 1,
      minWidth: 0,
    },

    footerStats: {
      flexDirection: "row",

      gap: 18,

      flexShrink: 0,
    },

    footerStat: {
      alignItems: "flex-end",

      minWidth: 42,
    },
  });