var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ManifestPlugin = require("webpack-manifest-plugin");
var PROD = process.env.NODE_ENV || "development";
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    entry: {
        admin_application: [
            "./resources/admin/js/application.js",
        ],
        admin_application_style: [
            "./resources/admin/css/application.scss",
        ],
        admin_login: [
            "./resources/admin/js/login.js",
        ],
        admin_login_style: [
            "./resources/admin/css/login.scss",
        ],
        app_login: [
            "./resources/app/js/login.js",
        ],
        app_login_style: [
            "./resources/app/css/login.scss",
        ],
        app_application: [
            "./resources/app/js/application.js",
        ],
        app_application_style: [
            "./resources/app/css/application.scss",
        ],
    },
    resolve: {
        alias: {
            vue$: `${__dirname}/node_modules/vue/dist/vue.esm.js`,
            router$: `${__dirname}/node_modules/vue-router/dist/vue-router.esm.js`
        },
        extensions: ['.js', '.vue', '.json', '.css', '.node'],
    },
    output: {
        filename: "[name].js",
        path: `${__dirname}/public/assets`
    },
    plugins: [
        new CleanWebpackPlugin([
            "public/assets"
        ], {
            verbose: false,
            watch: true
        }),
        new ExtractTextPlugin("[name].css"),
        /*new CopyWebpackPlugin(
            [{
                from: "./resources",
                to: ""
            }], {
                copyUnmodified: true,
                ignore: ["css/**", "js/**"]
            }
        ),*/
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(PROD),
            AUTH_ENDPOINTS: {
                "development": JSON.stringify("http://localhost:8080"),
                "production": JSON.stringify(""),
            }
        }),
        new ManifestPlugin({
            fileName: "manifest.json"
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: process.env.NODE_ENV === 'production',
                    loaders: {
                        js: 'babel-loader',
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                        scss: 'vue-style-loader!css-loader!sass-loader',
                    },
                },
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: { presets: ['es2015'] },
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: "file-loader"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=image/svg+xml"
            }
        ]
    }
};

if (PROD != "development") {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        })
    );
}
