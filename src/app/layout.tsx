import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import AppLayout from "@/components/layout/app-layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "MinimalMind - Organize Your Thoughts",
  description: "A minimal app to organize your thoughts, tasks, and notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppProviders>
          <AppLayout>
            {children}
          </AppLayout>
        </AppProviders>
      </body>
    </html>
  );
}
