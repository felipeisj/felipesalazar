import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_URL = "https://felipesalazar.dev";
const SITE_TITLE = "Felipe Salazar | Full-Stack Developer & Tech Lead";
const SITE_DESCRIPTION =
  "Ingeniero Civil en Informatica y Tech Lead con 4+ anos de experiencia construyendo productos digitales de punta a punta: apps moviles publicadas en App Store y Play Store, plataformas SaaS con IA y APIs para fintech y ecommerce. React, React Native, Node.js, NestJS y AWS.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Felipe Salazar",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Felipe Salazar",
    "full stack developer",
    "tech lead",
    "React Native developer",
    "Node.js developer",
    "desarrollador full stack chile",
    "AWS",
    "NestJS",
    "portfolio ingeniero de software",
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
