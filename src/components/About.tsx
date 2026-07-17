"use client";

import { UserRound } from "lucide-react";
import { STACK } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function About() {
  const { language, t } = useLanguage();

  return (
    <section id="about" className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="flex items-center gap-2.5">
          <UserRound size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            {t("about.title")}
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 space-y-4 max-w-xl">
          <p className="text-sm md:text-base text-ink-soft leading-relaxed">
            {t("about.paragraph1")}
          </p>
          
          {language === "es" ? (
            <p className="text-sm md:text-base text-ink-soft leading-relaxed">
              Viví y trabajé un año en Australia, así que tengo{" "}
              <span className="font-medium text-ink">inglés C1</span> y fluidez
              para trabajar con clientes internacionales. Si deseas revisar en
              detalle mi trayectoria técnica y laboral completa, puedes ver mi{" "}
              <a
                href="https://cv.felipesalazar.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium hover:underline"
              >
                Portafolio Profesional / CV
              </a>
              .
            </p>
          ) : (
            <p className="text-sm md:text-base text-ink-soft leading-relaxed">
              I lived and worked in Australia for a year, so I have{" "}
              <span className="font-medium text-ink">C1 level English</span> and absolute fluency
              to work with international clients. If you would like to review my full technical and work history in detail, you can check my{" "}
              <a
                href="https://cv.felipesalazar.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium hover:underline"
              >
                Professional Portfolio / CV
              </a>
              .
            </p>
          )}

          {language === "es" ? (
            <p className="text-sm md:text-base text-ink-soft leading-relaxed">
              Además de mis proyectos para clientes, gestiono directamente las
              campañas de Google Ads que promocionan este sitio a través de un
              panel interno propio (<span className="font-medium text-ink">Felipe Salazar</span>)
              que se conecta de forma segura vía OAuth a la API de Google Ads
              para consultar métricas de rendimiento (clics, costo,
              conversiones) de mis propias campañas.
            </p>
          ) : (
            <p className="text-sm md:text-base text-ink-soft leading-relaxed">
              In addition to client projects, I directly manage the
              Google Ads campaigns promoting this site through my own
              internal dashboard (<span className="font-medium text-ink">Felipe Salazar</span>),
              which securely connects via OAuth to the Google Ads API
              to query performance metrics (clicks, cost, conversions)
              for my campaigns.
            </p>
          )}
        </Reveal>

        <Reveal group delay={0.1} className="mt-6 flex flex-wrap gap-1.5">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-paper-alt px-3 py-1 text-xs text-ink-soft"
            >
              {tech}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
