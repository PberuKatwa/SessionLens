export type Speaker = "Fellow" | string;

export interface RawTurn {
  speaker: Speaker;
  text: string;
}

export interface GroupSessionTranscript {
  session_topic: string;
  duration_minutes: number;
  transcript: RawTurn[];
}
