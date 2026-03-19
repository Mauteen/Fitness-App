import { create } from "zustand";

const STORAGE_KEY = "FITGUIDE_PROGRESS";

interface ProgressState {
  completedDates: string[];
  streak: number;
  lastCompletedDate: string | null;
  hydrated: boolean;
  hydrate: () => void;
  markComplete: (workoutDay: number) => void;
  isCompletedToday: () => boolean;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // streak only counts if completed today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function loadFromStorage(): { completedDates: string[]; lastCompletedDate: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedDates: [], lastCompletedDate: null };
    const parsed = JSON.parse(raw);
    return {
      completedDates: Array.isArray(parsed.completedDates) ? parsed.completedDates : [],
      lastCompletedDate: parsed.lastCompletedDate ?? null,
    };
  } catch {
    return { completedDates: [], lastCompletedDate: null };
  }
}

function saveToStorage(completedDates: string[], lastCompletedDate: string | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedDates, lastCompletedDate }));
  } catch {
    // storage may be unavailable
  }
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedDates: [],
  streak: 0,
  lastCompletedDate: null,
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    const { completedDates, lastCompletedDate } = loadFromStorage();
    set({
      completedDates,
      lastCompletedDate,
      streak: calcStreak(completedDates),
      hydrated: true,
    });
  },

  markComplete(_workoutDay: number) {
    const today = todayStr();
    const { completedDates } = get();
    if (completedDates.includes(today)) return; // already done today

    const updated = [...completedDates, today];
    const streak = calcStreak(updated);
    saveToStorage(updated, today);
    set({ completedDates: updated, lastCompletedDate: today, streak });
  },

  isCompletedToday() {
    return get().completedDates.includes(todayStr());
  },
}));
