"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        body { background: #0a0a0a; margin: 0; }

        .welcome-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100dvh;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* Background glow */
        .welcome-page::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .welcome-card {
          width: 100%;
          max-width: 440px;
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 24px;
          padding: 2.5rem 2rem;
          position: relative;
          z-index: 1;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #22c55e14;
          border: 1px solid #22c55e22;
          border-radius: 100px;
          padding: 0.3rem 0.85rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #22c55e;
          margin-bottom: 1.5rem;
        }

        .welcome-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.8rem;
          letter-spacing: 0.03em;
          color: white;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .welcome-emoji {
          display: inline;
        }

        .welcome-divider {
          width: 40px;
          height: 3px;
          background: #22c55e;
          border-radius: 2px;
          margin: 1.25rem 0;
        }

        .welcome-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .welcome-body p {
          font-size: 0.95rem;
          color: #aaa;
          line-height: 1.7;
          margin: 0;
        }

        .welcome-body p.highlight {
          color: #ddd;
          font-weight: 500;
        }

        .welcome-cta {
          width: 100%;
          background: #22c55e;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 1rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 24px rgba(34,197,94,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .welcome-cta:hover {
          background: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(34,197,94,0.3);
        }

        .welcome-cta:active {
          transform: translateY(0);
        }

        .welcome-footer {
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid #161616;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .founder-label {
          font-size: 0.72rem;
          color: #333;
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
        }

        .founder-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          color: #444;
        }
      `}</style>

      <div className="welcome-page">
        <div className="welcome-card">
          <div className="welcome-badge">FITGUIDE</div>

          <h1 className="welcome-title">
            Welcome to FitGuide <span className="welcome-emoji">💪</span>
          </h1>

          <div className="welcome-divider" />

          <div className="welcome-body">
            <p className="highlight">You just made a solid move.</p>
            <p>
              No stress, no confusion — just simple workouts, the right food, and real progress.
            </p>
            <p>
              Show up. Stay consistent. Let&apos;s get better every day.
            </p>
          </div>

          <button className="welcome-cta" onClick={() => router.push("/")}>
            Go Into App
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div className="welcome-footer">
            <span className="founder-label">Founder</span>
            <span className="founder-name">The_Mauteen 🚀</span>
          </div>
        </div>
      </div>
    </>
  );
}
