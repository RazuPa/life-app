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
  StyleSheet,
  View,
} from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";

import {
  useTheme,
} from "../../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type ActivityOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
};

// ============================================================
// QUICK ACTIVITIES
// ============================================================

const activities: ActivityOption[] = [
  {
    id: "running",
    title: "Running",
    description: "Distance & time",
    icon: "🏃",
    route: "/activity?type=running",
  },

  {
    id: "walking",
    title: "Walking",
    description: "Distance & time",
    icon: "🚶",
    route: "/activity?type=walking",
  },

  {
    id: "reading",
    title: "Reading",
    description: "Pages & time",
    icon: "📚",
    route: "/activity?type=reading",
  },

  {
    id: "gym",
    title: "Gym",
    description: "Sessions & time",
    icon: "🏋️",
    route: "/activity?type=gym",
  },

  {
    id: "coding",
    title: "Coding",
    description: "Time",
    icon: "💻",
    route: "/activity?type=coding",
  },

  {
    id: "studying",
    title: "Studying",
    description: "Time",
    icon: "🧠",
    route: "/activity?type=studying",
  },
];

// ============================================================
// SCREEN
// ============================================================

export default function AddScreen() {
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
  // ANIMATION VALUES
  // ==========================================================

  const headerAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const infoAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const sectionAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const cardAnimations =
    useRef(
      Array.from(
        {
          length:
            activities.length + 1,
        },
        () =>
          new Animated.Value(0)
      )
    ).current;

  const examplesAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // ==========================================================
  // ANIMATION STYLE
  // ==========================================================

  const entranceDistance =
    isDungeon
      ? 9
      : isFuture
        ? 18
        : 14;

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
                  ? [0.995, 1]
                  : isFuture
                    ? [0.97, 1]
                    : [0.985, 1],
            }),
        },
      ],
    };
  }

  // ==========================================================
  // RUN ANIMATION WHEN SCREEN RECEIVES FOCUS
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      const allValues = [
        headerAnim,
        infoAnim,
        sectionAnim,
        ...cardAnimations,
        examplesAnim,
      ];

      allValues.forEach(
        (value) => {
          value.stopAnimation();
          value.setValue(0);
        }
      );

      const duration =
        isDungeon
          ? 150
          : isFuture
            ? 220
            : 260;

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
          createAnimation(
            headerAnim
          ),

          Animated.stagger(
            isDungeon
              ? 30
              : 45,
            [
              createAnimation(
                infoAnim
              ),

              createAnimation(
                sectionAnim
              ),
            ]
          ),

          Animated.stagger(
            isDungeon
              ? 28
              : isFuture
                ? 45
                : 55,

            cardAnimations.map(
              createAnimation
            )
          ),

          createAnimation(
            examplesAnim
          ),
        ]);

      animation.start();

      return () => {
        animation.stop();
      };
    }, [
      headerAnim,
      infoAnim,
      sectionAnim,
      cardAnimations,
      examplesAnim,
      isDungeon,
      isFuture,
    ])
  );

  // ==========================================================
  // THEME TEXT
  // ==========================================================

  const pageTitle =
    isDungeon
      ? "ADD ACTIVITY"
      : isFuture
        ? "ACTIVITY INPUT"
        : "Add Activity";

  const pageSubtitle =
    isDungeon
      ? "What did you accomplish?"
      : isFuture
        ? "Select activity protocol."
        : "What did you do?";

  const infoTitle =
    isDungeon
      ? "Every action matters"
      : isFuture
        ? "ACTIVITY DATA ACCEPTED"
        : "Everything counts";

  const infoDescription =
    isDungeon
      ? "Train your real-life skills and earn experience."
      : isFuture
        ? "Convert real-world activity data into XP."
        : "Track real-life progress and turn it into XP.";

  const sectionTitle =
    isDungeon
      ? "QUICK ACTIONS"
      : isFuture
        ? "ACTIVITY MODULES"
        : "QUICK ACTIVITIES";

  const sectionSubtitle =
    isDungeon
      ? "Choose your next action"
      : isFuture
        ? "Select active tracking module"
        : "Choose something you do often";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <AppScreen>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Animated.View
        style={[
          styles.header,

          entranceStyle(
            headerAnim
          ),
        ]}
      >
        <View style={styles.flex}>
          <AppText
            variant="pageTitle"
            style={[
              isDungeon &&
                styles.dungeonTitle,

              isFuture &&
                styles.futureTitle,
            ]}
          >
            {pageTitle}
          </AppText>

          <AppText variant="secondary">
            {pageSubtitle}
          </AppText>
        </View>

        <AppCard
          variant="alt"
          padding={0}
          style={[
            styles.headerIcon,

            isDungeon &&
              styles.dungeonHeaderIcon,

            isFuture &&
              styles.futureHeaderIcon,
          ]}
        >
          <AppText
            style={[
              styles.headerEmoji,

              isFuture && {
                color:
                  theme.colors.primary,
              },
            ]}
          >
            {isDungeon
              ? "⚔️"
              : isFuture
                ? "◈"
                : "⚡"}
          </AppText>
        </AppCard>
      </Animated.View>

      {/* ======================================================
          INFO
      ====================================================== */}

      <Animated.View
        style={entranceStyle(
          infoAnim
        )}
      >
        <AppCard
          variant="alt"
          style={[
            styles.info,

            isDungeon &&
              styles.dungeonCard,

            isFuture &&
              styles.futureCard,
          ]}
        >
          <AppText
            style={[
              styles.infoEmoji,

              isFuture && {
                color:
                  theme.colors.primary,
              },
            ]}
          >
            {isDungeon
              ? "◆"
              : isFuture
                ? "◈"
                : "✨"}
          </AppText>

          <View style={styles.flex}>
            <AppText
              variant="title"
              style={
                styles.infoTitle
              }
            >
              {infoTitle}
            </AppText>

            <AppText
              variant="secondary"
            >
              {infoDescription}
            </AppText>
          </View>
        </AppCard>
      </Animated.View>

      {/* ======================================================
          QUICK ACTIVITIES HEADER
      ====================================================== */}

      <Animated.View
        style={[
          styles.sectionHeader,

          entranceStyle(
            sectionAnim
          ),
        ]}
      >
        <View>
          <AppText
            variant="label"
            style={[
              isFuture && {
                color:
                  theme.colors.primary,

                letterSpacing: 1.2,
              },
            ]}
          >
            {sectionTitle}
          </AppText>

          <AppText
            variant="caption"
            style={
              styles.sectionSubtitle
            }
          >
            {sectionSubtitle}
          </AppText>
        </View>
      </Animated.View>

      {/* ======================================================
          ACTIVITY GRID
      ====================================================== */}

      <View style={styles.grid}>
        {activities.map(
          (
            activity,
            index
          ) => (
            <Animated.View
              key={
                activity.id
              }
              style={[
                styles.activityWrapper,

                entranceStyle(
                  cardAnimations[
                    index
                  ]
                ),
              ]}
            >
              <AppCard
                onPress={() =>
                  router.push(
                    activity.route as never
                  )
                }
                style={[
                  styles.activity,

                  {
                    borderColor:
                      isFuture
                        ? theme.colors
                            .primary
                        : theme.colors
                            .primary,
                  },

                  isDungeon &&
                    styles.dungeonActivity,

                  isFuture &&
                    styles.futureActivity,
                ]}
              >
                <View
                  style={[
                    styles.iconBox,

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
                      styles.icon
                    }
                  >
                    {
                      activity.icon
                    }
                  </AppText>
                </View>

                <AppText
                  variant="title"
                  style={
                    styles.activityTitle
                  }
                >
                  {activity.title}
                </AppText>

                <AppText
                  variant="caption"
                >
                  {
                    activity.description
                  }
                </AppText>

                <View
                  style={[
                    styles.badge,

                    {
                      backgroundColor:
                        theme.colors
                          .cardAlt,

                      borderColor:
                        isFuture
                          ? theme.colors
                              .primary
                          : "transparent",
                    },

                    isFuture &&
                      styles.futureBadge,
                  ]}
                >
                  <AppText
                    style={[
                      styles.badgeText,

                      {
                        color:
                          theme.colors
                            .primary,
                      },
                    ]}
                  >
                    {isDungeon
                      ? "READY"
                      : isFuture
                        ? "ONLINE"
                        : "READY"}
                  </AppText>
                </View>
              </AppCard>
            </Animated.View>
          )
        )}

        {/* ====================================================
            OTHER ACTIVITY
        ==================================================== */}

        <Animated.View
          style={[
            styles.activityWrapper,

            entranceStyle(
              cardAnimations[
                activities.length
              ]
            ),
          ]}
        >
          <AppCard
            onPress={() =>
              router.push(
                "/create-activity" as never
              )
            }
            style={[
              styles.activity,
              styles.otherActivity,

              {
                borderColor:
                  isFuture
                    ? theme.colors
                        .primary
                    : theme.colors
                        .border,
              },

              isDungeon &&
                styles.dungeonActivity,

              isFuture &&
                styles.futureActivity,
            ]}
          >
            <View
              style={[
                styles.iconBox,
                styles.plusBox,

                {
                  backgroundColor:
                    theme.colors
                      .cardAlt,

                  borderColor:
                    theme.colors.xp,
                },

                isDungeon &&
                  styles.dungeonIconBox,

                isFuture &&
                  styles.futureIconBox,
              ]}
            >
              <AppText
                style={[
                  styles.plus,

                  {
                    color:
                      theme.colors.xp,
                  },
                ]}
              >
                +
              </AppText>
            </View>

            <AppText
              variant="title"
              style={
                styles.activityTitle
              }
            >
              {isFuture
                ? "Custom Module"
                : "Other Activity"}
            </AppText>

            <AppText variant="caption">
              {isFuture
                ? "Create custom tracking data"
                : "Track anything you do"}
            </AppText>

            <View
              style={[
                styles.badge,

                {
                  backgroundColor:
                    theme.colors
                      .cardAlt,

                  borderColor:
                    isFuture
                      ? theme.colors
                          .xp
                      : "transparent",
                },

                isFuture &&
                  styles.futureBadge,
              ]}
            >
              <AppText
                style={[
                  styles.badgeText,

                  {
                    color:
                      theme.colors.xp,
                  },
                ]}
              >
                {isFuture
                  ? "CREATE"
                  : "CREATE"}
              </AppText>
            </View>
          </AppCard>
        </Animated.View>
      </View>

      {/* ======================================================
          EXAMPLES
      ====================================================== */}

      <Animated.View
        style={[
          styles.examples,

          {
            borderTopColor:
              theme.colors.border,
          },

          entranceStyle(
            examplesAnim
          ),
        ]}
      >
        <AppText
          variant="label"
          style={[
            isFuture && {
              color:
                theme.colors.primary,

              letterSpacing: 1.2,
            },
          ]}
        >
          {isDungeon
            ? "BUILD YOUR CHARACTER"
            : isFuture
              ? "EXPAND SYSTEM"
              : "TRACK YOUR LIFE"}
        </AppText>

        <AppText
          variant="caption"
          style={
            styles.examplesText
          }
        >
          🐎 Horse riding · 🎸 Guitar · 🏊 Swimming · 🎨
          Drawing · 🧘 Meditation · 🇯🇵 Japanese · and anything
          else.
        </AppText>
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
    // HEADER
    // ========================================================

    header: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: 24,
    },

    headerIcon: {
      width: 48,
      height: 48,

      borderRadius: 16,

      justifyContent:
        "center",

      alignItems: "center",

      marginLeft: 12,
    },

    headerEmoji: {
      fontSize: 23,
    },

    dungeonHeaderIcon: {
      borderRadius: 3,
      borderWidth: 2,
    },

    futureHeaderIcon: {
      borderRadius: 8,
      borderWidth: 1,
    },

    dungeonTitle: {
      fontFamily: "Menlo",
      letterSpacing: 1.3,
    },

    futureTitle: {
      letterSpacing: 1,
    },

    // ========================================================
    // INFO
    // ========================================================

    info: {
      flexDirection: "row",

      alignItems: "center",

      marginBottom: 26,
    },

    infoEmoji: {
      fontSize: 24,

      marginRight: 13,
    },

    infoTitle: {
      fontSize: 14,

      marginBottom: 3,
    },

    dungeonCard: {
      borderRadius: 3,
      borderWidth: 2,
    },

    futureCard: {
      borderRadius: 8,
      borderWidth: 1,
    },

    // ========================================================
    // SECTION
    // ========================================================

    sectionHeader: {
      marginBottom: 12,
    },

    sectionSubtitle: {
      marginTop: 3,
    },

    // ========================================================
    // GRID
    // ========================================================

    grid: {
      flexDirection: "row",

      flexWrap: "wrap",

      justifyContent:
        "space-between",

      rowGap: 12,
    },

    activityWrapper: {
      width: "48.5%",
    },

    activity: {
      width: "100%",

      minHeight: 178,
    },

    activityTitle: {
      fontSize: 16,
    },

    dungeonActivity: {
      borderRadius: 3,
      borderWidth: 2,
    },

    futureActivity: {
      borderRadius: 8,
      borderWidth: 1,
    },

    // ========================================================
    // ICON
    // ========================================================

    iconBox: {
      width: 50,
      height: 50,

      borderRadius: 16,

      justifyContent:
        "center",

      alignItems: "center",

      marginBottom: 15,

      borderWidth: 0,
    },

    dungeonIconBox: {
      borderRadius: 2,
    },

    futureIconBox: {
      borderRadius: 7,
      borderWidth: 1,
    },

    icon: {
      fontSize: 25,
    },

    // ========================================================
    // BADGE
    // ========================================================

    badge: {
      alignSelf:
        "flex-start",

      borderRadius: 8,

      paddingHorizontal: 8,
      paddingVertical: 5,

      marginTop: 13,

      borderWidth: 0,
    },

    futureBadge: {
      borderRadius: 4,
      borderWidth: 1,
    },

    badgeText: {
      fontSize: 9,

      fontWeight: "900",

      letterSpacing: 0.4,
    },

    // ========================================================
    // OTHER ACTIVITY
    // ========================================================

    otherActivity: {
      borderStyle: "dashed",
    },

    plusBox: {
      borderWidth: 1,
    },

    plus: {
      fontSize: 30,
      lineHeight: 32,

      fontWeight: "500",
    },

    // ========================================================
    // EXAMPLES
    // ========================================================

    examples: {
      borderTopWidth:
        StyleSheet.hairlineWidth,

      marginTop: 24,

      paddingTop: 16,

      paddingBottom: 28,
    },

    examplesText: {
      marginTop: 7,

      lineHeight: 18,
    },
  });