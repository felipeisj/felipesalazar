import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowWeWork from "@/components/HowWeWork";
import { ClientPanel } from "@/components/ClientPanel";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <HowWeWork />
        
        {/* Clientes Section */}
        <section id="clientes" className="py-16 md:py-20 border-t border-line bg-white overflow-hidden">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
                Quiénes confían en nosotros
              </span>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-ink">
                Proyectos entregados y software en producción
              </h2>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                He colaborado con empresas y emprendedores locales en Chile, implementando soluciones que impulsan su operación diaria.
              </p>
            </Reveal>
            <ClientPanel />
          </div>
        </section>

        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
