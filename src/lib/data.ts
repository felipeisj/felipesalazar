export const PERSONAL = {
  name: "Felipe Salazar",
  firstName: "Felipe",
  role: "Consultor de Software & Desarrollador Senior",
  email: "felipeslzar@gmail.com",
  whatsapp: "https://wa.me/56944772430",
  github: "https://github.com/felipeisj",
  linkedin: "https://www.linkedin.com/in/felipe-salazar-jimenez/",
  location: "Chile · Remoto",
};

export const NAV_LINKS = [
  { label: "Servicios", href: "#services" },
  { label: "Clientes", href: "#clientes" },
  { label: "Proyectos", href: "#work" },
  { label: "Sobre mí", href: "#about" },
  { label: "Contacto", href: "#contact" },
];

export const SERVICES = [
  {
    title: "Aplicaciones Móviles (iOS & Android)",
    description: "Desarrollamos una sola aplicación móvil que funciona tanto en iPhones como en teléfonos Android. Esto te ahorra tiempo y dinero en desarrollo, permitiéndote llegar a todos tus clientes con el doble de rapidez.",
    features: [
      "Funciona sin Internet (guarda datos localmente)",
      "Envío de notificaciones (alertas a tus usuarios)",
      "Ubicación en mapa (GPS en tiempo real)",
      "Botón de pago directo y seguro"
    ]
  },
  {
    title: "Sitios Web y Catálogos de Venta a Medida",
    description: "Creamos sitios web y sistemas de venta rápidos y fáciles de usar, adaptados exactamente a tu negocio. Nada de plantillas lentas o sistemas difíciles: tú tienes el control absoluto de tus productos y precios.",
    features: [
      "Panel para cambiar precios y stock al instante",
      "Conexión con pasarelas de pago (Webpay, etc.)",
      "Se adapta perfecto a pantallas de celulares",
      "Base de datos segura para tus clientes"
    ]
  },
  {
    title: "Aceleración de Sitios Web Lentos",
    description: "¿Tienes una página web que tarda siglos en cargar? Una web lenta hace que tus clientes se aburran y se vayan con la competencia. Optimizamos tu sitio actual para que abra al instante.",
    features: [
      "Carga inmediata en conexiones móviles",
      "Mejor posicionamiento en Google (SEO)",
      "Reducción de costos en hosting y servidores",
      "Diagnóstico inicial de velocidad gratuito"
    ]
  }
];

export const EXPERIENCE = [
  {
    period: "Ago 2024 — Presente",
    role: "Fundador & Tech Lead",
    org: "Pololitos",
    description:
      "Único desarrollador a cargo de la arquitectura, la app móvil, el backoffice y la infraestructura cloud de una plataforma de gig economy en producción en App Store y Google Play.",
  },
  {
    period: "Ene 2023 — Jul 2023",
    role: "QA Engineer & Software Developer",
    org: "Flöid",
    description:
      "Automatización de pruebas con Selenium, scripts en Python para extracción de datos, y análisis de grandes volúmenes con BigQuery para detectar anomalías en producción.",
  },
  {
    period: "Ene 2022 — Dic 2022",
    role: "Software Developer",
    org: "AltaVenta ERP",
    description:
      "Desarrollo full-stack de funcionalidades para plataformas de ecommerce: APIs en Node.js y frontends en React, con servidores UNIX/Linux administrados vía Docker.",
  },
];

type Project = {
  slug: string;
  name: string;
  featured?: boolean;
  category: string;
  period?: string;
  description: string;
  highlights?: string[];
  stack: string[];
  url?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  domain?: string;
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "pololitos",
    name: "Pololitos",
    featured: true,
    category: "Producto propio · Gig economy",
    period: "2024 — Presente",
    description:
      "App de economía colaborativa que conecta clientes con técnicos independientes en tiempo real. Único desarrollador a cargo del desarrollo móvil (iOS/Android), el backend y la infraestructura en AWS.",
    highlights: [
      "Una sola cuenta con UX dual (HIRE / WORK) vía Zustand + MMKV y Expo Router",
      "Pagos con custodia (escrow) dentro de la app, integrando Transbank Webpay y Floid",
      "CI/CD con GitHub Actions + EAS Build, monitoreo con Sentry y Firebase Analytics",
    ],
    stack: ["React Native", "Node.js", "AWS", "Next.js", "MySQL"],
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.pololitos.app",
    appStoreUrl: "https://apps.apple.com/app/pololitos/id6737562916",
    accent: "#4640DE",
  },
  {
    slug: "sarcarnico",
    name: "Sarcárnico",
    category: "Freelance · E-commerce de Carnes",
    description:
      "Catálogo digital interactivo premium con panel de administración para actualización instantánea de stock, precios de oferta y destacado de productos.",
    stack: ["Next.js", "Supabase", "Cloudinary", "Tailwind CSS"],
    url: "https://sarcarnico.cl",
    domain: "sarcarnico.cl",
    accent: "#DC2626",
  },
  {
    slug: "licitaciones-ia",
    name: "Plataforma de Licitaciones con IA",
    category: "Freelance · SaaS con IA",
    description:
      "Sistema que analiza licitaciones públicas con la API de Claude y estructura las variables clave para la toma de decisiones, sobre una arquitectura de microservicios con NestJS.",
    stack: ["NestJS", "Supabase", "Claude API", "Railway"],
    accent: "#2C27A8",
  },
  {
    slug: "vilugron-propiedades",
    name: "Vilugron Propiedades",
    category: "Portal inmobiliario",
    description:
      "Sitio de corretaje con filtros de propiedades avanzados, mapas interactivos georreferenciados y animaciones fluidas con GSAP.",
    stack: ["Next.js", "GSAP", "Cloudinary"],
    url: "https://vilugronpropiedades.cl",
    domain: "vilugronpropiedades.cl",
    accent: "#C4965A",
  },
  {
    slug: "fleetcore",
    name: "FleetCore",
    category: "SaaS · Gestión de flotas",
    description:
      "Producto propio de gestión de flota para minería y construcción: GPS, mantenimiento predictivo y consumo de combustible en un solo panel corporativo.",
    stack: ["Next.js", "TypeScript"],
    url: "https://fleetcore.cl",
    domain: "fleetcore.cl",
    accent: "#D97706",
  },
  {
    slug: "metal-austral",
    name: "Metal Austral",
    category: "Construcción industrial",
    description:
      "Sitio corporativo para una empresa de construcción de galpones industriales con más de 15 años de experiencia en Chile.",
    stack: ["Next.js", "React", "Tailwind CSS"],
    url: "https://metalaustral.cl",
    domain: "metalaustral.cl",
    accent: "#4640DE",
  },
];

export const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "React Native",
  "Node.js",
  "NestJS",
  "AWS",
  "Supabase",
  "PostgreSQL",
  "Docker",
];
