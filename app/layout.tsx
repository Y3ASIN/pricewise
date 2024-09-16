import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { inter, spaceGrotast } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Pricewise",
  description:
    "Track product prices effortlessly and save money on your online shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="max-w-10xl mx-auto">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
