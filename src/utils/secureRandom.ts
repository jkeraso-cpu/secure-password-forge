/**
 * Cryptographically secure randomness helpers.
 * All randomness in PasswordForge flows through this module.
 */

function getCrypto(): Crypto {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== "function") {
    throw new Error("Secure randomness is not available in this environment.");
  }
  return cryptoObj;
}

/**
 * Returns a uniformly distributed integer in [0, max).
 * Rejection sampling removes the modulo bias a plain `% max` would introduce.
 */
export function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0) {
    throw new Error("secureRandomInt requires a positive integer bound.");
  }
  if (max === 1) return 0;

  const cryptoObj = getCrypto();
  const limit = Math.floor(0xffffffff / max) * max;
  const buffer = new Uint32Array(1);

  // Expected iterations are < 2 for any realistic `max`.
  for (;;) {
    cryptoObj.getRandomValues(buffer);
    const value = buffer[0]!;
    if (value < limit) return value % max;
  }
}

/** Picks a single character from a non-empty pool. */
export function randomCharacter(pool: string): string {
  if (pool.length === 0) {
    throw new Error("Cannot pick a character from an empty pool.");
  }
  return pool.charAt(secureRandomInt(pool.length));
}

/** Picks one element from a non-empty array. */
export function randomItem<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("Cannot pick an item from an empty list.");
  }
  return items[secureRandomInt(items.length)]!;
}

/** Fisher-Yates shuffle driven by secure randomness. Returns a new array. */
export function shuffleSecurely<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    const a = result[i]!;
    const b = result[j]!;
    result[i] = b;
    result[j] = a;
  }
  return result;
}
