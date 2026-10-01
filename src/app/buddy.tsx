import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import ProgressBar from "../components/ProgressBar";

import {
  BuddyBuildStat,
  BuddySpecies,
  useApp,
} from "../context/AppContext";

import {
  useTheme,
} from "../context/ThemeContext";

// ============================================================
// HELPERS
// ============================================================

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
// LIFE STAT
// ============================================================

type LifeStatProps = {
  icon: string;
  shortName: string;
  name: string;
  value: number;
  description: string;
};

function LifeStat({
  icon,
  shortName,
  name,
  value,
  description,
}: LifeStatProps) {
  const {
    theme,
  } = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor:
            theme.colors.cardAlt,

          borderColor:
            theme.colors.border,
        },
      ]}
    >
      <View
        style={
          styles.statHeader
        }
      >
        <View
          style={
            styles.statIdentity
          }
        >
          <AppText
            style={
              styles.statIcon
            }
          >
            {icon}
          </AppText>

          <View
            style={
              styles.statTitleArea
            }
          >
            <AppText
              variant="label"
            >
              {shortName}
            </AppText>

            <AppText
              variant="body"
              style={
                styles.statName
              }
            >
              {name}
            </AppText>
          </View>
        </View>
      </View>

      <AppText
        style={[
          styles.statValue,
          {
            color:
              theme.colors.xp,
          },
        ]}
      >
        {value}
      </AppText>

      <AppText
        variant="body"
        style={[
          styles.statDescription,
          {
            color:
              theme.colors
                .textSecondary,
          },
        ]}
      >
        {description}
      </AppText>
    </View>
  );
}

// ============================================================
// BUILD STAT
// ============================================================

type BuildStatProps = {
  icon: string;
  shortName: string;
  name: string;
  value: number;
  stat: BuddyBuildStat;
  description: string;
  canSpend: boolean;

  onSpend: (
    stat: BuddyBuildStat
  ) => void;
};

function BuildStat({
  icon,
  shortName,
  name,
  value,
  stat,
  description,
  canSpend,
  onSpend,
}: BuildStatProps) {
  const {
    theme,
  } = useTheme();

  return (
    <View
      style={[
        styles.buildStat,
        {
          backgroundColor:
            theme.colors.cardAlt,

          borderColor:
            theme.colors.border,
        },
      ]}
    >
      <View
        style={
          styles.buildStatMain
        }
      >
        <View
          style={
            styles.buildIdentity
          }
        >
          <AppText
            style={
              styles.buildIcon
            }
          >
            {icon}
          </AppText>

          <View
            style={
              styles.buildText
            }
          >
            <AppText
              variant="label"
            >
              {shortName}
            </AppText>

            <AppText
              variant="body"
              style={
                styles.buildName
              }
            >
              {name}
            </AppText>
          </View>
        </View>

        <View
          style={
            styles.buildControls
          }
        >
          <AppText
            style={[
              styles.buildValue,
              {
                color:
                  theme.colors.xp,
              },
            ]}
          >
            {value}
          </AppText>

          <Pressable
            disabled={
              !canSpend
            }
            onPress={() =>
              onSpend(stat)
            }
            style={[
              styles.plusButton,
              {
                backgroundColor:
                  canSpend
                    ? theme.colors.xp
                    : theme.colors.card,

                borderColor:
                  canSpend
                    ? theme.colors.xp
                    : theme.colors.border,

                opacity:
                  canSpend
                    ? 1
                    : 0.45,
              },
            ]}
          >
            <AppText
              style={[
                styles.plusText,
                {
                  color:
                    canSpend
                      ? theme.colors.background
                      : theme.colors.muted,
                },
              ]}
            >
              +
            </AppText>
          </Pressable>
        </View>
      </View>

      <AppText
        variant="body"
        style={[
          styles.buildDescription,
          {
            color:
              theme.colors
                .textSecondary,
          },
        ]}
      >
        {description}
      </AppText>
    </View>
  );
}

// ============================================================
// SCREEN
// ============================================================

