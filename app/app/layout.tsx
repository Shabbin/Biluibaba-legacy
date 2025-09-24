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
        <title>Biluibaba - App</title>
      </head>
      <body
        className={`antialiased selection:bg-stone-950 selection:text-white`}
      >
        <main>
          {children}
          <ProgressBar
            height="4px"
            color="#000000"
            options={{ showSpinner: true }}
            shallowRouting
          />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
