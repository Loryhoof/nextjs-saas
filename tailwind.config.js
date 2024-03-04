/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem'
      }
    },
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif', 'var(--font-quicksand)'],
      },
      fontVariationSettings: {
        'font-quicksand': "'wght' 400, 'slnt' 0",
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
