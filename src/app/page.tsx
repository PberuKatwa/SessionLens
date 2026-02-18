import Link from "next/link";

export default function SupervisorLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2540] via-[#0d3d5f] to-[#0a4d3a] font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00c97a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1a8fe3]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full border border-white/5" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 md:px-16">
        <div className="text-white font-bold text-2xl tracking-tight">
          SHAMIRI<span className="text-[#00c97a]">.</span>
        </div>
        <Link
          href="/login"
          className="px-6 py-2 rounded-full border border-[#00c97a] text-[#00c97a] font-medium hover:bg-[#00c97a] hover:text-white transition-all"
        >
          Supervisor Login
        </Link>
      </nav>

      <main className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-4 md:px-16 lg:px-24 text-center m-10">
        {/* Tier 2 Status Pill */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 text-sm text-white/90">
          <span className="bg-[#1a8fe3] text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Tier 2</span>
          <div className="h-4 w-px bg-white/30" />
          <span className="font-semibold text-[#00c97a]">Supervisor Oversight Portal</span>
          <div className="h-4 w-px bg-white/30" />
          <span>Monitoring Tier 1 Fellows</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white max-w-4xl leading-[1.1] tracking-tight mb-6">
          Empowering Fellows through{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c97a] to-[#1a8fe3]">
            Data-Driven Oversight
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          Review 1-hour therapy sessions, access AI-generated session analyses, and provide critical support to our Tier 1 Fellows as they deliver evidence-based care across East Africa.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00c97a] to-[#00a862] text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[#00c97a]/20 w-full sm:w-auto text-center"
          >
            Enter Admin Dashboard
          </Link>

          <Link
            href="/guidelines"
            className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur text-white font-semibold text-base hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
          >
            Protocol & Guidelines
          </Link>
        </div>

        {/* Tier Context Cards (Optional visual aid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
            <h3 className="text-[#00c97a] font-bold mb-2">Fellows (Tier 1)</h3>
            <p className="text-white/50 text-sm">Community-led group interventions and core-belief skill building.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 border border-[#00c97a]/30 text-left scale-105 shadow-xl shadow-[#00c97a]/5">
            <h3 className="text-white font-bold mb-2">Supervisors (Tier 2)</h3>
            <p className="text-white/70 text-sm">Oversight, 1-on-1 support, and AI session analysis review.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
            <h3 className="text-[#1a8fe3] font-bold mb-2">Experts (Tier 3)</h3>
            <p className="text-white/50 text-sm">Specialized psychiatric care and complex case management.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
