"use client";
import Image from "next/image";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "analyzed" | "groups" | "profile";

interface Session {
  id: string;
  fellow: string;
  date: string;
  groupId: string;
  topic: string;
  status: "Safe" | "Flagged" | "Processed";
  scores: { content: number; facilitation: number; safety: number };
  risk: "SAFE" | "RISK";
}

interface Group {
  id: string;
  name: string;
  fellow: string;
  location: string;
  sessions: number;
  lastSession: string;
  avgScore: number;
  status: "Active" | "Paused";
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const SESSIONS: Session[] = [
  { id: "S-001", fellow: "Amara Osei", date: "Feb 17, 2026", groupId: "GRP-04", topic: "Growth Mindset", status: "Safe", scores: { content: 3, facilitation: 3, safety: 3 }, risk: "SAFE" },
  { id: "S-002", fellow: "Kenji Mwangi", date: "Feb 16, 2026", groupId: "GRP-07", topic: "Gratitude Practice", status: "Flagged", scores: { content: 2, facilitation: 2, safety: 1 }, risk: "RISK" },
  { id: "S-003", fellow: "Lucia Ndegwa", date: "Feb 15, 2026", groupId: "GRP-02", topic: "Problem Solving", status: "Processed", scores: { content: 3, facilitation: 2, safety: 3 }, risk: "SAFE" },
  { id: "S-004", fellow: "Amara Osei", date: "Feb 14, 2026", groupId: "GRP-04", topic: "Values in Action", status: "Safe", scores: { content: 3, facilitation: 3, safety: 3 }, risk: "SAFE" },
  { id: "S-005", fellow: "Temi Adeyemi", date: "Feb 13, 2026", groupId: "GRP-11", topic: "Growth Mindset", status: "Processed", scores: { content: 2, facilitation: 3, safety: 2 }, risk: "SAFE" },
  { id: "S-006", fellow: "Kenji Mwangi", date: "Feb 12, 2026", groupId: "GRP-07", topic: "Gratitude Practice", status: "Safe", scores: { content: 3, facilitation: 3, safety: 3 }, risk: "SAFE" },
];

const GROUPS: Group[] = [
  { id: "GRP-02", name: "Westlands Youth Circle", fellow: "Lucia Ndegwa", location: "Nairobi West", sessions: 8, lastSession: "Feb 15, 2026", avgScore: 2.7, status: "Active" },
  { id: "GRP-04", name: "Kibera Resilience Group", fellow: "Amara Osei", location: "Kibera", sessions: 12, lastSession: "Feb 17, 2026", avgScore: 3.0, status: "Active" },
  { id: "GRP-07", name: "Mathare Hope Collective", fellow: "Kenji Mwangi", location: "Mathare", sessions: 6, lastSession: "Feb 16, 2026", avgScore: 2.1, status: "Active" },
  { id: "GRP-11", name: "Eastleigh Rising Stars", fellow: "Temi Adeyemi", location: "Eastleigh", sessions: 4, lastSession: "Feb 13, 2026", avgScore: 2.4, status: "Paused" },
];

const USER = { name: "Dr. Naledi Dlamini", role: "Senior Supervisor", avatar: "ND" };

// ─── Score Dot ────────────────────────────────────────────────────────────────
function ScoreDot({ score }: { score: number }) {
  const colors = ["", "#EF4444", "#F59E0B", "#B4F000"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, borderRadius: 6,
      background: score === 3 ? "rgba(180,240,0,0.15)" : score === 2 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.1)",
      fontSize: 11, fontWeight: 700, color: colors[score],
      fontFamily: "'DM Mono', monospace"
    }}>
      {score}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Safe: { bg: "rgba(180,240,0,0.12)", color: "#5a7a00" },
    Flagged: { bg: "rgba(239,68,68,0.1)", color: "#DC2626" },
    Processed: { bg: "rgba(18,36,91,0.07)", color: "#12245B" },
    Active: { bg: "rgba(180,240,0,0.12)", color: "#5a7a00" },
    Paused: { bg: "rgba(156,163,175,0.15)", color: "#6B7280" },
  };
  const s = map[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.03em", whiteSpace: "nowrap"
    }}>
      {status}
    </span>
  );
}

