const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const providePlugin = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
});


module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]_[local]_[hash:base64]",
                            sourceMap: true,
                            minimze: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [htmlPlugin, providePlugin]
};
