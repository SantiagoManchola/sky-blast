// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://sky-blast.vercel.app", // Replace with your actual domain
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      changefreq: "weekly",
      priority: 1.0,
      lastmod: new Date(),
      entryLimit: 10000,
      serialize(item) {
        // Customize sitemap entries
        if (item.url === "https://sky-blast.vercel.app/") {
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],
});
