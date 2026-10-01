import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  useState,
} from "react";

import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";

import {
  BuddySpecies,
  useApp,
} from "../context/AppContext";

import {
  useTheme,
} from "../context/ThemeContext";

// ============================================================
// BUDDY OPTIONS
// ============================================================

type BuddyOption = {
  species: BuddySpecies;
  icon: string;
  name: string;
  description: string;
};

const BUDDY_OPTIONS:
  BuddyOption[] = [
    {
      species: "dog",
      icon: "🐶",
      name: "Dog",
      description:
        "Loyal, energetic and always ready for an adventure.",
    },
    {
      species: "cat",
      icon: "🐱",
      name: "Cat",
      description:
        "Curious, clever and confidently independent.",
    },
    {
      species: "dragon",
      icon: "🐲",
      name: "Dragon",
      description:
        "A young mythical companion with enormous potential.",
    },
    {
      species: "robot",
      icon: "🤖",
      name: "Robot",
      description:
        "A mechanical buddy that upgrades as you progress.",
    },
    {
      species: "mystery",
      icon: "🥚",
      name: "Mystery Egg",
      description:
        "Nobody knows what it may become.",
    },
  ];

// ============================================================
// SCREEN
// ============================================================

export default function CreateBuddyScreen() {
  const {
    buddy,
    createBuddy,
    level,
    buddyUnspentBuildPoints,
  } =
    useApp();

  const {
    theme,
  } =
    useTheme();

  const [
    selectedSpecies,
    setSelectedSpecies,
  ] =
    useState<BuddySpecies>(
      "mystery"
    );

  const [
    buddyName,
    setBuddyName,
  ] =
    useState("");

  const selectedBuddy =
    BUDDY_OPTIONS.find(
      option =>
        option.species ===
        selectedSpecies
    ) ??
    BUDDY_OPTIONS[
      BUDDY_OPTIONS.length -
        1
    ];

  const canCreate =
    buddyName.trim().length >
    0;

  // ==========================================================
  // CREATE
  // ==========================================================

  function handleCreateBuddy() {
    if (
      !canCreate
    ) {
      return;
    }

    createBuddy({
      name:
        buddyName.trim(),

      species:
        selectedSpecies,
    });

    router.replace(
      "/buddy"
    );
  }

  // ==========================================================
  // EXISTING BUDDY
  // ==========================================================

  if (
    buddy
  ) {
    const existingOption =
      BUDDY_OPTIONS.find(
        option =>
          option.species ===
          buddy.species
      );

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
              Companion Found
            </AppText>
          </View>
        </View>

        <AppCard>
          <View
            style={
              styles.existingBuddy
            }
          >
            <AppText
              style={
                styles.existingIcon
              }
            >
              {existingOption
                ?.icon ??
                "🥚"}
            </AppText>

            <AppText
              variant="title"
            >
              {buddy.name}
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
              Your companion is
              already linked to
              your real-life
              progress.
            </AppText>
          </View>

          <View
            style={
              styles.existingStats
            }
          >
            <View
              style={[
                styles.smallStat,
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
                variant="label"
              >
                PLAYER LEVEL
              </AppText>

              <AppText
                variant="title"
              >
                {level}
              </AppText>
            </View>

            <View
              style={[
                styles.smallStat,
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
                variant="label"
              >
                FREE POINTS
              </AppText>

              <AppText
                variant="title"
              >
                {
                  buddyUnspentBuildPoints
                }
              </AppText>
            </View>
          </View>
        </AppCard>

        <AppButton
          title="Open Buddy"
          onPress={() =>
            router.replace(
              "/buddy"
            )
          }
        />
      </AppScreen>
    );
  }

  // ==========================================================
  // CREATE BUDDY UI
  // ==========================================================

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
            COMPANION
          </AppText>

          <AppText
            variant="title"
          >
            Choose Your Buddy
          </AppText>
        </View>
      </View>

      <AppText
        variant="body"
        style={[
          styles.intro,
          {
            color:
              theme.colors
                .textSecondary,
          },
        ]}
      >
        Your Buddy grows from
        what you accomplish in
        real life.
      </AppText>

      {/* ======================================================
          PREVIEW
      ====================================================== */}

      <AppCard
        variant="alt"
      >
        <View
          style={
            styles.preview
          }
        >
          <View
            style={[
              styles.previewCircle,
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
                styles.previewIcon
              }
            >
              {
                selectedBuddy.icon
              }
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
              SELECTED BUDDY
            </AppText>

            <AppText
              variant="title"
            >
              {
                selectedBuddy.name
              }
            </AppText>

            <AppText
              variant="body"
              style={{
                color:
                  theme.colors
                    .textSecondary,
              }}
            >
              {
                selectedBuddy.description
              }
            </AppText>
          </View>
        </View>
      </AppCard>

      {/* ======================================================
          BUDDY SELECTION
      ====================================================== */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <AppText
          variant="label"
        >
          CHOOSE A COMPANION
        </AppText>
      </View>

      <View
        style={
          styles.buddyGrid
        }
      >
        {BUDDY_OPTIONS.map(
          option => {
            const selected =
              selectedSpecies ===
              option.species;

            return (
              <Pressable
                key={
                  option.species
                }
                onPress={() =>
                  setSelectedSpecies(
                    option.species
                  )
                }
                style={[
                  styles.buddyOption,
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
                    styles.buddyIcon
                  }
                >
                  {
                    option.icon
                  }
                </AppText>

                <AppText
                  variant="body"
                  style={
                    styles.buddyName
                  }
                >
                  {
                    option.name
                  }
                </AppText>

                {selected && (
                  <View
                    style={[
                      styles.selectedBadge,
                      {
                        backgroundColor:
                          theme.colors
                            .xp,
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.selectedCheck,
                        {
                          color:
                            theme.colors
                              .background,
                        },
                      ]}
                    >
                      ✓
                    </AppText>
                  </View>
                )}
              </Pressable>
            );
          }
        )}
      </View>

      {/* ======================================================
          NAME
      ====================================================== */}

      <View
        style={
          styles.nameSection
        }
      >
        <AppText
          variant="label"
        >
          NAME YOUR BUDDY
        </AppText>

        <AppInput
  value={
    buddyName
  }
  onChangeText={
    setBuddyName
  }
  placeholder="Buddy name"
/>

        <AppText
          variant="body"
          style={[
            styles.helperText,
            {
              color:
                theme.colors
                  .muted,
            },
          ]}
        >
          This can be changed
          later.
        </AppText>
      </View>

      {/* ======================================================
          RULE
      ====================================================== */}

      <AppCard>
        <View
          style={
            styles.ruleRow
          }
        >
          <View
            style={[
              styles.ruleIcon,
              {
                backgroundColor:
                  theme.colors
                    .cardAlt,
              },
            ]}
          >
            <AppText
              style={
                styles.ruleEmoji
              }
            >
              ✦
            </AppText>
          </View>

          <View
            style={
              styles.ruleText
            }
          >
            <AppText
              variant="body"
              style={
                styles.ruleTitle
              }
            >
              Real life powers
              your Buddy
            </AppText>

            <AppText
              variant="body"
              style={{
                color:
                  theme.colors
                    .textSecondary,
              }}
            >
              Activities,
              learning and
              training shape its
              abilities. The
              game itself does
              not generate
              permanent XP.
            </AppText>
          </View>
        </View>
      </AppCard>

      {/* ======================================================
          CREATE
      ====================================================== */}

      <View
        style={
          styles.createSection
        }
      >
        <AppButton
          title={
            canCreate
              ? `Choose ${buddyName.trim()}`
              : "Name Your Buddy"
          }
          onPress={
            handleCreateBuddy
          }
          disabled={
            !canCreate
          }
        />

        <AppText
          variant="body"
          style={[
            styles.createNote,
            {
              color:
                theme.colors
                  .muted,
            },
          ]}
        >
          Your Buddy will begin
          at your current Player
          progression.
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
    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap:
        14,
      marginBottom:
        12,
    },

    backButton: {
      width:
        44,
      height:
        44,
      borderRadius:
        14,
      borderWidth:
        1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    backText: {
      fontSize:
        34,
      lineHeight:
        36,
      marginTop:
        -3,
    },

    headerText: {
      flex:
        1,
    },

    intro: {
      marginBottom:
        20,
      lineHeight:
        22,
    },

    preview: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap:
        18,
    },

    previewCircle: {
      width:
        92,
      height:
        92,
      borderRadius:
        46,
      borderWidth:
        2,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    previewIcon: {
      fontSize:
        54,
      lineHeight:
        64,
    },

    previewText: {
      flex:
        1,
      gap:
        3,
    },

    sectionHeader: {
      marginTop:
        24,
      marginBottom:
        10,
    },

    buddyGrid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap:
        10,
    },

    buddyOption: {
      width:
        "31%",
      minHeight:
        112,
      borderRadius:
        18,
      borderWidth:
        1,
      alignItems:
        "center",
      justifyContent:
        "center",
      padding:
        10,
      position:
        "relative",
    },

    buddyIcon: {
      fontSize:
        38,
      lineHeight:
        48,
    },

    buddyName: {
      marginTop:
        4,
      textAlign:
        "center",
      fontWeight:
        "700",
    },

    selectedBadge: {
      position:
        "absolute",
      top:
        7,
      right:
        7,
      width:
        20,
      height:
        20,
      borderRadius:
        10,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    selectedCheck: {
      fontSize:
        12,
      fontWeight:
        "900",
    },

    nameSection: {
      marginTop:
        26,
      gap:
        9,
    },

    helperText: {
      fontSize:
        12,
    },

    ruleRow: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      gap:
        14,
    },

    ruleIcon: {
      width:
        44,
      height:
        44,
      borderRadius:
        14,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    ruleEmoji: {
      fontSize:
        21,
    },

    ruleText: {
      flex:
        1,
      gap:
        4,
    },

    ruleTitle: {
      fontWeight:
        "800",
    },

    createSection: {
      marginTop:
        18,
      paddingBottom:
        28,
      gap:
        10,
    },

    createNote: {
      textAlign:
        "center",
      fontSize:
        12,
    },

    existingBuddy: {
      alignItems:
        "center",
      gap:
        8,
      paddingVertical:
        10,
    },

    existingIcon: {
      fontSize:
        72,
      lineHeight:
        82,
    },

    centerText: {
      textAlign:
        "center",
      maxWidth:
        280,
    },

    existingStats: {
      flexDirection:
        "row",
      gap:
        10,
      marginTop:
        18,
    },

    smallStat: {
      flex:
        1,
      borderRadius:
        16,
      borderWidth:
        1,
      padding:
        14,
      gap:
        4,
    },
  });