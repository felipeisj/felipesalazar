import type { Metadata } from "next";
import Link from "next/link";
import { PERSONAL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de Felipe Salazar: qué datos se recopilan, cómo se usan y cómo puedes revocar el acceso a tu cuenta de Google.",
  alternates: { canonical: "/politica-privacidad" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "11 de julio de 2026";

export default function PoliticaPrivacidad() {
  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Link href="/" className="text-sm font-semibold text-accent hover:text-accent-ink transition-colors">
          ← Volver al inicio
        </Link>

        <h1 className="mt-6 font-display font-semibold text-3xl sm:text-4xl tracking-tight text-ink">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-ink-faint">Última actualización: {LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 text-ink-soft leading-relaxed">
          <section>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Quién es el responsable</h2>
            <p>
              Este sitio (<strong className="text-ink">felipesalazar.cl</strong>) y las herramientas asociadas son
              operados por {PERSONAL.name}, consultor de software independiente con domicilio en {PERSONAL.location}.
              Puedes contactarme en cualquier momento escribiendo a{" "}
              <a href={`mailto:${PERSONAL.email}`} className="text-accent hover:text-accent-ink underline underline-offset-2">
                {PERSONAL.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Qué datos se recopilan</h2>
            <p>
              Cuando autorizas el acceso a través de Google (OAuth), esta aplicación puede solicitar acceso de solo
              lectura a datos de tu cuenta de Google Ads, tales como:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-1">
              <li>Identificadores de cuenta y campañas publicitarias.</li>
              <li>Métricas de rendimiento (impresiones, clics, costo, conversiones).</li>
              <li>Palabras clave y su desempeño asociado.</li>
            </ul>
            <p className="mt-3">
              No se solicita acceso a información de pago, contraseñas ni datos personales de terceros almacenados en
              tu cuenta de Google.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">3. Cómo se usan los datos</h2>
            <p>
              Los datos obtenidos se utilizan exclusivamente para generar reportes y análisis de rendimiento de
              campañas dentro de herramientas internas de gestión propia. No se venden, arriendan ni comparten con
              terceros con fines comerciales o publicitarios.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Almacenamiento y retención</h2>
            <p>
              El acceso se realiza mediante llamadas directas a la API de Google Ads en el momento en que se
              solicita un reporte. No se mantiene una copia permanente de tus datos de campañas fuera de lo
              estrictamente necesario para mostrar dicho reporte.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Cómo revocar el acceso</h2>
            <p>
              Puedes revocar el acceso otorgado a esta aplicación en cualquier momento desde la sección{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-ink underline underline-offset-2"
              >
                Permisos de terceros de tu cuenta de Google
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Cambios a esta política</h2>
            <p>
              Esta política puede actualizarse ocasionalmente para reflejar cambios en las herramientas o
              funcionalidades ofrecidas. La fecha de la última actualización se indica en la parte superior de esta
              página.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">7. Contacto</h2>
            <p>
              Ante cualquier duda sobre esta política o el tratamiento de tus datos, escríbeme a{" "}
              <a href={`mailto:${PERSONAL.email}`} className="text-accent hover:text-accent-ink underline underline-offset-2">
                {PERSONAL.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
