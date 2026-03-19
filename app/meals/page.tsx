"use client";

import { useState, useEffect } from "react";
import mealsData from "@/data/meals.json";
import { MealDay, MealItem } from "@/lib/types";
import { getTodayWorkoutDay, getWeekDates, formatShortDate } from "@/lib/workoutUtils";

const meals = mealsData as MealDay[];

const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;
type MealType = typeof mealTypes[number];

const mealMeta: Record<MealType, { label: string; emoji: string; color: string }> = {
  breakfast: { label: "Breakfast", emoji: "🌅", color: "#f59e0b" },
  lunch:     { label: "Lunch",     emoji: "☀️",  color: "#22c55e" },
  dinner:    { label: "Dinner",    emoji: "🌙", color: "#3b82f6" },
  snack:     { label: "Snack",     emoji: "⚡",  color: "#a855f7" },
};

function MacroBadge({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.6rem", color: "#555", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "0.55rem", color: "#444" }}>{unit}</div>
    </div>
  );
}

function MealCard({ meal, type }: { meal: MealItem; type: MealType }) {
  const [open, setOpen] = useState(false);
  const meta = mealMeta[type];

  return (
    <div className="meal-card">
      <button className="meal-card-header" onClick={() => setOpen(o => !o)}>
        <div className="meal-header-left">
          <span className="meal-type-badge" style={{ color: meta.color, borderColor: meta.color + "33", background: meta.color + "0d" }}>
            {meta.emoji} {meta.label}
          </span>
          <h3 className="meal-name">{meal.name}</h3>
          <p className="meal-desc">{meal.description}</p>
        </div>
        <div className="meal-header-right">
          <div className="calorie-pill">{meal.calories} kcal</div>
          <span className="expand-icon" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>
      </button>

      {open && (
        <div className="meal-card-body">
          {/* Macros */}
          <div className="macros-row">
            <MacroBadge label="Protein" value={meal.protein} unit="g" color="#22c55e" />
            <div className="macro-divider" />
            <MacroBadge label="Carbs"   value={meal.carbs}   unit="g" color="#f59e0b" />
            <div className="macro-divider" />
            <MacroBadge label="Fat"     value={meal.fat}     unit="g" color="#3b82f6" />
            <div className="macro-divider" />
            <MacroBadge label="Prep"    value={parseInt(meal.prepTime)} unit={meal.prepTime.replace(/[0-9]/g, "").trim()} color="#a855f7" />
          </div>

          {/* Ingredients */}
          <div className="detail-section">
            <p className="detail-label">Ingredients</p>
            <div className="ingredients-grid">
              {meal.ingredients.map((ing, i) => (
                <span key={i} className="ingredient-chip">{ing}</span>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="tip-box">
            <span className="tip-icon">💡</span>
            <p className="tip-text">{meal.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MealsPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [weekDates, setWeekDates] = useState<Record<number, Date>>({});

  useEffect(() => {
    setSelectedDay(getTodayWorkoutDay());
    setWeekDates(getWeekDates());
  }, []);

  const dayData = meals.find(m => m.day === selectedDay)!;

  const totalCals = Object.values(dayData.meals).reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = Object.values(dayData.meals).reduce((sum, m) => sum + m.protein, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        body { background: #0a0a0a; margin: 0; }
        .meals-page { font-family: 'DM Sans', sans-serif; }

        .page-header {
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          border-bottom: 1px solid #181818;
          padding: 3rem 1rem 2rem;
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
        .app-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.75rem;
          color: #22c55e;
        }

        /* Day selector */
        .day-selector {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .day-selector::-webkit-scrollbar { display: none; }
        .day-btn {
          flex-shrink: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
          border: 1px solid #1e1e1e;
          background: #111;
          color: #555;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .day-btn:hover { border-color: #333; color: #999; }
        .day-btn.active {
          background: #22c55e14;
          border-color: #22c55e44;
          color: #22c55e;
        }

        /* Day summary */
        .day-summary {
          background: linear-gradient(135deg, #141414 0%, #0f0f0f 100%);
          border: 1px solid #1e1e1e;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .day-theme {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
          color: white;
          font-size: 1.2rem;
          line-height: 1.2;
        }
        .day-theme-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #22c55e;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .summary-stats {
          display: flex;
          gap: 1.25rem;
          flex-shrink: 0;
        }
        .summary-stat { text-align: center; }
        .summary-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          color: white;
          line-height: 1;
        }
        .summary-stat-label {
          font-size: 0.6rem;
          color: #555;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Meal card */
        .meal-card {
          background: linear-gradient(135deg, #131313 0%, #0f0f0f 100%);
          border: 1px solid #1e1e1e;
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .meal-card:hover { border-color: #2a2a2a; }
        .meal-card-header {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.1rem 1.25rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 0.75rem;
        }
        .meal-header-left { flex: 1; min-width: 0; }
        .meal-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .meal-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid;
          border-radius: 999px;
          padding: 0.2rem 0.6rem;
          margin-bottom: 0.5rem;
        }
        .meal-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
          color: white;
          font-size: 1.3rem;
          line-height: 1.1;
          margin: 0 0 4px 0;
        }
        .meal-desc {
          font-size: 0.78rem;
          color: #555;
          margin: 0;
          line-height: 1.5;
        }
        .calorie-pill {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          color: #666;
          background: #1a1a1a;
          border: 1px solid #222;
          border-radius: 999px;
          padding: 0.2rem 0.6rem;
        }
        .expand-icon { transition: transform 0.2s ease; display: flex; }

        /* Card body */
        .meal-card-body {
          padding: 0 1.25rem 1.25rem;
          border-top: 1px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1rem;
        }
        .macros-row {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 1rem 0.5rem;
        }
        .macro-divider {
          width: 1px;
          height: 2rem;
          background: #1e1e1e;
        }
        .detail-section {}
        .detail-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.65rem;
          color: #444;
          margin: 0 0 0.5rem 0;
        }
        .ingredients-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ingredient-chip {
          font-size: 0.72rem;
          font-weight: 500;
          color: #888;
          background: #1a1a1a;
          border: 1px solid #252525;
          border-radius: 6px;
          padding: 0.2rem 0.55rem;
        }
        .tip-box {
          display: flex;
          gap: 0.75rem;
          background: #130f00;
          border: 1px solid #f59e0b22;
          border-left: 3px solid #f59e0b;
          border-radius: 10px;
          padding: 0.75rem 1rem;
        }
        .tip-icon { font-size: 1rem; flex-shrink: 0; }
        .tip-text {
          font-size: 0.78rem;
          color: #c4a44a;
          line-height: 1.6;
          margin: 0;
        }

        .section-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.65rem;
          color: #444;
          text-transform: uppercase;
        }
      `}</style>

      <div className="meals-page min-h-screen bg-[#0a0a0a] pb-12">
        <div className="page-header">
          <div className="max-w-2xl mx-auto">
            <p className="app-name mb-4">FITGUIDE</p>
            <h1 className="page-title text-5xl md:text-6xl mb-2">Meal Guide</h1>
            <p className="page-sub">Nigerian meals built for your training days.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

          {/* Day selector */}
          <div>
            <p className="section-label mb-3">Select Day</p>
            <div className="day-selector">
              {meals.map(m => {
                const date = weekDates[m.day];
                const label = date ? formatShortDate(date) : `Day ${m.day}`;
                return (
                <button
                  key={m.day}
                  className={`day-btn ${m.day === selectedDay ? "active" : ""}`}
                  onClick={() => setSelectedDay(m.day)}
                >
                  {label}
                </button>
                );
              })}
            </div>
          </div>

          {/* Day summary */}
          <div className="day-summary">
            <div>
              <p className="day-theme-label">
                {weekDates[selectedDay] ? formatShortDate(weekDates[selectedDay]) : `Day ${selectedDay}`}
              </p>
              <p className="day-theme">{dayData.theme}</p>
            </div>
            <div className="summary-stats">
              <div className="summary-stat">
                <div className="summary-stat-value">{totalCals}</div>
                <div className="summary-stat-label">kcal</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat-value" style={{ color: "#22c55e" }}>{totalProtein}g</div>
                <div className="summary-stat-label">protein</div>
              </div>
            </div>
          </div>

          {/* Meal cards */}
          <div className="flex flex-col gap-3">
            {mealTypes.map(type => (
              <MealCard key={type} meal={dayData.meals[type]} type={type} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
