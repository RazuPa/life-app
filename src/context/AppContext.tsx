import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

export type ActivityType =
  | "running"
  | "walking"
  | "reading"
  | "gym"
  | "coding"
  | "studying"
  | "custom";

export type GoalMetric =
  | "distance"
  | "time"
  | "pages"
  | "sessions"
  | "amount"
  | "custom";

export type Activity = {
  id: number;
  type: ActivityType;
  icon: string;
  title: string;
  details: string;
  note: string;
  xp: number;
  createdAt: Date;
};

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

type AddRunData = {
  distance: number;
  time: number;
  note: string;
  xp: number;
};

export type AddActivityData = {
  type: ActivityType;

  icon: string;
  title: string;
  details: string;

  note: string;
  xp: number;

  distance?: number;
  time?: number;
  pages?: number;
  sessions?: number;
  amount?: number;
  custom?: number;
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

type AppContextType = {
  totalXP: number;

  level: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;

  activities: Activity[];
  goals: Goal[];

  addRun: (run: AddRunData) => void;

  addActivity: (
    activity: AddActivityData
  ) => void;

  deleteActivity: (
    activityId: number
  ) => void;

  addGoal: (goal: AddGoalData) => void;

  updateGoalProgress: (
    goalId: number,
    amount: number
  ) => void;

  deleteGoal: (goalId: number) => void;

  isLoading: boolean;
};

const AppContext =
  createContext<AppContextType | undefined>(
    undefined
  );

const XP_PER_LEVEL = 500;

const ACTIVITIES_STORAGE_KEY =
  "@life_app_activities";

const GOALS_STORAGE_KEY =
  "@life_app_goals";

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [goals, setGoals] =
    useState<Goal[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveActivities();
    }
  }, [activities, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveGoals();
    }
  }, [goals, isLoading]);

  async function loadData() {
    try {
      const [
        savedActivities,
        savedGoals,
      ] = await Promise.all([
        AsyncStorage.getItem(
          ACTIVITIES_STORAGE_KEY
        ),

        AsyncStorage.getItem(
          GOALS_STORAGE_KEY
        ),
      ]);

      if (savedActivities !== null) {
        const parsedActivities =
          JSON.parse(savedActivities);

        const restoredActivities =
          parsedActivities.map(
            (activity: Activity) => ({
              ...activity,

              createdAt: new Date(
                activity.createdAt
              ),
            })
          );

        setActivities(
          restoredActivities
        );
      }

      if (savedGoals !== null) {
        const parsedGoals =
          JSON.parse(savedGoals);

        const restoredGoals =
          parsedGoals.map(
            (goal: Goal) => {
              let activityType =
                goal.activityType;

              let metric =
                goal.metric;

              if (!activityType) {
                if (
                  goal.unit
                    ?.trim()
                    .toLowerCase() ===
                  "km"
                ) {
                  activityType =
                    "running";
                } else {
                  activityType =
                    "custom";
                }
              }

              if (!metric) {
                if (
                  goal.unit
                    ?.trim()
                    .toLowerCase() ===
                  "km"
                ) {
                  metric =
                    "distance";
                } else {
                  metric =
                    "custom";
                }
              }

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
          );

        setGoals(restoredGoals);
      }
    } catch (error) {
      console.log(
        "Could not load app data:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function saveActivities() {
    try {
      await AsyncStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify(activities)
      );
    } catch (error) {
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
        JSON.stringify(goals)
      );
    } catch (error) {
      console.log(
        "Could not save goals:",
        error
      );
    }
  }

  const totalXP =
    activities.reduce(
      (total, activity) =>
        total + activity.xp,
      0
    );

  const level =
    Math.floor(
      totalXP / XP_PER_LEVEL
    ) + 1;

  const xpInCurrentLevel =
    totalXP % XP_PER_LEVEL;

  const xpNeededForNextLevel =
    XP_PER_LEVEL;

  /*
    GENERAL ACTIVITY LOGGER

    This is now the main function for
    adding activities.

    It:
    1. Saves the activity.
    2. Adds XP through activity history.
    3. Updates matching goals.
  */

  function addActivity(
    activity: AddActivityData
  ) {
    const newActivity: Activity = {
      id: Date.now(),

      type: activity.type,

      icon: activity.icon,

      title: activity.title,

      details: activity.details,

      note: activity.note,

      xp: activity.xp,

      createdAt: new Date(),
    };

    setActivities(
      (currentActivities) => [
        newActivity,
        ...currentActivities,
      ]
    );

    setGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (
          goal.activityType !==
          activity.type
        ) {
          return goal;
        }

        let amountToAdd = 0;

        if (
          goal.metric === "distance"
        ) {
          amountToAdd =
            activity.distance ?? 0;
        }

        if (goal.metric === "time") {
          amountToAdd =
            activity.time ?? 0;
        }

        if (goal.metric === "pages") {
          amountToAdd =
            activity.pages ?? 0;
        }

        if (
          goal.metric === "sessions"
        ) {
          amountToAdd =
            activity.sessions ?? 0;
        }

        if (goal.metric === "amount") {
          amountToAdd =
            activity.amount ?? 0;
        }

        if (goal.metric === "custom") {
          amountToAdd =
            activity.custom ?? 0;
        }

        if (amountToAdd <= 0) {
          return goal;
        }

        const newProgress = Math.min(
          goal.current + amountToAdd,
          goal.target
        );

        return {
          ...goal,

          current: newProgress,
        };
      })
    );
  }

  /*
    RUNNING

    We keep addRun so running.tsx does
    not need to change yet.

    It now simply uses the general
    activity system above.
  */

  function addRun(run: AddRunData) {
    addActivity({
      type: "running",

      icon: "🏃",

      title: "Running",

      details:
        `${run.distance} km • ` +
        `${run.time} min`,

      note: run.note,

      xp: run.xp,

      distance: run.distance,

      time: run.time,
    });
  }

  /*
    DELETE ACTIVITY

    Deleting an activity currently
    removes its XP because XP is derived
    from activity history.

    Goal progress is not reversed yet.
    We can add a transaction ledger
    later.
  */

  function deleteActivity(
    activityId: number
  ) {
    setActivities(
      (currentActivities) =>
        currentActivities.filter(
          (activity) =>
            activity.id !== activityId
        )
    );
  }

  function addGoal(
    goal: AddGoalData
  ) {
    const newGoal: Goal = {
      id: Date.now(),

      title: goal.title.trim(),

      icon: goal.icon,

      activityType:
        goal.activityType,

      metric: goal.metric,

      target: goal.target,

      current: 0,

      unit: goal.unit.trim(),

      deadline: goal.deadline,

      createdAt: new Date(),
    };

    setGoals(
      (currentGoals) => [
        newGoal,
        ...currentGoals,
      ]
    );
  }

  function updateGoalProgress(
    goalId: number,
    amount: number
  ) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const updatedProgress =
          Math.min(
            Math.max(
              goal.current + amount,
              0
            ),
            goal.target
          );

        return {
          ...goal,

          current:
            updatedProgress,
        };
      })
    );
  }

  function deleteGoal(
    goalId: number
  ) {
    setGoals(
      (currentGoals) =>
        currentGoals.filter(
          (goal) =>
            goal.id !== goalId
        )
    );
  }

  return (
    <AppContext.Provider
      value={{
        totalXP,

        level,
        xpInCurrentLevel,
        xpNeededForNextLevel,

        activities,
        goals,

        addRun,
        addActivity,

        deleteActivity,

        addGoal,
        updateGoalProgress,
        deleteGoal,

        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context =
    useContext(AppContext);

  if (context === undefined) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}