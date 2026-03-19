import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "FitGuide — Your Daily Workout",
  description: "A step-by-step guided fitness system for beginners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0a0a0a]">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
