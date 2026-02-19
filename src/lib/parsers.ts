import { ReviewStatus } from "@/types/globalTypes.types";

export function parseBoolean(value: string | null): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

export function parseReviewStatus(value: string | null): ReviewStatus | null {
  if (value === "accepted") return "accepted";
  if (value === "rejected") return "rejected";
  if (value === "unreviewed") return "unreviewed";
  return null;
}
