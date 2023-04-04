module.exports = {
  content: ["./src/**/*.{ts,tsx}"], // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
};
