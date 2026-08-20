"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

// Chile primero (default). Resto ordenado, con scroll en el dropdown.
export const COUNTRIES: Country[] = [
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "BO", name: "Bolivia", dial: "+591", flag: "🇧🇴" },
  { code: "BR", name: "Brasil", dial: "+55", flag: "🇧🇷" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷" },
  { code: "EC", name: "Ecuador", dial: "+593", flag: "🇪🇨" },
  { code: "SV", name: "El Salvador", dial: "+503", flag: "🇸🇻" },
  { code: "ES", name: "España", dial: "+34", flag: "🇪🇸" },
  { code: "US", name: "Estados Unidos", dial: "+1", flag: "🇺🇸" },
  { code: "GT", name: "Guatemala", dial: "+502", flag: "🇬🇹" },
  { code: "HN", name: "Honduras", dial: "+504", flag: "🇭🇳" },
  { code: "MX", name: "México", dial: "+52", flag: "🇲🇽" },
  { code: "NI", name: "Nicaragua", dial: "+505", flag: "🇳🇮" },
  { code: "PA", name: "Panamá", dial: "+507", flag: "🇵🇦" },
  { code: "PY", name: "Paraguay", dial: "+595", flag: "🇵🇾" },
  { code: "PE", name: "Perú", dial: "+51", flag: "🇵🇪" },
  { code: "DO", name: "Rep. Dominicana", dial: "+1", flag: "🇩🇴" },
  { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾" },
  { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪" },
];

function splitNumber(value: string, dial: string): string {
  return value.startsWith(dial) ? value.slice(dial.length).trim() : "";
}

export default function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const number = splitNumber(value, country.dial);

  function emit(c: Country, num: string) {
    onChange(num ? `${c.dial} ${num}` : c.dial);
  }

  return (
    <div className="relative">
      <div className="flex items-stretch overflow-hidden rounded-lg border border-line bg-paper focus-within:border-accent">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 items-center gap-1 border-r border-line px-3 text-sm text-ink hover:bg-paper-alt"
        >
          <span className="text-base leading-none">{country.flag}</span>
          <span className="font-medium">{country.dial}</span>
          <ChevronDown size={14} className="text-ink-soft" />
        </button>
        <input
          type="tel"
          value={number}
          onChange={(e) => emit(country, e.target.value)}
          placeholder="9 1234 5678"
          className="w-full bg-transparent px-3.5 py-2 text-sm text-ink focus:outline-none"
        />
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-72 overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-xl">
            {COUNTRIES.map((c) => (
              <button
                key={c.code + c.dial}
                type="button"
                onClick={() => {
                  setCountry(c);
                  emit(c, number);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-paper ${
                  c.code === country.code ? "bg-accent-soft" : ""
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1 text-left text-ink">{c.name}</span>
                <span className="text-ink-soft">{c.dial}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
