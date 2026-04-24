import { create } from "zustand";
import { CustomWorkoutPlan, CustomWorkoutDay, CustomExercise } from "@/lib/types";

const STORAGE_KEY = "FITGUIDE_CUSTOM_PLANS";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function load(): CustomWorkoutPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(plans: CustomWorkoutPlan[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch {}
}

function updatePlan(
  plans: CustomWorkoutPlan[],
  planId: string,
  updater: (p: CustomWorkoutPlan) => CustomWorkoutPlan
): CustomWorkoutPlan[] {
  return plans.map(p => (p.id === planId ? updater(p) : p));
}

function updateDay(
  plan: CustomWorkoutPlan,
  dayId: string,
  updater: (d: CustomWorkoutDay) => CustomWorkoutDay
): CustomWorkoutPlan {
  return { ...plan, days: plan.days.map(d => (d.id === dayId ? updater(d) : d)) };
}

interface CustomPlanState {
  plans: CustomWorkoutPlan[];
  hydrated: boolean;
  hydrate: () => void;
  createPlan: (name: string) => string;
  updatePlanName: (planId: string, name: string) => void;
  deletePlan: (planId: string) => void;
  addDay: (planId: string, dayName: string) => string;
  updateDayName: (planId: string, dayId: string, name: string) => void;
  removeDay: (planId: string, dayId: string) => void;
  addExercisesToDay: (planId: string, dayId: string, exercises: CustomExercise[]) => void;
  removeExerciseFromDay: (planId: string, dayId: string, exerciseId: string) => void;
  moveExercise: (planId: string, dayId: string, from: number, to: number) => void;
}

export const useCustomPlanStore = create<CustomPlanState>((set, get) => ({
  plans: [],
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({ plans: load(), hydrated: true });
  },

  createPlan(name) {
    const id = uid();
    const plan: CustomWorkoutPlan = { id, name, days: [], createdAt: new Date().toISOString() };
    const plans = [plan, ...get().plans];
    set({ plans });
    save(plans);
    return id;
  },

  updatePlanName(planId, name) {
    const plans = updatePlan(get().plans, planId, p => ({ ...p, name }));
    set({ plans });
    save(plans);
  },

  deletePlan(planId) {
    const plans = get().plans.filter(p => p.id !== planId);
    set({ plans });
    save(plans);
  },

  addDay(planId, dayName) {
    const dayId = uid();
    const day: CustomWorkoutDay = { id: dayId, name: dayName, exercises: [] };
    const plans = updatePlan(get().plans, planId, p => ({ ...p, days: [...p.days, day] }));
    set({ plans });
    save(plans);
    return dayId;
  },

  updateDayName(planId, dayId, name) {
    const plans = updatePlan(get().plans, planId, p => updateDay(p, dayId, d => ({ ...d, name })));
    set({ plans });
    save(plans);
  },

  removeDay(planId, dayId) {
    const plans = updatePlan(get().plans, planId, p => ({
      ...p,
      days: p.days.filter(d => d.id !== dayId),
    }));
    set({ plans });
    save(plans);
  },

  addExercisesToDay(planId, dayId, exercises) {
    const plans = updatePlan(get().plans, planId, p =>
      updateDay(p, dayId, d => {
        const existingIds = new Set(d.exercises.map(e => e.exerciseId));
        const newOnes = exercises.filter(e => !existingIds.has(e.exerciseId));
        return { ...d, exercises: [...d.exercises, ...newOnes] };
      })
    );
    set({ plans });
    save(plans);
  },

  removeExerciseFromDay(planId, dayId, exerciseId) {
    const plans = updatePlan(get().plans, planId, p =>
      updateDay(p, dayId, d => ({
        ...d,
        exercises: d.exercises.filter(e => e.exerciseId !== exerciseId),
      }))
    );
    set({ plans });
    save(plans);
  },

  moveExercise(planId, dayId, from, to) {
    const plans = updatePlan(get().plans, planId, p =>
      updateDay(p, dayId, d => {
        const exs = [...d.exercises];
        const [moved] = exs.splice(from, 1);
        exs.splice(to, 0, moved);
        return { ...d, exercises: exs };
      })
    );
    set({ plans });
    save(plans);
  },
}));
