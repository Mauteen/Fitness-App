export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  muscle: string;
  difficulty: string;
  videoId: string;
  instructions: string[];
  tips: string;
}

export interface WorkoutDay {
  day: number;
  name: string;
  focus: string;
  description: string;
  exerciseIds: string[];
}

export interface WorkoutWithExercises extends WorkoutDay {
  exercises: Exercise[];
}

export interface MealItem {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  prepTime: string;
  tip: string;
}

export interface MealDay {
  day: number;
  theme: string;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snack: MealItem;
  };
}

export interface ProgressData {
  completedDates: string[];
  streak: number;
  lastCompletedDate: string | null;
}

export type GoalType = "weight_loss" | "muscle_gain" | "general_fitness";

export interface ExerciseSet {
  setNum: number;
  reps: number | "";
  weightKg: number | "";
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  sets: ExerciseSet[];
  notes: string;
}

export interface GoalMeta {
  label: string;
  tagline: string;
  color: string;
  emoji: string;
}

export interface CustomExercise {
  exerciseId: string;
  name: string;
  muscle: string;
}

export interface CustomWorkoutDay {
  id: string;
  name: string;
  dayOfWeek?: number;
  exercises: CustomExercise[];
}

export interface CustomWorkoutPlan {
  id: string;
  name: string;
  days: CustomWorkoutDay[];
  createdAt: string;
}
