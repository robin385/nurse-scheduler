import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Generate a purely static site with client-side rendering only.
    // The fallback option enables SPA mode by serving index.html for unknown routes.
    adapter: adapter({ fallback: 'index.html' }),
  },

  preprocess: [vitePreprocess({})],
};

export default config;
