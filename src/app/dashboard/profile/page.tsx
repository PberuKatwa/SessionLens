"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/client/auth.service";
import { UserProfile } from "../../../types/user.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ACCOUNT_FIELDS = [
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Email", key: "email" },
  { label: "Role", key: "role" },
  { label: "Member Since", key: "created_at" },
];

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const getProfile = async () => {
    try {
      const response = await authService.profile();
      if (!response.data) throw new Error("Failed to load profile");

      setProfile(response.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 text-gray-500">
        No profile data available.
      </div>
    );
  }

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
            {ACCOUNT_FIELDS.map((field) => {
              let value: any = (profile as any)[field.key];
              if (field.key === "created_at") value = new Date(profile.created_at).toLocaleDateString();

              return (
                <div
                  key={field.label}
                  className="flex justify-between items-center py-3"
                >
                  <span className="text-xs text-gray-400 font-mono">{field.label}</span>
                  <span className="text-sm font-medium text-[#12245B]">{value ?? "—"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform access card */}
        <div className="flex flex-col gap-4">
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
