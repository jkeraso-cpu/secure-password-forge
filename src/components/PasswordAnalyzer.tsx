import { Eye, EyeOff, Lock, X } from "lucide-react";
import { useMemo, useState } from "react";
import { StrengthMeter } from "@/components/StrengthMeter";
import { estimateEntropy, observedPoolSize, rateStrength } from "@/utils/entropy";

export function PasswordAnalyzer() {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);

  const analysis = useMemo(() => {
    const poolSize = observedPoolSize(value);
    const entropyBits = estimateEntropy(value.length, poolSize);
    const variety = [
      /[a-z]/.test(value) && "lowercase",
      /[A-Z]/.test(value) && "uppercase",
      /[0-9]/.test(value) && "numbers",
      /[^a-zA-Z0-9]/.test(value) && "symbols",
    ].filter(Boolean) as string[];
    return { poolSize, entropyBits, variety, rating: rateStrength(entropyBits) };
  }, [value]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6">
      <h2 className="text-lg font-semibold tracking-tight">Check my own password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Analysed entirely in your browser. Nothing you type is stored or sent anywhere.
      </p>

      <div className="forge-panel mt-4 grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
        <div>
          <label htmlFor="analyzer-input" className="text-sm font-medium">
            Password to analyse
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="analyzer-input"
              type={visible ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Type or paste a password"
              className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-card px-3 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              className="flex size-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label="Clear password field"
              className="flex size-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-primary" aria-hidden="true" />
            Runs locally — no network requests, no storage.
          </p>
        </div>

        <div className="space-y-4">
          <StrengthMeter rating={analysis.rating} />
          <dl className="divide-y divide-border">
            <div className="flex justify-between gap-3 py-2">
              <dt className="text-sm text-muted-foreground">Length</dt>
              <dd className="font-mono text-sm tabular-nums">{value.length} characters</dd>
            </div>
            <div className="flex justify-between gap-3 py-2">
              <dt className="text-sm text-muted-foreground">Character variety</dt>
              <dd className="text-right text-sm">
                {analysis.variety.length > 0 ? analysis.variety.join(", ") : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-2">
              <dt className="text-sm text-muted-foreground">Estimated entropy</dt>
              <dd className="font-mono text-sm tabular-nums">
                {Math.round(analysis.entropyBits)} bits
              </dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Strength estimates are approximate. Human-created passwords may be easier to guess than
            random passwords with similar character counts.
          </p>
        </div>
      </div>
    </section>
  );
}
