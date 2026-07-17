"use client";

import { NAV_LINKS } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function Nav() {
  const { language, setLanguage, t } = useLanguage();

  const getLinkLabel = (href: string) => {
    switch (href) {
      case "#top":
        return t("nav.home");
      case "#services":
        return t("nav.services");
      case "#clientes":
        return t("nav.clients");
      case "#about":
        return t("nav.about");
      case "#contact":
        return t("nav.contact");
      default:
        return "";
    }
  };

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 sm:px-6">
      <nav className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-line bg-white/80 backdrop-blur-md px-1 sm:px-1.5 py-1 sm:py-1.5 shadow-[0_8px_30px_-12px_rgba(22,22,29,0.15)]">
        {NAV_LINKS.map((link) => {
          const label = getLinkLabel(link.href);
          if (!label) return null;
          return (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-2 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs md:text-sm text-ink-soft hover:bg-paper-alt hover:text-ink transition-colors inline-block"
            >
              {label}
            </a>
          );
        })}

        {/* Language Switcher Sliding Toggle */}
        <button
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="relative w-[62px] h-[36px] bg-slate-100 hover:bg-slate-200/80 rounded-full p-[4px] transition-colors duration-300 focus:outline-none flex items-center justify-between px-3 cursor-pointer select-none ml-1.5 border border-line"
          aria-label="Toggle language"
        >
          <span className="text-[14px] select-none opacity-40">🇨🇱</span>
          <span className="text-[14px] select-none opacity-40">🇬🇧</span>
          <div
            className={`absolute left-[4px] top-[4px] w-[28px] h-[28px] bg-white rounded-full shadow-md flex items-center justify-center text-[14px] transition-transform duration-300 ease-in-out ${language === "es" ? "translate-x-0" : "translate-x-[26px]"
              }`}
          >
            {language === "es" ? "🇨🇱" : "🇬🇧"}
          </div>
        </button>
      </nav>
    </header>
  );
}
