import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PlacementPro AI — Engineering Career Operating System",
  description:
    "AI-powered platform bridging engineering education and industry employment. Skill development, question bank, mock interviews, AI mentor, jobs, and recruitment for every engineering branch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
