"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/progressStore";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" });
}

export default function ProgressPage() {
  const { completedDates, streak, hydrate } = useProgressStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const today = todayStr();
  const last30 = getLast30Days();
  const completedSet = new Set(completedDates);
  const totalWorkouts = completedDates.length;
  const completedThisMonth = last30.filter(d => completedSet.has(d)).length;

  const recentHistory = [...completedDates]
    .filter(d => completedSet.has(d))
    .sort()
    .reverse()
    .slice(0, 10);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        body { background: #0a0a0a; }
        .progress-page { font-family: 'DM Sans', sans-serif; }

        .page-header {
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          border-bottom: 1px solid #181818;
          padding: 3rem 1rem 2rem;
        }
        .app-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.75rem;
          color: #22c55e;
        }
        .page-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.03em;
          line-height: 1;
          color: white;
        }
        .page-sub {
          color: #555;
          font-size: 0.875rem;
          font-style: italic;
          font-weight: 300;
        }
        .section-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.65rem;
          color: #444;
          text-transform: uppercase;
        }

        /* Streak hero */
        .streak-hero {
          background: linear-gradient(135deg, #0d1f0d 0%, #0a0a0a 60%);
          border: 1px solid #22c55e22;
          border-radius: 20px;
          padding: 2rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .streak-hero::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%; transform: translateX(-50%);
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .streak-number {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 6rem;
          color: #22c55e;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .streak-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          color: #22c55e88;
          margin-top: -0.25rem;
        }
        .streak-sub {
          font-size: 0.8rem;
          color: #555;
          margin-top: 0.75rem;
          font-style: italic;
        }
        .streak-fire {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        /* Stat cards */
        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .stat-card {
          background: linear-gradient(135deg, #141414 0%, #0f0f0f 100%);
          border: 1px solid #1e1e1e;
          border-radius: 16px;
          padding: 1.25rem;
        }
        .stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          color: white;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.72rem;
          color: #555;
          font-weight: 500;
          margin-top: 4px;
        }
        .stat-icon { margin-bottom: 0.5rem; }

        /* Heatmap */
        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 5px;
        }
        @media (min-width: 480px) {
          .heatmap-grid { grid-template-columns: repeat(15, 1fr); }
        }
        .heat-cell {
          aspect-ratio: 1;
          border-radius: 4px;
          background: #1a1a1a;
          border: 1px solid #222;
          transition: transform 0.1s ease;
          position: relative;
        }
        .heat-cell.completed {
          background: #22c55e;
          border-color: #16a34a;
          box-shadow: 0 0 6px rgba(34,197,94,0.3);
        }
        .heat-cell.today {
          border-color: #f59e0b;
        }
        .heat-cell:hover { transform: scale(1.2); }

        /* History list */
        .history-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 0;
          border-bottom: 1px solid #141414;
        }
        .history-item:last-child { border-bottom: none; }
        .history-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }
        .history-date {
          font-size: 0.85rem;
          color: #888;
          font-weight: 500;
        }
        .history-badge {
          margin-left: auto;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #22c55e;
          background: #22c55e14;
          border: 1px solid #22c55e33;
          border-radius: 999px;
          padding: 0.15rem 0.5rem;
        }

        /* Empty state */
        .empty-state {
          background: #111;
          border: 1px solid #1a1a1a;
          border-radius: 16px;
          padding: 2.5rem 1.5rem;
          text-align: center;
        }
        .empty-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          color: white;
          font-size: 1.5rem;
          letter-spacing: 0.04em;
          margin-bottom: 0.5rem;
        }
        .empty-text { font-size: 0.82rem; color: #555; line-height: 1.6; }
      `}</style>

      <div className="progress-page min-h-screen bg-[#0a0a0a] pb-12">
        <div className="page-header">
          <div className="max-w-2xl mx-auto">
            <p className="app-name mb-4">FITGUIDE</p>
            <h1 className="page-title text-5xl md:text-6xl mb-2">Mauteen&apos;s Progress</h1>
            <p className="page-sub">Every session counts. Keep the streak alive.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

          {/* Streak hero */}
          <div className="streak-hero">
            <span className="streak-fire">{streak > 0 ? "🔥" : "💤"}</span>
            <div className="streak-number">{streak}</div>
            <div className="streak-label">Day Streak</div>
            <p className="streak-sub">
              {streak === 0
                ? "Complete today's workout to start your streak."
                : streak === 1
                ? "Good start. Come back tomorrow to keep it going."
                : `${streak} days straight. Don't break the chain.`}
            </p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon">🏋️</div>
              <div className="stat-value">{totalWorkouts}</div>
              <div className="stat-label">Total Workouts</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-value" style={{ color: "#f59e0b" }}>{completedThisMonth}</div>
              <div className="stat-label">Last 30 Days</div>
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <p className="section-label mb-4">Last 30 Days</p>
            <div className="heatmap-grid">
              {last30.map(date => (
                <div
                  key={date}
                  className={`heat-cell ${completedSet.has(date) ? "completed" : ""} ${date === today ? "today" : ""}`}
                  title={formatDate(date)}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="heat-cell completed" style={{ width: 10, height: 10, borderRadius: 3, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: "0.65rem", color: "#555" }}>Completed</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="heat-cell" style={{ width: 10, height: 10, borderRadius: 3, display: "inline-block", border: "1px solid #f59e0b", flexShrink: 0 }} />
                <span style={{ fontSize: "0.65rem", color: "#555" }}>Today</span>
              </div>
            </div>
          </div>

          {/* History */}
          <div>
            <p className="section-label mb-4">Recent Activity</p>
            {recentHistory.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🏁</span>
                <h3 className="empty-title">No workouts yet</h3>
                <p className="empty-text">
                  Complete a workout to start tracking your progress. Hit the Start button on any workout day.
                </p>
              </div>
            ) : (
              <div>
                {recentHistory.map(date => (
                  <div key={date} className="history-item">
                    <div className="history-dot" />
                    <span className="history-date">{formatDate(date)}</span>
                    <span className="history-badge">✓ Done</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
