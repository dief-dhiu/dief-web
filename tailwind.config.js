/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#123D2B',
          dark: '#0D2D20',
          light: '#1B543D',
        },
        emerald: {
          deep: '#174C38',
          hover: '#13402F',
        },
        sage: {
          DEFAULT: '#81977E',
          light: '#A3B6A1',
          subtle: '#D6E0D5',
        },
        ivory: {
          DEFAULT: '#F7F6F0',
          dark: '#EFECE1',
          light: '#FCFBF8',
        },
        gold: {
          DEFAULT: '#B69A5A',
          light: '#CEB579',
          dark: '#937A40',
          subtle: 'rgba(182, 154, 90, 0.15)',
        },
        charcoal: {
          DEFAULT: '#252B27',
          light: '#3C4540',
          muted: '#626B66',
        },
        surface: {
          lightGreen: '#E9EFE8',
          card: '#FFFFFF',
        },
        brand: {
          deep: '#123D2B',
          primary: '#174C38',
          hover: '#13402F',
          subtle: '#E9EFE8',
          bg: '#F7F6F0',
          navy: '#0D2D20',
          light: '#D6E0D5',
        },
        sand: {
          DEFAULT: '#EFECE1',
          light: '#F7F6F0',
          dark: '#DDD8C4',
        },
        muted: {
          DEFAULT: '#626B66',
          light: '#8A948F',
          dark: '#4A524D',
        }
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        editorial: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        arabic: ['"Amiri"', '"Noto Naskh Arabic"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 61, 43, 0.06)',
        'elevated': '0 12px 36px -4px rgba(18, 61, 43, 0.10)',
        'gold-glow': '0 0 25px rgba(182, 154, 90, 0.25)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
