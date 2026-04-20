"use client";

import { useEffect } from "react";
import { GoalType } from "@/lib/types";
import { GOAL_META } from "@/store/goalStore";

interface GoalSelectorModalProps {
  currentGoal: GoalType;
  onSelect: (goal: GoalType) => void;
  onClose: () => void;
}

const GOALS: GoalType[] = ["weight_loss", "muscle_gain", "general_fitness"];

export default function GoalSelectorModal({ currentGoal, onSelect, onClose }: GoalSelectorModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        .goal-modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          z-index: 50; display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
          animation: fadeIn 0.15s ease;
        }
        @media (min-width: 640px) {
          .goal-modal-backdrop { align-items: center; padding: 1rem; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .goal-modal {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 24px 24px 0 0;
          padding: 2rem 1.5rem 2.5rem;
          width: 100%;
          max-width: 480px;
          animation: slideUp 0.2s ease;
        }
        @media (min-width: 640px) {
          .goal-modal { border-radius: 24px; }
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .goal-modal-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.1em;
          font-size: 1.4rem;
          color: white;
          margin-bottom: 0.25rem;
        }
        .goal-modal-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .goal-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          border: 1px solid #1e1e1e;
          background: #0d0d0d;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
          margin-bottom: 0.75rem;
          width: 100%;
          text-align: left;
        }
        .goal-option:hover { background: #141414; transform: translateY(-1px); }
        .goal-option.selected { background: #0d0d0d; }
        .goal-option:active { transform: scale(0.99); }
        .goal-emoji {
          font-size: 1.5rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          flex-shrink: 0;
        }
        .goal-option-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: white;
          display: block;
        }
        .goal-option-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: #555;
          margin-top: 2px;
          display: block;
        }
        .goal-check {
          margin-left: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .goal-check.active {
          border-color: var(--goal-color);
          background: var(--goal-color);
        }
        .goal-cancel-btn {
          width: 100%;
          padding: 0.85rem;
          border-radius: 12px;
          border: 1px solid #1e1e1e;
          background: transparent;
          color: #555;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          margin-top: 0.25rem;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .goal-cancel-btn:hover { color: #888; border-color: #333; }
      `}</style>

      <div className="goal-modal-backdrop" onClick={onClose}>
        <div className="goal-modal" onClick={(e) => e.stopPropagation()}>
          <p className="goal-modal-title">Your Goal</p>
          <p className="goal-modal-sub">Choose the program that matches your focus</p>

          {GOALS.map((g) => {
            const meta = GOAL_META[g];
            const isSelected = g === currentGoal;
            return (
              <button
                key={g}
                className={`goal-option ${isSelected ? "selected" : ""}`}
                style={{ borderColor: isSelected ? `${meta.color}44` : undefined }}
                onClick={() => { onSelect(g); onClose(); }}
              >
                <div className="goal-emoji">{meta.emoji}</div>
                <div className="flex-1 min-w-0">
                  <span className="goal-option-label">{meta.label}</span>
                  <span className="goal-option-tagline">{meta.tagline}</span>
                </div>
                <div
                  className={`goal-check ${isSelected ? "active" : ""}`}
                  style={{ ["--goal-color" as string]: meta.color }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </button>
            );
          })}

          <button className="goal-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
}
