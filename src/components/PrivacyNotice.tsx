import { ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function PrivacyNotice() {
  const [open, setOpen] = useState(false);

  return (
    <section className="forge-panel mx-auto mt-6 w-full max-w-6xl p-4 sm:p-5">
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold">Private by design</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            PasswordForge generates passwords entirely on your device using the browser&apos;s secure
            random-number generator. Generated passwords are not stored or transmitted.
          </p>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary"
          >
            How generation works
            <ChevronDown
              className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {open ? (
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              PasswordForge uses the browser&apos;s Web Crypto API to select characters using
              cryptographically secure random values. Generation happens locally and generated
              passwords are not sent to a server. PasswordForge is a generator, not a password
              manager — it never saves your credentials.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
