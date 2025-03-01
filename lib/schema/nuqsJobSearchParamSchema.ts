import { parseAsInteger, parseAsString, parseAsBoolean, parseAsArrayOf, parseAsStringLiteral, createLoader } from "nuqs/server";

import { COUNTRY_PARAM_SEPARATOR } from "@/lib/constants/apiRoutes";

export type JobSortOrderKey = "ASC" | "DESC";

export const SORT_ORDER_OPTIONS = {
  ASC: "DESC",
  DESC: "ASC",
} satisfies Record<JobSortOrderKey, JobSortOrderKey>;

export const nuqsJobSearchParamSchema = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
  isVerified: parseAsBoolean.withDefault(false),
  countries: parseAsArrayOf(parseAsString, COUNTRY_PARAM_SEPARATOR).withDefault([]),
  sortOrder: parseAsStringLiteral(Object.values(SORT_ORDER_OPTIONS)).withDefault("DESC"),
  experienceLevelNames: parseAsArrayOf(parseAsString).withDefault([]),
  jobCategoryNames: parseAsArrayOf(parseAsString).withDefault([]),
};

export const nuqsJobSearchParamLoader = createLoader(nuqsJobSearchParamSchema);
