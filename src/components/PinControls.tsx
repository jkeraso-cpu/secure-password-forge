import { LengthControl } from "@/components/LengthControl";
import { Switch } from "@/components/ui/switch";
import type { PinOptions } from "@/types/generator";
import { MAX_PIN_LENGTH, MIN_PIN_LENGTH } from "@/utils/pinGenerator";

interface PinControlsProps {
  options: PinOptions;
  onChange: (patch: Partial<PinOptions>) => void;
}

export function PinControls({ options, onChange }: PinControlsProps) {
  return (
    <div className="space-y-5">
      <LengthControl
        id="pin-length"
        label="PIN length"
        value={options.length}
        min={MIN_PIN_LENGTH}
        max={MAX_PIN_LENGTH}
        onChange={(value) => onChange({ length: value })}
      />

      <div className="forge-inset flex items-center justify-between gap-3 px-3 py-2.5">
        <label htmlFor="pin-repeats" className="cursor-pointer text-sm">
          Allow repeated digits
        </label>
        <Switch
          id="pin-repeats"
          checked={options.allowRepeats}
          onCheckedChange={(checked) => onChange({ allowRepeats: checked })}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        PINs are convenient for supported devices, but they have a much smaller search space than
        long random passwords.
      </p>
    </div>
  );
}
