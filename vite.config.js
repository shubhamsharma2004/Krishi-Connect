import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      // dev proxy: /api/schemes -> data.gov resource
      "/api/schemes": {
        target: "https://api.data.gov.in",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          // strip /api/schemes and replace with resource path
          path.replace(/^\/api\/schemes/, "/resource/90a30a19-e05d-46c5-94ad-81f34caa7814"),
      },
    },
  },
});