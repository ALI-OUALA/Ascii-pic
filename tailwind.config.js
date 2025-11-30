/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"TheGoodMonolith"', 'monospace'],
        sans: ['"PP Neue Montreal"', 'sans-serif'],
      },
      colors: {
        background: '#111',
        foreground: '#eee',
      }
    },
  },
  plugins: [],
}
