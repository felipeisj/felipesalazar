"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Sparkles, Cpu, CheckCircle2, ArrowLeft, Clock, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Reveal from "@/components/Reveal";

// Curated Canva-style Color Palettes for the mockup selection
const COLOR_PALETTES = [
  {
    id: "tech-cool",
    name: { es: "Tech Cool (Azul Corporativo)", en: "Tech Cool (Corporate Blue)" },
    desc: { es: "Ideal para software, tecnología y servicios profesionales.", en: "Perfect for software, tech, and professional services." },
    colors: ["#0F172A", "#2563EB", "#38BDF8", "#F8FAFC"],
    label: "Tech Cool"
  },
  {
    id: "dark-luxury",
    name: { es: "Dark Luxury (Oscuro Premium)", en: "Dark Luxury (Premium Dark)" },
    desc: { es: "Elegante y exclusivo. Excelente para gastronomía de autor y marcas premium.", en: "Elegant and exclusive. Great for gourmet dining and high-end brands." },
    colors: ["#18181B", "#D97706", "#F59E0B", "#FAFAFA"],
    label: "Dark Luxury"
  },
  {
    id: "minimal-earth",
    name: { es: "Minimalist Earth (Tonos Tierra)", en: "Minimalist Earth (Earthy Tones)" },
    desc: { es: "Cálido y orgánico. Recomendado para decoración, bienestar y artesanías.", en: "Warm and organic. Recommended for home decor, wellness, and crafts." },
    colors: ["#FAF9F6", "#854D0E", "#606F49", "#E4E1D8"],
    label: "Minimalist Earth"
  },
  {
    id: "vibrant-creative",
    name: { es: "Vibrant Creative (Energía Creativa)", en: "Vibrant Creative (Creative Brights)" },
    desc: { es: "Llamativo y moderno. Perfecto para agencias, moda y tiendas dinámicas.", en: "Catchy and modern. Perfect for creative agencies, fashion, and shop sites." },
    colors: ["#4F46E5", "#EC4899", "#F59E0B", "#F3F4F6"],
    label: "Vibrant Creative"
  },
  {
    id: "fresh-mint",
    name: { es: "Fresh Mint (Eco Verde)", en: "Fresh Mint (Eco Green)" },
    desc: { es: "Fresco y natural. Ideal para productos saludables y sustentabilidad.", en: "Fresh and natural. Ideal for healthy foods, organic products, and sustainability." },
    colors: ["#064E3B", "#10B981", "#A7F3D0", "#ECFDF5"],
    label: "Fresh Mint"
  }
];

