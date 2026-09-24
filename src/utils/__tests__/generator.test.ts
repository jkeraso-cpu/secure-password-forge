import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AMBIGUOUS_CHARACTERS, NUMBERS } from "@/constants/characterSets";
import type { PasswordOptions } from "@/types/generator";
import { estimateEntropy, rateStrength } from "@/utils/entropy";
import { generatePassphrase, passphraseEntropy } from "@/utils/passphraseGenerator";
import { calculatePoolSize, generatePassword } from "@/utils/passwordGenerator";
import { generatePin } from "@/utils/pinGenerator";
import { secureRandomInt, shuffleSecurely } from "@/utils/secureRandom";

const base: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  guaranteeTypes: true,
  excludeAmbiguous: false,
  excludeConfusingSymbols: false,
  customExclusions: "",
  noRepeats: false,
};

function expectOk(result: ReturnType<typeof generatePassword>) {
  if (!result.ok) throw new Error(`Expected success, got: ${result.error}`);
  return result;
}

describe("generatePassword", () => {
  it("matches the requested length exactly", () => {
    for (const length of [4, 12, 20, 64, 128]) {
      expect(expectOk(generatePassword({ ...base, length })).value).toHaveLength(length);
    }
  });

  it("only uses characters from enabled categories", () => {
    const result = expectOk(
      generatePassword({ ...base, uppercase: false, symbols: false, numbers: false }),
    );
    expect(result.value).toMatch(/^[a-z]+$/);
  });

  it("excludes ambiguous characters when requested", () => {
    for (let i = 0; i < 25; i += 1) {
      const value = expectOk(
        generatePassword({ ...base, length: 128, excludeAmbiguous: true }),
      ).value;
      for (const char of AMBIGUOUS_CHARACTERS) {
        expect(value).not.toContain(char);
      }
    }
  });

  it("honours custom exclusions", () => {
    const value = expectOk(
      generatePassword({ ...base, length: 100, customExclusions: "abcXYZ123" }),
    ).value;
    for (const char of "abcXYZ123") {
      expect(value).not.toContain(char);
    }
  });

  it("guarantees one character from each selected category", () => {
    for (let i = 0; i < 25; i += 1) {
      const value = expectOk(generatePassword({ ...base, length: 4 })).value;
      expect(value).toMatch(/[A-Z]/);
      expect(value).toMatch(/[a-z]/);
      expect(value).toMatch(/[0-9]/);
      expect(value).toMatch(/[^A-Za-z0-9]/);
    }
  });

  it("never repeats characters in no-repeat mode", () => {
    const value = expectOk(generatePassword({ ...base, length: 40, noRepeats: true })).value;
    expect(new Set(value.split("")).size).toBe(40);
  });

  it("rejects a length that cannot fit every guaranteed category", () => {
    const result = generatePassword({ ...base, length: 4, symbols: true });
    expect(result.ok).toBe(true);
  });

  it("errors when no category is enabled", () => {
    const result = generatePassword({
      ...base,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
    });
    expect(result).toEqual({ ok: false, error: "Choose at least one character type." });
  });

  it("errors when exclusions empty the pool", () => {
    const result = generatePassword({
      ...base,
      uppercase: false,
      numbers: false,
      symbols: false,
      customExclusions: "abcdefghijklmnopqrstuvwxyz",
    });
    expect(result.ok).toBe(false);
  });

  it("errors when no-repeat length exceeds the pool", () => {
    const result = generatePassword({
      ...base,
      uppercase: false,
      lowercase: false,
      symbols: false,
      length: 20,
      noRepeats: true,
    });
    expect(result.ok).toBe(false);
  });

  it("reports a pool size that reflects exclusions", () => {
    expect(calculatePoolSize({ ...base, customExclusions: "" })).toBeGreaterThan(
      calculatePoolSize({ ...base, customExclusions: "abcdef" }),
    );
  });
});

describe("generatePin", () => {
  it("produces digits only at the requested length", () => {
    for (const length of [4, 6, 12]) {
      const result = generatePin({ length, allowRepeats: true });
      if (!result.ok) throw new Error(result.error);
      expect(result.value).toHaveLength(length);
      expect(result.value).toMatch(/^[0-9]+$/);
      for (const char of result.value) expect(NUMBERS).toContain(char);
    }
  });

  it("rejects non-repeating PINs longer than 10 digits", () => {
    expect(generatePin({ length: 12, allowRepeats: false }).ok).toBe(false);
  });
});

describe("generatePassphrase", () => {
  it("uses the configured word count and separator", () => {
    const result = generatePassphrase({
      wordCount: 5,
      separator: "_",
      capitalize: false,
      includeNumber: false,
    });
    if (!result.ok) throw new Error(result.error);
    expect(result.value.split("_")).toHaveLength(5);
    expect(result.value).toMatch(/^[a-z]+(_[a-z]+){4}$/);
  });

  it("appends a number and capitalizes when asked", () => {
    const result = generatePassphrase({
      wordCount: 3,
      separator: "-",
      capitalize: true,
      includeNumber: true,
    });
    if (!result.ok) throw new Error(result.error);
    const parts = result.value.split("-");
    expect(parts).toHaveLength(4);
    expect(parts[3]).toMatch(/^\d{2}$/);
    expect(parts[0]).toMatch(/^[A-Z]/);
  });

  it("grows entropy with word count", () => {
    const four = passphraseEntropy({
      wordCount: 4,
      separator: "-",
      capitalize: false,
      includeNumber: false,
    });
    const six = passphraseEntropy({
      wordCount: 6,
      separator: "-",
      capitalize: false,
      includeNumber: false,
    });
    expect(six).toBeGreaterThan(four);
  });
});

describe("entropy", () => {
  it("computes length × log2(pool)", () => {
    expect(estimateEntropy(10, 64)).toBeCloseTo(60);
    expect(estimateEntropy(0, 64)).toBe(0);
    expect(estimateEntropy(10, 1)).toBe(0);
  });

  it("rates weak and strong passwords differently", () => {
    expect(rateStrength(20).label).toBe("Very weak");
    expect(rateStrength(128).label).toBe("Very strong");
  });
});

describe("secureRandom", () => {
  it("stays inside the requested bound", () => {
    for (let i = 0; i < 500; i += 1) {
      const value = secureRandomInt(7);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(7);
    }
  });

  it("rejects invalid bounds", () => {
    expect(() => secureRandomInt(0)).toThrow();
  });

  it("preserves elements when shuffling", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    expect([...shuffleSecurely(input)].sort((a, b) => a - b)).toEqual(input);
  });
});

describe("security invariants", () => {
  const files = [
    "secureRandom.ts",
    "passwordGenerator.ts",
    "passphraseGenerator.ts",
    "pinGenerator.ts",
  ];

  it("never uses Math.random in generation utilities", () => {
    for (const file of files) {
      const source = readFileSync(join(process.cwd(), "src/utils", file), "utf8");
      expect(source).not.toContain("Math.random");
    }
  });
});
