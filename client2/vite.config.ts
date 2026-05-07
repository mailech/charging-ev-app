import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@trio/shared/auth', replacement: resolve(__dirname, '../shared/src/auth.ts') },
            { find: '@trio/shared/inquiry', replacement: resolve(__dirname, '../shared/src/inquiry.ts') },
            { find: '@trio/shared/dashboard', replacement: resolve(__dirname, '../shared/src/dashboard.ts') },
            { find: '@trio/shared/blog-render', replacement: resolve(__dirname, '../shared/src/blog-render.ts') },
            { find: '@trio/shared/blog', replacement: resolve(__dirname, '../shared/src/blog.ts') },
            { find: '@trio/shared/carousel', replacement: resolve(__dirname, '../shared/src/carousel.ts') },
            { find: '@trio/shared/notice', replacement: resolve(__dirname, '../shared/src/notice.ts') },
            { find: '@trio/shared', replacement: resolve(__dirname, '../shared/src/index.ts') },
            { find: '@', replacement: resolve(__dirname, './src') },
            { find: 'react', replacement: resolve(__dirname, './node_modules/react') },
            { find: 'react-dom', replacement: resolve(__dirname, './node_modules/react-dom') },
        ],
    },
    server: {
        port: 5173,
        host: true,
        strictPort: true,
        allowedHosts: true,
    },
    preview: {
        port: 5173,
        host: true,
    },
});
