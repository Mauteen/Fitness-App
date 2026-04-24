"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomPlanStore } from "@/store/customPlanStore";
import { CustomWorkoutPlan } from "@/lib/types";

export default function PlansPage() {
  const router = useRouter();
  const { plans, hydrate, createPlan, deletePlan } = useCustomPlanStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => { hydrate(); }, [hydrate]);

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    const id = createPlan(name);
    setNewName("");
    setShowCreate(false);
    router.push(`/plans/${id}`);
  }

  function totalExercises(plan: CustomWorkoutPlan) {
    return plan.days.reduce((acc, d) => acc + d.exercises.length, 0);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        body { background: #0a0a0a; }
        .plans-page { font-family: 'DM Sans', sans-serif; min-height: 100dvh; background: #0a0a0a; }

        .plans-header {
          padding: 3rem 1.25rem 1.5rem;
          border-bottom: 1px solid #161616;
        }
        .plans-app-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.2em; font-size: 0.7rem; color: #22c55e; margin-bottom: 0.4rem;
        }
        .plans-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.2rem, 8vw, 3rem); letter-spacing: 0.04em;
          color: white; line-height: 1; margin-bottom: 0.4rem;
        }
        .plans-subtitle { font-size: 0.82rem; color: #555; }

        .plans-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }

        .create-btn {
          width: 100%; padding: 0.9rem; border-radius: 14px;
          background: #22c55e; color: #000; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 0.875rem; letter-spacing: 0.05em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 4px 20px rgba(34,197,94,0.2);
        }
        .create-btn:hover { background: #16a34a; transform: translateY(-1px); }
        .create-btn:active { transform: scale(0.98); }

        /* Create modal */
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          z-index: 60; display: flex; align-items: center; justify-content: center; padding: 1.5rem;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .create-modal {
          background: #111; border: 1px solid #1e1e1e; border-radius: 20px;
          padding: 1.5rem; width: 100%; max-width: 400px;
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem;
          letter-spacing: 0.04em; color: white; margin-bottom: 1rem;
        }
        .plan-name-input {
          width: 100%; background: #0d0d0d; border: 1px solid #222;
          border-radius: 10px; padding: 0.7rem 0.9rem; color: white;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          outline: none; box-sizing: border-box; margin-bottom: 1rem;
          transition: border-color 0.15s;
        }
        .plan-name-input::placeholder { color: #3a3a3a; }
        .plan-name-input:focus { border-color: #22c55e44; }
        .modal-actions { display: flex; gap: 0.6rem; }
        .modal-cancel {
          flex: 1; padding: 0.75rem; border-radius: 10px;
          background: transparent; border: 1px solid #222; color: #666;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.85rem;
          cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .modal-cancel:hover { background: #1a1a1a; color: #aaa; }
        .modal-confirm {
          flex: 2; padding: 0.75rem; border-radius: 10px;
          background: #22c55e; color: #000; border: none;
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; letter-spacing: 0.04em; text-transform: uppercase;
          transition: background 0.15s;
        }
        .modal-confirm:hover { background: #16a34a; }
        .modal-confirm:disabled { background: #1a1a1a; color: #444; cursor: not-allowed; }

        /* Plan card */
        .plan-card {
          background: linear-gradient(135deg, #141414 0%, #111 100%);
          border: 1px solid #1e1e1e; border-radius: 16px; padding: 1.1rem 1.1rem 1rem;
          cursor: pointer; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: flex-start; gap: 1rem;
        }
        .plan-card:hover {
          border-color: #22c55e33; transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(34,197,94,0.06);
        }
        .plan-icon {
          width: 42px; height: 42px; border-radius: 11px;
          background: #22c55e14; border: 1px solid #22c55e22;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .plan-card-body { flex: 1; min-width: 0; }
        .plan-card-name {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem;
          letter-spacing: 0.04em; color: white; line-height: 1.1;
        }
        .plan-card-meta {
          font-size: 0.75rem; color: #555; margin-top: 0.3rem;
        }
        .plan-card-pills { display: flex; gap: 0.4rem; margin-top: 0.6rem; flex-wrap: wrap; }
        .plan-pill {
          font-family: 'DM Sans', sans-serif; font-size: 0.68rem; font-weight: 600;
          background: #1a1a1a; border: 1px solid #222; color: #666;
          border-radius: 999px; padding: 0.2rem 0.6rem;
        }
        .plan-delete-btn {
          background: none; border: none; cursor: pointer;
          color: #333; padding: 0.25rem; border-radius: 6px;
          transition: color 0.15s, background 0.15s; flex-shrink: 0;
        }
        .plan-delete-btn:hover { color: #ef4444; background: #ef444410; }

        /* Delete confirm */
        .delete-confirm {
          background: #111; border: 1px solid #2a1010; border-radius: 16px;
          padding: 1.1rem 1.1rem 1rem;
        }
        .delete-text {
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          color: #888; margin-bottom: 0.9rem; line-height: 1.5;
        }
        .delete-actions { display: flex; gap: 0.5rem; }
        .delete-cancel {
          flex: 1; padding: 0.6rem; border-radius: 9px;
          background: #1a1a1a; border: none; color: #666;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
          cursor: pointer;
        }
        .delete-ok {
          flex: 1; padding: 0.6rem; border-radius: 9px;
          background: #ef4444; border: none; color: white;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 700;
          cursor: pointer; letter-spacing: 0.04em;
        }

        /* Empty */
        .empty-state {
          text-align: center; padding: 4rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .empty-icon { font-size: 3rem; display: block; margin-bottom: 0.75rem; opacity: 0.3; }
        .empty-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem;
          letter-spacing: 0.04em; color: #444; margin-bottom: 0.4rem;
        }
        .empty-text { font-size: 0.82rem; color: #333; line-height: 1.6; }
      `}</style>

      <div className="plans-page">
        <div className="plans-header">
          <p className="plans-app-label">FITGUIDE</p>
          <h1 className="plans-title">My Plans</h1>
          <p className="plans-subtitle">Build and manage your custom workout plans</p>
        </div>

        <div className="plans-body">
          <button className="create-btn" onClick={() => setShowCreate(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Plan
          </button>

          {plans.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p className="empty-title">No Plans Yet</p>
              <p className="empty-text">
                Tap Create Plan to build your first custom workout. Add days, pick exercises, and make it yours.
              </p>
            </div>
          ) : (
            plans.map(plan =>
              deleteTarget === plan.id ? (
                <div key={plan.id} className="delete-confirm">
                  <p className="delete-text">Delete <strong style={{ color: "#ccc" }}>{plan.name}</strong>? This can't be undone.</p>
                  <div className="delete-actions">
                    <button className="delete-cancel" onClick={() => setDeleteTarget(null)}>Keep it</button>
                    <button className="delete-ok" onClick={() => { deletePlan(plan.id); setDeleteTarget(null); }}>Delete</button>
                  </div>
                </div>
              ) : (
                <div key={plan.id} className="plan-card" onClick={() => router.push(`/plans/${plan.id}`)}>
                  <div className="plan-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                  </div>
                  <div className="plan-card-body">
                    <p className="plan-card-name">{plan.name}</p>
                    <p className="plan-card-meta">
                      {new Date(plan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <div className="plan-card-pills">
                      <span className="plan-pill">{plan.days.length} {plan.days.length === 1 ? "day" : "days"}</span>
                      <span className="plan-pill">{totalExercises(plan)} exercises</span>
                    </div>
                  </div>
                  <button
                    className="plan-delete-btn"
                    onClick={e => { e.stopPropagation(); setDeleteTarget(plan.id); }}
                    aria-label="Delete plan"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              )
            )
          )}
        </div>
      </div>

      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="create-modal" onClick={e => e.stopPropagation()}>
            <p className="modal-title">Name Your Plan</p>
            <input
              className="plan-name-input"
              type="text"
              placeholder="e.g. Push Pull Legs, Bulk Phase…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowCreate(false); setNewName(""); }}>Cancel</button>
              <button className="modal-confirm" onClick={handleCreate} disabled={!newName.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
