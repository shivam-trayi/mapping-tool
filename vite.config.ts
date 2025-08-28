import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "",
  plugins: [react()],
  build: {
    minify: mode === "production" ? "terser" : false,
    cssMinify: mode === "production" ? "lightningcss" : false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 5173,
    hmr: { overlay: false },
  },
}));
