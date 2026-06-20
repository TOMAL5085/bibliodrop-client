import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "BiblioDrop",
    template: "%s | BiblioDrop",
  },
  description:
    "BiblioDrop is an online book delivery management system for readers, librarians, and administrators.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_30%),linear-gradient(180deg,#fffef9_0%,#f8fafc_28%,#ffffff_100%)] text-slate-950">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
