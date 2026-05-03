import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@trio/shared/auth', replacement: path.resolve(__dirname, '../shared/src/auth.ts') },
            { find: '@trio/shared/inquiry', replacement: path.resolve(__dirname, '../shared/src/inquiry.ts') },
            { find: '@trio/shared/dashboard', replacement: path.resolve(__dirname, '../shared/src/dashboard.ts') },
            { find: '@trio/shared/blog-render', replacement: path.resolve(__dirname, '../shared/src/blog-render.ts') },
            { find: '@trio/shared/blog', replacement: path.resolve(__dirname, '../shared/src/blog.ts') },
            { find: '@trio/shared', replacement: path.resolve(__dirname, '../shared/src/index.ts') },
            { find: '@', replacement: path.resolve(__dirname, './src') },
        ],
    },
    server: {
        port: 5174,
        host: true,
        strictPort: true,
        watch: {
            usePolling: true,
        },
    },
    preview: {
        port: 5174,
        host: true,
    },
});
