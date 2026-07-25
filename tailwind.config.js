/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC5A51',
        rosa: '#FFD1DC',
      },
      backgroundImage: {
        'pattern-medical': `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23DC5A51' fill-opacity='0.06'%3E%3Cpath d='M 20 10 h 6 v 6 h 6 v 6 h -6 v 6 h -6 v -6 h -6 v -6 h 6 z' /%3E%3Cpath d='M 90 20 C 90 15, 80 10, 75 20 C 70 30, 85 40, 90 47 C 95 40, 110 30, 105 20 C 100 10, 90 15, 90 20 Z' /%3E%3Cg transform='translate(25, 85) rotate(-45)'%3E%3Crect x='-12' y='-6' width='24' height='12' rx='6' /%3E%3C/g%3E%3Cpath d='M 90 80 Q 90 95 75 95 Q 90 95 90 110 Q 90 95 105 95 Q 90 95 90 80 Z' /%3E%3C/g%3E%3C/svg%3E")`,
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
