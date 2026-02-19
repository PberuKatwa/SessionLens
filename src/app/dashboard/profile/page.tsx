"use client";

import React from "react";

const FAKE_USER = {
  name: "Nomusa Dlamini",
  role: "Senior Supervisor",
  avatar: "ND",
  email: "n.dlamini@shamiri.institute",
  organisation: "Shamiri Institute",
  region: "Nairobi, Kenya",
  fellowsSupervised: "4 active fellows",
  joined: "March 2023",
};

const ACCOUNT_ROWS = [
  { label: "Email", value: FAKE_USER.email },
  { label: "Role", value: FAKE_USER.role },
  { label: "Organisation", value: FAKE_USER.organisation },
  { label: "Region", value: FAKE_USER.region },
  { label: "Fellows Supervised", value: FAKE_USER.fellowsSupervised },
  { label: "Member Since", value: FAKE_USER.joined },
];

const STATS = [
  { value: "4", label: "Fellows" },
  { value: "6", label: "Sessions" },
  { value: "80%", label: "Avg Safety" },
];

export default function Profile() {
  return (
    <div className="w-full max-w-[85%] mx-auto py-8 px-2">

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#12245B] tracking-tight mb-1">
          Profile
        </h2>
        <p className="text-sm text-gray-400">
          Your account details and supervision overview.
        </p>
      </div>

      {/* Top grid: Profile card + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Profile identity card — spans 2 cols */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Navy banner */}
          <div className="bg-[#12245B] h-24 relative">
            {/* Subtle dot grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* Live indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#B4F000]"
                style={{ boxShadow: "0 0 0 3px rgba(180,240,0,0.3)" }}
              />
              <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest font-mono">
                Active
              </span>
            </div>
          </div>

          {/* Avatar + name section */}
          <div className="px-8 pb-8 -mt-8">
            <div className="flex items-end gap-5 mb-5">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl bg-[#12245B] border-[3px] border-white flex items-center justify-center text-xl font-bold text-[#B4F000] shrink-0"
                style={{ boxShadow: "0 2px 10px rgba(18,36,91,0.18)" }}
              >
                {FAKE_USER.avatar}
              </div>
              {/* Name & role */}
              <div className="pb-1">
                <h3 className="text-xl font-bold text-[#12245B] tracking-tight leading-tight">
                  {FAKE_USER.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{FAKE_USER.role}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                  <span className="text-sm text-gray-400 font-mono text-xs">
                    {FAKE_USER.organisation}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12245B]/5 border border-[#12245B]/10 text-[11px] font-semibold text-[#12245B] font-mono tracking-wide">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {FAKE_USER.region}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F000]/10 border border-[#B4F000]/30 text-[11px] font-semibold text-[#5a7a00] font-mono tracking-wide">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                {FAKE_USER.fellowsSupervised}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-semibold text-gray-500 font-mono tracking-wide">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Joined {FAKE_USER.joined}
              </span>
            </div>
          </div>
        </div>

        {/* Stats column */}
        <div className="flex flex-col gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-5 flex flex-col justify-center"
              style={{ borderLeft: "4px solid #B4F000" }}
            >
              <div className="text-2xl font-bold text-[#12245B] tracking-tight leading-none mb-1">
                {s.value}
              </div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest font-mono">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid: Account details + AI Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Account Details — 2 cols */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest font-mono mb-5">
            Account Details
          </div>
          <div className="divide-y divide-gray-50">
            {ACCOUNT_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-3"
              >
                <span className="text-xs text-gray-400 font-mono">{row.label}</span>
                <span className="text-sm font-medium text-[#12245B]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform access card */}
        <div className="flex flex-col gap-4">
          {/* shamiriAI card */}
          <div className="bg-[#12245B] rounded-2xl p-6 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#B4F000]"
                style={{ boxShadow: "0 0 0 3px rgba(180,240,0,0.3)", animation: "pulse-anim 2s infinite" }}
              />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest font-mono">
                shamiriAI
              </span>
            </div>
            <p className="text-white/90 text-sm font-medium leading-relaxed mb-5">
              AI-powered session analysis and risk detection is active for your supervision network.
            </p>
            <div className="space-y-2">
              {["Session Summaries", "Risk Detection", "Quality Scoring"].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-md bg-[#B4F000]/20 flex items-center justify-center shrink-0">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#B4F000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-xs text-white/60">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest font-mono mb-3">
              Access
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your account is provisioned by your organisation. Contact your admin to update credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#12245B] mb-0.5">Sign out of your account</p>
            <p className="text-xs text-gray-400">You will be returned to the login screen.</p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-red-600 transition-all hover:bg-red-50 hover:border-red-200"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
}
