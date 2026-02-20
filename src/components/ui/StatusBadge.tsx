import { ReviewStatus } from "@/types/globalTypes.types";

type RiskStatusBadgeProps = {
  value?: boolean | null;
};

export function RiskStatusBadge({ value }: RiskStatusBadgeProps) {
  // SAFE
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-800 border border-green-200">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        SAFE
      </span>
    );
  }

  // RISK
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-extrabold border-2 border-red-500 bg-red-50 text-red-700 shadow-sm shadow-red-100">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
        </span>
        RISK
      </span>
    );
  }

  // NOT EVALUATED (null or undefined)
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 bg-gray-100 text-gray-600">
      <span className="w-2 h-2 rounded-full bg-gray-400" />
      NOT EVALUATED
    </span>
  );
}

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
