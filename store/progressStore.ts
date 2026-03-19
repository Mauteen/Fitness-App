import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

interface ProgressState {
  completedDates: string[];
  streak: number;
  lastCompletedDate: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  markComplete: (workoutDay: number) => Promise<void>;
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

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedDates: [],
  streak: 0,
  lastCompletedDate: null,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ completedDates: [], streak: 0, lastCompletedDate: null, hydrated: true });
        return;
      }

      const { data } = await supabase
        .from("user_progress")
        .select("completed_dates, last_completed_date")
        .eq("user_id", user.id)
        .single();

      const completedDates: string[] = data?.completed_dates ?? [];
      const lastCompletedDate: string | null = data?.last_completed_date ?? null;

      set({
        completedDates,
        lastCompletedDate,
        streak: calcStreak(completedDates),
        hydrated: true,
      });
    } catch {
      set({ completedDates: [], streak: 0, lastCompletedDate: null, hydrated: true });
    }
  },

  async markComplete(_workoutDay: number) {
    const today = todayStr();
    const { completedDates } = get();
    if (completedDates.includes(today)) return;

    const updated = [...completedDates, today];
    const streak = calcStreak(updated);
    set({ completedDates: updated, lastCompletedDate: today, streak });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("user_progress").upsert({
        user_id: user.id,
        completed_dates: updated,
        last_completed_date: today,
      });
    } catch {
      // silently fail — UI already updated optimistically
    }
  },

  isCompletedToday() {
    return get().completedDates.includes(todayStr());
  },
}));
