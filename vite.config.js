const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            name: "Kalidokit",
            fileName: (format) => `kalidokit.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            exports: "named",
            external: [],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {},
            },
        },
    },
});
