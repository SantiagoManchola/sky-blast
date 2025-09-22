// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
// import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://skyblastdrone.com", // https://sky-blast.vercel.app
  output: "static", // default is "server" when using an adapter
  // adapter: vercel(),
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
        // Changed from sky-blast.vercel.app
        if (item.url === "https://skyblastdrone.com/") {
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],
});
