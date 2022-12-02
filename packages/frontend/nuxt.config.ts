// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [["nuxt-typed-router", { outDir: "./.generated" }], "@vueuse/nuxt"],
  nitro: {
    devProxy: {
      "/trpc": "http://localhost:4000/trpc",
    },
  },
});
