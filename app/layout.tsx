import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import ToastLayout from "./components/ToastLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const BASE_URL = "https://buku.kyxis.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Rak Buku Online — qyzh's Reading Library",
    template: "%s | Rak Buku Online",
  },
  description:
    "A personal online bookshelf tracking reading progress, favorite quotes, and book collections. Follow along the reading journey.",
  keywords: [
    "book tracker",
    "reading list",
    "book collection",
    "reading progress",
    "quotes",
    "online library",
    "rak buku",
  ],
  authors: [{ name: "qyzh", url: BASE_URL }],
  creator: "qyzh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Rak Buku Online",
    title: "Rak Buku Online — qyzh's Reading Library",
    description:
      "A personal online bookshelf tracking reading progress, favorite quotes, and book collections.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rak Buku Online — Personal Book Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rak Buku Online — qyzh's Reading Library",
    description:
      "A personal online bookshelf tracking reading progress, favorite quotes, and book collections.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ToastLayout>
            {children}
          </ToastLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
