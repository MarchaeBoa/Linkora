import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linkora — Sua vitrine digital em um só lugar",
  description:
    "Crie sua página personalizada, venda produtos digitais, capture leads e gerencie tudo em um dashboard poderoso.",
  keywords: ["link na bio", "loja digital", "criadores", "produtos digitais", "linkora"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased notranslate`}
      suppressHydrationWarning
      translate="no"
    >
      <head>
        <meta name="google" content="notranslate" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'pt',
                  autoDisplay: true,
                  includedLanguages: 'en,es,fr,de,it,ja,ko,zh-CN,ar,hi,ru,nl,sv,pl,tr',
                  layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div id="google_translate_element" className="fixed top-16 right-4 z-[9999]" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
