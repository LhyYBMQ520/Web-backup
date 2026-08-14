/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './javascript/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        accent: '#FF3366',
        neutral: '#F8F9FA',
        secondary: '#36CFC9',
        light: {
          primary: '#165DFF',
          secondary: '#FFFFFF'
        },
        dark: {
          DEFAULT: '#1D2129',
          primary: '#9333EA',
          secondary: '#121212'
        }
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        site: [
          'var(--en-font, "Poppins")',
          'var(--zh-font, "ZCOOL KuaiLe")',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ]
      }
    }
  }
};
