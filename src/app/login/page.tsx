"use client";
import Image from "next/image";


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center font-sans">

      <div className="max-w-screen-xl w-full m-0 sm:m-10 bg-white border border-gray-200 sm:rounded-shamiri flex flex-1 shadow-sm">

        {/* LEFT PANEL */}
        <div className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12 flex flex-col justify-center">

          {/* Logo */}
          <Image
            src="/images/shamiri.png"
            alt="Shamiri"
            width={100}
            height={100}
            className="mb-10"
          />

          {/* Heading */}
          <h1 className="text-2xl font-bold text-shamiri-navy">
            Supervisor Intelligence Dashboard
          </h1>

          {/* Platform Context Preamble */}
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            This platform supports Shamiri Supervisors in monitoring session quality,
            safety, and fidelity across youth-delivered mental health interventions.
            AI-powered insights strengthen human oversight to ensure care remains
            effective, safe, and aligned with the Shamiri model.
          </p>

          {/* Divider */}
          <div className="my-10 border-b border-gray-200" />

          {/* Login Form */}
          <div className="space-y-4">

            <input
              type="email"
              placeholder="Organisational Email"
              className="w-full px-5 py-3 rounded-shamiri bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-shamiri-navy focus:bg-white transition"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3 rounded-shamiri bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-shamiri-navy focus:bg-white transition"
            />

            <button
              className="w-full py-3 rounded-shamiri bg-shamiri-navy text-white font-semibold hover:bg-opacity-90 transition-all shadow-md"
            >
              Sign In
            </button>

          </div>

          {/* Access Note */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            Access is provisioned by your organisation.
          </p>

        </div>

        {/* RIGHT PANEL (Image Placeholder) */}
        <div className="flex-1 hidden lg:flex bg-gray-100 items-center justify-center">

          <div
            className="w-full h-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/login-visual.png')"
            }}
          />

        </div>

      </div>

    </div>
  );
}
