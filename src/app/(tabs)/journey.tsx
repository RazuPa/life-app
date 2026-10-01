import { useCallback, useRef } from "react";

import {
  Alert,
  Animated,
  StyleSheet,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

// ============================================================
// JOURNEY SCREEN
// ============================================================

export default function JourneyScreen() {
  const {
    activities,
    totalXP,
    deleteActivity,
  } = useApp();

  const {
    theme,
    themeName,
  } = useTheme();

  // ==========================================================
  // THEME
  // ==========================================================

  const isNature =
    themeName === "nature";

  const isDungeon =
    themeName === "dungeon";

  const isFuture =
    themeName === "future";

  // ==========================================================
  // SCREEN ANIMATION VALUES
  // ==========================================================

  const screenOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const screenTranslateY =
    useRef(
      new Animated.Value(18)
    ).current;

  const screenScale =
    useRef(
      new Animated.Value(
        isFuture ? 0.975 : 1
      )
    ).current;

  // ==========================================================
  // HEADER ANIMATION
  // ==========================================================

  const headerOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const headerTranslateY =
    useRef(
      new Animated.Value(10)
    ).current;

  // ==========================================================
  // XP CARD ANIMATION
  // ==========================================================

  const xpOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const xpTranslateY =
    useRef(
      new Animated.Value(14)
    ).current;

  const xpScale =
    useRef(
      new Animated.Value(0.96)
    ).current;

  // ==========================================================
  // LIST ANIMATION
  // ==========================================================

  const listOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const listTranslateY =
    useRef(
      new Animated.Value(18)
    ).current;

  // ==========================================================
  // ENTRANCE ANIMATION
  //
  // Runs again whenever Journey receives focus.
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      // ------------------------------------------------------
      // RESET
      // ------------------------------------------------------

      screenOpacity.setValue(0);

      screenTranslateY.setValue(
        isDungeon
          ? 10
          : 18
      );

      screenScale.setValue(
        isFuture
          ? 0.975
          : 1
      );

      headerOpacity.setValue(0);
      headerTranslateY.setValue(10);

      xpOpacity.setValue(0);
      xpTranslateY.setValue(14);
      xpScale.setValue(0.96);

      listOpacity.setValue(0);
      listTranslateY.setValue(18);

      // ------------------------------------------------------
      // SCREEN
      // ------------------------------------------------------

      const screenAnimation =
        Animated.parallel([
          Animated.timing(
            screenOpacity,
            {
              toValue: 1,

              duration:
                isDungeon
                  ? 120
                  : 190,

              useNativeDriver: true,
            }
          ),

          Animated.spring(
            screenTranslateY,
            {
              toValue: 0,

              speed:
                isDungeon
                  ? 34
                  : 20,

              bounciness:
                isDungeon
                  ? 0
                  : 5,

              useNativeDriver: true,
            }
          ),

          Animated.spring(
            screenScale,
            {
              toValue: 1,

              speed:
                isFuture
                  ? 20
                  : 25,

              bounciness:
                isFuture
                  ? 3
                  : 0,

              useNativeDriver: true,
            }
          ),
        ]);

      // ------------------------------------------------------
      // HEADER
      // ------------------------------------------------------

      const headerAnimation =
        Animated.parallel([
          Animated.timing(
            headerOpacity,
            {
              toValue: 1,
              duration: 170,
              useNativeDriver: true,
            }
          ),

          Animated.spring(
            headerTranslateY,
            {
              toValue: 0,
              speed: 24,
              bounciness:
                isDungeon
                  ? 0
                  : 4,
              useNativeDriver: true,
            }
          ),
        ]);

      // ------------------------------------------------------
      // XP CARD
      // ------------------------------------------------------

      const xpAnimation =
        Animated.parallel([
          Animated.timing(
            xpOpacity,
            {
              toValue: 1,
              duration: 170,
              useNativeDriver: true,
            }
          ),

          Animated.spring(
            xpTranslateY,
            {
              toValue: 0,
              speed: 22,
              bounciness:
                isDungeon
                  ? 0
                  : 5,
              useNativeDriver: true,
            }
          ),

          Animated.spring(
            xpScale,
            {
              toValue: 1,
              speed: 20,
              bounciness:
                isDungeon
                  ? 0
                  : 6,
              useNativeDriver: true,
            }
          ),
        ]);

      // ------------------------------------------------------
      // ACTIVITY LIST
      // ------------------------------------------------------

      const listAnimation =
        Animated.parallel([
          Animated.timing(
            listOpacity,
            {
              toValue: 1,
              duration: 180,
              useNativeDriver: true,
            }
          ),

          Animated.spring(
            listTranslateY,
            {
              toValue: 0,
              speed: 20,
              bounciness:
                isDungeon
                  ? 0
                  : 5,
              useNativeDriver: true,
            }
          ),
        ]);

      // ------------------------------------------------------
      // PLAY
      // ------------------------------------------------------

      Animated.sequence([
        screenAnimation,

        Animated.stagger(
          isDungeon
            ? 35
            : 55,
          [
            headerAnimation,
            xpAnimation,
            listAnimation,
          ]
        ),
      ]).start();

      // ------------------------------------------------------
      // CLEANUP
      // ------------------------------------------------------

      return () => {
        screenOpacity.stopAnimation();
        screenTranslateY.stopAnimation();
        screenScale.stopAnimation();

        headerOpacity.stopAnimation();
        headerTranslateY.stopAnimation();

        xpOpacity.stopAnimation();
        xpTranslateY.stopAnimation();
        xpScale.stopAnimation();

        listOpacity.stopAnimation();
        listTranslateY.stopAnimation();
      };
    }, [
      headerOpacity,
      headerTranslateY,
      isDungeon,
      isFuture,
      listOpacity,
      listTranslateY,
      screenOpacity,
      screenScale,
      screenTranslateY,
      xpOpacity,
      xpScale,
      xpTranslateY,
    ])
  );

  // ==========================================================
  // DELETE ACTIVITY
  // ==========================================================

  function remove(id: number) {
    Alert.alert(
      "Delete activity?",
      "Its XP will also be removed.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: () =>
            deleteActivity(id),
        },
      ]
    );
  }

  // ==========================================================
  // THEME VALUES
  // ==========================================================

  const journeyTitle =
    isDungeon
      ? "JOURNEY"
      : isFuture
        ? "JOURNEY LOG"
        : "Journey";

  const journeySubtitle =
    isDungeon
      ? "The chronicle of your adventures."
      : isFuture
        ? "Permanent activity archive."
        : "Your permanent real-life history.";

  const xpLabel =
    isDungeon
      ? "TOTAL EXPERIENCE"
      : isFuture
        ? "LIFETIME XP // TOTAL"
        : "LIFETIME XP";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <AppScreen>
      <Animated.View
        style={[
          styles.screen,

          {
            opacity:
              screenOpacity,

            transform: [
              {
                translateY:
                  screenTranslateY,
              },

              {
                scale:
                  screenScale,
              },
            ],
          },
        ]}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <Animated.View
          style={{
            opacity:
              headerOpacity,

            transform: [
              {
                translateY:
                  headerTranslateY,
              },
            ],
          }}
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
            {journeyTitle}
          </AppText>

          <AppText
            variant="secondary"
          >
            {journeySubtitle}
          </AppText>
        </Animated.View>

        {/* ====================================================
            LIFETIME XP
        ==================================================== */}

        <Animated.View
          style={{
            opacity:
              xpOpacity,

            transform: [
              {
                translateY:
                  xpTranslateY,
              },

              {
                scale:
                  xpScale,
              },
            ],
          }}
        >
          <AppCard
            variant="alt"
            style={[
              styles.total,

              isDungeon &&
                styles.dungeonTotal,

              isFuture &&
                styles.futureTotal,
            ]}
          >
            <View
              style={
                styles.totalHeader
              }
            >
              <AppText
                variant="label"
              >
                {xpLabel}
              </AppText>

              <AppText
                style={[
                  styles.totalSymbol,

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
                    : "✦"}
              </AppText>
            </View>

            <AppText
              variant="pageTitle"
              style={[
                styles.totalXP,

                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              {totalXP}
            </AppText>

            <AppText
              variant="caption"
            >
              {activities.length}{" "}
              {activities.length === 1
                ? "activity"
                : "activities"}{" "}
              recorded
            </AppText>
          </AppCard>
        </Animated.View>

        {/* ====================================================
            ACTIVITY HISTORY
        ==================================================== */}

        <Animated.View
          style={[
            styles.list,

            {
              opacity:
                listOpacity,

              transform: [
                {
                  translateY:
                    listTranslateY,
                },
              ],
            },
          ]}
        >
          {activities.map(
            (activity) => (
              <AppCard
                key={
                  activity.id
                }
                onPress={() =>
                  remove(
                    activity.id
                  )
                }
                style={[
                  styles.item,

                  isDungeon &&
                    styles.dungeonItem,

                  isFuture &&
                    styles.futureItem,
                ]}
              >
                {/* ICON */}

                <View
                  style={[
                    styles.iconContainer,

                    {
                      backgroundColor:
                        theme.colors
                          .cardAlt,

                      borderColor:
                        theme.colors
                          .border,
                    },

                    isDungeon &&
                      styles.dungeonIcon,

                    isFuture &&
                      styles.futureIcon,
                  ]}
                >
                  <AppText
                    style={
                      styles.icon
                    }
                  >
                    {
                      activity.icon
                    }
                  </AppText>
                </View>

                {/* CONTENT */}

                <View
                  style={
                    styles.flex
                  }
                >
                  <AppText
                    variant="title"
                    style={
                      styles.title
                    }
                  >
                    {
                      activity.title
                    }
                  </AppText>

                  <AppText
                    variant="secondary"
                  >
                    {
                      activity.details
                    }
                  </AppText>

                  {!!activity.note && (
                    <AppText
                      variant="caption"
                      style={
                        styles.note
                      }
                    >
                      “
                      {
                        activity.note
                      }
                      ”
                    </AppText>
                  )}

                  <AppText
                    variant="caption"
                    style={
                      styles.date
                    }
                  >
                    {activity.createdAt.toLocaleDateString()}
                    {" • "}
                    {activity.createdAt.toLocaleTimeString(
                      [],
                      {
                        hour:
                          "2-digit",

                        minute:
                          "2-digit",
                      }
                    )}
                  </AppText>
                </View>

                {/* XP */}

                <View
                  style={
                    styles.xpContainer
                  }
                >
                  <AppText
                    variant="xp"
                    numberOfLines={1}
                  >
                    +
                    {
                      activity.xp
                    }
                  </AppText>

                  <AppText
                    variant="caption"
                    style={
                      styles.xpText
                    }
                  >
                    XP
                  </AppText>
                </View>
              </AppCard>
            )
          )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {activities.length ===
            0 && (
            <AppCard
              style={[
                styles.emptyCard,

                isDungeon &&
                  styles.dungeonItem,

                isFuture &&
                  styles.futureItem,
              ]}
            >
              <AppText
                style={[
                  styles.emptyIcon,

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
                    : "✦"}
              </AppText>

              <View
                style={
                  styles.flex
                }
              >
                <AppText
                  variant="title"
                >
                  Your journey begins here
                </AppText>

                <AppText
                  variant="secondary"
                >
                  Log your first activity to start building your history.
                </AppText>
              </View>
            </AppCard>
          )}
        </Animated.View>

        {/* ====================================================
            HINT
        ==================================================== */}

        {activities.length >
          0 && (
          <Animated.View
            style={{
              opacity:
                listOpacity,
            }}
          >
            <AppText
              variant="caption"
              style={[
                styles.hint,

                {
                  color:
                    theme.colors.muted,
                },
              ]}
            >
              Tap an activity to delete it.
            </AppText>
          </Animated.View>
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
    screen: {
      width: "100%",
    },

    // ========================================================
    // HEADER
    // ========================================================

    dungeonTitle: {
      fontFamily: "Menlo",
      letterSpacing: 1.4,
    },

    futureTitle: {
      letterSpacing: 1,
    },

    // ========================================================
    // TOTAL XP
    // ========================================================

    total: {
      marginTop: 22,
    },

    totalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    totalSymbol: {
      fontSize: 17,
      fontWeight: "900",
    },

    totalXP: {
      marginTop: 5,
      marginBottom: 2,
    },

    dungeonTotal: {
      borderRadius: 3,
      borderWidth: 2,
    },

    futureTotal: {
      borderRadius: 8,
      borderWidth: 1,
    },

    // ========================================================
    // LIST
    // ========================================================

    list: {
      marginTop: 24,
      gap: 10,
    },

    item: {
      flexDirection: "row",
      alignItems:
        "flex-start",
    },

    dungeonItem: {
      borderRadius: 3,
      borderWidth: 2,
    },

    futureItem: {
      borderRadius: 8,
    },

    // ========================================================
    // ICON
    // ========================================================

    iconContainer: {
      width: 43,
      height: 43,

      marginRight: 12,

      borderWidth: 1,
      borderRadius: 12,

      alignItems: "center",
      justifyContent:
        "center",
    },

    dungeonIcon: {
      borderRadius: 2,
    },

    futureIcon: {
      borderRadius: 7,
    },

    icon: {
      fontSize: 24,
    },

    // ========================================================
    // CONTENT
    // ========================================================

    flex: {
      flex: 1,
      minWidth: 0,
    },

    title: {
      fontSize: 16,
    },

    note: {
      marginTop: 6,
      marginBottom: 3,
    },

    date: {
      marginTop: 4,
    },

    // ========================================================
    // XP
    // ========================================================

    xpContainer: {
      marginLeft: 10,

      alignItems:
        "flex-end",

      flexShrink: 0,
    },

    xpText: {
      fontSize: 8,
      marginTop: 1,
    },

    // ========================================================
    // EMPTY
    // ========================================================

    emptyCard: {
      flexDirection: "row",
      alignItems: "center",
    },

    emptyIcon: {
      fontSize: 23,
      marginRight: 13,
    },

    // ========================================================
    // HINT
    // ========================================================

    hint: {
      textAlign: "center",
      marginTop: 20,
    },
  });