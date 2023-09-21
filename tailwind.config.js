/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // screens: {
    //   xs: "614px",
    //   sm: "1002px",
    //   md: "1022px",
    //   lg: "1092px",
    //   xl: "1280px",
    // },
    extend: {
      colors: {
        light: {
          bg: {
            primary: "#fff",
            secondary: "#FAFAFA",
            highlight: "#EEE",
          },
          text: {
            primary: "#000",
            secondary: "#666",
            muted: "grey"
          }
        },
        dark: {
          bg: {
            // primary: "#252525",
            // secondary: "#262626",
            // hover: "#303030",
            primary: "#1E1E1E",
            secondary: "#282828",
            highlight: "#363636",
          },
          text: {
            primary: "#fff",
            secondary: "#b3b3b3",
            muted: "grey"
          }
        }
      },
    },
  },
  plugins: [],
}

