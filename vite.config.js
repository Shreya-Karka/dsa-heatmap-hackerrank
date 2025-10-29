import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/dsa-heatmap-hackerrank/", // Change this to your repo name
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
