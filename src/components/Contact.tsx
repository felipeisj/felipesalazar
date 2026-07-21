"use client";

import { useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import { PERSONAL } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    budget: "Web Autoadmin. ($400k)",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const trackConversion = (label: string | undefined) => {
    if (!label || label.includes("AQUÍ")) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: `AW-17500708468/${label}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey.includes("AQUÍ")) {
      console.warn("Falta configurar NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY en .env.local");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Nuevo Lead: ${formData.name} - Presupuesto: ${formData.budget}`,
          from_name: "Felipe Servicios Portafolio",
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        // Registrar conversión en Google Ads al enviar formulario exitosamente
        trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL);
        setFormData({
          name: "",
          email: "",
          whatsapp: "",
          budget: "Web Autoadmin. ($400k)",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-line bg-paper">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Columna Izquierda: Información de contacto directo */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <Reveal className="flex items-center gap-2.5">
              <MessageCircle size={18} className="text-accent" />
              <h2 className="font-display font-semibold text-2xl tracking-tight text-ink">
                {t("contact.formTitle")}
              </h2>
            </Reveal>

            <Reveal delay={0.05} className="mt-4">
              <p className="text-sm md:text-base text-ink-soft leading-relaxed">
                {t("contact.formSubtitle")}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 flex flex-col gap-3">
              <a
                href={PERSONAL.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL)}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] px-6 py-3 text-sm font-semibold transition-colors shadow-sm w-full sm:w-auto"
              >
                <MessageCircle size={16} className="fill-current" />
                {t("contact.whatsappCTA")}
              </a>
              <a
                href={`mailto:${PERSONAL.email}?subject=Cotizaci%C3%B3n%20de%20Proyecto%20Web%20/%20App`}
                onClick={() => trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_EMAIL_CONVERSION_LABEL)}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-accent transition-colors shadow-sm w-full sm:w-auto"
              >
                <Mail size={16} />
                {t("contact.emailCTA")}
              </a>
            </Reveal>
          </div>

          {/* Columna Derecha: Formulario calificado */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15} className="bg-white rounded-2xl border border-line p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                      {t("contact.fieldName")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t("contact.placeholderName")}
                      className="w-full rounded-lg border border-line px-3.5 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                      {t("contact.fieldEmail")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t("contact.placeholderEmail")}
                      className="w-full rounded-lg border border-line px-3.5 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="whatsapp" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                      {t("contact.fieldPhone")}
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder={t("contact.placeholderPhone")}
                      className="w-full rounded-lg border border-line px-3.5 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                      {t("contact.fieldBudget")}
                    </label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full rounded-lg border border-line pl-3 pr-6 py-2 text-[13px] md:text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors cursor-pointer"
                    >
                      <option value="Web Autoadmin. ($400k)">{t("contact.budgetOption1")}</option>
                      <option value="E-Commerce / Tienda ($1M)">{t("contact.budgetOption2")}</option>
                      <option value="App / Sistema a medida">{t("contact.budgetOption3")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                    {t("contact.fieldMessage")}
                    </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t("contact.placeholderMessage")}
                    className="w-full rounded-lg border border-line px-3.5 py-2 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-paper px-4 py-3 text-sm font-semibold hover:bg-accent transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "loading" ? (
                    t("contact.submittingButton")
                  ) : (
                    <>
                      {t("contact.submitButton")}
                      <Send size={14} />
                    </>
                  )}
                </button>

                {status === "success" && (
                  <p className="text-center text-xs font-medium text-emerald-600 mt-2">
                    {t("contact.successMessage")}
                  </p>
                )}
                {status === "error" && (
                  <p className="text-center text-xs font-medium text-rose-600 mt-2">
                    {t("contact.errorMessage")}
                  </p>
                )}
              </form>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
