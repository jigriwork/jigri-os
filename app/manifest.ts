import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JIGRI OS",
    short_name: "JIGRI",
    description: "Billing, inventory, CRM, and control all in one",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#0ea5e9",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
