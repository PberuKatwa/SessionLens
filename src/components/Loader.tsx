"use client";

export function ShamiriLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">

      {/* Orbital spinner */}
      <div className="relative w-16 h-16">

        {/* Navy disc */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "#12245B" }}
        />

        {/* Wordmark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[8px] font-extrabold uppercase"
            style={{ color: "#B4F000", letterSpacing: "0.18em" }}
          >
            shmr
          </span>
        </div>

        {/* Spinning lime arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ animation: "spin-cw 1.1s linear infinite" }}
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle cx="32" cy="32" r="29" stroke="#B4F000" strokeWidth="3" strokeDasharray="48 134" strokeLinecap="round" />
        </svg>

        {/* Orbiting dot */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ animation: "spin-cw 1.1s linear infinite" }}
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle cx="32" cy="3" r="3" fill="#B4F000" />
        </svg>

      </div>

      {/* Message */}
      <p className="text-sm font-medium tracking-wide" style={{ color: "#12245B" }}>
        Preparing your workspace…
      </p>

      <style>{`
        @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}



const DOTS = [0, 1, 2, 3, 4];

export function AiEvaluationLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">

      {/* Animated orb cluster */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute w-20 h-20 rounded-full bg-[#12245B] opacity-10 animate-ping" />
        <div className="absolute w-14 h-14 rounded-full bg-[#12245B] opacity-20 animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-[#12245B] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#B4F000] animate-spin [animation-duration:3s]">
            <path d="M12 2C12 2 14.5 9.5 22 12C14.5 14.5 12 22 12 22C12 22 9.5 14.5 2 12C9.5 9.5 12 2 12 2Z" />
          </svg>
        </div>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-end gap-1.5">
        {DOTS.map((i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-[#12245B] animate-bounce"
            style={{
              height: i === 0 || i === 4 ? 8 : i === 1 || i === 3 ? 12 : 16,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-[#12245B] tracking-wide">
          Evaluating session
        </p>
        <p className="text-xs text-gray-400">Reviewing transcript for insights…</p>
      </div>

      {/* Scanning bar — replaces progress bar */}
      <div className="w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full w-12 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #B4F000, transparent)",
            animation: "scan 1.6s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes scan {
          0%   { transform: translateX(-3rem); }
          100% { transform: translateX(12rem); }
        }
      `}</style>
    </div>
  );
}
