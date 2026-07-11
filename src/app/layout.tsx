import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_URL = "https://felipesalazar.cl";
const SITE_TITLE = "Desarrollo de Software a Medida y Apps Móviles | Felipe Salazar";
const SITE_DESCRIPTION =
  "Desarrollo profesional de aplicaciones móviles iOS/Android, sitios web y catálogos de venta a medida en Chile. Trato directo, transparente y sin agencias intermediarias. Cotiza tu proyecto gratis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Felipe Salazar",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Felipe Salazar",
    "desarrollo de software chile",
    "crear aplicacion movil chile",
    "desarrollador react native chile",
    "paginas web a medida chile",
    "desarrollo e-commerce chile",
    "desarrollo de aplicaciones moviles",
    "programador freelance chile",
    "acelerar pagina web lenta",
    "software para empresas chile",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Felipe Salazar",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#16161d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