export default function WaitlistPage() {
  const { language, setLanguage, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessSector: "",
    currentWebsite: "",
    valueProposition: "",
    keyServices: "",
    targetAudience: "",
    webGoal: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [selectedPalette, setSelectedPalette] = useState("tech-cool");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [slotsCount, setSlotsCount] = useState(3);

  // Dynamic slot counter with localStorage persistence to prevent resets on reload
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem("waitlist_date");
    const savedCount = localStorage.getItem("waitlist_slots");

    if (savedDate === todayStr && savedCount !== null) {
      setSlotsCount(Number(savedCount));
    } else {
      // Calculate initial slots based on current hour
      const currentHour = new Date().getHours();
      let remaining = 10;
      if (currentHour >= 8 && currentHour < 10) remaining = 9;
      else if (currentHour >= 10 && currentHour < 12) remaining = 7;
      else if (currentHour >= 12 && currentHour < 14) remaining = 6;
      else if (currentHour >= 14 && currentHour < 16) remaining = 5;
      else if (currentHour >= 16 && currentHour < 18) remaining = 4;
      else if (currentHour >= 18 && currentHour < 21) remaining = 2;
      else if (currentHour >= 21) remaining = 1;
      
      setSlotsCount(remaining);
      localStorage.setItem("waitlist_date", todayStr);
      localStorage.setItem("waitlist_slots", remaining.toString());
    }
  }, []);

  const trackConversion = (label: string | undefined) => {
    if (!label || label.includes("AQUÍ")) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: `AW-17500708468/${label}`,
      });
    }
  };

  const handleNextStep = () => {
    // Validation per step
    if (step === 1) {
      if (!formData.businessName || !formData.businessSector) {
        alert(language === "es" ? "Por favor completa los campos obligatorios (*)" : "Please fill out required fields (*)");
        return;
      }
    } else if (step === 2) {
      if (!formData.valueProposition || !formData.keyServices || !formData.targetAudience || !formData.webGoal) {
        alert(language === "es" ? "Por favor responde todas las preguntas del paso 2 (*)" : "Please answer all questions in step 2 (*)");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.contactName || !formData.contactEmail || !formData.contactPhone) {
      alert(language === "es" ? "Por favor completa la información de contacto (*)" : "Please fill out contact details (*)");
      return;
    }

    setStatus("loading");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey.includes("AQUÍ")) {
      console.warn("Falta configurar NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY en .env.local");
      setStatus("error");
      return;
    }

    const paletteName = COLOR_PALETTES.find(p => p.id === selectedPalette)?.label || selectedPalette;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Nuevo Lead Demo: ${formData.contactName} - ${formData.businessName}`,
          from_name: "Felipe Servicios Portafolio",
          
          // Google Ads lead parser fields
          name: formData.contactName,
          email: formData.contactEmail,
          whatsapp: formData.contactPhone,
          
          // Structured Prompt-Ready fields for Felipe / Agent
          "Nombre de la Empresa": formData.businessName,
          "Rubro Comercial": formData.businessSector,
          "Sitio Web Actual": formData.currentWebsite || "Ninguno",
          "Propuesta de Valor (Eslogan)": formData.valueProposition,
          "Servicios o Productos Principales": formData.keyServices,
          "Publico Objetivo": formData.targetAudience,
          "Objetivo Principal Web (Conversion)": formData.webGoal,
          "Paleta de Colores Elegida": paletteName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        // Track conversion in Google Ads
        trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL);
        
        // Decrement slots count and persist to localStorage
        setSlotsCount((prev) => {
          const nextCount = Math.max(0, prev - 1);
          localStorage.setItem("waitlist_slots", nextCount.toString());
          return nextCount;
        });

        // Reset form
        setFormData({
          businessName: "",
          businessSector: "",
          currentWebsite: "",
          valueProposition: "",
          keyServices: "",
          targetAudience: "",
          webGoal: "",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between overflow-x-hidden relative">
      {/* Soft Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-ink transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {language === "es" ? "Volver al inicio" : "Back to home"}
        </Link>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="relative w-[62px] h-[36px] bg-white hover:bg-slate-50 rounded-full p-[4px] transition-colors duration-300 focus:outline-none flex items-center justify-between px-3 cursor-pointer select-none border border-line shadow-sm"
          aria-label="Toggle language"
        >
          <span className="text-[14px] select-none opacity-40">🇨🇱</span>
          <span className="text-[14px] select-none opacity-40">🇬🇧</span>
          <div
            className={`absolute left-[4px] top-[4px] w-[28px] h-[28px] bg-paper rounded-full shadow-md flex items-center justify-center text-[14px] transition-transform duration-300 ease-in-out ${
              language === "es" ? "translate-x-0" : "translate-x-[26px]"
            }`}
          >
            {language === "es" ? "🇨🇱" : "🇬🇧"}
          </div>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        
        {/* Left Side: Copy and Steps */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent-ink text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={12} className="fill-current text-accent-ink" />
              {language === "es" ? "Propuesta Web Gratis" : "Free Web Proposal"}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink leading-[1.1] text-balance">
              {t("waitlist.title")}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-4 text-sm md:text-base text-ink-soft leading-relaxed">
              {t("waitlist.subtitle")}
            </p>
          </Reveal>

          {/* Operational Capacity Widget */}
          <Reveal delay={0.15} className="mt-8 bg-white rounded-2xl border border-line p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-ink">{t("waitlist.capacityTitle")}</h3>
                <p className="text-xs text-ink-soft">{t("waitlist.capacitySubtitle")}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink-soft flex items-center gap-1">
                  <Clock size={12} className="text-accent" />
                  {t("waitlist.slotsAvailable")}
                </span>
                <span className="font-bold text-accent">{slotsCount} / 10</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-accent h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(slotsCount / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-ink-faint italic">
                {slotsCount > 0 
                  ? t("waitlist.slotsRemaining").replace("{count}", slotsCount.toString()) 
                  : t("waitlist.slotsEmpty")
                }
              </p>
            </div>
          </Reveal>

          {/* Stepper Process */}
          <div className="mt-8 space-y-5">
            <Reveal delay={0.2} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 transition-colors ${
                  step > 1 ? "bg-emerald-500 text-white border-emerald-500" : step === 1 ? "bg-accent-soft text-accent-ink border-accent/20" : "bg-white text-ink-faint border-line"
                }`}>
                  {step > 1 ? <Check size={12} /> : "1"}
                </div>
                <div className="w-[1px] bg-line flex-grow my-2" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-ink">{t("waitlist.step1Title")}</h4>
                <p className="text-xs text-ink-soft mt-1">{t("waitlist.step1Desc")}</p>
              </div>
            </Reveal>

            <Reveal delay={0.25} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 transition-colors ${
                  step > 2 ? "bg-emerald-500 text-white border-emerald-500" : step === 2 ? "bg-accent-soft text-accent-ink border-accent/20" : "bg-white text-ink-faint border-line"
                }`}>
                  {step > 2 ? <Check size={12} /> : "2"}
                </div>
                <div className="w-[1px] bg-line flex-grow my-2" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-ink">{t("waitlist.step2Title")}</h4>
                <p className="text-xs text-ink-soft mt-1">{t("waitlist.step2Desc")}</p>
              </div>
            </Reveal>

            <Reveal delay={0.28} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 transition-colors ${
                  step > 3 ? "bg-emerald-500 text-white border-emerald-500" : step === 3 ? "bg-accent-soft text-accent-ink border-accent/20" : "bg-white text-ink-faint border-line"
                }`}>
                  {step > 3 ? <Check size={12} /> : "3"}
                </div>
                <div className="w-[1px] bg-line flex-grow my-2" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-ink">{t("waitlist.step3Title")}</h4>
                <p className="text-xs text-ink-soft mt-1">{t("waitlist.step3Desc")}</p>
              </div>
            </Reveal>

            <Reveal delay={0.3} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 transition-colors ${
                  status === "success" ? "bg-emerald-500 text-white border-emerald-500" : step === 4 ? "bg-accent-soft text-accent-ink border-accent/20" : "bg-white text-ink-faint border-line"
                }`}>
                  {status === "success" ? <Check size={12} /> : "4"}
                </div>
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-ink">{t("waitlist.step4Title")}</h4>
                <p className="text-xs text-ink-soft mt-1">{t("waitlist.step4Desc")}</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Right Side: The Interactive Step-by-Step Form */}
        <div className="lg:col-span-7 w-full">
          <Reveal delay={0.2} className="bg-white rounded-3xl border border-line p-6 sm:p-8 shadow-md transition-all duration-300">
            {status === "success" ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5 border border-emerald-100 shadow-inner animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="font-display font-bold text-xl text-ink">
                  {language === "es" ? "¡Cupo Reservado!" : "Slot Reserved!"}
                </h2>
                <p className="mt-3 text-sm text-ink-soft max-w-sm mx-auto leading-relaxed">
                  {t("waitlist.successMessage")}
                </p>
                <Link href="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-ink text-paper px-6 py-2.5 text-xs font-semibold hover:bg-accent transition-colors shadow-sm">
                  {language === "es" ? "Volver al inicio" : "Back to Home"}
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Step Indicator Top Bar */}
                <div className="flex justify-between items-center border-b border-line pb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">
                      {step === 1 && (language === "es" ? "Paso 1: Tu Negocio" : "Step 1: Your Business")}
                      {step === 2 && (language === "es" ? "Paso 2: Estructura de la Web" : "Step 2: Web Structure")}
                      {step === 3 && (language === "es" ? "Paso 3: Estilo Visual" : "Step 3: Visual Style")}
                      {step === 4 && (language === "es" ? "Paso 4: Contacto" : "Step 4: Contact Info")}
                    </h3>
                    <p className="text-xs text-ink-soft mt-0.5">
                      {step === 1 && (language === "es" ? "Ingresa la información comercial básica." : "Enter basic commercial information.")}
                      {step === 2 && (language === "es" ? "Define las bases de contenido para entrenar al agente." : "Define content basics to prompt the generator agent.")}
                      {step === 3 && (language === "es" ? "Selecciona el esquema de colores de Canva que te guste." : "Select the Canva color scheme you like.")}
                      {step === 4 && (language === "es" ? "Déjanos tus datos para enviarte la propuesta." : "Leave your details so we can send the proposal.")}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-paper-alt border border-line rounded-full text-ink-soft">
                    {t("waitlist.stepIndicator").replace("{current}", step.toString()).replace("{total}", "4")}
                  </span>
                </div>

                {/* Form fields based on Active Step */}
                <div className="min-h-[300px]">
                  
                  {/* STEP 1: Basic Business Info */}
                  {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label htmlFor="businessName" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldName")}
                        </label>
                        <input
                          type="text"
                          id="businessName"
                          required
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          placeholder={t("waitlist.placeholderName")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="businessSector" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldSector")}
                        </label>
                        <input
                          type="text"
                          id="businessSector"
                          required
                          value={formData.businessSector}
                          onChange={(e) => setFormData({ ...formData, businessSector: e.target.value })}
                          placeholder={t("waitlist.placeholderSector")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="currentWebsite" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldWebsite")}
                        </label>
                        <input
                          type="text"
                          id="currentWebsite"
                          value={formData.currentWebsite}
                          onChange={(e) => setFormData({ ...formData, currentWebsite: e.target.value })}
                          placeholder={t("waitlist.placeholderWebsite")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Specific Business Brief / Prompt-ready questions */}
                  {step === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label htmlFor="valueProposition" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldValueProp")}
                        </label>
                        <input
                          type="text"
                          id="valueProposition"
                          required
                          value={formData.valueProposition}
                          onChange={(e) => setFormData({ ...formData, valueProposition: e.target.value })}
                          placeholder={t("waitlist.placeholderValueProp")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="keyServices" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldKeyServices")}
                        </label>
                        <textarea
                          id="keyServices"
                          required
                          rows={3}
                          value={formData.keyServices}
                          onChange={(e) => setFormData({ ...formData, keyServices: e.target.value })}
                          placeholder={t("waitlist.placeholderKeyServices")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label htmlFor="targetAudience" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldTargetAudience")}
                        </label>
                        <textarea
                          id="targetAudience"
                          required
                          rows={2}
                          value={formData.targetAudience}
                          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                          placeholder={t("waitlist.placeholderTargetAudience")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label htmlFor="webGoal" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldWebGoal")}
                        </label>
                        <textarea
                          id="webGoal"
                          required
                          rows={2}
                          value={formData.webGoal}
                          onChange={(e) => setFormData({ ...formData, webGoal: e.target.value })}
                          placeholder={t("waitlist.placeholderWebGoal")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Visual Color Palette Selection */}
                  {step === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                        {t("waitlist.fieldPalette")}
                      </label>
                      <div className="grid grid-cols-1 gap-3.5 mt-2">
                        {COLOR_PALETTES.map((palette) => (
                          <div
                            key={palette.id}
                            onClick={() => setSelectedPalette(palette.id)}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-accent/40 ${
                              selectedPalette === palette.id 
                                ? "border-accent bg-accent/5" 
                                : "border-line bg-paper"
                            }`}
                          >
                            <div className="flex-1 pr-4">
                              <h4 className="font-display font-bold text-sm text-ink">
                                {language === "es" ? palette.name.es : palette.name.en}
                              </h4>
                              <p className="text-xs text-ink-soft mt-1">
                                {language === "es" ? palette.desc.es : palette.desc.en}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1.5 mt-3 sm:mt-0 shrink-0">
                              {palette.colors.map((color, index) => (
                                <span 
                                  key={index} 
                                  className="w-6 h-6 rounded-full border border-line shadow-sm block"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Contact Info & Review */}
                  {step === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label htmlFor="contactName" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                          {t("waitlist.fieldContactName")}
                        </label>
                        <input
                          type="text"
                          id="contactName"
                          required
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          placeholder={t("waitlist.placeholderContactName")}
                          className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contactEmail" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                            {t("waitlist.fieldContactEmail")}
                          </label>
                          <input
                            type="email"
                            id="contactEmail"
                            required
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            placeholder={t("waitlist.placeholderContactEmail")}
                            className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="contactPhone" className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                            {t("waitlist.fieldContactPhone")}
                          </label>
                          <input
                            type="tel"
                            id="contactPhone"
                            required
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            placeholder={t("waitlist.placeholderContactPhone")}
                            className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>

                      <div className="bg-paper border border-line rounded-xl p-4 mt-6">
                        <h4 className="text-xs font-bold text-ink mb-1">
                          {language === "es" ? "Resumen de tu solicitud" : "Request Summary"}
                        </h4>
                        <ul className="text-xs text-ink-soft space-y-1 mt-2">
                          <li><strong>{language === "es" ? "Negocio:" : "Business:"}</strong> {formData.businessName || "—"}</li>
                          <li><strong>{language === "es" ? "Estilo de Paleta:" : "Palette Style:"}</strong> {COLOR_PALETTES.find(p => p.id === selectedPalette)?.label}</li>
                          <li><strong>{language === "es" ? "Nombre de Contacto:" : "Contact Name:"}</strong> {formData.contactName || "—"}</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Navigation Buttons */}
                <div className="flex items-center justify-between border-t border-line pt-5 mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white hover:bg-slate-50 text-ink px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer select-none"
                    >
                      <ArrowLeft size={14} />
                      {t("waitlist.backButton")}
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink text-paper hover:bg-accent hover:text-white px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer select-none ml-auto"
                    >
                      {t("waitlist.nextButton")}
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={status === "loading" || slotsCount === 0}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-white hover:bg-accent-ink px-6 py-2.5 text-xs font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ml-auto"
                    >
                      {status === "loading" ? (
                        t("waitlist.submittingButton")
                      ) : (
                        <>
                          {t("waitlist.submitButton")}
                          <Send size={12} />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {status === "error" && (
                  <p className="text-center text-xs font-medium text-rose-600 mt-2">
                    {t("waitlist.errorMessage")}
                  </p>
                )}
              </div>
            )}
          </Reveal>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full border-t border-line bg-paper py-6 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-faint gap-3">
          <p>© {new Date().getFullYear()} Felipe Salazar. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-accent transition-colors">
              {language === "es" ? "Inicio" : "Home"}
            </Link>
            <Link href="/politica-privacidad" className="hover:text-accent transition-colors">
              {language === "es" ? "Política de Privacidad" : "Privacy Policy"}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
