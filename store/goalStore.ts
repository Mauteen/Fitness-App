import { create } from "zustand";
import { GoalType, GoalMeta } from "@/lib/types";

const STORAGE_KEY = "FITGUIDE_GOAL";

interface GoalState {
  goal: GoalType;
  hydrated: boolean;
  hydrate: () => void;
  setGoal: (goal: GoalType) => void;
}

export const GOAL_META: Record<GoalType, GoalMeta> = {
  weight_loss: {
    label: "Fat Loss",
    tagline: "Burn fat, stay lean",
    color: "#f97316",
    emoji: "🔥",
  },
  muscle_gain: {
    label: "Muscle Gain",
    tagline: "Build size and strength",
    color: "#3b82f6",
    emoji: "💪",
  },
  general_fitness: {
    label: "General Fitness",
    tagline: "Stay active and balanced",
    color: "#22c55e",
    emoji: "⚡",
  },
};

export const useGoalStore = create<GoalState>((set) => ({
  goal: "general_fitness",
  hydrated: false,

  hydrate() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY) as GoalType | null;
    const valid: GoalType[] = ["weight_loss", "muscle_gain", "general_fitness"];
    set({
      goal: saved && valid.includes(saved) ? saved : "general_fitness",
      hydrated: true,
    });
  },

  setGoal(goal: GoalType) {
    localStorage.setItem(STORAGE_KEY, goal);
    set({ goal });
  },
}));
