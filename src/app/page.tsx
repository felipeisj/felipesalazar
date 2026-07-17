"use client";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowWeWork from "@/components/HowWeWork";
import { ClientPanel } from "@/components/ClientPanel";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

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
                {t("clients.label")}
              </span>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-ink">
                {t("clients.title")}
              </h2>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                {t("clients.subtitle")}
              </p>
            </Reveal>
            <ClientPanel />
          </div>
        </section>

        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
