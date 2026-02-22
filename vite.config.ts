import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // index.html がある場所をルートとして指定
  root: "client",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  build: {
    // ルートが client になるため、出力先を一つ上の層の dist に設定
    outDir: "../dist",
    emptyOutDir: true,
  },
});
