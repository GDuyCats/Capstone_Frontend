/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      blur: {
        xs: '1px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      inset: {
        '1/2.8': '42.857%',
        '1/6': '16.666%',
      },
      screens: {
        'zoom-175': {'raw': '(min-width: 1024px) and (zoom: 175%)'},
      },
      colors: {
        'steam': '#171D25',
      }
    },
  },
  plugins: [],
}

