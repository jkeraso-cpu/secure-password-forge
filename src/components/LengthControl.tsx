import { Slider } from "@/components/ui/slider";

interface LengthControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  presets?: number[];
  onChange: (value: number) => void;
}

export function LengthControl({
  id,
  label,
  value,
  min,
  max,
  presets,
  onChange,
}: LengthControlProps) {
  const clamp = (next: number) => Math.min(Math.max(next, min), max);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const parsed = Number.parseInt(event.target.value, 10);
            if (Number.isNaN(parsed)) return;
            onChange(clamp(parsed));
          }}
          className="h-9 w-16 rounded-lg border border-input bg-card px-2 text-center font-mono text-sm tabular-nums"
        />
      </div>
      <Slider
        aria-label={label}
        className="mt-4"
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(values) => onChange(clamp(values[0] ?? value))}
      />
      {presets ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(clamp(preset))}
              aria-pressed={value === preset}
              className={`min-h-8 rounded-lg border px-3 font-mono text-xs transition-colors ${
                value === preset
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
