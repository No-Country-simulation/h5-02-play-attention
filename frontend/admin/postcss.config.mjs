const config = {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './shared/**/*.{js,jsx,ts,tsx}',
        './lib/**/*.{js,jsx,ts,tsx}',
        './app/not-found.js'
      ]
    }
  }
};

export default config;
