import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AppButton from "../../components/AppButton";
import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import ProgressBar from "../../components/ProgressBar";

import {
  useApp,
} from "../../context/AppContext";

import {
  useTheme,
} from "../../context/ThemeContext";

// ============================================================
// HELPERS
// ============================================================

function formatQuestValue(
  value: number
) {
  if (
    Number.isInteger(value)
  ) {
    return value.toString();
  }

  return value.toFixed(1);
}

function formatCooldown(
  milliseconds: number
) {
  const safeMilliseconds =
    Math.max(
      0,
      milliseconds
    );

  const totalMinutes =
    Math.ceil(
      safeMilliseconds /
        60000
    );

  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;

  if (
    hours <= 0
  ) {
    return `${minutes}m`;
  }

  if (
    minutes === 0
  ) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

// ============================================================
// SCREEN
// ============================================================

export default function GoalsScreen() {
  const {
    goals,
    deleteGoal,
    isLoading,

    randomQuest,
    questCooldownUntil,
    isQuestOnCooldown,

    generateRandomQuest,
    rerollRandomQuest,
    acceptRandomQuest,
    claimRandomQuest,
  } = useApp();

  const {
    theme,
    themeName,
  } = useTheme();

  const isDungeon =
    themeName === "dungeon";

  const isFuture =
    themeName === "future";

  const [
    now,
    setNow,
  ] =
    useState(
      Date.now()
    );

  // ==========================================================
  // ANIMATION VALUES
  // ==========================================================

  const screenAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const headerAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const questAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const personalAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const listAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // ==========================================================
  // ENTRANCE ANIMATION
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      const values = [
        screenAnim,
        headerAnim,
        questAnim,
        personalAnim,
        listAnim,
      ];

      values.forEach(
        value => {
          value.stopAnimation();
          value.setValue(0);
        }
      );

      const duration =
        isDungeon
          ? 150
          : isFuture
            ? 230
            : 280;

      const stagger =
        isDungeon
          ? 45
          : isFuture
            ? 65
            : 80;

      const screenAnimation =
        Animated.timing(
          screenAnim,
          {
            toValue: 1,
            duration:
              isDungeon
                ? 110
                : 170,
            useNativeDriver: true,
          }
        );

      const createAnimation = (
        value: Animated.Value
      ) =>
        Animated.timing(
          value,
          {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }
        );

      const animation =
        Animated.sequence([
          screenAnimation,

          Animated.stagger(
            stagger,
            [
              createAnimation(
                headerAnim
              ),

              createAnimation(
                questAnim
              ),

              createAnimation(
                personalAnim
              ),

              createAnimation(
                listAnim
              ),
            ]
          ),
        ]);

      animation.start();

      return () => {
        animation.stop();
      };
    }, [
      screenAnim,
      headerAnim,
      questAnim,
      personalAnim,
      listAnim,
      isDungeon,
      isFuture,
    ])
  );

  // ==========================================================
  // ANIMATION STYLE
  // ==========================================================

  function entranceStyle(
    value: Animated.Value
  ) {
    const distance =
      isDungeon
        ? 8
        : isFuture
          ? 16
          : 13;

    return {
      opacity: value,

      transform: [
        {
          translateY:
            value.interpolate({
              inputRange: [
                0,
                1,
              ],

              outputRange: [
                distance,
                0,
              ],
            }),
        },

        {
          scale:
            value.interpolate({
              inputRange: [
                0,
                1,
              ],

              outputRange:
                isDungeon
                  ? [
                      0.995,
                      1,
                    ]
                  : isFuture
                    ? [
                        0.975,
                        1,
                      ]
                    : [
                        0.99,
                        1,
                      ],
            }),
        },
      ],
    };
  }

  // ==========================================================
  // LIVE COOLDOWN DISPLAY
  // ==========================================================

  useEffect(() => {
    if (
      !questCooldownUntil
    ) {
      return;
    }

    const timer =
      setInterval(
        () => {
          setNow(
            Date.now()
          );
        },
        30000
      );

    return () =>
      clearInterval(
        timer
      );
  }, [
    questCooldownUntil,
  ]);

  // ==========================================================
  // DELETE GOAL
  // ==========================================================

  function confirmDelete(
    id: number,
    title: string
  ) {
    Alert.alert(
      "Delete goal?",
      title,
      [
        {
          text:
            "Cancel",

          style:
            "cancel",
        },

        {
          text:
            "Delete",

          style:
            "destructive",

          onPress:
            () =>
              deleteGoal(
                id
              ),
        },
      ]
    );
  }

  // ==========================================================
  // QUEST VALUES
  // ==========================================================

  const questProgress =
    randomQuest &&
    randomQuest.target > 0
      ? Math.min(
          randomQuest.progress /
            randomQuest.target,
          1
        )
      : 0;

  const cooldownRemaining =
    questCooldownUntil
      ? Math.max(
          0,
          questCooldownUntil.getTime() -
            now
        )
      : 0;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <AppScreen>
      <Animated.View
        style={[
          styles.screen,

          {
            opacity:
              screenAnim,
          },
        ]}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <Animated.View
          style={
            entranceStyle(
              headerAnim
            )
          }
        >
          <View
            style={
              styles.header
            }
          >
            <AppText
              variant="pageTitle"
              style={[
                isDungeon &&
                  styles.dungeonTitle,

                isFuture &&
                  styles.futureTitle,
              ]}
            >
              Quests
            </AppText>

            <AppText
              variant="secondary"
            >
              Turn real-life progress
              into rewards.
            </AppText>
          </View>
        </Animated.View>

        {/* ====================================================
            BONUS QUEST SECTION
        ==================================================== */}

        <Animated.View
          style={
            entranceStyle(
              questAnim
            )
          }
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <AppText
              variant="label"
              style={[
                isFuture && {
                  color:
                    theme.colors.primary,

                  letterSpacing:
                    1.2,
                },
              ]}
            >
              {isDungeon
                ? "BONUS QUEST"
                : isFuture
                  ? "SIDE MISSION"
                  : "BONUS QUEST"}
            </AppText>

            <View
              style={[
                styles.randomBadge,

                {
                  backgroundColor:
                    theme.colors
                      .cardAlt,

                  borderColor:
                    isFuture
                      ? theme.colors
                          .primary
                      : theme.colors
                          .border,
                },

                isDungeon &&
                  styles.dungeonBadge,

                isFuture &&
                  styles.futureBadge,
              ]}
            >
              <AppText
                style={
                  styles.randomBadgeIcon
                }
              >
                🎲
              </AppText>

              <AppText
                variant="caption"
                style={
                  styles.randomBadgeText
                }
              >
                {isFuture
                  ? "RANDOMIZED"
                  : "RANDOM"}
              </AppText>
            </View>
          </View>

          {/* ==================================================
              ACTIVE / AVAILABLE RANDOM QUEST
          ================================================== */}

          {!isLoading &&
            randomQuest && (
              <AppCard
                style={[
                  styles.questCard,

                  isDungeon &&
                    styles.dungeonCard,

                  isFuture &&
                    styles.futureCard,
                ]}
              >
                <View
                  style={
                    styles.questTop
                  }
                >
                  <View
                    style={[
                      styles.questIconBox,

                      {
                        backgroundColor:
                          theme.colors
                            .cardAlt,

                        borderColor:
                          isFuture
                            ? theme.colors
                                .primary
                            : theme.colors
                                .border,
                      },

                      isDungeon &&
                        styles.dungeonIconBox,

                      isFuture &&
                        styles.futureIconBox,
                    ]}
                  >
                    <AppText
                      style={
                        styles.questIcon
                      }
                    >
                      {
                        randomQuest.icon
                      }
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.questHeading
                    }
                  >
                    <AppText
                      variant="title"
                      style={
                        styles.questTitle
                      }
                    >
                      {
                        randomQuest.title
                      }
                    </AppText>

                    <AppText
                      variant="secondary"
                      style={
                        styles.questDescription
                      }
                    >
                      {
                        randomQuest.description
                      }
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.rewardBox
                    }
                  >
                    <AppText
                      variant="label"
                    >
                      REWARD
                    </AppText>

                    <AppText
                      variant="xp"
                      style={
                        styles.rewardXP
                      }
                    >
                      +
                      {
                        randomQuest.rewardXP
                      }
                    </AppText>

                    <AppText
                      variant="caption"
                    >
                      XP
                    </AppText>
                  </View>
                </View>

                {/* ============================================
                    AVAILABLE
                ============================================ */}

                {randomQuest.status ===
                  "available" && (
                  <>
                    <View
                      style={[
                        styles.availableInfo,

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
                          TARGET
                        </AppText>

                        <AppText
                          style={
                            styles.targetValue
                          }
                        >
                          {
                            formatQuestValue(
                              randomQuest.target
                            )
                          }{" "}
                          {
                            randomQuest.unit
                          }
                        </AppText>
                      </View>

                      <View
                        style={
                          styles.availableStatus
                        }
                      >
                        <AppText
                          variant="label"
                        >
                          STATUS
                        </AppText>

                        <AppText
                          style={[
                            styles.availableText,

                            {
                              color:
                                theme.colors
                                  .xp,
                            },
                          ]}
                        >
                          AVAILABLE
                        </AppText>
                      </View>
                    </View>

                    <View
                      style={
                        styles.questActions
                      }
                    >
                      <Pressable
                        onPress={
                          rerollRandomQuest
                        }
                        style={({
                          pressed,
                        }) => [
                          styles.reselectButton,

                          {
                            backgroundColor:
                              pressed
                                ? theme
                                    .colors
                                    .cardAlt
                                : "transparent",

                            borderColor:
                              theme
                                .colors
                                .border,
                          },

                          isDungeon &&
                            styles.dungeonButton,

                          isFuture &&
                            styles.futureButton,
                        ]}
                      >
                        <AppText
                          variant="secondary"
                          style={
                            styles.reselectText
                          }
                        >
                          ↻ Reselect
                        </AppText>
                      </Pressable>

                      <Pressable
                        onPress={
                          acceptRandomQuest
                        }
                        style={({
                          pressed,
                        }) => [
                          styles.acceptButton,

                          {
                            backgroundColor:
                              theme
                                .colors
                                .xp,

                            opacity:
                              pressed
                                ? 0.82
                                : 1,
                          },

                          isDungeon &&
                            styles.dungeonButton,

                          isFuture &&
                            styles.futureButton,
                        ]}
                      >
                        <AppText
                          style={[
                            styles.acceptText,

                            {
                              color:
                                theme
                                  .colors
                                  .background,
                            },
                          ]}
                        >
                          ACCEPT QUEST
                        </AppText>
                      </Pressable>
                    </View>
                  </>
                )}

                {/* ============================================
                    ACCEPTED
                ============================================ */}

                {randomQuest.status ===
                  "accepted" && (
                  <View
                    style={
                      styles.progressBlock
                    }
                  >
                    <View
                      style={
                        styles.progressTop
                      }
                    >
                      <View>
                        <AppText
                          variant="label"
                        >
                          PROGRESS
                        </AppText>

                        <AppText
                          style={
                            styles.progressValue
                          }
                        >
                          {
                            formatQuestValue(
                              randomQuest.progress
                            )
                          }{" "}
                          /{" "}
                          {
                            formatQuestValue(
                              randomQuest.target
                            )
                          }{" "}
                          {
                            randomQuest.unit
                          }
                        </AppText>
                      </View>

                      <View
                        style={
                          styles.inProgressStatus
                        }
                      >
                        <AppText
                          variant="label"
                        >
                          STATUS
                        </AppText>

                        <AppText
                          style={[
                            styles.statusText,

                            {
                              color:
                                theme
                                  .colors
                                  .xp,
                            },
                          ]}
                        >
                          ACTIVE
                        </AppText>
                      </View>
                    </View>

                    <ProgressBar
                      progress={
                        questProgress
                      }
                    />

                    <AppText
                      variant="caption"
                      style={
                        styles.progressHint
                      }
                    >
                      New activities
                      logged from now on
                      count toward this
                      quest.
                    </AppText>
                  </View>
                )}

                {/* ============================================
                    COMPLETED
                ============================================ */}

                {randomQuest.status ===
                  "completed" && (
                  <>
                    <View
                      style={[
                        styles.completeBox,

                        {
                          backgroundColor:
                            theme
                              .colors
                              .cardAlt,

                          borderColor:
                            theme
                              .colors
                              .success,
                        },
                      ]}
                    >
                      <View>
                        <AppText
                          variant="label"
                        >
                          QUEST COMPLETE
                        </AppText>

                        <AppText
                          style={[
                            styles.completeText,

                            {
                              color:
                                theme
                                  .colors
                                  .success,
                            },
                          ]}
                        >
                          ✓ Target reached
                        </AppText>
                      </View>

                      <AppText
                        style={
                          styles.completeIcon
                        }
                      >
                        🏆
                      </AppText>
                    </View>

                    <ProgressBar
                      progress={1}
                    />

                    <View
                      style={
                        styles.claimButton
                      }
                    >
                      <AppButton
                        title={`Claim +${randomQuest.rewardXP} XP`}
                        onPress={
                          claimRandomQuest
                        }
                      />
                    </View>
                  </>
                )}
              </AppCard>
            )}

          {/* ==================================================
              COOLDOWN
          ================================================== */}

          {!isLoading &&
            !randomQuest &&
            isQuestOnCooldown && (
              <AppCard
                variant="alt"
                style={[
                  styles.cooldownCard,

                  isDungeon &&
                    styles.dungeonCard,

                  isFuture &&
                    styles.futureCard,
                ]}
              >
                <View
                  style={
                    styles.cooldownTop
                  }
                >
                  <View
                    style={[
                      styles.cooldownIcon,

                      {
                        borderColor:
                          theme
                            .colors
                            .border,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.cooldownEmoji
                      }
                    >
                      ⏳
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
                        styles.cooldownTitle
                      }
                    >
                      Quest Cooldown
                    </AppText>

                    <AppText
                      variant="secondary"
                    >
                      Your next bonus
                      challenge is
                      preparing.
                    </AppText>
                  </View>
                </View>

                <View
                  style={[
                    styles.nextQuestBox,

                    {
                      borderTopColor:
                        theme
                          .colors
                          .border,
                    },
                  ]}
                >
                  <AppText
                    variant="label"
                  >
                    NEXT QUEST
                  </AppText>

                  <AppText
                    variant="xp"
                    style={
                      styles.cooldownTime
                    }
                  >
                    {
                      formatCooldown(
                        cooldownRemaining
                      )
                    }
                  </AppText>
                </View>
              </AppCard>
            )}

          {/* ==================================================
              NO QUEST
          ================================================== */}

          {!isLoading &&
            !randomQuest &&
            !isQuestOnCooldown && (
              <AppCard
                variant="alt"
                style={[
                  styles.noQuestCard,

                  isDungeon &&
                    styles.dungeonCard,

                  isFuture &&
                    styles.futureCard,
                ]}
              >
                <AppText
                  style={
                    styles.noQuestIcon
                  }
                >
                  🎲
                </AppText>

                <AppText
                  variant="title"
                >
                  Ready for a challenge?
                </AppText>

                <AppText
                  variant="secondary"
                  style={
                    styles.noQuestText
                  }
                >
                  Generate a random
                  challenge for bonus XP.
                </AppText>

                <View
                  style={
                    styles.generateButton
                  }
                >
                  <AppButton
                    title="Generate Quest"
                    onPress={
                      generateRandomQuest
                    }
                  />
                </View>
              </AppCard>
            )}
        </Animated.View>

        {/* ====================================================
            PERSONAL GOALS
        ==================================================== */}

        <Animated.View
          style={
            entranceStyle(
              personalAnim
            )
          }
        >
          <View
            style={
              styles.goalsHeader
            }
          >
            <View>
              <AppText
                variant="label"
                style={[
                  isFuture && {
                    color:
                      theme.colors.primary,

                    letterSpacing:
                      1.2,
                  },
                ]}
              >
                {isFuture
                  ? "MISSION TARGETS"
                  : "PERSONAL GOALS"}
              </AppText>

              <AppText
                variant="secondary"
                style={
                  styles.goalsSubtitle
                }
              >
                {isFuture
                  ? "Long-term mission objectives."
                  : "Your long-term milestones."}
              </AppText>
            </View>

            <View
              style={[
                styles.goalCount,

                {
                  backgroundColor:
                    theme.colors
                      .cardAlt,

                  borderColor:
                    isFuture
                      ? theme.colors
                          .primary
                      : theme.colors
                          .border,
                },

                isDungeon &&
                  styles.dungeonGoalCount,

                isFuture &&
                  styles.futureGoalCount,
              ]}
            >
              <AppText
                variant="xp"
                style={
                  styles.goalCountText
                }
              >
                {goals.length}
              </AppText>
            </View>
          </View>

          <AppButton
            title={
              isDungeon
                ? "+ New Quest"
                : isFuture
                  ? "+ New Mission"
                  : "+ Create Goal"
            }
            onPress={() =>
              router.push(
                "/create-goal"
              )
            }
          />
        </Animated.View>

        {/* ====================================================
            GOAL LIST
        ==================================================== */}

        <Animated.View
          style={[
            styles.list,

            entranceStyle(
              listAnim
            ),
          ]}
        >
          {!isLoading &&
            goals.length ===
              0 && (
              <AppCard
                variant="alt"
                style={[
                  isDungeon &&
                    styles.dungeonCard,

                  isFuture &&
                    styles.futureCard,
                ]}
              >
                <AppText
                  variant="title"
                >
                  No goals yet
                </AppText>

                <AppText
                  variant="secondary"
                  style={
                    styles.emptyText
                  }
                >
                  Create a goal and
                  matching activities
                  will update it
                  automatically.
                </AppText>
              </AppCard>
            )}

          {goals.map(
            goal => {
              const progress =
                goal.target > 0
                  ? Math.min(
                      goal.current /
                        goal.target,
                      1
                    )
                  : 0;

              const complete =
                goal.current >=
                goal.target;

              return (
                <AppCard
                  key={
                    goal.id
                  }
                  style={[
                    styles.goal,

                    isDungeon &&
                      styles.dungeonCard,

                    isFuture &&
                      styles.futureCard,
                  ]}
                >
                  <View
                    style={
                      styles.goalTop
                    }
                  >
                    <AppText
                      style={
                        styles.goalIcon
                      }
                    >
                      {
                        goal.icon
                      }
                    </AppText>

                    <View
                      style={
                        styles.flex
                      }
                    >
                      <AppText
                        variant="title"
                        style={
                          styles.goalTitle
                        }
                      >
                        {
                          goal.title
                        }
                      </AppText>

                      <AppText
                        variant="secondary"
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

                    {complete && (
                      <AppText
                        style={{
                          color:
                            theme
                              .colors
                              .success,

                          fontWeight:
                            "800",
                        }}
                      >
                        DONE
                      </AppText>
                    )}
                  </View>

                  <ProgressBar
                    progress={
                      progress
                    }
                  />

                  <View
                    style={
                      styles.bottom
                    }
                  >
                    <AppText
                      variant="caption"
                    >
                      {Math.round(
                        progress *
                          100
                      )}
                      %
                    </AppText>

                    <View />
                  </View>

                  <AppButton
                    title="Delete Goal"
                    onPress={() =>
                      confirmDelete(
                        goal.id,
                        goal.title
                      )
                    }
                  />
                </AppCard>
              );
            }
          )}
        </Animated.View>
      </Animated.View>
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    screen: {
      width: "100%",
    },

    // ========================================================
    // THEME
    // ========================================================

    dungeonTitle: {
      fontFamily: "Menlo",
      letterSpacing: 1.4,
    },

    futureTitle: {
      letterSpacing: 1,
    },

    dungeonCard: {
      borderRadius: 3,
      borderWidth: 2,

      shadowColor: "#000000",

      shadowOffset: {
        width: 3,
        height: 4,
      },

      shadowOpacity: 0.6,
      shadowRadius: 0,

      elevation: 5,
    },

    futureCard: {
      borderRadius: 8,

      shadowColor: "#38D9FF",

      shadowOffset: {
        width: 0,
        height: 0,
      },

      shadowOpacity: 0.13,
      shadowRadius: 8,

      elevation: 3,
    },

    dungeonBadge: {
      borderRadius: 2,
      borderWidth: 2,
    },

    futureBadge: {
      borderRadius: 5,
    },

    dungeonIconBox: {
      borderRadius: 2,
      borderWidth: 2,
    },

    futureIconBox: {
      borderRadius: 6,
    },

    dungeonButton: {
      borderRadius: 2,
    },

    futureButton: {
      borderRadius: 6,
    },

    dungeonGoalCount: {
      borderRadius: 2,
      borderWidth: 2,
    },

    futureGoalCount: {
      borderRadius: 5,
    },

    // ========================================================
    // HEADER
    // ========================================================

    header: {
      marginBottom: 22,
    },

    // ========================================================
    // SECTION HEADER
    // ========================================================

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: 8,
    },

    randomBadge: {
      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderRadius: 20,

      paddingHorizontal: 9,
      paddingVertical: 5,
    },

    randomBadgeIcon: {
      fontSize: 12,
      marginRight: 4,
    },

    randomBadgeText: {
      fontSize: 9,
      fontWeight: "800",
    },

    // ========================================================
    // RANDOM QUEST
    // ========================================================

    questCard: {
      gap: 15,
    },

    questTop: {
      flexDirection: "row",

      alignItems:
        "flex-start",
    },

    questIconBox: {
      width: 48,
      height: 48,

      borderRadius: 11,
      borderWidth: 1,

      alignItems: "center",

      justifyContent:
        "center",

      marginRight: 11,
    },

    questIcon: {
      fontSize: 25,
    },

    questHeading: {
      flex: 1,
      paddingRight: 8,
    },

    questTitle: {
      fontSize: 18,
      lineHeight: 22,
    },

    questDescription: {
      marginTop: 3,
      lineHeight: 18,
    },

    rewardBox: {
      alignItems:
        "flex-end",

      minWidth: 48,
    },

    rewardXP: {
      fontSize: 18,
      lineHeight: 21,

      marginTop: 2,
    },

    // ========================================================
    // AVAILABLE
    // ========================================================

    availableInfo: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      borderTopWidth:
        StyleSheet.hairlineWidth,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      paddingVertical: 12,
    },

    targetValue: {
      fontSize: 17,
      fontWeight: "800",

      marginTop: 3,
    },

    availableStatus: {
      alignItems: "flex-end",
    },

    availableText: {
      fontSize: 11,
      fontWeight: "900",

      marginTop: 4,

      letterSpacing: 0.5,
    },

    // ========================================================
    // QUEST ACTIONS
    // ========================================================

    questActions: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      gap: 22,
    },

    reselectButton: {
      minHeight: 46,

      flex: 0.82,

      borderWidth: 1,
      borderRadius: 11,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 10,
    },

    reselectText: {
      fontSize: 13,
      fontWeight: "700",
    },

    acceptButton: {
      minHeight: 46,

      flex: 1.18,

      borderRadius: 11,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 14,
    },

    acceptText: {
      fontSize: 12,
      fontWeight: "900",

      letterSpacing: 0.4,
    },

    // ========================================================
    // ACTIVE QUEST
    // ========================================================

    progressBlock: {
      gap: 9,
    },

    progressTop: {
      flexDirection: "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-between",
    },

    progressValue: {
      fontSize: 18,
      fontWeight: "800",

      marginTop: 3,
    },

    inProgressStatus: {
      alignItems: "flex-end",
    },

    statusText: {
      fontSize: 11,
      fontWeight: "900",

      marginTop: 3,

      letterSpacing: 0.5,
    },

    progressHint: {
      marginTop: 1,
    },

    // ========================================================
    // COMPLETE
    // ========================================================

    completeBox: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      borderWidth: 1,
      borderRadius: 11,

      padding: 12,
    },

    completeText: {
      fontSize: 16,
      fontWeight: "900",

      marginTop: 3,
    },

    completeIcon: {
      fontSize: 27,
    },

    claimButton: {
      marginTop: 1,
    },

    // ========================================================
    // COOLDOWN
    // ========================================================

    cooldownCard: {
      gap: 14,
    },

    cooldownTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    cooldownIcon: {
      width: 48,
      height: 48,

      borderWidth: 1,
      borderRadius: 11,

      alignItems: "center",

      justifyContent:
        "center",

      marginRight: 12,
    },

    cooldownEmoji: {
      fontSize: 24,
    },

    cooldownTitle: {
      fontSize: 18,
    },

    nextQuestBox: {
      borderTopWidth:
        StyleSheet.hairlineWidth,

      paddingTop: 12,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    cooldownTime: {
      fontSize: 20,
    },

    // ========================================================
    // NO QUEST
    // ========================================================

    noQuestCard: {
      alignItems: "center",

      paddingVertical: 24,
    },

    noQuestIcon: {
      fontSize: 32,

      marginBottom: 8,
    },

    noQuestText: {
      textAlign: "center",

      marginTop: 5,
    },

    generateButton: {
      width: "100%",

      marginTop: 16,
    },

    // ========================================================
    // PERSONAL GOALS
    // ========================================================

    goalsHeader: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginTop: 28,

      marginBottom: 12,
    },

    goalsSubtitle: {
      marginTop: 3,
    },

    goalCount: {
      minWidth: 38,
      height: 32,

      borderRadius: 16,
      borderWidth: 1,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 10,
    },

    goalCountText: {
      fontSize: 13,
    },

    // ========================================================
    // GOAL LIST
    // ========================================================

    list: {
      marginTop: 18,
      gap: 12,
    },

    goal: {
      gap: 13,
    },

    goalTop: {
      flexDirection: "row",

      alignItems: "center",
    },

    goalIcon: {
      fontSize: 28,

      marginRight: 12,
    },

    goalTitle: {
      fontSize: 17,

      marginBottom: 3,
    },

    flex: {
      flex: 1,
    },

    bottom: {
      flexDirection: "row",

      justifyContent:
        "space-between",
    },

    emptyText: {
      marginTop: 5,
    },
  });