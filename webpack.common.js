const path = require("path");
const json5 = require("json5");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: {
        index: {
            import: path.resolve(__dirname, "src/index.js")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            favicon: path.resolve(__dirname, "src/images/unocard.png")
            //favicon: path.resolve(__dirname, "public/favicon.ico")
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css"
        })
    ],
    output: {
        publicPath: "auto",
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[contenthash].js",
        assetModuleFilename: "images/[hash][ext][query]",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]]
                    }
                }
            },
            {
                test: /\.scss$/i,
                use: [
                    process.env.NODE_ENV === "development"
                        ? "style-loader"
                        : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: "asset/resource"
            },
            {
                test: /\.svg/,
                type: "asset/inline"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
            {
                test: /\.txt/,
                type: "asset"
            },
            {
                test: /\.json5$/i,
                type: "json",
                parser: {
                    parse: json5.parse
                }
            }
        ]
    },
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        },
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
};
