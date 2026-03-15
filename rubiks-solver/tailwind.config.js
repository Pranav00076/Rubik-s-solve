/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cube: {
          white: '#FFFFFF',
          red: '#B71234',
          blue: '#0046AD',
          orange: '#FF5800',
          green: '#009B48',
          yellow: '#FFD500',
          base: '#222222', // Used for cube plastic color
        }
      }
    },
  },
  plugins: [],
}
