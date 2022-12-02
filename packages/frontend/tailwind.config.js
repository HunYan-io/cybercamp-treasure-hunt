/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    colors: {
      primary: "#F8F207",
      secondary: "#3BB7CE",
      black: "#000000",
      white: "#FFFFFF",
      transparent: "transparent",
      error: "#CF6679",
    },
    fontFamily: {
      display: ["Orbitron", "sans-serif"],
      body: ["Ubuntu", "sans-serif"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      boxShadow: (theme) => ({
        solid4: `4px 4px 0px ${theme("colors.secondary")}`,
        solidn4: `-4px 4px 0px ${theme("colors.secondary")}`,
        solid2: `2px 2px 0px ${theme("colors.secondary")}`,
        solidn2: `-2px 2px 0px ${theme("colors.secondary")}`,
      }),
      dropShadow: (theme) => ({
        solid4: `4px 4px 0px ${theme("colors.secondary")}`,
        solid2: `2px 2px 0px ${theme("colors.secondary")}`,
      }),
      backgroundImage: {
        "block-top-pattern": "url('~/assets/images/block-top.svg')",
        "block-bottom-pattern": "url('~/assets/images/block-bottom.svg')",
        box: "url('~/assets/images/box.svg')",
        modal: "url('~/assets/images/modal.svg')",
      },
      backgroundSize: {
        fill: "100% 100%",
        "modal-mobile-fill": "100% 130%",
      },
    },
  },
  plugins: [],
};
