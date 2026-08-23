import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shrotas.example"),
  title: "Shrotas — The Art of Hydration",
  description: "Shrotas packaged drinking water. Crafted with essential minerals.",
  openGraph: { title: "Shrotas — The Art of Hydration", description: "An everyday essential, treated like an object of design.", type: "website" },
  icons: { icon: "/assets/shrotas/logo.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#070606", colorScheme: "dark" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
