'use client';
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Nav from "./lib/nav";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SessionProvider> {/* Pass the session provider down */}
          <Nav />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
