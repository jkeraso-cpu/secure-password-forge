import { LogoMark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 text-center sm:px-6">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <LogoMark className="size-4 text-primary" />
          PasswordForge
        </span>
        <p className="text-xs text-muted-foreground">
          Generated locally. Nothing leaves your device.
        </p>
        <p className="text-xs text-muted-foreground">
          Built for stronger logins and fewer sticky notes.
        </p>
      </div>
    </footer>
  );
}
