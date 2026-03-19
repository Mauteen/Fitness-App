"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        body { background: #0a0a0a; margin: 0; }
        .auth-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100dvh;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          padding: 2rem;
        }
        .auth-logo {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          color: #22c55e;
          margin-bottom: 0.5rem;
        }
        .auth-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          letter-spacing: 0.03em;
          color: white;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .auth-sub {
          font-size: 0.82rem;
          color: #555;
          margin-bottom: 2rem;
        }
        .field { margin-bottom: 1rem; }
        .field label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 0.4rem;
        }
        .field input {
          width: 100%;
          background: #0d0d0d;
          border: 1px solid #222;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: white;
          outline: none;
          transition: border-color 0.15s ease;
          box-sizing: border-box;
        }
        .field input:focus { border-color: #22c55e44; }
        .field input::placeholder { color: #333; }
        .submit-btn {
          width: 100%;
          background: #22c55e;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.85rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          margin-top: 0.5rem;
          box-shadow: 0 4px 20px rgba(34,197,94,0.2);
        }
        .submit-btn:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-box {
          background: #1a0808;
          border: 1px solid #ef444433;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.8rem;
          color: #ef4444;
          margin-bottom: 1rem;
        }
        .success-box {
          background: #0d1a0d;
          border: 1px solid #22c55e33;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.8rem;
          color: #22c55e;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #444;
        }
        .auth-footer a {
          color: #22c55e;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-footer a:hover { text-decoration: underline; }
        .divider { border: none; border-top: 1px solid #1a1a1a; margin: 1.5rem 0; }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-logo">FITGUIDE</p>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Start your fitness journey with FitGuide.</p>

          {error && <div className="error-box">{error}</div>}
          {success && <div className="success-box">✓ {success}</div>}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="field">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          <hr className="divider" />

          <p className="auth-footer">
            Already have an account?{" "}
            <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
