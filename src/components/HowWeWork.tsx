"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Code2, Rocket, Play } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function HowWeWork() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { t } = useLanguage();

  // Close modal when pressing the Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVideoOpen(false);
      }
    };

    if (isVideoOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isVideoOpen]);

  const stepsData = t("process.steps") as any[];
  const icons = [MessageSquare, Code2, Rocket];
  const steps = stepsData.map((s, index) => ({
    icon: icons[index] || Code2,
    title: s.title,
    description: s.description,
  }));

  return (
    <section className="py-16 md:py-20 bg-paper-alt border-t border-b border-line/30">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
            {t("process.label")}
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-ink">
            {t("process.title")}
          </h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            {t("process.subtitle")}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Column 1: Video Player Card (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <Reveal className="w-full">
              <div
                onClick={() => setIsVideoOpen(true)}
                className="group relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-neutral-900 border border-line"
              >
                {/* Video Thumbnail (Felipe at laptop) */}
                <Image
                  src="/avatar3.jpg"
                  alt="Felipe Salazar trabajando"
                  fill
                  className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-500 z-10" />

                {/* Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Play size={22} className="ml-1 text-ink group-hover:text-white transition-colors" fill="currentColor" />
                  </div>
                </div>

                {/* Video Duration / Tag */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide border border-white/10">
                  {t("process.videoCTA")}
                </div>
              </div>

              {/* Video Subtitle */}
              <p className="mt-3.5 text-center text-xs text-ink-soft leading-relaxed italic max-w-[280px] mx-auto">
                {t("process.videoSubtitle")}
              </p>
            </Reveal>
          </div>

          {/* Column 2: Vertical Timeline (7 cols) */}
          <div className="md:col-span-7">
            <Reveal group className="relative border-l border-line/60 pl-6 ml-3 space-y-8 py-2">
              {steps.map((s, index) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="relative">
                    {/* Circle timeline connector */}
                    <span className="absolute -left-[35px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-accent shadow-sm">
                      <Icon size={12} />
                    </span>

                    <div>
                      <h4 className="font-display font-bold text-sm text-ink mb-1.5 leading-snug">
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
        </div>
      </div>

      {/* Video Modal Backdrop */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-neutral-950 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 z-20 text-white/80 hover:text-white bg-black/60 hover:bg-black/80 px-3 py-1.5 rounded-full transition-colors text-xs font-bold border border-white/10"
            >
              {t("process.videoClose")}
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/LAahQt5-eTA?si=3l-W6R4m9zYwSg6I&autoplay=1&cc_load_policy=0"
              title="Metodología de trabajo - Felipe Salazar"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
