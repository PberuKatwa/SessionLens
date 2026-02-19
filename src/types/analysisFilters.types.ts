import { ReviewStatus } from "./globalTypes.types";

export type MinimalAnalysisFilters = {
  is_processed: boolean|null;
  is_safe: boolean|null;
  review_status: ReviewStatus|null;
};
