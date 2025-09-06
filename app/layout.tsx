import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/toaster";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { WebSocketProvider } from "@/components/providers/websocket-provider";
import { NotificationHandler } from "@/components/notifications/notification-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gulf Return",
  description: "Connect, Share, Engage - Your Social Space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="gulf-return-theme"
        >
          <WebSocketProvider>
            <NotificationHandler />
            <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
              {/* Dot Pattern Background */}
              <DotPattern
                width={18}
                height={18}
                cx={1}
                cy={1}
                cr={1.2}
                className="text-gray-700/50 dark:text-gray-400/40"
              />
              <Navbar />
              <main className="relative z-10">{children}</main>
              <Toaster />
            </div>
          </WebSocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
