"use client";

import { useState } from "react";
import exercisesData from "@/data/exercises.json";
import { Exercise } from "@/lib/types";
import { getExerciseCategory } from "@/lib/workoutUtils";
import ExerciseCard from "@/components/ExerciseCard";
import ExerciseGuidanceModal from "@/components/ExerciseGuidanceModal";

const exercises = exercisesData as Exercise[];

const CATEGORIES = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = exercises.filter((ex) => {
    const matchesCategory =
      activeCategory === "All" || getExerciseCategory(ex) === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || ex.name.toLowerCase().includes(q) || ex.muscle.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setSearchQuery("");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        body { background: #0a0a0a; }

        .library-page {
          min-height: 100dvh;
          background: #0a0a0a;
          padding: 0 0 3rem;
          font-family: 'DM Sans', sans-serif;
        }

        .library-header {
          padding: 3rem 1.25rem 1.5rem;
          border-bottom: 1px solid #161616;
        }
        .library-app-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.2em;
          font-size: 0.7rem;
          color: #22c55e;
          margin-bottom: 0.4rem;
        }
        .library-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.2rem, 8vw, 3rem);
          letter-spacing: 0.04em;
          color: white;
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .library-subtitle {
          font-size: 0.82rem;
          color: #555;
          font-weight: 400;
        }

        .tabs-wrapper {
          overflow-x: auto;
          padding: 1.25rem 1.25rem 0;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .tabs-wrapper::-webkit-scrollbar { display: none; }

        .tabs-row {
          display: flex;
          gap: 0.5rem;
          min-width: max-content;
          padding-bottom: 1rem;
          border-bottom: 1px solid #161616;
        }

        .tab-btn {
          padding: 0.45rem 1rem;
          border-radius: 999px;
          border: 1px solid #222;
          background: #111;
          color: #666;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          white-space: nowrap;
        }
        .tab-btn:hover {
          border-color: #333;
          color: #999;
        }
        .tab-btn.active {
          background: #22c55e14;
          border-color: #22c55e44;
          color: #22c55e;
        }

        .search-wrapper {
          padding: 1rem 1.25rem 0;
        }
        .search-input {
          width: 100%;
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 0.7rem 1rem 0.7rem 2.75rem;
          color: #ddd;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s ease;
          box-sizing: border-box;
        }
        .search-input::placeholder { color: #444; }
        .search-input:focus { border-color: #22c55e44; }

        .search-icon-wrap {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #444;
        }

        .results-count {
          padding: 0.75rem 1.25rem 0;
          font-size: 0.72rem;
          color: #444;
          letter-spacing: 0.04em;
          font-weight: 500;
        }

        .exercises-list {
          padding: 0.75rem 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .empty-state {
          padding: 4rem 1.25rem;
          text-align: center;
        }
        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }
        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.06em;
          color: #444;
          margin-bottom: 0.4rem;
        }
        .empty-sub {
          font-size: 0.8rem;
          color: #333;
        }
      `}</style>

      <div className="library-page">
        {/* Header */}
        <div className="library-header">
          <p className="library-app-label">FITGUIDE</p>
          <h1 className="library-title">Exercise Library</h1>
          <p className="library-subtitle">Tap any exercise to view the full guide</p>
        </div>

        {/* Category tabs */}
        <div className="tabs-wrapper">
          <div className="tabs-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <div className="search-icon-wrap">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or muscle…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="results-count">
          {filtered.length} {filtered.length === 1 ? "EXERCISE" : "EXERCISES"}
          {activeCategory !== "All" ? ` · ${activeCategory.toUpperCase()}` : ""}
        </p>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="exercises-list">
            {filtered.map((ex, i) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                index={i}
                onViewGuide={setSelectedExercise}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No exercises found</p>
            <p className="empty-sub">Try a different search term or category</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ExerciseGuidanceModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
