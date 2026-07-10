"use client";

import { Cpu, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/data";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-20 border-t border-line bg-white">
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
              className="group relative bg-white border border-line rounded-2xl p-5 flex flex-col justify-between hover:border-accent hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div>
                {/* Tag/Category */}
                <span className="inline-flex text-[9px] font-bold uppercase tracking-wider text-accent bg-accent-soft px-2.5 py-1 rounded-md mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  {service.tag}
                </span>

                {/* Title */}
                <h3 className="font-display font-bold text-sm text-ink mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-ink-soft leading-relaxed mb-4">
                  {service.subtitle}
                </p>

                {/* Features checklist */}
                <ul className="space-y-2 border-t border-line/50 pt-4 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[10px] text-ink-soft">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <a
                href={service.href}
                className="inline-flex items-center justify-between w-full bg-paper-alt group-hover:bg-accent group-hover:text-white border border-line/40 group-hover:border-transparent px-4 py-2 rounded-xl text-[11px] font-semibold text-ink transition-all duration-300"
              >
                <span>{service.actionText}</span>
                <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
