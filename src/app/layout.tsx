import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.scss";

const lora = Lora({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Novella — Интерактивная история",
  description: "Погрузитесь в интерактивную историю",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${lora.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
