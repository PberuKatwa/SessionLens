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
