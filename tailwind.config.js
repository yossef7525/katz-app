/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#20A57D',
        'primary-content': '#FFFCF4',
        secondary: '#B9E757',
        'secondary-content': '#0C4C40',
        accent: '#0C4C40',
        'accent-content': '#B9E757',
        neutral: '#2B3440',
        'neutral-content': '#D7DDE4',
        'base-100': '#ffffff',
        'base-200': '#A1B4B0',
        'base-300': '#E5E6E6',
        'base-content': '#1f2937',
      }
    },
  },
  plugins: [],
}

