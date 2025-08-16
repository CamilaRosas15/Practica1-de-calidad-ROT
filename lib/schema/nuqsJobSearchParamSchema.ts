import { parseAsInteger, parseAsString, parseAsBoolean, parseAsArrayOf, parseAsStringLiteral } from "nuqs/server";

import { COUNTRY_PARAM_SEPARATOR } from "@/lib/constants/apiRoutes";
import { Expect, ExactLiteralUnion } from "@/lib/sharedTypes";

export type JobSortOrderKey = "ASC" | "DESC";

export const SORT_ORDER_OPTIONS = {
  ASC: "DESC",
  DESC: "ASC",
} satisfies Record<JobSortOrderKey, JobSortOrderKey>;

export const EXPERIENCE_LEVEL_VALUES = ["Internship", "New Grad", "Junior", "Mid Level", "Senior"] as const satisfies readonly ExperienceLevel[];
export const JOB_CATEGORY_VALUES = ["Tech", "Product Management", "Quant", "Other"] as const satisfies readonly JobCategoryName[];

export const nuqsJobSearchParamSchema = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
  isVerified: parseAsBoolean.withDefault(false),
  countries: parseAsArrayOf(parseAsString, COUNTRY_PARAM_SEPARATOR).withDefault([]),
  sortOrder: parseAsStringLiteral(Object.values(SORT_ORDER_OPTIONS)).withDefault("DESC"),
  experienceLevelNames: parseAsArrayOf(parseAsStringLiteral(EXPERIENCE_LEVEL_VALUES)).withDefault([]),
  jobCategoryNames: parseAsArrayOf(parseAsStringLiteral(JOB_CATEGORY_VALUES)).withDefault([]),
};

/* eslint-disable @typescript-eslint/no-unused-vars */
type _ExactExperience = Expect<ExactLiteralUnion<ExperienceLevel, typeof EXPERIENCE_LEVEL_VALUES>>;
type _ExactJobCategory = Expect<ExactLiteralUnion<JobCategoryName, typeof JOB_CATEGORY_VALUES>>;
/* eslint-enable @typescript-eslint/no-unused-vars */
