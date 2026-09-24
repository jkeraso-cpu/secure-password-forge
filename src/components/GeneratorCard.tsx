import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdvancedOptions } from "@/components/AdvancedOptions";
import { CharacterOptions } from "@/components/CharacterOptions";
import { LengthControl } from "@/components/LengthControl";
import { ModeSelector } from "@/components/ModeSelector";
import { PassphraseControls } from "@/components/PassphraseControls";
import { PasswordAnalysis } from "@/components/PasswordAnalysis";
import { PasswordOutput } from "@/components/PasswordOutput";
import { PinControls } from "@/components/PinControls";
import { StrengthMeter } from "@/components/StrengthMeter";
import type {
  GeneratorMode,
  PassphraseOptions,
  PasswordOptions,
  PinOptions,
} from "@/types/generator";
import { estimateEntropy, rateStrength } from "@/utils/entropy";
import {
  MAX_LENGTH,
  MIN_LENGTH,
  calculatePoolSize,
  generatePassword,
} from "@/utils/passwordGenerator";
import {
  UNIQUE_WORDS,
  generatePassphrase,
  passphraseEntropy,
} from "@/utils/passphraseGenerator";
import { generatePin } from "@/utils/pinGenerator";

const MODE_STORAGE_KEY = "passwordforge:mode";

const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  guaranteeTypes: true,
  excludeAmbiguous: true,
  excludeConfusingSymbols: false,
  customExclusions: "",
  noRepeats: false,
};

const MAXIMUM_PASSWORD_OPTIONS: PasswordOptions = {
  ...DEFAULT_PASSWORD_OPTIONS,
  length: 32,
  excludeAmbiguous: false,
};

const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 4,
  separator: "-",
  capitalize: false,
  includeNumber: false,
};

const DEFAULT_PIN_OPTIONS: PinOptions = { length: 6, allowRepeats: true };

const MODE_LABELS: Record<GeneratorMode, string> = {
  balanced: "Random password",
  maximum: "Random password",
  passphrase: "Passphrase",
  pin: "Numeric PIN",
};

function isMode(value: unknown): value is GeneratorMode {
  return value === "balanced" || value === "maximum" || value === "passphrase" || value === "pin";
}

export function GeneratorCard() {
  const [mode, setMode] = useState<GeneratorMode>("balanced");
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>(
    DEFAULT_PASSWORD_OPTIONS,
  );
  const [passphraseOptions, setPassphraseOptions] = useState<PassphraseOptions>(
    DEFAULT_PASSPHRASE_OPTIONS,
  );
  const [pinOptions, setPinOptions] = useState<PinOptions>(DEFAULT_PIN_OPTIONS);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MODE_STORAGE_KEY);
      if (isMode(stored)) {
        setMode(stored);
        if (stored === "maximum") setPasswordOptions(MAXIMUM_PASSWORD_OPTIONS);
      }
    } catch {
      // Ignore unavailable storage.
    }
  }, []);

  const handleModeChange = useCallback((next: GeneratorMode) => {
    setMode(next);
    if (next === "balanced") setPasswordOptions(DEFAULT_PASSWORD_OPTIONS);
    if (next === "maximum") setPasswordOptions(MAXIMUM_PASSWORD_OPTIONS);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      // Ignore unavailable storage.
    }
  }, []);

  const regenerate = useCallback(() => setSeed((value) => value + 1), []);

  const result = useMemo(() => {
    void seed;
    if (mode === "passphrase") return generatePassphrase(passphraseOptions);
    if (mode === "pin") return generatePin(pinOptions);
    return generatePassword(passwordOptions);
  }, [mode, passwordOptions, passphraseOptions, pinOptions, seed]);

  const analysis = useMemo(() => {
    if (mode === "passphrase") {
      const bits = passphraseEntropy(passphraseOptions);
      return {
        entropyBits: bits,
        poolLabel: `${UNIQUE_WORDS.length} words`,
        length: result.ok ? result.value.length : 0,
        note: "Passphrase entropy comes from the number of word choices, not the character count.",
      };
    }
    if (mode === "pin") {
      const bits = estimateEntropy(pinOptions.length, 10);
      return {
        entropyBits: bits,
        poolLabel: "10 digits",
        length: pinOptions.length,
        note: "PINs are convenient, but a short numeric code has a far smaller search space than a long random password.",
      };
    }
    const poolSize = calculatePoolSize(passwordOptions);
    return {
      entropyBits: estimateEntropy(passwordOptions.length, poolSize),
      poolLabel: `${poolSize} possible characters`,
      length: passwordOptions.length,
      note: undefined,
    };
  }, [mode, passwordOptions, passphraseOptions, pinOptions, result]);

  const rating = rateStrength(analysis.entropyBits);
  const isPasswordMode = mode === "balanced" || mode === "maximum";

  const resetSettings = () => {
    setPasswordOptions(mode === "maximum" ? MAXIMUM_PASSWORD_OPTIONS : DEFAULT_PASSWORD_OPTIONS);
    setPassphraseOptions(DEFAULT_PASSPHRASE_OPTIONS);
    setPinOptions(DEFAULT_PIN_OPTIONS);
    regenerate();
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="forge-panel p-4 sm:p-6">
        <ModeSelector mode={mode} onChange={handleModeChange} />

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            {isPasswordMode ? (
              <>
                <LengthControl
                  id="password-length"
                  label="Password length"
                  value={passwordOptions.length}
                  min={MIN_LENGTH}
                  max={MAX_LENGTH}
                  presets={[12, 16, 20, 32, 64]}
                  onChange={(value) => setPasswordOptions((current) => ({ ...current, length: value }))}
                />
                <CharacterOptions
                  options={passwordOptions}
                  onChange={(patch) =>
                    setPasswordOptions((current) => ({ ...current, ...patch }))
                  }
                />
                <AdvancedOptions
                  options={passwordOptions}
                  onChange={(patch) =>
                    setPasswordOptions((current) => ({ ...current, ...patch }))
                  }
                />
              </>
            ) : null}

            {mode === "passphrase" ? (
              <PassphraseControls
                options={passphraseOptions}
                onChange={(patch) => setPassphraseOptions((current) => ({ ...current, ...patch }))}
              />
            ) : null}

            {mode === "pin" ? (
              <PinControls
                options={pinOptions}
                onChange={(patch) => setPinOptions((current) => ({ ...current, ...patch }))}
              />
            ) : null}

            <button
              type="button"
              onClick={resetSettings}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset settings
            </button>
          </div>

          <div className="space-y-6">
            <PasswordOutput
              value={result.ok ? result.value : ""}
              error={result.ok ? null : result.error}
              onRegenerate={regenerate}
            />
            <StrengthMeter rating={rating} />
            <PasswordAnalysis
              length={analysis.length}
              poolLabel={analysis.poolLabel}
              entropyBits={analysis.entropyBits}
              modeLabel={MODE_LABELS[mode]}
              note={analysis.note}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
