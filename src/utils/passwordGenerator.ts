import { AMBIGUOUS_CHARACTERS, CATEGORY_SETS, CONFUSING_SYMBOLS } from "@/constants/characterSets";
import type { CharacterCategory, GenerationResult, PasswordOptions } from "@/types/generator";
import { randomCharacter, shuffleSecurely } from "./secureRandom";

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 128;

function uniqueChars(value: string): string {
  return [...new Set(value.split(""))].join("");
}

export function activeCategories(options: PasswordOptions): CharacterCategory[] {
  const categories: CharacterCategory[] = [];
  if (options.uppercase) categories.push("uppercase");
  if (options.lowercase) categories.push("lowercase");
  if (options.numbers) categories.push("numbers");
  if (options.symbols) categories.push("symbols");
  return categories;
}

/** Applies exclusions to one category's characters. */
export function categoryPool(category: CharacterCategory, options: PasswordOptions): string {
  const excluded = new Set<string>();
  if (options.excludeAmbiguous) {
    for (const char of AMBIGUOUS_CHARACTERS) excluded.add(char);
  }
  if (options.excludeConfusingSymbols) {
    for (const char of CONFUSING_SYMBOLS) excluded.add(char);
  }
  for (const char of options.customExclusions) {
    if (char.trim() !== "" || char === " ") excluded.add(char);
  }
  return uniqueChars(CATEGORY_SETS[category])
    .split("")
    .filter((char) => !excluded.has(char))
    .join("");
}

export function buildPool(options: PasswordOptions): { pool: string; pools: string[] } {
  const pools = activeCategories(options)
    .map((category) => categoryPool(category, options))
    .filter((pool) => pool.length > 0);
  return { pool: uniqueChars(pools.join("")), pools };
}

export function calculatePoolSize(options: PasswordOptions): number {
  return buildPool(options).pool.length;
}

export function generatePassword(options: PasswordOptions): GenerationResult {
  const categories = activeCategories(options);
  if (categories.length === 0) {
    return { ok: false, error: "Choose at least one character type." };
  }

  const length = Math.min(Math.max(Math.round(options.length), MIN_LENGTH), MAX_LENGTH);
  const { pool, pools } = buildPool(options);

  if (pool.length === 0) {
    return { ok: false, error: "Your exclusions removed every available character." };
  }

  const guarantee = options.guaranteeTypes && pools.length > 1;
  if (guarantee && length < pools.length) {
    return {
      ok: false,
      error: `Length must be at least ${pools.length} to include each selected type.`,
    };
  }

  if (options.noRepeats && length > pool.length) {
    return {
      ok: false,
      error: `No-repeat mode supports a maximum of ${pool.length} characters with the current settings.`,
    };
  }

  const chosen: string[] = [];
  const used = new Set<string>();

  const pick = (fromPool: string): string | null => {
    let candidates = fromPool;
    if (options.noRepeats) {
      candidates = fromPool
        .split("")
        .filter((char) => !used.has(char))
        .join("");
    }
    if (candidates.length === 0) return null;
    const char = randomCharacter(candidates);
    used.add(char);
    return char;
  };

  if (guarantee) {
    for (const categoryChars of pools) {
      const char = pick(categoryChars);
      if (char === null) {
        return {
          ok: false,
          error: "No-repeat mode cannot guarantee every selected type with these settings.",
        };
      }
      chosen.push(char);
    }
  }

  while (chosen.length < length) {
    const char = pick(pool);
    if (char === null) {
      return {
        ok: false,
        error: `No-repeat mode supports a maximum of ${pool.length} characters with the current settings.`,
      };
    }
    chosen.push(char);
  }

  return { ok: true, value: shuffleSecurely(chosen).join(""), poolSize: pool.length };
}
