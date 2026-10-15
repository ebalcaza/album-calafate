import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' → rutas relativas, así el sitio funciona en GitHub Pages
// sin importar el nombre del repositorio (usuario.github.io/<repo>/)
export default defineConfig({
  plugins: [react()],
  base: '/album-calafate/',
});
