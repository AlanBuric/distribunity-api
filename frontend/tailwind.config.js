import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'active-link': '#0099ff',
      },
      // Garamond override + defaults from the Tailwind CSS website
      fontFamily: {
        serif: ['Garamond', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
    },
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [typography],
};
