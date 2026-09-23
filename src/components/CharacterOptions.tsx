import { CATEGORY_LABELS } from "@/constants/characterSets";
import { Switch } from "@/components/ui/switch";
import type { CharacterCategory, PasswordOptions } from "@/types/generator";

const CATEGORIES: CharacterCategory[] = ["uppercase", "lowercase", "numbers", "symbols"];

interface CharacterOptionsProps {
  options: PasswordOptions;
  onChange: (patch: Partial<PasswordOptions>) => void;
}

export function CharacterOptions({ options, onChange }: CharacterOptionsProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Character types</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {CATEGORIES.map((category) => {
          const meta = CATEGORY_LABELS[category];
          const id = `char-${category}`;
          return (
            <div
              key={category}
              className="forge-inset flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <label htmlFor={id} className="cursor-pointer">
                <span className="block text-sm">{meta.label}</span>
                <span className="block font-mono text-xs text-muted-foreground">
                  {meta.example}
                </span>
              </label>
              <Switch
                id={id}
                checked={options[category]}
                onCheckedChange={(checked) => onChange({ [category]: checked })}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
