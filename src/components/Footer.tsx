"use client";

import { PERSONAL } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto max-w-3xl px-6 text-center text-sm text-ink-faint">
        <p>
          © {new Date().getFullYear()} {PERSONAL.name}. {t("footer.location")}.
        </p>
      </div>
    </footer>
  );
}
