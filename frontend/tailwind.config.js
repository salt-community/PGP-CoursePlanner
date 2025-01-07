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

          ".menu li > *:not(ul, .menu-title, details, .btn):focus": {
            "background-color": "#FF9886",
            "color": "#fff",
          },

          ".menu li > *:not(ul, .menu-title, details, .btn):hover": {
            "background-color": "#F35C7E",
            "color": "#fff",
          },

          ".menu li > *:not(ul, .menu-title, details, .btn):active": {
            "background-color": "#DB5472",
            "color": "#fff",
          },
        },
      },
    ],
  },

  plugins: [daisyui],
};
