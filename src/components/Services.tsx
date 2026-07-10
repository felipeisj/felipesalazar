"use client";

import { Cpu, ArrowRight } from "lucide-react";
import Image from "next/image";
import { SERVICES } from "@/lib/data";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-20 border-t border-line bg-paper">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="flex items-center gap-2.5 mb-10">
          <Cpu size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            Servicios y Soluciones
          </h2>
        </Reveal>

        <Reveal group className="grid gap-6 sm:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group relative h-[440px] rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 shadow-md hover:shadow-xl hover:-translate-y-3 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              {/* Accessible link */}
              <a href={service.href} className="absolute inset-0 z-30" aria-label={service.title} />

              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={service.imageSrc}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                />
                {/* Vignette bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/35 z-[1]" />
              </div>

              {/* Color Overlay (slides up and out on hover) */}
              <div
                className="absolute inset-0 z-[2] mix-blend-multiply opacity-75 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full"
                style={{ backgroundColor: service.color }}
              />

              {/* Resting State: Vertical Title */}
              <div className="absolute inset-0 z-[3] flex flex-col items-end justify-end pb-12 pr-6 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0 group-hover:translate-x-4">
                <p
                  className="[writing-mode:vertical-rl] -rotate-180 font-display font-black uppercase tracking-[0.06em] text-[2.2rem] leading-none"
                  style={{
                    WebkitTextFillColor: "transparent",
                    WebkitTextStrokeWidth: "1px",
                    WebkitTextStrokeColor: "white",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
                  }}
                >
                  {service.title}
                </p>
                <ArrowRight size={22} className="mt-4 text-white/80" />
              </div>

              {/* Hover State: Slide up info */}
              <div className="absolute inset-x-0 bottom-0 z-[4] p-5.5 flex flex-col justify-end h-[85%] bg-gradient-to-t from-black via-black/85 to-transparent opacity-0 translate-y-6 transition-all duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-y-0">
                <span className="inline-flex text-[8px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2.5 py-1 rounded-md mb-2.5 w-fit">
                  {service.tag}
                </span>

                <h3 className="font-display font-bold text-sm text-white mb-2 leading-tight">
                  {service.title}
                </h3>

                <p className="text-[10px] text-neutral-300 leading-relaxed mb-4">
                  {service.subtitle}
                </p>

                {/* Features checklist */}
                <ul className="space-y-1.5 border-t border-white/10 pt-3.5 mb-5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[10px] text-neutral-200">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <span className="inline-flex items-center justify-between w-full bg-white hover:bg-accent hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold text-ink transition-colors duration-300">
                  <span>{service.actionText}</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
