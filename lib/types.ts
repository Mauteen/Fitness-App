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
