export type Page = "analyzed" | "groups" | "profile";

export interface Session {
  id: string;
  fellow: string;
  date: string;
  groupId: string;
  topic: string;
  status: "Safe" | "Flagged" | "Processed";
  scores: { content: number; facilitation: number; safety: number };
  risk: "SAFE" | "RISK";
}

export interface Group {
  id: string;
  name: string;
  fellow: string;
  location: string;
  sessions: number;
  lastSession: string;
  avgScore: number;
  status: "Active" | "Paused";
}

export interface User {
  name: string;
  role: string;
  avatar: string;
  email: string;
  organisation: string;
  region: string;
  fellowsSupervised: string;
}

export const CURRENT_USER: User = {
  name: "Dr. Naledi Dlamini",
  role: "Senior Supervisor",
  avatar: "ND",
  email: "n.dlamini@shamiri.institute",
  organisation: "Shamiri Institute",
  region: "Nairobi, Kenya",
  fellowsSupervised: "4 active fellows",
};

export const SESSIONS: Session[] = [
  {
    id: "S-001",
    fellow: "Amara Osei",
    date: "Feb 17, 2026",
    groupId: "GRP-04",
    topic: "Growth Mindset",
    status: "Safe",
    scores: { content: 3, facilitation: 3, safety: 3 },
    risk: "SAFE",
  },
  {
    id: "S-002",
    fellow: "Kenji Mwangi",
    date: "Feb 16, 2026",
    groupId: "GRP-07",
    topic: "Gratitude Practice",
    status: "Flagged",
    scores: { content: 2, facilitation: 2, safety: 1 },
    risk: "RISK",
  },
  {
    id: "S-003",
    fellow: "Lucia Ndegwa",
    date: "Feb 15, 2026",
    groupId: "GRP-02",
    topic: "Problem Solving",
    status: "Processed",
    scores: { content: 3, facilitation: 2, safety: 3 },
    risk: "SAFE",
  },
  {
    id: "S-004",
    fellow: "Amara Osei",
    date: "Feb 14, 2026",
    groupId: "GRP-04",
    topic: "Values in Action",
    status: "Safe",
    scores: { content: 3, facilitation: 3, safety: 3 },
    risk: "SAFE",
  },
  {
    id: "S-005",
    fellow: "Temi Adeyemi",
    date: "Feb 13, 2026",
    groupId: "GRP-11",
    topic: "Growth Mindset",
    status: "Processed",
    scores: { content: 2, facilitation: 3, safety: 2 },
    risk: "SAFE",
  },
  {
    id: "S-006",
    fellow: "Kenji Mwangi",
    date: "Feb 12, 2026",
    groupId: "GRP-07",
    topic: "Gratitude Practice",
    status: "Safe",
    scores: { content: 3, facilitation: 3, safety: 3 },
    risk: "SAFE",
  },
];

export const GROUPS: Group[] = [
  {
    id: "GRP-02",
    name: "Westlands Youth Circle",
    fellow: "Lucia Ndegwa",
    location: "Nairobi West",
    sessions: 8,
    lastSession: "Feb 15, 2026",
    avgScore: 2.7,
    status: "Active",
  },
  {
    id: "GRP-04",
    name: "Kibera Resilience Group",
    fellow: "Amara Osei",
    location: "Kibera",
    sessions: 12,
    lastSession: "Feb 17, 2026",
    avgScore: 3.0,
    status: "Active",
  },
  {
    id: "GRP-07",
    name: "Mathare Hope Collective",
    fellow: "Kenji Mwangi",
    location: "Mathare",
    sessions: 6,
    lastSession: "Feb 16, 2026",
    avgScore: 2.1,
    status: "Active",
  },
  {
    id: "GRP-11",
    name: "Eastleigh Rising Stars",
    fellow: "Temi Adeyemi",
    location: "Eastleigh",
    sessions: 4,
    lastSession: "Feb 13, 2026",
    avgScore: 2.4,
    status: "Paused",
  },
];
