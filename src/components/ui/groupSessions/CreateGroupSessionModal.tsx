"use client";

import { useState } from "react";
import { analyzedService, CreateGroupSessionPayload } from "../../../services/client/analyzed.service";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUpload, faCircleNotch, faChevronDown, faChevronUp, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

const initialState: CreateGroupSessionPayload = {
  fellowName: "",
  groupId: 0,
  transcriptFile: null,
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const EXPECTED_SHAPE = `{
  "session_topic": "Growth Mindset",
  "duration_minutes": 50,
  "transcript": [
    { "speaker": "Fellow",  "text": "Hi everyone…" },
    { "speaker": "Member1", "text": "Tired."       },
    { "speaker": "Member2", "text": "Okay."        }
  ]
}`;

const LLM_PROMPT = `SYSTEM ROLE
You are a high-fidelity behavioral-health group-session simulator trained to generate realistic intervention transcripts suitable for research, training, and program evaluation datasets. Your outputs must replicate natural human conversational pacing, turn-taking variability, and interaction depth consistent with a real 40–60 minute youth group session.

PROGRAM CONTEXT

The simulated session follows the Shamiri Tiered Care Model:

Tier 1 – Shamiri Fellows
Lay providers (ages 18–24) deliver structured group interventions teaching practical skills:

Growth mindset

Gratitude

Problem-solving

Values-based decision making

Tier 2 – Supervisors
Semi-professionals provide oversight and individual follow-up if needed.

Tier 3 – Experts
Psychologists/psychiatrists manage complex cases.

Program characteristics:

Strengths-based (not pathology-focused)

Non-stigmatizing orientation

Evidence-supported outcomes for depression/anxiety

Delivered in four one-hour sessions

Groups contain 6–12 youth participants

Conducted in schools or community settings

SESSION TO SIMULATE

Session Topic: Growth Mindset
Group size: 1 Fellow + 6 youth participants

Participants must display different behavioral styles:

shy participant

outspoken participant

skeptical participant

highly motivated participant

participant struggling academically

participant focused on long-term goals

REALISM AND PACING REQUIREMENTS

Simulate a 50-minute session using natural conversation density.

Human speech averages ~130 spoken words per minute across multi-speaker group sessions.
Therefore:

Target transcript length: 6,000–7,500 spoken words

Speaking turns must vary in length (1 sentence to multi-paragraph)

Include interruptions, short acknowledgments, clarifying questions, humor, and occasional off-topic comments that are gently redirected by the Fellow

The Fellow should guide but speak no more than 35–40% of total dialogue

Each participant must speak at least 8–15 times throughout the session

REQUIRED SESSION FLOW

Welcome and rapport-building (5 min)

Icebreaker discussion (5 min)

Concept introduction: Growth Mindset (10 min)

Real-life examples discussion (10 min)

Guided activity/exercise (10 min)

Reflection discussion (5 min)

Take-home assignment explanation (3–5 min)

Closing encouragement (2–3 min)

Transitions between sections must occur naturally through conversation rather than labeled headings.

FACILITATION STYLE RULES

Fellow uses collaborative, youth-friendly language

Avoid clinical or diagnostic language

Emphasize strengths, effort, and practical application

Encourage peer-to-peer discussion rather than lecture style

Include moments where participants misunderstand and the Fellow clarifies

Include at least one moment where participants respond to each other directly

OUTPUT FORMAT (STRICT)

Return ONLY valid JSON using the schema:

{
  "session_topic": "Growth Mindset",
  "duration_minutes": 50,
  "participants": 6,
  "transcript": [
    {"speaker": "Fellow", "text": "..."},
    {"speaker": "Member1", "text": "..."},
    {"speaker": "Member2", "text": "..."}
  ]
}

Rules:

Do not summarize sections

Produce the full conversation transcript

Maintain conversational continuity

No commentary outside JSON

Ensure transcript length reflects a realistic 40–60 minute session

GENERATION OBJECTIVE

Create a highly realistic, research-quality simulated youth group intervention transcript reflecting authentic conversational dynamics, evidence-aligned facilitation, and practical skill teaching consistent with Shamiri Tier-1 delivery.`;

export default function CreateGroupSessionModal({ isOpen, onClose, onCreated }: Props) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const groupSession = await analyzedService.createGroupSession({
        fellowName: data.fellowName,
        groupId: Number(data.groupId),
        transcriptFile: data.transcriptFile,
      });
      toast.success(groupSession.message);
      onCreated?.();
      onClose();
      setData(initialState);
    } catch (err: any) {
      toast.error(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(LLM_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

            {/* Fellow Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                Fellow Name
              </label>
              <input
                name="fellowName"
                value={data.fellowName}
                onChange={handleChange}
                placeholder="e.g. Amara Wanjiku"
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none transition-all"
                style={{ color: "#12245B" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#12245B")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Group ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                Group ID
              </label>
              <input
                name="groupId"
                type="number"
                value={data.groupId || ""}
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

              {/* File drop zone */}
              <label
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
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

              {/* Generate with AI prompt — hideable */}
              <div className="rounded-xl border border-gray-200 overflow-hidden mt-1">
                <button
                  type="button"
                  onClick={() => setPromptOpen((p) => !p)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: "#B4F000" }}
                    >
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="#12245B">
                        <path d="M12 2C12 2 14.5 9.5 22 12C14.5 14.5 12 22 12 22C12 22 9.5 14.5 2 12C9.5 9.5 12 2 12 2Z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "#12245B" }}>
                      Don't have a transcript? Generate one with AI
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={promptOpen ? faChevronUp : faChevronDown}
                    className="w-3 h-3 text-gray-400"
                  />
                </button>

                {promptOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 flex flex-col gap-3">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Copy the prompt below and paste it into any capable AI model (e.g. ChatGPT, Claude, Gemini). It will generate a realistic, correctly-formatted session transcript you can save as a <code className="bg-gray-200 px-1 rounded text-[11px]">.json</code> file and upload here.
                    </p>
                    <div className="relative">
                      <textarea
                        readOnly
                        value={LLM_PROMPT}
                        rows={6}
                        className="w-full text-[11px] leading-relaxed bg-white border border-gray-200 rounded-lg px-3 py-2.5 resize-none outline-none"
                        style={{ color: "#374151", fontFamily: "'Courier New', monospace" }}
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute top-2 right-2 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
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
