import type { Metadata, Viewport } from "next";
import InstallAppPrompt from "@/components/pwa/InstallAppPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculator Pro",
  description: "Ruang obrolan pribadi tertutup untuk kontak terpercaya.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Calculator Pro",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBECFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-body bg-ocean-950 text-ocean-50 antialiased">
        {children}
        <InstallAppPrompt />
      </body>
    </html>
  );
}
