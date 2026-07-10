import { Cpu } from "lucide-react";
import { SERVICES } from "@/lib/data";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="flex items-center gap-2.5">
          <Cpu size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            Servicios y Soluciones
          </h2>
        </Reveal>

        <Reveal group className="mt-8 space-y-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-line bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="font-display font-semibold text-lg text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm text-ink-soft leading-relaxed">
                {service.description}
              </p>

              <div className="mt-4 pt-4 border-t border-line/50">
                <p className="text-[10px] font-bold text-ink-faint uppercase tracking-wider mb-2.5">
                  Capacidades del servicio:
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-paper-alt px-3 py-1 text-xs text-ink-soft border border-line/30"
                    >
                      {feature}
                    </span>
                  ))}
              </div>
            </div>
            </div>
          ))}
    </Reveal>
      </div >
    </section >
  );
}
