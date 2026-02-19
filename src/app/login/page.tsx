"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { authService } from "@/services/client/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    try {

      setLoading(true);
      console.log("passworrdddd", password)
      await authService.login(email, password);
      toast.success("Successfully logged in");

      router.push("/dashboard");
    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center font-sans"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Google Font Import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .font-mono-ui { font-family: 'DM Mono', monospace; }

        .input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          background: #F3F4F6;
          border: 1.5px solid #E5E7EB;
          font-size: 14px;
          color: #12245B;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .input-field::placeholder { color: #9CA3AF; }
        .input-field:focus {
          border-color: #12245B;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(18, 36, 91, 0.07);
        }

        .btn-signin {
          width: 100%;
          padding: 13px 20px;
          border-radius: 10px;
          background: #12245B;
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: -0.2px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(18, 36, 91, 0.18);
        }
        .btn-signin:hover:not(:disabled) {
          background: #1a3278;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(18, 36, 91, 0.24);
        }
        .btn-signin:active:not(:disabled) { transform: translateY(0); }
        .btn-signin:disabled { opacity: 0.7; cursor: not-allowed; }

        .stat-card {
          background: #ffffff;
          border: 1.5px solid #E5E7EB;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 1px 4px rgba(18, 36, 91, 0.05);
          flex: 1;
        }

        .ai-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(18, 36, 91, 0.05);
          border: 1px solid rgba(18, 36, 91, 0.1);
          border-radius: 100px;
          padding: 4px 10px 4px 6px;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #B4F000;
          box-shadow: 0 0 0 3px rgba(180, 240, 0, 0.3);
          animation: pulse-anim 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-anim {
          0%, 100% { box-shadow: 0 0 0 3px rgba(180, 240, 0, 0.3); }
          50% { box-shadow: 0 0 0 6px rgba(180, 240, 0, 0.1); }
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .right-panel {
          position: relative;
          overflow: hidden;
        }
        .right-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(18, 36, 91, 0.55) 0%,
            rgba(18, 36, 91, 0.2) 50%,
            transparent 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        .overlay-card {
          position: absolute;
          bottom: 32px;
          left: 32px;
          right: 32px;
          z-index: 2;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 18px 20px;
          color: white;
        }

        .feature-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .feature-row:last-child { margin-bottom: 0; }

        .feature-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(180, 240, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(18,36,91,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18,36,91,0.03) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }
      `}</style>

      <div className="max-w-screen-xl w-full m-0 sm:m-10 bg-white border border-gray-200 sm:rounded-2xl flex flex-1 shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>

        {/* ── LEFT PANEL ── */}
        <div className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12 flex flex-col justify-between relative">
          <div className="grid-bg" />

          {/* Top: Logo */}
          <div className="relative z-10">
            <Image
              src="/images/shamiri.png"
              alt="Shamiri"
              width={120}
              height={40}
              className="object-contain"
              style={{ maxHeight: 40 }}
            />
          </div>

          {/* Middle: Preamble + Form */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">

            {/* AI Badge */}
            <div className="ai-pill mb-5" style={{ width: 'fit-content' }}>
              <span className="pulse-dot" />
              <span className="font-mono-ui" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#12245B' }}>
                AI-Powered Supervision
              </span>
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.6px', lineHeight: 1.2, color: '#12245B', marginBottom: '10px' }}>
              Supervisor Intelligence<br />
              <span style={{ color: '#B4F000', filter: 'brightness(0.7)' }}>Dashboard</span>
            </h1>

            {/* Preamble */}
            <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#6B7280', marginBottom: '24px', maxWidth: '360px' }}>
              Monitor session quality, fidelity, and safety across youth-delivered
              mental health interventions — with AI insight and human oversight working together.
            </p>

            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
              <div className="stat-card">
                <span style={{ fontSize: '17px', fontWeight: 700, color: '#12245B', letterSpacing: '-0.5px' }}>
                  200k<span style={{ color: '#B4F000', filter: 'brightness(0.65)' }}>+</span>
                </span>
                <span className="font-mono-ui" style={{ fontSize: '9px', fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Youth Served
                </span>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: '17px', fontWeight: 700, color: '#12245B', letterSpacing: '-0.5px' }}>
                  80<span style={{ color: '#B4F000', filter: 'brightness(0.65)' }}>%</span>
                </span>
                <span className="font-mono-ui" style={{ fontSize: '9px', fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Show Improvement
                </span>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: '17px', fontWeight: 700, color: '#12245B', letterSpacing: '-0.5px' }}>
                  3k<span style={{ color: '#B4F000', filter: 'brightness(0.65)' }}>+</span>
                </span>
                <span className="font-mono-ui" style={{ fontSize: '9px', fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Providers Trained
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderBottom: '1.5px solid #E5E7EB', marginBottom: '28px' }} />

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="font-mono-ui" style={{ display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>
                  Organisational Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@shamiri.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="font-mono-ui" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9CA3AF' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#12245B')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-signin" disabled={loading} style={{ marginTop: '4px' }}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <p className="font-mono-ui" style={{ fontSize: '11px', color: '#D1D5DB', textAlign: 'center' }}>
              Access is provisioned by your organisation · shamiri.institute
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="right-panel flex-1 hidden lg:block"
          style={{ background: '#0f1f52', position: 'relative' }}
        >
          {/* Background image */}
          <Image
            src="/images/session_school.jpg"
            alt="Shamiri session in progress"
            fill
            className="object-cover"
            style={{ opacity: 0.55 }}
            priority
          />

          {/* Gradient overlay handled by ::before pseudo */}

          {/* Top-right decorative element */}
          <div style={{
            position: 'absolute', top: 28, right: 28, zIndex: 2,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="pulse-dot" />
            <span className="font-mono-ui" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>
              Live AI Analysis
            </span>
          </div>

          {/* Bottom overlay card */}
          <div className="overlay-card">
            <p className="font-mono-ui" style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
              What you get access to
            </p>

            <div className="feature-row">
              <div className="feature-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B4F000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                AI-generated session summaries & quality scores
              </span>
            </div>

            <div className="feature-row">
              <div className="feature-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B4F000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                Risk detection with flagging & human validation
              </span>
            </div>

            <div className="feature-row">
              <div className="feature-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B4F000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                Fidelity monitoring across your Fellow network
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
