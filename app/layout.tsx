import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentMe Orlando Car Rentals",
  description: "Fast, easy car rentals in Orlando with rideshare-ready vehicles.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="top" className="min-h-screen bg-zinc-50 text-zinc-950">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="text-xl font-black tracking-tight">
                Rent<span className="text-yellow-500">Me</span> Orlando
              </Link>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Link href="/cars" className="rounded-full px-4 py-2 hover:bg-zinc-100">
                  Cars
                </Link>
                <Link
                  href="/checkout"
                  className="rounded-full bg-zinc-950 px-4 py-2 text-white hover:bg-yellow-400 hover:text-zinc-950"
                >
                  Book now
                </Link>
              </div>
            </nav>
          </header>

          {children}

          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-zinc-600 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <p className="text-lg font-black text-zinc-950">RentMe Orlando</p>
                <p className="mt-2">Clean, reliable rentals for Orlando trips and rideshare drivers.</p>
              </div>
              <div>
                <p className="font-black text-zinc-950">Support</p>
                <p className="mt-2">Same-day booking requests, airport pickup options, and clear deposit details.</p>
              </div>
              <div>
                <p className="font-black text-zinc-950">Built for conversion</p>
                <p className="mt-2">Fast browsing, responsive images, and a real Supabase booking flow.</p>
              </div>
            </div>
          </footer>

          <StickyWhatsApp />
        </div>
      </body>
    </html>
  );
}
