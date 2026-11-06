import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PlacementPro AI — Engineering Career Operating System",
  description:
    "AI-powered platform bridging engineering education and industry employment. Skill development, question bank, mock interviews, AI mentor, jobs, and recruitment for every engineering branch.",
};

// Inline script runs before paint — reads persisted theme from localStorage
// and applies the `dark` class on <html> to prevent FOUC. Default is dark (black).
const themeInitScript = `
(function() {
  try {
    var raw = localStorage.getItem('placementpro-app');
    var theme = 'dark';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.state && parsed.state.theme) {
        theme = parsed.state.theme;
      }
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
