import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ESモジュールでパスを正しく扱うための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // 1. index.html がある場所をビルドの基準（root）に指定
  root: "client",
  resolve: {
    alias: {
      // 2. コード内の "@" 記号を src フォルダに紐付け
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  build: {
    // 3. 出力先をプロジェクトのルートにある dist フォルダに指定
    outDir: "../dist",
    emptyOutDir: true,
  },
});
