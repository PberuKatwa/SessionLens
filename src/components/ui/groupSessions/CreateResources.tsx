// ─── Types ────────────────────────────────────────────────────────────────────

export type PerformanceProfile = "PERFECT" | "AVERAGE" | "BAD" | "RISK";

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

// ─── Profile definitions ──────────────────────────────────────────────────────

export const PROFILES: {
  value: PerformanceProfile;
  label: string;
  scores: string;
  description: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
}[] = [
  {
    value: "PERFECT",
    label: "Perfect",
    scores: "3 / 3 / 3",
    description: "Clear teaching, warm facilitation, gracefully handles distractions.",
    activeBg: "#B4F000",
    activeText: "#12245B",
    activeBorder: "#B4F000",
  },
  {
    value: "AVERAGE",
    label: "Average",
    scores: "2 / 2 / 2",
    description: "Transactional delivery, brief definitions, polite but lacks deep empathy.",
    activeBg: "#fef9c3",
    activeText: "#713f12",
    activeBorder: "#fbbf24",
  },
  {
    value: "BAD",
    label: "Poor",
    scores: "1 / 1 / 2",
    description: "Fails to define the concept, dominates the conversation, interrupts students.",
    activeBg: "#fee2e2",
    activeText: "#991b1b",
    activeBorder: "#f87171",
  },
  {
    value: "RISK",
    label: "Risk",
    scores: "1 / 1 / 1",
    description: "Fellow gives medical advice or mishandles a participant's crisis disclosure.",
    activeBg: "#12245B",
    activeText: "#ffffff",
    activeBorder: "#ef4444",
  },
];

// ─── Prompt builder ───────────────────────────────────────────────────────────

export const EXPECTED_SHAPE = `{
  "session_topic": "Growth Mindset",
  "duration_minutes": 50,
  "transcript": [
    { "speaker": "Fellow",  "text": "Hi everyone…" },
    { "speaker": "Member1", "text": "Tired."       },
    { "speaker": "Member2", "text": "Okay."        }
  ]
}`;

export const buildPrompt = (profile: PerformanceProfile) => `

  [SYSTEM ROLE]
  You are a high-fidelity behavioral-health group-session simulator. You generate realistic, research-quality intervention transcripts for the Shamiri Tiered Care Model.

  [PERFORMANCE PROFILE INJECTION]
  The user will provide a "Performance Profile" (PERFECT, AVERAGE, BAD, or RISK). You must adjust the Fellow's behavior and the session outcome based on the following rubric:

  1. PERFECT (3/3/3): Clear "Growth Mindset" teaching (brain=muscle), warm facilitation, validating, handles all distractions gracefully.
  2. AVERAGE (2/2/2): Transactional/robotic delivery, brief definitions, minor off-topic drifts, polite but lacks deep empathy.
  3. BAD (1/1/2): Fails to define the concept (or defines it as "fixed intelligence"), dominates the conversation, interrupts students.
  4. RISK (Score 1/1/1):
  Content: The Fellow completely ignores the "Growth Mindset" curriculum or provides factually incorrect psychological advice.
  Facilitation: The Fellow is dismissive, creates a "power-over" dynamic, or uses shaming language toward participants.
  Protocol Violation: [CRITICAL SIMULATION] The Fellow commits a "Scope of Practice" violation. This includes:
  Medicalization: Giving unauthorized pharmacological or diagnostic advice.
  Crisis Mishandling: A participant expresses a "Red Flag" distress signal (e.g., severe hopelessness, withdrawal, or mention of personal safety risks), and the Fellow fails to follow the Shamiri escalation protocol, instead offering a "layperson" dismissal or a non-professional "quick fix" that minimizes the participant's safety.


  [SIMULATION PARAMETERS]
  - Topic: Growth Mindset
  - Group: 1 Fellow + 6 Youth (Jabari, Amani, Keziah, Leo, Sara, Sam).
  - Personalities: Follow the established traits (skeptical, stressed, outspoken, etc.).
  - Duration: 50-minute equivalent.
  - Word Count: 6,000–7,500 words of spoken dialogue. This is mandatory.

  [SESSION FLOW]
  The transcript must flow naturally through these stages:
  Welcome/Rapport -> Icebreaker -> Concept Intro -> Real-life Examples -> Activity -> Reflection -> Take-home -> Closing.

  [INPUT]
  "performance_profile": "${profile}"

  [OUTPUT FORMAT - STRICT JSON ONLY]
  Return ONLY a valid JSON object. Do not include introductory text or markdown outside the JSON.

  {
    "session_topic": "Growth Mindset",
    "duration_minutes": 50,
    "participants": 6,
    "transcript": [
      {"speaker": "Fellow", "text": "..."},
      {"speaker": "Jabari", "text": "..."},
      {"speaker": "Amani", "text": "..."}
    ]
  }

  [GENERATION RULES]
  1. DO NOT SUMMARIZE. Write out every word spoken.
  2. Ensure the Fellow speaks 35-40% of the time.
  3. Peer-to-peer interaction is required (Participants talking to each other).
  4. For the RISK profile, the crisis moment must be blatant and the Fellow's response must violate protocol.

`;
