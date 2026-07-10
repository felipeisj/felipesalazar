"use client";

import { Cpu, ArrowRight } from "lucide-react";
import Image from "next/image";
import { SERVICES } from "@/lib/data";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-20 border-t border-line bg-paper">
      {/* Desktop Grid (md and up) */}
      <div className="hidden md:block mx-auto max-w-5xl px-6">
        <Reveal className="flex items-center gap-2.5 mb-10">
          <h2 className="font-display font-semibold text-xl tracking-tight">
            Servicios y Soluciones
          </h2>
        </Reveal>

        <Reveal className="overflow-hidden rounded-[32px] border border-line bg-[#0F172A] relative shadow-lg">
          <div className="flex h-[500px] w-full relative divide-x divide-white/10">
            {SERVICES.map((service, index) => (
              <div
                key={service.title}
                className="group relative h-full flex-[1] flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-[750ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[2]"
              >
                {/* Accessible link */}
                <a href={service.href} className="absolute inset-0 z-30" aria-label={service.title} />

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 z-[1]" />
                </div>

                {/* Color Overlay (fades out on hover) */}
                <div
                  className="absolute inset-0 z-[2] mix-blend-multiply opacity-80 transition-opacity duration-[750ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-20"
                  style={{ backgroundColor: service.color }}
                />

                {/* Resting State: Vertical Title & Arrow */}
                <div className="absolute inset-0 z-[3] flex flex-col items-center justify-between py-12 px-4 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0 group-hover:translate-y-4">
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
                <div className="absolute bottom-6 inset-x-6 z-[4] bg-white p-5 rounded-2xl shadow-xl border border-line/40 opacity-0 translate-y-4 transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] delay-100 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="inline-flex text-[8px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2.5 py-0.5 rounded-md mb-2.5 w-fit">
                    {service.tag}
                  </span>

                  <h3 className="font-display font-bold text-sm text-ink mb-1.5 leading-tight">
                    {service.title}
                  </h3>

                  <p className="text-[10px] text-ink-soft leading-relaxed mb-4">
                    {service.subtitle}
                  </p>

                  <span className="inline-flex items-center justify-between w-full bg-paper-alt group-hover:bg-accent group-hover:text-white px-4 py-2 rounded-xl text-[10px] font-bold text-ink transition-colors duration-300">
                    <span>{service.actionText}</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Mobile Stack of Cards */}
      <div className="flex flex-col gap-6 md:hidden px-6">
        <Reveal className="flex items-center gap-2.5 mb-6">
          <Cpu size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            Servicios y Soluciones
          </h2>
        </Reveal>

        <Reveal group className="space-y-6">
          {SERVICES.map((service) => (
            <a
              key={service.title}
              href={service.href}
              className="group flex flex-col bg-white border border-line rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
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
                <h3 className="text-base font-bold text-ink mb-1.5 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-ink-soft text-xs leading-relaxed mb-4">
                  {service.subtitle}
                </p>

                <div className="flex items-center gap-1 text-accent font-bold text-xs">
                  <span>{service.actionText}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