export default function BuddyScreen() {
  const {
    buddy,

    totalXP,
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,

    buddyLifeStats,

    buddyUnspentBuildPoints,

    spendBuddyBuildPoint,
  } = useApp();

  const {
    theme,
  } = useTheme();

  // ==========================================================
  // NO BUDDY
  // ==========================================================

  if (!buddy) {
    return (
      <AppScreen>
        <View
          style={
            styles.header
          }
        >
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
            style={[
              styles.backButton,
              {
                backgroundColor:
                  theme.colors.card,

                borderColor:
                  theme.colors.border,
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
              variant="label"
            >
              BUDDY
            </AppText>

            <AppText
              variant="title"
            >
              Your Companion
            </AppText>
          </View>
        </View>

        <AppCard
          variant="alt"
        >
          <View
            style={
              styles.emptyBuddy
            }
          >
            <AppText
              style={
                styles.emptyEgg
              }
            >
              🥚
            </AppText>

            <AppText
              variant="title"
            >
              No Buddy Yet
            </AppText>

            <AppText
              variant="body"
              style={[
                styles.centerText,
                {
                  color:
                    theme.colors
                      .textSecondary,
                },
              ]}
            >
              Choose a companion
              that will grow from
              your real-life
              progress.
            </AppText>
          </View>
        </AppCard>

        <AppButton
          title="Choose Your Buddy"
          onPress={() =>
            router.push(
              "/create-buddy"
            )
          }
        />
      </AppScreen>
    );
  }

  // ==========================================================
  // PLAYER PROGRESSION
  // ==========================================================

  const levelProgress =
    xpNeededForNextLevel > 0
      ? xpInCurrentLevel /
        xpNeededForNextLevel
      : 0;

  const buddyIcon =
    getBuddyIcon(
      buddy.species
    );

  const speciesName =
    getBuddySpeciesName(
      buddy.species
    );

  const canSpend =
    buddyUnspentBuildPoints >
    0;

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
          style={[
            styles.backButton,
            {
              backgroundColor:
                theme.colors.card,

              borderColor:
                theme.colors.border,
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
            variant="label"
          >
            BUDDY
          </AppText>

          <AppText
            variant="title"
          >
            {buddy.name}
          </AppText>
        </View>
      </View>

      {/* ======================================================
          CHARACTER
      ====================================================== */}

      <AppCard
        variant="alt"
      >
        <View
          style={
            styles.character
          }
        >
          <Pressable
            onPress={() =>
              router.push(
                "/buddy-home"
              )
            }
            style={({ pressed }) => [
              styles.characterPortraitButton,
              pressed &&
                styles.characterPortraitPressed,
            ]}
          >
            <View
              style={[
                styles.characterCircle,
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
                  styles.characterIcon
                }
              >
                {buddyIcon}
              </AppText>
            </View>
          </Pressable>

          <View
            style={
              styles.characterInfo
            }
          >
            <View
              style={
                styles.characterTitleRow
              }
            >
              <View
                style={
                  styles.characterName
                }
              >
                <AppText
                  variant="label"
                >
                  {speciesName.toUpperCase()}
                </AppText>

                <AppText
                  variant="title"
                >
                  {buddy.name}
                </AppText>
              </View>

              <View
                style={[
                  styles.levelBadge,
                  {
                    backgroundColor:
                      theme.colors.xp,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.levelBadgeText,
                    {
                      color:
                        theme.colors.background,
                    },
                  ]}
                >
                  LV {level}
                </AppText>
              </View>
            </View>

            <AppText
              variant="body"
              style={{
                color:
                  theme.colors
                    .textSecondary,
              }}
            >
              Linked to your
              Player progression
            </AppText>
          </View>
        </View>

        <View
          style={
            styles.xpArea
          }
        >
          <View
            style={
              styles.xpLabels
            }
          >
            <AppText
              variant="label"
            >
              PLAYER XP
            </AppText>

            <AppText
              variant="label"
            >
              {xpInCurrentLevel}
              {" / "}
              {xpNeededForNextLevel}
            </AppText>
          </View>

          <ProgressBar
            progress={
              levelProgress
            }
          />

          <View
            style={
              styles.totalXPRow
            }
          >
            <AppText
              variant="body"
              style={{
                color:
                  theme.colors
                    .textSecondary,
              }}
            >
              Lifetime XP
            </AppText>

            <AppText
              variant="body"
              style={
                styles.totalXP
              }
            >
              {totalXP}
            </AppText>
          </View>
        </View>
      </AppCard>

      {/* ======================================================
          LIFE STATS
      ====================================================== */}

      <View
        style={
          styles.section
        }
      >
        <AppText
          variant="label"
        >
          LIFE STATS
        </AppText>

        <AppText
          variant="body"
          style={{
            color:
              theme.colors
                .textSecondary,
          }}
        >
          These grow from what
          you do in real life.
        </AppText>
      </View>

      <View
        style={
          styles.lifeGrid
        }
      >
        <LifeStat
          icon="❤️"
          shortName="VIT"
          name="Vitality"
          value={
            buddyLifeStats.vitality
          }
          description="Endurance and health."
        />

        <LifeStat
          icon="⚔️"
          shortName="POW"
          name="Power"
          value={
            buddyLifeStats.power
          }
          description="Physical strength."
        />

        <LifeStat
          icon="🏃"
          shortName="AGI"
          name="Agility"
          value={
            buddyLifeStats.agility
          }
          description="Speed and evasion."
        />

        <LifeStat
          icon="🧠"
          shortName="INT"
          name="Intelligence"
          value={
            buddyLifeStats.intelligence
          }
          description="Knowledge and spell potential."
        />
      </View>

      {/* ======================================================
          YOUR BUILD
      ====================================================== */}

      <View
        style={
          styles.section
        }
      >
        <View
          style={
            styles.sectionTitleRow
          }
        >
          <View
            style={
              styles.sectionTitleText
            }
          >
            <AppText
              variant="label"
            >
              YOUR BUILD
            </AppText>

            <AppText
              variant="body"
              style={{
                color:
                  theme.colors
                    .textSecondary,
              }}
            >
              You decide how
              your Buddy
              develops.
            </AppText>
          </View>

          <View
            style={[
              styles.pointsBadge,
              {
                backgroundColor:
                  canSpend
                    ? theme.colors.xp
                    : theme.colors.cardAlt,

                borderColor:
                  canSpend
                    ? theme.colors.xp
                    : theme.colors.border,
              },
            ]}
          >
            <AppText
              style={[
                styles.pointsNumber,
                {
                  color:
                    canSpend
                      ? theme.colors.background
                      : theme.colors.text,
                },
              ]}
            >
              {buddyUnspentBuildPoints}
            </AppText>

            <AppText
              variant="label"
              style={{
                color:
                  canSpend
                    ? theme.colors.background
                    : theme.colors.muted,
              }}
            >
              POINTS
            </AppText>
          </View>
        </View>
      </View>

      {/* ======================================================
          BUILD POINTS CARD
      ====================================================== */}

      <AppCard>
        <View
          style={
            styles.buildPointSummary
          }
        >
          <AppText
            variant="label"
          >
            BUILD POINTS
          </AppText>

          <AppText
            variant="body"
            style={{
              color:
                theme.colors
                  .textSecondary,
            }}
          >
            Earn 1 every time
            your Player levels
            up.
          </AppText>
        </View>

        {canSpend && (
          <View
            style={[
              styles.availableMessage,
              {
                backgroundColor:
                  theme.colors.cardAlt,

                borderColor:
                  theme.colors.xp,
              },
            ]}
          >
            <AppText>
              ✦
            </AppText>

            <AppText
              variant="body"
              style={
                styles.availableText
              }
            >
              You have{" "}
              {buddyUnspentBuildPoints}{" "}
              unspent build{" "}
              {buddyUnspentBuildPoints === 1
                ? "point"
                : "points"}
              .
            </AppText>
          </View>
        )}

        <View
          style={
            styles.buildList
          }
        >
          <BuildStat
            icon="✨"
            shortName="MAG"
            name="Magic Proficiency"
            value={
              buddy.magic
            }
            stat="magic"
            description="Improves magical abilities and spell effectiveness."
            canSpend={
              canSpend
            }
            onSpend={
              spendBuddyBuildPoint
            }
          />

          <BuildStat
            icon="🛡️"
            shortName="DEF"
            name="Defense"
            value={
              buddy.defense
            }
            stat="defense"
            description="Improves resistance to incoming damage."
            canSpend={
              canSpend
            }
            onSpend={
              spendBuddyBuildPoint
            }
          />

          <BuildStat
            icon="🍀"
            shortName="LCK"
            name="Luck"
            value={
              buddy.luck
            }
            stat="luck"
            description="May influence critical hits, loot and rare events."
            canSpend={
              canSpend
            }
            onSpend={
              spendBuddyBuildPoint
            }
          />
        </View>
      </AppCard>

      {/* ======================================================
          BUDDY WORLD
      ====================================================== */}

      <View
        style={
          styles.section
        }
      >
        <AppText
          variant="label"
        >
          BUDDY WORLD
        </AppText>
      </View>

      <AppCard
        variant="alt"
      >
        <View
          style={
            styles.worldPreview
          }
        >
          <View
            style={
              styles.worldIcons
            }
          >
            <AppText
              style={
                styles.worldEmoji
              }
            >
              🌲
            </AppText>

            <AppText
              style={
                styles.worldBuddy
              }
            >
              {buddyIcon}
            </AppText>

            <AppText
              style={
                styles.worldEmoji
              }
            >
              🏰
            </AppText>
          </View>

          <AppText
            variant="title"
          >
            Adventure Awaits
          </AppText>

          <AppText
            variant="body"
            style={[
              styles.centerText,
              {
                color:
                  theme.colors
                    .textSecondary,
              },
            ]}
          >
            Your real-life
            progression will
            determine what your
            Buddy can do in its
            world.
          </AppText>

          <Pressable
            onPress={() =>
              router.push(
                "/buddy-world"
              )
            }
            style={({ pressed }) => [
              styles.enterWorldButton,
              {
                backgroundColor:
                  theme.colors.xp,
                borderColor:
                  theme.colors.xp,
              },
              pressed &&
                styles.enterWorldButtonPressed,
            ]}
          >
            <AppText
              style={[
                styles.enterWorldText,
                {
                  color:
                    theme.colors.background,
                },
              ]}
            >
              🗺️ ENTER WORLD
            </AppText>

            <AppText
              style={[
                styles.enterWorldArrow,
                {
                  color:
                    theme.colors.background,
                },
              ]}
            >
              ›
            </AppText>
          </Pressable>
        </View>
      </AppCard>

      {/* ======================================================
          RULE
      ====================================================== */}

      <View
        style={[
          styles.rule,
          {
            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <AppText
          style={
            styles.ruleIcon
          }
        >
          ✦
        </AppText>

        <AppText
          variant="body"
          style={[
            styles.ruleText,
            {
              color:
                theme.colors
                  .textSecondary,
            },
          ]}
        >
          Play the game because
          your real life made
          your Buddy stronger —
          not to grind permanent
          XP inside the game.
        </AppText>
      </View>

      <View
        style={
          styles.bottomSpace
        }
      />
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
      gap: 14,
      marginBottom: 18,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    backText: {
      fontSize: 34,
      lineHeight: 36,
      marginTop: -3,
    },

    headerText: {
      flex: 1,
    },

    // --------------------------------------------------------
    // CHARACTER
    // --------------------------------------------------------

    character: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },

    characterPortraitButton: {
      borderRadius: 46,
    },

    characterPortraitPressed: {
      opacity: 0.72,
      transform: [
        {
          scale: 0.94,
        },
      ],
    },

    characterCircle: {
      width: 92,
      height: 92,
      borderRadius: 46,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },

    characterIcon: {
      fontSize: 54,
      lineHeight: 64,
    },

    characterInfo: {
      flex: 1,
      minWidth: 0,
    },

    characterTitleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },

    characterName: {
      flex: 1,
      minWidth: 0,
    },

    levelBadge: {
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 10,
      flexShrink: 0,
    },

    levelBadgeText: {
      fontSize: 11,
      fontWeight: "900",
    },

    xpArea: {
      marginTop: 20,
      gap: 8,
    },

    xpLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    totalXPRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    totalXP: {
      fontWeight: "800",
    },

    // --------------------------------------------------------
    // SECTIONS
    // --------------------------------------------------------

    section: {
      marginTop: 26,
      marginBottom: 10,
      gap: 3,
    },

    // --------------------------------------------------------
    // LIFE STATS
    // --------------------------------------------------------

    lifeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: 10,
    },

    statCard: {
      width: "48.5%",
      minHeight: 170,
      borderWidth: 1,
      borderRadius: 18,
      padding: 14,
    },

    statHeader: {
      minHeight: 54,
    },

    statIdentity: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },

    statIcon: {
      fontSize: 22,
      lineHeight: 28,
    },

    statTitleArea: {
      flex: 1,
      minWidth: 0,
    },

    statName: {
      fontWeight: "800",
      fontSize: 16,
      lineHeight: 21,
    },

    statValue: {
      fontSize: 32,
      lineHeight: 38,
      fontWeight: "900",
      marginTop: 8,
    },

    statDescription: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: 17,
    },

    // --------------------------------------------------------
    // BUILD SECTION
    // --------------------------------------------------------

    sectionTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },

    sectionTitleText: {
      flex: 1,
      minWidth: 0,
      gap: 3,
    },

    pointsBadge: {
      minWidth: 68,
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignItems: "center",
      flexShrink: 0,
    },

    pointsNumber: {
      fontSize: 22,
      fontWeight: "900",
    },

    // --------------------------------------------------------
    // BUILD POINT SUMMARY
    // --------------------------------------------------------

    buildPointSummary: {
      gap: 3,
    },

    availableMessage: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderWidth: 1,
      borderRadius: 14,
      padding: 12,
      marginTop: 16,
    },

    availableText: {
      flex: 1,
      minWidth: 0,
      fontWeight: "700",
    },

    // --------------------------------------------------------
    // BUILD STATS
    // --------------------------------------------------------

    buildList: {
      marginTop: 16,
      gap: 10,
    },

    buildStat: {
      borderWidth: 1,
      borderRadius: 17,
      padding: 14,
    },

    buildStatMain: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },

    buildIdentity: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
      minWidth: 0,
    },

    buildIcon: {
      fontSize: 25,
      lineHeight: 31,
    },

    buildText: {
      flex: 1,
      minWidth: 0,
    },

    buildName: {
      fontWeight: "800",
      fontSize: 16,
      lineHeight: 21,
    },

    buildControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
    },

    buildValue: {
      fontSize: 25,
      lineHeight: 31,
      fontWeight: "900",
      minWidth: 28,
      textAlign: "right",
    },

    plusButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    plusText: {
      fontSize: 23,
      fontWeight: "900",
      lineHeight: 25,
    },

    buildDescription: {
      marginTop: 10,
      fontSize: 12,
      lineHeight: 17,
    },

    // --------------------------------------------------------
    // WORLD
    // --------------------------------------------------------

    worldPreview: {
      alignItems: "center",
      paddingVertical: 8,
      gap: 8,
    },

    worldIcons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      marginBottom: 5,
    },

    worldEmoji: {
      fontSize: 34,
    },

    worldBuddy: {
      fontSize: 54,
      lineHeight: 64,
    },

    enterWorldButton: {
      width: "100%",
      minHeight: 54,
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 16,
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    enterWorldButtonPressed: {
      opacity: 0.78,
      transform: [
        {
          scale: 0.98,
        },
      ],
    },

    enterWorldText: {
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 1,
    },

    enterWorldArrow: {
      position: "absolute",
      right: 16,
      fontSize: 28,
      lineHeight: 30,
      fontWeight: "700",
    },

    // --------------------------------------------------------
    // RULE
    // --------------------------------------------------------

    rule: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      borderTopWidth: 1,
      marginTop: 22,
      paddingTop: 18,
    },

    ruleIcon: {
      fontSize: 17,
    },

    ruleText: {
      flex: 1,
      minWidth: 0,
      fontSize: 12,
      lineHeight: 18,
    },

    // --------------------------------------------------------
    // EMPTY
    // --------------------------------------------------------

    emptyBuddy: {
      alignItems: "center",
      paddingVertical: 18,
      gap: 8,
    },

    emptyEgg: {
      fontSize: 72,
      lineHeight: 82,
    },

    centerText: {
      textAlign: "center",
      maxWidth: 290,
    },

    bottomSpace: {
      height: 30,
    },
  });