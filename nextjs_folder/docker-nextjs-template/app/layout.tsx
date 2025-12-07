/* Gavin Stankovsky
*  November 2025
*  Layout for page nav bar and session information
*/

"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import "./lib/css/calendar.css";
import Nav from "./lib/components/nav";
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SessionProvider>
          {/* Pass the session provider down */}
          <Nav />
        </SessionProvider>
        {children}
      </body>
    </html>
  );
}
