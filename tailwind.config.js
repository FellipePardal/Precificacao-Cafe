/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        bg: '#F7F4EF',
        surface: '#FFFFFF',
        surface2: '#F0EDE7',
        border: '#E2DDD5',
        accent: '#C8501A',
        'accent-light': '#F5E8E2',
        accent2: '#2A6B4F',
        'accent2-light': '#E3F0EB',
        warn: '#B8860B',
        'warn-light': '#FDF6DC',
        danger: '#B52424',
        'danger-light': '#FDEAEA',
        dark: '#1C1A17',
        muted: '#7A7268',
        light: '#B5AFA5',
      },
    },
  },
  plugins: [],
}
