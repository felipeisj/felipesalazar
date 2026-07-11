import { UserRound } from "lucide-react";
import { STACK } from "@/lib/data";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="flex items-center gap-2.5">
          <UserRound size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl tracking-tight">
            Sobre mí
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 space-y-4 max-w-xl">
          <p className="text-sm md:text-base text-ink-soft leading-relaxed">
            Soy Ingeniero Civil en Informática de la Universidad Austral de Chile y llevo más de 4 años
            construyendo productos digitales de punta a punta, desde la
            arquitectura hasta el deploy en producción. Empecé en QA
            automatizando pruebas, y hoy lidero como Tech Lead el desarrollo
            de una app publicada en App Store y Play Store.
          </p>
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
          <p className="text-sm md:text-base text-ink-soft leading-relaxed">
            Además de mis proyectos para clientes, gestiono directamente las
            campañas de Google Ads que promocionan este sitio a través de un
            panel interno propio (<span className="font-medium text-ink">Felipe Salazar</span>)
            que se conecta de forma segura vía OAuth a la API de Google Ads
            para consultar métricas de rendimiento (clics, costo,
            conversiones) de mis propias campañas.
          </p>
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
