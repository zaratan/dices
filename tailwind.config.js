module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      transitionDuration: {
        5000: '5s',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
