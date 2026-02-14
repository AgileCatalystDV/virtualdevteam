import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRUD App - Virtual Dev Team",
  description: "CRUD applicatie met React, Next.js, TypeScript en Tailwind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
