import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

// ============================================================
// TYPES
// ============================================================

export type ActivityType =
  | "running"
  | "walking"
  | "reading"
  | "gym"
  | "coding"
  | "studying"
  | "custom";

export type ActivityMetric =
  | "distance"
  | "time"
  | "pages"
  | "sessions"
  | "amount"
  | "custom";

export type GoalMetric =
  ActivityMetric;

// ============================================================
// LIFE STATS
// ============================================================

export type BuddyLifeStat =
  | "vitality"
  | "power"
  | "agility"
  | "intelligence";

// ============================================================
// ACTIVITY
// ============================================================

export type Activity = {
  id: number;
  type: ActivityType;

  icon: string;
  title: string;
  details: string;
  note: string;

  xp: number;

  metric?: ActivityMetric;
  unit?: string;

  distance?: number;
  time?: number;
  pages?: number;
  sessions?: number;
  amount?: number;
  custom?: number;

  lifeStats?: BuddyLifeStat[];

  createdAt: Date;
};

export type AddActivityData = {
  type: ActivityType;

  icon: string;
  title: string;
  details: string;
  note: string;

  xp: number;

  metric?: ActivityMetric;
  unit?: string;

  distance?: number;
  time?: number;
  pages?: number;
  sessions?: number;
  amount?: number;
  custom?: number;

  lifeStats?: BuddyLifeStat[];
};

type AddRunData = {
  distance: number;
  time: number;
  note: string;
  xp: number;
};

// ============================================================
// GOAL
// ============================================================

export type Goal = {
  id: number;

  title: string;
  icon: string;

  activityType: ActivityType;
  metric: GoalMetric;

  target: number;
  current: number;

  unit: string;

  deadline: Date | null;
  createdAt: Date;
};

export type AddGoalData = {
  title: string;
  icon: string;

  activityType: ActivityType;
  metric: GoalMetric;

  target: number;
  unit: string;

  deadline: Date | null;
};

// ============================================================
// ACHIEVEMENTS
// ============================================================

export type AchievementUnlock = {
  achievementId: string;
  unlockedAt: Date;
};

// ============================================================
// BUDDY
// ============================================================

export type BuddySpecies =
  | "dog"
  | "cat"
  | "dragon"
  | "robot"
  | "mystery";

export type BuddyBuildStat =
  | "magic"
  | "defense"
  | "luck";

export type Buddy = {
  name: string;

  species: BuddySpecies;

  createdAt: Date;

  magic: number;
  defense: number;
  luck: number;
};

export type BuddyLifeStats = {
  vitality: number;
  power: number;
  agility: number;
  intelligence: number;
};

export type CreateBuddyData = {
  name: string;
  species: BuddySpecies;
};

// ============================================================
// ADVENTURE
// ============================================================

export type AdventureEnemyType =
  | "mossling"
  | "sporecap";

export type WhisperingWoodsProgress = {
  steps: number;

  discoveries: number;

  treasuresOpened: number;

  enemiesDefeated: {
    mossling: number;
    sporecap: number;
  };
};

export type AdventureProgress = {
  whisperingWoods:
    WhisperingWoodsProgress;
};

// ============================================================
// INVENTORY
// ============================================================

export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare";

export type InventoryItemType =
  | "forest-berry"
  | "healing-herb"
  | "glowcap"
  | "forest-crystal";

export type InventoryItem = {
  type: InventoryItemType;

  name: string;

  icon: string;

  description: string;

  rarity: ItemRarity;

  quantity: number;
};

type LootItem = Omit<
  InventoryItem,
  "quantity"
>;

// ============================================================
// RANDOM QUEST
// ============================================================

export type QuestMetric =
  | "entries"
  | "distance"
  | "time"
  | "pages"
  | "sessions";

export type RandomQuestStatus =
  | "available"
  | "accepted"
  | "completed";

export type RandomQuest = {
  id: number;

  templateId: string;

  icon: string;
  title: string;
  description: string;

  metric: QuestMetric;

  target: number;
  progress: number;

  unit: string;

  rewardXP: number;

  status: RandomQuestStatus;

  generatedAt: Date;
  acceptedAt: Date | null;
  completedAt: Date | null;
};

type QuestTemplate = {
  templateId: string;

  icon: string;
  title: string;
  description: string;

  metric: QuestMetric;

  target: number;
  unit: string;

  rewardXP: number;
};

// ============================================================
// CONTEXT TYPE
// ============================================================

type AppContextType = {
  // XP

  totalXP: number;
  activityXP: number;
  bonusXP: number;

  level: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;

  // DATA

  activities: Activity[];
  goals: Goal[];

  achievementUnlocks:
    AchievementUnlock[];

  // BUDDY

  buddy: Buddy | null;

  buddyLifeStats:
    BuddyLifeStats;

  buddyBuildPointsEarned:
    number;

  buddyBuildPointsSpent:
    number;

  buddyUnspentBuildPoints:
    number;

  createBuddy: (
    data: CreateBuddyData
  ) => void;

  renameBuddy: (
    name: string
  ) => void;

  spendBuddyBuildPoint: (
    stat: BuddyBuildStat
  ) => void;

  // ADVENTURE

  adventureProgress:
    AdventureProgress;

  exploreWhisperingWoods:
    () => void;

  discoverWhisperingWoods:
    () => void;

  openWhisperingWoodsTreasure:
    () => InventoryItem;

  defeatWhisperingWoodsEnemy: (
    enemy: AdventureEnemyType
  ) => void;

  rewardWhisperingWoodsEnemyLoot: (
    enemy: AdventureEnemyType
  ) => InventoryItem;

  // INVENTORY

  inventory:
    InventoryItem[];

  lastTreasureItem:
    InventoryItem | null;

  clearLastTreasureItem:
    () => void;

  useInventoryItem: (
    itemType: InventoryItemType
  ) => boolean;

  // RANDOM QUEST

  randomQuest:
    RandomQuest | null;

  questCooldownUntil:
    Date | null;

  isQuestOnCooldown:
    boolean;

  // ACTIVITY

  addActivity: (
    activity: AddActivityData
  ) => void;

  addRun: (
    run: AddRunData
  ) => void;

  deleteActivity: (
    activityId: number
  ) => void;

  // GOALS

  addGoal: (
    goal: AddGoalData
  ) => void;

  updateGoalProgress: (
    goalId: number,
    amount: number
  ) => void;

  deleteGoal: (
    goalId: number
  ) => void;

  // QUEST

  generateRandomQuest:
    () => void;

  rerollRandomQuest:
    () => void;

  acceptRandomQuest:
    () => void;

  claimRandomQuest:
    () => void;

  // APP

  isLoading: boolean;
};

