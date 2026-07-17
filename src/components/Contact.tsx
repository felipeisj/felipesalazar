"use client";

import { Mail, MessageCircle } from "lucide-react";
import { PERSONAL } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Contact() {
  const { t } = useLanguage();

  const trackConversion = (label: string | undefined) => {
    if (!label || label.includes("AQUÍ")) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: `AW-17500708468/${label}`,
      });
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="flex items-center gap-2.5">
          <MessageCircle size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            {t("contact.title")}
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-5 flex flex-wrap items-center gap-2.5">
          <p className="text-sm md:text-base text-ink-soft mr-2">
            {t("contact.text")}
          </p>
          <a
            href={PERSONAL.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL)}
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] px-4 py-2 text-sm font-semibold transition-colors shadow-sm"
          >
            <MessageCircle size={15} className="fill-current" />
            {t("contact.whatsapp")}
          </a>
          <a
            href={`mailto:${PERSONAL.email}`}
            onClick={() => trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_EMAIL_CONVERSION_LABEL)}
            className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-accent transition-colors shadow-sm"
          >
            <Mail size={15} />
            {t("contact.email")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
