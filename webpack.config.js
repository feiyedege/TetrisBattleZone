var path = require("path");
module.exports = {
    entry: {
        app: ["./react/main.js"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {             //loader
        loaders:[
            {
                test:/.jsx?$/,
                loaders:"babel-loader",
                exclude:["/node_modules/","public"]
            }
        ]
    }
};