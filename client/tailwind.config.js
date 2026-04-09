/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        surface: '#FFFFFF',
        border: '#E8E4DF',
        primary: {
          DEFAULT: '#E8572A',
          dark: '#C94420',
        },
        text: {
          primary: '#1A1814',
          muted: '#6B6560',
        },
        success: '#2D9E6B',
        warning: '#E8A020',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
