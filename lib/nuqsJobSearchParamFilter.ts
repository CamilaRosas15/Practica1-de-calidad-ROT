import { EXPERIENCE_LEVEL_VALUES, JOB_CATEGORY_VALUES } from "@/lib/schema/nuqsJobSearchParamSchema";

/**
 * Brand & filter type
 *
 * - unique symbol prevents external code from "forging" the brand (nominal-ish).
 * - The phantom function (x: T) => T makes the generic parameter invariant in T,
 *   so `AllowlistFilter<ExperienceLevel>` is not assignable to `AllowlistFilter<JobCategoryName>`, etc.
 * - The filter input is `readonly string[]` on purpose: it accepts raw URL strings
 *   and narrows them to `T[]` (the allowlist) at runtime.
 */
declare const ALLOWLIST_BRAND: unique symbol;

type AllowlistFilter<T extends string> = ((values: readonly string[]) => T[]) & {
  readonly [ALLOWLIST_BRAND]: (x: T) => T; // invariant brand
};

/**
 * Create a branded allowlist filter.
 *
 * @typeParam `T` - the readonly tuple/array of allowed string literals
 * @returns `AllowlistFilter<T[number]>` where `T[number]` is the union of elements in `T`
 *
 * Notes:
 * - `T[number]` extracts the element union, e.g. `["US","SG"]` as const → `"US" | "SG"`.
 * - The filter returns only values present in `allowed`, typed as `Out[]`.
 * - The `rawValues` input stays `string[]` to accept unvalidated URL params.
 */
function createAllowlistFilter<const T extends readonly string[]>(allowedValues: T): AllowlistFilter<T[number]> {
  type Out = T[number];

  const set: ReadonlySet<Out> = new Set(allowedValues);

  const fn = (rawValues: readonly string[]) => rawValues.filter((v): v is Out => set.has(v as Out));

  return fn as AllowlistFilter<Out>;
}

// validation functions used by both client and server, for experience levels and job categories is static, for countries is dynamic from DB string[]

export const filterValidExperienceLevels = createAllowlistFilter(EXPERIENCE_LEVEL_VALUES);

export const filterValidJobCategories = createAllowlistFilter(JOB_CATEGORY_VALUES);

export const createFilterValidCountries = (allowedCountries: readonly string[]) => createAllowlistFilter(allowedCountries);

/**
 * Filters `values` through the allowlist `filterFn`, falling back to `defaults` when empty or no hits.
 *
 * @param opts.values - Current selections (union-typed for static domains; may be empty).
 * @param opts.filterFn - Branded allowlist filter for the same domain as `values`/`defaults`.
 * @param opts.defaults - Defaults to use when `values` is empty or when all entries are rejected by the filter.
 *
 * @remarks
 * - `values` is typed as readonly T[] to enforce domain agreement with `filterFn` and `defaults`
 *   (when your query arrays are union-typed). Passing T[] to a filter that accepts string[] is allowed.
 * - Early return on empty avoids work and implements "empty => defaults" semantics.
 *
 * @example
 * // Experience levels
 * const uiExperience = getValidOrDefaults({
 *   values: experienceLevelNames,                  // ExperienceLevel[]
 *   filterFn: filterValidExperienceLevels,         // AllowlistFilter<ExperienceLevel>
 *   defaults: settingsPreferences.default_experience_levels, // ExperienceLevel[]
 * });
 */
export function getValidOrDefaults<T extends string>(opts: { values: readonly T[]; filterFn: AllowlistFilter<T>; defaults: T[] }): T[] {
  if (opts.values.length === 0) return opts.defaults;

  const filteredValues = opts.filterFn(opts.values);

  return filteredValues.length > 0 ? filteredValues : opts.defaults;
}
