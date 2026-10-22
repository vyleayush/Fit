/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./backup.html",
    "./js/**/*.js",
    "./script.js",
    "./policy-data.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'charcoal': '#121214',
        'charcoal-card': '#18181C',
        'charcoal-muted': '#27272E',
        'charcoal-deep': '#0A0A0C',
        'accent-orange': '#FF5E00',
        'accent-orange-hover': '#FF7315',
        'accent-orange-glow': 'rgba(255, 94, 0, 0.45)',
        'sand-bg': '#E6E3DC',
        'sand-card': '#ECE9E2',
        'sand-deep': '#DDD9D0',
        'chalk': '#FAF8F5'
      },
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'sans-serif'],
        'sans': ['"Plus Jakarta Sans"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
