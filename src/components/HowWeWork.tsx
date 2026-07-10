import { MessageSquare, Code, Rocket } from "lucide-react";
import Reveal from "./Reveal";

export default function HowWeWork() {
  const steps = [
    {
      icon: MessageSquare,
      step: "01",
      title: "Diagnóstico y Propuesta (Gratis)",
      description: "Nos reunimos por Meet o WhatsApp. Me cuentas tu idea, tus necesidades o el problema de tu negocio, y te entrego un plan de trabajo claro con un presupuesto cerrado sin sorpresas.",
    },
    {
      icon: Code,
      step: "02",
      title: "Desarrollo con Avances Semanales",
      description: "Construyo tu software paso a paso. Cada semana tendrás acceso a un enlace de prueba para que veas el avance real en tu celular o computador. Tú tienes el control y el feedback directo.",
    },
    {
      icon: Rocket,
      step: "03",
      title: "Lanzamiento y Acompañamiento",
      description: "Publicamos tu app en las tiendas o lanzamos tu sitio web. Te enseño a usar el panel autoadministrable y te entrego soporte técnico continuo para asegurar que todo funcione al 100%.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-paper-alt border-t border-b border-line/30">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
            Nuestro Proceso
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-ink">
            Cómo trabajamos en 3 simples pasos
          </h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Sin burocracia ni agencias intermediarias. Un proceso directo, transparente y enfocado en entregar valor rápido a tu negocio.
          </p>
        </Reveal>

        <Reveal group className="grid gap-6 sm:grid-cols-3">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="bg-white border border-line rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <span className="absolute -top-3 -right-2 text-6xl font-black text-ink-faint/10 select-none">
                  {s.step}
                </span>
                <div>
                  <div className="h-10 w-10 rounded-xl bg-accent-soft/30 flex items-center justify-center mb-4 text-accent">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-ink mb-2 leading-snug">
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
    </section>
  );
}
