import { router } from "expo-router";
import {
  Animated,
  Easing,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

import type { BuddySpecies } from "../../context/AppContext";

type BuddyScene = {
  icon: string;
  message: string;
  subMessage: string;
};

function getBuddyScene(
  species: BuddySpecies,
): BuddyScene {
  switch (species) {
    case "dog":
      return {
        icon: "🐶",
        message: "Ready for an adventure!",
        subMessage:
          "The forest has your Buddy in a great mood.",
      };

    case "cat":
      return {
        icon: "🐱",
        message: "Watching the forest.",
        subMessage:
          "Something moving between the trees has caught their attention.",
      };

    case "dragon":
      return {
        icon: "🐲",
        message: "Growing stronger.",
        subMessage:
          "A small dragon with a very big adventure ahead.",
      };

    case "robot":
      return {
        icon: "🤖",
        message: "Forest scan complete.",
        subMessage:
          "Systems online. Real-life progress detected.",
      };

    case "mystery":
    default:
      return {
        icon: "🥚",
        message: "Something is stirring inside...",
        subMessage:
          "Keep living, learning and moving. Who knows what will hatch?",
      };
  }
}

export default function BuddyHomeScreen() {
  const {
    buddy,
    level,
    buddyLifeStats,
  } = useApp();

  const { theme } = useTheme();

  /*
   * BUDDY ANIMATION
   *
   * These animations are visual only.
   * They never give XP, stats or build points.
   */
  const buddyFloat =
    useRef(new Animated.Value(0)).current;

  const buddyTilt =
    useRef(new Animated.Value(0)).current;

  const buddyScale =
    useRef(new Animated.Value(1)).current;

  /*
   * FOREST EFFECTS
   */
  const leafOne =
    useRef(new Animated.Value(0)).current;

  const leafTwo =
    useRef(new Animated.Value(0)).current;

  const leafThree =
    useRef(new Animated.Value(0)).current;

  const leafFour =
    useRef(new Animated.Value(0)).current;

  const leafFive =
    useRef(new Animated.Value(0)).current;

  const leafSix =
    useRef(new Animated.Value(0)).current;

  const glowAnimation =
    useRef(new Animated.Value(0)).current;

  /*
   * Gentle Buddy idle movement.
   */
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(
          buddyFloat,
          {
            toValue: -7,
            duration: 1600,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          buddyFloat,
          {
            toValue: 0,
            duration: 1600,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          },
        ),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [buddyFloat]);

  /*
   * Very subtle light breathing effect.
   */
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(
          glowAnimation,
          {
            toValue: 1,
            duration: 3500,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          glowAnimation,
          {
            toValue: 0,
            duration: 3500,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          },
        ),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [glowAnimation]);

  function createLeafAnimation(
    value: Animated.Value,
    duration: number,
    delay: number,
  ) {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),

        Animated.timing(
          value,
          {
            toValue: 1,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          value,
          {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          },
        ),
      ]),
    );
  }

  /*
   * Falling leaves.
   */
  useEffect(() => {
    const animations = [
      createLeafAnimation(
        leafOne,
        6500,
        0,
      ),

      createLeafAnimation(
        leafTwo,
        7600,
        1000,
      ),

      createLeafAnimation(
        leafThree,
        5700,
        2300,
      ),

      createLeafAnimation(
        leafFour,
        8200,
        600,
      ),

      createLeafAnimation(
        leafFive,
        6900,
        3200,
      ),

      createLeafAnimation(
        leafSix,
        8800,
        1800,
      ),
    ];

    animations.forEach(
      animation => animation.start(),
    );

    return () => {
      animations.forEach(
        animation => animation.stop(),
      );
    };
  }, [
    leafOne,
    leafTwo,
    leafThree,
    leafFour,
    leafFive,
    leafSix,
  ]);

  /*
   * Mystery Egg occasionally wiggles.
   */
  useEffect(() => {
    if (!buddy) {
      return;
    }

    let timeout:
      | ReturnType<typeof setTimeout>
      | undefined;

    const animateBuddy = () => {
      const amount =
        buddy.species === "mystery"
          ? 1
          : 0.4;

      Animated.sequence([
        Animated.timing(
          buddyTilt,
          {
            toValue: -amount,
            duration: 110,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          buddyTilt,
          {
            toValue: amount,
            duration: 140,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          buddyTilt,
          {
            toValue: -amount * 0.55,
            duration: 120,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          buddyTilt,
          {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          },
        ),
      ]).start();

      const nextAnimation =
        buddy.species === "mystery"
          ? 2800 +
            Math.random() * 3000
          : 5000 +
            Math.random() * 4000;

      timeout = setTimeout(
        animateBuddy,
        nextAnimation,
      );
    };

    timeout = setTimeout(
      animateBuddy,
      2200,
    );

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    buddy,
    buddyTilt,
  ]);

  /*
   * Tap Buddy.
   *
   * Animation only.
   * No XP is awarded here.
   */
  function interactWithBuddy() {
    if (!buddy) {
      return;
    }

    if (
      buddy.species === "mystery"
    ) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(
            buddyTilt,
            {
              toValue: -1,
              duration: 75,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            buddyTilt,
            {
              toValue: 1,
              duration: 90,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            buddyTilt,
            {
              toValue: -1,
              duration: 90,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            buddyTilt,
            {
              toValue: 1,
              duration: 90,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            buddyTilt,
            {
              toValue: -0.5,
              duration: 90,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            buddyTilt,
            {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            },
          ),
        ]),

        Animated.sequence([
          Animated.spring(
            buddyScale,
            {
              toValue: 1.1,
              speed: 24,
              bounciness: 10,
              useNativeDriver: true,
            },
          ),

          Animated.spring(
            buddyScale,
            {
              toValue: 1,
              speed: 18,
              bounciness: 10,
              useNativeDriver: true,
            },
          ),
        ]),
      ]).start();

      return;
    }

    Animated.sequence([
      Animated.spring(
        buddyScale,
        {
          toValue: 1.15,
          speed: 22,
          bounciness: 10,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        buddyScale,
        {
          toValue: 0.94,
          speed: 22,
          bounciness: 8,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        buddyScale,
        {
          toValue: 1,
          speed: 18,
          bounciness: 10,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }

  const scene = useMemo(
    () =>
      buddy
        ? getBuddyScene(
            buddy.species,
          )
        : null,
    [buddy],
  );

  /*
   * NO BUDDY
   */
  if (!buddy || !scene) {
    return (
      <AppScreen scroll>
        <View style={styles.page}>
          <Pressable
            onPress={() =>
              router.back()
            }
            style={({ pressed }) => [
              styles.backButton,
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
              variant="label"
              style={{
                color:
                  theme.colors.primary,
              }}
            >
              ← BACK
            </AppText>
          </Pressable>

          <View
            style={
              styles.emptyHeader
            }
          >
            <AppText
              variant="caption"
              style={{
                color:
                  theme.colors.primary,
              }}
            >
              BUDDY
            </AppText>

            <AppText variant="title">
              No Buddy yet
            </AppText>

            <AppText
              variant="secondary"
              style={
                styles.emptyText
              }
            >
              Create your companion
              before entering the
              forest.
            </AppText>
          </View>

          <AppCard
            onPress={() =>
              router.push(
                "/create-buddy",
              )
            }
          >
            <View
              style={
                styles.createRow
              }
            >
              <AppText
                style={
                  styles.createEgg
                }
              >
                🥚
              </AppText>

              <View
                style={
                  styles.createText
                }
              >
                <AppText
                  variant="label"
                  style={{
                    color:
                      theme.colors
                        .primary,
                  }}
                >
                  CREATE BUDDY
                </AppText>

                <AppText
                  variant="secondary"
                >
                  Your adventure starts
                  here.
                </AppText>
              </View>

              <AppText
                style={{
                  color:
                    theme.colors.primary,
                }}
              >
                →
              </AppText>
            </View>
          </AppCard>
        </View>
      </AppScreen>
    );
  }

  const buddyRotation =
    buddyTilt.interpolate({
      inputRange: [-1, 0, 1],

      outputRange:
        buddy.species === "mystery"
          ? [
              "-8deg",
              "0deg",
              "8deg",
            ]
          : [
              "-4deg",
              "0deg",
              "4deg",
            ],
    });

  const glowOpacity =
    glowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.04, 0.13],
    });

  return (
    <AppScreen scroll>
      <View style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={() =>
              router.back()
            }
            style={({ pressed }) => [
              styles.backButton,
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
              variant="label"
              style={{
                color:
                  theme.colors.primary,
              }}
            >
              ← BACK
            </AppText>
          </Pressable>

          <View
            style={
              styles.headerCenter
            }
          >
            <AppText
              variant="caption"
              style={{
                color:
                  theme.colors.muted,
              }}
            >
              BUDDY
            </AppText>

            <AppText
              variant="label"
              numberOfLines={1}
            >
              {buddy.name}
            </AppText>
          </View>

          <View
            style={[
              styles.levelBadge,
              {
                backgroundColor:
                  `${theme.colors.primary}18`,

                borderColor:
                  theme.colors.primary,
              },
            ]}
          >
            <AppText
              variant="caption"
              style={{
                color:
                  theme.colors.primary,
              }}
            >
              LV {level}
            </AppText>
          </View>
        </View>

        {/* FOREST SCENE */}
        <View
          style={[
            styles.sceneContainer,
            {
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <ImageBackground
            source={require(
              "../../../assets/images/buddy-forest.png"
            )}
            resizeMode="cover"
            style={
              styles.forestBackground
            }
            imageStyle={
              styles.forestImage
            }
          >
            <View
              pointerEvents="none"
              style={
                styles.topShade
              }
            />

            <Animated.View
              pointerEvents="none"
              style={[
                styles.sunGlow,
                {
                  opacity:
                    glowOpacity,
                },
              ]}
            />

            {/* FALLING LEAVES */}
            <ForestLeaf
              animation={leafOne}
              startX={20}
              endX={120}
              startY={-20}
              endY={320}
              symbol="◆"
              size={13}
            />

            <ForestLeaf
              animation={leafTwo}
              startX={280}
              endX={190}
              startY={-35}
              endY={330}
              symbol="◆"
              size={10}
            />

            <ForestLeaf
              animation={leafThree}
              startX={130}
              endX={230}
              startY={-15}
              endY={330}
              symbol="●"
              size={8}
            />

            <ForestLeaf
              animation={leafFour}
              startX={340}
              endX={255}
              startY={-30}
              endY={320}
              symbol="◆"
              size={12}
            />

            <ForestLeaf
              animation={leafFive}
              startX={75}
              endX={155}
              startY={-25}
              endY={340}
              symbol="●"
              size={9}
            />

            <ForestLeaf
              animation={leafSix}
              startX={230}
              endX={315}
              startY={-40}
              endY={325}
              symbol="◆"
              size={8}
            />

            {/* FOREST LABEL */}
            <View
              style={
                styles.sceneName
              }
            >
              <AppText
                variant="caption"
                style={
                  styles.sceneCaption
                }
              >
                FOREST HOME
              </AppText>

              <AppText
                style={
                  styles.sceneBuddyName
                }
                numberOfLines={1}
              >
                {buddy.name}
              </AppText>
            </View>

            {/* BUDDY */}
            <View
              style={
                styles.buddyStage
              }
            >
              <Pressable
                onPress={
                  interactWithBuddy
                }
                style={
                  styles.buddyPressable
                }
              >
                <Animated.View
                  style={[
                    styles.buddyAnimated,

                    {
                      transform: [
                        {
                          translateY:
                            buddyFloat,
                        },

                        {
                          rotate:
                            buddyRotation,
                        },

                        {
                          scale:
                            buddyScale,
                        },
                      ],
                    },
                  ]}
                >
                  <AppText
                    style={
                      styles.buddyIcon
                    }
                  >
                    {scene.icon}
                  </AppText>
                </Animated.View>
              </Pressable>

              <View
                style={
                  styles.buddyShadow
                }
              />
            </View>

            <View
              pointerEvents="none"
              style={
                styles.bottomShade
              }
            />

            <View
              style={
                styles.sceneHint
              }
            >
              <AppText
                variant="caption"
                style={
                  styles.sceneHintText
                }
              >
                TAP{" "}
                {buddy.name.toUpperCase()}{" "}
                TO INTERACT
              </AppText>
            </View>
          </ImageBackground>
        </View>

        {/* STATUS */}
        <AppCard
          style={
            styles.messageCard
          }
        >
          <View
            style={
              styles.messageRow
            }
          >
            <View
              style={[
                styles.statusIcon,
                {
                  backgroundColor:
                    `${theme.colors.primary}18`,
                },
              ]}
            >
              <AppText
                style={
                  styles.statusEmoji
                }
              >
                🍃
              </AppText>
            </View>

            <View
              style={
                styles.messageText
              }
            >
              <AppText
                variant="caption"
                style={{
                  color:
                    theme.colors.primary,
                }}
              >
                RIGHT NOW
              </AppText>

              <AppText
                variant="label"
              >
                {scene.message}
              </AppText>

              <AppText
                variant="secondary"
              >
                {scene.subMessage}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* LIFE STATS */}
        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <AppText
              variant="caption"
              style={{
                color:
                  theme.colors.primary,
              }}
            >
              REAL-LIFE POWER
            </AppText>

            <AppText
              variant="label"
            >
              Life Stats
            </AppText>
          </View>

          <AppText
            variant="caption"
            style={{
              color:
                theme.colors.muted,
            }}
          >
            FROM ACTIVITY
          </AppText>
        </View>

        <View
          style={
            styles.statsGrid
          }
        >
          <LifeStat
            icon="❤️"
            label="VIT"
            value={
              buddyLifeStats.vitality
            }
            backgroundColor={
              theme.colors.cardAlt
            }
            borderColor={
              theme.colors.border
            }
            mutedColor={
              theme.colors.muted
            }
          />

          <LifeStat
            icon="⚔️"
            label="POW"
            value={
              buddyLifeStats.power
            }
            backgroundColor={
              theme.colors.cardAlt
            }
            borderColor={
              theme.colors.border
            }
            mutedColor={
              theme.colors.muted
            }
          />

          <LifeStat
            icon="🏃"
            label="AGI"
            value={
              buddyLifeStats.agility
            }
            backgroundColor={
              theme.colors.cardAlt
            }
            borderColor={
              theme.colors.border
            }
            mutedColor={
              theme.colors.muted
            }
          />

          <LifeStat
            icon="🧠"
            label="INT"
            value={
              buddyLifeStats.intelligence
            }
            backgroundColor={
              theme.colors.cardAlt
            }
            borderColor={
              theme.colors.border
            }
            mutedColor={
              theme.colors.muted
            }
          />
        </View>

        {/* DETAILS */}
        <Pressable
          onPress={() =>
            router.push("/buddy")
          }
          style={({ pressed }) => [
            styles.detailsButton,

            {
              backgroundColor:
                theme.colors.card,

              borderColor:
                theme.colors.border,
            },

            pressed &&
              styles.actionPressed,
          ]}
        >
          <AppText
            style={
              styles.actionIcon
            }
          >
            ◫
          </AppText>

          <View>
            <AppText
              variant="label"
            >
              DETAILS
            </AppText>

            <AppText
              variant="caption"
              style={{
                color:
                  theme.colors.muted,
              }}
            >
              Stats & build
            </AppText>
          </View>
        </Pressable>

        {/* RULE */}
        <View
          style={[
            styles.rule,

            {
              borderTopColor:
                theme.colors.border,
            },
          ]}
        >
          <AppText
            variant="caption"
            style={[
              styles.ruleText,

              {
                color:
                  theme.colors.muted,
              },
            ]}
          >
            YOUR REAL LIFE MAKES YOUR
            BUDDY STRONGER.
          </AppText>
        </View>
      </View>
    </AppScreen>
  );
}

/*
 * FALLING LEAF
 */

type ForestLeafProps = {
  animation: Animated.Value;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  symbol: string;
  size: number;
};

function ForestLeaf({
  animation,
  startX,
  endX,
  startY,
  endY,
  symbol,
  size,
}: ForestLeafProps) {
  const translateX =
    animation.interpolate({
      inputRange: [
        0,
        0.25,
        0.5,
        0.75,
        1,
      ],

      outputRange: [
        startX,
        endX,
        startX + 35,
        endX - 25,
        endX,
      ],
    });

  const translateY =
    animation.interpolate({
      inputRange: [0, 1],

      outputRange: [
        startY,
        endY,
      ],
    });

  const rotate =
    animation.interpolate({
      inputRange: [0, 1],

      outputRange: [
        "0deg",
        "600deg",
      ],
    });

  const opacity =
    animation.interpolate({
      inputRange: [
        0,
        0.08,
        0.82,
        1,
      ],

      outputRange: [
        0,
        0.9,
        0.85,
        0,
      ],
    });

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.fallingLeaf,

        {
          fontSize: size,
          opacity,

          transform: [
            {
              translateX,
            },

            {
              translateY,
            },

            {
              rotate,
            },
          ],
        },
      ]}
    >
      {symbol}
    </Animated.Text>
  );
}

/*
 * LIFE STAT
 */

type LifeStatProps = {
  icon: string;
  label: string;
  value: number;
  backgroundColor: string;
  borderColor: string;
  mutedColor: string;
};

function LifeStat({
  icon,
  label,
  value,
  backgroundColor,
  borderColor,
  mutedColor,
}: LifeStatProps) {
  return (
    <View
      style={[
        styles.statBox,

        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <AppText
        style={
          styles.statIcon
        }
      >
        {icon}
      </AppText>

      <View>
        <AppText
          variant="caption"
          style={{
            color: mutedColor,
          }}
        >
          {label}
        </AppText>

        <AppText
          style={
            styles.statValue
          }
        >
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 12,
    paddingBottom: 130,
    gap: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backButton: {
    minHeight: 38,
    paddingHorizontal: 12,

    borderRadius: 10,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    gap: 2,
  },

  levelBadge: {
    minWidth: 58,
    minHeight: 38,

    paddingHorizontal: 10,

    borderRadius: 10,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * FOREST
   */

  sceneContainer: {
    height: 350,

    borderRadius: 22,
    borderWidth: 1,

    overflow: "hidden",

    shadowColor: "#000000",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 8,
  },

  forestBackground: {
    flex: 1,
    position: "relative",
  },

  forestImage: {
    borderRadius: 21,
  },

  topShade: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    height: 100,

    backgroundColor:
      "rgba(0,0,0,0.18)",
  },

  sunGlow: {
    position: "absolute",

    top: -55,
    right: -40,

    width: 220,
    height: 220,

    borderRadius: 110,

    backgroundColor:
      "#FFF3B0",
  },

  sceneName: {
    position: "absolute",

    top: 18,
    left: 18,

    paddingHorizontal: 12,
    paddingVertical: 9,

    borderRadius: 12,

    backgroundColor:
      "rgba(10,16,12,0.48)",
  },

  sceneCaption: {
    color:
      "rgba(255,255,255,0.68)",

    letterSpacing: 1.2,
  },

  sceneBuddyName: {
    color: "#FFFFFF",

    marginTop: 2,

    fontSize: 19,
    lineHeight: 23,
    fontWeight: "900",
  },

  /*
   * BUDDY
   */

  buddyStage: {
    position: "absolute",

    left: 0,
    right: 0,

    top: 35,

    height: 185,

    alignItems: "center",
    justifyContent: "flex-end",

    zIndex: 5,
  },

  buddyPressable: {
    zIndex: 3,
  },

  buddyAnimated: {
    width: 140,
    height: 140,

    alignItems: "center",
    justifyContent: "center",
  },

  buddyIcon: {
    fontSize: 100,
    lineHeight: 122,
  },

  buddyShadow: {
    width: 88,
    height: 15,

    marginTop: -18,

    borderRadius: 50,

    backgroundColor:
      "rgba(0,0,0,0.32)",

    transform: [
      {
        scaleY: 0.5,
      },
    ],
  },

  bottomShade: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: 70,

    backgroundColor:
      "rgba(0,0,0,0.24)",
  },

  sceneHint: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 15,

    alignItems: "center",

    zIndex: 20,
  },

  sceneHintText: {
    color:
      "rgba(255,255,255,0.86)",

    letterSpacing: 1.2,

    textShadowColor:
      "rgba(0,0,0,0.8)",

    textShadowRadius: 5,

    textShadowOffset: {
      width: 0,
      height: 1,
    },
  },

  /*
   * LEAVES
   */

  fallingLeaf: {
    position: "absolute",

    left: 0,
    top: 0,

    zIndex: 12,

    color: "#E1A440",

    textShadowColor:
      "rgba(0,0,0,0.25)",

    textShadowRadius: 2,
  },

  /*
   * STATUS
   */

  messageCard: {
    paddingVertical: 15,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  statusIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  statusEmoji: {
    fontSize: 23,
  },

  messageText: {
    flex: 1,
    gap: 3,
  },

  /*
   * LIFE STATS
   */

  sectionHeader: {
    marginTop: 4,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statBox: {
    width: "48%",
    minHeight: 72,

    borderRadius: 12,
    borderWidth: 1,

    paddingHorizontal: 12,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    flexGrow: 1,
  },

  statIcon: {
    fontSize: 24,
  },

  statValue: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "900",
  },

  /*
   * DETAILS
   */

  detailsButton: {
    width: "100%",
    minHeight: 58,

    borderRadius: 14,
    borderWidth: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,
  },

  actionIcon: {
    fontSize: 22,
  },

  actionPressed: {
    opacity: 0.76,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  pressed: {
    opacity: 0.7,
  },

  /*
   * FOOTER
   */

  rule: {
    marginTop: 8,

    paddingTop: 16,

    borderTopWidth: 1,
  },

  ruleText: {
    textAlign: "center",
    letterSpacing: 0.7,
  },

  /*
   * NO BUDDY
   */

  emptyHeader: {
    marginTop: 20,
    gap: 8,
  },

  emptyText: {
    lineHeight: 22,
  },

  createRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  createEgg: {
    fontSize: 48,
  },

  createText: {
    flex: 1,
    gap: 4,
  },
});