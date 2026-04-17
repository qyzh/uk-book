import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Wishlist",
  description:
    "Books on the reading wishlist — titles queued up for future reading adventures.",
  alternates: {
    canonical: "https://buku.kyxis.my.id/wishlist",
  },
  openGraph: {
    title: "Reading Wishlist | Rak Buku Online",
    description:
      "Books queued up for future reading — the ever-growing to-read list.",
    url: "https://buku.kyxis.my.id/wishlist",
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
