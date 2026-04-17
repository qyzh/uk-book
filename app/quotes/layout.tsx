import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quotes Collection",
  description:
    "Browse the full collection of book quotes — memorable passages, favorite lines, and highlighted excerpts from the reading library.",
  alternates: {
    canonical: "https://buku.kyxis.my.id/quotes",
  },
  openGraph: {
    title: "Quotes Collection | Rak Buku Online",
    description:
      "Browse memorable passages, favorite lines, and highlighted excerpts from the reading library.",
    url: "https://buku.kyxis.my.id/quotes",
  },
};

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
