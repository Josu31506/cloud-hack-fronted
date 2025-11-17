/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00A7B5',
        'primary-dark': '#00828C',
        secondary: '#1F2933',
        background: '#F5F5F5',
        accent: '#00C4CC',
        pending: '#FCEFC7',
        inprogress: '#D5F5F6',
        resolved: '#DEF7EC',
      },
    },
  },
  plugins: [],
};