// ============================================================
// CONTEXT
// ============================================================

const AppContext =
  createContext<
    AppContextType | undefined
  >(undefined);

// ============================================================
// CONSTANTS
// ============================================================

const XP_PER_LEVEL = 500;

const QUEST_COOLDOWN_MS =
  2 * 60 * 60 * 1000;

const ACTIVITIES_STORAGE_KEY =
  "@life_app_activities";

const GOALS_STORAGE_KEY =
  "@life_app_goals";

const BONUS_XP_STORAGE_KEY =
  "@life_app_bonus_xp";

const ACHIEVEMENT_UNLOCKS_STORAGE_KEY =
  "@life_app_achievement_unlocks";

const RANDOM_QUEST_STORAGE_KEY =
  "@life_app_random_quest";

const QUEST_COOLDOWN_STORAGE_KEY =
  "@life_app_quest_cooldown";

const BUDDY_STORAGE_KEY =
  "@life_app_buddy";

const ADVENTURE_PROGRESS_STORAGE_KEY =
  "@life_app_adventure_progress";

const INVENTORY_STORAGE_KEY =
  "@life_app_inventory";

// ============================================================
// DEFAULT ADVENTURE
// ============================================================

const DEFAULT_ADVENTURE_PROGRESS:
  AdventureProgress = {
  whisperingWoods: {
    steps: 0,

    discoveries: 0,

    treasuresOpened: 0,

    enemiesDefeated: {
      mossling: 0,
      sporecap: 0,
    },
  },
};

// ============================================================
// LOOT
// ============================================================

const WHISPERING_WOODS_LOOT:
  LootItem[] = [
    {
      type: "forest-berry",

      name: "Forest Berry",

      icon: "🍓",

      description:
        "A sweet berry found deep in the woods. Restores a little HP.",

      rarity: "common",
    },

    {
      type: "healing-herb",

      name: "Healing Herb",

      icon: "🌿",

      description:
        "A medicinal forest herb. Restores HP during battle.",

      rarity: "common",
    },

    {
      type: "glowcap",

      name: "Glowcap",

      icon: "🍄",

      description:
        "A softly glowing mushroom filled with strange energy.",

      rarity: "uncommon",
    },

    {
      type: "forest-crystal",

      name: "Forest Crystal",

      icon: "💎",

      description:
        "A rare crystal carrying the energy of the Whispering Woods.",

      rarity: "rare",
    },
  ];

// ============================================================
// TREASURE LOOT
// ============================================================

function rollWhisperingWoodsLoot():
  LootItem {
  const roll =
    Math.random();

  // 5% Forest Crystal

  if (
    roll < 0.05
  ) {
    return WHISPERING_WOODS_LOOT.find(
      item =>
        item.type ===
        "forest-crystal"
    )!;
  }

  // 20% Glowcap

  if (
    roll < 0.25
  ) {
    return WHISPERING_WOODS_LOOT.find(
      item =>
        item.type ===
        "glowcap"
    )!;
  }

  // 75% common

  const commonItems =
    WHISPERING_WOODS_LOOT.filter(
      item =>
        item.rarity ===
        "common"
    );

  return commonItems[
    Math.floor(
      Math.random() *
        commonItems.length
    )
  ];
}

// ============================================================
// ENEMY LOOT
// ============================================================

function rollWhisperingWoodsEnemyLoot(
  enemy: AdventureEnemyType
): LootItem {
  const roll =
    Math.random();

  // ----------------------------------------------------------
  // MOSSLING
  // ----------------------------------------------------------

  if (
    enemy ===
    "mossling"
  ) {
    // 5% Forest Crystal

    if (
      roll < 0.05
    ) {
      return WHISPERING_WOODS_LOOT.find(
        item =>
          item.type ===
          "forest-crystal"
      )!;
    }

    // 25% Healing Herb

    if (
      roll < 0.30
    ) {
      return WHISPERING_WOODS_LOOT.find(
        item =>
          item.type ===
          "healing-herb"
      )!;
    }

    // 70% Forest Berry

    return WHISPERING_WOODS_LOOT.find(
      item =>
        item.type ===
        "forest-berry"
    )!;
  }

  // ----------------------------------------------------------
  // SPORECAP
  // ----------------------------------------------------------

  // 10% Forest Crystal

  if (
    roll < 0.10
  ) {
    return WHISPERING_WOODS_LOOT.find(
      item =>
        item.type ===
        "forest-crystal"
    )!;
  }

  // 55% Glowcap

  if (
    roll < 0.65
  ) {
    return WHISPERING_WOODS_LOOT.find(
      item =>
        item.type ===
        "glowcap"
    )!;
  }

  // 35% Healing Herb

  return WHISPERING_WOODS_LOOT.find(
    item =>
      item.type ===
      "healing-herb"
  )!;
}

// ============================================================
// QUEST TEMPLATES
// ============================================================

