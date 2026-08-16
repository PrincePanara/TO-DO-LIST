export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        canvas: '#F4F1EA',
        brand: '#7C3AED',
        'brand-dark': '#5B21B6',
        'brand-soft': '#EDE9FE',
        sun: '#FACC15',
        'sun-soft': '#FEF9C3',
        danger: '#EF4444',
        'danger-soft': '#FEE2E2',
        ok: '#22C55E',
        'ok-soft': '#DCFCE7',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'brut-xs': '2px 2px 0px #111111',
        'brut-sm': '3px 3px 0px #111111',
        brut: '6px 6px 0px #111111',
        'brut-lg': '10px 10px 0px #111111',
        'brut-inv': '6px 6px 0px #FFFFFF',
      },
      borderWidth: {
        3: '3px',
      },
      transitionTimingFunction: {
        brut: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
};
