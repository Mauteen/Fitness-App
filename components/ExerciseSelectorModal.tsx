"use client";

import { useState, useEffect } from "react";
import { Exercise } from "@/lib/types";
import { getExerciseCategory } from "@/lib/workoutUtils";

const CATEGORIES = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

interface Props {
  exercises: Exercise[];
  alreadyAdded: string[]; // exerciseIds already in the day
  onConfirm: (selected: Exercise[]) => void;
  onClose: () => void;
}

export default function ExerciseSelectorModal({ exercises, alreadyAdded, onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = exercises.filter(ex => {
    const matchesCat = category === "All" || getExerciseCategory(ex) === category;
    const q = query.toLowerCase();
    const matchesQ = !q || ex.name.toLowerCase().includes(q) || ex.muscle.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    const picked = exercises.filter(ex => selected.has(ex.id));
    onConfirm(picked);
    onClose();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .esel-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.9);
          z-index: 70; display: flex; align-items: flex-end; justify-content: center;
          animation: eselFade 0.15s ease;
        }
        @keyframes eselFade { from { opacity: 0; } to { opacity: 1; } }
        @media (min-width: 640px) { .esel-backdrop { align-items: center; padding: 1rem; } }
        .esel-modal {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 24px 24px 0 0; width: 100%; max-width: 520px;
          height: 90vh; display: flex; flex-direction: column;
          animation: eselUp 0.2s ease;
        }
        @media (min-width: 640px) { .esel-modal { border-radius: 24px; } }
        @keyframes eselUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .esel-header {
          padding: 1.25rem 1.25rem 0;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .esel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem; letter-spacing: 0.04em; color: white;
        }
        .esel-close {
          background: #1a1a1a; border: none; border-radius: 8px;
          width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #555; transition: color 0.15s, background 0.15s;
        }
        .esel-close:hover { background: #222; color: #999; }

        .esel-search-wrap { padding: 1rem 1.25rem 0; flex-shrink: 0; position: relative; }
        .esel-search {
          width: 100%; background: #0d0d0d; border: 1px solid #222;
          border-radius: 12px; padding: 0.65rem 1rem 0.65rem 2.5rem;
          color: #ddd; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
          outline: none; box-sizing: border-box; transition: border-color 0.15s;
        }
        .esel-search::placeholder { color: #444; }
        .esel-search:focus { border-color: #22c55e44; }
        .esel-search-icon {
          position: absolute; left: 2.1rem; top: 50%; transform: translateY(-50%);
          color: #444; pointer-events: none;
        }

        .esel-cats {
          display: flex; gap: 0.4rem; padding: 0.75rem 1.25rem 0;
          overflow-x: auto; flex-shrink: 0;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .esel-cats::-webkit-scrollbar { display: none; }
        .esel-cat {
          padding: 0.35rem 0.85rem; border-radius: 999px;
          border: 1px solid #222; background: #111;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600;
          color: #666; cursor: pointer; white-space: nowrap;
          transition: all 0.15s;
        }
        .esel-cat.active { background: #22c55e14; border-color: #22c55e44; color: #22c55e; }

        .esel-count {
          padding: 0.5rem 1.25rem 0;
          font-family: 'DM Sans', sans-serif; font-size: 0.7rem;
          color: #444; letter-spacing: 0.04em; flex-shrink: 0;
        }

        .esel-list { flex: 1; overflow-y: auto; padding: 0.5rem 1.25rem; }

        .esel-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 0.9rem; border-radius: 12px;
          border: 1px solid transparent; cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
          margin-bottom: 0.4rem;
        }
        .esel-item:hover { background: #161616; }
        .esel-item.checked { background: #22c55e0d; border-color: #22c55e33; }
        .esel-item.disabled { opacity: 0.35; cursor: not-allowed; }

        .esel-checkbox {
          width: 20px; height: 20px; border-radius: 6px;
          border: 1.5px solid #333; background: #0d0d0d;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background 0.12s, border-color 0.12s;
        }
        .esel-item.checked .esel-checkbox {
          background: #22c55e; border-color: #22c55e;
        }
        .esel-ex-name {
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
          font-weight: 600; color: #ccc; line-height: 1.2;
        }
        .esel-ex-muscle {
          font-family: 'DM Sans', sans-serif; font-size: 0.7rem;
          color: #555; margin-top: 1px;
        }
        .esel-already {
          margin-left: auto; flex-shrink: 0;
          font-family: 'DM Sans', sans-serif; font-size: 0.65rem;
          font-weight: 600; color: #22c55e; letter-spacing: 0.06em;
        }

        .esel-footer {
          padding: 1rem 1.25rem 1.5rem; flex-shrink: 0;
          border-top: 1px solid #1a1a1a;
        }
        .esel-confirm {
          width: 100%; padding: 0.9rem; border-radius: 12px;
          background: #22c55e; color: #000; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 4px 20px rgba(34,197,94,0.2);
        }
        .esel-confirm:hover { background: #16a34a; transform: translateY(-1px); }
        .esel-confirm:active { transform: scale(0.98); }
        .esel-confirm:disabled {
          background: #1a1a1a; color: #444; box-shadow: none;
          cursor: not-allowed; transform: none;
        }
      `}</style>

      <div className="esel-backdrop" onClick={onClose}>
        <div className="esel-modal" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="esel-header">
            <p className="esel-title">Add Exercises</p>
            <button className="esel-close" onClick={onClose}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="esel-search-wrap">
            <svg className="esel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="esel-search"
              type="text"
              placeholder="Search exercises…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="esel-cats">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`esel-cat ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="esel-count">
            {filtered.length} {filtered.length === 1 ? "exercise" : "exercises"}
            {selected.size > 0 && ` · ${selected.size} selected`}
          </p>

          {/* List */}
          <div className="esel-list">
            {filtered.map(ex => {
              const isAdded = alreadyAdded.includes(ex.id);
              const isChecked = selected.has(ex.id);
              return (
                <div
                  key={ex.id}
                  className={`esel-item ${isChecked ? "checked" : ""} ${isAdded ? "disabled" : ""}`}
                  onClick={() => !isAdded && toggle(ex.id)}
                >
                  <div className="esel-checkbox">
                    {(isChecked || isAdded) && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="esel-ex-name truncate">{ex.name}</p>
                    <p className="esel-ex-muscle">{ex.muscle}</p>
                  </div>
                  {isAdded && <span className="esel-already">ADDED</span>}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="esel-footer">
            <button
              className="esel-confirm"
              onClick={handleConfirm}
              disabled={selected.size === 0}
            >
              {selected.size === 0 ? "Select Exercises" : `Add ${selected.size} Exercise${selected.size > 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
