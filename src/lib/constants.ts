/** Placeholder shown wherever a seller has not uploaded a profile photo. */
export const DEFAULT_AVATAR = "/brand/avatar-default.svg";

/**
 * Tint for the category chip on a book card, keyed by the category label in
 * mockData. Kept here rather than beside `categories` because mockData already
 * imports the Book type from BookCard — importing back would be a cycle.
 * Alpha backgrounds so the chips hold up in dark mode too.
 */
export const CATEGORY_TAG_STYLES: Record<string, string> = {
  "기초 체력": "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  "유튜브": "text-rose-600 dark:text-rose-400 bg-rose-500/10",
  "AI/자동화": "text-violet-600 dark:text-violet-400 bg-violet-500/10",
  "제휴 마케팅": "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  "수익 인증": "text-sky-600 dark:text-sky-400 bg-sky-500/10",
};

/** Used for any category not listed above. */
export const CATEGORY_TAG_FALLBACK = "text-primary bg-primary/10";
