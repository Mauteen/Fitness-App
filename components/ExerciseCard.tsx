"use client";

import { Exercise } from "@/lib/types";
import { formatRest } from "@/lib/workoutUtils";

interface Props {
  exercise: Exercise;
  index: number;
  onViewGuide: (exercise: Exercise) => void;
  onLog?: (exercise: Exercise) => void;
  hasLog?: boolean;
}

export default function ExerciseCard({ exercise, index, onViewGuide, onLog, hasLog }: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .exercise-card {
          background: linear-gradient(135deg, #161616 0%, #111 100%);
          border: 1px solid #222;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .exercise-card:hover {
          border-color: #22c55e33;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(34, 197, 94, 0.06);
        }
        .exercise-index {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.05em;
          color: #22c55e22;
          font-size: 2rem;
          line-height: 1;
          user-select: none;
        }
        .exercise-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
          line-height: 1.1;
          color: white;
        }
        .stat-pill {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #888;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          white-space: nowrap;
        }
        .stat-pill span {
          color: #ccc;
          font-weight: 600;
        }
        .guide-btn {
          background: #22c55e14;
          border: 1px solid #22c55e33;
          color: #22c55e;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .guide-btn:hover {
          background: #22c55e22;
          border-color: #22c55e66;
          transform: scale(1.02);
        }
        .guide-btn:active {
          transform: scale(0.98);
        }
        .log-btn {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #555;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .log-btn:hover {
          background: #1a1a1a;
          border-color: #444;
          color: #aaa;
          transform: scale(1.02);
        }
        .log-btn:active { transform: scale(0.98); }
        .log-btn.logged {
          border-color: #22c55e44;
          color: #22c55e;
          background: #22c55e0a;
        }
        .muscle-label {
          font-size: 0.7rem;
          color: #555;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .dot-divider {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #333;
          flex-shrink: 0;
        }
      `}</style>

      <div className="exercise-card rounded-2xl p-4">
        <div className="flex items-start gap-3">
          {/* Index number */}
          <div className="exercise-index w-8 text-right flex-shrink-0 mt-0.5">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="exercise-name text-xl md:text-2xl truncate">{exercise.name}</h3>
                <p className="muscle-label mt-0.5">{exercise.muscle}</p>
              </div>
              <div className="flex items-center gap-2">
                {onLog && (
                  <button
                    onClick={() => onLog(exercise)}
                    className={`log-btn ${hasLog ? "logged" : ""}`}
                    aria-label={`Log ${exercise.name}`}
                  >
                    {hasLog ? "✓ LOG" : "LOG"}
                  </button>
                )}
                <button
                  onClick={() => onViewGuide(exercise)}
                  className="guide-btn"
                  aria-label={`View guide for ${exercise.name}`}
                >
                  GUIDE
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="stat-pill">
                <span>{exercise.sets}</span> sets
              </div>
              <div className="dot-divider" />
              <div className="stat-pill">
                <span>{exercise.reps}</span> reps
              </div>
              <div className="dot-divider" />
              <div className="stat-pill">
                <span>{formatRest(exercise.rest)}</span> rest
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
