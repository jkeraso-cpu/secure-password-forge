import type { GeneratorMode } from "@/types/generator";

const MODES: { id: GeneratorMode; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "maximum", label: "Maximum" },
  { id: "passphrase", label: "Passphrase" },
  { id: "pin", label: "PIN" },
];

interface ModeSelectorProps {
  mode: GeneratorMode;
  onChange: (mode: GeneratorMode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Generator mode"
      className="forge-inset flex gap-1 overflow-x-auto p-1"
    >
      {MODES.map((item) => {
        const active = item.id === mode;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`min-h-9 flex-1 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
