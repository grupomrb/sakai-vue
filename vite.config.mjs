import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        nclude: ['vee-validate', 'yup'],
        noDiscovery: true
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/serverms': {
                target: 'http://localhost:55682',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/serverms/, '')
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
