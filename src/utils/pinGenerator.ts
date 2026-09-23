import { NUMBERS } from "@/constants/characterSets";
import type { GenerationResult, PinOptions } from "@/types/generator";
import { randomCharacter } from "./secureRandom";

export const MIN_PIN_LENGTH = 4;
export const MAX_PIN_LENGTH = 12;

export function generatePin(options: PinOptions): GenerationResult {
  const length = Math.min(Math.max(Math.round(options.length), MIN_PIN_LENGTH), MAX_PIN_LENGTH);

  if (!options.allowRepeats && length > NUMBERS.length) {
    return {
      ok: false,
      error: "A PIN without repeated digits can be at most 10 digits long.",
    };
  }

  const digits: string[] = [];
  const used = new Set<string>();
  while (digits.length < length) {
    const candidates = options.allowRepeats
      ? NUMBERS
      : NUMBERS.split("")
          .filter((digit) => !used.has(digit))
          .join("");
    const digit = randomCharacter(candidates);
    used.add(digit);
    digits.push(digit);
  }

  return { ok: true, value: digits.join(""), poolSize: 10 };
}
