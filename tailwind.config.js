/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: { 
    extend: { 
        fontFamily: { 
            'sans': ['Patrick Hand', 'cursive'],
            'display': ['Oswald', 'sans-serif']
        },
        boxShadow: {
            'manga': '6px 6px 0px 0px rgba(0,0,0,1)',
            'manga-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
            'manga-dark': '6px 6px 0px 0px rgba(255,255,255,1)',
            'manga-dark-sm': '3px 3px 0px 0px rgba(255,255,255,1)'
        }
    } 
  },
  plugins: [],
}