const QUEST_TEMPLATES:
  QuestTemplate[] = [
    {
      templateId:
        "log_activity",

      icon: "⚡",

      title:
        "Get Moving",

      description:
        "Log any activity.",

      metric:
        "entries",

      target: 1,

      unit:
        "activity",

      rewardXP: 30,
    },

    {
      templateId:
        "focused_30",

      icon: "⏱️",

      title:
        "Focused Session",

      description:
        "Complete 30 minutes of a time-based activity.",

      metric: "time",

      target: 30,

      unit: "min",

      rewardXP: 50,
    },

    {
      templateId:
        "focused_60",

      icon: "🔥",

      title:
        "Deep Focus",

      description:
        "Complete 60 minutes of time-based activities.",

      metric: "time",

      target: 60,

      unit: "min",

      rewardXP: 75,
    },

    {
      templateId:
        "distance_2",

      icon: "🥾",

      title:
        "Go the Distance",

      description:
        "Complete 2 km of distance-based activities.",

      metric:
        "distance",

      target: 2,

      unit: "km",

      rewardXP: 50,
    },

    {
      templateId:
        "distance_5",

      icon: "🏃",

      title:
        "Extra Mile",

      description:
        "Complete 5 km of distance-based activities.",

      metric:
        "distance",

      target: 5,

      unit: "km",

      rewardXP: 75,
    },

    {
      templateId:
        "pages_20",

      icon: "📖",

      title:
        "Knowledge Grind",

      description:
        "Read 20 pages.",

      metric: "pages",

      target: 20,

      unit: "pages",

      rewardXP: 40,
    },

    {
      templateId:
        "pages_50",

      icon: "📚",

      title:
        "Chapter Hunter",

      description:
        "Read 50 pages.",

      metric: "pages",

      target: 50,

      unit: "pages",

      rewardXP: 65,
    },

    {
      templateId:
        "session_1",

      icon: "💪",

      title:
        "Show Up",

      description:
        "Complete one session-based activity.",

      metric:
        "sessions",

      target: 1,

      unit:
        "session",

      rewardXP: 40,
    },

    {
      templateId:
        "session_2",

      icon: "🏆",

      title:
        "Double Down",

      description:
        "Complete two session-based activities.",

      metric:
        "sessions",

      target: 2,

      unit:
        "sessions",

      rewardXP: 70,
    },
  ];

// ============================================================
// ACTIVITY HELPERS
// ============================================================

function getDefaultMetric(
  type: ActivityType
): ActivityMetric {
  switch (type) {
    case "running":
    case "walking":
      return "distance";

    case "reading":
      return "pages";

    case "gym":
      return "sessions";

    case "coding":
    case "studying":
      return "time";

    case "custom":
      return "custom";
  }
}

function getDefaultUnit(
  type: ActivityType
): string {
  switch (type) {
    case "running":
    case "walking":
      return "km";

    case "reading":
      return "pages";

    case "gym":
      return "sessions";

    case "coding":
    case "studying":
      return "min";

    case "custom":
      return "units";
  }
}

function isBuddyLifeStat(
  value: unknown
): value is BuddyLifeStat {
  return (
    value === "vitality" ||
    value === "power" ||
    value === "agility" ||
    value === "intelligence"
  );
}

function normalizeLifeStats(
  value: unknown
): BuddyLifeStat[] | undefined {
  if (
    !Array.isArray(
      value
    )
  ) {
    return undefined;
  }

  const normalized =
    Array.from(
      new Set(
        value.filter(
          isBuddyLifeStat
        )
      )
    );

  return normalized.length >
    0
    ? normalized
    : undefined;
}

// ============================================================
// BUDDY LIFE STATS
// ============================================================

function getBuddyLifeStats(
  activities: Activity[]
): BuddyLifeStats {
  let vitalityXP = 0;
  let powerXP = 0;
  let agilityXP = 0;
  let intelligenceXP = 0;

  activities.forEach(
    activity => {
      const xp =
        Math.max(
          0,
          Number(
            activity.xp
          ) || 0
        );

      switch (
        activity.type
      ) {
        case "running":
          agilityXP +=
            xp * 0.75;

          vitalityXP +=
            xp * 0.25;

          break;

        case "walking":
          agilityXP +=
            xp * 0.6;

          vitalityXP +=
            xp * 0.4;

          break;

        case "gym":
          powerXP +=
            xp * 0.7;

          vitalityXP +=
            xp * 0.3;

          break;

        case "reading":
        case "coding":
        case "studying":
          intelligenceXP +=
            xp;

          break;

        case "custom": {
          const lifeStats =
            normalizeLifeStats(
              activity.lifeStats
            );

          if (
            lifeStats &&
            lifeStats.length >
              0
          ) {
            const xpPerStat =
              xp /
              lifeStats.length;

            lifeStats.forEach(
              stat => {
                switch (
                  stat
                ) {
                  case "vitality":
                    vitalityXP +=
                      xpPerStat;

                    break;

                  case "power":
                    powerXP +=
                      xpPerStat;

                    break;

                  case "agility":
                    agilityXP +=
                      xpPerStat;

                    break;

                  case "intelligence":
                    intelligenceXP +=
                      xpPerStat;

                    break;
                }
              }
            );
          } else {
            vitalityXP +=
              xp * 0.25;
          }

          break;
        }
      }
    }
  );

  return {
    vitality:
      1 +
      Math.floor(
        vitalityXP / 100
      ),

    power:
      1 +
      Math.floor(
        powerXP / 100
      ),

    agility:
      1 +
      Math.floor(
        agilityXP / 100
      ),

    intelligence:
      1 +
      Math.floor(
        intelligenceXP / 100
      ),
  };
}

// ============================================================
// ACHIEVEMENT HELPERS
// ============================================================

function getAchievementIdsForProgress(
  activities: Activity[],
  totalXP: number
) {
  const ids:
    string[] = [];

  const totalDistance =
    activities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.distance ??
          0
        ),
      0
    );

  const totalPages =
    activities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        (
          activity.pages ??
          0
        ),
      0
    );

  const totalGymSessions =
    activities
      .filter(
        activity =>
          activity.type ===
          "gym"
      )
      .reduce(
        (
          sum,
          activity
        ) =>
          sum +
          (
            activity.sessions ??
            0
          ),
        0
      );

  if (
    activities.length >= 1
  ) {
    ids.push(
      "first-step"
    );
  }

  if (
    totalXP >= 100
  ) {
    ids.push(
      "getting-started"
    );
  }

  if (
    totalXP >= 500
  ) {
    ids.push(
      "xp-hunter"
    );
  }

  if (
    totalDistance >= 10
  ) {
    ids.push(
      "on-the-move"
    );
  }

  if (
    totalPages >= 100
  ) {
    ids.push(
      "bookworm"
    );
  }

  if (
    totalGymSessions >=
    10
  ) {
    ids.push(
      "regular"
    );
  }

  return ids;
}

// ============================================================
// QUEST HELPERS
// ============================================================

