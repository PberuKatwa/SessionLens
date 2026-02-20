"use client";
import { ReviewStatus } from "@/types/globalTypes.types";
import CreateGroupSessionButton from "@/components/ui/groupSessions/CreateGroupSessionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";

export type ProcessedFilter = "all" | "processed" | "unprocessed";
export type SafetyFilter    = "all" | "safe"      | "risk";

interface SessionFiltersProps {
  processedFilter:    ProcessedFilter;
  setProcessedFilter: (v: ProcessedFilter) => void;
  safetyFilter:       SafetyFilter;
  setSafetyFilter:    (v: SafetyFilter) => void;
  reviewStatusFilter:    ReviewStatus | "all";
  setReviewStatusFilter: (v: ReviewStatus | "all") => void;
  onCreated: () => void;
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const isActive = value !== "all";
  const currentLabel = options.find(o => o.value === value)?.label ?? "All";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-semibold border-[1.5px] outline-none cursor-pointer transition-colors"
          style={{
            borderColor:      isActive ? "#12245B" : "#e5e7eb",
            backgroundColor:  isActive ? "#12245B" : "#fff",
            color:            isActive ? "#fff"    : "#6b7280",
          }}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Chevron or clear */}
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-2.5 h-2.5"
            style={{ color: isActive ? "#B4F000" : "#9ca3af" }}
          />
        </div>
      </div>

      {/* Reset pill — only visible when active */}
      {isActive && (
        <button
          type="button"
          onClick={() => onChange("all" as T)}
          className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-red-500 transition-colors w-fit"
        >
          <FontAwesomeIcon icon={faXmark} className="w-2.5 h-2.5" />
          Clear
        </button>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SessionFilters({
  processedFilter,    setProcessedFilter,
  safetyFilter,       setSafetyFilter,
  reviewStatusFilter, setReviewStatusFilter,
  onCreated,
}: SessionFiltersProps) {

  const anyActive =
    processedFilter !== "all" ||
    safetyFilter    !== "all" ||
    reviewStatusFilter !== "all";

  return (
    <div className="flex flex-row flex-wrap items-end gap-5 mb-4">

      <CreateGroupSessionButton onCreated={onCreated} />

      {/* Divider */}
      <div className="w-px self-stretch bg-gray-200" />

      {/* Processed */}
      <FilterDropdown<ProcessedFilter>
        label="Processed"
        value={processedFilter}
        onChange={setProcessedFilter}
        options={[
          { value: "all",         label: "All"         },
          { value: "processed",   label: "Processed"   },
          { value: "unprocessed", label: "Unprocessed" },
        ]}
      />

      {/* Safety */}
      <FilterDropdown<SafetyFilter>
        label="Safety"
        value={safetyFilter}
        onChange={setSafetyFilter}
        options={[
          { value: "all",  label: "All"  },
          { value: "safe", label: "Safe" },
          { value: "risk", label: "Risk" },
        ]}
      />

      {/* Review Status */}
      <FilterDropdown<ReviewStatus | "all">
        label="Review Status"
        value={reviewStatusFilter}
        onChange={setReviewStatusFilter}
        options={[
          { value: "all",        label: "All"        },
          { value: "unreviewed", label: "Unreviewed" },
          { value: "accepted",   label: "Accepted"   },
          { value: "rejected",   label: "Rejected"   },
        ]}
      />

      {/* Reset all */}
      {anyActive && (
        <>
          <div className="w-px self-stretch bg-gray-200" />
          <div className="flex flex-col justify-end pb-0.5">
            <button
              type="button"
              onClick={() => {
                setProcessedFilter("all");
                setSafetyFilter("all");
                setReviewStatusFilter("all");
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
              Reset all filters
            </button>
          </div>
        </>
      )}

    </div>
  );
}
