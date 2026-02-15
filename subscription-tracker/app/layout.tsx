import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "Subscription Tracker - Virtual Dev Team",
  description: "Overzicht van al je abonnementen — wat betaal je, wanneer, en hoeveel in totaal?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
