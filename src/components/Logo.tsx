interface LogoProps {
  className?: string;
}

/** Geometric shield-and-spark mark. Uses currentColor so it works in both themes. */
export function LogoMark({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="PasswordForge logo"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2.5 27 6.6v9.2c0 6.6-4.4 11.7-11 13.7-6.6-2-11-7.1-11-13.7V6.6L16 2.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M17.6 9.5 11.8 17.4h4.1l-1.5 5.6 5.8-8.2h-4.1l1.5-5.3Z" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <LogoMark className="size-5" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        Password<span className="text-primary">Forge</span>
      </span>
    </span>
  );
}
