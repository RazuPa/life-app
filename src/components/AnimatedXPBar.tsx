import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import AppText from "./AppText";
import { useTheme } from "../context/ThemeContext";

import {
  getProgression,
  XP_PER_LEVEL,
} from "../utils/progression";

import type {
  Achievement,
} from "../utils/achievements";

// ============================================================
// TYPES
// ============================================================

type AnimatedXPBarProps = {
  xpBefore: number;
  xpAfter: number;

  unlockedAchievements?: Achievement[];

  onLevelUp?: (
    newLevel: number
  ) => void;

  onComplete?: () => void;
};

// ============================================================
// ANIMATION TIMING
// ============================================================

const START_DELAY = 650;

const XP_PER_SECOND = 220;

const MIN_FILL_DURATION = 700;

const MAX_FILL_DURATION = 2200;

const FULL_BAR_HOLD = 350;

const LEVEL_CELEBRATION_HOLD = 850;

const RESET_DELAY = 250;

const ACHIEVEMENT_DELAY = 250;

const ACHIEVEMENT_HOLD = 1200;

const BETWEEN_ACHIEVEMENTS_DELAY = 200;

const FINAL_DELAY = 250;

// ============================================================
// HELPERS
// ============================================================

function wait(
  milliseconds: number
) {
  return new Promise<void>(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}

function getAnimationDuration(
  xpDifference: number
) {
  const calculated =
    (Math.abs(xpDifference) /
      XP_PER_SECOND) *
    1000;

  return Math.max(
    MIN_FILL_DURATION,
    Math.min(
      calculated,
      MAX_FILL_DURATION
    )
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function AnimatedXPBar({
  xpBefore,
  xpAfter,
  unlockedAchievements = [],
  onLevelUp,
  onComplete,
}: AnimatedXPBarProps) {
  const { theme } = useTheme();

  // ==========================================================
  // STABLE PROP REFS
  //
  // Achievement arrays and callbacks can get new JavaScript
  // references when the parent re-renders.
  //
  // They must NOT restart the XP animation.
  // ==========================================================

  const achievementsRef =
    useRef<Achievement[]>(
      unlockedAchievements
    );

  const onLevelUpRef =
    useRef(onLevelUp);

  const onCompleteRef =
    useRef(onComplete);

  achievementsRef.current =
    unlockedAchievements;

  onLevelUpRef.current =
    onLevelUp;

  onCompleteRef.current =
    onComplete;

  // ==========================================================
  // SAFE XP VALUES
  // ==========================================================

  const safeBefore =
    Math.max(
      0,
      xpBefore
    );

  const safeAfter =
    Math.max(
      safeBefore,
      xpAfter
    );

  const initialProgression =
    getProgression(
      safeBefore
    );

  // ==========================================================
  // XP VISUAL STATE
  // ==========================================================

  const progress =
    useRef(
      new Animated.Value(
        initialProgression.progress
      )
    ).current;

  const [
    displayLevel,
    setDisplayLevel,
  ] = useState(
    initialProgression.level
  );

  const [
    displayXP,
    setDisplayXP,
  ] = useState(
    initialProgression.xpInLevel
  );

  // ==========================================================
  // LEVEL-UP STATE
  // ==========================================================

  const [
    isCelebratingLevel,
    setIsCelebratingLevel,
  ] = useState(false);

  const [
    celebrationLevel,
    setCelebrationLevel,
  ] = useState(
    initialProgression.level
  );

  // ==========================================================
  // ACHIEVEMENT STATE
  // ==========================================================

  const [
    isCelebratingAchievement,
    setIsCelebratingAchievement,
  ] = useState(false);

  const [
    currentAchievement,
    setCurrentAchievement,
  ] =
    useState<Achievement | null>(
      null
    );

  // ==========================================================
  // LEVEL-UP ANIMATION VALUES
  // ==========================================================

  const levelScale =
    useRef(
      new Animated.Value(0.6)
    ).current;

  const levelOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  // ==========================================================
  // ACHIEVEMENT ANIMATION VALUES
  // ==========================================================

  const achievementScale =
    useRef(
      new Animated.Value(0.7)
    ).current;

  const achievementOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  // ==========================================================
  // MAIN XP ANIMATION
  //
  // IMPORTANT:
  //
  // This effect is intentionally controlled ONLY by the XP
  // transaction.
  //
  // Achievement arrays and callbacks are read through refs.
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    const starting =
      getProgression(
        safeBefore
      );

    // --------------------------------------------------------
    // HARD RESET TO THE TRUE STARTING STATE
    // --------------------------------------------------------

    progress.stopAnimation();

    levelScale.stopAnimation();

    levelOpacity.stopAnimation();

    achievementScale.stopAnimation();

    achievementOpacity.stopAnimation();

    progress.setValue(
      starting.progress
    );

    setDisplayLevel(
      starting.level
    );

    setDisplayXP(
      starting.xpInLevel
    );

    setCelebrationLevel(
      starting.level
    );

    setIsCelebratingLevel(
      false
    );

    setIsCelebratingAchievement(
      false
    );

    setCurrentAchievement(
      null
    );

    levelScale.setValue(
      0.6
    );

    levelOpacity.setValue(
      0
    );

    achievementScale.setValue(
      0.7
    );

    achievementOpacity.setValue(
      0
    );

    // --------------------------------------------------------
    // ANIMATE ONE XP SEGMENT
    // --------------------------------------------------------

    function animateSegment(
      fromXP: number,
      toXP: number,
      fromProgress: number,
      toProgress: number
    ) {
      return new Promise<void>(
        (resolve) => {
          if (cancelled) {
            resolve();
            return;
          }

          progress.setValue(
            fromProgress
          );

          setDisplayXP(
            fromXP
          );

          const animatedXP =
            new Animated.Value(
              fromXP
            );

          const listener =
            animatedXP.addListener(
              ({ value }) => {
                if (
                  !cancelled
                ) {
                  setDisplayXP(
                    Math.round(
                      value
                    )
                  );
                }
              }
            );

          const duration =
            getAnimationDuration(
              toXP -
                fromXP
            );

          Animated.parallel([
            Animated.timing(
              progress,
              {
                toValue:
                  toProgress,

                duration,

                easing:
                  Easing.out(
                    Easing.cubic
                  ),

                useNativeDriver:
                  false,
              }
            ),

            Animated.timing(
              animatedXP,
              {
                toValue:
                  toXP,

                duration,

                easing:
                  Easing.out(
                    Easing.cubic
                  ),

                useNativeDriver:
                  false,
              }
            ),
          ]).start(
            ({
              finished,
            }) => {
              animatedXP.removeListener(
                listener
              );

              if (
                finished &&
                !cancelled
              ) {
                setDisplayXP(
                  toXP
                );
              }

              resolve();
            }
          );
        }
      );
    }

    // --------------------------------------------------------
    // LEVEL-UP CELEBRATION
    // --------------------------------------------------------

    async function celebrateLevel(
      newLevel: number
    ) {
      if (cancelled) {
        return;
      }

      setCelebrationLevel(
        newLevel
      );

      setIsCelebratingLevel(
        true
      );

      levelScale.setValue(
        0.6
      );

      levelOpacity.setValue(
        0
      );

      onLevelUpRef.current?.(
        newLevel
      );

      await new Promise<void>(
        (resolve) => {
          Animated.parallel([
            Animated.spring(
              levelScale,
              {
                toValue: 1,

                friction: 4,
                tension: 110,

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              levelOpacity,
              {
                toValue: 1,

                duration: 220,

                useNativeDriver:
                  true,
              }
            ),
          ]).start(() => {
            resolve();
          });
        }
      );

      if (cancelled) {
        return;
      }

      await wait(
        LEVEL_CELEBRATION_HOLD
      );

      if (cancelled) {
        return;
      }

      await new Promise<void>(
        (resolve) => {
          Animated.timing(
            levelOpacity,
            {
              toValue: 0,

              duration: 250,

              useNativeDriver:
                true,
            }
          ).start(() => {
            resolve();
          });
        }
      );

      if (cancelled) {
        return;
      }

      setIsCelebratingLevel(
        false
      );
    }

    // --------------------------------------------------------
    // ONE ACHIEVEMENT CELEBRATION
    // --------------------------------------------------------

    async function celebrateAchievement(
      achievement: Achievement
    ) {
      if (cancelled) {
        return;
      }

      setCurrentAchievement(
        achievement
      );

      setIsCelebratingAchievement(
        true
      );

      achievementScale.setValue(
        0.7
      );

      achievementOpacity.setValue(
        0
      );

      await new Promise<void>(
        (resolve) => {
          Animated.parallel([
            Animated.spring(
              achievementScale,
              {
                toValue: 1,

                friction: 5,
                tension: 100,

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              achievementOpacity,
              {
                toValue: 1,

                duration: 250,

                useNativeDriver:
                  true,
              }
            ),
          ]).start(() => {
            resolve();
          });
        }
      );

      if (cancelled) {
        return;
      }

      await wait(
        ACHIEVEMENT_HOLD
      );

      if (cancelled) {
        return;
      }

      await new Promise<void>(
        (resolve) => {
          Animated.timing(
            achievementOpacity,
            {
              toValue: 0,

              duration: 280,

              useNativeDriver:
                true,
            }
          ).start(() => {
            resolve();
          });
        }
      );

      if (cancelled) {
        return;
      }

      setIsCelebratingAchievement(
        false
      );

      setCurrentAchievement(
        null
      );
    }

    // --------------------------------------------------------
    // ACHIEVEMENT QUEUE
    // --------------------------------------------------------

    async function celebrateAchievements() {
      // Take one snapshot for this reward sequence.
      //
      // Even if the parent re-renders later, the current queue
      // remains stable.

      const queue = [
        ...achievementsRef.current,
      ];

      if (
        cancelled ||
        queue.length === 0
      ) {
        return;
      }

      await wait(
        ACHIEVEMENT_DELAY
      );

      if (cancelled) {
        return;
      }

      for (
        let index = 0;
        index < queue.length;
        index++
      ) {
        if (cancelled) {
          return;
        }

        await celebrateAchievement(
          queue[index]
        );

        if (cancelled) {
          return;
        }

        const hasAnother =
          index <
          queue.length - 1;

        if (hasAnother) {
          await wait(
            BETWEEN_ACHIEVEMENTS_DELAY
          );
        }
      }
    }

    // --------------------------------------------------------
    // COMPLETE REWARD SEQUENCE
    // --------------------------------------------------------

    async function run() {
      // ======================================================
      // WAIT BEFORE FILLING
      //
      // During this period the bar remains EXACTLY at the
      // previous XP value.
      // ======================================================

      await wait(
        START_DELAY
      );

      if (cancelled) {
        return;
      }

      let currentAbsoluteXP =
        safeBefore;

      // ======================================================
      // LEVEL BOUNDARIES
      // ======================================================

      while (!cancelled) {
        const current =
          getProgression(
            currentAbsoluteXP
          );

        const nextLevelBoundary =
          current.level *
          XP_PER_LEVEL;

        // No level boundary is crossed.
        if (
          safeAfter <
          nextLevelBoundary
        ) {
          break;
        }

        // ----------------------------------------------------
        // FILL CURRENT LEVEL TO 500 / 500
        // ----------------------------------------------------

        await animateSegment(
          current.xpInLevel,
          XP_PER_LEVEL,
          current.progress,
          1
        );

        if (cancelled) {
          return;
        }

        // ----------------------------------------------------
        // HOLD FULL BAR
        // ----------------------------------------------------

        await wait(
          FULL_BAR_HOLD
        );

        if (cancelled) {
          return;
        }

        // ----------------------------------------------------
        // CELEBRATE LEVEL UP
        // ----------------------------------------------------

        await celebrateLevel(
          current.level + 1
        );

        if (cancelled) {
          return;
        }

        // ----------------------------------------------------
        // MOVE ABSOLUTE XP TO EXACT LEVEL BOUNDARY
        // ----------------------------------------------------

        currentAbsoluteXP =
          nextLevelBoundary;

        // ----------------------------------------------------
        // RESET TO NEW LEVEL
        // ----------------------------------------------------

        setDisplayLevel(
          current.level + 1
        );

        setDisplayXP(0);

        progress.setValue(0);

        await wait(
          RESET_DELAY
        );

        if (cancelled) {
          return;
        }

        // If xpAfter is exactly 500, 1000, 1500, etc.,
        // we stop here.
        //
        // Example:
        //
        // 0 -> 500
        //
        // final visual state:
        //
        // Level 2
        // 0 / 500

        if (
          currentAbsoluteXP >=
          safeAfter
        ) {
          break;
        }
      }

      if (cancelled) {
        return;
      }

      // ======================================================
      // LEFTOVER XP IN THE FINAL LEVEL
      //
      // Example:
      //
      // 450 -> 570
      //
      // 450 -> 500
      // LEVEL UP
      // 0 -> 70
      // ======================================================

      if (
        currentAbsoluteXP <
        safeAfter
      ) {
        const current =
          getProgression(
            currentAbsoluteXP
          );

        const final =
          getProgression(
            safeAfter
          );

        setDisplayLevel(
          current.level
        );

        await animateSegment(
          current.xpInLevel,
          final.xpInLevel,
          current.progress,
          final.progress
        );

        if (cancelled) {
          return;
        }

        setDisplayLevel(
          final.level
        );

        setDisplayXP(
          final.xpInLevel
        );
      }

      if (cancelled) {
        return;
      }

      // ======================================================
      // ACHIEVEMENTS
      // ======================================================

      await celebrateAchievements();

      if (cancelled) {
        return;
      }

      // ======================================================
      // FINISH
      // ======================================================

      await wait(
        FINAL_DELAY
      );

      if (!cancelled) {
        onCompleteRef.current?.();
      }
    }

    run();

    // --------------------------------------------------------
    // CLEANUP
    // --------------------------------------------------------

    return () => {
      cancelled = true;

      progress.stopAnimation();

      levelScale.stopAnimation();

      levelOpacity.stopAnimation();

      achievementScale.stopAnimation();

      achievementOpacity.stopAnimation();
    };

    // IMPORTANT:
    //
    // We intentionally do NOT put:
    //
    // unlockedAchievements
    // onLevelUp
    // onComplete
    //
    // in this dependency array.
    //
    // Those values are accessed through refs so they cannot
    // restart the XP reward animation.
  }, [
    safeBefore,
    safeAfter,
    progress,
    levelScale,
    levelOpacity,
    achievementScale,
    achievementOpacity,
  ]);

  // ==========================================================
  // ANIMATED WIDTH
  // ==========================================================

  const animatedWidth =
    progress.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        "0%",
        "100%",
      ],
    });

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <View
      style={styles.container}
    >
      {/* ======================================================
          LEVEL + XP
          ====================================================== */}

      <View
        style={styles.header}
      >
        <AppText
          variant="caption"
        >
          Level {displayLevel}
        </AppText>

        <AppText
          variant="xp"
          style={styles.xpText}
        >
          {displayXP} /{" "}
          {XP_PER_LEVEL}
        </AppText>
      </View>

      {/* ======================================================
          XP BAR
          ====================================================== */}

      <View
        style={[
          styles.track,
          {
            backgroundColor:
              theme.colors.cardAlt,

            borderColor:
              theme.colors.border,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width:
                animatedWidth,

              backgroundColor:
                theme.colors.xp,
            },
          ]}
        />
      </View>

      {/* ======================================================
          LEVEL-UP CELEBRATION
          ====================================================== */}

      {isCelebratingLevel && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.celebration,
            {
              opacity:
                levelOpacity,

              transform: [
                {
                  scale:
                    levelScale,
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.celebrationBox,
              {
                backgroundColor:
                  theme.colors.card,

                borderColor:
                  theme.colors.xp,
              },
            ]}
          >
            <View
              style={
                styles.sparkleRow
              }
            >
              <AppText
                style={
                  styles.sparkle
                }
              >
                ✦
              </AppText>

              <AppText
                style={
                  styles.partyIcon
                }
              >
                🎉
              </AppText>

              <AppText
                style={
                  styles.sparkle
                }
              >
                ✦
              </AppText>
            </View>

            <AppText
              style={[
                styles.levelUpText,
                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              LEVEL UP!
            </AppText>

            <AppText
              variant="title"
              style={
                styles.newLevelText
              }
            >
              LV.{" "}
              {celebrationLevel}
            </AppText>
          </View>
        </Animated.View>
      )}

      {/* ======================================================
          ACHIEVEMENT CELEBRATION
          ====================================================== */}

      {isCelebratingAchievement &&
        currentAchievement && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.celebration,
              {
                opacity:
                  achievementOpacity,

                transform: [
                  {
                    scale:
                      achievementScale,
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.achievementBox,
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
                  styles.achievementIcon
                }
              >
                {
                  currentAchievement.icon
                }
              </AppText>

              <AppText
                style={[
                  styles.achievementUnlocked,
                  {
                    color:
                      theme.colors.xp,
                  },
                ]}
              >
                ACHIEVEMENT UNLOCKED
              </AppText>

              <AppText
                variant="title"
                style={
                  styles.achievementTitle
                }
              >
                {
                  currentAchievement.title
                }
              </AppText>

              <AppText
                variant="secondary"
                style={
                  styles.achievementDescription
                }
              >
                {
                  currentAchievement.description
                }
              </AppText>
            </View>
          </Animated.View>
        )}
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      position: "relative",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 7,
    },

    xpText: {
      fontWeight: "800",
    },

    // --------------------------------------------------------
    // XP BAR
    // --------------------------------------------------------

    track: {
      width: "100%",
      height: 11,
      borderRadius: 6,
      borderWidth: 1,
      overflow: "hidden",
    },

    fill: {
      height: "100%",
      borderRadius: 5,
    },

    // --------------------------------------------------------
    // SHARED CELEBRATION POSITION
    // --------------------------------------------------------

    celebration: {
      position: "absolute",

      left: 0,
      right: 0,

      top: -125,

      zIndex: 100,

      alignItems: "center",
      justifyContent:
        "center",
    },

    // --------------------------------------------------------
    // LEVEL UP
    // --------------------------------------------------------

    celebrationBox: {
      minWidth: 190,

      borderWidth: 1,
      borderRadius: 14,

      paddingHorizontal: 24,
      paddingVertical: 13,

      alignItems: "center",
    },

    sparkleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },

    sparkle: {
      fontSize: 18,
    },

    partyIcon: {
      fontSize: 27,
    },

    levelUpText: {
      fontSize: 17,
      lineHeight: 21,
      fontWeight: "900",
      letterSpacing: 2,
      marginTop: 3,
    },

    newLevelText: {
      fontSize: 16,
      marginTop: 2,
    },

    // --------------------------------------------------------
    // ACHIEVEMENT
    // --------------------------------------------------------

    achievementBox: {
      width: "92%",
      maxWidth: 320,

      borderWidth: 1,
      borderRadius: 14,

      paddingHorizontal: 18,
      paddingVertical: 14,

      alignItems: "center",
    },

    achievementIcon: {
      fontSize: 30,
      marginBottom: 3,
    },

    achievementUnlocked: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    achievementTitle: {
      fontSize: 18,
      lineHeight: 22,
      marginTop: 3,
      textAlign: "center",
    },

    achievementDescription: {
      fontSize: 11,
      lineHeight: 15,
      marginTop: 3,
      textAlign: "center",
    },
  });