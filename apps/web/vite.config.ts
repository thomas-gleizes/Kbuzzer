import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/ws": {
        target: "ws://127.0.0.1:8000",
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ""),
      },
    },
  },
  build: {
    outDir: "../../dist/client",
    emptyOutDir: true,
  },
})
