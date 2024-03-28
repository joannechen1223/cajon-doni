/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        radial:
          "radial-gradient(circle at 0px 0px, #7d00c925, transparent 80%)",
      },
    },
  },
  plugins: [],
};
