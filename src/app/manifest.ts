import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Felipe Salazar — Desarrollo de Software a Medida",
    short_name: "Felipe Salazar",
    description:
      "Desarrollo profesional de aplicaciones móviles, sitios web y catálogos a medida en Chile.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#16161d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
