module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        heading: ['Aileron', 'san-serif'],
        body: ['NotoSans', 'san-serif']
      },

      colors: {
        primary: {
          500: '#F56222',
          700: '#F25019',
          900: '#EE340C'
        },
        secondary: {
          500: '#0A66E3'
        },
        neutral: {
          dark: '#132137',
          100: '#F5F6FA',
          300: '#DEE1E9',
          500: '#9CA4B6'
        }
      },

      width: {
        120: '32rem'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderColor: ['active']
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
