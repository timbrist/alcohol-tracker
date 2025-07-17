/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f1933d',
          500: '#ed7516',
          600: '#de5a0c',
          700: '#b8430d',
          800: '#933512',
          900: '#762e12',
        }
      }
    },
  },
  plugins: [],
} 