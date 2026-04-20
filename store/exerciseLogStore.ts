import { create } from "zustand";
import { ExerciseLog, ExerciseSet } from "@/lib/types";

const STORAGE_KEY = "FITGUIDE_EXERCISE_LOGS";

type LogsByExercise = Record<string, ExerciseLog[]>;

interface ExerciseLogState {
  logs: LogsByExercise;
  hydrated: boolean;
  hydrate: () => void;
  saveLog: (exerciseId: string, exerciseName: string, sets: ExerciseSet[], notes: string) => void;
  getLogsForExercise: (exerciseId: string) => ExerciseLog[];
  getLastLogForExercise: (exerciseId: string) => ExerciseLog | null;
}

function loadFromStorage(): LogsByExercise {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(logs: LogsByExercise) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {}
}

export const useExerciseLogStore = create<ExerciseLogState>((set, get) => ({
  logs: {},
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({ logs: loadFromStorage(), hydrated: true });
  },

  saveLog(exerciseId, exerciseName, sets, notes) {
    const newLog: ExerciseLog = {
      id: `${exerciseId}-${Date.now()}`,
      exerciseId,
      exerciseName,
      date: new Date().toISOString().split("T")[0],
      sets,
      notes,
    };
    const prev = get().logs[exerciseId] ?? [];
    const updated = { ...get().logs, [exerciseId]: [newLog, ...prev] };
    set({ logs: updated });
    saveToStorage(updated);
  },

  getLogsForExercise(exerciseId) {
    return get().logs[exerciseId] ?? [];
  },

  getLastLogForExercise(exerciseId) {
    const entries = get().logs[exerciseId];
    return entries && entries.length > 0 ? entries[0] : null;
  },
}));