function getAvailableQuestTemplates(
  activities: Activity[]
) {
  const availableMetrics =
    new Set<ActivityMetric>();

  activities.forEach(
    activity => {
      availableMetrics.add(
        activity.metric ??
          getDefaultMetric(
            activity.type
          )
      );
    }
  );

  return QUEST_TEMPLATES.filter(
    template => {
      if (
        template.metric ===
        "entries"
      ) {
        return true;
      }

      return availableMetrics.has(
        template.metric
      );
    }
  );
}

function createQuestFromTemplate(
  template: QuestTemplate
): RandomQuest {
  return {
    id: Date.now(),

    templateId:
      template.templateId,

    icon:
      template.icon,

    title:
      template.title,

    description:
      template.description,

    metric:
      template.metric,

    target:
      template.target,

    progress: 0,

    unit:
      template.unit,

    rewardXP:
      template.rewardXP,

    status:
      "available",

    generatedAt:
      new Date(),

    acceptedAt:
      null,

    completedAt:
      null,
  };
}

function chooseRandomQuest(
  activities: Activity[],
  excludedTemplateId?: string
) {
  const available =
    getAvailableQuestTemplates(
      activities
    );

  let candidates =
    available.filter(
      template =>
        template.templateId !==
        excludedTemplateId
    );

  if (
    candidates.length === 0
  ) {
    candidates =
      available;
  }

  if (
    candidates.length === 0
  ) {
    return null;
  }

  const randomIndex =
    Math.floor(
      Math.random() *
        candidates.length
    );

  return createQuestFromTemplate(
    candidates[
      randomIndex
    ]
  );
}

function getQuestProgressAmount(
  quest: RandomQuest,
  activity: AddActivityData
) {
  switch (
    quest.metric
  ) {
    case "entries":
      return 1;

    case "distance":
      return (
        activity.distance ??
        0
      );

    case "time":
      return (
        activity.time ??
        0
      );

    case "pages":
      return (
        activity.pages ??
        0
      );

    case "sessions":
      return (
        activity.sessions ??
        0
      );
  }
}

