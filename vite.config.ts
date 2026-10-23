import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleInsightsRequest } from './server/routes/insights';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/api/insights') || req.url.startsWith('/api/status'))) {
            handleInsightsRequest(req, res);
          } else {
            next();
          }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/api/insights') || req.url.startsWith('/api/status'))) {
            handleInsightsRequest(req, res);
          } else {
            next();
          }
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
});
