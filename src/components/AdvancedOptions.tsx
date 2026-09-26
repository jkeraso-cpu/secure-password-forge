import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { InfoTip } from "@/components/InfoTip";
import { Switch } from "@/components/ui/switch";
import type { PasswordOptions } from "@/types/generator";

interface AdvancedOptionsProps {
  options: PasswordOptions;
  onChange: (patch: Partial<PasswordOptions>) => void;
}

interface ToggleRowProps {
  id: string;
  label: string;
  tip?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ id, label, tip, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-1.5">
        <label htmlFor={id} className="cursor-pointer text-sm">
          {label}
        </label>
        {tip ? <InfoTip label={`About ${label}`} text={tip} /> : null}
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function AdvancedOptions({ options, onChange }: AdvancedOptionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="forge-inset px-3 py-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex min-h-9 w-full items-center justify-between text-sm font-medium"
      >
        Advanced options
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="mt-1 divide-y divide-border border-t border-border pt-1">
          <ToggleRow
            id="adv-guarantee"
            label="Guarantee selected character types"
            tip="Every selected category will appear at least once, as long as the length allows it."
            checked={options.guaranteeTypes}
            onChange={(checked) => onChange({ guaranteeTypes: checked })}
          />
          <ToggleRow
            id="adv-ambiguous"
            label="Exclude ambiguous characters"
            tip="Avoid characters that can be easily confused, such as 0, O, 1, l and I."
            checked={options.excludeAmbiguous}
            onChange={(checked) => onChange({ excludeAmbiguous: checked })}
          />
          <ToggleRow
            id="adv-symbols"
            label="Avoid confusing symbols"
            tip={"Skips symbols that are awkward to type or read, such as | ` ' \" and \\."}
            checked={options.excludeConfusingSymbols}
            onChange={(checked) => onChange({ excludeConfusingSymbols: checked })}
          />
          <ToggleRow
            id="adv-norepeat"
            label="No repeated characters"
            tip="Each character appears at most once, which limits the maximum usable length."
            checked={options.noRepeats}
            onChange={(checked) => onChange({ noRepeats: checked })}
          />
          <div className="py-3">
            <label htmlFor="adv-exclusions" className="text-sm">
              Exclude characters
            </label>
            <input
              id="adv-exclusions"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={options.customExclusions}
              onChange={(event) => onChange({ customExclusions: event.target.value })}
              placeholder="Characters to exclude, e.g. {}[]/\"
              className="mt-2 h-10 w-full rounded-lg border border-input bg-card px-3 font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Not saved anywhere — exclusions reset when you reload.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
