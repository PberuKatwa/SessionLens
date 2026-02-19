type StatusBadgeProps = {
  value?: boolean | null;
  trueLabel?: string;
  falseLabel?: string;
};

export function StatusBadge({
  value,
  trueLabel = "Active",
  falseLabel = "Inactive",
}: StatusBadgeProps) {

  const isSuccess = value === true;
  const baseStyles = "text-xs font-medium px-1.5 py-0.5 rounded";
  const successStyles = "bg-success-soft text-fg-success-strong";
  const dangerStyles = "bg-danger-soft text-fg-danger-strong";

  return (
    <span
      className={`${baseStyles} ${
        isSuccess ? successStyles : dangerStyles
      }`}
    >
      {isSuccess ? trueLabel : falseLabel}
    </span>
  );
}
