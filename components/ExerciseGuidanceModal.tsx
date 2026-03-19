"use client";

import { useEffect, useRef } from "react";
import { formatRest } from "@/lib/workoutUtils";
import { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

export default function ExerciseGuidanceModal({ exercise, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exercise) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [exercise, onClose]);

  if (!exercise) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .modal-backdrop {
          animation: fadeIn 0.2s ease forwards;
        }
        .modal-panel {
          animation: slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
        @media (min-width: 768px) {
          .modal-panel {
            animation: scaleIn 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.94) translateY(8px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .stat-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #141414 100%);
          border: 1px solid #2a2a2a;
          transition: border-color 0.2s ease;
        }
        .stat-card:hover {
          border-color: #22c55e44;
        }
        .step-item {
          position: relative;
          padding-left: 2.5rem;
        }
        .step-number {
          position: absolute;
          left: 0;
          top: 0;
          width: 1.75rem;
          height: 1.75rem;
          background: #22c55e14;
          border: 1px solid #22c55e44;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          color: #22c55e;
          flex-shrink: 0;
        }
        .section-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.15em;
          font-size: 0.7rem;
          color: #555;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .exercise-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .modal-body {
          font-family: 'DM Sans', sans-serif;
        }
        .scrollable {
          scrollbar-width: thin;
          scrollbar-color: #2a2a2a transparent;
        }
        .scrollable::-webkit-scrollbar {
          width: 4px;
        }
        .scrollable::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollable::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 2px;
        }
        .close-btn {
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .close-btn:hover {
          background: #2a2a2a;
          transform: rotate(90deg);
        }
        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 10px;
          background: #111;
        }
        .video-container iframe {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          border: 0;
          border-radius: 10px;
        }
        .tip-box {
          background: linear-gradient(135deg, #1a1600 0%, #181300 100%);
          border: 1px solid #f59e0b33;
          border-left: 3px solid #f59e0b;
        }
        .muscle-tag {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #999;
        }
        .difficulty-badge {
          background: #22c55e14;
          border: 1px solid #22c55e44;
          color: #22c55e;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="modal-backdrop fixed inset-0 z-50 flex items-end md:items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Panel */}
        <div
          ref={modalRef}
          className="modal-panel modal-body w-full md:max-w-2xl md:mx-4 md:rounded-2xl rounded-t-2xl flex flex-col"
          style={{
            background: "#0f0f0f",
            border: "1px solid #1e1e1e",
            maxHeight: "92dvh",
          }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span
                className="muscle-tag text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {exercise.muscle}
              </span>
              <span className="difficulty-badge text-xs font-semibold px-2.5 py-1 rounded-full">
                {exercise.difficulty}
              </span>
            </div>
            <button
              onClick={onClose}
              className="close-btn w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="scrollable overflow-y-auto px-5 pb-8 flex flex-col gap-6">

            {/* Video */}
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={exercise.name}
              />
            </div>

            {/* Exercise name */}
            <div>
              <h2
                className="exercise-title text-4xl md:text-5xl text-white"
              >
                {exercise.name}
              </h2>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="stat-card rounded-xl p-3.5 flex flex-col items-center gap-1.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4h12M6 20h12M6 12h12M3 8h18M3 16h18"/>
                </svg>
                <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                  {exercise.sets}
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">Sets</span>
              </div>
              <div className="stat-card rounded-xl p-3.5 flex flex-col items-center gap-1.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                  {exercise.reps}
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">Reps</span>
              </div>
              <div className="stat-card rounded-xl p-3.5 flex flex-col items-center gap-1.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                  {formatRest(exercise.rest)}
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">Rest</span>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <p className="section-label">How to do it</p>
              <ol className="flex flex-col gap-4">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="step-item">
                    <span className="step-number">{i + 1}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div className="tip-box rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
                <div>
                  <p className="section-label" style={{ color: "#f59e0b", marginBottom: "0.25rem" }}>
                    Pro Tip
                  </p>
                  <p className="text-amber-100/80 text-sm leading-relaxed">{exercise.tips}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
