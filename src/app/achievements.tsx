import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";

import AppCard from "../components/AppCard";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import ProgressBar from "../components/ProgressBar";

import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

import {
  Achievement,
  AchievementCategory,
  getAchievements,
} from "../utils/achievements";

// ============================================================
// TYPES
// ============================================================

type CategoryFilter =
  | "all"
  | AchievementCategory;

// ============================================================
// CATEGORY CONFIG
// ============================================================

const CATEGORY_FILTERS: {
  id: CategoryFilter;
  label: string;
  icon: string;
}[] = [
  {
    id: "all",
    label: "All",
    icon: "✦",
  },
  {
    id: "general",
    label: "General",
    icon: "🏆",
  },
  {
    id: "fitness",
    label: "Fitness",
    icon: "🏃",
  },
  {
    id: "learning",
    label: "Learning",
    icon: "📚",
  },
];

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

function getAchievementProgress(
  achievement: Achievement
) {
  if (achievement.target <= 0) {
    return 0;
  }

  return Math.min(
    Math.max(
      achievement.progress /
        achievement.target,
      0
    ),
    1
  );
}

// ============================================================
// SCREEN
// ============================================================

export default function AchievementsScreen() {
  const {
    activities,
    totalXP,
    achievementUnlocks,
  } = useApp();

  const { theme } = useTheme();

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<CategoryFilter>(
      "all"
    );

  // ==========================================================
  // ACHIEVEMENT DATA
  // ==========================================================

  const achievementSummary =
    getAchievements(
      activities,
      totalXP,
      achievementUnlocks
    );

  const {
    achievements,
    unlockedCount,
    totalCount,
  } = achievementSummary;

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter(
          achievement =>
            achievement.category ===
            selectedCategory
        );

  const unlockedAchievements =
    filteredAchievements
      .filter(
        achievement =>
          achievement.unlocked
      )
      .sort(
        (a, b) =>
          (
            b.unlockedAt
              ?.getTime() ?? 0
          ) -
          (
            a.unlockedAt
              ?.getTime() ?? 0
          )
      );

  const lockedAchievements =
    filteredAchievements
      .filter(
        achievement =>
          !achievement.unlocked
      )
      .sort(
        (a, b) =>
          getAchievementProgress(
            b
          ) -
          getAchievementProgress(
            a
          )
      );

  const collectionProgress =
    totalCount > 0
      ? unlockedCount /
        totalCount
      : 0;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <AppScreen>
      {/* ======================================================
          HEADER
          ====================================================== */}

      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (
              router.canGoBack()
            ) {
              router.back();
            } else {
              router.replace(
                "/profile"
              );
            }
          }}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor:
                theme.colors.card,
              borderColor:
                theme.colors.border,
              opacity: pressed
                ? 0.65
                : 1,
            },
          ]}
        >
          <AppText
            style={
              styles.backArrow
            }
          >
            ←
          </AppText>
        </Pressable>

        <View
          style={
            styles.headerText
          }
        >
          <AppText variant="pageTitle">
            Achievements
          </AppText>

          <AppText variant="secondary">
            Your permanent trophy
            collection
          </AppText>
        </View>
      </View>

      {/* ======================================================
          COLLECTION SUMMARY
          ====================================================== */}

      <AppCard
        variant="alt"
        style={
          styles.collectionCard
        }
      >
        <View
          style={
            styles.collectionTop
          }
        >
          <View
            style={
              styles.collectionTitleRow
            }
          >
            <View
              style={[
                styles.trophyBox,
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
                  styles.trophyIcon
                }
              >
                🏆
              </AppText>
            </View>

            <View>
              <AppText variant="label">
                COLLECTION
              </AppText>

              <AppText
                variant="title"
                style={
                  styles.collectionTitle
                }
              >
                {unlockedCount} of{" "}
                {totalCount} unlocked
              </AppText>
            </View>
          </View>

          <AppText
            variant="xp"
            style={
              styles.collectionPercent
            }
          >
            {Math.round(
              collectionProgress *
                100
            )}
            %
          </AppText>
        </View>

        <View
          style={
            styles.collectionProgress
          }
        >
          <ProgressBar
            progress={
              collectionProgress
            }
          />
        </View>

        <View
          style={
            styles.collectionFooter
          }
        >
          <AppText variant="caption">
            {unlockedCount} unlocked
          </AppText>

          <AppText variant="caption">
            {totalCount -
              unlockedCount}{" "}
            remaining
          </AppText>
        </View>
      </AppCard>

      {/* ======================================================
          CATEGORY FILTERS
          ====================================================== */}

      <View
        style={
          styles.filterSection
        }
      >
        <AppText
          variant="label"
          style={
            styles.filterLabel
          }
        >
          CATEGORY
        </AppText>

        <View
          style={
            styles.filters
          }
        >
          {CATEGORY_FILTERS.map(
            filter => {
              const selected =
                selectedCategory ===
                filter.id;

              return (
                <Pressable
                  key={filter.id}
                  onPress={() =>
                    setSelectedCategory(
                      filter.id
                    )
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.filterButton,
                    {
                      backgroundColor:
                        selected
                          ? theme
                              .colors
                              .xp
                          : theme
                              .colors
                              .card,

                      borderColor:
                        selected
                          ? theme
                              .colors
                              .xp
                          : theme
                              .colors
                              .border,

                      opacity: pressed
                        ? 0.7
                        : 1,
                    },
                  ]}
                >
                  <AppText
                    style={
                      styles.filterIcon
                    }
                  >
                    {filter.icon}
                  </AppText>

                  <AppText
                    style={[
                      styles.filterText,
                      selected && {
                        color:
                          theme
                            .colors
                            .background,
                      },
                    ]}
                  >
                    {filter.label}
                  </AppText>
                </Pressable>
              );
            }
          )}
        </View>
      </View>

      {/* ======================================================
          UNLOCKED
          ====================================================== */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <View
          style={
            styles.sectionHeaderLeft
          }
        >
          <AppText
            style={
              styles.sectionIcon
            }
          >
            🏆
          </AppText>

          <View>
            <AppText variant="label">
              UNLOCKED
            </AppText>

            <AppText variant="caption">
              Permanent trophies
            </AppText>
          </View>
        </View>

        <AppText variant="xp">
          {
            unlockedAchievements.length
          }
        </AppText>
      </View>

      {unlockedAchievements.length ===
      0 ? (
        <AppCard
          style={
            styles.emptyCard
          }
        >
          <AppText
            style={
              styles.emptyIcon
            }
          >
            🏆
          </AppText>

          <View style={styles.flex}>
            <AppText variant="title">
              No trophies here yet
            </AppText>

            <AppText
              variant="secondary"
              style={
                styles.emptyText
              }
            >
              Keep progressing to
              unlock achievements in
              this category.
            </AppText>
          </View>
        </AppCard>
      ) : (
        <View
          style={
            styles.achievementList
          }
        >
          {unlockedAchievements.map(
            achievement => (
              <View
                key={achievement.id}
                style={[
                  styles.unlockedCard,
                  {
                    backgroundColor:
                      theme.colors.card,

                    borderColor:
                      theme.colors.xp,
                  },
                ]}
              >
                <View
                  style={[
                    styles.achievementIconBox,
                    {
                      backgroundColor:
                        theme.colors
                          .cardAlt,

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
                    {
                      achievement.icon
                    }
                  </AppText>
                </View>

                <View
                  style={
                    styles.achievementMain
                  }
                >
                  <View
                    style={
                      styles.achievementTitleRow
                    }
                  >
                    <AppText
                      variant="title"
                      style={
                        styles.achievementTitle
                      }
                    >
                      {
                        achievement.title
                      }
                    </AppText>

                    <AppText
                      variant="xp"
                      style={
                        styles.unlockedLabel
                      }
                    >
                      ✓
                    </AppText>
                  </View>

                  <AppText
                    variant="secondary"
                    style={
                      styles.achievementDescription
                    }
                  >
                    {
                      achievement.description
                    }
                  </AppText>

                  <View
                    style={
                      styles.unlockRow
                    }
                  >
                    <AppText
                      style={[
                        styles.unlockDiamond,
                        {
                          color:
                            theme.colors.xp,
                        },
                      ]}
                    >
                      ◆
                    </AppText>

                    <AppText
                      variant="caption"
                      style={
                        styles.unlockDate
                      }
                    >
                      {formatUnlockDate(
                        achievement.unlockedAt
                      )}
                    </AppText>
                  </View>
                </View>
              </View>
            )
          )}
        </View>
      )}

      {/* ======================================================
          TO ACHIEVE
          ====================================================== */}

      <View
        style={[
          styles.sectionHeader,
          styles.lockedHeader,
        ]}
      >
        <View
          style={
            styles.sectionHeaderLeft
          }
        >
          <AppText
            style={
              styles.sectionIcon
            }
          >
            🎯
          </AppText>

          <View>
            <AppText variant="label">
              TO ACHIEVE
            </AppText>

            <AppText variant="caption">
              Keep making progress
            </AppText>
          </View>
        </View>

        <AppText variant="caption">
          {
            lockedAchievements.length
          }{" "}
          LEFT
        </AppText>
      </View>

      {lockedAchievements.length ===
      0 ? (
        <AppCard
          variant="alt"
          style={
            styles.emptyCard
          }
        >
          <AppText
            style={
              styles.emptyIcon
            }
          >
            👑
          </AppText>

          <View style={styles.flex}>
            <AppText variant="title">
              Category complete
            </AppText>

            <AppText
              variant="secondary"
              style={
                styles.emptyText
              }
            >
              You have unlocked every
              achievement in this
              category.
            </AppText>
          </View>
        </AppCard>
      ) : (
        <View
          style={
            styles.achievementList
          }
        >
          {lockedAchievements.map(
            achievement => {
              const progress =
                getAchievementProgress(
                  achievement
                );

              const percentage =
                Math.round(
                  progress * 100
                );

              return (
                <View
                  key={
                    achievement.id
                  }
                  style={[
                    styles.lockedCard,
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
                      styles.achievementIconBox,
                      {
                        backgroundColor:
                          theme.colors
                            .background,

                        borderColor:
                          theme.colors
                            .border,
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.achievementIcon,
                        styles.lockedIcon,
                      ]}
                    >
                      {
                        achievement.icon
                      }
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.achievementMain
                    }
                  >
                    <View
                      style={
                        styles.achievementTitleRow
                      }
                    >
                      <AppText
                        variant="title"
                        style={
                          styles.achievementTitle
                        }
                      >
                        {
                          achievement.title
                        }
                      </AppText>

                      <AppText
                        variant="caption"
                        style={
                          styles.percentage
                        }
                      >
                        {percentage}%
                      </AppText>
                    </View>

                    <AppText
                      variant="secondary"
                      style={
                        styles.achievementDescription
                      }
                    >
                      {
                        achievement.description
                      }
                    </AppText>

                    <View
                      style={
                        styles.progressBar
                      }
                    >
                      <ProgressBar
                        progress={
                          progress
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.progressFooter
                      }
                    >
                      <AppText
                        variant="caption"
                        style={
                          styles.progressText
                        }
                      >
                        {
                          achievement.progressText
                        }
                      </AppText>

                      <AppText
                        variant="caption"
                        style={
                          styles.inProgress
                        }
                      >
                        IN PROGRESS
                      </AppText>
                    </View>
                  </View>
                </View>
              );
            }
          )}
        </View>
      )}

      {/* ======================================================
          BOTTOM NOTE
          ====================================================== */}

      <View
        style={styles.bottomNote}
      >
        <AppText
          variant="caption"
          style={
            styles.bottomNoteText
          }
        >
          Achievements stay in your
          collection once unlocked.
        </AppText>
      </View>
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // ==========================================================
    // HEADER
    // ==========================================================

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    backArrow: {
      fontSize: 22,
      lineHeight: 26,
      fontWeight: "700",
    },

    headerText: {
      flex: 1,
    },

    // ==========================================================
    // COLLECTION
    // ==========================================================

    collectionCard: {
      marginBottom: 20,
    },

    collectionTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    collectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    trophyBox: {
      width: 48,
      height: 48,
      borderRadius: 13,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    trophyIcon: {
      fontSize: 25,
    },

    collectionTitle: {
      marginTop: 2,
      fontSize: 17,
      lineHeight: 21,
    },

    collectionPercent: {
      fontSize: 20,
      lineHeight: 24,
      marginLeft: 10,
    },

    collectionProgress: {
      marginTop: 15,
    },

    collectionFooter: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginTop: 6,
    },

    // ==========================================================
    // FILTERS
    // ==========================================================

    filterSection: {
      marginBottom: 22,
    },

    filterLabel: {
      marginBottom: 8,
    },

    filters: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7,
    },

    filterButton: {
      minHeight: 38,
      borderRadius: 11,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 11,
      paddingVertical: 8,
    },

    filterIcon: {
      fontSize: 13,
      marginRight: 5,
    },

    filterText: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "800",
    },

    // ==========================================================
    // SECTION HEADERS
    // ==========================================================

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 9,
    },

    sectionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    sectionIcon: {
      fontSize: 18,
      marginRight: 8,
    },

    lockedHeader: {
      marginTop: 24,
    },

    // ==========================================================
    // ACHIEVEMENTS
    // ==========================================================

    achievementList: {
      gap: 7,
    },

    unlockedCard: {
      borderWidth: 1,
      borderRadius: 13,
      padding: 12,
      flexDirection: "row",
      minHeight: 91,
    },

    lockedCard: {
      borderWidth: 1,
      borderRadius: 13,
      padding: 12,
      flexDirection: "row",
      minHeight: 112,
    },

    achievementIconBox: {
      width: 48,
      height: 48,
      borderRadius: 11,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 11,
    },

    achievementIcon: {
      fontSize: 24,
    },

    lockedIcon: {
      opacity: 0.55,
    },

    achievementMain: {
      flex: 1,
      minWidth: 0,
    },

    achievementTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      gap: 8,
    },

    achievementTitle: {
      flex: 1,
      fontSize: 15,
      lineHeight: 19,
    },

    achievementDescription: {
      fontSize: 11,
      lineHeight: 15,
      marginTop: 2,
    },

    unlockedLabel: {
      fontSize: 15,
      lineHeight: 18,
    },

    unlockRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 9,
    },

    unlockDiamond: {
      fontSize: 7,
      marginRight: 6,
    },

    unlockDate: {
      fontSize: 9,
      lineHeight: 12,
    },

    percentage: {
      fontSize: 9,
      lineHeight: 12,
      fontWeight: "700",
    },

    progressBar: {
      marginTop: 9,
    },

    progressFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginTop: 4,
    },

    progressText: {
      fontSize: 9,
      lineHeight: 12,
    },

    inProgress: {
      fontSize: 8,
      lineHeight: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
    },

    // ==========================================================
    // EMPTY STATES
    // ==========================================================

    emptyCard: {
      flexDirection: "row",
      alignItems: "center",
    },

    emptyIcon: {
      fontSize: 30,
      marginRight: 13,
    },

    emptyText: {
      marginTop: 3,
    },

    // ==========================================================
    // BOTTOM
    // ==========================================================

    bottomNote: {
      alignItems: "center",
      paddingVertical: 26,
      paddingHorizontal: 20,
    },

    bottomNoteText: {
      textAlign: "center",
    },

    // ==========================================================
    // SHARED
    // ==========================================================

    flex: {
      flex: 1,
    },
  });