// ============================================================
// PROVIDER
// ============================================================

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    activities,
    setActivities,
  ] =
    useState<Activity[]>([]);

  const [
    goals,
    setGoals,
  ] =
    useState<Goal[]>([]);

  const [
    bonusXP,
    setBonusXP,
  ] =
    useState(0);

  const [
    achievementUnlocks,
    setAchievementUnlocks,
  ] =
    useState<
      AchievementUnlock[]
    >([]);

  const [
    buddy,
    setBuddy,
  ] =
    useState<
      Buddy | null
    >(null);

  const [
    adventureProgress,
    setAdventureProgress,
  ] =
    useState<AdventureProgress>(
      DEFAULT_ADVENTURE_PROGRESS
    );

  const [
    inventory,
    setInventory,
  ] =
    useState<
      InventoryItem[]
    >([]);

  const [
    lastTreasureItem,
    setLastTreasureItem,
  ] =
    useState<
      InventoryItem | null
    >(null);

  const [
    randomQuest,
    setRandomQuest,
  ] =
    useState<
      RandomQuest | null
    >(null);

  const [
    questCooldownUntil,
    setQuestCooldownUntil,
  ] =
    useState<Date | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================================
  // SAVE EFFECTS
  // ==========================================================

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveActivities();
    }
  }, [
    activities,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveGoals();
    }
  }, [
    goals,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveBonusXP();
    }
  }, [
    bonusXP,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveAchievementUnlocks();
    }
  }, [
    achievementUnlocks,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveBuddy();
    }
  }, [
    buddy,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveAdventureProgress();
    }
  }, [
    adventureProgress,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveInventory();
    }
  }, [
    inventory,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveRandomQuest();
    }
  }, [
    randomQuest,
    isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading
    ) {
      saveQuestCooldown();
    }
  }, [
    questCooldownUntil,
    isLoading,
  ]);

  // ==========================================================
  // XP
  // ==========================================================

  const activityXP =
    activities.reduce(
      (
        sum,
        activity
      ) =>
        sum +
        activity.xp,
      0
    );

  const totalXP =
    activityXP +
    bonusXP;

  const level =
    Math.floor(
      totalXP /
        XP_PER_LEVEL
    ) + 1;

  const xpInCurrentLevel =
    totalXP %
    XP_PER_LEVEL;

  const xpNeededForNextLevel =
    XP_PER_LEVEL;

  // ==========================================================
  // BUDDY PROGRESSION
  // ==========================================================

  const buddyLifeStats =
    getBuddyLifeStats(
      activities
    );

  const buddyBuildPointsEarned =
    Math.max(
      level - 1,
      0
    );

  const buddyBuildPointsSpent =
    buddy
      ? buddy.magic +
        buddy.defense +
        buddy.luck
      : 0;

  const buddyUnspentBuildPoints =
    Math.max(
      buddyBuildPointsEarned -
        buddyBuildPointsSpent,
      0
    );

  // ==========================================================
  // ACHIEVEMENTS
  // ==========================================================

  useEffect(() => {
    if (
      isLoading
    ) {
      return;
    }

    const qualifyingIds =
      getAchievementIdsForProgress(
        activities,
        totalXP
      );

    if (
      qualifyingIds.length ===
      0
    ) {
      return;
    }

    setAchievementUnlocks(
      current => {
        const alreadyUnlocked =
          new Set(
            current.map(
              unlock =>
                unlock.achievementId
            )
          );

        const newIds =
          qualifyingIds.filter(
            id =>
              !alreadyUnlocked.has(
                id
              )
          );

        if (
          newIds.length ===
          0
        ) {
          return current;
        }

        const unlockedAt =
          new Date();

        const newUnlocks =
          newIds.map(
            achievementId => ({
              achievementId,
              unlockedAt,
            })
          );

        return [
          ...current,
          ...newUnlocks,
        ];
      }
    );
  }, [
    activities,
    totalXP,
    isLoading,
  ]);

  // ==========================================================
  // QUEST COOLDOWN
  // ==========================================================

  useEffect(() => {
    if (
      isLoading ||
      randomQuest ||
      !questCooldownUntil
    ) {
      return;
    }

    const remaining =
      questCooldownUntil.getTime() -
      Date.now();

    if (
      remaining <= 0
    ) {
      setQuestCooldownUntil(
        null
      );

      setRandomQuest(
        chooseRandomQuest(
          activities
        )
      );

      return;
    }

    const timer =
      setTimeout(
        () => {
          setQuestCooldownUntil(
            null
          );

          setRandomQuest(
            chooseRandomQuest(
              activities
            )
          );
        },
        remaining
      );

    return () =>
      clearTimeout(
        timer
      );
  }, [
    isLoading,
    randomQuest,
    questCooldownUntil,
    activities,
  ]);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  async function loadData() {
    try {
      const [
        savedActivities,
        savedGoals,
        savedBonusXP,
        savedAchievementUnlocks,
        savedRandomQuest,
        savedQuestCooldown,
        savedBuddy,
        savedAdventureProgress,
        savedInventory,
      ] =
        await Promise.all([
          AsyncStorage.getItem(
            ACTIVITIES_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            GOALS_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            BONUS_XP_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            ACHIEVEMENT_UNLOCKS_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            RANDOM_QUEST_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            QUEST_COOLDOWN_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            BUDDY_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            ADVENTURE_PROGRESS_STORAGE_KEY
          ),

          AsyncStorage.getItem(
            INVENTORY_STORAGE_KEY
          ),
        ]);

      // --------------------------------------------------------
      // ACTIVITIES
      // --------------------------------------------------------

      let loadedActivities:
        Activity[] = [];

      if (
        savedActivities
      ) {
        const parsed:
          Activity[] =
          JSON.parse(
            savedActivities
          );

        loadedActivities =
          parsed.map(
            activity => ({
              ...activity,

              metric:
                activity.metric ??
                getDefaultMetric(
                  activity.type
                ),

              unit:
                activity.unit ??
                getDefaultUnit(
                  activity.type
                ),

              lifeStats:
                normalizeLifeStats(
                  activity.lifeStats
                ),

              createdAt:
                new Date(
                  activity.createdAt
                ),
            })
          );

        setActivities(
          loadedActivities
        );
      }

      // --------------------------------------------------------
      // GOALS
      // --------------------------------------------------------

      if (
        savedGoals
      ) {
        const parsed =
          JSON.parse(
            savedGoals
          );

        setGoals(
          parsed.map(
            (
              goal: Goal
            ) => {
              const activityType =
                goal.activityType ??
                (
                  goal.unit
                    ?.trim()
                    .toLowerCase() ===
                  "km"
                    ? "running"
                    : "custom"
                );

              const metric =
                goal.metric ??
                (
                  goal.unit
                    ?.trim()
                    .toLowerCase() ===
                  "km"
                    ? "distance"
                    : "custom"
                );

              return {
                ...goal,

                activityType,
                metric,

                deadline:
                  goal.deadline
                    ? new Date(
                        goal.deadline
                      )
                    : null,

                createdAt:
                  new Date(
                    goal.createdAt
                  ),
              };
            }
          )
        );
      }

      // --------------------------------------------------------
      // BONUS XP
      // --------------------------------------------------------

      let loadedBonusXP =
        0;

      if (
        savedBonusXP
      ) {
        const parsedBonusXP =
          Number(
            JSON.parse(
              savedBonusXP
            )
          );

        if (
          Number.isFinite(
            parsedBonusXP
          )
        ) {
          loadedBonusXP =
            Math.max(
              0,
              parsedBonusXP
            );

          setBonusXP(
            loadedBonusXP
          );
        }
      }

      // --------------------------------------------------------
      // ACHIEVEMENTS
      // --------------------------------------------------------

      if (
        savedAchievementUnlocks
      ) {
        const parsed:
          AchievementUnlock[] =
          JSON.parse(
            savedAchievementUnlocks
          );

        setAchievementUnlocks(
          parsed.map(
            unlock => ({
              ...unlock,

              unlockedAt:
                new Date(
                  unlock.unlockedAt
                ),
            })
          )
        );
      } else {
        const loadedActivityXP =
          loadedActivities.reduce(
            (
              sum,
              activity
            ) =>
              sum +
              activity.xp,
            0
          );

        const loadedTotalXP =
          loadedActivityXP +
          loadedBonusXP;

        const existingIds =
          getAchievementIdsForProgress(
            loadedActivities,
            loadedTotalXP
          );

        if (
          existingIds.length >
          0
        ) {
          const migratedAt =
            new Date();

          setAchievementUnlocks(
            existingIds.map(
              achievementId => ({
                achievementId,

                unlockedAt:
                  migratedAt,
              })
            )
          );
        }
      }

      // --------------------------------------------------------
      // BUDDY
      // --------------------------------------------------------

      if (
        savedBuddy
      ) {
        const parsed:
          Buddy =
          JSON.parse(
            savedBuddy
          );

        setBuddy({
          ...parsed,

          name:
            parsed.name ??
            "Buddy",

          species:
            parsed.species ??
            "mystery",

          magic:
            Math.max(
              0,
              Number(
                parsed.magic ??
                  0
              )
            ),

          defense:
            Math.max(
              0,
              Number(
                parsed.defense ??
                  0
              )
            ),

          luck:
            Math.max(
              0,
              Number(
                parsed.luck ??
                  0
              )
            ),

          createdAt:
            parsed.createdAt
              ? new Date(
                  parsed.createdAt
                )
              : new Date(),
        });
      }

      // --------------------------------------------------------
      // ADVENTURE
      // --------------------------------------------------------

      if (
        savedAdventureProgress
      ) {
        const parsed:
          Partial<AdventureProgress> =
          JSON.parse(
            savedAdventureProgress
          );

        setAdventureProgress({
          whisperingWoods: {
            steps:
              Math.max(
                0,
                Number(
                  parsed
                    .whisperingWoods
                    ?.steps ??
                    0
                )
              ),

            discoveries:
              Math.max(
                0,
                Number(
                  parsed
                    .whisperingWoods
                    ?.discoveries ??
                    0
                )
              ),

            treasuresOpened:
              Math.max(
                0,
                Number(
                  parsed
                    .whisperingWoods
                    ?.treasuresOpened ??
                    0
                )
              ),

            enemiesDefeated: {
              mossling:
                Math.max(
                  0,
                  Number(
                    parsed
                      .whisperingWoods
                      ?.enemiesDefeated
                      ?.mossling ??
                      0
                  )
                ),

              sporecap:
                Math.max(
                  0,
                  Number(
                    parsed
                      .whisperingWoods
                      ?.enemiesDefeated
                      ?.sporecap ??
                      0
                  )
                ),
            },
          },
        });
      }

      // --------------------------------------------------------
      // INVENTORY
      // --------------------------------------------------------

      if (
        savedInventory
      ) {
        const parsed:
          InventoryItem[] =
          JSON.parse(
            savedInventory
          );

        setInventory(
          parsed
            .filter(
              item =>
                item &&
                item.type &&
                Number(
                  item.quantity
                ) > 0
            )
            .map(
              item => ({
                ...item,

                quantity:
                  Math.max(
                    1,
                    Number(
                      item.quantity
                    ) || 1
                  ),
              })
            )
        );
      }

      // --------------------------------------------------------
      // RANDOM QUEST
      // --------------------------------------------------------

      let loadedQuest:
        RandomQuest | null =
        null;

      if (
        savedRandomQuest
      ) {
        const parsed:
          RandomQuest =
          JSON.parse(
            savedRandomQuest
          );

        loadedQuest = {
          ...parsed,

          generatedAt:
            new Date(
              parsed.generatedAt
            ),

          acceptedAt:
            parsed.acceptedAt
              ? new Date(
                  parsed.acceptedAt
                )
              : null,

          completedAt:
            parsed.completedAt
              ? new Date(
                  parsed.completedAt
                )
              : null,
        };

        setRandomQuest(
          loadedQuest
        );
      }

      // --------------------------------------------------------
      // QUEST COOLDOWN
      // --------------------------------------------------------

      let loadedCooldown:
        Date | null =
        null;

      if (
        savedQuestCooldown
      ) {
        const parsed =
          JSON.parse(
            savedQuestCooldown
          );

        if (
          parsed
        ) {
          loadedCooldown =
            new Date(
              parsed
            );
        }
      }

      if (
        !loadedQuest
      ) {
        if (
          loadedCooldown &&
          loadedCooldown.getTime() >
            Date.now()
        ) {
          setQuestCooldownUntil(
            loadedCooldown
          );
        } else {
          setQuestCooldownUntil(
            null
          );

          setRandomQuest(
            chooseRandomQuest(
              loadedActivities
            )
          );
        }
      } else {
        setQuestCooldownUntil(
          null
        );
      }
    } catch (
      error
    ) {
      console.log(
        "Could not load app data:",
        error
      );
    } finally {
      setIsLoading(
        false
      );
    }
  }

  // ==========================================================
  // SAVE
  // ==========================================================

  async function saveActivities() {
    try {
      await AsyncStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify(
          activities
        )
      );
    } catch (
      error
    ) {
      console.log(
        "Could not save activities:",
        error
      );
    }
  }

  async function saveGoals() {
    try {
      await AsyncStorage.setItem(
        GOALS_STORAGE_KEY,
        JSON.stringify(
          goals
        )
      );
    } catch (
      error
    ) {
      console.log(
        "Could not save goals:",
        error
      );
    }
  }

  async function saveBonusXP() {
    try {
      await AsyncStorage.setItem(
        BONUS_XP_STORAGE_KEY,
        JSON.stringify(
          bonusXP
        )
      );
    } catch (
      error
    ) {
      console.log(
        "Could not save bonus XP:",
        error
      );
    }
  }

  async function saveAchievementUnlocks() {
    try {
      await AsyncStorage.setItem(
        ACHIEVEMENT_UNLOCKS_STORAGE_KEY,
        JSON.stringify(
          achievementUnlocks
        )
      );
    } catch (
      error
    ) {
      console.log(
        "Could not save achievement history:",
        error
      );
    }
  }

  async function saveBuddy() {
    try {
      if (
        buddy
      ) {
        await AsyncStorage.setItem(
          BUDDY_STORAGE_KEY,
          JSON.stringify(
            buddy
          )
        );
      } else {
        await AsyncStorage.removeItem(
          BUDDY_STORAGE_KEY
        );
      }
    } catch (
      error
    ) {
      console.log(
        "Could not save buddy:",
        error
      );
    }
  }

  async function saveAdventureProgress() {
    try {
      await AsyncStorage.setItem(
        ADVENTURE_PROGRESS_STORAGE_KEY,
        JSON.stringify(
          adventureProgress
        )
      );
    } catch (
      error
    ) {
      console.log(
        "Could not save adventure progress:",
        error
      );
    }
  }

  async function saveInventory() {
    try {
      await AsyncStorage.setItem(
        INVENTORY_STORAGE_KEY,
        JSON.stringify(
          inventory
        )
      );
    } catch (
      error
    ) {
      console.log(
        "Could not save inventory:",
        error
      );
    }
  }

  async function saveRandomQuest() {
    try {
      if (
        randomQuest
      ) {
        await AsyncStorage.setItem(
          RANDOM_QUEST_STORAGE_KEY,
          JSON.stringify(
            randomQuest
          )
        );
      } else {
        await AsyncStorage.removeItem(
          RANDOM_QUEST_STORAGE_KEY
        );
      }
    } catch (
      error
    ) {
      console.log(
        "Could not save random quest:",
        error
      );
    }
  }

  async function saveQuestCooldown() {
    try {
      if (
        questCooldownUntil
      ) {
        await AsyncStorage.setItem(
          QUEST_COOLDOWN_STORAGE_KEY,
          JSON.stringify(
            questCooldownUntil
          )
        );
      } else {
        await AsyncStorage.removeItem(
          QUEST_COOLDOWN_STORAGE_KEY
        );
      }
    } catch (
      error
    ) {
      console.log(
        "Could not save quest cooldown:",
        error
      );
    }
  }

  // ==========================================================
  // BUDDY ACTIONS
  // ==========================================================

  function createBuddy(
    data: CreateBuddyData
  ) {
    const trimmedName =
      data.name.trim();

    const newBuddy:
      Buddy = {
      name:
        trimmedName ||
        "Buddy",

      species:
        data.species,

      createdAt:
        new Date(),

      magic: 0,
      defense: 0,
      luck: 0,
    };

    setBuddy(
      newBuddy
    );
  }

  function renameBuddy(
    name: string
  ) {
    const trimmedName =
      name.trim();

    if (
      !trimmedName
    ) {
      return;
    }

    setBuddy(
      current => {
        if (
          !current
        ) {
          return current;
        }

        return {
          ...current,

          name:
            trimmedName,
        };
      }
    );
  }

  function spendBuddyBuildPoint(
    stat: BuddyBuildStat
  ) {
    if (
      buddyUnspentBuildPoints <=
      0
    ) {
      return;
    }

    setBuddy(
      current => {
        if (
          !current
        ) {
          return current;
        }

        switch (
          stat
        ) {
          case "magic":
            return {
              ...current,

              magic:
                current.magic +
                1,
            };

          case "defense":
            return {
              ...current,

              defense:
                current.defense +
                1,
            };

          case "luck":
            return {
              ...current,

              luck:
                current.luck +
                1,
            };
        }
      }
    );
  }

  // ==========================================================
  // ADVENTURE
  // ==========================================================

  function exploreWhisperingWoods() {
    setAdventureProgress(
      current => ({
        ...current,

        whisperingWoods: {
          ...current.whisperingWoods,

          steps:
            current
              .whisperingWoods
              .steps + 1,
        },
      })
    );
  }

  function discoverWhisperingWoods() {
    setAdventureProgress(
      current => ({
        ...current,

        whisperingWoods: {
          ...current.whisperingWoods,

          discoveries:
            current
              .whisperingWoods
              .discoveries +
            1,
        },
      })
    );
  }

  // ==========================================================
  // OPEN TREASURE
  // ==========================================================

  function openWhisperingWoodsTreasure():
    InventoryItem {
    const loot =
      rollWhisperingWoodsLoot();

    const receivedItem:
      InventoryItem = {
      ...loot,

      quantity: 1,
    };

    setAdventureProgress(
      current => ({
        ...current,

        whisperingWoods: {
          ...current.whisperingWoods,

          treasuresOpened:
            current
              .whisperingWoods
              .treasuresOpened +
            1,
        },
      })
    );

    setInventory(
      current => {
        const existing =
          current.find(
            item =>
              item.type ===
              loot.type
          );

        if (
          existing
        ) {
          return current.map(
            item =>
              item.type ===
              loot.type
                ? {
                    ...item,

                    quantity:
                      item.quantity +
                      1,
                  }
                : item
          );
        }

        return [
          ...current,
          receivedItem,
        ];
      }
    );

    setLastTreasureItem(
      receivedItem
    );

    return receivedItem;
  }

  function clearLastTreasureItem() {
    setLastTreasureItem(
      null
    );
  }

  // ==========================================================
  // USE INVENTORY ITEM
  // ==========================================================

  function useInventoryItem(
    itemType: InventoryItemType
  ): boolean {
    const item =
      inventory.find(
        inventoryItem =>
          inventoryItem.type ===
          itemType
      );

    if (
      !item ||
      item.quantity <= 0
    ) {
      return false;
    }

    setInventory(
      current =>
        current
          .map(
            inventoryItem => {
              if (
                inventoryItem.type !==
                itemType
              ) {
                return inventoryItem;
              }

              return {
                ...inventoryItem,

                quantity:
                  inventoryItem.quantity -
                  1,
              };
            }
          )
          .filter(
            inventoryItem =>
              inventoryItem.quantity >
              0
          )
    );

    return true;
  }

  // ==========================================================
  // DEFEAT ENEMY
  // ==========================================================

  function defeatWhisperingWoodsEnemy(
    enemy: AdventureEnemyType
  ) {
    setAdventureProgress(
      current => ({
        ...current,

        whisperingWoods: {
          ...current.whisperingWoods,

          enemiesDefeated: {
            ...current
              .whisperingWoods
              .enemiesDefeated,

            [enemy]:
              current
                .whisperingWoods
                .enemiesDefeated[
                  enemy
                ] + 1,
          },
        },
      })
    );
  }

  // ==========================================================
  // ENEMY LOOT REWARD
  // ==========================================================

  function rewardWhisperingWoodsEnemyLoot(
    enemy: AdventureEnemyType
  ): InventoryItem {
    const loot =
      rollWhisperingWoodsEnemyLoot(
        enemy
      );

    const receivedItem:
      InventoryItem = {
      ...loot,

      quantity: 1,
    };

    setInventory(
      current => {
        const existing =
          current.find(
            item =>
              item.type ===
              loot.type
          );

        if (
          existing
        ) {
          return current.map(
            item =>
              item.type ===
              loot.type
                ? {
                    ...item,

                    quantity:
                      item.quantity +
                      1,
                  }
                : item
          );
        }

        return [
          ...current,
          receivedItem,
        ];
      }
    );

    return receivedItem;
  }

  // ==========================================================
  // QUEST STATUS
  // ==========================================================

  const isQuestOnCooldown =
    Boolean(
      questCooldownUntil &&
        questCooldownUntil.getTime() >
          Date.now()
    );

  // ==========================================================
  // ADD ACTIVITY
  // ==========================================================

  function addActivity(
    activity: AddActivityData
  ) {
    const metric =
      activity.metric ??
      getDefaultMetric(
        activity.type
      );

    const unit =
      activity.unit?.trim() ||
      getDefaultUnit(
        activity.type
      );

    const lifeStats =
      normalizeLifeStats(
        activity.lifeStats
      );

    const newActivity:
      Activity = {
      id: Date.now(),

      type:
        activity.type,

      icon:
        activity.icon,

      title:
        activity.title,

      details:
        activity.details,

      note:
        activity.note,

      xp:
        activity.xp,

      metric,
      unit,

      distance:
        activity.distance,

      time:
        activity.time,

      pages:
        activity.pages,

      sessions:
        activity.sessions,

      amount:
        activity.amount,

      custom:
        activity.custom,

      lifeStats,

      createdAt:
        new Date(),
    };

    setActivities(
      current => [
        newActivity,
        ...current,
      ]
    );

    // --------------------------------------------------------
    // GOAL PROGRESS
    // --------------------------------------------------------

    setGoals(
      current =>
        current.map(
          goal => {
            if (
              goal.activityType !==
              activity.type
            ) {
              return goal;
            }

            const values:
              Partial<
                Record<
                  GoalMetric,
                  number
                >
              > = {
                distance:
                  activity.distance,

                time:
                  activity.time,

                pages:
                  activity.pages,

                sessions:
                  activity.sessions,

                amount:
                  activity.amount,

                custom:
                  activity.custom,
              };

            const amount =
              values[
                goal.metric
              ] ?? 0;

            if (
              amount <= 0
            ) {
              return goal;
            }

            return {
              ...goal,

              current:
                Math.min(
                  goal.current +
                    amount,

                  goal.target
                ),
            };
          }
        )
    );

    // --------------------------------------------------------
    // QUEST PROGRESS
    // --------------------------------------------------------

    setRandomQuest(
      currentQuest => {
        if (
          !currentQuest ||
          currentQuest.status !==
            "accepted"
        ) {
          return currentQuest;
        }

        const amount =
          getQuestProgressAmount(
            currentQuest,
            activity
          );

        if (
          amount <= 0
        ) {
          return currentQuest;
        }

        const newProgress =
          Math.min(
            currentQuest.progress +
              amount,

            currentQuest.target
          );

        const complete =
          newProgress >=
          currentQuest.target;

        return {
          ...currentQuest,

          progress:
            newProgress,

          status:
            complete
              ? "completed"
              : "accepted",

          completedAt:
            complete
              ? new Date()
              : null,
        };
      }
    );
  }

  // ==========================================================
  // RUN
  // ==========================================================

  function addRun(
    run: AddRunData
  ) {
    addActivity({
      type: "running",

      icon: "🏃",

      title: "Running",

      metric:
        "distance",

      unit: "km",

      details:
        `${run.distance} km • ` +
        `${run.time} min`,

      note:
        run.note,

      xp:
        run.xp,

      distance:
        run.distance,

      time:
        run.time,
    });
  }

  // ==========================================================
  // DELETE ACTIVITY
  // ==========================================================

  function deleteActivity(
    activityId: number
  ) {
    setActivities(
      current =>
        current.filter(
          activity =>
            activity.id !==
            activityId
        )
    );
  }

  // ==========================================================
  // GOALS
  // ==========================================================

  function addGoal(
    goal: AddGoalData
  ) {
    const newGoal:
      Goal = {
      id: Date.now(),

      ...goal,

      title:
        goal.title.trim(),

      unit:
        goal.unit.trim(),

      current: 0,

      createdAt:
        new Date(),
    };

    setGoals(
      current => [
        newGoal,
        ...current,
      ]
    );
  }

  function updateGoalProgress(
    goalId: number,
    amount: number
  ) {
    setGoals(
      current =>
        current.map(
          goal =>
            goal.id ===
            goalId
              ? {
                  ...goal,

                  current:
                    Math.min(
                      Math.max(
                        goal.current +
                          amount,
                        0
                      ),

                      goal.target
                    ),
                }
              : goal
        )
    );
  }

  function deleteGoal(
    goalId: number
  ) {
    setGoals(
      current =>
        current.filter(
          goal =>
            goal.id !==
            goalId
        )
    );
  }

  // ==========================================================
  // RANDOM QUEST
  // ==========================================================

  function generateRandomQuest() {
    if (
      randomQuest
    ) {
      return;
    }

    if (
      questCooldownUntil &&
      questCooldownUntil.getTime() >
        Date.now()
    ) {
      return;
    }

    const quest =
      chooseRandomQuest(
        activities
      );

    setQuestCooldownUntil(
      null
    );

    setRandomQuest(
      quest
    );
  }

  function rerollRandomQuest() {
    if (
      !randomQuest ||
      randomQuest.status !==
        "available"
    ) {
      return;
    }

    const nextQuest =
      chooseRandomQuest(
        activities,
        randomQuest.templateId
      );

    if (
      nextQuest
    ) {
      setRandomQuest(
        nextQuest
      );
    }
  }

  function acceptRandomQuest() {
    setRandomQuest(
      currentQuest => {
        if (
          !currentQuest ||
          currentQuest.status !==
            "available"
        ) {
          return currentQuest;
        }

        return {
          ...currentQuest,

          progress: 0,

          status:
            "accepted",

          acceptedAt:
            new Date(),

          completedAt:
            null,
        };
      }
    );
  }

  function claimRandomQuest() {
    setRandomQuest(
      currentQuest => {
        if (
          !currentQuest ||
          currentQuest.status !==
            "completed"
        ) {
          return currentQuest;
        }

        setBonusXP(
          current =>
            current +
            currentQuest.rewardXP
        );

        setQuestCooldownUntil(
          new Date(
            Date.now() +
              QUEST_COOLDOWN_MS
          )
        );

        return null;
      }
    );
  }

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AppContext.Provider
      value={{
        // XP

        totalXP,
        activityXP,
        bonusXP,

        level,
        xpInCurrentLevel,
        xpNeededForNextLevel,

        // DATA

        activities,
        goals,
        achievementUnlocks,

        // BUDDY

        buddy,
        buddyLifeStats,

        buddyBuildPointsEarned,
        buddyBuildPointsSpent,
        buddyUnspentBuildPoints,

        createBuddy,
        renameBuddy,
        spendBuddyBuildPoint,

        // ADVENTURE

        adventureProgress,

        exploreWhisperingWoods,
        discoverWhisperingWoods,

        openWhisperingWoodsTreasure,

        defeatWhisperingWoodsEnemy,

        rewardWhisperingWoodsEnemyLoot,

        // INVENTORY

        inventory,

        lastTreasureItem,

        clearLastTreasureItem,

        useInventoryItem,

        // QUEST

        randomQuest,
        questCooldownUntil,
        isQuestOnCooldown,

        // ACTIVITY

        addActivity,
        addRun,
        deleteActivity,

        // GOALS

        addGoal,
        updateGoalProgress,
        deleteGoal,

        // RANDOM QUEST

        generateRandomQuest,
        rerollRandomQuest,
        acceptRandomQuest,
        claimRandomQuest,

        // APP

        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useApp() {
  const context =
    useContext(
      AppContext
    );

  if (
    !context
  ) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}