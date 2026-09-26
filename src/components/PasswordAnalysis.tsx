import { CheckCircle2 } from "lucide-react";
import { InfoTip } from "@/components/InfoTip";
import { formatCombinations, illustrativeCrackTime } from "@/utils/entropy";

interface PasswordAnalysisProps {
  length: number;
  poolLabel: string;
  entropyBits: number;
  modeLabel: string;
  note?: string | undefined;
}

export function PasswordAnalysis({
  length,
  poolLabel,
  entropyBits,
  modeLabel,
  note,
}: PasswordAnalysisProps) {
  const rows = [
    { label: "Length", value: `${length} characters` },
    { label: "Character pool", value: poolLabel },
    {
      label: "Estimated entropy",
      value: `${Math.round(entropyBits)} bits`,
      tip: "Entropy is an estimate of the number of possible combinations. Higher values generally mean more resistance to guessing when passwords are generated randomly.",
    },
    { label: "Possible combinations", value: formatCombinations(entropyBits) },
    {
      label: "Illustrative brute-force estimate",
      value: illustrativeCrackTime(entropyBits),
      tip: "Real attack speeds vary significantly depending on hashing algorithms, hardware, breaches, password reuse, and other factors.",
    },
    { label: "Mode", value: modeLabel },
  ];

  return (
    <div>
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Analysis
      </h3>
      <dl className="mt-3 divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2">
            <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {row.label}
              {row.tip ? <InfoTip label={`About ${row.label}`} text={row.tip} /> : null}
            </dt>
            <dd className="text-right font-mono text-sm tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>

      {note ? <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{note}</p> : null}

      <ul className="mt-4 flex flex-wrap gap-2">
        {["Secure randomness", "Generated locally", "No password storage"].map((chip) => (
          <li
            key={chip}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
          >
            <CheckCircle2 className="size-3 text-primary" aria-hidden="true" />
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}
