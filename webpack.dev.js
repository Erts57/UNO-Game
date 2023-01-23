const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: "./src",
        compress: true,
        port: 3000,
        hot: true
    },
    optimization: {
        minimize: true
    }
});
