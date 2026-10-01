import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";

import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

import {
  BuddySpecies,
  useApp,
} from "../context/AppContext";

import { useTheme } from "../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type EncounterType =
  | "intro"
  | "nothing"
  | "mossling"
  | "sporecap"
  | "treasure"
  | "discovery";

type Encounter = {
  type: EncounterType;
  title: string;
  description: string;
  icon: string;
};

// ============================================================
// BUDDY HELPERS
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

// ============================================================
// ENCOUNTERS
// ============================================================

const encounters: Encounter[] = [
  {
    type: "nothing",
    title: "A Quiet Trail",
    description:
      "The forest is calm. You hear leaves rustling somewhere beyond the trees.",
    icon: "🌿",
  },

  {
    type: "mossling",
    title: "Something Is Moving...",
    description:
      "A small creature emerges from the moss. It watches your Buddy carefully.",
    icon: "⚔️",
  },

  {
    type: "sporecap",
    title: "Strange Spores",
    description:
      "A tiny mushroom creature blocks the trail. The air around it sparkles with spores.",
    icon: "🍄",
  },

  {
    type: "treasure",
    title: "Hidden Cache",
    description:
      "Your Buddy notices something hidden beneath a fallen tree.",
    icon: "📦",
  },

  {
    type: "discovery",
    title: "Forest Discovery",
    description:
      "A strange glowing plant grows beside the stream. You have never seen anything like it.",
    icon: "✨",
  },
];

// ============================================================
// SCREEN
// ============================================================

