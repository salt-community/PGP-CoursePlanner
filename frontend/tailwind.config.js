import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ff7961",

          "primary-content": "#FF9886",

          secondary: "#0f2d45",

          accent: "#D9D9D9",

          neutral: "#ff00ff",

          "base-100": "#ebebeb",

          info: "#ff00ff",

          success: "#00ff00",

          warning: "#00ff00",

          error: "#ff0000",
        },
      },
    ],
  },

  plugins: [daisyui],
};
