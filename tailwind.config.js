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
        "zoom-150": "1280px"
      },
      colors: {
        'steam': '#171D25',
        'blue_steam': '#1997E2',
        'blue_steam_login': "#2C75FF",
        'gray': '#AFAFAF',
        'header': '#171A21',
        'header-2': '#2F3138'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
],
}

