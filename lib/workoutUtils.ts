import workoutsData from "@/data/workouts.json";
import exercisesData from "@/data/exercises.json";
import { Exercise, WorkoutDay, WorkoutWithExercises } from "./types";

const workouts = workoutsData as WorkoutDay[];
const exercises = exercisesData as Exercise[];

export function getAllWorkouts(): WorkoutDay[] {
  return workouts;
}

export function getWorkoutByDay(day: number): WorkoutWithExercises | null {
  const workout = workouts.find((w) => w.day === day);
  if (!workout) return null;

  const workoutExercises = workout.exerciseIds
    .map((id) => exercises.find((e) => e.id === id))
    .filter(Boolean) as Exercise[];

  return { ...workout, exercises: workoutExercises };
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

// Maps JS getDay() (0=Sun … 6=Sat) to program day 1–7
// Mon=1, Tue=2, Wed=3(rest), Thu=4, Fri=5, Sat=6, Sun=7(rest)
const DAY_MAP: Record<number, number> = {
  1: 1, // Monday    → Chest & Triceps
  2: 2, // Tuesday   → Back & Biceps
  3: 3, // Wednesday → Active Recovery
  4: 4, // Thursday  → Legs
  5: 5, // Friday    → Shoulders
  6: 6, // Saturday  → Full Body
  0: 7, // Sunday    → Rest Day
};

export function getTodayWorkoutDay(): number {
  const jsDay = new Date().getDay(); // 0=Sun, 1=Mon … 6=Sat
  return DAY_MAP[jsDay];
}

export function getTodayName(): string {
  return new Date().toLocaleDateString("en-NG", { weekday: "long" });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Formats a Date as "Thu, 19 Mar"
export function formatShortDate(date: Date): string {
  const day = date.toLocaleDateString("en-GB", { weekday: "short" });
  const num = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  return `${day}, ${num} ${month}`;
}

// Returns the Date for each program day (1=Mon … 7=Sun) in the current week
export function getWeekDates(): Record<number, Date> {
  const today = new Date();
  const jsDay = today.getDay(); // 0=Sun … 6=Sat
  // Monday of this week
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((jsDay === 0 ? 7 : jsDay) - 1));
  monday.setHours(0, 0, 0, 0);

  const result: Record<number, Date> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result[i + 1] = d; // day 1 = Monday … day 7 = Sunday
  }
  return result;
}

export function formatRest(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function getExerciseCategory(exercise: Exercise): string {
  const muscle = exercise.muscle.toLowerCase();
  const keywords: [string, string][] = [
    ["chest",     "Chest"],
    ["lats",      "Back"],
    ["back",      "Back"],
    ["quad",      "Legs"],
    ["hamstring", "Legs"],
    ["shoulder",  "Shoulders"],
    ["deltoid",   "Shoulders"],
    ["bicep",     "Arms"],
    ["tricep",    "Arms"],
    ["core",      "Core"],
    ["abs",       "Core"],
  ];
  for (const [kw, cat] of keywords) {
    if (muscle.includes(kw)) return cat;
  }
  return "Other";
}
