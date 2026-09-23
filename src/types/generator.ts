export type GeneratorMode = "balanced" | "maximum" | "passphrase" | "pin";

export type CharacterCategory = "uppercase" | "lowercase" | "numbers" | "symbols";

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  guaranteeTypes: boolean;
  excludeAmbiguous: boolean;
  excludeConfusingSymbols: boolean;
  customExclusions: string;
  noRepeats: boolean;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
}

export interface PinOptions {
  length: number;
  allowRepeats: boolean;
}

export type GenerationResult =
  | { ok: true; value: string; poolSize: number }
  | { ok: false; error: string };

export interface StrengthRating {
  label: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";
  score: 1 | 2 | 3 | 4 | 5;
}
