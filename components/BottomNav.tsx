"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Workout",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#22c55e" : "#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M18 4v16M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"/>
      </svg>
    ),
  },
  {
    href: "/meals",
    label: "Meals",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#22c55e" : "#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
  },
  {
    href: "/progress",
    label: "Progress",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#22c55e" : "#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600&display=swap');
        .bottom-nav {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid #1a1a1a;
          z-index: 40;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        .nav-inner {
          max-width: 42rem;
          margin: 0 auto;
          display: flex;
          align-items: stretch;
          justify-content: space-around;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 0.85rem 1.5rem;
          text-decoration: none;
          flex: 1;
          transition: opacity 0.15s ease;
        }
        .nav-item:hover { opacity: 0.8; }
        .nav-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.15s ease;
        }
        .nav-label.active { color: #22c55e; }
        .nav-label.inactive { color: #444; }
        .nav-indicator {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #22c55e;
          margin-top: 2px;
        }
      `}</style>
      <nav className="bottom-nav">
        <div className="nav-inner">
          {navItems.map(item => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="nav-item">
                {item.icon(isActive)}
                <span className={`nav-label ${isActive ? "active" : "inactive"}`}>{item.label}</span>
                {isActive && <div className="nav-indicator" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
