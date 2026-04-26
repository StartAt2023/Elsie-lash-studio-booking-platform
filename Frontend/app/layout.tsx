import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PublicOnlyFooter from "@/components/PublicOnlyFooter";
import { ToastProvider } from "@/components/admin/ToastContext";
import { LocaleProvider } from "@/components/LocaleProvider";
import { en } from "@/locales/en";

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-cream font-sans antialiased text-charcoal">
        <LocaleProvider>
          <ToastProvider>
            <Header />
            {children}
            <PublicOnlyFooter />
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
