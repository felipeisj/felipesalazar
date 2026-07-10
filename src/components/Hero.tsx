"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { Mail } from "lucide-react";
import { PERSONAL } from "@/lib/data";
import { GithubIcon, LinkedinIcon } from "./icons";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-item]",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const WhatsAppIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.025-5.11-2.893-6.98-1.872-1.873-4.36-2.907-6.997-2.908-5.443 0-9.87 4.42-9.874 9.86-.001 1.646.43 3.255 1.249 4.667l-.988 3.606 3.719-.976zm10.165-6.666c-.328-.164-1.942-.958-2.242-1.069-.3-.109-.519-.164-.738.164-.219.328-.848 1.069-1.039 1.288-.19.22-.382.246-.71.082-.328-.164-1.386-.51-2.64-1.627-.975-.87-1.633-1.946-1.825-2.274-.19-.328-.02-.505.145-.668.148-.146.328-.382.492-.574.164-.192.219-.328.328-.547.11-.219.055-.411-.027-.574-.082-.164-.738-1.778-1.012-2.434-.267-.641-.539-.553-.738-.553-.19 0-.41-.009-.629-.009-.219 0-.574.082-.875.411-.3.328-1.147 1.121-1.147 2.736 0 1.614 1.174 3.172 1.338 3.391.164.22 2.313 3.53 5.603 4.954.783.339 1.395.541 1.872.692.786.25 1.5.215 2.066.13.63-.094 1.942-.793 2.216-1.559.273-.766.273-1.422.191-1.559-.082-.137-.3-.22-.628-.383z" />
    </svg>
  );

  return (
    <section id="top" ref={rootRef} className="pt-40 pb-20 md:pt-48 md:pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div data-hero-item className="flex items-center gap-4">
          <span className="relative flex h-36 w-36 shrink-0 overflow-hidden rounded-full ring-2 ring-accent-soft">
            <Image
              src="/avatar2.jpg"
              alt={PERSONAL.name}
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Disponible para nuevos proyectos
          </span>
        </div>

        <h1
          data-hero-item
          className="mt-8 font-display font-semibold text-3xl sm:text-4xl tracking-tight text-balance text-ink"
        >
          Desarrollador de <span className="text-accent">Software a Medida</span> y Apps Móviles.
        </h1>

        <p
          data-hero-item
          className="mt-4 max-w-xl text-base md:text-lg text-ink-soft leading-relaxed"
        >
          Hola, soy {PERSONAL.firstName}. Construyo páginas web y aplicaciones móviles nativas iOS/Android de alto rendimiento para potenciar tu negocio. Sin intermediarios, trato directo.
        </p>

        <div data-hero-item className="mt-7 flex flex-wrap items-center gap-2.5">
          <a
            href={PERSONAL.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm"
          >
            <WhatsAppIcon size={16} />
            Hablemos por WhatsApp
          </a>
          <a
            href={`mailto:${PERSONAL.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors shadow-sm"
          >
            <Mail size={15} />
            Escríbeme un Correo
          </a>
          <a
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink hover:border-accent hover:text-accent transition-colors"
          >
            <LinkedinIcon size={15} />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
