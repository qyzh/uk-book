import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Library",
  description:
    "Explore and filter the full book collection by genre, author, language, reading status, and more.",
  alternates: {
    canonical: "https://buku.kyxis.my.id/browse",
  },
  openGraph: {
    title: "Browse Library | Rak Buku Online",
    description:
      "Explore and filter the full book collection by genre, author, language, and reading status.",
    url: "https://buku.kyxis.my.id/browse",
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
