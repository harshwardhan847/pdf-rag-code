import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignedOut,
  SignedIn,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF RAG Assistant",
  description: "Upload PDFs and chat with grounded context from your docs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedIn>
            <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
              <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    PDF RAG
                  </p>
                  <h1 className="text-lg font-semibold text-foreground">
                    Document Copilot
                  </h1>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>
            {children}
          </SignedIn>

          <SignedOut>
            <main className="flex min-h-screen items-center justify-center p-6">
              <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-8 text-center shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Welcome
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Sign in to continue
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Access your PDF workspace and chat with your documents.
                </p>
                <div className="mt-6 flex justify-center">
                  <SignUpButton mode="modal" />
                </div>
              </div>
            </main>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
