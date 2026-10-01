import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  horizontalPadding?: number;
  topPadding?: number;
  bottomPadding?: number;
  showsVerticalScrollIndicator?: boolean;
};

// ============================================================
// NATURE BACKGROUND
// ============================================================

function SerenaCoastalBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.coastalSky} />
      <View style={styles.coastalSkyGlow} />
      <View style={styles.coastalSunGlow} />
      <View style={styles.coastalSun} />

      <View style={[styles.mountain, styles.mountainBackOne]} />
      <View style={[styles.mountain, styles.mountainBackTwo]} />
      <View style={[styles.mountain, styles.mountainBackThree]} />

      <View style={styles.coastalHillBack} />
      <View style={styles.coastalHillLeft} />
      <View style={styles.coastalHillRight} />

      <View style={styles.oceanBase} />
      <View style={styles.oceanLightOne} />
      <View style={styles.oceanLightTwo} />

      <View style={[styles.wave, styles.waveOne]} />
      <View style={[styles.wave, styles.waveTwo]} />
      <View style={[styles.wave, styles.waveThree]} />

      <View style={styles.lowerCoastLeft} />
      <View style={styles.lowerCoastRight} />

      <View style={styles.coastalSparkOne} />
      <View style={styles.coastalSparkTwo} />
      <View style={styles.coastalSparkThree} />
    </View>
  );
}

// ============================================================
// DUNGEON BACKGROUND
// ============================================================

function DoomDepthsBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.doomSky} />
      <View style={styles.doomPurpleHaze} />

      <View style={styles.doomMoonGlow} />
      <View style={styles.doomMoon} />
      <View style={styles.doomMoonPixelOne} />
      <View style={styles.doomMoonPixelTwo} />

      <View style={styles.doomStarOne} />
      <View style={styles.doomStarTwo} />
      <View style={styles.doomStarThree} />
      <View style={styles.doomStarFour} />
      <View style={styles.doomStarFive} />

      <View style={[styles.doomMountain, styles.doomMountainOne]} />
      <View style={[styles.doomMountain, styles.doomMountainTwo]} />
      <View style={[styles.doomMountain, styles.doomMountainThree]} />

      <View style={styles.doomHorizonGlow} />
      <View style={styles.doomHorizonLine} />

      <View style={styles.doomCastleMain} />
      <View style={styles.doomCastleTowerLeft} />
      <View style={styles.doomCastleTowerRight} />
      <View style={styles.doomCastleTopLeft} />
      <View style={styles.doomCastleTopRight} />
      <View style={styles.doomCastleWindowOne} />
      <View style={styles.doomCastleWindowTwo} />

      <View style={styles.doomGround} />
      <View style={styles.doomRockLeft} />
      <View style={styles.doomRockRight} />
      <View style={styles.doomRockMiddle} />

      <View style={styles.doomLavaGlow} />
      <View style={styles.doomLavaLineOne} />
      <View style={styles.doomLavaLineTwo} />
      <View style={styles.doomLavaLineThree} />

      <View style={styles.doomEmberOne} />
      <View style={styles.doomEmberTwo} />
      <View style={styles.doomEmberThree} />
      <View style={styles.doomEmberFour} />
      <View style={styles.doomEmberFive} />
      <View style={styles.doomEmberSix} />

      <View style={styles.doomScanlineOne} />
      <View style={styles.doomScanlineTwo} />
      <View style={styles.doomScanlineThree} />
      <View style={styles.doomScanlineFour} />
    </View>
  );
}

// ============================================================
// FUTURE — SPACESHIP INTERIOR
// ============================================================

function FuturisticBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.futureShipBackground} />

      <View style={styles.futureWindowGlow} />

      <View style={styles.futureWindowFrame}>
        <View style={styles.futureWindowSpace}>
          <View style={styles.futureStarOne} />
          <View style={styles.futureStarTwo} />
          <View style={styles.futureStarThree} />
          <View style={styles.futureStarFour} />
          <View style={styles.futureStarFive} />
          <View style={styles.futureStarSix} />
          <View style={styles.futureStarSeven} />

          <View style={styles.futurePlanetGlow} />
          <View style={styles.futurePlanet} />
        </View>
      </View>

      <View style={styles.futureCeilingLeft} />
      <View style={styles.futureCeilingRight} />

      <View style={styles.futureCeilingLightLeft} />
      <View style={styles.futureCeilingLightRight} />

      <View style={styles.futureFrameLeft} />
      <View style={styles.futureFrameRight} />
      <View style={styles.futureFrameTop} />

      <View style={styles.futureWallLeft} />
      <View style={styles.futureWallLeftLineOne} />
      <View style={styles.futureWallLeftLineTwo} />

      <View style={styles.futureLeftPanel}>
        <View style={styles.futurePanelScreen}>
          <View style={styles.futureScreenLineOne} />
          <View style={styles.futureScreenLineTwo} />
          <View style={styles.futureScreenLineThree} />
        </View>

        <View style={styles.futurePanelLineOne} />
        <View style={styles.futurePanelLineTwo} />
        <View style={styles.futurePanelLineThree} />

        <View style={styles.futurePanelDotOne} />
        <View style={styles.futurePanelDotTwo} />
      </View>

      <View style={styles.futureWallRight} />
      <View style={styles.futureWallRightLineOne} />
      <View style={styles.futureWallRightLineTwo} />

      <View style={styles.futureRightPanel}>
        <View style={styles.futureRightPanelScreen} />

        <View style={styles.futureRightPanelBarOne} />
        <View style={styles.futureRightPanelBarTwo} />
        <View style={styles.futureRightPanelBarThree} />
      </View>

      <View style={styles.futureFloor} />
      <View style={styles.futureFloorCenter} />

      <View style={styles.futureFloorLineLeft} />
      <View style={styles.futureFloorLineRight} />

      <View style={styles.futureFloorHorizontalOne} />
      <View style={styles.futureFloorHorizontalTwo} />
      <View style={styles.futureFloorHorizontalThree} />

      <View style={styles.futureGlowLeft} />
      <View style={styles.futureGlowRight} />

      <View style={styles.futureStripLeft} />
      <View style={styles.futureStripRight} />

      <View style={styles.futureHudTopLeft}>
        <View style={styles.futureHudSmallLine} />
        <View style={styles.futureHudLongLine} />
      </View>

      <View style={styles.futureHudTopRight}>
        <View style={styles.futureHudDot} />
        <View style={styles.futureHudDot} />
        <View style={styles.futureHudDot} />
      </View>

      <View style={styles.futureAmbientCyan} />
      <View style={styles.futureAmbientPurple} />
    </View>
  );
}

// ============================================================
// THEME BACKGROUND
// ============================================================

function ThemeBackground() {
  const { themeName } = useTheme();

  if (themeName === "nature") {
    return <SerenaCoastalBackground />;
  }

  if (themeName === "dungeon") {
    return <DoomDepthsBackground />;
  }

  return <FuturisticBackground />;
}

// ============================================================
// APP SCREEN
// ============================================================

