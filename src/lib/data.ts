export const PERSONAL = {
  name: "Felipe Salazar",
  firstName: "Felipe",
  role: "Consultor de Software & Desarrollador Senior",
  email: "felipeslzar@gmail.com",
  whatsapp: "https://wa.me/56949290943",
  github: "https://github.com/felipeisj",
  linkedin: "https://www.linkedin.com/in/felipe-salazar-jimenez/",
  location: "Chile · Remoto",
};

export const NAV_LINKS = [
  { label: "Inicio", href: "#top" },
  { label: "Servicios", href: "#services" },
  { label: "Clientes", href: "#clientes" },
  { label: "Proyectos", href: "#work" },
  { label: "Sobre mí", href: "#about" },
  { label: "Contacto", href: "#contact" },
];

export const SERVICES = [
  {
    title: "Apps Móviles",
    subtitle: "Desarrollo de aplicaciones que funcionan tanto en iPhone como en Android, optimizando tu costo de desarrollo.",
    href: "#contact",
    imageSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    tag: "iOS & Android",
    actionText: "Cotizar Aplicación",
    color: "#4640de", // Premium Accent Blue
    features: [
      "Funciona sin Internet (base local)",
      "Notificaciones push (alertas directas)",
      "Mapa y geolocalización GPS",
      "Pagos seguros in-app"
    ]
  },
  {
    title: "Sitios Web & Venta",
    subtitle: "Sitios web y sistemas de venta rápidos y autoadministrables adaptados a las necesidades reales de tu empresa.",
    href: "#contact",
    imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    tag: "E-Commerce & Gestión",
    actionText: "Cotizar Plataforma",
    color: "#4f46e5", // Royal Indigo
    features: [
      "Panel para actualizar stock e imágenes",
      "Pasarela de pago nacional (Webpay)",
      "Diseño adaptable a celulares",
      "Buscadores avanzados y filtros"
    ]
  },
  {
    title: "Aceleración Web",
    subtitle: "Optimizamos tu página web lenta para mejorar la experiencia de usuario y evitar la pérdida de ventas.",
    href: "#contact",
    imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    tag: "Rendimiento & SEO",
    actionText: "Pedir Diagnóstico Gratis",
    color: "#0f766e", // Deep Teal
    features: [
      "Carga instantánea en conexiones 4G/5G",
      "Mejora de puntaje en Google (Core Web Vitals)",
      "Reducción de costos en servidores",
      "SEO técnico para mejor posicionamiento"
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
      "Sistema que analiza licitaciones públicas con IA y estructura las variables clave para la toma de decisiones, sobre una arquitectura de microservicios con NestJS.",
    stack: ["Python", "Supabase", "Claude API", "Railway"],
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
  "Python",
  "AWS",
  "Supabase",
  "PostgreSQL",
  "Docker",
];
