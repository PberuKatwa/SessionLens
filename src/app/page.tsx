import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2540] via-[#0d3d5f] to-[#0a4d3a] font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00c97a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1a8fe3]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full border border-white/5" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 md:px-16 lg:px-24 text-center">

        {/* Stats pill */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 text-sm text-white/90">
          <div className="flex items-center -space-x-2">
            <img
              className="size-7 rounded-full border-2 border-white/40 object-cover"
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=50"
              alt="Youth provider 1"
            />
            <img
              className="size-7 rounded-full border-2 border-white/40 object-cover"
              src="https://images.unsplash.com/photo-1507152832244-10d45c7eda57?q=80&w=50"
              alt="Youth provider 2"
            />
            <img
              className="size-7 rounded-full border-2 border-white/40 object-cover"
              src="https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?q=80&w=50"
              alt="Youth provider 3"
            />
          </div>
          <span className="font-semibold">185,000+</span>
          <div className="h-4 w-px bg-white/30" />
          <span>Youth served across East Africa</span>
          <div className="h-4 w-px bg-white/30" />
          <span className="bg-[#00c97a] text-white text-xs font-bold px-2 py-0.5 rounded-full">$7–10/youth</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white max-w-3xl leading-[1.1] tracking-tight mb-6">
          Mental health care where{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c97a] to-[#1a8fe3]">
            young people thrive
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
          Africa&apos;s largest youth mental health provider — delivering effective, affordable care at scale through community-based, for-youth-by-youth support.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="https://shamiri.io"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00c97a] to-[#00a862] text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[#00c97a]/20 w-full sm:w-auto text-center"
          >
            Learn More
          </a>
          <a
            href="https://shamiri.io/get-support"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur text-white font-semibold text-base hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
          >
            Get Support
          </a>
        </div>

      </main>
    </div>
  );
}
