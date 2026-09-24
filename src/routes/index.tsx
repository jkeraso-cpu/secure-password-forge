import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { GeneratorCard } from "@/components/GeneratorCard";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PasswordAnalyzer } from "@/components/PasswordAnalyzer";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { SecurityTips } from "@/components/SecurityTips";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";

const TITLE = "PasswordForge | Secure Password Generator";
const DESCRIPTION =
  "Generate customizable passwords, passphrases, and PINs locally in your browser with PasswordForge.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#1b1c22" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <Hero />
          <GeneratorCard />
          <PrivacyNotice />
          <PasswordAnalyzer />
          <SecurityTips />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