export default function AppScreen({
  children,
  scroll = true,
  horizontalPadding = 20,
  topPadding = 28,
  bottomPadding = 130,
  showsVerticalScrollIndicator = false,
}: AppScreenProps) {
  const {
    theme,
    themeName,
  } = useTheme();

  // ==========================================================
  // SCREEN ENTRANCE ANIMATION
  // ==========================================================

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const translateY = useRef(
    new Animated.Value(14)
  ).current;

  const scale = useRef(
    new Animated.Value(0.985)
  ).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(14);
    scale.setValue(0.985);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(
          Easing.cubic
        ),
        useNativeDriver: true,
      }),

      Animated.timing(
        translateY,
        {
          toValue: 0,
          duration: 320,
          easing: Easing.out(
            Easing.cubic
          ),
          useNativeDriver: true,
        }
      ),

      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    opacity,
    scale,
    translateY,
  ]);

  // ==========================================================
  // STATUS BAR
  // ==========================================================

  const statusBarHeight =
    Platform.OS === "android"
      ? StatusBar.currentHeight ?? 0
      : 44;

  // ==========================================================
  // CONTENT STYLE
  // ==========================================================

  const contentStyle = {
    paddingHorizontal:
      horizontalPadding,

    paddingTop:
      statusBarHeight +
      topPadding,

    paddingBottom:
      bottomPadding,
  };

  // ==========================================================
  // THEME-SPECIFIC TRANSFORM
  // ==========================================================

  const animatedTransform =
    themeName === "nature"
      ? [
          {
            translateY,
          },
        ]
      : [
          {
            translateY,
          },
          {
            scale,
          },
        ];

  // ==========================================================
  // SCROLL SCREEN
  // ==========================================================

  if (scroll) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <ThemeBackground />

        <Animated.View
          style={[
            styles.animatedContent,
            {
              opacity,
              transform:
                animatedTransform,
            },
          ]}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={
              contentStyle
            }
            showsVerticalScrollIndicator={
              showsVerticalScrollIndicator
            }
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  // ==========================================================
  // NON-SCROLL SCREEN
  // ==========================================================

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      <ThemeBackground />

      <Animated.View
        style={[
          styles.staticContent,
          contentStyle,
          {
            opacity,
            transform:
              animatedTransform,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // BASE
  // ==========================================================

  container: {
    flex: 1,
    overflow: "hidden",
  },

  animatedContent: {
    flex: 1,
    backgroundColor: "transparent",
  },

  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },

  staticContent: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // ==========================================================
  // NATURE — SKY
  // ==========================================================

  coastalSky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 390,
    backgroundColor: "#BDE8F2",
  },

  coastalSkyGlow: {
    position: "absolute",
    width: 420,
    height: 280,
    borderRadius: 210,
    top: -120,
    left: -110,
    backgroundColor: "#EAFBFF",
    opacity: 0.72,
  },

  coastalSunGlow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: 62,
    right: -12,
    backgroundColor: "#FFF2A8",
    opacity: 0.3,
  },

  coastalSun: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    top: 103,
    right: 36,
    backgroundColor: "#FFD86A",
    opacity: 0.95,
  },

  // ==========================================================
  // NATURE — MOUNTAINS
  // ==========================================================

  mountain: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 34,
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },

  mountainBackOne: {
    top: 205,
    left: -92,
    backgroundColor: "#79AFA8",
    opacity: 0.8,
  },

  mountainBackTwo: {
    top: 185,
    left: 105,
    backgroundColor: "#669D98",
    opacity: 0.78,
  },

  mountainBackThree: {
    top: 220,
    right: -155,
    backgroundColor: "#82B9A5",
    opacity: 0.82,
  },

  // ==========================================================
  // NATURE — HILLS
  // ==========================================================

  coastalHillBack: {
    position: "absolute",
    width: 520,
    height: 175,
    borderRadius: 260,
    top: 300,
    left: -70,
    backgroundColor: "#69A873",
    opacity: 0.94,
    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  coastalHillLeft: {
    position: "absolute",
    width: 310,
    height: 150,
    borderRadius: 155,
    top: 350,
    left: -155,
    backgroundColor: "#3F865F",
    opacity: 0.95,
    transform: [
      {
        rotate: "10deg",
      },
    ],
  },

  coastalHillRight: {
    position: "absolute",
    width: 290,
    height: 145,
    borderRadius: 150,
    top: 338,
    right: -175,
    backgroundColor: "#4F9467",
    opacity: 0.95,
    transform: [
      {
        rotate: "-12deg",
      },
    ],
  },

  // ==========================================================
  // NATURE — OCEAN
  // ==========================================================

  oceanBase: {
    position: "absolute",
    top: 405,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#4FC4CF",
    opacity: 0.72,
  },

  oceanLightOne: {
    position: "absolute",
    width: 520,
    height: 260,
    borderRadius: 260,
    top: 450,
    left: -220,
    backgroundColor: "#78DDE0",
    opacity: 0.38,
    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },

  oceanLightTwo: {
    position: "absolute",
    width: 500,
    height: 280,
    borderRadius: 250,
    bottom: -80,
    right: -250,
    backgroundColor: "#258FA9",
    opacity: 0.23,
    transform: [
      {
        rotate: "13deg",
      },
    ],
  },

  // ==========================================================
  // NATURE — WAVES
  // ==========================================================

  wave: {
    position: "absolute",
    height: 48,
    borderRadius: 100,
    borderTopWidth: 2,
    borderTopColor:
      "rgba(255,255,255,0.52)",
  },

  waveOne: {
    width: 240,
    top: 505,
    left: -60,
    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  waveTwo: {
    width: 270,
    top: 615,
    right: -90,
    opacity: 0.75,
    transform: [
      {
        rotate: "5deg",
      },
    ],
  },

  waveThree: {
    width: 220,
    bottom: 115,
    left: 20,
    opacity: 0.45,
    transform: [
      {
        rotate: "-3deg",
      },
    ],
  },

  // ==========================================================
  // NATURE — LOWER LAND
  // ==========================================================

  lowerCoastLeft: {
    position: "absolute",
    width: 230,
    height: 100,
    borderRadius: 120,
    bottom: -48,
    left: -95,
    backgroundColor: "#3F805D",
    opacity: 0.82,
    transform: [
      {
        rotate: "8deg",
      },
    ],
  },

  lowerCoastRight: {
    position: "absolute",
    width: 180,
    height: 85,
    borderRadius: 100,
    bottom: 42,
    right: -110,
    backgroundColor: "#4A8E64",
    opacity: 0.5,
    transform: [
      {
        rotate: "-15deg",
      },
    ],
  },

  coastalSparkOne: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    top: 168,
    left: 33,
    backgroundColor: "#FFFFFF",
    opacity: 0.65,
  },

  coastalSparkTwo: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    top: 191,
    left: 53,
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
  },

  coastalSparkThree: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    top: 535,
    right: 42,
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
  },

  // ==========================================================
  // DUNGEON — SKY
  // ==========================================================

  doomSky: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#09070F",
  },

  doomPurpleHaze: {
    position: "absolute",
    width: 520,
    height: 380,
    top: -130,
    left: -100,
    borderRadius: 260,
    backgroundColor: "#281535",
    opacity: 0.58,
  },

  doomMoonGlow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: 85,
    right: 20,
    backgroundColor: "#FF3C28",
    opacity: 0.1,
  },

  doomMoon: {
    position: "absolute",
    width: 66,
    height: 66,
    borderRadius: 33,
    top: 126,
    right: 60,
    backgroundColor: "#E84B35",
    opacity: 0.92,
  },

  doomMoonPixelOne: {
    position: "absolute",
    width: 13,
    height: 8,
    top: 143,
    right: 74,
    backgroundColor: "#B8322C",
    opacity: 0.8,
  },

  doomMoonPixelTwo: {
    position: "absolute",
    width: 8,
    height: 13,
    top: 163,
    right: 92,
    backgroundColor: "#C43A30",
    opacity: 0.72,
  },

  doomStarOne: {
    position: "absolute",
    width: 3,
    height: 3,
    top: 112,
    left: 38,
    backgroundColor: "#9A769F",
    opacity: 0.7,
  },

  doomStarTwo: {
    position: "absolute",
    width: 4,
    height: 4,
    top: 171,
    left: 87,
    backgroundColor: "#B68EB9",
    opacity: 0.48,
  },

  doomStarThree: {
    position: "absolute",
    width: 2,
    height: 2,
    top: 95,
    left: 173,
    backgroundColor: "#FFFFFF",
    opacity: 0.6,
  },

  doomStarFour: {
    position: "absolute",
    width: 3,
    height: 3,
    top: 231,
    right: 29,
    backgroundColor: "#D58C7B",
    opacity: 0.5,
  },

  doomStarFive: {
    position: "absolute",
    width: 2,
    height: 2,
    top: 253,
    left: 130,
    backgroundColor: "#A885A8",
    opacity: 0.5,
  },

  // ==========================================================
  // DUNGEON — MOUNTAINS
  // ==========================================================

  doomMountain: {
    position: "absolute",
    width: 230,
    height: 230,
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },

  doomMountainOne: {
    top: 260,
    left: -120,
    backgroundColor: "#1C1323",
    opacity: 0.96,
  },

  doomMountainTwo: {
    top: 235,
    left: 72,
    backgroundColor: "#211426",
    opacity: 0.98,
  },

  doomMountainThree: {
    top: 275,
    right: -155,
    backgroundColor: "#180F1D",
    opacity: 0.98,
  },

  doomHorizonGlow: {
    position: "absolute",
    width: 520,
    height: 170,
    top: 365,
    left: -55,
    borderRadius: 260,
    backgroundColor: "#C92F20",
    opacity: 0.16,
  },

  doomHorizonLine: {
    position: "absolute",
    height: 2,
    top: 433,
    left: 0,
    right: 0,
    backgroundColor: "#C74432",
    opacity: 0.32,
  },

  // ==========================================================
  // DUNGEON — CASTLE
  // ==========================================================

  doomCastleMain: {
    position: "absolute",
    width: 84,
    height: 95,
    top: 345,
    right: 42,
    backgroundColor: "#100B14",
    opacity: 0.95,
  },

  doomCastleTowerLeft: {
    position: "absolute",
    width: 28,
    height: 125,
    top: 315,
    right: 111,
    backgroundColor: "#100B14",
    opacity: 0.98,
  },

  doomCastleTowerRight: {
    position: "absolute",
    width: 27,
    height: 135,
    top: 305,
    right: 29,
    backgroundColor: "#100B14",
    opacity: 0.98,
  },

  doomCastleTopLeft: {
    position: "absolute",
    width: 12,
    height: 12,
    top: 303,
    right: 119,
    backgroundColor: "#100B14",
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },

  doomCastleTopRight: {
    position: "absolute",
    width: 12,
    height: 12,
    top: 293,
    right: 36,
    backgroundColor: "#100B14",
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },

  doomCastleWindowOne: {
    position: "absolute",
    width: 5,
    height: 11,
    top: 352,
    right: 120,
    backgroundColor: "#E34A2E",
    opacity: 0.75,
  },

  doomCastleWindowTwo: {
    position: "absolute",
    width: 5,
    height: 11,
    top: 344,
    right: 39,
    backgroundColor: "#E34A2E",
    opacity: 0.75,
  },

  // ==========================================================
  // DUNGEON — GROUND
  // ==========================================================

  doomGround: {
    position: "absolute",
    top: 438,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0C0910",
    opacity: 0.76,
  },

  doomRockLeft: {
    position: "absolute",
    width: 240,
    height: 130,
    borderRadius: 20,
    bottom: -60,
    left: -110,
    backgroundColor: "#17101A",
    transform: [
      {
        rotate: "8deg",
      },
    ],
  },

  doomRockRight: {
    position: "absolute",
    width: 230,
    height: 130,
    borderRadius: 20,
    bottom: 35,
    right: -150,
    backgroundColor: "#140E18",
    transform: [
      {
        rotate: "-9deg",
      },
    ],
  },

  doomRockMiddle: {
    position: "absolute",
    width: 180,
    height: 80,
    borderRadius: 12,
    bottom: -30,
    left: 125,
    backgroundColor: "#120C15",
    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  doomLavaGlow: {
    position: "absolute",
    width: 480,
    height: 190,
    borderRadius: 240,
    bottom: -110,
    left: -60,
    backgroundColor: "#C93620",
    opacity: 0.16,
  },

  doomLavaLineOne: {
    position: "absolute",
    width: 135,
    height: 3,
    bottom: 105,
    left: -20,
    backgroundColor: "#D94B28",
    opacity: 0.36,
    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  doomLavaLineTwo: {
    position: "absolute",
    width: 95,
    height: 2,
    bottom: 76,
    left: 135,
    backgroundColor: "#F06B32",
    opacity: 0.28,
    transform: [
      {
        rotate: "3deg",
      },
    ],
  },

  doomLavaLineThree: {
    position: "absolute",
    width: 150,
    height: 3,
    bottom: 126,
    right: -45,
    backgroundColor: "#B93627",
    opacity: 0.3,
    transform: [
      {
        rotate: "5deg",
      },
    ],
  },

  doomEmberOne: {
    position: "absolute",
    width: 4,
    height: 4,
    top: 472,
    left: 33,
    backgroundColor: "#FF6A2A",
    opacity: 0.8,
  },

  doomEmberTwo: {
    position: "absolute",
    width: 3,
    height: 6,
    top: 530,
    right: 42,
    backgroundColor: "#E9482A",
    opacity: 0.75,
  },

  doomEmberThree: {
    position: "absolute",
    width: 5,
    height: 5,
    top: 620,
    left: 67,
    backgroundColor: "#FF8A36",
    opacity: 0.55,
  },

  doomEmberFour: {
    position: "absolute",
    width: 3,
    height: 3,
    bottom: 196,
    right: 90,
    backgroundColor: "#E94A2D",
    opacity: 0.7,
  },

  doomEmberFive: {
    position: "absolute",
    width: 4,
    height: 7,
    bottom: 135,
    left: 38,
    backgroundColor: "#FF7130",
    opacity: 0.48,
  },

  doomEmberSix: {
    position: "absolute",
    width: 3,
    height: 3,
    bottom: 250,
    right: 32,
    backgroundColor: "#D83B2A",
    opacity: 0.55,
  },

  doomScanlineOne: {
    position: "absolute",
    height: 1,
    top: "18%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    opacity: 0.018,
  },

  doomScanlineTwo: {
    position: "absolute",
    height: 1,
    top: "39%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    opacity: 0.018,
  },

  doomScanlineThree: {
    position: "absolute",
    height: 1,
    top: "61%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    opacity: 0.018,
  },

  doomScanlineFour: {
    position: "absolute",
    height: 1,
    top: "82%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    opacity: 0.018,
  },

  // ==========================================================
  // FUTURE — SPACESHIP BASE
  // ==========================================================

  futureShipBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#030812",
  },

  // ==========================================================
  // FUTURE — WINDOW
  // ==========================================================

  futureWindowGlow: {
    position: "absolute",
    width: 310,
    height: 310,
    borderRadius: 155,
    top: 105,
    left: "50%",
    marginLeft: -155,
    backgroundColor: "#00D9FF",
    opacity: 0.07,
  },

  futureWindowFrame: {
    position: "absolute",
    width: 230,
    height: 270,
    top: 105,
    left: "50%",
    marginLeft: -115,
    borderWidth: 8,
    borderColor: "#14283A",
    borderRadius: 80,
    backgroundColor: "#07111D",
    overflow: "hidden",
  },

  futureWindowSpace: {
    flex: 1,
    margin: 5,
    borderRadius: 68,
    backgroundColor: "#02050D",
    overflow: "hidden",
  },

  futureStarOne: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    top: 35,
    left: 42,
    backgroundColor: "#FFFFFF",
    opacity: 0.85,
  },

  futureStarTwo: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 1,
    top: 67,
    right: 45,
    backgroundColor: "#BEEFFF",
    opacity: 0.7,
  },

  futureStarThree: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    top: 112,
    left: 72,
    backgroundColor: "#FFFFFF",
    opacity: 0.55,
  },

  futureStarFour: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 1,
    top: 150,
    right: 61,
    backgroundColor: "#B0CFFF",
    opacity: 0.75,
  },

  futureStarFive: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    top: 88,
    left: 128,
    backgroundColor: "#FFFFFF",
    opacity: 0.65,
  },

  futureStarSix: {
    position: "absolute",
    width: 2,
    height: 2,
    top: 184,
    left: 40,
    backgroundColor: "#38D9FF",
    opacity: 0.75,
  },

  futureStarSeven: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    top: 205,
    right: 35,
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
  },

  futurePlanetGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    bottom: -80,
    right: -40,
    backgroundColor: "#168DFF",
    opacity: 0.14,
  },

  futurePlanet: {
    position: "absolute",
    width: 125,
    height: 125,
    borderRadius: 63,
    bottom: -68,
    right: -20,
    backgroundColor: "#103A67",
    borderWidth: 2,
    borderColor: "#2978A8",
    opacity: 0.7,
  },

  // ==========================================================
  // FUTURE — CEILING
  // ==========================================================

  futureCeilingLeft: {
    position: "absolute",
    width: 260,
    height: 85,
    top: -28,
    left: -80,
    backgroundColor: "#091522",
    transform: [
      {
        rotate: "11deg",
      },
    ],
  },

  futureCeilingRight: {
    position: "absolute",
    width: 260,
    height: 85,
    top: -28,
    right: -80,
    backgroundColor: "#091522",
    transform: [
      {
        rotate: "-11deg",
      },
    ],
  },

  futureCeilingLightLeft: {
    position: "absolute",
    width: 160,
    height: 3,
    top: 55,
    left: -20,
    backgroundColor: "#38D9FF",
    opacity: 0.55,
    transform: [
      {
        rotate: "12deg",
      },
    ],
  },

  futureCeilingLightRight: {
    position: "absolute",
    width: 160,
    height: 3,
    top: 55,
    right: -20,
    backgroundColor: "#38D9FF",
    opacity: 0.55,
    transform: [
      {
        rotate: "-12deg",
      },
    ],
  },

  // ==========================================================
  // FUTURE — CENTRAL FRAME
  // ==========================================================

  futureFrameLeft: {
    position: "absolute",
    width: 18,
    height: 390,
    top: 65,
    left: 78,
    backgroundColor: "#101F2C",
    borderRightWidth: 2,
    borderRightColor: "#27526A",
    transform: [
      {
        rotate: "-7deg",
      },
    ],
  },

  futureFrameRight: {
    position: "absolute",
    width: 18,
    height: 390,
    top: 65,
    right: 78,
    backgroundColor: "#101F2C",
    borderLeftWidth: 2,
    borderLeftColor: "#27526A",
    transform: [
      {
        rotate: "7deg",
      },
    ],
  },

  futureFrameTop: {
    position: "absolute",
    width: 240,
    height: 16,
    top: 86,
    left: "50%",
    marginLeft: -120,
    backgroundColor: "#101F2C",
    borderBottomWidth: 2,
    borderBottomColor: "#25536A",
  },

  // ==========================================================
  // FUTURE — LEFT WALL
  // ==========================================================

  futureWallLeft: {
    position: "absolute",
    width: 105,
    top: 65,
    bottom: 0,
    left: -30,
    backgroundColor: "#07111C",
    borderRightWidth: 2,
    borderRightColor: "#10283A",
    transform: [
      {
        rotate: "-2deg",
      },
    ],
  },

  futureWallLeftLineOne: {
    position: "absolute",
    width: 2,
    height: 250,
    top: 130,
    left: 66,
    backgroundColor: "#1B526B",
    opacity: 0.42,
  },

  futureWallLeftLineTwo: {
    position: "absolute",
    width: 2,
    height: 190,
    top: 450,
    left: 52,
    backgroundColor: "#38D9FF",
    opacity: 0.2,
  },

  futureLeftPanel: {
    position: "absolute",
    width: 76,
    height: 135,
    top: 225,
    left: 10,
    borderWidth: 1,
    borderColor: "#1D455D",
    backgroundColor: "#081725",
    padding: 8,
    opacity: 0.9,
  },

  futurePanelScreen: {
    height: 38,
    backgroundColor: "#061B29",
    borderWidth: 1,
    borderColor: "#28718C",
    marginBottom: 10,
    padding: 5,
  },

  futureScreenLineOne: {
    width: "85%",
    height: 2,
    backgroundColor: "#38D9FF",
    opacity: 0.6,
    marginBottom: 5,
  },

  futureScreenLineTwo: {
    width: "55%",
    height: 2,
    backgroundColor: "#42E6A4",
    opacity: 0.5,
    marginBottom: 5,
  },

  futureScreenLineThree: {
    width: "70%",
    height: 2,
    backgroundColor: "#8A6CFF",
    opacity: 0.5,
  },

  futurePanelLineOne: {
    height: 2,
    width: "85%",
    backgroundColor: "#38D9FF",
    opacity: 0.5,
    marginBottom: 7,
  },

  futurePanelLineTwo: {
    height: 2,
    width: "60%",
    backgroundColor: "#8A6CFF",
    opacity: 0.5,
    marginBottom: 7,
  },

  futurePanelLineThree: {
    height: 2,
    width: "72%",
    backgroundColor: "#38D9FF",
    opacity: 0.3,
  },

  futurePanelDotOne: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    bottom: 10,
    left: 10,
    backgroundColor: "#42E6A4",
  },

  futurePanelDotTwo: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    bottom: 10,
    left: 22,
    backgroundColor: "#38D9FF",
  },

  // ==========================================================
  // FUTURE — RIGHT WALL
  // ==========================================================

  futureWallRight: {
    position: "absolute",
    width: 105,
    top: 65,
    bottom: 0,
    right: -30,
    backgroundColor: "#07111C",
    borderLeftWidth: 2,
    borderLeftColor: "#10283A",
    transform: [
      {
        rotate: "2deg",
      },
    ],
  },

  futureWallRightLineOne: {
    position: "absolute",
    width: 2,
    height: 250,
    top: 130,
    right: 66,
    backgroundColor: "#1B526B",
    opacity: 0.42,
  },

  futureWallRightLineTwo: {
    position: "absolute",
    width: 2,
    height: 190,
    top: 450,
    right: 52,
    backgroundColor: "#38D9FF",
    opacity: 0.2,
  },

  futureRightPanel: {
    position: "absolute",
    width: 76,
    height: 125,
    top: 410,
    right: 10,
    borderWidth: 1,
    borderColor: "#1D455D",
    backgroundColor: "#081725",
    padding: 8,
    opacity: 0.9,
  },

  futureRightPanelScreen: {
    height: 35,
    backgroundColor: "#0C2436",
    borderWidth: 1,
    borderColor: "#355E83",
    marginBottom: 10,
  },

  futureRightPanelBarOne: {
    height: 4,
    width: "90%",
    backgroundColor: "#38D9FF",
    opacity: 0.45,
    marginBottom: 7,
  },

  futureRightPanelBarTwo: {
    height: 4,
    width: "65%",
    backgroundColor: "#8A6CFF",
    opacity: 0.45,
    marginBottom: 7,
  },

  futureRightPanelBarThree: {
    height: 4,
    width: "78%",
    backgroundColor: "#42E6A4",
    opacity: 0.35,
  },

  // ==========================================================
  // FUTURE — FLOOR
  // ==========================================================

  futureFloor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 330,
    backgroundColor: "#050C15",
    borderTopWidth: 1,
    borderTopColor: "#153247",
  },

  futureFloorCenter: {
    position: "absolute",
    width: 110,
    height: 390,
    bottom: -155,
    left: "50%",
    marginLeft: -55,
    backgroundColor: "#081725",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#16384B",
  },

  futureFloorLineLeft: {
    position: "absolute",
    width: 2,
    height: 350,
    bottom: -60,
    left: "28%",
    backgroundColor: "#38D9FF",
    opacity: 0.16,
    transform: [
      {
        rotate: "16deg",
      },
    ],
  },

  futureFloorLineRight: {
    position: "absolute",
    width: 2,
    height: 350,
    bottom: -60,
    right: "28%",
    backgroundColor: "#38D9FF",
    opacity: 0.16,
    transform: [
      {
        rotate: "-16deg",
      },
    ],
  },

  futureFloorHorizontalOne: {
    position: "absolute",
    height: 1,
    left: 45,
    right: 45,
    bottom: 235,
    backgroundColor: "#26536A",
    opacity: 0.35,
  },

  futureFloorHorizontalTwo: {
    position: "absolute",
    height: 1,
    left: 22,
    right: 22,
    bottom: 150,
    backgroundColor: "#26536A",
    opacity: 0.3,
  },

  futureFloorHorizontalThree: {
    position: "absolute",
    height: 1,
    left: 0,
    right: 0,
    bottom: 65,
    backgroundColor: "#26536A",
    opacity: 0.25,
  },

  // ==========================================================
  // FUTURE — LIGHTS
  // ==========================================================

  futureGlowLeft: {
    position: "absolute",
    width: 120,
    height: 380,
    top: 150,
    left: -75,
    borderRadius: 60,
    backgroundColor: "#00D9FF",
    opacity: 0.045,
  },

  futureGlowRight: {
    position: "absolute",
    width: 120,
    height: 380,
    top: 180,
    right: -75,
    borderRadius: 60,
    backgroundColor: "#8A6CFF",
    opacity: 0.045,
  },

  futureStripLeft: {
    position: "absolute",
    width: 3,
    height: 220,
    top: 480,
    left: 23,
    backgroundColor: "#38D9FF",
    opacity: 0.42,
  },

  futureStripRight: {
    position: "absolute",
    width: 3,
    height: 220,
    top: 500,
    right: 23,
    backgroundColor: "#8A6CFF",
    opacity: 0.35,
  },

  // ==========================================================
  // FUTURE — HUD
  // ==========================================================

  futureHudTopLeft: {
    position: "absolute",
    top: 88,
    left: 22,
    width: 50,
  },

  futureHudSmallLine: {
    width: 20,
    height: 2,
    backgroundColor: "#38D9FF",
    opacity: 0.7,
    marginBottom: 5,
  },

  futureHudLongLine: {
    width: 43,
    height: 1,
    backgroundColor: "#38D9FF",
    opacity: 0.35,
  },

  futureHudTopRight: {
    position: "absolute",
    top: 90,
    right: 24,
    flexDirection: "row",
    gap: 5,
  },

  futureHudDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#38D9FF",
    opacity: 0.6,
  },

  // ==========================================================
  // FUTURE — AMBIENT LIGHT
  // ==========================================================

  futureAmbientCyan: {
    position: "absolute",
    width: 320,
    height: 180,
    borderRadius: 160,
    bottom: -100,
    left: -140,
    backgroundColor: "#00D9FF",
    opacity: 0.045,
  },

  futureAmbientPurple: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    top: 330,
    right: -210,
    backgroundColor: "#8A6CFF",
    opacity: 0.04,
  },
});