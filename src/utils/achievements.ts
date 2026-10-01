import type {
  Activity,
  AchievementUnlock,
} from "../context/AppContext";

// ============================================================
// TYPES
// ============================================================

export type AchievementCategory =
  | "general"
  | "fitness"
  | "learning";

export type Achievement = {
  id: string;

  icon: string;
  title: string;
  description: string;

  category: AchievementCategory;

  unlocked: boolean;
  unlockedAt: Date | null;

  progress: number;
  target: number;

  progressText: string;
};

export type AchievementSummary = {
  achievements: Achievement[];

  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];

  unlockedCount: number;
  totalCount: number;

  totalDistance: number;
  totalPages: number;
  totalGymSessions: number;
  totalTime: number;
};

// ============================================================
// HELPERS
// ============================================================

function clampProgress(
  value: number,
  target: number
) {
  return Math.min(
    Math.max(value, 0),
    target
  );
}

function formatNumber(
  value: number
) {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(1);
}

function getUnlockDate(
  achievementId: string,
  achievementUnlocks: AchievementUnlock[]
) {
  const unlock =
    achievementUnlocks.find(
      item =>
        item.achievementId ===
        achievementId
    );

  return unlock?.unlockedAt ?? null;
}

// ============================================================
// ACHIEVEMENT ENGINE
// ============================================================

export function getAchievements(
  activities: Activity[],
  totalXP: number,
  achievementUnlocks: AchievementUnlock[] = []
): AchievementSummary {
  // ==========================================================
  // LIFETIME TOTALS
  // ==========================================================

  const totalDistance =
    activities.reduce(
      (sum, activity) =>
        sum +
        (activity.distance ?? 0),
      0
    );

  const totalPages =
    activities.reduce(
      (sum, activity) =>
        sum +
        (activity.pages ?? 0),
      0
    );

  const totalTime =
    activities.reduce(
      (sum, activity) =>
        sum +
        (activity.time ?? 0),
      0
    );

  const totalGymSessions =
    activities
      .filter(
        activity =>
          activity.type === "gym"
      )
      .reduce(
        (sum, activity) =>
          sum +
          (activity.sessions ?? 0),
        0
      );

  // ==========================================================
  // PERMANENT UNLOCK LOOKUP
  // ==========================================================

  const unlockedIds =
    new Set(
      achievementUnlocks.map(
        unlock =>
          unlock.achievementId
      )
    );

  // ==========================================================
  // ACHIEVEMENTS
  // ==========================================================

  const achievements: Achievement[] = [
    // --------------------------------------------------------
    // GENERAL
    // --------------------------------------------------------

    {
      id: "first-step",

      icon: "🏁",

      title: "First Step",

      description:
        "Log your first activity.",

      category: "general",

      unlocked:
        unlockedIds.has(
          "first-step"
        ),

      unlockedAt:
        getUnlockDate(
          "first-step",
          achievementUnlocks
        ),

      progress:
        activities.length,

      target: 1,

      progressText:
        `${clampProgress(
          activities.length,
          1
        )} / 1 activity`,
    },

    {
      id: "getting-started",

      icon: "⚡",

      title: "Getting Started",

      description:
        "Earn 100 lifetime XP.",

      category: "general",

      unlocked:
        unlockedIds.has(
          "getting-started"
        ),

      unlockedAt:
        getUnlockDate(
          "getting-started",
          achievementUnlocks
        ),

      progress:
        totalXP,

      target: 100,

      progressText:
        `${clampProgress(
          totalXP,
          100
        )} / 100 XP`,
    },

    {
      id: "xp-hunter",

      icon: "🏆",

      title: "XP Hunter",

      description:
        "Earn 500 lifetime XP.",

      category: "general",

      unlocked:
        unlockedIds.has(
          "xp-hunter"
        ),

      unlockedAt:
        getUnlockDate(
          "xp-hunter",
          achievementUnlocks
        ),

      progress:
        totalXP,

      target: 500,

      progressText:
        `${clampProgress(
          totalXP,
          500
        )} / 500 XP`,
    },

    // --------------------------------------------------------
    // FITNESS
    // --------------------------------------------------------

    {
      id: "on-the-move",

      icon: "🏃",

      title: "On the Move",

      description:
        "Travel 10 km through tracked activities.",

      category: "fitness",

      unlocked:
        unlockedIds.has(
          "on-the-move"
        ),

      unlockedAt:
        getUnlockDate(
          "on-the-move",
          achievementUnlocks
        ),

      progress:
        totalDistance,

      target: 10,

      progressText:
        `${formatNumber(
          clampProgress(
            totalDistance,
            10
          )
        )} / 10 km`,
    },

    {
      id: "regular",

      icon: "💪",

      title: "Regular",

      description:
        "Complete 10 gym sessions.",

      category: "fitness",

      unlocked:
        unlockedIds.has(
          "regular"
        ),

      unlockedAt:
        getUnlockDate(
          "regular",
          achievementUnlocks
        ),

      progress:
        totalGymSessions,

      target: 10,

      progressText:
        `${formatNumber(
          clampProgress(
            totalGymSessions,
            10
          )
        )} / 10 sessions`,
    },

    // --------------------------------------------------------
    // LEARNING
    // --------------------------------------------------------

    {
      id: "bookworm",

      icon: "📚",

      title: "Bookworm",

      description:
        "Read 100 tracked pages.",

      category: "learning",

      unlocked:
        unlockedIds.has(
          "bookworm"
        ),

      unlockedAt:
        getUnlockDate(
          "bookworm",
          achievementUnlocks
        ),

      progress:
        totalPages,

      target: 100,

      progressText:
        `${formatNumber(
          clampProgress(
            totalPages,
            100
          )
        )} / 100 pages`,
    },
  ];

  // ==========================================================
  // UNLOCKED
  //
  // Newest unlock first.
  // ==========================================================

  const unlockedAchievements =
    achievements
      .filter(
        achievement =>
          achievement.unlocked
      )
      .sort(
        (a, b) =>
          (
            b.unlockedAt
              ?.getTime() ?? 0
          ) -
          (
            a.unlockedAt
              ?.getTime() ?? 0
          )
      );

  // ==========================================================
  // TO ACHIEVE
  //
  // Closest achievement first.
  // ==========================================================

  const lockedAchievements =
    achievements
      .filter(
        achievement =>
          !achievement.unlocked
      )
      .sort(
        (a, b) => {
          const aProgress =
            a.target > 0
              ? a.progress /
                a.target
              : 0;

          const bProgress =
            b.target > 0
              ? b.progress /
                b.target
              : 0;

          return (
            bProgress -
            aProgress
          );
        }
      );

  // ==========================================================
  // SUMMARY
  // ==========================================================

  return {
    achievements,

    unlockedAchievements,
    lockedAchievements,

    unlockedCount:
      unlockedAchievements.length,

    totalCount:
      achievements.length,

    totalDistance,
    totalPages,
    totalGymSessions,
    totalTime,
  };
}