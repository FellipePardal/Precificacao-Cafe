/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        bg:              '#FFFFFF',
        surface:         '#FAFAF8',
        surface2:        '#F2EAE0',
        border:          '#E0D3C5',
        /* marrom — cor primária do restaurante */
        accent:          '#6B3E1E',
        'accent-light':  '#F5EAE0',
        /* verde — cor secundária */
        accent2:         '#286044',
        'accent2-light': '#E2F0EB',
        warn:            '#9B6F10',
        'warn-light':    '#FBF4DC',
        danger:          '#B03030',
        'danger-light':  '#FCEAEA',
        dark:    '#1A0E06',
        muted:   '#7A624E',
        light:   '#BFB0A0',
        sidebar: {
          DEFAULT: '#3D2010',
          hover:   '#4F2A14',
          active:  '#286044',
        },
      },
    },
  },
  plugins: [],
}
