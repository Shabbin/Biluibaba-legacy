"use client";

import "./globals.css";

import { Toaster } from "@/components/toaster";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Biluibaba - Vendor & Vet Dashboard</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="antialiased selection:bg-petzy-coral/20 selection:text-petzy-coral-dark">
        <main className="min-h-dvh">
          {children}
          <ProgressBar
            height="3px"
            color="#FF8A80"
            options={{ showSpinner: false }}
            shallowRouting
          />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
