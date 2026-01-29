/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mdt-primary': '#4f46e5',
        'mdt-secondary': '#7c3aed',
        'mdt-success': '#16a34a',
        'mdt-warning': '#eab308',
        'mdt-danger': '#dc2626',
      }
    },
  },
  plugins: [],
}
