import {
  useCallback,
  useRef,
} from "react";

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

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import ProgressBar from "../../components/ProgressBar";

import {
  BuddySpecies,
  useApp,
} from "../../context/AppContext";

import { useTheme } from "../../context/ThemeContext";
import { getAchievements } from "../../utils/achievements";

// ============================================================
// HELPERS
// ============================================================

function formatUnlockDate(
  date: Date | null
) {
  if (!date) {
    return "Unlocked";
  }

  return date.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function getBuddyIcon(
  species: BuddySpecies
) {
  switch (species) {
    case "dog":
      return "🐶";

    case "cat":
      return "🐱";

    case "dragon":
      return "🐲";

    case "robot":
      return "🤖";

    case "mystery":
      return "🥚";
  }
}

function getBuddySpeciesName(
  species: BuddySpecies
) {
  switch (species) {
    case "dog":
      return "Dog";

    case "cat":
      return "Cat";

    case "dragon":
      return "Dragon";

    case "robot":
      return "Robot";

    case "mystery":
      return "Mystery Egg";
  }
}

// ============================================================
// SCREEN
// ============================================================

export default function ProfileScreen() {
  const {
    activities,

    totalXP,
    activityXP,
    bonusXP,

    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,

    achievementUnlocks,

    buddy,
    buddyLifeStats,
    buddyUnspentBuildPoints,
  } = useApp();

  const {
    theme,
    themeName,
  } = useTheme();

  // ============================================================
  // THEME
  // ============================================================

  const isDungeon =
    themeName === "dungeon";

  const isFuture =
    themeName === "future";

  // ============================================================
  // ANIMATION VALUES
  // ============================================================

  const headerAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const playerAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const statsAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const xpAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const achievementsAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const buddyAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // ============================================================
  // ENTRANCE STYLE
  // ============================================================

  function entranceStyle(
    value: Animated.Value
  ) {
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
                isDungeon
                  ? 10
                  : 18,
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

              outputRange: [
                isFuture
                  ? 0.975
                  : 1,
                1,
              ],
            }),
        },
      ],
    };
  }

  // ============================================================
  // FOCUS ANIMATION
  // ============================================================

  useFocusEffect(
    useCallback(() => {
      const values = [
        headerAnim,
        playerAnim,
        statsAnim,
        xpAnim,
        achievementsAnim,
        buddyAnim,
      ];

      values.forEach(
        value =>
          value.setValue(0)
      );

      const animations =
        values.map(
          value =>
            Animated.spring(
              value,
              {
                toValue: 1,

                speed:
                  isDungeon
                    ? 30
                    : isFuture
                      ? 20
                      : 18,

                bounciness:
                  isDungeon
                    ? 0
                    : isFuture
                      ? 3
                      : 5,

                useNativeDriver:
                  true,
              }
            )
        );

      Animated.stagger(
        isDungeon
          ? 35
          : 65,
        animations
      ).start();

      return () => {
        values.forEach(
          value =>
            value.stopAnimation()
        );
      };
    }, [
      achievementsAnim,
      buddyAnim,
      headerAnim,
      isDungeon,
      isFuture,
      playerAnim,
      statsAnim,
      xpAnim,
    ])
  );

  // ============================================================
  // ACHIEVEMENTS
  // ============================================================

  const achievementSummary =
    getAchievements(
      activities,
      totalXP,
      achievementUnlocks
    );

  const {
    unlockedAchievements,
    unlockedCount,
    totalCount,
  } = achievementSummary;

  const latestAchievement =
    unlockedAchievements.length > 0
      ? unlockedAchievements[0]
      : null;

  const achievementProgress =
    totalCount > 0
      ? unlockedCount /
        totalCount
      : 0;

  const remainingAchievements =
    Math.max(
      totalCount -
        unlockedCount,
      0
    );

  // ============================================================
  // PLAYER PROGRESS
  // ============================================================

  const levelProgress =
    xpNeededForNextLevel > 0
      ? xpInCurrentLevel /
        xpNeededForNextLevel
      : 0;

  // ============================================================
  // BUDDY
  // ============================================================

  const buddyIcon =
    buddy
      ? getBuddyIcon(
          buddy.species
        )
      : "🥚";

  const buddySpecies =
    buddy
      ? getBuddySpeciesName(
          buddy.species
        )
      : null;

  // ============================================================
  // UI
  // ============================================================

  return (
    <AppScreen>
      {/* ========================================================
          HEADER
      ======================================================== */}

      <Animated.View
        style={entranceStyle(
          headerAnim
        )}
      >
        <View
          style={
            styles.header
          }
        >
          <AppText
            variant="pageTitle"
            style={
              isFuture
                ? styles.futureTitle
                : isDungeon
                  ? styles.dungeonTitle
                  : undefined
            }
          >
            {isFuture
              ? "PLAYER PROFILE"
              : "Player"}
          </AppText>

          <AppCard
            onPress={() =>
              router.push(
                "/settings"
              )
            }
            padding={10}
          >
            <AppText
              style={
                styles.gear
              }
            >
              ⚙️
            </AppText>
          </AppCard>
        </View>
      </Animated.View>

      {/* ========================================================
          PLAYER CARD
      ======================================================== */}

      <Animated.View
        style={entranceStyle(
          playerAnim
        )}
      >
        <AppCard
          variant="alt"
          style={[
            styles.profile,

            isDungeon &&
              styles.dungeonCard,

            isFuture &&
              styles.futureCard,
          ]}
        >
          <AppText
            style={
              styles.avatar
            }
          >
            {isDungeon
              ? "🛡️"
              : "🧑‍🚀"}
          </AppText>

          <AppText
            variant="title"
          >
            {isDungeon
              ? "PLAYER"
              : "Life Player"}
          </AppText>

          <AppText
            variant="secondary"
            style={
              styles.playerSubtitle
            }
          >
            Level {level} •{" "}
            {totalXP} lifetime XP
          </AppText>

          <View
            style={
              styles.bar
            }
          >
            <ProgressBar
              progress={
                levelProgress
              }
            />
          </View>

          <View
            style={
              styles.levelInfo
            }
          >
            <AppText
              variant="caption"
            >
              LEVEL {level}
            </AppText>

            <AppText
              variant="caption"
            >
              {xpInCurrentLevel} /{" "}
              {xpNeededForNextLevel} XP
            </AppText>
          </View>
        </AppCard>
      </Animated.View>

      {/* ========================================================
          PLAYER STATS
      ======================================================== */}

      <Animated.View
        style={entranceStyle(
          statsAnim
        )}
      >
        <View
          style={
            styles.stats
          }
        >
          <AppCard
            style={[
              styles.stat,
              styles.statSmall,
            ]}
          >
            <AppText
              style={
                styles.statIcon
              }
            >
              ◈
            </AppText>

            <AppText
              variant="pageTitle"
              style={
                styles.statNumber
              }
              numberOfLines={1}
            >
              {
                activities.length
              }
            </AppText>

            <AppText
              variant="caption"
              style={
                styles.statLabel
              }
              numberOfLines={1}
            >
              ENTRIES
            </AppText>
          </AppCard>

          <AppCard
            style={[
              styles.stat,
              styles.statXP,
            ]}
          >
            <AppText
              style={[
                styles.statIcon,
                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              ✦
            </AppText>

            <AppText
              variant="pageTitle"
              style={
                styles.statNumber
              }
              numberOfLines={1}
            >
              {activityXP}
            </AppText>

            <AppText
              variant="caption"
              style={
                styles.statLabel
              }
              numberOfLines={1}
            >
              SKILL XP
            </AppText>
          </AppCard>

          <AppCard
            style={[
              styles.stat,
              styles.statXP,
            ]}
          >
            <AppText
              style={[
                styles.statIcon,
                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              ⚡
            </AppText>

            <AppText
              variant="xp"
              style={
                styles.statNumber
              }
              numberOfLines={1}
            >
              {bonusXP}
            </AppText>

            <AppText
              variant="caption"
              style={
                styles.statLabel
              }
              numberOfLines={1}
            >
              BONUS XP
            </AppText>
          </AppCard>
        </View>
      </Animated.View>

      {/* ========================================================
          XP SUMMARY
      ======================================================== */}

      <Animated.View
        style={entranceStyle(
          xpAnim
        )}
      >
        <AppCard
          variant="alt"
          style={[
            styles.xpSummary,

            isDungeon &&
              styles.dungeonCard,

            isFuture &&
              styles.futureCard,
          ]}
        >
          <View
            style={
              styles.xpSummaryTop
            }
          >
            <View>
              <AppText
                variant="label"
              >
                PLAYER XP
              </AppText>

              <AppText
                variant="xp"
                style={
                  styles.totalXP
                }
              >
                {totalXP} XP
              </AppText>
            </View>

            <View
              style={
                styles.xpSummaryLevel
              }
            >
              <AppText
                variant="caption"
              >
                CURRENT LEVEL
              </AppText>

              <AppText
                variant="xp"
                style={
                  styles.summaryLevelNumber
                }
              >
                {level}
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.xpDivider,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          <View
            style={
              styles.xpSources
            }
          >
            <View
              style={
                styles.xpSource
              }
            >
              <View
                style={
                  styles.xpSourceTitle
                }
              >
                <AppText
                  style={[
                    styles.xpSourceIcon,
                    {
                      color:
                        theme.colors.xp,
                    },
                  ]}
                >
                  ✦
                </AppText>

                <AppText
                  variant="caption"
                >
                  Skills
                </AppText>
              </View>

              <AppText
                style={
                  styles.xpSourceValue
                }
              >
                {activityXP} XP
              </AppText>
            </View>

            <View
              style={
                styles.xpSource
              }
            >
              <View
                style={
                  styles.xpSourceTitle
                }
              >
                <AppText
                  style={[
                    styles.xpSourceIcon,
                    {
                      color:
                        theme.colors.xp,
                    },
                  ]}
                >
                  ⚡
                </AppText>

                <AppText
                  variant="caption"
                >
                  Bonus Quests
                </AppText>
              </View>

              <AppText
                style={
                  styles.xpSourceValue
                }
              >
                {bonusXP} XP
              </AppText>
            </View>
          </View>
        </AppCard>
      </Animated.View>

      {/* ========================================================
          ACHIEVEMENTS
      ======================================================== */}

      <Animated.View
        style={entranceStyle(
          achievementsAnim
        )}
      >
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
              Achievements
            </AppText>

            <AppText
              variant="caption"
            >
              Your permanent trophy
              collection
            </AppText>
          </View>
        </View>

        <AppCard
          onPress={() =>
            router.push(
              "/achievements"
            )
          }
          style={[
            styles.achievementCard,

            isDungeon &&
              styles.dungeonCard,

            isFuture &&
              styles.futureCard,
          ]}
        >
          <View
            style={
              styles.achievementTop
            }
          >
            <View
              style={
                styles.achievementTitleRow
              }
            >
              <View
                style={[
                  styles.achievementIconBox,
                  {
                    backgroundColor:
                      theme.colors.cardAlt,

                    borderColor:
                      theme.colors.xp,
                  },
                ]}
              >
                <AppText
                  style={
                    styles.achievementIcon
                  }
                >
                  🏆
                </AppText>
              </View>

              <View>
                <AppText
                  variant="label"
                >
                  COLLECTION
                </AppText>

                <AppText
                  variant="title"
                  style={
                    styles.achievementCount
                  }
                >
                  {unlockedCount} /{" "}
                  {totalCount} unlocked
                </AppText>
              </View>
            </View>

            <AppText
              style={[
                styles.arrow,
                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              →
            </AppText>
          </View>

          <View
            style={
              styles.achievementProgress
            }
          >
            <ProgressBar
              progress={
                achievementProgress
              }
            />
          </View>

          <View
            style={
              styles.achievementProgressInfo
            }
          >
            <AppText
              variant="caption"
            >
              {Math.round(
                achievementProgress *
                  100
              )}
              % complete
            </AppText>

            <AppText
              variant="caption"
            >
              {
                remainingAchievements
              }{" "}
              remaining
            </AppText>
          </View>

          {latestAchievement ? (
            <>
              <View
                style={[
                  styles.achievementDivider,
                  {
                    backgroundColor:
                      theme.colors.border,
                  },
                ]}
              />

              <View
                style={
                  styles.latestRow
                }
              >
                <View
                  style={
                    styles.latestLeft
                  }
                >
                  <View
                    style={[
                      styles.latestIconBox,
                      {
                        backgroundColor:
                          theme.colors
                            .cardAlt,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.latestIcon
                      }
                    >
                      {
                        latestAchievement.icon
                      }
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.latestInfo
                    }
                  >
                    <AppText
                      variant="caption"
                      style={
                        styles.latestLabel
                      }
                    >
                      LATEST TROPHY
                    </AppText>

                    <AppText
                      variant="title"
                      style={
                        styles.latestTitle
                      }
                    >
                      {
                        latestAchievement.title
                      }
                    </AppText>

                    <AppText
                      variant="caption"
                      style={
                        styles.latestDate
                      }
                    >
                      {formatUnlockDate(
                        latestAchievement.unlockedAt
                      )}
                    </AppText>
                  </View>
                </View>

                <AppText
                  variant="xp"
                  style={
                    styles.latestCheck
                  }
                >
                  ✓
                </AppText>
              </View>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.achievementDivider,
                  {
                    backgroundColor:
                      theme.colors.border,
                  },
                ]}
              />

              <View
                style={
                  styles.noTrophyRow
                }
              >
                <AppText
                  style={
                    styles.noTrophyIcon
                  }
                >
                  🎯
                </AppText>

                <View
                  style={
                    styles.flex
                  }
                >
                  <AppText
                    variant="title"
                  >
                    Your first trophy
                    awaits
                  </AppText>

                  <AppText
                    variant="secondary"
                    style={
                      styles.noTrophyText
                    }
                  >
                    Keep making real-life
                    progress to unlock
                    achievements.
                  </AppText>
                </View>
              </View>
            </>
          )}

          <View
            style={
              styles.viewCollection
            }
          >
            <AppText
              variant="xp"
              style={
                styles.viewCollectionText
              }
            >
              View collection
            </AppText>

            <AppText
              variant="xp"
              style={
                styles.viewCollectionArrow
              }
            >
              →
            </AppText>
          </View>
        </AppCard>
      </Animated.View>

      {/* ========================================================
          BUDDY
      ======================================================== */}

      <Animated.View
        style={entranceStyle(
          buddyAnim
        )}
      >
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
              Buddy
            </AppText>

            <AppText
              variant="caption"
            >
              Your real-life RPG companion
            </AppText>
          </View>
        </View>

        {buddy ? (
          <AppCard
            variant="alt"
            style={[
              styles.buddyCard,

              isDungeon &&
                styles.dungeonCard,

              isFuture &&
                styles.futureCard,
            ]}
          >
            <View
              style={
                styles.buddyTop
              }
            >
              <Pressable
                onPress={() =>
                  router.push(
                    "/buddy-home"
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.buddyPortraitButton,

                  pressed &&
                    styles.buddyPortraitPressed,
                ]}
              >
                <View
                  style={[
                    styles.buddyIconBox,
                    {
                      backgroundColor:
                        theme.colors.card,

                      borderColor:
                        theme.colors.xp,
                    },
                  ]}
                >
                  <AppText
                    style={
                      styles.buddyIcon
                    }
                  >
                    {buddyIcon}
                  </AppText>
                </View>
              </Pressable>

              <View
                style={
                  styles.flex
                }
              >
                <AppText
                  variant="label"
                >
                  {buddySpecies?.toUpperCase()}
                </AppText>

                <AppText
                  variant="title"
                  style={
                    styles.buddyName
                  }
                >
                  {buddy.name}
                </AppText>

                <AppText
                  variant="caption"
                >
                  Linked to Player
                  Level {level}
                </AppText>
              </View>

              <View
                style={[
                  styles.buddyLevelBadge,
                  {
                    backgroundColor:
                      theme.colors.xp,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.buddyLevelText,
                    {
                      color:
                        theme.colors
                          .background,
                    },
                  ]}
                >
                  LV {level}
                </AppText>
              </View>
            </View>

            <View
              style={[
                styles.buddyDivider,
                {
                  backgroundColor:
                    theme.colors.border,
                },
              ]}
            />

            <View
              style={
                styles.buddyLabelRow
              }
            >
              <AppText
                variant="label"
              >
                LIFE STATS
              </AppText>

              <AppText
                variant="caption"
              >
                Real-life progress
              </AppText>
            </View>

            <View
              style={
                styles.buddyStats
              }
            >
              <View
                style={
                  styles.buddyStat
                }
              >
                <AppText
                  style={
                    styles.buddyStatIcon
                  }
                >
                  ❤️
                </AppText>

                <AppText
                  variant="caption"
                  style={
                    styles.buddyStatLabel
                  }
                >
                  VIT
                </AppText>

                <AppText
                  style={
                    styles.buddyStatValue
                  }
                >
                  {
                    buddyLifeStats.vitality
                  }
                </AppText>
              </View>

              <View
                style={
                  styles.buddyStat
                }
              >
                <AppText
                  style={
                    styles.buddyStatIcon
                  }
                >
                  ⚔️
                </AppText>

                <AppText
                  variant="caption"
                  style={
                    styles.buddyStatLabel
                  }
                >
                  POW
                </AppText>

                <AppText
                  style={
                    styles.buddyStatValue
                  }
                >
                  {
                    buddyLifeStats.power
                  }
                </AppText>
              </View>

              <View
                style={
                  styles.buddyStat
                }
              >
                <AppText
                  style={
                    styles.buddyStatIcon
                  }
                >
                  🏃
                </AppText>

                <AppText
                  variant="caption"
                  style={
                    styles.buddyStatLabel
                  }
                >
                  AGI
                </AppText>

                <AppText
                  style={
                    styles.buddyStatValue
                  }
                >
                  {
                    buddyLifeStats.agility
                  }
                </AppText>
              </View>

              <View
                style={
                  styles.buddyStat
                }
              >
                <AppText
                  style={
                    styles.buddyStatIcon
                  }
                >
                  🧠
                </AppText>

                <AppText
                  variant="caption"
                  style={
                    styles.buddyStatLabel
                  }
                >
                  INT
                </AppText>

                <AppText
                  style={
                    styles.buddyStatValue
                  }
                >
                  {
                    buddyLifeStats.intelligence
                  }
                </AppText>
              </View>
            </View>

            <View
              style={[
                styles.buddyDivider,
                {
                  backgroundColor:
                    theme.colors.border,
                },
              ]}
            />

            <Pressable
              onPress={() =>
                router.push(
                  "/buddy"
                )
              }
              style={({
                pressed,
              }) => [
                styles.buddyBuildRow,

                pressed &&
                  styles.detailsPressed,
              ]}
            >
              <View
                style={
                  styles.buddyBuildStats
                }
              >
                <AppText
                  variant="caption"
                >
                  ✨ MAG{" "}
                  <AppText
                    style={
                      styles.buddyBuildValue
                    }
                  >
                    {buddy.magic}
                  </AppText>
                </AppText>

                <AppText
                  variant="caption"
                >
                  🛡️ DEF{" "}
                  <AppText
                    style={
                      styles.buddyBuildValue
                    }
                  >
                    {buddy.defense}
                  </AppText>
                </AppText>

                <AppText
                  variant="caption"
                >
                  🍀 LCK{" "}
                  <AppText
                    style={
                      styles.buddyBuildValue
                    }
                  >
                    {buddy.luck}
                  </AppText>
                </AppText>
              </View>

              <AppText
                style={[
                  styles.buddyArrow,
                  {
                    color:
                      theme.colors.xp,
                  },
                ]}
              >
                →
              </AppText>
            </Pressable>

            {buddyUnspentBuildPoints >
              0 && (
              <Pressable
                onPress={() =>
                  router.push(
                    "/buddy"
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.pointsAvailable,

                  {
                    backgroundColor:
                      theme.colors.card,

                    borderColor:
                      theme.colors.xp,
                  },

                  pressed &&
                    styles.detailsPressed,
                ]}
              >
                <AppText
                  style={[
                    styles.pointsAvailableIcon,
                    {
                      color:
                        theme.colors.xp,
                    },
                  ]}
                >
                  ✦
                </AppText>

                <AppText
                  variant="body"
                  style={
                    styles.pointsAvailableText
                  }
                >
                  {
                    buddyUnspentBuildPoints
                  }{" "}
                  build{" "}
                  {buddyUnspentBuildPoints ===
                  1
                    ? "point"
                    : "points"}{" "}
                  available
                </AppText>

                <AppText
                  style={{
                    color:
                      theme.colors.xp,
                  }}
                >
                  →
                </AppText>
              </Pressable>
            )}

            <Pressable
              onPress={() =>
                router.push(
                  "/buddy-home"
                )
              }
              style={({
                pressed,
              }) => [
                styles.openBuddy,

                pressed &&
                  styles.detailsPressed,
              ]}
            >
              <AppText
                variant="xp"
                style={
                  styles.openBuddyText
                }
              >
                Open Buddy
              </AppText>

              <AppText
                variant="xp"
                style={
                  styles.openBuddyArrow
                }
              >
                →
              </AppText>
            </Pressable>
          </AppCard>
        ) : (
          <AppCard
            variant="alt"
            style={[
              styles.buddyEmptyCard,

              isDungeon &&
                styles.dungeonCard,

              isFuture &&
                styles.futureCard,
            ]}
            onPress={() =>
              router.push(
                "/create-buddy"
              )
            }
          >
            <View
              style={[
                styles.buddyIconBox,
                {
                  backgroundColor:
                    theme.colors.card,

                  borderColor:
                    theme.colors.xp,
                },
              ]}
            >
              <AppText
                style={
                  styles.buddyIcon
                }
              >
                🥚
              </AppText>
            </View>

            <View
              style={
                styles.flex
              }
            >
              <AppText
                variant="label"
              >
                COMPANION
              </AppText>

              <AppText
                variant="title"
                style={
                  styles.buddyName
                }
              >
                Choose Your Buddy
              </AppText>

              <AppText
                variant="secondary"
                style={
                  styles.buddyDescription
                }
              >
                Your companion grows
                stronger through your
                real-life progress.
              </AppText>
            </View>

            <AppText
              style={[
                styles.buddyArrow,
                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              →
            </AppText>
          </AppCard>
        )}
      </Animated.View>
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // ==========================================================
    // THEME
    // ==========================================================

    dungeonCard: {
      borderRadius: 3,
      borderWidth: 2,
    },

    futureCard: {
      borderRadius: 8,
    },

    dungeonTitle: {
      fontFamily: "Menlo",
      letterSpacing: 1.4,
    },

    futureTitle: {
      letterSpacing: 1.2,
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    header: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: 18,
    },

    gear: {
      fontSize: 20,
    },

    // ==========================================================
    // PLAYER
    // ==========================================================

    profile: {
      alignItems: "center",
    },

    avatar: {
      fontSize: 56,
      marginBottom: 8,
    },

    playerSubtitle: {
      marginTop: 3,
    },

    bar: {
      width: "100%",
      marginTop: 16,
    },

    levelInfo: {
      width: "100%",

      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: 7,
    },

    // ==========================================================
    // STATS
    // ==========================================================

    stats: {
      flexDirection: "row",

      gap: 7,

      marginTop: 10,
    },

    stat: {
      alignItems: "center",

      paddingHorizontal: 4,
      paddingVertical: 14,

      minWidth: 0,
    },

    statSmall: {
      flex: 0.8,
    },

    statXP: {
      flex: 1.1,
    },

    statIcon: {
      fontSize: 14,
      lineHeight: 18,

      marginBottom: 2,
    },

    statNumber: {
      fontSize: 20,
      lineHeight: 25,

      width: "100%",

      textAlign: "center",
    },

    statLabel: {
      fontSize: 8,
      lineHeight: 11,

      marginTop: 2,

      textAlign: "center",

      fontWeight: "700",

      width: "100%",
    },

    // ==========================================================
    // XP SUMMARY
    // ==========================================================

    xpSummary: {
      marginTop: 10,
    },

    xpSummaryTop: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    totalXP: {
      fontSize: 24,
      lineHeight: 29,

      marginTop: 2,
    },

    xpSummaryLevel: {
      alignItems: "flex-end",
    },

    summaryLevelNumber: {
      fontSize: 24,
      lineHeight: 29,

      marginTop: 2,
    },

    xpDivider: {
      height:
        StyleSheet.hairlineWidth,

      marginVertical: 13,
    },

    xpSources: {
      flexDirection: "row",

      gap: 12,
    },

    xpSource: {
      flex: 1,
    },

    xpSourceTitle: {
      flexDirection: "row",

      alignItems: "center",
    },

    xpSourceIcon: {
      fontSize: 11,

      marginRight: 5,
    },

    xpSourceValue: {
      fontSize: 14,
      lineHeight: 18,

      fontWeight: "800",

      marginTop: 4,
    },

    // ==========================================================
    // SECTION
    // ==========================================================

    sectionHeader: {
      flexDirection: "row",

      alignItems: "flex-end",

      justifyContent:
        "space-between",

      marginTop: 24,
      marginBottom: 10,
    },

    sectionTitle: {
      fontSize: 20,
      lineHeight: 24,
    },

    // ==========================================================
    // ACHIEVEMENTS
    // ==========================================================

    achievementCard: {
      padding: 14,
    },

    achievementTop: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    achievementTitleRow: {
      flexDirection: "row",

      alignItems: "center",

      flex: 1,
    },

    achievementIconBox: {
      width: 46,
      height: 46,

      borderRadius: 12,

      borderWidth: 1,

      alignItems: "center",

      justifyContent:
        "center",

      marginRight: 11,
    },

    achievementIcon: {
      fontSize: 23,
    },

    achievementCount: {
      fontSize: 16,
      lineHeight: 20,

      marginTop: 2,
    },

    arrow: {
      fontSize: 24,
      lineHeight: 28,

      fontWeight: "700",

      marginLeft: 10,
    },

    achievementProgress: {
      marginTop: 14,
    },

    achievementProgressInfo: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      marginTop: 5,
    },

    achievementDivider: {
      height:
        StyleSheet.hairlineWidth,

      marginVertical: 13,
    },

    latestRow: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    latestLeft: {
      flexDirection: "row",

      alignItems: "center",

      flex: 1,
    },

    latestIconBox: {
      width: 38,
      height: 38,

      borderRadius: 10,

      alignItems: "center",

      justifyContent:
        "center",

      marginRight: 10,
    },

    latestIcon: {
      fontSize: 20,
    },

    latestInfo: {
      flex: 1,
    },

    latestLabel: {
      fontSize: 8,
      lineHeight: 10,

      fontWeight: "700",

      letterSpacing: 0.6,
    },

    latestTitle: {
      fontSize: 14,
      lineHeight: 18,

      marginTop: 1,
    },

    latestDate: {
      fontSize: 9,
      lineHeight: 12,

      marginTop: 1,
    },

    latestCheck: {
      fontSize: 16,

      marginLeft: 10,
    },

    noTrophyRow: {
      flexDirection: "row",

      alignItems: "center",
    },

    noTrophyIcon: {
      fontSize: 28,

      marginRight: 11,
    },

    noTrophyText: {
      fontSize: 11,
      lineHeight: 15,

      marginTop: 2,
    },

    viewCollection: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "flex-end",

      marginTop: 13,
    },

    viewCollectionText: {
      fontSize: 11,
      lineHeight: 14,
    },

    viewCollectionArrow: {
      fontSize: 15,
      lineHeight: 18,

      marginLeft: 6,
    },

    // ==========================================================
    // BUDDY
    // ==========================================================

    buddyCard: {
      padding: 15,
    },

    buddyEmptyCard: {
      flexDirection: "row",

      alignItems: "center",

      padding: 15,
    },

    buddyTop: {
      flexDirection: "row",

      alignItems: "center",
    },

    buddyPortraitButton: {
      marginRight: 13,

      borderRadius: 20,
    },

    buddyPortraitPressed: {
      opacity: 0.72,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },

    buddyIconBox: {
      width: 64,
      height: 64,

      borderRadius: 20,

      borderWidth: 1,

      alignItems: "center",

      justifyContent:
        "center",
    },

    buddyIcon: {
      fontSize: 38,
      lineHeight: 46,
    },

    buddyName: {
      fontSize: 18,
      lineHeight: 22,

      marginTop: 1,
    },

    buddyDescription: {
      marginTop: 3,

      paddingRight: 6,
    },

    buddyLevelBadge: {
      borderRadius: 10,

      paddingHorizontal: 9,
      paddingVertical: 6,

      marginLeft: 8,
    },

    buddyLevelText: {
      fontSize: 10,
      lineHeight: 12,

      fontWeight: "900",
    },

    buddyArrow: {
      fontSize: 23,
      lineHeight: 27,

      fontWeight: "800",

      marginLeft: 8,
    },

    buddyDivider: {
      height:
        StyleSheet.hairlineWidth,

      marginVertical: 13,
    },

    buddyLabelRow: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: 10,
    },

    buddyStats: {
      flexDirection: "row",

      gap: 6,
    },

    buddyStat: {
      flex: 1,

      alignItems: "center",
    },

    buddyStatIcon: {
      fontSize: 17,
      lineHeight: 21,

      marginBottom: 2,
    },

    buddyStatLabel: {
      fontSize: 8,
      lineHeight: 10,

      fontWeight: "800",
    },

    buddyStatValue: {
      fontSize: 18,
      lineHeight: 22,

      fontWeight: "900",

      marginTop: 2,
    },

    buddyBuildRow: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      borderRadius: 10,
    },

    buddyBuildStats: {
      flexDirection: "row",

      alignItems: "center",

      gap: 13,

      flex: 1,
    },

    buddyBuildValue: {
      fontWeight: "900",
    },

    detailsPressed: {
      opacity: 0.7,
    },

    pointsAvailable: {
      flexDirection: "row",

      alignItems: "center",

      borderWidth: 1,

      borderRadius: 12,

      paddingHorizontal: 11,
      paddingVertical: 9,

      marginTop: 13,
    },

    pointsAvailableIcon: {
      fontSize: 13,

      fontWeight: "900",

      marginRight: 7,
    },

    pointsAvailableText: {
      flex: 1,

      fontSize: 12,
      lineHeight: 16,

      fontWeight: "800",
    },

    openBuddy: {
      flexDirection: "row",

      justifyContent:
        "flex-end",

      alignItems: "center",

      alignSelf: "flex-end",

      marginTop: 13,

      paddingVertical: 4,
      paddingLeft: 12,

      borderRadius: 8,
    },

    openBuddyText: {
      fontSize: 11,
      lineHeight: 14,
    },

    openBuddyArrow: {
      fontSize: 15,
      lineHeight: 18,

      marginLeft: 6,
    },

    // ==========================================================
    // SHARED
    // ==========================================================

    flex: {
      flex: 1,
    },
  });