// import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
      colors: {
        primary: '#2E3A8C',
        secondary: '#4CAF50',
      "primary-dark": '#1a237e',
      },
      fontFamily: {
        arabic: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
     themes: ["cupcake", "abyss --prefersdark", "cupcake", "dracula",]

  },
}
