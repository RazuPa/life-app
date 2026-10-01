/*
 * LIFE APP PROGRESSION ENGINE
 *
 * This file is the single source of truth for XP and levels.
 *
 * Player levels and activity/skill levels currently use the same
 * progression system:
 *
 * 500 XP = 1 level
 *
 * Later we can replace this with a progression curve without
 * rewriting every screen in the app.
 */

export const XP_PER_LEVEL = 500;

/**
 * Returns the level belonging to a lifetime XP amount.
 *
 * Examples:
 * 0 XP    -> Level 1
 * 499 XP  -> Level 1
 * 500 XP  -> Level 2
 * 1000 XP -> Level 3
 */
export function getLevelFromXP(xp: number): number {
  const safeXP = Math.max(0, xp);

  return Math.floor(safeXP / XP_PER_LEVEL) + 1;
}

/**
 * Returns how much XP has been earned inside the current level.
 *
 * Examples:
 * 220 XP -> 220
 * 500 XP -> 0
 * 650 XP -> 150
 */
export function getXPInCurrentLevel(
  xp: number
): number {
  const safeXP = Math.max(0, xp);

  return safeXP % XP_PER_LEVEL;
}

/**
 * Returns progression through the current level from 0 to 1.
 *
 * This value can be passed directly to <ProgressBar />.
 */
export function getLevelProgress(
  xp: number
): number {
  return (
    getXPInCurrentLevel(xp) /
    XP_PER_LEVEL
  );
}

/**
 * Returns how much XP is still required to reach the next level.
 *
 * Examples:
 * 220 XP -> 280 XP remaining
 * 499 XP -> 1 XP remaining
 * 500 XP -> 500 XP remaining
 */
export function getXPToNextLevel(
  xp: number
): number {
  const xpInLevel =
    getXPInCurrentLevel(xp);

  return XP_PER_LEVEL - xpInLevel;
}

/**
 * Convenience helper for screens that need all progression
 * information at once.
 */
export function getProgression(xp: number) {
  const safeXP = Math.max(0, xp);

  const level =
    getLevelFromXP(safeXP);

  const xpInLevel =
    getXPInCurrentLevel(safeXP);

  const progress =
    getLevelProgress(safeXP);

  const xpToNextLevel =
    getXPToNextLevel(safeXP);

  return {
    totalXP: safeXP,
    level,
    xpInLevel,
    xpForLevel: XP_PER_LEVEL,
    progress,
    xpToNextLevel,
  };
}

/**
 * Returns true when an XP reward crosses at least one
 * level boundary.
 */
export function didLevelUp(
  xpBefore: number,
  xpAfter: number
): boolean {
  return (
    getLevelFromXP(xpAfter) >
    getLevelFromXP(xpBefore)
  );
}