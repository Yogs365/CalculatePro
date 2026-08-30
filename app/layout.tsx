import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Private Chat",
  description: "Private Chat PWA",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
