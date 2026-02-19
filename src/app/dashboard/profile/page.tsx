"use client";

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



    </div>
  );
}
