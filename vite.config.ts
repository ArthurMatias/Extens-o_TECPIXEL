import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Caminhos de assets RELATIVOS no build (./assets/...) para o site funcionar
  // servido da raiz do domínio, de um subcaminho (GitHub Pages /<repo>/) ou de
  // uma subpasta — sem isso, os /assets/... absolutos dão 404 e a tela fica branca.
  base: './',
  plugins: [react()],
  server: { port: 8080 },
  preview: { port: 8080 },
});
