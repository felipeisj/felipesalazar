"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Cpu } from "lucide-react";
import { SERVICES } from "@/lib/data";
import Reveal from "./Reveal";

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(index);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="services" className="py-16 md:py-20 border-t border-line/40 bg-white">
      <div className="mx-auto max-w-3xl px-6 mb-12">
        <Reveal className="flex items-center gap-2.5">
          <Cpu size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            Servicios y Soluciones
          </h2>
        </Reveal>
      </div>

      {/* Accordion Container (Wider wrapper for accordion to shine) */}
      <div className="w-full max-w-5xl mx-auto px-6 hidden md:block">
        <Reveal className="w-full overflow-hidden rounded-3xl border border-line bg-[#0F172A] relative shadow-lg">
          <div className="flex h-[520px] w-full relative">
            {SERVICES.map((service, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={service.title}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  className={[
                    "group relative h-full flex flex-col justify-between accordion-panel-transition",
                    isHovered
                      ? "flex-[3.5] bg-white active-panel-shadow z-10 overflow-hidden"
                      : "flex-[1] cursor-pointer bg-[#0F172A] hover:bg-[#1E293B] overflow-hidden",
                    !isHovered && index !== hoveredIndex - 1 && index !== SERVICES.length - 1
                      ? "border-transition"
                      : "border-transition border-transparent-custom",
                  ].join(" ")}
                >
                  {/* Anchor Link Overlay */}
                  <a href={service.href} className="absolute inset-0 z-20" aria-label={service.title} />

                  {/* Inactive State */}
                  <div
                    className={[
                      "absolute inset-0 z-0 inactive-content-transition overflow-hidden",
                      isHovered ? "inactive-content-hidden" : "inactive-content-visible",
                    ].join(" ")}
                  >
                    {/* Blurred background image */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={service.imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 1200px) 30vw, 20vw"
                        className="object-cover inactive-img"
                      />
                      <div className="absolute inset-0 bg-[#0F172A]/85 transition-all duration-500 group-hover:bg-[#0F172A]/70" />
                    </div>

                    {/* Vertical Inactive Title */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-between items-center py-12 px-4">
                      <div className="h-10" />
                      <span
                        className="inactive-text font-display font-bold tracking-[0.25em] text-sm uppercase whitespace-nowrap select-none"
                        style={{ writingMode: "vertical-rl" }}
                      >
                        {service.title}
                      </span>
                      <div className="h-10 w-10 flex items-center justify-center relative">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-500 group-hover:bg-accent/50" />
                      </div>
                    </div>
                  </div>

                  {/* Active State */}
                  <div
                    className={[
                      "absolute inset-0 z-10 flex flex-col justify-between p-8 bg-white active-content-transition",
                      isHovered ? "active-content-visible" : "active-content-hidden",
                    ].join(" ")}
                  >
                    {/* Top: Tag */}
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-paper-alt border border-line text-ink-soft text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        <Sparkles size={10} className="text-accent" />
                        {service.tag}
                      </span>
                    </div>

                    {/* Center: Image */}
                    <div className="relative w-full h-[220px] my-4 overflow-hidden rounded-2xl border border-line/50 shadow-sm">
                      <Image
                        src={service.imageSrc}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1200px) 50vw, 40vw"
                        className="object-cover"
                      />
                    </div>

                    {/* Bottom: Text & CTA */}
                    <div className="flex items-end justify-between gap-6 mt-auto">
                      <div className="flex-grow min-w-0">
                        <h3 className="text-2xl font-bold text-ink mb-1.5 leading-none">
                          {service.title}
                        </h3>
                        <p className="text-ink-soft text-xs leading-relaxed max-w-md">
                          {service.subtitle}
                        </p>
                        {/* Service Features list inside accordion */}
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {service.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-[10px] font-medium bg-paper-alt text-ink-soft border border-line/40 px-2 py-0.5 rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact Button */}
                      <a
                        href={service.href}
                        className="relative z-30 h-11 px-4.5 rounded-full bg-accent text-white hover:bg-accent-ink flex items-center gap-1.5 shrink-0 shadow-md text-xs font-semibold transition-colors duration-300"
                      >
                        <span>{service.actionText}</span>
                        <ArrowRight size={13} />
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
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                <h3 className="text-lg font-bold text-ink mb-1.5 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-ink-soft text-xs leading-relaxed mb-4">
                  {service.subtitle}
                </p>

                {/* Features stack */}
                <div className="flex flex-wrap gap-1.5 mb-5 border-t border-line/45 pt-3.5">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[10px] font-medium bg-paper-alt text-ink-soft border border-line/30 px-2 py-0.5 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

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
