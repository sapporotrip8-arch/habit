import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// 現在のファイルの場所を正確に取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // 1. client フォルダを入り口として絶対パスで指定
  root: path.resolve(__dirname, "client"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
  build: {
    // 2. 出力先をプロジェクトのルートにある "dist" フォルダに絶対パスで指定
    // Vercelの標準設定（dist）に合わせることで、設定の食い違いを防ぎます
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