// ─── Analyzed Sessions Page ───────────────────────────────────────────────────
function AnalyzedSessions() {
  const [filter, setFilter] = useState<string>("All");
  const filters = ["All", "Safe", "Flagged", "Processed"];
  const filtered = filter === "All" ? SESSIONS : SESSIONS.filter(s => s.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#12245B", letterSpacing: "-0.5px" }}>Analyzed Sessions</h2>
          <span style={{ background: "rgba(18,36,91,0.07)", color: "#12245B", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100, fontFamily: "'DM Mono', monospace" }}>
            {SESSIONS.length}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>AI-processed session transcripts with quality scores and risk detection.</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Sessions", value: "6", sub: "This month" },
          { label: "Safe", value: "4", sub: "No flags", accent: true },
          { label: "Flagged", value: "1", sub: "Needs review", warn: true },
          { label: "Avg Quality", value: "2.6", sub: "Out of 3.0" },
        ].map((c, i) => (
          <div key={i} style={{
            background: "#fff", border: `1.5px solid ${c.warn ? "rgba(239,68,68,0.2)" : c.accent ? "rgba(180,240,0,0.3)" : "#E5E7EB"}`,
            borderRadius: 12, padding: "16px 18px",
            borderLeft: c.warn ? "4px solid #EF4444" : c.accent ? "4px solid #B4F000" : undefined
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#12245B", letterSpacing: "-0.5px", marginBottom: 2 }}>{c.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{c.label}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
            borderColor: filter === f ? "#12245B" : "#E5E7EB",
            background: filter === f ? "#12245B" : "#fff",
            color: filter === f ? "#fff" : "#6B7280",
            fontFamily: "'DM Sans', sans-serif"
          }}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #F3F4F6" }}>
              {["Session", "Fellow", "Date", "Topic", "Content", "Facilitation", "Safety", "Risk", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none", transition: "background 0.15s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 600, color: "#12245B", fontFamily: "'DM Mono', monospace" }}>{s.id}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", fontWeight: 500 }}>{s.fellow}</td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>{s.date}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{s.topic}</td>
                <td style={{ padding: "14px 16px" }}><ScoreDot score={s.scores.content} /></td>
                <td style={{ padding: "14px 16px" }}><ScoreDot score={s.scores.facilitation} /></td>
                <td style={{ padding: "14px 16px" }}><ScoreDot score={s.scores.safety} /></td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                    color: s.risk === "RISK" ? "#DC2626" : "#5a7a00",
                    background: s.risk === "RISK" ? "rgba(239,68,68,0.1)" : "rgba(180,240,0,0.12)",
                    padding: "2px 8px", borderRadius: 6
                  }}>{s.risk}</span>
                </td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Group Sessions Page ──────────────────────────────────────────────────────
function GroupSessions() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#12245B", letterSpacing: "-0.5px" }}>Group Sessions</h2>
          <span style={{ background: "rgba(18,36,91,0.07)", color: "#12245B", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100, fontFamily: "'DM Mono', monospace" }}>
            {GROUPS.length}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Active youth groups under your supervision and their session history.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {GROUPS.map(g => (
          <div key={g.id} style={{
            background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14,
            borderLeft: "4px solid #B4F000", padding: "20px 20px 16px",
            cursor: "pointer", transition: "box-shadow 0.2s, transform 0.15s"
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(18,36,91,0.08)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>{g.id}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#12245B", letterSpacing: "-0.3px" }}>{g.name}</div>
              </div>
              <StatusBadge status={g.status} />
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {g.fellow}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {g.location}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "12px 0", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6", marginBottom: 12 }}>
              {[
                { label: "Sessions", value: g.sessions },
                { label: "Avg Score", value: g.avgScore.toFixed(1) },
                { label: "Last Session", value: g.lastSession.split(",")[0] },
              ].map((m, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#12245B", letterSpacing: "-0.3px" }}>{m.value}</div>
                  <div style={{ fontSize: 9, fontWeight: 500, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Score bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>Quality Index</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#12245B", fontFamily: "'DM Mono', monospace" }}>{((g.avgScore / 3) * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: 5, background: "#F3F4F6", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(g.avgScore / 3) * 100}%`, background: g.avgScore >= 2.7 ? "#B4F000" : g.avgScore >= 2 ? "#F59E0B" : "#EF4444", borderRadius: 10, transition: "width 0.5s" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function Profile({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#12245B", letterSpacing: "-0.5px", marginBottom: 6 }}>Profile</h2>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Your account details and supervision overview.</p>
      </div>

      {/* Profile card */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ background: "#12245B", height: 80, position: "relative" }}>
          <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 40, background: "linear-gradient(rgba(18,36,91,0.3),transparent)" }} />
          <div style={{ position: "absolute", top: 8, right: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#B4F000", boxShadow: "0 0 0 3px rgba(180,240,0,0.25)" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.07em" }}>Active Session</span>
          </div>
        </div>
        <div style={{ padding: "0 24px 24px", marginTop: -32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: "#12245B",
            border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#B4F000", marginBottom: 12,
            boxShadow: "0 2px 8px rgba(18,36,91,0.15)", letterSpacing: "-0.5px"
          }}>
            {USER.avatar}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#12245B", letterSpacing: "-0.4px", marginBottom: 4 }}>{USER.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>{USER.role}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D1D5DB" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>Shamiri Institute</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Account Details</div>
        {[
          { label: "Email", value: "n.dlamini@shamiri.institute" },
          { label: "Role", value: "Senior Supervisor" },
          { label: "Organisation", value: "Shamiri Institute" },
          { label: "Region", value: "Nairobi, Kenya" },
          { label: "Fellows Supervised", value: "4 active fellows" },
        ].map((row, i, arr) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid #F9FAFB" : "none" }}>
            <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#12245B" }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{
        width: "100%", padding: "13px 20px", borderRadius: 10,
        border: "1.5px solid #E5E7EB", background: "#fff",
        fontSize: 13, fontWeight: 600, color: "#DC2626",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "background 0.15s, border-color 0.15s", fontFamily: "'DM Sans', sans-serif"
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, onLogout }: { active: Page; setActive: (p: Page) => void; onLogout: () => void }) {
  const nav: { id: Page; label: string; icon: React.ReactNode }[] = [
    {
      id: "analyzed", label: "Analyzed Sessions",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
    },
    {
      id: "groups", label: "Group Sessions",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
      id: "profile", label: "Profile",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    },
  ];

  return (
    <aside style={{
      width: 220, background: "#12245B", display: "flex", flexDirection: "column",
      padding: "24px 0", flexShrink: 0, position: "relative", overflow: "hidden"
    }}>
      {/* Decorative glow */}
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, background: "#B4F000", borderRadius: "50%", opacity: 0.06, filter: "blur(50px)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Image src="/images/shamiri.png" alt="Shamiri" width={100} height={32} style={{ objectFit: "contain", filter: "brightness(0) invert(1)", maxHeight: 28 }} />
      </div>

      {/* AI Badge */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 10px" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B4F000", boxShadow: "0 0 0 2px rgba(180,240,0,0.25)" }} />
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>shamiriAI Active</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 8px 10px" }}>Navigation</div>
        {nav.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 9, marginBottom: 2,
              background: isActive ? "rgba(180,240,0,0.12)" : "transparent",
              border: isActive ? "1px solid rgba(180,240,0,0.2)" : "1px solid transparent",
              color: isActive ? "#B4F000" : "rgba(255,255,255,0.5)",
              fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: "pointer",
              transition: "all 0.15s", textAlign: "left",
              fontFamily: "'DM Sans', sans-serif"
            }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
              {item.id === "analyzed" && (
                <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 100, fontFamily: "'DM Mono', monospace" }}>6</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User area */}
      <div style={{ padding: "16px 12px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={() => setActive("profile")} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px",
          borderRadius: 9, background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s"
        }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: "#12245B",
            border: "1.5px solid rgba(180,240,0,0.4)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#B4F000", flexShrink: 0
          }}>
            {USER.avatar}
          </div>
          <div style={{ textAlign: "left", minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{USER.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{USER.role}</div>
          </div>
        </button>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ page }: { page: Page }) {
  const titles: Record<Page, string> = {
    analyzed: "Analyzed Sessions",
    groups: "Group Sessions",
    profile: "Profile",
  };

  return (
    <header style={{
      height: 60, background: "#fff", borderBottom: "1.5px solid #F3F4F6",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", flexShrink: 0
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#12245B", letterSpacing: "-0.3px" }}>{titles[page]}</span>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#E5E7EB" }} />
        <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>shamiri.institute</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Today's date */}
        <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>
          {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </span>
        {/* Notification dot */}
        <div style={{ position: "relative" }}>
          <button style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#fff"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          </button>
          <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: "#EF4444", border: "1.5px solid #fff" }} />
        </div>
        {/* Avatar */}
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "#12245B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#B4F000", cursor: "pointer" }}>
          {USER.avatar}
        </div>
      </div>
    </header>
  );
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState<Page>("analyzed");
  const [loggedOut, setLoggedOut] = useState(false);

  if (loggedOut) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#12245B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B4F000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#12245B", marginBottom: 6 }}>You've been signed out</div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>Your session has ended securely.</div>
          <button onClick={() => setLoggedOut(false)} style={{ padding: "10px 24px", borderRadius: 10, background: "#12245B", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Sign Back In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <Sidebar active={page} setActive={setPage} onLogout={() => setLoggedOut(true)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar page={page} />
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {page === "analyzed" && <AnalyzedSessions />}
          {page === "groups" && <GroupSessions />}
          {page === "profile" && <Profile onLogout={() => setLoggedOut(true)} />}
        </main>
      </div>
    </div>
  );
}
