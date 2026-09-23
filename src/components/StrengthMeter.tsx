import type { StrengthRating } from "@/types/generator";

const SEGMENT_COLORS = [
  "bg-strength-1",
  "bg-strength-2",
  "bg-strength-3",
  "bg-strength-4",
  "bg-strength-5",
] as const;

interface StrengthMeterProps {
  rating: StrengthRating;
  caption?: string;
}

export function StrengthMeter({ rating, caption }: StrengthMeterProps) {
  const color = SEGMENT_COLORS[rating.score - 1] ?? SEGMENT_COLORS[0];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Strength
        </span>
        <span className="text-sm font-semibold">{rating.label}</span>
      </div>
      <div
        className="mt-2 flex gap-1.5"
        role="meter"
        aria-label="Password strength"
        aria-valuenow={rating.score}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuetext={rating.label}
      >
        {[1, 2, 3, 4, 5].map((segment) => (
          <span
            key={segment}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              segment <= rating.score ? color : "bg-border"
            }`}
          />
        ))}
      </div>
      {caption ? <p className="mt-2 text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}
