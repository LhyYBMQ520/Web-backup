/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Only these pages load assets/tailwind.css; their scripts are inline.
    './close-the-AD.html',
    './speedtest.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        accent: '#FF3366',
        neutral: '#F8F9FA',
        secondary: '#36CFC9',
        dark: '#1D2129'
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
};
