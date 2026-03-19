"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getWorkoutByDay, getTodayWorkoutDay } from "@/lib/workoutUtils";
import ExerciseCard from "@/components/ExerciseCard";
import ExerciseGuidanceModal from "@/components/ExerciseGuidanceModal";
import { Exercise } from "@/lib/types";
import { useProgressStore } from "@/store/progressStore";

export default function WorkoutDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = use(params);
  const dayNum = parseInt(day, 10);
  const workout = getWorkoutByDay(dayNum);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [todayDay, setTodayDay] = useState<number | null>(null);
  const { markComplete, isCompletedToday, hydrate } = useProgressStore();

  useEffect(() => {
    hydrate();
    setTodayDay(getTodayWorkoutDay());
  }, [hydrate]);

  const isToday = todayDay === dayNum;
  const alreadyDone = isCompletedToday();

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500">Workout not found.</p>
      </div>
    );
  }

  const isRestDay = workout.exerciseIds.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        body { background: #0a0a0a; }
        .page-font { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Bebas Neue', sans-serif; }
        .back-btn {
          font-family: 'DM Sans', sans-serif;
          color: #555;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: color 0.15s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .back-btn:hover { color: #999; }
        .focus-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #22c55e14;
          border: 1px solid #22c55e33;
          color: #22c55e;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
        }
        .day-number {
          font-family: 'Bebas Neue', sans-serif;
          color: #22c55e22;
          font-size: 6rem;
          line-height: 1;
          position: absolute;
          right: 0;
          top: -0.5rem;
          user-select: none;
          pointer-events: none;
        }
        .workout-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.03em;
          line-height: 1;
          color: white;
        }
        .description-text {
          font-family: 'DM Sans', sans-serif;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .divider {
          border: none;
          border-top: 1px solid #1a1a1a;
        }
        .section-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.7rem;
          color: #444;
          text-transform: uppercase;
        }
        .rest-day-card {
          background: linear-gradient(135deg, #111 0%, #0d0d0d 100%);
          border: 1px solid #1a1a1a;
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
        }
        .rest-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }
        .count-badge {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: #555;
        }
        .complete-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #22c55e;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 1rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 24px rgba(34,197,94,0.25);
        }
        .complete-btn:hover {
          background: #16a34a;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(34,197,94,0.35);
        }
        .complete-btn:active { transform: scale(0.98); }
        .complete-btn.done {
          background: #1a1a1a;
          border: 1px solid #22c55e44;
          color: #22c55e;
          box-shadow: none;
          cursor: default;
        }
        .complete-btn.done:hover { transform: none; }
      `}</style>

      <div className="page-font min-h-screen bg-[#0a0a0a] px-4 pb-16 pt-6 max-w-2xl mx-auto">
        {/* Back */}
        <Link href="/" className="back-btn mb-8 inline-flex">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="relative mb-8">
          <span className="day-number">D{dayNum}</span>
          <div className="flex items-center gap-2 mb-3">
            <span className="focus-tag">{workout.focus}</span>
          </div>
          <h1 className="workout-title text-5xl md:text-6xl mb-3">{workout.name}</h1>
          <p className="description-text">{workout.description}</p>
        </div>

        <hr className="divider mb-8" />

        {/* Exercises or Rest */}
        {isRestDay ? (
          <div className="rest-day-card">
            <span className="rest-icon">🛌</span>
            <h2 className="workout-title text-3xl text-white mb-2">Recovery Day</h2>
            <p className="description-text max-w-sm mx-auto">
              Your muscles grow during rest. Eat well, hydrate, sleep 7–9 hours, and come back stronger.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="section-label">Exercises</p>
                <span className="count-badge">{workout.exercises.length} movements</span>
              </div>
              <div className="flex flex-col gap-3">
                {workout.exercises.map((exercise, i) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    index={i}
                    onViewGuide={setSelectedExercise}
                  />
                ))}
              </div>
            </div>

            {/* Complete button — only shown for today's workout */}
            {isToday && (
              <button
                className={`complete-btn ${alreadyDone ? "done" : ""}`}
                onClick={() => !alreadyDone && markComplete(dayNum)}
                disabled={alreadyDone}
              >
                {alreadyDone ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Workout Complete
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                    Mark as Complete
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <ExerciseGuidanceModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
