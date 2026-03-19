"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllWorkouts, getWorkoutByDay, getTodayWorkoutDay, getGreeting, formatShortDate, getWeekDates } from "@/lib/workoutUtils";
import { WorkoutDay } from "@/lib/types";

const USER_NAME = "Mauteen";

export default function HomePage() {
  const [todayDay, setTodayDay] = useState(1);
  const [greeting, setGreeting] = useState("Welcome back");
  const [todayDate, setTodayDate] = useState("");
  const [weekDates, setWeekDates] = useState<Record<number, Date>>({});
  const allWorkouts = getAllWorkouts();

  useEffect(() => {
    const wd = getWeekDates();
    setTodayDay(getTodayWorkoutDay());
    setGreeting(getGreeting());
    setTodayDate(formatShortDate(new Date()));
    setWeekDates(wd);
  }, []);

  const todayWorkout = getWorkoutByDay(todayDay);
  const isRestDay = todayWorkout?.exerciseIds.length === 0;

  const focusColors: Record<string, string> = {
    "Push Day": "#22c55e",
    "Pull Day": "#3b82f6",
    "Leg Day": "#f59e0b",
    "Shoulder Day": "#a855f7",
    "Full Body": "#ef4444",
    "Rest Day": "#555",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        * { box-sizing: border-box; }
        body { background: #0a0a0a; margin: 0; }
        .page { font-family: 'DM Sans', sans-serif; }

        .hero-section {
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          border-bottom: 1px solid #181818;
          padding: 3rem 1rem 2.5rem;
        }
        .app-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.75rem;
          color: #22c55e;
        }
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.03em;
          line-height: 1;
          color: white;
        }
        .hero-greeting {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: #777;
          margin-bottom: 0.5rem;
        }
        .hero-sub {
          color: #555;
          font-size: 0.875rem;
          line-height: 1.6;
          font-style: italic;
          font-weight: 300;
        }
        .today-card-inner {
          background: linear-gradient(135deg, #141414 0%, #0f0f0f 100%);
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .today-card-inner::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .today-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.2em;
          font-size: 0.65rem;
          color: #22c55e;
        }
        .today-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
          line-height: 1;
          color: white;
        }
        .start-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #22c55e;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.25);
          flex-shrink: 0;
        }
        .start-btn:hover {
          background: #16a34a;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(34, 197, 94, 0.35);
        }
        .start-btn:active { transform: scale(0.98); }
        .exercise-count-chip {
          font-size: 0.75rem;
          color: #666;
          font-weight: 500;
        }
        .exercise-count-chip strong { color: #999; }
        .section-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.65rem;
          color: #444;
          text-transform: uppercase;
        }
        .week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .day-cell {
          border-radius: 10px;
          padding: 0.6rem 0.3rem;
          text-align: center;
          border: 1px solid #1a1a1a;
          background: #111;
          transition: border-color 0.15s ease, transform 0.15s ease;
          text-decoration: none;
          display: block;
        }
        .day-cell:hover { border-color: #333; transform: translateY(-1px); }
        .day-cell.active { border-color: #22c55e44; background: #22c55e0a; }
        .day-cell.rest { opacity: 0.5; }
        .day-cell-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: #444;
          display: block;
          margin-bottom: 4px;
        }
        .day-cell-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          color: #666;
          line-height: 1;
          display: block;
        }
        .day-cell.active .day-cell-num { color: #22c55e; }
        .day-cell-name {
          font-size: 0.5rem;
          font-weight: 500;
          color: #444;
          display: block;
          margin-top: 3px;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .day-cell.active .day-cell-name { color: #666; }
        .workout-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid #141414;
          text-decoration: none;
          transition: opacity 0.15s ease;
        }
        .workout-list-item:hover { opacity: 0.7; }
        .workout-list-item:last-child { border-bottom: none; }
        .workout-day-badge {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          width: 2rem;
          color: #333;
          flex-shrink: 0;
        }
        .workout-list-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
          color: white;
          font-size: 1.15rem;
          flex: 1;
          padding: 0 0.75rem;
        }
        .workout-focus-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .arrow-icon { color: #333; margin-left: 0.75rem; flex-shrink: 0; }
      `}</style>

      <div className="page min-h-screen bg-[#0a0a0a]">
        <div className="hero-section">
          <div className="max-w-2xl mx-auto">
            <p className="app-name mb-3">FITGUIDE</p>
            <p className="hero-greeting">{greeting}, {USER_NAME} 👋</p>
            <h1 className="hero-title text-5xl md:text-6xl mb-2">
              {isRestDay ? "Rest &\nRecover" : "Today's\nWorkout"}
            </h1>
            <p className="hero-sub">
              {todayDate && `${todayDate} — `}
              {isRestDay
                ? "Recovery is where the gains happen."
                : "Let's get it."}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-10">

          {todayWorkout && (
            <div>
              <p className="section-label mb-4">Today</p>
              <div className="today-card-inner">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="today-label mb-1">{todayDate} — {todayWorkout.focus}</p>
                    <h2 className="today-name text-4xl mb-2">{todayWorkout.name}</h2>
                    <p className="exercise-count-chip">
                      {isRestDay
                        ? "No lifting today"
                        : <><strong>{todayWorkout.exerciseIds.length}</strong> exercises</>}
                    </p>
                  </div>
                  {!isRestDay && (
                    <Link href={`/workout/${todayDay}`} className="start-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                      Start
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <p className="section-label mb-4">This Week</p>
            <div className="week-grid">
              {allWorkouts.map((w: WorkoutDay) => {
                const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
                const abbr = weekdays[w.day - 1];
                const date = weekDates[w.day];
                const dateNum = date ? date.getDate() : "";
                return (
                  <Link
                    key={w.day}
                    href={`/workout/${w.day}`}
                    className={`day-cell ${w.day === todayDay ? "active" : ""} ${w.exerciseIds.length === 0 ? "rest" : ""}`}
                  >
                    <span className="day-cell-label">{abbr}</span>
                    <span className="day-cell-num">{dateNum}</span>
                    <span className="day-cell-name">{w.name.split(" ")[0]}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="section-label mb-2">Full Program</p>
            <div>
              {allWorkouts.map((w: WorkoutDay) => {
                const color = focusColors[w.focus] ?? "#555";
                return (
                  <Link key={w.day} href={`/workout/${w.day}`} className="workout-list-item">
                    <span className="workout-day-badge">D{w.day}</span>
                    <span className="workout-list-name">{w.name}</span>
                    <span className="workout-focus-dot" style={{ background: color }} />
                    <svg className="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
