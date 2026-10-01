import { router } from "expo-router";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppText from "../components/AppText";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

type WorldLocationProps = {
  icon: string;
  name: string;
  subtitle: string;
  requiredLevel: number;
  playerLevel: number;
  positionStyle?: object;
  onPress?: () => void;
};

export default function BuddyWorldScreen() {
  const { level, buddy } = useApp();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor:
              theme.colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor:
                theme.colors.card,
              borderColor:
                theme.colors.border,
            },
            pressed && styles.pressed,
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

        <View style={styles.headerText}>
          <AppText
            variant="caption"
            style={{
              color:
                theme.colors.primary,
            }}
          >
            ADVENTURE
          </AppText>

          <AppText variant="title">
            World
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

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        {/* INTRO */}
        <View style={styles.intro}>
          <AppText
            variant="caption"
            style={{
              color:
                theme.colors.muted,
            }}
          >
            THE WILD LANDS
          </AppText>

          <AppText variant="label">
            Choose your destination
          </AppText>

          <AppText variant="secondary">
            Real-life progress opens new
            places for{" "}
            {buddy?.name ?? "your Buddy"}{" "}
            to explore.
          </AppText>
        </View>

        {/* WORLD MAP */}
        <View
          style={[
            styles.map,
            {
              backgroundColor:
                theme.colors.card,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          {/* DECORATION */}
          <AppText
            style={[
              styles.mapDecoration,
              styles.treeOne,
            ]}
          >
            🌲
          </AppText>

          <AppText
            style={[
              styles.mapDecoration,
              styles.treeTwo,
            ]}
          >
            🌲
          </AppText>

          <AppText
            style={[
              styles.mapDecoration,
              styles.treeThree,
            ]}
          >
            🌳
          </AppText>

          <AppText
            style={[
              styles.mapDecoration,
              styles.mountainOne,
            ]}
          >
            ⛰️
          </AppText>

          <AppText
            style={[
              styles.mapDecoration,
              styles.waterOne,
            ]}
          >
            💧
          </AppText>

          {/* MAP PATHS */}
          <View
            style={[
              styles.path,
              styles.pathLeft,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          <View
            style={[
              styles.path,
              styles.pathRight,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          <View
            style={[
              styles.path,
              styles.pathBottom,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          <View
            style={[
              styles.path,
              styles.pathTop,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          {/* LOCATIONS */}
          <WorldLocation
            icon="⛰️"
            name="Mountain Pass"
            subtitle="Frozen heights"
            requiredLevel={10}
            playerLevel={level}
            positionStyle={
              styles.mountainLocation
            }
          />

          <WorldLocation
            icon="🌲"
            name="Whispering Woods"
            subtitle="Forest creatures"
            requiredLevel={1}
            playerLevel={level}
            positionStyle={
              styles.woodsLocation
            }
            onPress={() =>
              router.push(
                "/whispering-woods",
              )
            }
          />

          <WorldLocation
            icon="🏕️"
            name="Forest Home"
            subtitle="Your safe place"
            requiredLevel={1}
            playerLevel={level}
            positionStyle={
              styles.homeLocation
            }
            onPress={() =>
              router.push(
                "/buddy-home",
              )
            }
          />

          <WorldLocation
            icon="🌊"
            name="River Trail"
            subtitle="Follow the water"
            requiredLevel={4}
            playerLevel={level}
            positionStyle={
              styles.riverLocation
            }
          />

          <WorldLocation
            icon="🏛️"
            name="Old Ruins"
            subtitle="Something sleeps below"
            requiredLevel={6}
            playerLevel={level}
            positionStyle={
              styles.ruinsLocation
            }
          />
        </View>

        {/* FIRST AREA */}
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
              AVAILABLE AREA
            </AppText>

            <AppText variant="label">
              Whispering Woods
            </AppText>
          </View>

          <AppText
            variant="caption"
            style={{
              color:
                theme.colors.muted,
            }}
          >
            LV 1+
          </AppText>
        </View>

        <Pressable
          onPress={() =>
            router.push(
              "/whispering-woods",
            )
          }
          style={({ pressed }) => [
            styles.areaCard,
            {
              borderColor:
                theme.colors.border,
            },
            pressed &&
              styles.areaPressed,
          ]}
        >
          <ImageBackground
            source={require(
              "../../assets/game/backgrounds/whispering-woods.png"
            )}
            resizeMode="cover"
            style={styles.areaImage}
            imageStyle={
              styles.areaImageStyle
            }
          >
            <View
              style={
                styles.areaShade
              }
            />

            <View
              style={styles.areaTop}
            >
              <View
                style={
                  styles.availableBadge
                }
              >
                <AppText
                  variant="caption"
                  style={
                    styles.availableText
                  }
                >
                  EXPLORE
                </AppText>
              </View>

              <AppText
                style={
                  styles.areaArrow
                }
              >
                →
              </AppText>
            </View>

            <View
              style={
                styles.areaBottom
              }
            >
              <AppText
                style={
                  styles.areaTitle
                }
              >
                Whispering Woods
              </AppText>

              <AppText
                style={
                  styles.areaDescription
                }
              >
                Moss-covered paths,
                strange creatures and an
                ancient guardian.
              </AppText>

              <View
                style={
                  styles.enemyRow
                }
              >
                <View
                  style={
                    styles.enemyBadge
                  }
                >
                  <AppText
                    style={
                      styles.enemyEmoji
                    }
                  >
                    🌿
                  </AppText>

                  <AppText
                    variant="caption"
                    style={
                      styles.enemyText
                    }
                  >
                    MOSSLING
                  </AppText>
                </View>

                <View
                  style={
                    styles.enemyBadge
                  }
                >
                  <AppText
                    style={
                      styles.enemyEmoji
                    }
                  >
                    🍄
                  </AppText>

                  <AppText
                    variant="caption"
                    style={
                      styles.enemyText
                    }
                  >
                    SPORECAP
                  </AppText>
                </View>

                <View
                  style={
                    styles.enemyBadge
                  }
                >
                  <AppText
                    style={
                      styles.enemyEmoji
                    }
                  >
                    🌳
                  </AppText>

                  <AppText
                    variant="caption"
                    style={
                      styles.enemyText
                    }
                  >
                    GUARDIAN
                  </AppText>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        {/* WORLD RULE */}
        <View
          style={[
            styles.ruleCard,
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
              styles.ruleIcon
            }
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
              variant="caption"
              style={{
                color:
                  theme.colors.primary,
              }}
            >
              WORLD PROGRESSION
            </AppText>

            <AppText variant="label">
              Life unlocks the world.
            </AppText>

            <AppText variant="secondary">
              Level up through real-life
              activity to reach new
              areas. Exploring the game
              does not generate permanent
              Player XP.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function WorldLocation({
  icon,
  name,
  subtitle,
  requiredLevel,
  playerLevel,
  positionStyle,
  onPress,
}: WorldLocationProps) {
  const { theme } = useTheme();

  const unlocked =
    playerLevel >= requiredLevel;

  return (
    <Pressable
      disabled={!unlocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.location,
        positionStyle,
        {
          backgroundColor: unlocked
            ? theme.colors.cardAlt
            : theme.colors.background,

          borderColor: unlocked
            ? theme.colors.primary
            : theme.colors.border,
        },
        pressed &&
          unlocked &&
          styles.locationPressed,
      ]}
    >
      <View
        style={[
          styles.locationIcon,
          !unlocked &&
            styles.lockedLocation,
        ]}
      >
        <AppText
          style={
            styles.locationEmoji
          }
        >
          {unlocked
            ? icon
            : "🔒"}
        </AppText>
      </View>

      <AppText
        variant="caption"
        numberOfLines={1}
        style={{
          color: unlocked
            ? theme.colors.text
            : theme.colors.muted,
        }}
      >
        {name}
      </AppText>

      <AppText
        variant="caption"
        numberOfLines={1}
        style={{
          color:
            theme.colors.muted,
          fontSize: 9,
        }}
      >
        {unlocked
          ? subtitle
          : `LV ${requiredLevel}`}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 14,

    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    borderBottomWidth: 1,
  },

  backButton: {
    minHeight: 38,

    paddingHorizontal: 12,

    borderRadius: 10,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    gap: 1,
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

  scrollContent: {
    padding: 18,
    paddingBottom: 100,

    gap: 18,
  },

  intro: {
    gap: 5,
  },

  /*
   * MAP
   */

  map: {
    height: 470,

    position: "relative",

    borderRadius: 22,
    borderWidth: 1,

    overflow: "hidden",
  },

  mapDecoration: {
    position: "absolute",

    opacity: 0.18,

    fontSize: 46,
  },

  treeOne: {
    top: 35,
    left: 20,
  },

  treeTwo: {
    bottom: 30,
    right: 20,
  },

  treeThree: {
    top: 180,
    right: 18,
  },

  mountainOne: {
    top: 15,
    right: 65,
  },

  waterOne: {
    bottom: 120,
    right: 55,
  },

  path: {
    position: "absolute",

    opacity: 0.8,

    height: 3,

    borderRadius: 20,
  },

  pathLeft: {
    width: 90,

    left: 98,
    top: 225,

    transform: [
      {
        rotate: "-5deg",
      },
    ],
  },

  pathRight: {
    width: 92,

    right: 94,
    top: 225,

    transform: [
      {
        rotate: "5deg",
      },
    ],
  },

  pathBottom: {
    width: 110,

    left: 150,
    top: 325,

    transform: [
      {
        rotate: "90deg",
      },
    ],
  },

  pathTop: {
    width: 100,

    left: 150,
    top: 130,

    transform: [
      {
        rotate: "90deg",
      },
    ],
  },

  location: {
    position: "absolute",

    width: 118,
    minHeight: 82,

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 8,
    paddingVertical: 8,

    alignItems: "center",
    justifyContent: "center",

    gap: 2,

    zIndex: 10,
  },

  homeLocation: {
    left: "50%",
    top: 190,

    marginLeft: -59,
  },

  woodsLocation: {
    left: 16,
    top: 190,
  },

  riverLocation: {
    right: 16,
    top: 190,
  },

  mountainLocation: {
    left: "50%",
    top: 28,

    marginLeft: -59,
  },

  ruinsLocation: {
    left: "50%",
    bottom: 25,

    marginLeft: -59,
  },

  locationIcon: {
    height: 31,

    alignItems: "center",
    justifyContent: "center",
  },

  locationEmoji: {
    fontSize: 24,
  },

  lockedLocation: {
    opacity: 0.65,
  },

  locationPressed: {
    opacity: 0.72,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  /*
   * AREA PREVIEW
   */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  areaCard: {
    height: 265,

    borderRadius: 20,
    borderWidth: 1,

    overflow: "hidden",
  },

  areaPressed: {
    opacity: 0.84,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  areaImage: {
    flex: 1,

    padding: 16,

    justifyContent:
      "space-between",
  },

  areaImageStyle: {
    borderRadius: 19,
  },

  /*
   * FIXED:
   *
   * Explicit absolute positioning is
   * used instead of
   * StyleSheet.absoluteFillObject.
   */
  areaShade: {
    position: "absolute",

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor:
      "rgba(5,10,7,0.24)",
  },

  areaTop: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  availableBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 9,

    backgroundColor:
      "rgba(8,15,10,0.72)",
  },

  availableText: {
    color: "#FFFFFF",

    letterSpacing: 1,
  },

  areaArrow: {
    color: "#FFFFFF",

    fontSize: 26,

    textShadowColor:
      "rgba(0,0,0,0.8)",

    textShadowRadius: 5,
  },

  areaBottom: {
    gap: 7,
  },

  areaTitle: {
    color: "#FFFFFF",

    fontSize: 25,
    lineHeight: 29,

    fontWeight: "900",

    textShadowColor:
      "rgba(0,0,0,0.8)",

    textShadowRadius: 6,

    textShadowOffset: {
      width: 0,
      height: 1,
    },
  },

  areaDescription: {
    color:
      "rgba(255,255,255,0.88)",

    fontSize: 13,
    lineHeight: 18,

    maxWidth: 300,

    textShadowColor:
      "rgba(0,0,0,0.9)",

    textShadowRadius: 5,
  },

  enemyRow: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 6,

    marginTop: 4,
  },

  enemyBadge: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,

    paddingHorizontal: 7,
    paddingVertical: 5,

    borderRadius: 8,

    backgroundColor:
      "rgba(5,10,7,0.72)",
  },

  enemyEmoji: {
    fontSize: 12,
  },

  enemyText: {
    color:
      "rgba(255,255,255,0.9)",

    fontSize: 9,
  },

  /*
   * RULE
   */

  ruleCard: {
    borderRadius: 16,
    borderWidth: 1,

    padding: 14,

    flexDirection: "row",

    gap: 12,
  },

  ruleIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor:
      "rgba(209,170,75,0.12)",

    alignItems: "center",
    justifyContent: "center",
  },

  ruleEmoji: {
    fontSize: 20,
  },

  ruleText: {
    flex: 1,
    gap: 3,
  },

  pressed: {
    opacity: 0.7,
  },
});