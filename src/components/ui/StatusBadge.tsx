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

  const successStyles = "bg-green-100 text-green-700";
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

  const successStyles = "bg-green-100 text-green-700";
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
