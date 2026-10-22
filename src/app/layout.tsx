import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal, Almarai, Readex_Pro, Amiri } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

const readex = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-readex",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").single();
  const logo = settings?.logo_url || settings?.favicon_url || undefined;
  const title = settings?.company_name || "TopMarkah";

  return {
    title,
    description: settings?.seo_description || "Premium products delivered to you.",
    icons: logo
      ? {
          icon: logo,
          shortcut: logo,
          apple: logo,
        }
      : undefined,
    openGraph: logo
      ? {
          title,
          images: [{ url: logo }],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${tajawal.variable} ${almarai.variable} ${readex.variable} ${amiri.variable} ${cairo.className} scroll-smooth`}
    >
      <body className="antialiased selection:bg-primary/20">{children}</body>
    </html>
  );
}
