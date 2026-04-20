"use client";

import { useState, useEffect } from "react";
import { Exercise, ExerciseSet, ExerciseLog } from "@/lib/types";

interface Props {
  exercise: Exercise;
  lastLog: ExerciseLog | null;
  allLogs: ExerciseLog[];
  onSave: (sets: ExerciseSet[], notes: string) => void;
  onClose: () => void;
}

type Tab = "log" | "history";

export default function ExerciseLogModal({ exercise, lastLog, allLogs, onSave, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("log");
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    setSets(
      Array.from({ length: exercise.sets }, (_, i) => ({
        setNum: i + 1,
        reps: lastLog?.sets[i]?.reps ?? "",
        weightKg: lastLog?.sets[i]?.weightKg ?? "",
      }))
    );
  }, [exercise.sets, lastLog]);

  function updateSet(index: number, field: "reps" | "weightKg", value: string) {
    const num = value === "" ? "" : parseFloat(value);
    setSets((prev) => prev.map((s, i) => i === index ? { ...s, [field]: num } : s));
  }

  function handleSave() {
    const filledSets = sets.filter((s) => s.reps !== "" || s.weightKg !== "");
    if (filledSets.length === 0) { onClose(); return; }
    onSave(sets, notes);
    onClose();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .log-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.88);
          z-index: 60; display: flex; align-items: flex-end; justify-content: center;
          animation: lbFade 0.15s ease;
        }
        @media (min-width: 640px) { .log-backdrop { align-items: center; padding: 1rem; } }
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
        .log-modal {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 24px 24px 0 0; padding: 1.5rem 1.25rem 2rem;
          width: 100%; max-width: 480px; max-height: 90vh;
          display: flex; flex-direction: column;
          animation: lbUp 0.2s ease;
        }
        @media (min-width: 640px) { .log-modal { border-radius: 24px; } }
        @keyframes lbUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .log-ex-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em; font-size: 1.5rem; color: white; line-height: 1;
        }
        .log-ex-muscle { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: #555; margin-top: 2px; }
        .log-tabs { display: flex; gap: 0.5rem; margin: 1.25rem 0 1rem; }
        .log-tab {
          flex: 1; padding: 0.5rem; border-radius: 10px; border: 1px solid #1e1e1e;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer;
          background: transparent; color: #555;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .log-tab.active { background: #22c55e14; border-color: #22c55e44; color: #22c55e; }
        .log-scroll { flex: 1; overflow-y: auto; }
        .prev-session {
          background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 12px;
          padding: 0.75rem 1rem; margin-bottom: 1rem;
        }
        .prev-label {
          font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em;
          font-size: 0.6rem; color: #444; margin-bottom: 0.4rem;
        }
        .prev-sets { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .prev-set-chip {
          font-family: 'DM Sans', sans-serif; font-size: 0.72rem;
          font-weight: 600; color: #666; background: #1a1a1a;
          border-radius: 6px; padding: 0.2rem 0.5rem;
        }
        .set-row {
          display: grid; grid-template-columns: 2rem 1fr 1fr;
          gap: 0.5rem; align-items: center; margin-bottom: 0.6rem;
        }
        .set-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 0.9rem;
          color: #333; text-align: center; letter-spacing: 0.05em;
        }
        .set-input-wrap { display: flex; flex-direction: column; gap: 2px; }
        .set-input-label {
          font-family: 'DM Sans', sans-serif; font-size: 0.62rem;
          font-weight: 600; color: #444; letter-spacing: 0.06em; text-transform: uppercase;
        }
        .set-input {
          background: #0d0d0d; border: 1px solid #222; border-radius: 8px;
          padding: 0.5rem 0.6rem; color: white; font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600; width: 100%;
          transition: border-color 0.15s ease;
          -moz-appearance: textfield;
        }
        .set-input::-webkit-outer-spin-button,
        .set-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .set-input:focus { outline: none; border-color: #22c55e55; }
        .notes-input {
          background: #0d0d0d; border: 1px solid #1e1e1e; border-radius: 10px;
          padding: 0.6rem 0.75rem; color: #aaa; font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; width: 100%; resize: none; margin-top: 0.75rem;
          transition: border-color 0.15s;
        }
        .notes-input:focus { outline: none; border-color: #333; }
        .notes-input::placeholder { color: #3a3a3a; }
        .log-save-btn {
          width: 100%; padding: 0.9rem; border-radius: 12px;
          background: #22c55e; color: #000; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase;
          margin-top: 1rem; transition: background 0.15s, transform 0.1s;
          box-shadow: 0 4px 20px rgba(34,197,94,0.2);
          flex-shrink: 0;
        }
        .log-save-btn:hover { background: #16a34a; transform: translateY(-1px); }
        .log-save-btn:active { transform: scale(0.98); }
        .history-entry {
          border-bottom: 1px solid #141414; padding: 0.9rem 0;
        }
        .history-entry:last-child { border-bottom: none; }
        .history-date {
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
          font-weight: 600; color: #555; margin-bottom: 0.4rem;
        }
        .history-sets { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .history-set-chip {
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
          font-weight: 600; color: #888; background: #141414;
          border: 1px solid #1e1e1e; border-radius: 6px; padding: 0.2rem 0.55rem;
        }
        .history-notes {
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
          color: #444; font-style: italic; margin-top: 0.35rem;
        }
        .empty-history {
          text-align: center; padding: 2.5rem 0;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: #333;
        }
        .modal-close-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .modal-close-btn {
          background: #1a1a1a; border: none; border-radius: 8px;
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #555; transition: color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .modal-close-btn:hover { background: #222; color: #999; }
      `}</style>

      <div className="log-backdrop" onClick={onClose}>
        <div className="log-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-close-row">
            <div>
              <p className="log-ex-name">{exercise.name}</p>
              <p className="log-ex-muscle">{exercise.muscle}</p>
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="log-tabs">
            <button className={`log-tab ${tab === "log" ? "active" : ""}`} onClick={() => setTab("log")}>Log Sets</button>
            <button className={`log-tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
              History {allLogs.length > 0 && `(${allLogs.length})`}
            </button>
          </div>

          <div className="log-scroll">
            {tab === "log" ? (
              <>
                {/* Previous session reference */}
                {lastLog && (
                  <div className="prev-session">
                    <p className="prev-label">Last Session — {formatDate(lastLog.date)}</p>
                    <div className="prev-sets">
                      {lastLog.sets.map((s) => (
                        <span key={s.setNum} className="prev-set-chip">
                          S{s.setNum}: {s.weightKg !== "" ? `${s.weightKg}kg` : "—"} × {s.reps !== "" ? s.reps : "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Set inputs */}
                <div>
                  <div className="set-row" style={{ marginBottom: "0.4rem" }}>
                    <div />
                    <p className="set-input-label" style={{ paddingLeft: "0.6rem" }}>Weight (kg)</p>
                    <p className="set-input-label" style={{ paddingLeft: "0.6rem" }}>Reps</p>
                  </div>
                  {sets.map((s, i) => (
                    <div key={s.setNum} className="set-row">
                      <span className="set-num">S{s.setNum}</span>
                      <div className="set-input-wrap">
                        <input
                          className="set-input"
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="0"
                          value={s.weightKg}
                          onChange={(e) => updateSet(i, "weightKg", e.target.value)}
                        />
                      </div>
                      <div className="set-input-wrap">
                        <input
                          className="set-input"
                          type="number"
                          min="0"
                          step="1"
                          placeholder={typeof exercise.reps === "string" ? exercise.reps.split("-")[0] : "0"}
                          value={s.reps}
                          onChange={(e) => updateSet(i, "reps", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <textarea
                  className="notes-input"
                  rows={2}
                  placeholder="Notes (optional) — e.g. felt easy, form was off..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </>
            ) : (
              <div>
                {allLogs.length === 0 ? (
                  <div className="empty-history">No sessions logged yet</div>
                ) : (
                  allLogs.map((log) => (
                    <div key={log.id} className="history-entry">
                      <p className="history-date">{formatDate(log.date)}</p>
                      <div className="history-sets">
                        {log.sets.map((s) => (
                          <span key={s.setNum} className="history-set-chip">
                            S{s.setNum}: {s.weightKg !== "" ? `${s.weightKg}kg` : "—"} × {s.reps !== "" ? s.reps : "—"}
                          </span>
                        ))}
                      </div>
                      {log.notes && <p className="history-notes">"{log.notes}"</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {tab === "log" && (
            <button className="log-save-btn" onClick={handleSave}>Save Session</button>
          )}
        </div>
      </div>
    </>
  );
}
