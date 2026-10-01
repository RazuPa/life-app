import type { ReactNode } from "react";

import { Tabs } from "expo-router";

import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { useRef } from "react";

import { useTheme } from "../../context/ThemeContext";

import type { ThemeName } from "../../theme/themes";

// ============================================================
// TYPES
// ============================================================

type TabSymbolProps = {
  symbol: string;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
};

type TabButtonProps = {
  children?: ReactNode;

  onPress?:
    | ((event: GestureResponderEvent) => void)
    | null;

  onLongPress?:
    | ((event: GestureResponderEvent) => void)
    | null;

  accessibilityState?: {
    selected?: boolean;
    disabled?: boolean;
  };

  accessibilityLabel?: string;

  testID?: string;

  style?: StyleProp<ViewStyle>;

  themeName: ThemeName;

  isAction?: boolean;
};

// ============================================================
// TAB SYMBOL
// ============================================================

function TabSymbol({
  symbol,
  focused,
  activeColor,
  inactiveColor,
}: TabSymbolProps) {
  return (
    <View
      style={[
        styles.symbolContainer,

        focused && {
          borderColor: activeColor,

          backgroundColor:
            `${activeColor}18`,
        },
      ]}
    >
      <Text
        style={[
          styles.symbol,

          {
            color: focused
              ? activeColor
              : inactiveColor,
          },
        ]}
      >
        {symbol}
      </Text>
    </View>
  );
}

// ============================================================
// ANIMATED TAB BUTTON
//
// Gives Home, Journey, Buddy and Player
// physical feedback when pressed.
// ============================================================

