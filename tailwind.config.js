/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F17",
        panelBg: "#111827",
        borderSlate: "#1E293B",
        accentBlue: "#2563EB",
        accentGreen: "#10B981",
        accentRed: "#EF4444"
      }
    },
  },
  plugins: [],
}