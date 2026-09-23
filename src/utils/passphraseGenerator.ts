import { WORD_LIST } from "@/constants/wordList";
import type { GenerationResult, PassphraseOptions } from "@/types/generator";
import { randomItem, secureRandomInt } from "./secureRandom";

export const MIN_WORDS = 3;
export const MAX_WORDS = 8;

/** Distinct words available for selection. */
export const UNIQUE_WORDS: readonly string[] = [...new Set(WORD_LIST)];

function capitalizeWord(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function generatePassphrase(options: PassphraseOptions): GenerationResult {
  const wordCount = Math.min(Math.max(Math.round(options.wordCount), MIN_WORDS), MAX_WORDS);

  const words: string[] = [];
  for (let i = 0; i < wordCount; i += 1) {
    const word = randomItem(UNIQUE_WORDS);
    words.push(options.capitalize ? capitalizeWord(word) : word);
  }

  if (options.includeNumber) {
    words.push(String(10 + secureRandomInt(90)));
  }

  const separator = options.separator === "" ? "-" : options.separator;
  return { ok: true, value: words.join(separator), poolSize: UNIQUE_WORDS.length };
}

/** Passphrase entropy comes from word choices, not character count. */
export function passphraseEntropy(options: PassphraseOptions): number {
  const wordCount = Math.min(Math.max(Math.round(options.wordCount), MIN_WORDS), MAX_WORDS);
  let bits = wordCount * Math.log2(UNIQUE_WORDS.length);
  if (options.includeNumber) bits += Math.log2(90);
  return bits;
}
