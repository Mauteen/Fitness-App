"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/store/progressStore";

const navItems = [
  {
    href: "/",
    label: "Workout",
    description: "Today's training",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#22c55e" : "#666"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M18 4v16M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"/>
      </svg>
    ),
  },
  {
    href: "/meals",
    label: "Meals",
    description: "Daily nutrition guide",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#22c55e" : "#666"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
  },
  {
    href: "/progress",
    label: "Progress",
    description: "Streaks & history",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#22c55e" : "#666"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

export default function SideNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Reset progress store so next user starts fresh
    useProgressStore.setState({ completedDates: [], streak: 0, lastCompletedDate: null, hydrated: false });
    router.push("/auth/login");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

        /* Hamburger button */
        .hamburger-btn {
          position: fixed;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 60;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(15,15,15,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid #222;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .hamburger-btn:hover { border-color: #333; background: rgba(25,25,25,0.95); }
        .hamburger-btn.open { border-color: #22c55e33; }

        .bar {
          width: 18px;
          height: 1.5px;
          background: #aaa;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease, width 0.2s ease;
          transform-origin: center;
        }
        .hamburger-btn.open .bar:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .hamburger-btn.open .bar:nth-child(2) {
          opacity: 0;
          width: 0;
        }
        .hamburger-btn.open .bar:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* Backdrop */
        .sidenav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(3px);
          z-index: 50;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .sidenav-backdrop.open {
          opacity: 1;
          pointer-events: all;
        }

        /* Drawer */
        .sidenav-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100dvh;
          width: 280px;
          background: #0d0d0d;
          border-left: 1px solid #1e1e1e;
          z-index: 55;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .sidenav-drawer.open {
          transform: translateX(0);
        }

        /* Drawer header */
        .drawer-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #161616;
        }
        .drawer-app-name {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.2em;
          font-size: 0.7rem;
          color: #22c55e;
          margin-bottom: 0.25rem;
        }
        .drawer-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 0.04em;
          color: white;
          line-height: 1;
        }

        /* Nav items */
        .drawer-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .drawer-nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 0.75rem;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.15s ease;
          border: 1px solid transparent;
        }
        .drawer-nav-item:hover {
          background: #161616;
        }
        .drawer-nav-item.active {
          background: #22c55e0d;
          border-color: #22c55e22;
        }
        .drawer-nav-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #161616;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .drawer-nav-item.active .drawer-nav-icon {
          background: #22c55e14;
        }
        .drawer-nav-text { flex: 1; }
        .drawer-nav-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #ccc;
          display: block;
          line-height: 1.2;
          transition: color 0.15s ease;
        }
        .drawer-nav-item.active .drawer-nav-label { color: #22c55e; }
        .drawer-nav-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          color: #444;
          display: block;
          margin-top: 1px;
        }
        .drawer-nav-item.active .drawer-nav-desc { color: #22c55e66; }
        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }

        /* Footer */
        .drawer-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid #161616;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .drawer-footer-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          color: #333;
          letter-spacing: 0.04em;
        }
        .signout-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 0.75rem;
          border-radius: 10px;
          border: 1px solid #1e1e1e;
          background: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #666;
          width: 100%;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .signout-btn:hover {
          background: #1a0808;
          border-color: #ef444422;
          color: #ef4444;
        }
      `}</style>

      {/* Hamburger button */}
      <button
        className={`hamburger-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      {/* Backdrop */}
      <div
        className={`sidenav-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <nav className={`sidenav-drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <p className="drawer-app-name">FITGUIDE</p>
          <p className="drawer-title">Menu</p>
        </div>

        <div className="drawer-nav">
          {navItems.map(item => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`drawer-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <div className="drawer-nav-icon">
                  {item.icon(isActive)}
                </div>
                <div className="drawer-nav-text">
                  <span className="drawer-nav-label">{item.label}</span>
                  <span className="drawer-nav-desc">{item.description}</span>
                </div>
                {isActive && <div className="active-dot" />}
              </Link>
            );
          })}
        </div>

        <div className="drawer-footer">
          <button className="signout-btn" onClick={handleSignOut}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
          <p className="drawer-footer-text">© 2025 FitGuide — Built for Mauteen</p>
        </div>
      </nav>
    </>
  );
}
