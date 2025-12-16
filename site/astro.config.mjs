// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: "https://kennan.dev",
  integrations: [mdx(), sitemap(), solidJs()],
  vite: {
    plugins: [tailwindcss()],
  },
});
