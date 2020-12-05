module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#F56222',
        },
        secondary: {
          500: '#0A66E3',
        },
        dark: {
          500: '#132137',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
