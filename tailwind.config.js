/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'hover:shadow-md',
    'hover:bg-blue-50',
    'hover:bg-green-50',
    'hover:bg-red-50',
    'hover:-translate-y-1',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 