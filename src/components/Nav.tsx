"use client";

import { NAV_LINKS } from "@/lib/data";

export default function Nav() {
  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 sm:px-6">
      <nav className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-line bg-white/80 backdrop-blur-md px-1 sm:px-1.5 py-1 sm:py-1.5 shadow-[0_8px_30px_-12px_rgba(22,22,29,0.15)]">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`rounded-full px-2.5 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm text-ink-soft hover:bg-paper-alt hover:text-ink transition-colors ${
              link.label === "Inicio" || link.label === "Sobre mí" ? "hidden sm:inline-block" : "inline-block"
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
