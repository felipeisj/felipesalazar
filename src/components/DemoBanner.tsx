"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Banda que envía a la landing de demos (demos.felipesalazar.cl).
// Mismo dominio raíz => la atribución de Google Ads (gclid) se comparte solo.
export default function DemoBanner() {
  const { language } = useLanguage();
  const es = language === "es";

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-accent px-8 py-14 text-center shadow-xl md:px-16">
        <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          <Sparkles size={12} className="fill-current" />
          {es ? "Demo gratis · Cupos limitados" : "Free demo · Limited slots"}
        </span>

        <h2 className="relative mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl text-balance">
          {es
            ? "Mira tu sitio online antes de pagar nada"
            : "See your website live before paying anything"}
        </h2>

        <p className="relative mx-auto mt-4 max-w-xl text-base text-white/85 md:text-lg">
          {es
            ? "Te armo una demo real de tu negocio, gratis y a tu medida. La revisas con calma y, si te gusta, la terminamos juntos."
            : "I build a real, tailored demo of your business — free. Review it, and if you like it, we finish it together."}
        </p>

        <div className="relative mt-8 flex justify-center">
          <a
            href="https://demos.felipesalazar.cl/solicitar"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-accent shadow-lg transition-transform hover:-translate-y-0.5"
          >
            {es ? "Solicitar mi demo gratis" : "Request my free demo"}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
