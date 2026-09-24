import { LengthControl } from "@/components/LengthControl";
import { Switch } from "@/components/ui/switch";
import type { PassphraseOptions } from "@/types/generator";
import { MAX_WORDS, MIN_WORDS } from "@/utils/passphraseGenerator";

const SEPARATORS = [
  { value: "-", label: "-" },
  { value: "_", label: "_" },
  { value: ".", label: "." },
  { value: " ", label: "space" },
];

interface PassphraseControlsProps {
  options: PassphraseOptions;
  onChange: (patch: Partial<PassphraseOptions>) => void;
}

export function PassphraseControls({ options, onChange }: PassphraseControlsProps) {
  const isPreset = SEPARATORS.some((item) => item.value === options.separator);

  return (
    <div className="space-y-5">
      <LengthControl
        id="passphrase-words"
        label="Number of words"
        value={options.wordCount}
        min={MIN_WORDS}
        max={MAX_WORDS}
        onChange={(value) => onChange({ wordCount: value })}
      />

      <div>
        <span className="text-sm font-medium">Separator</span>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {SEPARATORS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange({ separator: item.value })}
              aria-pressed={options.separator === item.value}
              className={`min-h-9 rounded-lg border px-3 font-mono text-xs transition-colors ${
                options.separator === item.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
          <input
            type="text"
            maxLength={1}
            aria-label="Custom separator"
            placeholder="custom"
            value={isPreset ? "" : options.separator}
            onChange={(event) => onChange({ separator: event.target.value })}
            className="h-9 w-20 rounded-lg border border-input bg-card px-2 text-center font-mono text-xs"
          />
        </div>
      </div>

      <div className="forge-inset divide-y divide-border px-3">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <label htmlFor="pp-capitalize" className="cursor-pointer text-sm">
            Capitalize words
          </label>
          <Switch
            id="pp-capitalize"
            checked={options.capitalize}
            onCheckedChange={(checked) => onChange({ capitalize: checked })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 py-2.5">
          <label htmlFor="pp-number" className="cursor-pointer text-sm">
            Append a number
          </label>
          <Switch
            id="pp-number"
            checked={options.includeNumber}
            onCheckedChange={(checked) => onChange({ includeNumber: checked })}
          />
        </div>
      </div>
    </div>
  );
}
