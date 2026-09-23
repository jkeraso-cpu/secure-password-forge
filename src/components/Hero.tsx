import { ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 pt-10 pb-8 text-center sm:px-6 sm:pt-14">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
        Private by design
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Forge stronger passwords.
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
        Generate strong, customizable passwords directly in your browser.
      </p>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
        Generated locally. Nothing leaves your device.
      </p>
    </section>
  );
}
