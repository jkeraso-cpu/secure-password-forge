import type { StrengthRating } from "@/types/generator";

/** entropy ≈ length × log2(pool size) */
export function estimateEntropy(length: number, poolSize: number): number {
  if (length <= 0 || poolSize <= 1) return 0;
  return length * Math.log2(poolSize);
}

/** Rates strength from estimated entropy alone, not from checkbox counting. */
export function rateStrength(entropyBits: number): StrengthRating {
  if (entropyBits < 36) return { label: "Very weak", score: 1 };
  if (entropyBits < 60) return { label: "Weak", score: 2 };
  if (entropyBits < 80) return { label: "Fair", score: 3 };
  if (entropyBits < 110) return { label: "Strong", score: 4 };
  return { label: "Very strong", score: 5 };
}

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function toSuperscript(value: number): string {
  return String(value)
    .split("")
    .map((char) => SUPERSCRIPTS[char] ?? char)
    .join("");
}

/** Human-readable combination count, e.g. "6.3 × 10³⁹". */
export function formatCombinations(entropyBits: number): string {
  if (entropyBits <= 0) return "—";
  const log10 = (entropyBits * Math.log(2)) / Math.log(10);
  const exponent = Math.floor(log10);
  const mantissa = Math.pow(10, log10 - exponent);
  if (exponent < 4) {
    return Math.round(Math.pow(10, log10)).toLocaleString();
  }
  return `${mantissa.toFixed(1)} × 10${toSuperscript(exponent)}`;
}

/**
 * Deliberately coarse, illustrative brute-force framing.
 * Assumes 1e12 offline guesses per second — real speeds vary hugely.
 */
export function illustrativeCrackTime(entropyBits: number): string {
  if (entropyBits <= 0) return "Instant";
  const guessesPerSecond = 1e12;
  const seconds = Math.pow(2, entropyBits - 1) / guessesPerSecond;
  if (seconds < 1) return "Less than a second";
  if (seconds < 60) return "Seconds";
  if (seconds < 3600) return "Minutes";
  if (seconds < 86_400) return "Hours";
  if (seconds < 2_592_000) return "Days";
  if (seconds < 31_536_000) return "Months";
  const years = seconds / 31_536_000;
  if (years < 100) return `About ${Math.round(years)} years`;
  if (years < 1e6) return "Thousands of years";
  if (years < 1e12) return "Many millions of years";
  return "Extremely long";
}

/**
 * Rough pool estimate for a password the user typed in.
 * Human-chosen passwords are usually weaker than this suggests.
 */
export function observedPoolSize(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
  return pool;
}
