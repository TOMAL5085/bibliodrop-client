import Link from "next/link";
import { Globe, Mail, Send, X } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <p className="text-lg font-semibold tracking-[0.25em] text-white">BIBLIODROP</p>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            A polished book delivery platform that connects readers, local libraries, and
            independent book owners in one clear workflow.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/#about" className="transition hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="transition hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
            Newsletter
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Frontend placeholder for launch updates, feature drops, and reading lists.
          </p>
          <div className="mt-4 flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950">
              Join
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
            Social
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-white hover:text-white"
              aria-label="X"
            >
              <X className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-white hover:text-white"
              aria-label="Mail"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-white hover:text-white"
              aria-label="Web"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-white hover:text-white"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 px-4 py-5 text-center text-xs tracking-[0.25em] text-slate-500 sm:px-6 lg:px-8">
        Copyright {new Date().getFullYear()} BiblioDrop. All rights reserved.
      </div>
    </footer>
  );
}
