import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
  // important: '#__next' // id in layout
  // https://mui.com/material-ui/integrations/interoperability/#tailwind-css
} satisfies Config;
