// Leetcode Questions Input
export type LeetcodeQuestionInput = Pick<LeetcodeQuestionTable, "question_number" | "difficulty">;

export const LEETCODE_DIFFICULTY = {
  Easy: "Easy",
  Medium: "Medium",
  Hard: "Hard",
} as const satisfies Record<LeetcodeDifficulty, LeetcodeDifficulty>;

const DIFFICULTY_ORDER = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
} as const satisfies Record<LeetcodeDifficulty, number>;

export function utilSortLeetcodeQuestionsDifficulty(questions: LeetcodeQuestionInput[]) {
  return [...questions].sort((a, b) => {
    // First sort by difficulty
    const diffOrder = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];

    // If difficulties are the same, sort by question number
    return diffOrder !== 0 ? diffOrder : a.question_number - b.question_number;
  });
}

// Interview Experience

type InterviewExperienceBase = Pick<InterviewExperienceTable, "id" | "round_no" | "description" | "interview_date" | "response_date" | "created_at"> & {
  interview_tags: InterviewTag[] | null;
  leetcode_questions: LeetcodeQuestionInput[] | null;
};

export type InterviewExperienceCardData = InterviewExperienceBase & JoinedUser;

// Server Actions Return Types, used for server actions that return a success or error
export type ServerActionResult<TData = void, TError = string> = TData extends void
  ? { isSuccess: true } | { isSuccess: false; error: TError }
  : { isSuccess: true; data: TData } | { isSuccess: false; error: TError };

/** Compile-time assertion helper.
 * Usage: type _Check = Expect<SomeCondition extends true ? true : false>;
 * If the condition isn't true, TypeScript surfaces an error.
 */
export type Expect<T extends true> = T;

type MissingOf<U, T extends readonly unknown[]> = Exclude<U, T[number]>;

type ExtraOf<U, T extends readonly unknown[]> = Exclude<T[number], U>;

/** Exact literal equality check.
 * - Returns true when U exactly matches the element union of T.
 * - Otherwise returns a tuple with a label and the specific missing/extra members.
 */
export type ExactLiteralUnion<U, T extends readonly unknown[]> = [MissingOf<U, T>, ExtraOf<U, T>] extends [never, never]
  ? true
  : ["Literal mismatch", { missing: MissingOf<U, T> }, { extra: ExtraOf<U, T> }];
