"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUpload, faCircleNotch, faChevronDown, faChevronUp, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { analyzedService } from "../../../services/client/analyzed.service";
import { CreateGroupSessionPayload } from "@/types/groupSession.types";
import { PerformanceProfile,Props, PROFILES, EXPECTED_SHAPE, buildPrompt } from "./CreateResources";
import { BaseFellow, Fellow } from "@/types/fellows.types";

const initialState: CreateGroupSessionPayload = {
  fellow_id: 0,
  group_id: 0,
  transcriptFile: null,
  transcript: {},
  user_id:0
};

const initialFellow: Fellow = {
  id: 0,
  email: "",
  first_name: "",
  last_name:"",
}

export default function CreateGroupSessionModal({ isOpen, onClose, onCreated }: Props) {
  const [data, setData] = useState(initialState);
  const [fellows, setFellows] = useState<Fellow[]>([initialFellow]);
  const [loading, setLoading] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PerformanceProfile>("PERFECT");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFellows();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (file.type !== "application/json") {
      toast.error("Only JSON files allowed");
      return;
    }
    setData(prev => ({ ...prev, transcriptFile: file }));
  };

  const fetchFellows = async function () {
    try {

      const response = await analyzedService.getAllFellows();

      if (!response.data) throw new Error(`No fellows were registered`);

      setFellows(response.data.fellows)
      toast.success(response.message)

    } catch (error) {
      console.error("error in fetching fellows", error);
      toast.error(`Unable to fetch fellows`)
    } finally {
      setLoading(false)
    }
  }

  const createSession = async function () {
    try {

      setLoading(true);
      const groupSession = await analyzedService.createGroupSession({
        fellow_id: data.fellow_id,
        group_id: Number(data.group_id),
        transcriptFile: data.transcriptFile,
        user_id: 0,
        transcript:{}
      });

      toast.success(groupSession.message);
      onCreated?.();
      onClose();

      setData(initialState);
    } catch (err: any) {
      toast.error("Invalid json transcript format");
    } finally {
      setLoading(false);
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSession();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPrompt(selectedProfile));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeProfile = PROFILES.find(p => p.value === selectedProfile)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ border: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0"
          style={{ borderLeft: "4px solid #B4F000" }}
        >
          <div>
            <h3 className="text-base font-extrabold" style={{ color: "#12245B" }}>
              Create Group Session
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Upload a session transcript for AI evaluation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

            {/* Fellow */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#12245B" }}
              >
                Fellow
              </label>

              <select
                name="fellow_id"
                value={data.fellow_id || ""}
                onChange={(e) =>
                  setData(prev => ({
                    ...prev,
                    fellow_id: Number(e.target.value)
                  }))
                }
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none transition-all"
                style={{ color: "#12245B" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#12245B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                <option value="">Select Fellow</option>

                {fellows.map((fellow) => (
                  <option key={fellow.id} value={fellow.id}>
                    {fellow.first_name} {fellow.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Group ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                Group ID
              </label>
              <input
                name="group_id"
                type="number"
                value={data.group_id || ""}
                onChange={handleChange}
                placeholder="e.g. 114"
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none transition-all"
                style={{ color: "#12245B" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#12245B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Transcript Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                Session Transcript
              </label>

              {/* Expected shape hint */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                  Expected JSON shape
                </p>
                <pre
                  className="text-[11px] leading-relaxed overflow-x-auto"
                  style={{ color: "#12245B", fontFamily: "'Fira Code', 'Courier New', monospace" }}
                >
                  {EXPECTED_SHAPE}
                </pre>
              </div>

              {/* Generate with AI — collapsible */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPromptOpen(p => !p)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ backgroundColor: "#B4F000" }}>
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="#12245B">
                        <path d="M12 2C12 2 14.5 9.5 22 12C14.5 14.5 12 22 12 22C12 22 9.5 14.5 2 12C9.5 9.5 12 2 12 2Z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "#12245B" }}>
                      Don't have a transcript? Generate one with AI
                    </span>
                  </div>
                  <FontAwesomeIcon icon={promptOpen ? faChevronUp : faChevronDown} className="w-3 h-3 text-gray-400" />
                </button>

                {promptOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 flex flex-col gap-4">

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Select a performance profile, copy the prompt, then paste it into any AI model (ChatGPT, Claude, Gemini). Save the output as a{" "}
                      <code className="bg-gray-200 px-1 rounded text-[11px]">.json</code> file and upload it below.
                    </p>

                    {/* Profile selector */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Performance Profile
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {PROFILES.map(profile => {
                          const isSelected = selectedProfile === profile.value;
                          const isRisk = profile.value === "RISK";
                          return (
                            <button
                              key={profile.value}
                              type="button"
                              onClick={() => setSelectedProfile(profile.value)}
                              className="flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all"
                              style={{
                                borderColor: isSelected ? profile.activeBorder : "#e5e7eb",
                                backgroundColor: isSelected ? profile.activeBg : "#fff",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-xs font-extrabold"
                                  style={{ color: isSelected ? profile.activeText : "#12245B" }}
                                >
                                  {profile.label}
                                </span>
                                <span
                                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: isSelected ? "rgba(0,0,0,0.1)" : "#F3F4F6",
                                    color: isSelected ? profile.activeText : "#6b7280",
                                  }}
                                >
                                  {profile.scores}
                                </span>
                              </div>
                              <p
                                className="text-[10px] leading-snug"
                                style={{
                                  color: isSelected
                                    ? isRisk ? "rgba(255,255,255,0.65)" : "rgba(18,36,91,0.6)"
                                    : "#9ca3af",
                                }}
                              >
                                {profile.description}
                              </p>
                              {isRisk && isSelected && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                  </span>
                                  <span className="text-[10px] font-bold text-red-400">Crisis scenario</span>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Prompt preview */}
                    <div className="relative">
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#12245B" }}>
                        Prompt — {activeProfile.label} profile
                      </p>
                      <textarea
                        readOnly
                        value={buildPrompt(selectedProfile)}
                        rows={6}
                        className="w-full text-[11px] leading-relaxed bg-white border border-gray-200 rounded-lg px-3 py-2.5 resize-none outline-none"
                        style={{ color: "#374151", fontFamily: "'Courier New', monospace" }}
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute top-7 right-2 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
                        style={{
                          backgroundColor: copied ? "#B4F000" : "#12245B",
                          color: copied ? "#12245B" : "#fff",
                        }}
                      >
                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-3 h-3" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* File drop zone */}
              <label
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors mt-1"
                style={{
                  borderColor: data.transcriptFile ? "#B4F000" : "#d1d5db",
                  backgroundColor: data.transcriptFile ? "rgba(180,240,0,0.06)" : "#fafafa",
                }}
                onMouseEnter={(e) => { if (!data.transcriptFile) (e.currentTarget as HTMLElement).style.borderColor = "#12245B"; }}
                onMouseLeave={(e) => { if (!data.transcriptFile) (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db"; }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: data.transcriptFile ? "#B4F000" : "#F3F4F6" }}
                >
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="w-3.5 h-3.5"
                    style={{ color: data.transcriptFile ? "#12245B" : "#9ca3af" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: data.transcriptFile ? "#12245B" : "#6b7280" }}
                  >
                    {data.transcriptFile?.name || "Upload JSON Transcript"}
                  </span>
                  {!data.transcriptFile && (
                    <span className="text-[11px] text-gray-400">Click to browse · .json files only</span>
                  )}
                </div>
                <input type="file" accept="application/json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:brightness-105 disabled:opacity-60"
              style={{ backgroundColor: "#12245B", color: "#fff" }}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} spin className="w-4 h-4" />
                  Creating…
                </>
              ) : (
                "Create Session"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
