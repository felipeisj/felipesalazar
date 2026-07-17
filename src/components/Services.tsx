"use client";

import { useState } from "react";
import { Cpu, ArrowRight } from "lucide-react";
import Image from "next/image";
import { SERVICES, PERSONAL } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { t } = useLanguage();

  const translatedServices = t("services.items") as any[];
  const mergedServices = SERVICES.map((staticService, idx) => {
    const translated = translatedServices[idx] || {};
    return {
      ...staticService,
      title: translated.title || staticService.title,
      subtitle: translated.subtitle || staticService.subtitle,
      tag: translated.tag || staticService.tag,
      actionText: translated.actionText || staticService.actionText,
      features: translated.features || staticService.features,
      whatsappMessage: translated.whatsappMessage || "",
    };
  });

  const getWhatsappUrl = (service: typeof mergedServices[0]) => {
    const baseUrl = PERSONAL.whatsapp || "https://wa.me/56949290943";
    return `${baseUrl}?text=${encodeURIComponent(service.whatsappMessage)}`;
  };

  return (
    <section id="services" className="py-16 md:py-20 border-t border-line bg-paper">
      {/* Desktop Grid (md and up) */}
      <div className="hidden md:block mx-auto max-w-5xl px-6">
        <Reveal className="flex items-center gap-2.5 mb-10">
          <h2 className="font-display font-semibold text-xl tracking-tight">
            {t("services.label")}
          </h2>
        </Reveal>

        <Reveal className="overflow-hidden rounded-[32px] border border-line bg-[#0F172A] relative shadow-lg">
          <div
            className="flex h-[500px] w-full relative divide-x divide-white/10"
            onMouseLeave={() => setActiveIndex(0)}
          >
            {mergedServices.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={service.title}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`group relative h-full flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-[750ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "flex-[2]" : "flex-[0.5]"
                    }`}
                >
                  {/* Accessible link (inactive parts scroll to contact, active button triggers whatsapp) */}
                  <a href="#contact" className="absolute inset-0 z-30" aria-label={service.title} />

                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={service.imageSrc}
                      alt={service.title}
                      fill
                      sizes="33vw"
                      className={`object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "scale-105" : "scale-100"
                        }`}
                    />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 z-[1]" />
                  </div>

                  {/* Color Overlay (fades out on hover) */}
                  <div
                    className={`absolute inset-0 z-[2] mix-blend-multiply transition-opacity duration-[750ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "opacity-20" : "opacity-80"
                      }`}
                    style={{ backgroundColor: service.color }}
                  />

                  {/* Resting State: Vertical Title & Arrow */}
                  <div
                    className={`absolute inset-0 z-[3] flex flex-col items-center justify-between py-12 px-4 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
                      }`}
                  >
                    <div className="h-6" />
                    <p
                      className="[writing-mode:vertical-rl] -rotate-180 font-display font-black uppercase tracking-[0.25em] text-lg leading-none text-white/90 select-none"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                      }}
                    >
                      {service.title}
                    </p>
                    <ArrowRight size={20} className="text-white/60" />
                  </div>

                  {/* Hover State: Glassmorphic/White Bottom Card */}
                  <div
                    className={`absolute bottom-6 inset-x-6 z-[4] bg-white p-5 rounded-2xl shadow-xl border border-line/40 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                      }`}
                  >
                    <span className="inline-flex text-[8px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2.5 py-0.5 rounded-md mb-2.5 w-fit">
                      {service.tag}
                    </span>

                    <h3 className="font-display font-bold text-sm text-ink mb-1.5 leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-[10px] text-ink-soft leading-relaxed">
                      {service.subtitle}
                    </p>

                    {/* Shorter button, aligned to the right, pointing to WhatsApp with context */}
                    <div className="flex justify-end mt-4">
                      <a
                        href={getWhatsappUrl(service)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-xl text-[10px] font-bold transition-all shadow-sm z-40 relative hover:scale-[1.03]"
                      >
                        <span>{service.actionText}</span>
                        <ArrowRight size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Mobile Stack of Cards */}
      <div className="flex flex-col gap-6 md:hidden px-6">
        <Reveal className="flex items-center gap-2.5 mb-6">
          <Cpu size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            {t("services.label")}
          </h2>
        </Reveal>

        <Reveal group className="space-y-6">
          {mergedServices.map((service) => (
            <div
              key={service.title}
              className="flex flex-col bg-white border border-line rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 w-full">
                <Image
                  src={service.imageSrc}
                  alt={service.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-white/90 border border-line text-ink-soft text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {service.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-base font-bold text-ink mb-1.5">
                  {service.title}
                </h3>
                <p className="text-ink-soft text-xs leading-relaxed mb-5">
                  {service.subtitle}
                </p>

                <a
                  href={getWhatsappUrl(service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm w-fit"
                >
                  <span>{service.actionText}</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
