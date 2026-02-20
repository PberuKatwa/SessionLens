import { ReviewStatus } from "@/types/globalTypes.types";

type StatusBadgeProps = {
  value?: boolean | null;
  trueLabel?: string;
  falseLabel?: string;
  nullLabel?: string;
};

export function BooleanStatusBadge({
  value,
  trueLabel = "Active",
  falseLabel = "Inactive",
  nullLabel = "Unknown",
}: StatusBadgeProps) {

  const baseStyles = "text-xs font-medium px-2 py-0.5 rounded";
  const successStyles = "px-3 py-1.5 rounded-md bg-green-100 text-green-700 text-xs font-semibold";
  const dangerStyles = "bg-red-100 text-red-700";
  const warningStyles = "bg-yellow-100 text-yellow-700";

  let styles = warningStyles;
  let label = nullLabel;

  if (value === true) {
    styles = successStyles;
    label = trueLabel;
  } else if (value === false) {
    styles = dangerStyles;
    label = falseLabel;
  }

  return (
    <span className={`${baseStyles} ${styles}`}>
      {label}
    </span>
  );
}


type ReviewStatusBadgeProps = {
  value?: ReviewStatus | null;
  acceptedLabel?: string;
  rejectedLabel?: string;
  unreviewedLabel?: string;
  nullLabel?: string;
};

export function ReviewStatusBadge({
  value,
  acceptedLabel = "Accepted",
  rejectedLabel = "Rejected",
  unreviewedLabel = "Unreviewed",
  nullLabel = "No Review",
}: ReviewStatusBadgeProps) {

  const baseStyles = "text-xs font-medium px-2 py-0.5 rounded";

  const successStyles = "px-3 py-1.5 rounded-md bg-green-100 text-green-700 text-xs font-semibold";
  const dangerStyles = "bg-red-100 text-red-700";
  const warningStyles = "bg-yellow-100 text-yellow-700";

  let styles = warningStyles;
  let label = nullLabel;

  if (value === "accepted") {
    styles = successStyles;
    label = acceptedLabel;
  } else if (value === "rejected") {
    styles = dangerStyles;
    label = rejectedLabel;
  } else if (value === "unreviewed") {
    styles = warningStyles;
    label = unreviewedLabel;
  }

  return (
    <span className={`${baseStyles} ${styles}`}>
      {label}
    </span>
  );
}

type ScoreBadgeProps = {
  value?: number | null;
};

export function ScoreBadge({ value }: ScoreBadgeProps) {

  const baseStyles = "text-xs font-medium px-2 py-0.5 rounded";

  const successStyles = "px-3 py-1.5 rounded-md bg-green-100 text-green-700 text-xs font-semibold";
  const warningStyles = "bg-yellow-100 text-yellow-700";
  const dangerStyles = "bg-red-100 text-red-700";

  let styles = warningStyles;
  let label = "Unscored";

  if (value === 1) {
    styles = dangerStyles;
    label = "1";
  }

  if (value === 2) {
    styles = warningStyles;
    label = "2";
  }

  if (value === 3) {
    styles = successStyles;
    label = "3";
  }

  return (
    <span className={`${baseStyles} ${styles}`}>
      {label}
    </span>
  );
}
