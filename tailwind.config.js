module.exports = {
  purge: [],
  // purge: ['./src/**/*.js'],
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    extend: {
      typography: {
        DEFAULT: {}
      },
      customForms: () => ({
        DEFAULT: {
          input: {
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
              borderColor: 'none'
            }
          },
          select: {},
          checkbox: {
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
              borderColor: 'none'
            }
          }
        }
      }),
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        primary: {
          50: '#FEECE4',
          100: '#fcd0bd',
          200: '#fab191',
          300: '#f89164',
          400: '#f77a43',
          500: '#F56222',
          600: '#f45a1e',
          700: '#F25019',
          800: '#f04614',
          900: '#EE340C'
        },
        secondary: {
          500: '#0A66E3'
        },
        neutral: {
          dark: '#132137',
          100: '#F5F6FA',
          200: '#EAEBF2',
          300: '#DEE1E9',
          400: '#B4BAC7',
          500: '#9CA4B6',
          600: '#6E778B',
          700: '#8A92A6',
          800: '#80899E',
          900: '#6E788E'
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          890: '#3a3a3a', // tint %10 or lighten %10
          895: '#2e2e2e', // tint 5% or lighten 5%
          900: '#212121'
        },
        'blue-gray': {
          50: '#eceff1',
          100: '#cfd8dc',
          200: '#b0bec5',
          300: '#90a4ae',
          400: '#78909c',
          500: '#607d8b',
          600: '#546e7a',
          700: '#455a64',
          800: '#37474f',
          900: '#263238'
        },
        success: {
          100: '#C5F1CB',
          200: '#9EE7A9',
          300: '#77DD87',
          400: '#5AD66D',
          500: '#3DCF53',
          600: '#37CA4C',
          700: '#2FC342',
          800: '#27BD39',
          900: '#1AB229'
        },
        danger: {
          50: '#FFD9E0',
          100: '#FFCDD2',
          200: '#F98686',
          300: '#F85D5D',
          400: '#F8524E',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C'
        },
        info: {
          100: '#CDE0F8',
          200: '#ABCBF4',
          300: '#89B6EF',
          400: '#70A6EB',
          500: '#5796E8',
          600: '#4F8EE5',
          700: '#4683E2',
          800: '#3C79DE',
          900: '#2C68D8'
        },
        warning: {
          100: '#FFE0B3',
          200: '#FFCB80',
          300: '#FFB64d',
          400: '#FFA726',
          500: '#FF9700',
          600: '#FF8F00',
          700: '#FF8400',
          800: '#FF7A00',
          900: '#FF6900'
        }
      },
      spacing: {
        px: '1px',
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        40: '10rem',
        48: '12rem',
        56: '14rem',
        64: '16rem',
        96: '24rem',
        128: '32rem'
      },
      backgroundColor: theme => theme('colors'),
      backgroundImage: {
        none: 'none',
        'gradient-to-t': 'linear-gradient(to top, var(--gradient-color-stops))',
        'gradient-to-tr':
          'linear-gradient(to top right, var(--gradient-color-stops))',
        'gradient-to-r':
          'linear-gradient(to right, var(--gradient-color-stops))',
        'gradient-to-br':
          'linear-gradient(to bottom right, var(--gradient-color-stops))',
        'gradient-to-b':
          'linear-gradient(to bottom, var(--gradient-color-stops))',
        'gradient-to-bl':
          'linear-gradient(to bottom left, var(--gradient-color-stops))',
        'gradient-to-l':
          'linear-gradient(to left, var(--gradient-color-stops))',
        'gradient-to-tl':
          'linear-gradient(to top left, var(--gradient-color-stops))'
      },
      gradientColorStops: theme => theme('colors'),
      backgroundOpacity: theme => theme('opacity'),
      backgroundPosition: {
        bottom: 'bottom',
        center: 'center',
        left: 'left',
        'left-bottom': 'left bottom',
        'left-top': 'left top',
        right: 'right',
        'right-bottom': 'right bottom',
        'right-top': 'right top',
        top: 'top'
      },
      backgroundSize: {
        auto: 'auto',
        cover: 'cover',
        contain: 'contain'
      },
      borderColor: theme => ({
        ...theme('colors'),
        DEFAULT: theme('colors.gray.200', 'currentColor')
      }),
      borderOpacity: theme => theme('opacity'),
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px'
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
        4: '4px',
        8: '8px'
      },
      boxShadow: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        none: 'none'
      },
      container: {},
      cursor: {
        none: 'none',
        auto: 'auto',
        DEFAULT: 'DEFAULT',
        pointer: 'pointer',
        wait: 'wait',
        text: 'text',
        move: 'move',
        'not-allowed': 'not-allowed'
      },
      divideColor: theme => theme('borderColor'),
      divideOpacity: theme => theme('borderOpacity'),
      divideWidth: theme => theme('borderWidth'),
      fill: {
        current: 'currentColor'
      },
      flex: {
        1: '1 1 0%',
        auto: '1 1 auto',
        initial: '0 1 auto',
        none: 'none'
      },
      flexGrow: {
        0: '0',
        DEFAULT: '1'
      },
      flexShrink: {
        0: '0',
        DEFAULT: '1'
      },
      fontFamily: {
        heading: ['Aileron', 'san-serif'],
        body: ['NotoSans', 'san-serif']
      },
      fontSize: {
        '3xs': '0.6rem',
        '2xs': '0.7rem',
        xs: '0.75rem',
        sm: '0.825rem',
        md: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.625rem',
        '4xl': '1.875rem',
        '5xl': '2.25rem',
        '6xl': '3rem',
        '7xl': '4rem'
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900'
      },
      height: theme => ({
        auto: 'auto',
        ...theme('spacing'),
        full: '100%',
        screen: '100vh'
      }),
      inset: {
        0: '0',
        auto: 'auto'
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
        3: '.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.4375rem'
      },
      listStyleType: {
        none: 'none',
        disc: 'disc',
        decimal: 'decimal'
      },
      margin: (theme, { negative }) => ({
        auto: 'auto',
        ...theme('spacing'),
        ...negative(theme('spacing'))
      }),
      maxHeight: {
        full: '100%',
        screen: '100vh'
      },
      maxWidth: (theme, { breakpoints }) => ({
        none: 'none',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        full: '100%',
        ...breakpoints(theme('screens'))
      }),
      minHeight: {
        0: '0',
        full: '100%',
        screen: '100vh'
      },
      minWidth: {
        0: '0',
        full: '100%'
      },
      objectPosition: {
        bottom: 'bottom',
        center: 'center',
        left: 'left',
        'left-bottom': 'left bottom',
        'left-top': 'left top',
        right: 'right',
        'right-bottom': 'right bottom',
        'right-top': 'right top',
        top: 'top'
      },
      opacity: {
        0: '0',
        25: '0.25',
        50: '0.5',
        75: '0.75',
        100: '1'
      },
      order: {
        first: '-9999',
        last: '9999',
        none: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12'
      },
      padding: theme => theme('spacing'),
      placeholderColor: theme => theme('colors'),
      placeholderOpacity: theme => theme('opacity'),
      space: (theme, { negative }) => ({
        ...theme('spacing'),
        ...negative(theme('spacing'))
      }),
      stroke: {
        current: 'currentColor'
      },
      strokeWidth: {
        0: '0',
        1: '1',
        2: '2'
      },
      textColor: theme => theme('colors'),
      textOpacity: theme => theme('opacity'),
      width: theme => ({
        auto: 'auto',
        ...theme('spacing'),
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
        '1/12': '8.333333%',
        '2/12': '16.666667%',
        '3/12': '25%',
        '4/12': '33.333333%',
        '5/12': '41.666667%',
        '6/12': '50%',
        '7/12': '58.333333%',
        '8/12': '66.666667%',
        '9/12': '75%',
        '10/12': '83.333333%',
        '11/12': '91.666667%',
        full: '100%',
        screen: '100vw'
      }),
      zIndex: {
        auto: 'auto',
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50'
      },
      gap: theme => theme('spacing'),
      gridTemplateColumns: {
        none: 'none',
        1: 'repeat(1, minmax(0, 1fr))',
        2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))',
        4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))'
      },
      gridColumn: {
        auto: 'auto',
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6',
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-9': 'span 9 / span 9',
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12'
      },
      gridColumnStart: {
        auto: 'auto',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12',
        13: '13'
      },
      gridColumnEnd: {
        auto: 'auto',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12',
        13: '13'
      },
      gridTemplateRows: {
        none: 'none',
        1: 'repeat(1, minmax(0, 1fr))',
        2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))',
        4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))'
      },
      gridRow: {
        auto: 'auto',
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6'
      },
      gridRowStart: {
        auto: 'auto',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7'
      },
      gridRowEnd: {
        auto: 'auto',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7'
      },
      transformOrigin: {
        center: 'center',
        top: 'top',
        'top-right': 'top right',
        right: 'right',
        'bottom-right': 'bottom right',
        bottom: 'bottom',
        'bottom-left': 'bottom left',
        left: 'left',
        'top-left': 'top left'
      },
      scale: {
        0: '0',
        50: '.5',
        75: '.75',
        90: '.9',
        95: '.95',
        100: '1',
        105: '1.05',
        110: '1.1',
        125: '1.25',
        150: '1.5'
      },
      rotate: {
        '-180': '-180deg',
        '-90': '-90deg',
        '-45': '-45deg',
        0: '0',
        45: '45deg',
        90: '90deg',
        180: '180deg'
      },
      translate: (theme, { negative }) => ({
        ...theme('spacing'),
        ...negative(theme('spacing')),
        '-full': '-100%',
        '-1/2': '-50%',
        '1/2': '50%',
        full: '100%'
      }),
      skew: {
        '-12': '-12deg',
        '-6': '-6deg',
        '-3': '-3deg',
        0: '0',
        3: '3deg',
        6: '6deg',
        12: '12deg'
      },
      transitionProperty: {
        none: 'none',
        all: 'all',
        DEFAULT:
          'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
        colors: 'background-color, border-color, color, fill, stroke',
        opacity: 'opacity',
        shadow: 'box-shadow',
        transform: 'transform'
      },
      transitionTimingFunction: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      transitionDuration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms'
      },
      transitionDelay: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms'
      },
      animation: {
        none: 'none',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        drop: 'drop 0.35s ease-in-out forwards'
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' }
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        },
        pulse: {
          '50%': { opacity: '.5' }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
          }
        },
        drop: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1,
            transform: `translateY(550px)`
          }
        }
      }
    }
  },
  variants: {
    accessibility: ['responsive', 'focus'],
    alignContent: ['responsive'],
    alignItems: ['responsive'],
    alignSelf: ['responsive'],
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundClip: ['responsive'],
    backgroundColor: [
      'responsive',
      'hover',
      'focus',
      'dark',
      'dark:hover',
      'dark:focus'
    ],
    backgroundImage: ['responsive'],
    gradientColorStops: ['responsive', 'hover', 'focus'],
    backgroundOpacity: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: ['responsive'],
    borderColor: [
      'responsive',
      'hover',
      'focus',
      'first',
      'last',
      'dark',
      'dark:hover',
      'dark:focus'
    ],
    borderOpacity: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive', 'first', 'last'],
    borderStyle: ['responsive', 'first', 'last'],
    borderWidth: ['responsive', 'first', 'last'],
    boxShadow: ['responsive', 'hover', 'focus'],
    boxSizing: ['responsive'],
    container: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    divideColor: ['responsive'],
    divideOpacity: ['responsive'],
    divideStyle: ['responsive'],
    divideWidth: ['responsive'],
    fill: ['responsive'],
    flex: ['responsive'],
    flexDirection: ['responsive'],
    flexGrow: ['responsive'],
    flexShrink: ['responsive'],
    flexWrap: ['responsive'],
    float: ['responsive'],
    clear: ['responsive'],
    fontFamily: ['responsive'],
    fontSize: ['responsive'],
    fontSmoothing: ['responsive'],
    fontVariantNumeric: ['responsive'],
    fontStyle: ['responsive'],
    fontWeight: ['responsive', 'hover', 'focus'],
    height: ['responsive'],
    inset: ['responsive'],
    justifyContent: ['responsive'],
    justifyItems: ['responsive'],
    justifySelf: ['responsive'],
    letterSpacing: ['responsive'],
    lineHeight: ['responsive'],
    listStylePosition: ['responsive'],
    listStyleType: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    objectFit: ['responsive'],
    objectPosition: ['responsive'],
    opacity: ['responsive', 'hover', 'focus'],
    order: ['responsive'],
    outline: ['responsive', 'focus'],
    overflow: ['responsive'],
    overscrollBehavior: ['responsive'],
    padding: ['responsive'],
    placeContent: ['responsive'],
    placeItems: ['responsive'],
    placeSelf: ['responsive'],
    placeholderColor: ['responsive', 'focus'],
    placeholderOpacity: ['responsive', 'focus'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    space: ['responsive'],
    stroke: ['responsive'],
    strokeWidth: ['responsive'],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColor: [
      'responsive',
      'hover',
      'focus',
      'dark',
      'dark:hover',
      'dark:focus'
    ],
    textOpacity: ['responsive', 'hover', 'focus'],
    textDecoration: ['responsive', 'hover', 'focus'],
    textTransform: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    wordBreak: ['responsive'],
    zIndex: ['responsive'],
    gap: ['responsive'],
    gridAutoFlow: ['responsive'],
    gridTemplateColumns: ['responsive'],
    gridColumn: ['responsive'],
    gridColumnStart: ['responsive'],
    gridColumnEnd: ['responsive'],
    gridTemplateRows: ['responsive'],
    gridRow: ['responsive'],
    gridRowStart: ['responsive'],
    gridRowEnd: ['responsive'],
    transform: ['responsive'],
    transformOrigin: ['responsive'],
    scale: ['responsive', 'hover', 'focus'],
    rotate: ['responsive', 'hover', 'focus'],
    translate: ['responsive', 'hover', 'focus'],
    skew: ['responsive', 'hover', 'focus'],
    transitionProperty: ['responsive'],
    transitionTimingFunction: ['responsive'],
    transitionDuration: ['responsive'],
    transitionDelay: ['responsive'],
    animation: ['responsive'],
    extend: {
      backgroundColor: ['active'],
      borderColor: ['active']
    }
  },
  corePlugins: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-prefers-dark-mode')({
      type: 'class',
      className: '.dark-mode',
      prefix: 'dark'
    })
  ]
}