export default function WhisperingWoodsScreen() {
  const {
    buddy,
    level,

    adventureProgress,

    exploreWhisperingWoods,
    discoverWhisperingWoods,
    openWhisperingWoodsTreasure,

    lastTreasureItem,
    clearLastTreasureItem,
  } = useApp();

  const { theme } =
    useTheme();

  // ==========================================================
  // ENCOUNTER
  // ==========================================================

  const [
    encounter,
    setEncounter,
  ] = useState<Encounter>({
    type: "intro",

    title: "Whispering Woods",

    description:
      "The path ahead disappears beneath ancient trees. Something is waiting deeper in the forest.",

    icon: "🌲",
  });

  // ==========================================================
  // TREASURE
  // ==========================================================

  const [
    treasureOpened,
    setTreasureOpened,
  ] = useState(false);

  // ==========================================================
  // PERMANENT PROGRESS
  // ==========================================================

  const woodsProgress =
    adventureProgress.whisperingWoods;

  const steps =
    woodsProgress.steps;

  const discoveries =
    woodsProgress.discoveries;

  const treasuresOpened =
    woodsProgress.treasuresOpened;

  const mosslingsDefeated =
    woodsProgress.enemiesDefeated
      .mossling;

  const sporecapsDefeated =
    woodsProgress.enemiesDefeated
      .sporecap;

  const totalEnemiesDefeated =
    mosslingsDefeated +
    sporecapsDefeated;

  // ==========================================================
  // BUDDY
  // ==========================================================

  const buddyIcon =
    buddy
      ? getBuddyIcon(
          buddy.species
        )
      : "🥚";

  const buddyName =
    buddy?.name ??
    "Buddy";

  // ==========================================================
  // EXPLORE
  // ==========================================================

  function explore() {
    setTreasureOpened(
      false
    );

    clearLastTreasureItem();

    exploreWhisperingWoods();

    const randomIndex =
      Math.floor(
        Math.random() *
          encounters.length
      );

    const nextEncounter =
      encounters[randomIndex];

    setEncounter(
      nextEncounter
    );

    if (
      nextEncounter.type ===
      "discovery"
    ) {
      discoverWhisperingWoods();
    }
  }

  // ==========================================================
  // TREASURE
  // ==========================================================

  function openTreasure() {
    if (
      encounter.type !==
      "treasure"
    ) {
      return;
    }

    if (
      treasureOpened
    ) {
      return;
    }

    openWhisperingWoodsTreasure();

    setTreasureOpened(
      true
    );
  }

  function continueAfterTreasure() {
    setTreasureOpened(
      false
    );

    clearLastTreasureItem();

    explore();
  }

  // ==========================================================
  // BATTLE
  // ==========================================================

  function startBattle() {
    if (
      encounter.type !==
        "mossling" &&
      encounter.type !==
        "sporecap"
    ) {
      return;
    }

    router.push({
      pathname: "/battle",

      params: {
        enemy:
          encounter.type,
      },
    });
  }

  // ==========================================================
  // RETURN
  // ==========================================================

  function goBack() {
    if (
      router.canGoBack()
    ) {
      router.back();
      return;
    }

    router.replace(
      "/buddy-world"
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <AppScreen
      horizontalPadding={0}
      topPadding={0}
      bottomPadding={0}
      scroll={true}
    >
      <ImageBackground
        source={require(
          "../../assets/game/backgrounds/whispering-woods.png"
        )}
        resizeMode="cover"
        style={
          styles.background
        }
      >
        {/* ================================================= */}
        {/* DARK OVERLAY */}
        {/* ================================================= */}

        <View
          pointerEvents="none"
          style={
            styles.backgroundShade
          }
        />

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View
          style={
            styles.header
          }
        >
          <Pressable
            onPress={
              goBack
            }
            style={({
              pressed,
            }) => [
              styles.headerButton,

              {
                backgroundColor:
                  theme.colors.card,

                borderColor:
                  theme.colors.border,
              },

              pressed &&
                styles.pressed,
            ]}
          >
            <AppText
              style={
                styles.backIcon
              }
            >
              ‹
            </AppText>
          </Pressable>

          <View
            style={
              styles.headerCenter
            }
          >
            <AppText
              variant="label"
              style={
                styles.headerLabel
              }
            >
              AREA 01
            </AppText>

            <AppText
              variant="title"
              style={
                styles.headerTitle
              }
            >
              Whispering Woods
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
                styles.levelText,

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

        {/* ================================================= */}
        {/* FOREST SCENE */}
        {/* ================================================= */}

        <View
          style={
            styles.scene
          }
        >
          {/* LIGHTS */}

          <View
            style={[
              styles.floatingLight,
              styles.lightOne,
            ]}
          />

          <View
            style={[
              styles.floatingLight,
              styles.lightTwo,
            ]}
          />

          <View
            style={[
              styles.floatingLight,
              styles.lightThree,
            ]}
          />

          {/* ENEMY */}

          {encounter.type ===
            "mossling" && (
            <View
              style={
                styles.enemyArea
              }
            >
              <View
                style={
                  styles.enemyShadow
                }
              />

              <Image
                source={require(
                  "../../assets/game/enemies/mossling.png"
                )}
                resizeMode="contain"
                style={
                  styles.enemyImage
                }
              />
            </View>
          )}

          {encounter.type ===
            "sporecap" && (
            <View
              style={
                styles.enemyArea
              }
            >
              <View
                style={
                  styles.enemyShadow
                }
              />

              <Image
                source={require(
                  "../../assets/game/enemies/sporecap.png"
                )}
                resizeMode="contain"
                style={
                  styles.enemyImage
                }
              />
            </View>
          )}

          {/* BUDDY */}

          <View
            style={
              styles.buddyArea
            }
          >
            <View
              style={
                styles.buddyShadow
              }
            />

            <AppText
              style={
                styles.buddyIcon
              }
            >
              {buddyIcon}
            </AppText>

            <View
              style={[
                styles.buddyNameBadge,

                {
                  backgroundColor:
                    theme.colors.card,

                  borderColor:
                    theme.colors.border,
                },
              ]}
            >
              <AppText
                variant="label"
                style={
                  styles.buddyName
                }
                numberOfLines={1}
              >
                {buddyName}
              </AppText>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* BOTTOM AREA */}
        {/* ================================================= */}

        <View
          style={
            styles.bottomArea
          }
        >
          {/* =============================================== */}
          {/* PROGRESS */}
          {/* =============================================== */}

          <View
            style={
              styles.progressRow
            }
          >
            <View
              style={
                styles.progressBlock
              }
            >
              <AppText
                variant="label"
                style={
                  styles.hudLabel
                }
              >
                EXPLORATION
              </AppText>

              <AppText
                variant="body"
                style={
                  styles.hudSecondary
                }
              >
                {steps}{" "}
                {steps === 1
                  ? "step"
                  : "steps"}{" "}
                into the woods
              </AppText>
            </View>

            <View
              style={
                styles.discoveryArea
              }
            >
              <AppText
                variant="label"
                style={
                  styles.hudLabel
                }
              >
                DISCOVERIES
              </AppText>

              <AppText
                style={[
                  styles.discoveryValue,

                  {
                    color:
                      theme.colors.xp,
                  },
                ]}
              >
                {discoveries} found
              </AppText>
            </View>
          </View>

          {/* =============================================== */}
          {/* ENCOUNTER */}
          {/* =============================================== */}

          <View
            style={[
              styles.encounterCard,

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
                styles.encounterTop
              }
            >
              <View
                style={[
                  styles.encounterIconBox,

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
                    styles.encounterIcon
                  }
                >
                  {encounter.icon}
                </AppText>
              </View>

              <View
                style={
                  styles.encounterText
                }
              >
                <AppText
                  variant="label"
                  style={{
                    color:
                      theme.colors.xp,
                  }}
                >
                  {encounter.type ===
                  "intro"
                    ? "LOCATION"
                    : "ENCOUNTER"}
                </AppText>

                <AppText
                  variant="title"
                  style={
                    styles.encounterTitle
                  }
                >
                  {encounter.title}
                </AppText>
              </View>
            </View>

            <AppText
              variant="body"
              style={[
                styles.encounterDescription,

                {
                  color:
                    theme.colors
                      .textSecondary,
                },
              ]}
            >
              {
                encounter.description
              }
            </AppText>

            {/* ============================================= */}
            {/* BATTLE */}
            {/* ============================================= */}

            {(encounter.type ===
              "mossling" ||
              encounter.type ===
                "sporecap") && (
              <Pressable
                onPress={
                  startBattle
                }
                style={({
                  pressed,
                }) => [
                  styles.primaryButton,

                  {
                    backgroundColor:
                      theme.colors.xp,
                  },

                  pressed &&
                    styles.pressed,
                ]}
              >
                <AppText
                  style={[
                    styles.primaryButtonText,

                    {
                      color:
                        theme.colors
                          .background,
                    },
                  ]}
                >
                  ⚔️ ENTER BATTLE
                </AppText>
              </Pressable>
            )}

            {/* ============================================= */}
            {/* TREASURE CLOSED */}
            {/* ============================================= */}

            {encounter.type ===
              "treasure" &&
              !treasureOpened && (
                <>
                  <View
                    style={[
                      styles.infoBanner,

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
                        styles.bannerIcon
                      }
                    >
                      📦
                    </AppText>

                    <View
                      style={
                        styles.infoBannerContent
                      }
                    >
                      <AppText
                        variant="body"
                        style={
                          styles.infoBannerText
                        }
                      >
                        A hidden cache is
                        waiting to be
                        opened.
                      </AppText>

                      <AppText
                        variant="label"
                        style={{
                          color:
                            theme.colors
                              .xp,
                        }}
                      >
                        SOMETHING IS
                        INSIDE...
                      </AppText>
                    </View>
                  </View>

                  <Pressable
                    onPress={
                      openTreasure
                    }
                    style={({
                      pressed,
                    }) => [
                      styles.primaryButton,

                      {
                        backgroundColor:
                          theme.colors.xp,
                      },

                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <AppText
                      style={[
                        styles.primaryButtonText,

                        {
                          color:
                            theme.colors
                              .background,
                        },
                      ]}
                    >
                      📦 OPEN CACHE
                    </AppText>
                  </Pressable>
                </>
              )}

            {/* ============================================= */}
            {/* TREASURE OPENED */}
            {/* ============================================= */}

            {encounter.type ===
              "treasure" &&
              treasureOpened && (
                <>
                  <View
                    style={[
                      styles.lootCard,

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
                      variant="label"
                      style={{
                        color:
                          theme.colors.xp,
                      }}
                    >
                      CACHE OPENED
                    </AppText>

                    {lastTreasureItem ? (
                      <>
                        <AppText
                          style={
                            styles.lootIcon
                          }
                        >
                          {
                            lastTreasureItem.icon
                          }
                        </AppText>

                        <AppText
                          variant="title"
                          style={
                            styles.lootName
                          }
                        >
                          {
                            lastTreasureItem.name
                          }
                        </AppText>

                        <AppText
                          variant="label"
                          style={{
                            color:
                              theme.colors
                                .xp,
                          }}
                        >
                          {lastTreasureItem.rarity.toUpperCase()}
                        </AppText>

                        <AppText
                          variant="body"
                          style={[
                            styles.lootDescription,

                            {
                              color:
                                theme.colors
                                  .textSecondary,
                            },
                          ]}
                        >
                          {
                            lastTreasureItem.description
                          }
                        </AppText>

                        <AppText
                          variant="label"
                          style={{
                            color:
                              theme.colors
                                .textSecondary,
                          }}
                        >
                          ADDED TO INVENTORY
                        </AppText>
                      </>
                    ) : (
                      <AppText
                        variant="body"
                        style={{
                          color:
                            theme.colors
                              .textSecondary,
                        }}
                      >
                        Treasure added to
                        your inventory.
                      </AppText>
                    )}

                    <AppText
                      variant="caption"
                      style={{
                        color:
                          theme.colors
                            .textSecondary,
                      }}
                    >
                      TOTAL CACHES:{" "}
                      {treasuresOpened}
                    </AppText>
                  </View>

                  <Pressable
                    onPress={
                      continueAfterTreasure
                    }
                    style={({
                      pressed,
                    }) => [
                      styles.primaryButton,

                      {
                        backgroundColor:
                          theme.colors.xp,
                      },

                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <AppText
                      style={[
                        styles.primaryButtonText,

                        {
                          color:
                            theme.colors
                              .background,
                        },
                      ]}
                    >
                      👣 CONTINUE
                    </AppText>
                  </Pressable>
                </>
              )}

            {/* ============================================= */}
            {/* DISCOVERY */}
            {/* ============================================= */}

            {encounter.type ===
              "discovery" && (
              <View
                style={[
                  styles.infoBanner,

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
                    styles.bannerIcon
                  }
                >
                  ✨
                </AppText>

                <View
                  style={
                    styles.infoBannerContent
                  }
                >
                  <AppText
                    variant="body"
                    style={
                      styles.infoBannerText
                    }
                  >
                    A new forest
                    discovery has been
                    recorded.
                  </AppText>

                  <AppText
                    variant="label"
                    style={{
                      color:
                        theme.colors.xp,
                    }}
                  >
                    DISCOVERIES:{" "}
                    {discoveries}
                  </AppText>
                </View>
              </View>
            )}

            {/* ============================================= */}
            {/* QUIET TRAIL */}
            {/* ============================================= */}

            {encounter.type ===
              "nothing" && (
              <View
                style={[
                  styles.infoBanner,

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
                    styles.bannerIcon
                  }
                >
                  🌿
                </AppText>

                <AppText
                  variant="body"
                  style={
                    styles.infoBannerText
                  }
                >
                  Nothing unusual
                  appears. The trail
                  continues deeper into
                  the forest.
                </AppText>
              </View>
            )}
          </View>

          {/* =============================================== */}
          {/* EXPLORE */}
          {/* =============================================== */}

          {!treasureOpened && (
            <Pressable
              onPress={
                explore
              }
              style={({
                pressed,
              }) => [
                styles.exploreButton,

                {
                  backgroundColor:
                    theme.colors.xp,
                },

                pressed &&
                  styles.pressed,
              ]}
            >
              <View
                style={
                  styles.exploreButtonContent
                }
              >
                <AppText
                  style={[
                    styles.exploreIcon,

                    {
                      color:
                        theme.colors
                          .background,
                    },
                  ]}
                >
                  👣
                </AppText>

                <View
                  style={
                    styles.exploreTextArea
                  }
                >
                  <AppText
                    style={[
                      styles.exploreTitle,

                      {
                        color:
                          theme.colors
                            .background,
                      },
                    ]}
                  >
                    EXPLORE
                  </AppText>

                  <AppText
                    style={[
                      styles.exploreSubtitle,

                      {
                        color:
                          theme.colors
                            .background,
                      },
                    ]}
                  >
                    Venture deeper into
                    the woods
                  </AppText>
                </View>

                <AppText
                  style={[
                    styles.exploreArrow,

                    {
                      color:
                        theme.colors
                          .background,
                    },
                  ]}
                >
                  ›
                </AppText>
              </View>
            </Pressable>
          )}

          {/* =============================================== */}
          {/* SUMMARY */}
          {/* =============================================== */}

          <View
            style={
              styles.summaryRow
            }
          >
            <AppText
              variant="label"
              style={
                styles.summaryText
              }
            >
              📦 {treasuresOpened}
            </AppText>

            <View
              style={
                styles.summaryDot
              }
            />

            <AppText
              variant="label"
              style={
                styles.summaryText
              }
            >
              ✨ {discoveries}
            </AppText>

            <View
              style={
                styles.summaryDot
              }
            />

            <AppText
              variant="label"
              style={
                styles.summaryText
              }
            >
              ⚔️{" "}
              {totalEnemiesDefeated}
            </AppText>
          </View>

          {/* =============================================== */}
          {/* RULE */}
          {/* =============================================== */}

          <AppText
            variant="body"
            style={
              styles.gameRule
            }
          >
            Adventure progress is saved
            permanently. Exploration
            never grants Player XP.
          </AppText>
        </View>
      </ImageBackground>
    </AppScreen>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // --------------------------------------------------------
    // BACKGROUND
    // --------------------------------------------------------

    background: {
      flex: 1,
      minHeight: 700,
    },

    backgroundShade: {
      position: "absolute",

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      backgroundColor:
        "rgba(4, 8, 5, 0.32)",
    },

    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    header: {
      paddingTop: 10,

      paddingHorizontal: 14,

      flexDirection: "row",

      alignItems: "center",

      gap: 10,

      zIndex: 10,
    },

    headerButton: {
      width: 38,
      height: 38,

      borderRadius: 12,

      borderWidth: 1,

      alignItems: "center",

      justifyContent: "center",
    },

    backIcon: {
      fontSize: 29,

      lineHeight: 31,

      marginTop: -3,
    },

    headerCenter: {
      flex: 1,

      minWidth: 0,
    },

    headerLabel: {
      color:
        "rgba(255,255,255,0.68)",

      fontSize: 9,
    },

    headerTitle: {
      color: "#FFFFFF",

      fontSize: 19,

      lineHeight: 23,
    },

    levelBadge: {
      minWidth: 52,

      paddingHorizontal: 8,

      paddingVertical: 7,

      borderRadius: 11,

      alignItems: "center",

      justifyContent: "center",
    },

    levelText: {
      fontSize: 11,

      fontWeight: "900",
    },

    // --------------------------------------------------------
    // SCENE
    // --------------------------------------------------------

    scene: {
      height: 205,

      position: "relative",
    },

    buddyArea: {
      position: "absolute",

      left: 22,

      bottom: 12,

      width: 92,

      alignItems: "center",

      zIndex: 5,
    },

    buddyIcon: {
      fontSize: 56,

      lineHeight: 65,

      zIndex: 2,
    },

    buddyShadow: {
      position: "absolute",

      bottom: 25,

      width: 58,

      height: 13,

      borderRadius: 30,

      backgroundColor:
        "rgba(0,0,0,0.35)",
    },

    buddyNameBadge: {
      borderWidth: 1,

      borderRadius: 8,

      paddingHorizontal: 8,

      paddingVertical: 3,

      maxWidth: 92,
    },

    buddyName: {
      fontSize: 9,
    },

    enemyArea: {
      position: "absolute",

      right: 24,

      bottom: 12,

      width: 120,

      height: 120,

      alignItems: "center",

      justifyContent: "flex-end",

      zIndex: 4,
    },

    enemyImage: {
      width: 115,

      height: 115,

      zIndex: 2,
    },

    enemyShadow: {
      position: "absolute",

      bottom: 4,

      width: 75,

      height: 14,

      borderRadius: 40,

      backgroundColor:
        "rgba(0,0,0,0.35)",
    },

    // --------------------------------------------------------
    // LIGHTS
    // --------------------------------------------------------

    floatingLight: {
      position: "absolute",

      width: 5,

      height: 5,

      borderRadius: 3,

      backgroundColor:
        "rgba(255, 238, 139, 0.85)",
    },

    lightOne: {
      top: "20%",

      left: "28%",
    },

    lightTwo: {
      top: "39%",

      right: "31%",

      width: 4,

      height: 4,

      borderRadius: 2,
    },

    lightThree: {
      top: "13%",

      right: "17%",

      width: 4,

      height: 4,

      borderRadius: 2,
    },

    // --------------------------------------------------------
    // BOTTOM AREA
    // --------------------------------------------------------

    bottomArea: {
      paddingHorizontal: 14,

      paddingBottom: 32,

      gap: 9,
    },

    // --------------------------------------------------------
    // PROGRESS
    // --------------------------------------------------------

    progressRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "flex-end",

      paddingHorizontal: 3,

      gap: 10,
    },

    progressBlock: {
      flex: 1,

      minWidth: 0,
    },

    discoveryArea: {
      alignItems: "flex-end",
    },

    hudLabel: {
      color:
        "rgba(255,255,255,0.72)",

      fontSize: 9,
    },

    hudSecondary: {
      color:
        "rgba(255,255,255,0.88)",

      fontSize: 11,

      lineHeight: 15,

      marginTop: 1,
    },

    discoveryValue: {
      fontSize: 14,

      lineHeight: 18,

      fontWeight: "900",

      marginTop: 1,
    },

    // --------------------------------------------------------
    // ENCOUNTER
    // --------------------------------------------------------

    encounterCard: {
      borderWidth: 1,

      borderRadius: 16,

      padding: 12,

      gap: 9,
    },

    encounterTop: {
      flexDirection: "row",

      alignItems: "center",

      gap: 9,
    },

    encounterIconBox: {
      width: 40,

      height: 40,

      borderRadius: 12,

      borderWidth: 1,

      alignItems: "center",

      justifyContent: "center",

      flexShrink: 0,
    },

    encounterIcon: {
      fontSize: 20,

      lineHeight: 25,
    },

    encounterText: {
      flex: 1,

      minWidth: 0,
    },

    encounterTitle: {
      fontSize: 16,

      lineHeight: 20,
    },

    encounterDescription: {
      fontSize: 12,

      lineHeight: 17,
    },

    // --------------------------------------------------------
    // PRIMARY BUTTON
    // --------------------------------------------------------

    primaryButton: {
      minHeight: 42,

      borderRadius: 12,

      alignItems: "center",

      justifyContent: "center",

      paddingHorizontal: 14,
    },

    primaryButtonText: {
      fontSize: 11,

      fontWeight: "900",

      letterSpacing: 0.45,
    },

    // --------------------------------------------------------
    // INFO
    // --------------------------------------------------------

    infoBanner: {
      flexDirection: "row",

      alignItems: "center",

      gap: 8,

      borderWidth: 1,

      borderRadius: 11,

      padding: 9,
    },

    infoBannerContent: {
      flex: 1,

      minWidth: 0,

      gap: 2,
    },

    infoBannerText: {
      flex: 1,

      minWidth: 0,

      fontSize: 11,

      lineHeight: 15,
    },

    bannerIcon: {
      fontSize: 18,
    },

    // --------------------------------------------------------
    // LOOT
    // --------------------------------------------------------

    lootCard: {
      borderWidth: 1,

      borderRadius: 14,

      padding: 12,

      alignItems: "center",

      gap: 4,
    },

    lootIcon: {
      fontSize: 36,

      lineHeight: 43,

      marginTop: 1,
    },

    lootName: {
      fontSize: 17,

      lineHeight: 21,

      textAlign: "center",
    },

    lootDescription: {
      fontSize: 11,

      lineHeight: 16,

      textAlign: "center",

      maxWidth: 270,

      marginTop: 3,

      marginBottom: 3,
    },

    // --------------------------------------------------------
    // EXPLORE
    // --------------------------------------------------------

    exploreButton: {
      minHeight: 56,

      borderRadius: 15,

      justifyContent: "center",

      paddingHorizontal: 14,
    },

    exploreButtonContent: {
      flexDirection: "row",

      alignItems: "center",

      gap: 10,
    },

    exploreIcon: {
      fontSize: 21,

      lineHeight: 26,
    },

    exploreTextArea: {
      flex: 1,

      minWidth: 0,
    },

    exploreTitle: {
      fontSize: 13,

      fontWeight: "900",

      letterSpacing: 0.7,
    },

    exploreSubtitle: {
      fontSize: 10,

      fontWeight: "600",

      opacity: 0.72,

      marginTop: 1,
    },

    exploreArrow: {
      fontSize: 27,

      lineHeight: 29,

      fontWeight: "500",
    },

    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    summaryRow: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",

      gap: 9,

      marginTop: 1,
    },

    summaryText: {
      color:
        "rgba(255,255,255,0.82)",

      fontSize: 9,
    },

    summaryDot: {
      width: 3,

      height: 3,

      borderRadius: 2,

      backgroundColor:
        "rgba(255,255,255,0.35)",
    },

    // --------------------------------------------------------
    // RULE
    // --------------------------------------------------------

    gameRule: {
      color:
        "rgba(255,255,255,0.58)",

      textAlign: "center",

      fontSize: 9,

      lineHeight: 12,

      paddingHorizontal: 15,
    },

    // --------------------------------------------------------
    // PRESS
    // --------------------------------------------------------

    pressed: {
      opacity: 0.78,

      transform: [
        {
          scale: 0.98,
        },
      ],
    },
  });