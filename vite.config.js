import { defineConfig } from 'vite';

// Для GitHub Pages: если репозиторий не username.github.io, используйте '/repo-name/'
// Для корневого домена оставьте '/'
// Измените 'vrp_scene-main' на имя вашего репозитория, если отличается
const repoName = 'vrp_scene-main';
const base = process.env.GITHUB_PAGES ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
