const path = require("path");
const { defineConfig } = require("vite");
import Banner from "vite-plugin-banner";
import pkg from "./package.json";

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
        terserOptions: {
            output: {
                comments: function (node, comment) {
                    var text = comment.value;
                    var type = comment.type;
                    if (type == "comment2") {
                        // multiline comment
                        return "hi";
                    }
                },
            },
        },
    },
    plugins: [
        Banner(
            `/**\n * ${pkg.name} v${pkg.version}\n * ${pkg.description}\n * Copyright (c) ${pkg.year} ${pkg.author}\n * ${pkg.homepage}\n */`
        ),
    ],
});
