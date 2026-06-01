export const GLOBAL_PROMPT_LAST_SHOWN_AT_KEY = "@mosaic_prompt_last_shown_at";

// Cooldown between any user ask prompts (review / support) to avoid stacking.
export const GLOBAL_PROMPT_COOLDOWN_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

export function hasGlobalPromptCooldownElapsed(lastShownAt: number | null) {
  if (!lastShownAt || Number.isNaN(lastShownAt)) return true;
  return Date.now() - lastShownAt >= GLOBAL_PROMPT_COOLDOWN_DAYS * DAY_MS;
}
