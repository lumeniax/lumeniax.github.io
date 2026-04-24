import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/",
  appType: "spa",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('@radix-ui')) return 'ui-radix';
            if (id.includes('lucide-react')) return 'ui-icons';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('firebase')) return 'firebase';
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5000,
    host: "0.0.0.0",
    allowedHosts: true,
    hmr: false,
    watch: {
      ignored: ["**/.local/**"],
    },
  },
  preview: { port: 4173, host: "0.0.0.0", allowedHosts: true },
});
