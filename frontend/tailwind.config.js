module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFCC00',
        darkGold: '#B8860B', // New color with better contrast
        white: '#FFFFFF',
        black: '#000000',
        lightGray: '#F5F5F5',
        yellow: '#f9bb0f',
        darkYellow: '#DAA520', // New color with better contrast
        darkGray: '#A9A9A9', // New color for better contrast on gray buttons
      },
    },
  },
  plugins: [],
}