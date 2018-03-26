const path = require("path");
const webpack = require ("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = env => {
    let plugins = [
        new ExtractTextPlugin("styles.css"),
        new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ];

    const productionVars = {
        plugins: [
            new ExtractTextPlugin({
                filename: "styles.css"
            })
        ],
        publicPath: ""
    };

    const pluginsAnalyze = [new BundleAnalyzerPlugin()];

    if (env.NODE_ENV === "production") {
        plugins = plugins.concat(productionVars.plugins);
    }

    if (env.ANALYZE_BUNDLE) {
        plugins = plugins.concat(pluginsAnalyze);
    }

    return {
        entry: "./src/index.js",
        output: {
            filename: "bundle.js",
            path: path.resolve (__dirname, "dist"),
            publicPath: env.NODE_ENV === "production" ? productionVars.publicPath : "",
            hotUpdateChunkFilename: "../hot/hot-update.js",
            hotUpdateMainFilename: "../hot/hot-update.json"
        },
        devtool: env.NODE_ENV === "production" ? false: "source-map",
        target: "web",
        plugins,
        devServer: {
            contentBase: path.join(__dirname, "./dist"),
            publicPath: "/",
            hot: true,
            compress: true,
            port: 3000,
            open: "http://localhost:3000"
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({ 
                        fallback: "style-loader", 
                        use: ["css-loader", "postcss-loader"] 
                    })
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: env.NODE_ENV === "production" ? ExtractTextPlugin.extract({ 
                        fallback: "style-loader", 
                        use: [ "css-loader", "postcss-loader", "sass-loader"] 
                    }) : ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
                },
                { 
                    test: /\.js$/, 
                    include: [path.resolve(__dirname, "src")],
                    exclude: /node_modules/, 
                    loader: "babel-loader" 
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: "file-loader?name=./[path][name].[ext]",
                            options: {}  
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 8192
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [{
                        loader: "file-loader?name=./[path][name].[ext]"
                    }]
                }
            ]
        }
    };
};

// module.exports = {
//     entry: "./src/index.js",
//     output: {
//         filename: "bundle.js",
//         path: path.resolve (__dirname, "dist")
//     },
//     devServer: {
//         contentBase: './dist',
//         hot: true
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.css$/,
//                 use: ExtractTextPlugin.extract({ 
//                     fallback: "style-loader", 
//                     use: ["css-loader", "postcss-loader"] 
//                 })
//             },
//             {
//                 test: /\.scss$/,
//                 use: ExtractTextPlugin.extract({ 
//                     fallback: "style-loader", 
//                     use: [ "css-loader", "postcss-loader", "sass-loader"] 
//                 })
//             },
//             { 
//                 test: /\.js$/, 
//                 exclude: /node_modules/, 
//                 loader: "babel-loader" 
//             },
//             {
//                 test: /\.(png|jpg|gif)$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {}  
//                     }
//                 ]
//             },
//             {
//                 test: /\.(png|jpg|gif)$/,
//                 use: [
//                     {
//                         loader: 'url-loader',
//                         options: {
//                             limit: 8192
//                         }
//                     }
//                 ]
//             }
//         ]
//     },
//     plugins: [
//         new ExtractTextPlugin("styles.css"),
//         new BundleAnalyzerPlugin(),
//         new webpack.DefinePlugin({
//             'process.env.NODE_ENV': JSON.stringify('production')
//         }),
//         new webpack.NamedModulesPlugin(),
//         new webpack.HotModuleReplacementPlugin()
//     ]
// };
