import { Check, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PasswordOutputProps {
  value: string;
  error: string | null;
  onRegenerate: () => void;
}

export function PasswordOutput({ value, error, onRegenerate }: PasswordOutputProps) {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAnimating(true);
    const id = setTimeout(() => setAnimating(false), 200);
    return () => clearTimeout(id);
  }, [value]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyError(null);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError("Copying isn't available here — select the text and copy manually.");
    }
  };

  const display = hidden ? "•".repeat(Math.min(value.length, 64)) : value;

  return (
    <div>
      <div
        className={`forge-inset relative flex min-h-[84px] items-center px-4 py-4 focus-within:ring-2 focus-within:ring-ring ${
          error ? "border-destructive/60" : ""
        }`}
      >
        <output aria-label="Generated password" className="w-full overflow-x-auto" tabIndex={0}>
          {error ? (
            <span className="text-sm text-destructive">{error}</span>
          ) : (
            <span
              className={`block font-mono text-xl leading-relaxed tracking-[0.02em] break-all whitespace-pre-wrap sm:text-2xl ${
                animating ? "forge-generating" : ""
              }`}
            >
              {display}
            </span>
          )}
        </output>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:flex-none"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Regenerate
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={Boolean(error) || !value}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-surface disabled:opacity-50 sm:flex-none"
        >
          {copied ? (
            <Check className="size-4 text-primary" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={() => setHidden((current) => !current)}
          aria-pressed={hidden}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          {hidden ? (
            <Eye className="size-4" aria-hidden="true" />
          ) : (
            <EyeOff className="size-4" aria-hidden="true" />
          )}
          {hidden ? "Show" : "Hide"}
        </button>
      </div>

      <p aria-live="polite" className="mt-2 min-h-4 text-xs text-muted-foreground">
        {copyError ?? (copied ? "Password copied to clipboard" : "")}
      </p>
    </div>
  );
}
