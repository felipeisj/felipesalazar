"use client";

import { useState } from "react";
import { MessageSquare, Code2, Rocket, Play, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function HowWeWork() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const steps = [
    {
      icon: MessageSquare,
      title: "1. Conversación y Propuesta (Gratis)",
      description: "Nos reunimos por Meet o conversamos por WhatsApp para analizar tu idea. Te entrego una cotización detallada con plazos reales y un precio fijo, sin sorpresas.",
    },
    {
      icon: Code2,
      title: "2. Desarrollo con Avance Semanal",
      description: "No esperas meses para ver resultados. Cada semana tendrás acceso a un enlace de prueba para que pruebes el avance real directamente en tu celular o computador.",
    },
    {
      icon: Rocket,
      title: "3. Despegue y Soporte Continuo",
      description: "Publicamos tu app en las tiendas (App Store/Google Play) o lanzamos tu sitio web. Te enseño a usar el panel autoadministrable y te doy soporte técnico continuo.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-paper-alt border-t border-b border-line/30">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
            El Proceso
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-ink">
            Cómo trabajo en 3 simples pasos
          </h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Sin intermediarios ni burocracia de agencias. Un proceso directo, transparente y enfocado en entregar valor real a tu negocio.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Column 1: Video Player Card (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <Reveal className="w-full">
              <div
                onClick={() => setIsVideoOpen(true)}
                className="group relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-neutral-900 border border-line"
              >
                {/* Video Thumbnail (Felipe at laptop) */}
                <Image
                  src="/avatar3.jpg"
                  alt="Felipe Salazar trabajando"
                  fill
                  className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-500 z-10" />

                {/* Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Play size={22} className="ml-1 text-ink group-hover:text-white transition-colors" fill="currentColor" />
                  </div>
                </div>

                {/* Video Duration / Tag */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide border border-white/10">
                  Ver Video (30 segundos)
                </div>
              </div>

              {/* Video Subtitle */}
              <p className="mt-3.5 text-center text-xs text-ink-soft leading-relaxed italic max-w-[280px] mx-auto">
                "Mira este video corto donde te explico cómo trabajo y cómo aseguro el éxito de tu proyecto."
              </p>
            </Reveal>
          </div>

          {/* Column 2: Vertical Timeline (7 cols) */}
          <div className="md:col-span-7">
            <Reveal group className="relative border-l border-line/60 pl-6 ml-3 space-y-8 py-2">
              {steps.map((s, index) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="relative">
                    {/* Circle timeline connector */}
                    <span className="absolute -left-[35px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-accent shadow-sm">
                      <Icon size={12} />
                    </span>

                    <div>
                      <h4 className="font-display font-bold text-sm text-ink mb-1.5 leading-snug">
                        {s.title}
                      </h4>
                      <p className="text-xs text-ink-soft leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </div>
      </div>

      {/* Video Modal Backdrop */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-neutral-950 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 z-20 text-white/80 hover:text-white bg-black/60 hover:bg-black/80 px-3 py-1.5 rounded-full transition-colors text-xs font-bold border border-white/10"
            >
              ✕ Cerrar
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/_xQkGq0TIC0?autoplay=1"
              title="Metodología de trabajo - Felipe Salazar"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
