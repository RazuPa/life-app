import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useMemo, useRef, useState } from "react";

import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import ProgressBar from "../components/ProgressBar";

import {
  BuddySpecies,
  InventoryItem,
  InventoryItemType,
  useApp,
} from "../context/AppContext";

import { useTheme } from "../context/ThemeContext";

// ============================================================
// TYPES
// ============================================================

type EnemyType =
  | "mossling"
  | "sporecap";

type BattleState =
  | "playing"
  | "victory"
  | "defeat";

type BattleMessage = {
  title: string;
  text: string;
};

type EnemyData = {
  type: EnemyType;
  name: string;
  level: number;
  maxHP: number;
  attack: number;
  defense: number;
  icon: string;
  description: string;
};

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

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

// ============================================================
// SCREEN
// ============================================================

export default function BattleScreen() {
  const params =
    useLocalSearchParams<{
      enemy?: string;
    }>();

  const {
    buddy,
    level,
    buddyLifeStats,

    inventory,
    useInventoryItem,

    defeatWhisperingWoodsEnemy,
    rewardWhisperingWoodsEnemyLoot,
  } = useApp();

  const { theme } =
    useTheme();

  // ==========================================================
  // ENEMY
  // ==========================================================

  const enemyType: EnemyType =
    params.enemy === "sporecap"
      ? "sporecap"
      : "mossling";

  const enemy =
    useMemo<EnemyData>(() => {
      if (
        enemyType ===
        "sporecap"
      ) {
        const enemyLevel =
          Math.max(
            2,
            Math.min(
              level,
              8
            )
          );

        return {
          type:
            "sporecap",

          name:
            "Sporecap",

          level:
            enemyLevel,

          maxHP:
            45 +
            enemyLevel * 5,

          attack:
            6 +
            Math.floor(
              enemyLevel / 2
            ),

          defense:
            3,

          icon:
            "🍄",

          description:
            "A strange forest creature surrounded by shimmering spores.",
        };
      }

      const enemyLevel =
        Math.max(
          1,
          Math.min(
            level,
            6
          )
        );

      return {
        type:
          "mossling",

        name:
          "Mossling",

        level:
          enemyLevel,

        maxHP:
          38 +
          enemyLevel * 4,

        attack:
          5 +
          Math.floor(
            enemyLevel / 2
          ),

        defense:
          2,

        icon:
          "🌿",

        description:
          "A small forest spirit that hides among moss-covered roots.",
      };
    }, [
      enemyType,
      level,
    ]);

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

  const vitality =
    buddyLifeStats.vitality;

  const power =
    buddyLifeStats.power;

  const agility =
    buddyLifeStats.agility;

  const intelligence =
    buddyLifeStats.intelligence;

  const magic =
    buddy?.magic ?? 0;

  const defense =
    buddy?.defense ?? 0;

  const luck =
    buddy?.luck ?? 0;

  // ==========================================================
  // COMBAT VALUES
  // ==========================================================

  const buddyMaxHP =
    60 +
    vitality * 8 +
    level * 2;

  const physicalAttack =
    7 +
    power * 2 +
    Math.floor(
      agility * 0.25
    );

  const skillPower =
    8 +
    intelligence +
    magic * 2;

  const damageReduction =
    Math.floor(
      defense * 0.7
    );

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    buddyHP,
    setBuddyHP,
  ] =
    useState(
      buddyMaxHP
    );

  const [
    enemyHP,
    setEnemyHP,
  ] =
    useState(
      enemy.maxHP
    );

  const [
    battleState,
    setBattleState,
  ] =
    useState<BattleState>(
      "playing"
    );

  const [
    guarding,
    setGuarding,
  ] =
    useState(false);

  const [
    turn,
    setTurn,
  ] =
    useState(1);

  const [
    inventoryOpen,
    setInventoryOpen,
  ] =
    useState(false);

  const [
    lootReward,
    setLootReward,
  ] =
    useState<InventoryItem | null>(
      null
    );

  const [
    message,
    setMessage,
  ] =
    useState<BattleMessage>({
      title:
        "BATTLE START",

      text:
        `${enemy.name} blocks the path!`,
    });

  const victoryRegistered =
    useRef(false);

  // ==========================================================
  // HP PROGRESS
  // ==========================================================

  const buddyHPProgress =
    buddyMaxHP > 0
      ? buddyHP /
        buddyMaxHP
      : 0;

  const enemyHPProgress =
    enemy.maxHP > 0
      ? enemyHP /
        enemy.maxHP
      : 0;

  // ==========================================================
  // REGISTER VICTORY
  // ==========================================================

  function registerVictory() {
    if (
      victoryRegistered.current
    ) {
      return null;
    }

    victoryRegistered.current =
      true;

    defeatWhisperingWoodsEnemy(
      enemy.type
    );

    const reward =
      rewardWhisperingWoodsEnemyLoot(
        enemy.type
      );

    setLootReward(
      reward
    );

    return reward;
  }

  // ==========================================================
  // CRITICAL
  // ==========================================================

  function rollCritical() {
    const critChance =
      Math.min(
        0.08 +
          luck * 0.012,
        0.35
      );

    return (
      Math.random() <
      critChance
    );
  }

  // ==========================================================
  // ENEMY DAMAGE
  // ==========================================================

  function calculateEnemyDamage(
    isGuarding: boolean
  ) {
    let incomingDamage =
      enemy.attack -
      damageReduction;

    incomingDamage =
      Math.max(
        1,
        incomingDamage
      );

    if (
      isGuarding
    ) {
      incomingDamage =
        Math.max(
          1,
          Math.floor(
            incomingDamage *
              0.4
          )
        );
    }

    return incomingDamage;
  }

  // ==========================================================
  // ENEMY TURN
  // ==========================================================

  function enemyTurn(
    currentBuddyHP: number,
    isGuarding: boolean,
    playerActionText?: string
  ) {
    const incomingDamage =
      calculateEnemyDamage(
        isGuarding
      );

    const nextBuddyHP =
      clamp(
        currentBuddyHP -
          incomingDamage,
        0,
        buddyMaxHP
      );

    setBuddyHP(
      nextBuddyHP
    );

    setGuarding(false);

    if (
      nextBuddyHP <= 0
    ) {
      setBattleState(
        "defeat"
      );

      setInventoryOpen(
        false
      );

      setMessage({
        title:
          "DEFEAT",

        text:
          playerActionText
            ? `${playerActionText} ${enemy.name} attacks for ${incomingDamage} damage. ${buddyName} needs to retreat.`
            : `${enemy.name} attacks for ${incomingDamage} damage. ${buddyName} needs to retreat.`,
      });

      return;
    }

    setTurn(
      current =>
        current + 1
    );

    if (
      isGuarding
    ) {
      setMessage({
        title:
          "GUARD",

        text:
          `${buddyName} guards and reduces ${enemy.name}'s attack to ${incomingDamage} damage.`,
      });

      return;
    }

    setMessage({
      title:
        `${enemy.name.toUpperCase()} ATTACKS`,

      text:
        playerActionText
          ? `${playerActionText} ${enemy.name} strikes back for ${incomingDamage} damage.`
          : `${buddyName} takes ${incomingDamage} damage.`,
    });
  }

  // ==========================================================
  // ATTACK
  // ==========================================================

  function attack() {
    if (
      battleState !==
      "playing"
    ) {
      return;
    }

    setInventoryOpen(
      false
    );

    const critical =
      rollCritical();

    const randomBonus =
      Math.floor(
        Math.random() * 4
      );

    let damage =
      physicalAttack +
      randomBonus -
      enemy.defense;

    damage =
      Math.max(
        1,
        damage
      );

    if (
      critical
    ) {
      damage =
        Math.floor(
          damage * 1.7
        );
    }

    const nextEnemyHP =
      clamp(
        enemyHP -
          damage,
        0,
        enemy.maxHP
      );

    setEnemyHP(
      nextEnemyHP
    );

    if (
      nextEnemyHP <= 0
    ) {
      registerVictory();

      setBattleState(
        "victory"
      );

      setInventoryOpen(
        false
      );

      setMessage({
        title:
          "VICTORY",

        text:
          critical
            ? `${buddyName} lands a critical hit for ${damage} damage and defeats ${enemy.name}!`
            : `${buddyName} deals ${damage} damage and defeats ${enemy.name}!`,
      });

      return;
    }

    const attackText =
      critical
        ? `${buddyName} lands a critical hit for ${damage} damage!`
        : `${buddyName} deals ${damage} damage.`;

    enemyTurn(
      buddyHP,
      false,
      attackText
    );
  }

  // ==========================================================
  // SKILL
  // ==========================================================

  function useSkill() {
    if (
      battleState !==
      "playing"
    ) {
      return;
    }

    setInventoryOpen(
      false
    );

    const critical =
      rollCritical();

    const randomBonus =
      Math.floor(
        Math.random() * 5
      );

    let damage =
      skillPower +
      randomBonus -
      Math.floor(
        enemy.defense *
          0.5
      );

    damage =
      Math.max(
        2,
        damage
      );

    if (
      critical
    ) {
      damage =
        Math.floor(
          damage * 1.5
        );
    }

    const nextEnemyHP =
      clamp(
        enemyHP -
          damage,
        0,
        enemy.maxHP
      );

    setEnemyHP(
      nextEnemyHP
    );

    if (
      nextEnemyHP <= 0
    ) {
      registerVictory();

      setBattleState(
        "victory"
      );

      setInventoryOpen(
        false
      );

      setMessage({
        title:
          "VICTORY",

        text:
          critical
            ? `${buddyName}'s skill critically hits for ${damage} damage and defeats ${enemy.name}!`
            : `${buddyName}'s skill deals ${damage} damage and defeats ${enemy.name}!`,
      });

      return;
    }

    const skillText =
      critical
        ? `${buddyName}'s skill critically hits for ${damage} damage!`
        : `${buddyName}'s skill deals ${damage} damage.`;

    enemyTurn(
      buddyHP,
      false,
      skillText
    );
  }

  // ==========================================================
  // GUARD
  // ==========================================================

  function guard() {
    if (
      battleState !==
      "playing"
    ) {
      return;
    }

    setInventoryOpen(
      false
    );

    setGuarding(true);

    enemyTurn(
      buddyHP,
      true
    );
  }

  // ==========================================================
  // INVENTORY
  // ==========================================================

  function toggleInventory() {
    if (
      battleState !==
      "playing"
    ) {
      return;
    }

    if (
      inventory.length === 0
    ) {
      setMessage({
        title:
          "EMPTY INVENTORY",

        text:
          "You do not have any items yet. Search caches in the Whispering Woods to find loot.",
      });

      return;
    }

    const nextOpen =
      !inventoryOpen;

    setInventoryOpen(
      nextOpen
    );

    if (
      nextOpen
    ) {
      setMessage({
        title:
          "INVENTORY",

        text:
          "Choose an item to use.",
      });
    }
  }

  // ==========================================================
  // USE ITEM
  // ==========================================================

  function handleUseItem(
    item: InventoryItem
  ) {
    if (
      battleState !==
      "playing"
    ) {
      return;
    }

    let healAmount =
      0;

    switch (
      item.type
    ) {
      case "forest-berry":
        healAmount =
          15;
        break;

      case "healing-herb":
        healAmount =
          30;
        break;

      case "glowcap":
        healAmount =
          10;
        break;

      case "forest-crystal":
        setMessage({
          title:
            "CAN'T USE",

          text:
            "The Forest Crystal cannot be used in battle yet.",
        });

        return;
    }

    if (
      buddyHP >=
      buddyMaxHP
    ) {
      setMessage({
        title:
          "HP FULL",

        text:
          `${buddyName} already has full HP.`,
      });

      return;
    }

    const used =
      useInventoryItem(
        item.type
      );

    if (
      !used
    ) {
      setMessage({
        title:
          "ITEM UNAVAILABLE",

        text:
          `You no longer have any ${item.name}.`,
      });

      return;
    }

    const actualHeal =
      Math.min(
        healAmount,
        buddyMaxHP -
          buddyHP
      );

    const healedHP =
      clamp(
        buddyHP +
          healAmount,
        0,
        buddyMaxHP
      );

    setBuddyHP(
      healedHP
    );

    setInventoryOpen(
      false
    );

    const itemText =
      `${buddyName} uses ${item.name} and restores ${actualHeal} HP!`;

    enemyTurn(
      healedHP,
      false,
      itemText
    );
  }

  // ==========================================================
  // ITEM EFFECT
  // ==========================================================

  function getItemEffect(
    type: InventoryItemType
  ) {
    switch (
      type
    ) {
      case "forest-berry":
        return "Restore 15 HP";

      case "healing-herb":
        return "Restore 30 HP";

      case "glowcap":
        return "Restore 10 HP";

      case "forest-crystal":
        return "Cannot use in battle";
    }
  }

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function leaveBattle() {
    router.replace(
      "/whispering-woods"
    );
  }

  // ==========================================================
  // ENEMY IMAGE
  // ==========================================================

  function renderEnemy() {
    if (
      enemy.type ===
      "sporecap"
    ) {
      return (
        <Image
          source={require(
            "../../assets/game/enemies/sporecap.png"
          )}
          resizeMode="contain"
          style={
            styles.sporecapImage
          }
        />
      );
    }

    return (
      <Image
        source={require(
          "../../assets/game/enemies/mossling.png"
        )}
        resizeMode="contain"
        style={
          styles.mosslingImage
        }
      />
    );
  }

  // ==========================================================
  // TOTAL ITEMS
  // ==========================================================

  const totalInventoryItems =
    inventory.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.quantity,
      0
    );

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
      <View
        style={
          styles.background
        }
      >
        {/* ================================================== */}
        {/* BACKGROUND IMAGE */}
        {/* ================================================== */}

        <View
          pointerEvents="none"
          style={
            styles.backgroundImageContainer
          }
        >
          <Image
            source={require(
              "../../assets/game/backgrounds/whispering-woods.png"
            )}
            resizeMode="cover"
            style={
              styles.backgroundImage
            }
          />
        </View>

        <View
          pointerEvents="none"
          style={
            styles.backgroundShade
          }
        />

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <View
          style={
            styles.header
          }
        >
          <Pressable
            onPress={
              leaveBattle
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
              WHISPERING WOODS
            </AppText>

            <AppText
              variant="title"
              style={
                styles.headerTitle
              }
            >
              Battle
            </AppText>
          </View>

          <View
            style={[
              styles.turnBadge,

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
            >
              TURN
            </AppText>

            <AppText
              style={[
                styles.turnNumber,

                {
                  color:
                    theme.colors.xp,
                },
              ]}
            >
              {turn}
            </AppText>
          </View>
        </View>

        {/* ================================================== */}
        {/* BATTLEFIELD */}
        {/* ================================================== */}

        <View
          style={
            styles.battlefield
          }
        >
          {/* ENEMY */}

          <View
            style={
              styles.enemySide
            }
          >
            <View
              style={[
                styles.enemyInfo,

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
                  styles.nameRow
                }
              >
                <View>
                  <AppText
                    variant="label"
                    style={{
                      color:
                        theme.colors.xp,
                    }}
                  >
                    WILD CREATURE
                  </AppText>

                  <AppText
                    variant="title"
                    style={
                      styles.combatantName
                    }
                  >
                    {enemy.name}
                  </AppText>
                </View>

                <AppText
                  variant="label"
                >
                  LV {enemy.level}
                </AppText>
              </View>

              <View
                style={
                  styles.hpLabelRow
                }
              >
                <AppText
                  variant="label"
                >
                  HP
                </AppText>

                <AppText
                  variant="label"
                >
                  {enemyHP}
                  {" / "}
                  {enemy.maxHP}
                </AppText>
              </View>

              <ProgressBar
                progress={
                  enemyHPProgress
                }
              />
            </View>

            <View
              style={
                styles.enemyVisual
              }
            >
              <View
                style={
                  styles.enemyShadow
                }
              />

              {renderEnemy()}
            </View>
          </View>

          {/* BUDDY */}

          <View
            style={
              styles.buddySide
            }
          >
            <View
              style={
                styles.buddyVisual
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
            </View>

            <View
              style={[
                styles.buddyInfo,

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
                  styles.nameRow
                }
              >
                <View>
                  <AppText
                    variant="label"
                    style={{
                      color:
                        theme.colors.xp,
                    }}
                  >
                    YOUR BUDDY
                  </AppText>

                  <AppText
                    variant="title"
                    style={
                      styles.combatantName
                    }
                  >
                    {buddyName}
                  </AppText>
                </View>

                <AppText
                  variant="label"
                >
                  LV {level}
                </AppText>
              </View>

              <View
                style={
                  styles.hpLabelRow
                }
              >
                <AppText
                  variant="label"
                >
                  HP
                </AppText>

                <AppText
                  variant="label"
                >
                  {buddyHP}
                  {" / "}
                  {buddyMaxHP}
                </AppText>
              </View>

              <ProgressBar
                progress={
                  buddyHPProgress
                }
              />
            </View>
          </View>
        </View>

        {/* ================================================== */}
        {/* BOTTOM HUD */}
        {/* ================================================== */}

        <View
          style={
            styles.bottomHUD
          }
        >
          {/* MESSAGE */}

          <View
            style={[
              styles.messageBox,

              {
                backgroundColor:
                  theme.colors.card,

                borderColor:
                  battleState ===
                  "victory"
                    ? theme.colors.xp
                    : theme.colors.border,
              },
            ]}
          >
            <View
              style={
                styles.messageTitleRow
              }
            >
              <AppText
                variant="label"
                style={{
                  color:
                    battleState ===
                    "victory"
                      ? theme.colors.xp
                      : theme.colors
                          .textSecondary,
                }}
              >
                {message.title}
              </AppText>

              {guarding && (
                <AppText
                  variant="label"
                  style={{
                    color:
                      theme.colors.xp,
                  }}
                >
                  🛡 GUARDING
                </AppText>
              )}
            </View>

            <AppText
              variant="body"
              style={
                styles.messageText
              }
            >
              {message.text}
            </AppText>
          </View>

          {/* ================================================= */}
          {/* INVENTORY */}
          {/* ================================================= */}

          {battleState ===
            "playing" &&
            inventoryOpen && (
              <View
                style={[
                  styles.inventoryPanel,

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
                    styles.inventoryHeader
                  }
                >
                  <View>
                    <AppText
                      variant="label"
                      style={{
                        color:
                          theme.colors.xp,
                      }}
                    >
                      BATTLE BAG
                    </AppText>

                    <AppText
                      variant="title"
                      style={
                        styles.inventoryTitle
                      }
                    >
                      Inventory
                    </AppText>
                  </View>

                  <Pressable
                    onPress={() =>
                      setInventoryOpen(
                        false
                      )
                    }
                    style={({
                      pressed,
                    }) => [
                      styles.inventoryClose,

                      {
                        borderColor:
                          theme.colors.border,
                      },

                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <AppText>
                      ✕
                    </AppText>
                  </Pressable>
                </View>

                <View
                  style={
                    styles.inventoryList
                  }
                >
                  {inventory.map(
                    item => {
                      const usable =
                        item.type !==
                        "forest-crystal";

                      return (
                        <Pressable
                          key={
                            item.type
                          }
                          disabled={
                            !usable
                          }
                          onPress={() =>
                            handleUseItem(
                              item
                            )
                          }
                          style={({
                            pressed,
                          }) => [
                            styles.inventoryItem,

                            {
                              borderColor:
                                theme
                                  .colors
                                  .border,
                            },

                            !usable &&
                              styles.inventoryItemDisabled,

                            pressed &&
                              usable &&
                              styles.pressed,
                          ]}
                        >
                          <View
                            style={
                              styles.inventoryItemIconBox
                            }
                          >
                            <AppText
                              style={
                                styles.inventoryItemIcon
                              }
                            >
                              {item.icon}
                            </AppText>
                          </View>

                          <View
                            style={
                              styles.inventoryItemInfo
                            }
                          >
                            <View
                              style={
                                styles.inventoryItemNameRow
                              }
                            >
                              <AppText
                                style={
                                  styles.inventoryItemName
                                }
                              >
                                {item.name}
                              </AppText>

                              <View
                                style={[
                                  styles.quantityBadge,

                                  {
                                    backgroundColor:
                                      theme
                                        .colors
                                        .xp,
                                  },
                                ]}
                              >
                                <AppText
                                  style={[
                                    styles.quantityText,

                                    {
                                      color:
                                        theme
                                          .colors
                                          .background,
                                    },
                                  ]}
                                >
                                  x
                                  {
                                    item.quantity
                                  }
                                </AppText>
                              </View>
                            </View>

                            <AppText
                              variant="label"
                              style={{
                                color:
                                  usable
                                    ? theme
                                        .colors
                                        .xp
                                    : theme
                                        .colors
                                        .textSecondary,
                              }}
                            >
                              {getItemEffect(
                                item.type
                              )}
                            </AppText>
                          </View>

                          <AppText
                            style={
                              styles.inventoryArrow
                            }
                          >
                            {usable
                              ? "›"
                              : "🔒"}
                          </AppText>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </View>
            )}

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          {battleState ===
            "playing" &&
            !inventoryOpen && (
              <View
                style={
                  styles.actionsGrid
                }
              >
                <BattleButton
                  icon="⚔️"
                  title="ATTACK"
                  subtitle="POW"
                  onPress={
                    attack
                  }
                />

                <BattleButton
                  icon="✨"
                  title="SKILL"
                  subtitle="INT + MAG"
                  onPress={
                    useSkill
                  }
                />

                <BattleButton
                  icon="🛡️"
                  title="GUARD"
                  subtitle="DEF"
                  onPress={
                    guard
                  }
                />

                <BattleButton
                  icon="🎒"
                  title="ITEM"
                  subtitle={
                    totalInventoryItems >
                    0
                      ? `${totalInventoryItems} items`
                      : "Empty"
                  }
                  onPress={
                    toggleInventory
                  }
                />
              </View>
            )}

          {/* ================================================= */}
          {/* VICTORY */}
          {/* ================================================= */}

          {battleState ===
            "victory" && (
              <View
                style={[
                  styles.resultCard,

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
                    styles.resultHeader
                  }
                >
                  <View
                    style={[
                      styles.resultIconBox,

                      {
                        borderColor:
                          theme.colors.xp,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.resultIcon
                      }
                    >
                      ✨
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.resultText
                    }
                  >
                    <AppText
                      variant="label"
                      style={{
                        color:
                          theme.colors.xp,
                      }}
                    >
                      BATTLE COMPLETE
                    </AppText>

                    <AppText
                      variant="title"
                      style={
                        styles.resultTitle
                      }
                    >
                      Victory!
                    </AppText>

                    <AppText
                      variant="body"
                      style={{
                        color:
                          theme.colors
                            .textSecondary,
                      }}
                    >
                      {enemy.name} has been defeated.
                    </AppText>
                  </View>
                </View>

                <View
                  style={[
                    styles.victorySummary,

                    {
                      borderColor:
                        theme.colors.border,
                    },
                  ]}
                >
                  <View
                    style={
                      styles.victorySummaryRow
                    }
                  >
                    <AppText
                      variant="label"
                    >
                      ENEMY
                    </AppText>

                    <AppText
                      style={
                        styles.victorySummaryValue
                      }
                    >
                      {enemy.icon}{" "}
                      {enemy.name}
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.victoryDivider
                    }
                  />

                  <View
                    style={
                      styles.victorySummaryRow
                    }
                  >
                    <AppText
                      variant="label"
                    >
                      TURNS
                    </AppText>

                    <AppText
                      style={
                        styles.victorySummaryValue
                      }
                    >
                      {turn}
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.victoryDivider
                    }
                  />

                  <View
                    style={
                      styles.victorySummaryRow
                    }
                  >
                    <AppText
                      variant="label"
                    >
                      PLAYER XP
                    </AppText>

                    <AppText
                      style={{
                        fontWeight:
                          "900",

                        color:
                          theme.colors
                            .textSecondary,
                      }}
                    >
                      +0
                    </AppText>
                  </View>

                  {lootReward && (
                    <>
                      <View
                        style={
                          styles.victoryDivider
                        }
                      />

                      <View
                        style={
                          styles.victorySummaryRow
                        }
                      >
                        <AppText
                          variant="label"
                        >
                          LOOT
                        </AppText>

                        <View
                          style={
                            styles.lootValue
                          }
                        >
                          <AppText
                            style={
                              styles.lootIcon
                            }
                          >
                            {
                              lootReward.icon
                            }
                          </AppText>

                          <AppText
                            style={[
                              styles.victorySummaryValue,

                              {
                                color:
                                  theme
                                    .colors
                                    .xp,
                              },
                            ]}
                          >
                            {
                              lootReward.name
                            }
                          </AppText>
                        </View>
                      </View>
                    </>
                  )}
                </View>

                {lootReward && (
                  <View
                    style={[
                      styles.lootCard,

                      {
                        borderColor:
                          theme.colors
                            .border,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.lootCardIcon
                      }
                    >
                      {lootReward.icon}
                    </AppText>

                    <View
                      style={
                        styles.lootCardText
                      }
                    >
                      <AppText
                        variant="label"
                        style={{
                          color:
                            theme.colors
                              .xp,
                        }}
                      >
                        ITEM FOUND
                      </AppText>

                      <AppText
                        style={
                          styles.lootCardName
                        }
                      >
                        {
                          lootReward.name
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
                          lootReward.description
                        }
                      </AppText>
                    </View>
                  </View>
                )}

                <Pressable
                  onPress={
                    leaveBattle
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.resultButton,

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
                      styles.resultButtonText,

                      {
                        color:
                          theme.colors
                            .background,
                      },
                    ]}
                  >
                    🌲 RETURN TO WHISPERING WOODS
                  </AppText>
                </Pressable>
              </View>
            )}

          {/* ================================================= */}
          {/* DEFEAT */}
          {/* ================================================= */}

          {battleState ===
            "defeat" && (
              <View
                style={[
                  styles.resultCard,

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
                    styles.resultHeader
                  }
                >
                  <View
                    style={[
                      styles.resultIconBox,

                      {
                        borderColor:
                          theme.colors.border,
                      },
                    ]}
                  >
                    <AppText
                      style={
                        styles.resultIcon
                      }
                    >
                      🌙
                    </AppText>
                  </View>

                  <View
                    style={
                      styles.resultText
                    }
                  >
                    <AppText
                      variant="label"
                      style={{
                        color:
                          theme.colors
                            .textSecondary,
                      }}
                    >
                      BATTLE ENDED
                    </AppText>

                    <AppText
                      variant="title"
                      style={
                        styles.resultTitle
                      }
                    >
                      Retreat
                    </AppText>

                    <AppText
                      variant="body"
                      style={{
                        color:
                          theme.colors
                            .textSecondary,
                      }}
                    >
                      Nothing is lost. Return to the woods and try again.
                    </AppText>
                  </View>
                </View>

                <Pressable
                  onPress={
                    leaveBattle
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.resultButton,

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
                      styles.resultButtonText,

                      {
                        color:
                          theme.colors
                            .background,
                      },
                    ]}
                  >
                    🌲 RETURN TO WHISPERING WOODS
                  </AppText>
                </Pressable>
              </View>
            )}

          <AppText
            variant="body"
            style={
              styles.rule
            }
          >
            Battles use your real-life stats but never grant permanent Player XP.
          </AppText>
        </View>
      </View>
    </AppScreen>
  );
}

// ============================================================
// BATTLE BUTTON
// ============================================================

type BattleButtonProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function BattleButton({
  icon,
  title,
  subtitle,
  onPress,
}: BattleButtonProps) {
  const { theme } =
    useTheme();

  return (
    <Pressable
      onPress={
        onPress
      }
      style={({
        pressed,
      }) => [
        styles.actionButton,

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
      <View
        style={
          styles.actionIconBox
        }
      >
        <AppText
          style={
            styles.actionIcon
          }
        >
          {icon}
        </AppText>
      </View>

      <View
        style={
          styles.actionText
        }
      >
        <AppText
          style={
            styles.actionTitle
          }
        >
          {title}
        </AppText>

        <AppText
          variant="label"
          style={{
            color:
              theme.colors
                .textSecondary,
          }}
        >
          {subtitle}
        </AppText>
      </View>
    </Pressable>
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
      flexGrow: 1,
      minHeight: 850,
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#08120B",
    },

    backgroundImageContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,

      // The battle scene gets its own fixed background area.
      // This prevents the image from stretching together with
      // the scrollable victory/inventory content.
      height: 850,

      overflow: "hidden",
    },

    backgroundImage: {
      width: "100%",
      height: "100%",
    },

    backgroundShade: {
      position:
        "absolute",

      top: 0,
      right: 0,
      left: 0,

      height: 850,

      backgroundColor:
        "rgba(4, 8, 5, 0.30)",
    },

    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    header: {
      paddingTop:
        58,

      paddingHorizontal:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 12,

      zIndex: 10,
    },

    headerButton: {
      width: 44,
      height: 44,

      borderRadius:
        14,

      borderWidth:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    backIcon: {
      fontSize:
        34,

      lineHeight:
        36,

      marginTop:
        -3,
    },

    headerCenter: {
      flex: 1,

      minWidth:
        0,
    },

    headerLabel: {
      color:
        "rgba(255,255,255,0.68)",
    },

    headerTitle: {
      color:
        "#FFFFFF",

      fontSize:
        22,

      lineHeight:
        27,
    },

    turnBadge: {
      minWidth:
        54,

      borderRadius:
        12,

      borderWidth:
        1,

      paddingHorizontal:
        9,

      paddingVertical:
        6,

      alignItems:
        "center",
    },

    turnNumber: {
      fontSize:
        17,

      fontWeight:
        "900",
    },

    // --------------------------------------------------------
    // BATTLEFIELD
    // --------------------------------------------------------

    battlefield: {
      height:
        390,

      position:
        "relative",

      paddingHorizontal:
        16,

      paddingTop:
        14,
    },

    enemySide: {
      flex: 1,

      alignItems:
        "flex-end",
    },

    enemyInfo: {
      width:
        "72%",

      maxWidth:
        300,

      borderWidth:
        1,

      borderRadius:
        16,

      padding:
        12,

      zIndex:
        4,
    },

    enemyVisual: {
      position:
        "absolute",

      top:
        108,

      right:
        18,

      width:
        145,

      height:
        145,

      alignItems:
        "center",

      justifyContent:
        "flex-end",

      zIndex:
        1,
    },

    mosslingImage: {
      width:
        145,

      height:
        145,

      zIndex:
        2,
    },

    sporecapImage: {
      width:
        115,

      height:
        115,

      zIndex:
        2,
    },

    enemyShadow: {
      position:
        "absolute",

      bottom:
        8,

      width:
        95,

      height:
        18,

      borderRadius:
        50,

      backgroundColor:
        "rgba(0,0,0,0.38)",
    },

    buddySide: {
      position:
        "absolute",

      left:
        16,

      right:
        16,

      bottom:
        10,

      flexDirection:
        "row",

      alignItems:
        "flex-end",

      gap:
        8,

      zIndex:
        3,
    },

    buddyVisual: {
      width:
        105,

      height:
        110,

      alignItems:
        "center",

      justifyContent:
        "flex-end",
    },

    buddyIcon: {
      fontSize:
        68,

      lineHeight:
        80,

      zIndex:
        2,
    },

    buddyShadow: {
      position:
        "absolute",

      bottom:
        4,

      width:
        76,

      height:
        17,

      borderRadius:
        40,

      backgroundColor:
        "rgba(0,0,0,0.38)",
    },

    buddyInfo: {
      flex: 1,

      minWidth:
        0,

      borderWidth:
        1,

      borderRadius:
        16,

      padding:
        12,

      zIndex:
        4,
    },

    nameRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",

      gap:
        8,
    },

    combatantName: {
      fontSize:
        18,

      lineHeight:
        23,
    },

    hpLabelRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginTop:
        8,

      marginBottom:
        5,
    },

    // --------------------------------------------------------
    // BOTTOM HUD
    // --------------------------------------------------------

    bottomHUD: {
      paddingHorizontal:
        16,

      paddingBottom:
        34,

      gap:
        9,
    },

    messageBox: {
      minHeight:
        70,

      borderWidth:
        1,

      borderRadius:
        17,

      padding:
        12,

      justifyContent:
        "center",
    },

    messageTitleRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      gap:
        8,
    },

    messageText: {
      marginTop:
        4,

      lineHeight:
        18,
    },

    // --------------------------------------------------------
    // ACTIONS
    // --------------------------------------------------------

    actionsGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      rowGap:
        8,
    },

    actionButton: {
      width:
        "48.7%",

      minHeight:
        60,

      borderWidth:
        1,

      borderRadius:
        16,

      paddingHorizontal:
        10,

      paddingVertical:
        8,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        8,
    },

    actionIconBox: {
      width:
        34,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    actionIcon: {
      fontSize:
        23,

      lineHeight:
        29,
    },

    actionText: {
      flex: 1,

      minWidth:
        0,
    },

    actionTitle: {
      fontSize:
        13,

      fontWeight:
        "900",

      letterSpacing:
        0.5,
    },

    // --------------------------------------------------------
    // INVENTORY
    // --------------------------------------------------------

    inventoryPanel: {
      borderWidth:
        1,

      borderRadius:
        18,

      padding:
        12,

      gap:
        10,
    },

    inventoryHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap:
        10,
    },

    inventoryTitle: {
      fontSize:
        18,

      lineHeight:
        22,
    },

    inventoryClose: {
      width:
        34,

      height:
        34,

      borderWidth:
        1,

      borderRadius:
        10,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    inventoryList: {
      gap:
        7,
    },

    inventoryItem: {
      minHeight:
        58,

      borderWidth:
        1,

      borderRadius:
        14,

      paddingHorizontal:
        10,

      paddingVertical:
        8,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        10,
    },

    inventoryItemDisabled: {
      opacity:
        0.48,
    },

    inventoryItemIconBox: {
      width:
        42,

      height:
        42,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    inventoryItemIcon: {
      fontSize:
        27,

      lineHeight:
        34,
    },

    inventoryItemInfo: {
      flex: 1,

      minWidth:
        0,
    },

    inventoryItemNameRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        7,
    },

    inventoryItemName: {
      fontSize:
        13,

      fontWeight:
        "800",

      flexShrink:
        1,
    },

    quantityBadge: {
      minWidth:
        28,

      borderRadius:
        8,

      paddingHorizontal:
        6,

      paddingVertical:
        2,

      alignItems:
        "center",
    },

    quantityText: {
      fontSize:
        10,

      fontWeight:
        "900",
    },

    inventoryArrow: {
      fontSize:
        22,

      opacity:
        0.65,
    },

    // --------------------------------------------------------
    // RESULT
    // --------------------------------------------------------

    resultCard: {
      borderWidth:
        1,

      borderRadius:
        18,

      padding:
        14,

      gap:
        12,
    },

    resultHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        12,
    },

    resultIconBox: {
      width:
        52,

      height:
        52,

      borderRadius:
        16,

      borderWidth:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    resultIcon: {
      fontSize:
        30,
    },

    resultText: {
      flex:
        1,

      minWidth:
        0,
    },

    resultTitle: {
      marginTop:
        2,

      marginBottom:
        2,
    },

    victorySummary: {
      borderWidth:
        1,

      borderRadius:
        14,

      paddingHorizontal:
        12,

      paddingVertical:
        4,
    },

    victorySummaryRow: {
      minHeight:
        38,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap:
        10,
    },

    victorySummaryValue: {
      fontWeight:
        "900",
    },

    victoryDivider: {
      height:
        StyleSheet.hairlineWidth,

      backgroundColor:
        "rgba(255,255,255,0.12)",
    },

    lootValue: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        6,
    },

    lootIcon: {
      fontSize:
        19,
    },

    lootCard: {
      borderWidth:
        1,

      borderRadius:
        14,

      padding:
        10,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        10,

      backgroundColor:
        "rgba(255,255,255,0.04)",
    },

    lootCardIcon: {
      fontSize:
        34,

      lineHeight:
        42,
    },

    lootCardText: {
      flex:
        1,

      minWidth:
        0,
    },

    lootCardName: {
      fontSize:
        14,

      fontWeight:
        "900",

      marginTop:
        1,

      marginBottom:
        2,
    },

    resultButton: {
      width:
        "100%",

      minHeight:
        50,

      borderRadius:
        14,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        14,
    },

    resultButtonText: {
      fontSize:
        12,

      fontWeight:
        "900",

      letterSpacing:
        0.5,

      textAlign:
        "center",
    },

    // --------------------------------------------------------
    // FOOTER
    // --------------------------------------------------------

    rule: {
      color:
        "rgba(255,255,255,0.58)",

      textAlign:
        "center",

      fontSize:
        10,

      lineHeight:
        14,

      marginTop:
        2,
    },

    pressed: {
      opacity:
        0.76,

      transform: [
        {
          scale:
            0.98,
        },
      ],
    },
  });