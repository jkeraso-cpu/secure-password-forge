export const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/|~`'\"<>\\";

/** Characters that are easily confused with one another in most fonts. */
export const AMBIGUOUS_CHARACTERS = "0OoIl1B8S5Z2";

/** Symbols that are awkward in shells, CSVs or handwriting. */
export const CONFUSING_SYMBOLS = "|`'\"\\~<>";

export const CATEGORY_SETS = {
  uppercase: UPPERCASE,
  lowercase: LOWERCASE,
  numbers: NUMBERS,
  symbols: SYMBOLS,
} as const;

export const CATEGORY_LABELS = {
  uppercase: { label: "Uppercase letters", example: "A-Z" },
  lowercase: { label: "Lowercase letters", example: "a-z" },
  numbers: { label: "Numbers", example: "0-9" },
  symbols: { label: "Symbols", example: "!@#$" },
} as const;
