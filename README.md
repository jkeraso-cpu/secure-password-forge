# PasswordForge

PasswordForge is a privacy-first password generator and strength utility that creates customizable passwords, passphrases, and PINs entirely in your browser.

## Features

- Random password generation with length from 4 to 128 characters
- Toggle uppercase, lowercase, numbers and symbols, with inline validation
- Advanced options: guarantee selected character types, exclude ambiguous characters, avoid confusing symbols, custom character exclusions, and no repeated characters
- Passphrase mode with configurable word count, separator, capitalization and an optional appended number
- Numeric PIN mode with an optional no-repeated-digits rule
- Entropy estimate, character-pool size, combination count and a clearly labelled illustrative brute-force framing
- Five-level strength meter driven by estimated entropy, with a textual label so colour is never the only signal
- Local password analyzer for checking a password you already use
- Polished light and dark themes that follow the system preference on first visit
- Keyboard-accessible controls, labelled inputs, visible focus states and `aria-live` copy feedback

## Privacy

- Passwords, passphrases and PINs are generated on your device and never transmitted
- Nothing generated or typed is written to `localStorage`, and there is no password history
- Only two harmless preferences are stored locally: the selected theme and the selected generator mode
- No breach-database lookups, no analytics on generated values, no accounts, no backend

PasswordForge is a generator, not a password manager — it does not store credentials.

## Security approach

- All randomness comes from `crypto.getRandomValues()` via `src/utils/secureRandom.ts`
- `secureRandomInt()` uses rejection sampling to avoid modulo bias
- When character types are guaranteed, required characters are picked first and the final result is shuffled with a cryptographically secure Fisher-Yates shuffle
- `Math.random()` is not used anywhere in generation logic, and a unit test enforces that
- Strength is estimated from length and pool size (`length × log2(poolSize)`), not from checkbox counting
- Estimates are presented as estimates: no claims of unbreakable or absolute security

## Tech stack

- React 19 + TypeScript
- TanStack Start / TanStack Router
- Tailwind CSS v4 with an oklch design-token system
- Lucide React icons
- Vitest for unit tests

## Getting started

### Installation

```bash
npm install
```

The repository can be cloned normally with `git clone` and then installed with the command above.

### Run locally

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Production build

```bash
npm run build
```

## Project structure

```
src/
  components/      UI components (header, generator, analyzer, tips, footer)
  constants/       character sets and the embedded passphrase word list
  hooks/           useTheme
  routes/          TanStack Start routes and document head metadata
  types/           generator option and result types
  utils/           secureRandom, passwordGenerator, passphraseGenerator,
                   pinGenerator, entropy, and unit tests
```

## Deployment

PasswordForge is a static-friendly front-end application with no server-side
dependencies. Build it with `npm run build` and serve the generated output from
any modern static host or Node-compatible runtime.

## Future improvements

- Optional keyboard shortcuts for generate and copy
- Additional passphrase word lists and language options
- Exportable per-site generation profiles that store settings only, never secrets

## License

Released under the [MIT License](./LICENSE).
