import * as glob from 'glob';
import { extname, relative, resolve } from 'path';
import { defineConfig, normalizePath } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { fileURLToPath } from 'node:url';
import queryStringHash from './resources/assets/js/build/vite-plugin-query-string-hash';

var jsEntries = Object.fromEntries(
    glob.sync('./resources/assets/js/*.js').map(file => [
        // This remove `src/` as well as the file extension from each file, so e.g.
        // src/nested/foo.js becomes nested/foo
        normalizePath(relative('./resources', file.slice(0, file.length - extname(file).length))),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
    ])
);

var cssEntries = Object.fromEntries(
    glob.sync('./resources/assets/scss/*.scss').map(file => [
        // This remove `src/` as well as the file extension from each file, so e.g.
        // src/nested/foo.js becomes nested/foo
        normalizePath(relative('./resources/assets/scss', file.slice(0, file.length - extname(file).length)) + '.css'),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
    ])
);

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: false,
    root: "resources",
    build: {
        outDir: "../public",
        write: true,
        emptyOutDir: false,
        manifest: 'assets/manifest.json',
        target: "es2015",
        cssCodeSplit: true,
        rollupOptions: {
            input: { ...jsEntries, ...cssEntries },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').at(-1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
                        extType = 'images';
                    } else if (/ttf|otf|eof|eot|woff|woff2/.test(extType)) {
                        extType = "fonts";
                    }
                    return `assets/${extType}/[name].[ext]`;
                },
                chunkFileNames: 'assets/js/_chunks/[name]-[hash].js',
                sourcemapFileNames: (chunk) => {
                    if (!chunk.isEntry && chunk.name.indexOf('assets') !== 0) {
                        return 'assets/js/_chunks/[name].js.map';
                    }
                    return '[name].js.map';
                }
            },
            external: ['vue']
        }
    },
    plugins: [vue(), queryStringHash()],
})
