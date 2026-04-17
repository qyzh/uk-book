import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authors",
  description:
    "Explore authors in the reading library — biographies, nationalities, and the books they wrote.",
  alternates: {
    canonical: "https://buku.kyxis.my.id/authors",
  },
  openGraph: {
    title: "Authors | Rak Buku Online",
    description:
      "Explore authors in the reading library — biographies, nationalities, and the books they wrote.",
    url: "https://buku.kyxis.my.id/authors",
  },
};

export default function AuthorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
