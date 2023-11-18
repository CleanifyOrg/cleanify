import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import 'dotenv/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: "globalThis",
  },
  base: process.env.VITE_IS_PROD === "true" ? "/cleanify/" : "/",
});
