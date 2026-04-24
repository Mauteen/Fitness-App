"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomPlanStore } from "@/store/customPlanStore";
import ExerciseSelectorModal from "@/components/ExerciseSelectorModal";
import { Exercise, CustomExercise } from "@/lib/types";
import exercisesData from "@/data/exercises.json";

const allExercises = exercisesData as Exercise[];

interface DaySelectorState {
  dayId: string;
}

export default function PlanBuilderPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = use(params);
  const router = useRouter();
  const { plans, hydrate, updatePlanName, addDay, updateDayName, removeDay, addExercisesToDay, removeExerciseFromDay, moveExercise } = useCustomPlanStore();

  const [editingPlanName, setEditingPlanName] = useState(false);
  const [planNameDraft, setPlanNameDraft] = useState("");
  const [newDayName, setNewDayName] = useState("");
  const [showAddDay, setShowAddDay] = useState(false);
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [dayNameDraft, setDayNameDraft] = useState("");
  const [selectorState, setSelectorState] = useState<DaySelectorState | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  useEffect(() => { hydrate(); }, [hydrate]);

  const plan = plans.find(p => p.id === planId);

  useEffect(() => {
    if (plan) {
      setPlanNameDraft(plan.name);
      // Expand all days by default
      setExpandedDays(new Set(plan.days.map(d => d.id)));
    }
  }, [plan?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!plan) {
    return (
      <div style={{ minHeight: "100dvh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555", fontFamily: "DM Sans, sans-serif" }}>Plan not found.</p>
      </div>
    );
  }

  function savePlanName() {
    const name = planNameDraft.trim();
    if (name && name !== plan!.name) updatePlanName(planId, name);
    setEditingPlanName(false);
  }

  function handleAddDay() {
    const name = newDayName.trim() || `Day ${plan!.days.length + 1}`;
    const dayId = addDay(planId, name);
    setNewDayName("");
    setShowAddDay(false);
    setExpandedDays(prev => new Set([...prev, dayId]));
  }

  function saveDayName(dayId: string) {
    const name = dayNameDraft.trim();
    if (name) updateDayName(planId, dayId, name);
    setEditingDayId(null);
  }

  function toggleExpand(dayId: string) {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(dayId) ? next.delete(dayId) : next.add(dayId);
      return next;
    });
  }

  function handleExercisesSelected(exercises: Exercise[]) {
    if (!selectorState) return;
    const mapped: CustomExercise[] = exercises.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      muscle: ex.muscle,
    }));
    addExercisesToDay(planId, selectorState.dayId, mapped);
  }

  const selectorDay = selectorState ? plan.days.find(d => d.id === selectorState.dayId) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        body { background: #0a0a0a; }
        .builder-page { font-family: 'DM Sans', sans-serif; min-height: 100dvh; background: #0a0a0a; padding-bottom: 4rem; }

        .builder-header {
          padding: 1.5rem 1.25rem 1.25rem;
          border-bottom: 1px solid #161616;
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .back-link {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500;
          color: #555; letter-spacing: 0.05em; text-transform: uppercase;
          text-decoration: none; transition: color 0.15s;
        }
        .back-link:hover { color: #999; }

        .plan-name-row { display: flex; align-items: center; gap: 0.6rem; }
        .plan-name-display {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 7vw, 2.8rem); letter-spacing: 0.04em;
          color: white; line-height: 1; cursor: pointer;
          border-bottom: 1px dashed transparent; transition: border-color 0.15s;
        }
        .plan-name-display:hover { border-color: #333; }
        .plan-name-edit {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 7vw, 2.8rem); letter-spacing: 0.04em;
          color: white; line-height: 1; background: transparent;
          border: none; border-bottom: 1.5px solid #22c55e; outline: none;
          width: 100%;
        }
        .edit-icon-btn {
          background: #1a1a1a; border: none; border-radius: 7px;
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #444; flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .edit-icon-btn:hover { background: #222; color: #888; }

        .builder-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

        /* Day card */
        .day-card {
          background: linear-gradient(135deg, #131313 0%, #0f0f0f 100%);
          border: 1px solid #1e1e1e; border-radius: 18px; overflow: hidden;
        }
        .day-card-header {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 1rem 1rem 1rem 1.1rem; cursor: pointer;
        }
        .day-card-header:hover { background: #161616; }
        .day-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 0.75rem;
          letter-spacing: 0.1em; color: #22c55e44; flex-shrink: 0;
        }
        .day-name-display {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
          letter-spacing: 0.05em; color: white; flex: 1; min-width: 0;
        }
        .day-name-input {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
          letter-spacing: 0.05em; color: white; flex: 1;
          background: transparent; border: none;
          border-bottom: 1.5px solid #22c55e; outline: none;
        }
        .day-exercise-count {
          font-family: 'DM Sans', sans-serif; font-size: 0.7rem;
          color: #444; font-weight: 500; flex-shrink: 0;
        }
        .day-chevron {
          color: #333; flex-shrink: 0; transition: transform 0.2s;
        }
        .day-chevron.open { transform: rotate(180deg); }
        .day-action-row {
          display: flex; gap: 0.4rem; padding: 0 1rem; align-items: center;
        }
        .day-edit-btn, .day-delete-btn {
          background: none; border: none; cursor: pointer;
          color: #333; padding: 0.25rem; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .day-edit-btn:hover { color: #888; background: #1a1a1a; }
        .day-delete-btn:hover { color: #ef4444; background: #ef444410; }

        .day-body { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; }

        /* Exercise row */
        .ex-row {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.6rem 0.75rem; background: #0d0d0d;
          border: 1px solid #1a1a1a; border-radius: 10px;
        }
        .ex-row-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 0.75rem;
          color: #333; width: 1.2rem; text-align: center; flex-shrink: 0;
        }
        .ex-row-info { flex: 1; min-width: 0; }
        .ex-row-name {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          font-weight: 600; color: #ccc; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .ex-row-muscle { font-size: 0.68rem; color: #444; margin-top: 1px; }
        .ex-move-btns { display: flex; flex-direction: column; gap: 1px; flex-shrink: 0; }
        .ex-move-btn {
          background: none; border: none; cursor: pointer;
          color: #333; padding: 2px 4px; border-radius: 4px;
          transition: color 0.12s, background 0.12s; line-height: 1;
        }
        .ex-move-btn:hover { color: #888; background: #1a1a1a; }
        .ex-move-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .ex-remove-btn {
          background: none; border: none; cursor: pointer;
          color: #2a2a2a; padding: 0.25rem; border-radius: 6px; flex-shrink: 0;
          transition: color 0.15s, background 0.15s;
        }
        .ex-remove-btn:hover { color: #ef4444; background: #ef444410; }

        /* Add exercises btn */
        .add-ex-btn {
          width: 100%; padding: 0.65rem; border-radius: 10px;
          background: transparent; border: 1px dashed #222; color: #444;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.78rem;
          letter-spacing: 0.04em; cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 0.4rem;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .add-ex-btn:hover { border-color: #22c55e44; color: #22c55e; background: #22c55e08; }

        /* Add day */
        .add-day-card {
          background: #0d0d0d; border: 1.5px dashed #1e1e1e;
          border-radius: 18px; overflow: hidden;
        }
        .add-day-input-row { display: flex; gap: 0.5rem; padding: 1rem; }
        .add-day-input {
          flex: 1; background: #111; border: 1px solid #222;
          border-radius: 10px; padding: 0.65rem 0.9rem; color: white;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
          outline: none; transition: border-color 0.15s;
        }
        .add-day-input::placeholder { color: #3a3a3a; }
        .add-day-input:focus { border-color: #22c55e44; }
        .add-day-confirm {
          padding: 0.65rem 1.1rem; border-radius: 10px;
          background: #22c55e; border: none; color: #000;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 0.8rem; cursor: pointer; white-space: nowrap;
          transition: background 0.15s;
        }
        .add-day-confirm:hover { background: #16a34a; }
        .add-day-cancel {
          padding: 0.65rem 0.9rem; border-radius: 10px;
          background: transparent; border: 1px solid #222; color: #555;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.8rem; cursor: pointer; transition: all 0.15s;
        }
        .add-day-cancel:hover { background: #1a1a1a; color: #aaa; }

        .add-day-trigger {
          width: 100%; padding: 1rem; border-radius: 18px;
          background: transparent; border: 1.5px dashed #1e1e1e; color: #444;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem;
          letter-spacing: 0.04em; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .add-day-trigger:hover { border-color: #22c55e44; color: #22c55e; background: #22c55e06; }

        .empty-day {
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          color: #333; text-align: center; padding: 0.5rem 0 0.25rem;
          font-style: italic;
        }
      `}</style>

      <div className="builder-page">
        <div className="builder-header">
          <Link href="/plans" className="back-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            My Plans
          </Link>

          <div className="plan-name-row">
            {editingPlanName ? (
              <input
                className="plan-name-edit"
                value={planNameDraft}
                onChange={e => setPlanNameDraft(e.target.value)}
                onBlur={savePlanName}
                onKeyDown={e => e.key === "Enter" && savePlanName()}
                autoFocus
              />
            ) : (
              <>
                <span className="plan-name-display" onClick={() => setEditingPlanName(true)}>
                  {plan.name}
                </span>
                <button className="edit-icon-btn" onClick={() => setEditingPlanName(true)} aria-label="Edit plan name">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="builder-body">
          {plan.days.map((day, dayIdx) => {
            const isExpanded = expandedDays.has(day.id);
            return (
              <div key={day.id} className="day-card">
                {/* Day header */}
                <div className="day-card-header" onClick={() => toggleExpand(day.id)}>
                  <span className="day-num">D{dayIdx + 1}</span>
                  {editingDayId === day.id ? (
                    <input
                      className="day-name-input"
                      value={dayNameDraft}
                      onClick={e => e.stopPropagation()}
                      onChange={e => setDayNameDraft(e.target.value)}
                      onBlur={() => saveDayName(day.id)}
                      onKeyDown={e => e.key === "Enter" && saveDayName(day.id)}
                      autoFocus
                    />
                  ) : (
                    <span className="day-name-display">{day.name}</span>
                  )}
                  <span className="day-exercise-count">{day.exercises.length} ex</span>
                  <button
                    className="day-edit-btn"
                    onClick={e => { e.stopPropagation(); setDayNameDraft(day.name); setEditingDayId(day.id); }}
                    aria-label="Edit day name"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    className="day-delete-btn"
                    onClick={e => { e.stopPropagation(); removeDay(planId, day.id); }}
                    aria-label="Delete day"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                  <svg className={`day-chevron ${isExpanded ? "open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {/* Day body */}
                {isExpanded && (
                  <div className="day-body">
                    {day.exercises.length === 0 ? (
                      <p className="empty-day">No exercises yet — add some below</p>
                    ) : (
                      day.exercises.map((ex, exIdx) => (
                        <div key={ex.exerciseId} className="ex-row">
                          <span className="ex-row-num">{exIdx + 1}</span>
                          <div className="ex-row-info">
                            <p className="ex-row-name">{ex.name}</p>
                            <p className="ex-row-muscle">{ex.muscle}</p>
                          </div>
                          <div className="ex-move-btns">
                            <button
                              className="ex-move-btn"
                              disabled={exIdx === 0}
                              onClick={() => moveExercise(planId, day.id, exIdx, exIdx - 1)}
                              aria-label="Move up"
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="18 15 12 9 6 15"/>
                              </svg>
                            </button>
                            <button
                              className="ex-move-btn"
                              disabled={exIdx === day.exercises.length - 1}
                              onClick={() => moveExercise(planId, day.id, exIdx, exIdx + 1)}
                              aria-label="Move down"
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="6 9 12 15 18 9"/>
                              </svg>
                            </button>
                          </div>
                          <button
                            className="ex-remove-btn"
                            onClick={() => removeExerciseFromDay(planId, day.id, ex.exerciseId)}
                            aria-label="Remove exercise"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      ))
                    )}

                    <button
                      className="add-ex-btn"
                      onClick={() => setSelectorState({ dayId: day.id })}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add Exercises
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add day */}
          {showAddDay ? (
            <div className="add-day-card">
              <div className="add-day-input-row">
                <input
                  className="add-day-input"
                  type="text"
                  placeholder={`e.g. Chest Day, Leg Day…`}
                  value={newDayName}
                  onChange={e => setNewDayName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddDay()}
                  autoFocus
                />
                <button className="add-day-cancel" onClick={() => { setShowAddDay(false); setNewDayName(""); }}>
                  Cancel
                </button>
                <button className="add-day-confirm" onClick={handleAddDay}>
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button className="add-day-trigger" onClick={() => setShowAddDay(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Day
            </button>
          )}
        </div>
      </div>

      {selectorState && selectorDay && (
        <ExerciseSelectorModal
          exercises={allExercises}
          alreadyAdded={selectorDay.exercises.map(e => e.exerciseId)}
          onConfirm={handleExercisesSelected}
          onClose={() => setSelectorState(null)}
        />
      )}
    </>
  );
}
