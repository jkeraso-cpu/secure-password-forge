import { Fingerprint, KeyRound, Ruler, ShieldCheck } from "lucide-react";

const TIPS = [
  {
    icon: Fingerprint,
    title: "Use unique passwords",
    text: "Never reuse important passwords across different services.",
  },
  {
    icon: KeyRound,
    title: "Use a password manager",
    text: "A trusted password manager can generate and securely store unique passwords.",
  },
  {
    icon: ShieldCheck,
    title: "Turn on MFA",
    text: "Multi-factor authentication adds another layer of protection.",
  },
  {
    icon: Ruler,
    title: "Prefer length",
    text: "Long random passwords and passphrases are generally harder to guess.",
  },
] as const;

export function SecurityTips() {
  return (
    <section
      id="security-tips"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pt-14 sm:px-6"
    >
      <h2 className="text-lg font-semibold tracking-tight">Better password habits</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TIPS.map(({ icon: Icon, title, text }) => (
          <article key={title} className="forge-panel p-4">
            <Icon className="size-4 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-medium">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