function AnimatedTabButton({
  children,
  onPress,
  onLongPress,
  accessibilityState,
  accessibilityLabel,
  testID,
  style,
  themeName,
}: TabButtonProps) {
  const scale =
    useRef(
      new Animated.Value(1)
    ).current;

  const translateY =
    useRef(
      new Animated.Value(0)
    ).current;

  const opacity =
    useRef(
      new Animated.Value(1)
    ).current;

  // ==========================================================
  // PRESS IN
  // ==========================================================

  function handlePressIn() {
    const isDungeon =
      themeName === "dungeon";

    Animated.parallel([
      Animated.spring(scale, {
        toValue:
          isDungeon
            ? 0.92
            : 0.9,

        useNativeDriver: true,

        speed: 35,
        bounciness: 0,
      }),

      Animated.spring(
        translateY,
        {
          toValue:
            isDungeon
              ? 3
              : 2,

          useNativeDriver: true,

          speed: 35,
          bounciness: 0,
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue: 0.7,
          duration: 70,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }

  // ==========================================================
  // PRESS OUT
  // ==========================================================

  function handlePressOut() {
    const isDungeon =
      themeName === "dungeon";

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,

        useNativeDriver: true,

        speed:
          isDungeon
            ? 30
            : 22,

        bounciness:
          isDungeon
            ? 0
            : 7,
      }),

      Animated.spring(
        translateY,
        {
          toValue: 0,

          useNativeDriver: true,

          speed:
            isDungeon
              ? 30
              : 22,

          bounciness:
            isDungeon
              ? 0
              : 7,
        }
      ),

      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Pressable
      onPress={
        onPress ?? undefined
      }
      onLongPress={
        onLongPress ?? undefined
      }
      onPressIn={
        handlePressIn
      }
      onPressOut={
        handlePressOut
      }
      accessibilityRole="button"
      accessibilityState={
        accessibilityState
      }
      accessibilityLabel={
        accessibilityLabel
      }
      testID={testID}
      style={style}
    >
      <Animated.View
        style={[
          styles.animatedTabButton,

          {
            opacity,

            transform: [
              {
                scale,
              },

              {
                translateY,
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ============================================================
// ANIMATED ACTION BUTTON
//
// Stronger feedback for the middle + button.
// ============================================================

function AnimatedActionButton({
  children,
  onPress,
  onLongPress,
  accessibilityState,
  accessibilityLabel,
  testID,
  style,
  themeName,
}: TabButtonProps) {
  const scale =
    useRef(
      new Animated.Value(1)
    ).current;

  const translateY =
    useRef(
      new Animated.Value(0)
    ).current;

  const rotation =
    useRef(
      new Animated.Value(0)
    ).current;

  // ==========================================================
  // ROTATION
  // ==========================================================

  const rotate =
    rotation.interpolate({
      inputRange: [0, 1],

      outputRange:
        themeName === "future"
          ? ["0deg", "8deg"]
          : ["0deg", "0deg"],
    });

  // ==========================================================
  // PRESS IN
  // ==========================================================

  function handlePressIn() {
    Animated.parallel([
      Animated.spring(scale, {
        toValue:
          themeName === "dungeon"
            ? 0.9
            : 0.86,

        useNativeDriver: true,

        speed: 40,
        bounciness: 0,
      }),

      Animated.spring(
        translateY,
        {
          toValue:
            themeName ===
            "dungeon"
              ? 4
              : 3,

          useNativeDriver: true,

          speed: 40,
          bounciness: 0,
        }
      ),

      Animated.timing(
        rotation,
        {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }

  // ==========================================================
  // PRESS OUT
  // ==========================================================

  function handlePressOut() {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,

        useNativeDriver: true,

        speed: 20,

        bounciness:
          themeName ===
          "dungeon"
            ? 0
            : 10,
      }),

      Animated.spring(
        translateY,
        {
          toValue: 0,

          useNativeDriver: true,

          speed: 20,

          bounciness:
            themeName ===
            "dungeon"
              ? 0
              : 10,
        }
      ),

      Animated.spring(
        rotation,
        {
          toValue: 0,

          useNativeDriver: true,

          speed: 20,

          bounciness: 8,
        }
      ),
    ]).start();
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Pressable
      onPress={
        onPress ?? undefined
      }
      onLongPress={
        onLongPress ?? undefined
      }
      onPressIn={
        handlePressIn
      }
      onPressOut={
        handlePressOut
      }
      accessibilityRole="button"
      accessibilityState={
        accessibilityState
      }
      accessibilityLabel={
        accessibilityLabel
      }
      testID={testID}
      style={style}
    >
      <Animated.View
        style={[
          styles.animatedActionButton,

          {
            transform: [
              {
                scale,
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
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ============================================================
// BOTTOM NAVIGATION
//
// Home
// Journey
// +
// Buddy
// Player
// ============================================================

export default function TabsLayout() {
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
  // TAB BAR HEIGHT
  // ==========================================================

  const tabBarHeight =
    isDungeon
      ? 92
      : 94;

  // ==========================================================
  // TAB BAR BORDER
  // ==========================================================

  const tabBarBorderColor =
    isDungeon ||
    isFuture
      ? theme.colors.primary
      : theme.colors.border;

  const tabBarBorderWidth =
    isDungeon
      ? 2
      : 1;

  // ==========================================================
  // TYPOGRAPHY
  // ==========================================================

  const tabLabelFont =
    isDungeon
      ? "Menlo"
      : undefined;

  const tabLabelLetterSpacing =
    isDungeon
      ? 0.8
      : isFuture
        ? 0.5
        : 0.2;

  // ==========================================================
  // SYMBOLS
  // ==========================================================

  const homeSymbol =
    isDungeon
      ? "◆"
      : isFuture
        ? "◇"
        : "◆";

  const journeySymbol =
    isDungeon
      ? "▲"
      : "↗";

  const buddySymbol =
    isDungeon
      ? "◉"
      : isFuture
        ? "◎"
        : "◉";

  const playerSymbol =
    isDungeon
      ? "■"
      : "●";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // ====================================================
        // TAB BAR
        // ====================================================

        tabBarStyle: {
          position: "absolute",

          height:
            tabBarHeight,

          paddingTop:
            isDungeon
              ? 8
              : 9,

          paddingBottom: 18,

          backgroundColor:
            theme.colors.tabBar,

          borderTopWidth:
            tabBarBorderWidth,

          borderTopColor:
            tabBarBorderColor,

          borderLeftWidth:
            isDungeon
              ? 1
              : 0,

          borderRightWidth:
            isDungeon
              ? 1
              : 0,

          borderLeftColor:
            isDungeon
              ? theme.colors.border
              : "transparent",

          borderRightColor:
            isDungeon
              ? theme.colors.border
              : "transparent",
        },

        // ====================================================
        // LABEL
        // ====================================================

        tabBarLabelStyle: {
          fontSize:
            isDungeon
              ? 10
              : 11,

          fontWeight: "800",

          letterSpacing:
            tabLabelLetterSpacing,

          fontFamily:
            tabLabelFont,

          textTransform:
            isDungeon
              ? "uppercase"
              : "none",
        },

        // ====================================================
        // COLORS
        // ====================================================

        tabBarActiveTintColor:
          theme.colors.primary,

        tabBarInactiveTintColor:
          theme.colors.muted,
      }}
    >
      {/* ======================================================
          HOME
      ====================================================== */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarButton: (
            props
          ) => (
            <AnimatedTabButton
              {...props}
              themeName={
                themeName
              }
            />
          ),

          tabBarIcon: ({
            focused,
          }) => (
            <TabSymbol
              symbol={
                homeSymbol
              }
              focused={
                focused
              }
              activeColor={
                theme.colors.primary
              }
              inactiveColor={
                theme.colors.muted
              }
            />
          ),
        }}
      />

      {/* ======================================================
          JOURNEY
      ====================================================== */}

      <Tabs.Screen
        name="journey"
        options={{
          title: "Journey",

          tabBarButton: (
            props
          ) => (
            <AnimatedTabButton
              {...props}
              themeName={
                themeName
              }
            />
          ),

          tabBarIcon: ({
            focused,
          }) => (
            <TabSymbol
              symbol={
                journeySymbol
              }
              focused={
                focused
              }
              activeColor={
                theme.colors.primary
              }
              inactiveColor={
                theme.colors.muted
              }
            />
          ),
        }}
      />

      {/* ======================================================
          ADD
      ====================================================== */}

      <Tabs.Screen
        name="add"
        options={{
          title: "",

          tabBarButton: (
            props
          ) => (
            <AnimatedActionButton
              {...props}
              themeName={
                themeName
              }
              isAction
            />
          ),

          tabBarIcon: () => (
            <View
              style={[
                styles.actionOuter,

                isNature &&
                  styles.actionOuterNature,

                isDungeon &&
                  styles.actionOuterDungeon,

                isFuture &&
                  styles.actionOuterFuture,

                {
                  backgroundColor:
                    theme.colors.background,

                  borderColor:
                    isDungeon ||
                    isFuture
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.actionButton,

                  isNature &&
                    styles.actionButtonNature,

                  isDungeon &&
                    styles.actionButtonDungeon,

                  isFuture &&
                    styles.actionButtonFuture,

                  {
                    backgroundColor:
                      theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.actionPlus,

                    isDungeon &&
                      styles.actionPlusDungeon,

                    isFuture &&
                      styles.actionPlusFuture,
                  ]}
                >
                  +
                </Text>
              </View>
            </View>
          ),
        }}
      />

      {/* ======================================================
          BUDDY
      ====================================================== */}

      <Tabs.Screen
        name="buddy-home"
        options={{
          title: "Buddy",

          tabBarButton: (
            props
          ) => (
            <AnimatedTabButton
              {...props}
              themeName={
                themeName
              }
            />
          ),

          tabBarIcon: ({
            focused,
          }) => (
            <TabSymbol
              symbol={
                buddySymbol
              }
              focused={
                focused
              }
              activeColor={
                theme.colors.primary
              }
              inactiveColor={
                theme.colors.muted
              }
            />
          ),
        }}
      />

      {/* ======================================================
          PLAYER
      ====================================================== */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Player",

          tabBarButton: (
            props
          ) => (
            <AnimatedTabButton
              {...props}
              themeName={
                themeName
              }
            />
          ),

          tabBarIcon: ({
            focused,
          }) => (
            <TabSymbol
              symbol={
                playerSymbol
              }
              focused={
                focused
              }
              activeColor={
                theme.colors.primary
              }
              inactiveColor={
                theme.colors.muted
              }
            />
          ),
        }}
      />

      {/* ======================================================
          HIDDEN GOALS
      ====================================================== */}

      <Tabs.Screen
        name="goals"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    // ========================================================
    // ANIMATED TAB WRAPPERS
    // ========================================================

    animatedTabButton: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",
    },

    animatedActionButton: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",
    },

    // ========================================================
    // NORMAL TAB SYMBOL
    // ========================================================

    symbolContainer: {
      width: 34,
      height: 30,

      borderRadius: 10,

      borderWidth: 1,
      borderColor:
        "transparent",

      alignItems: "center",
      justifyContent: "center",
    },

    symbol: {
      fontSize: 18,
      fontWeight: "900",
    },

    // ========================================================
    // CENTER ACTION BUTTON
    // ========================================================

    actionOuter: {
      width: 72,
      height: 72,

      borderRadius: 36,

      borderWidth: 1,

      alignItems: "center",
      justifyContent: "center",

      marginTop: -27,
    },

    actionButton: {
      width: 60,
      height: 60,

      borderRadius: 30,

      alignItems: "center",
      justifyContent: "center",
    },

    actionPlus: {
      color: "#FFFFFF",

      fontSize: 36,
      lineHeight: 39,

      fontWeight: "500",
    },

    // ========================================================
    // NATURE
    // ========================================================

    actionOuterNature: {
      borderRadius: 36,
    },

    actionButtonNature: {
      borderRadius: 30,
    },

    // ========================================================
    // DOOM DEPTHS
    // ========================================================

    actionOuterDungeon: {
      borderRadius: 8,

      borderWidth: 2,
    },

    actionButtonDungeon: {
      borderRadius: 4,

      width: 58,
      height: 58,
    },

    actionPlusDungeon: {
      fontFamily: "Menlo",

      fontSize: 31,
      lineHeight: 35,

      fontWeight: "900",
    },

    // ========================================================
    // FUTURE OS
    // ========================================================

    actionOuterFuture: {
      borderRadius: 18,

      borderWidth: 1.5,
    },

    actionButtonFuture: {
      borderRadius: 15,

      width: 58,
      height: 58,
    },

    actionPlusFuture: {
      fontSize: 34,

      lineHeight: 38,

      fontWeight: "300",
    },
  });