const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');

/* 指定index.html自动引入打包后的js文件 */
const htmlPlugin = require('html-webpack-plugin');

/*抽离css文件*/
const extractTextPlugin = require("extract-text-webpack-plugin")

/*打包清楚未用到的css样式*/
const PurifyCSSPlugin = require("purifycss-webpack");

// 静态资源集中输出,比如文档,资料打包到dist下的指定文件夹
const copyWebpckPlugin = require('copy-webpack-plugin');

// webpack打包可视化图表
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack')

const glob = require('glob')

// console.log()
/*指定静态文件路径*/
if (process.env.type === 'build') {
    var website = {
        publicPath: "http://127.0.0.1:8887/"
    }
} else {
    var website = {
        publicPath: "http://127.0.0.1:8080/"
    }
}
module.exports = {
    entry: {
        // 分离第三方库
        jquery: 'jquery',
        vue: 'vue',
        entry: './src/entry.js',
        // main: './src/main.js',
        'vendor': ['vue', 'jquery']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[id].[chunkhash].js',
        publicPath: website.publicPath
    },
    resolve: {
        extensions: ['.js', 'vue', 'less', 'scss'],
        alias: {
            '@': path.resolve(__dirname, '..', 'src')
        }
    },
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: '127.0.0.1',
        //服务端压缩是否开启
        compress: true,
        inline: true,
        hot: true,
        //配置服务端口号
        port: 8080,
        //不跳转，在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        historyApiFallback: true,
    },
    devtool: 'evel-sourse-map',

    // 使用webpack --watch 来自动打包
    watchOptions: {
        //检测修改的时间，以毫秒为单位
        poll: 1000,
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregeateTimeout: 500,
        // 开发环境允许别的电脑访问
        disableHostCheck: true,
        //不监听的目录
        ignored: /node_modules/,
    },
    module: {
        rules: [ /* 解决在html中引入img标签的问题*/ {
                test: /\.(htm|html)$/i,
                use: [{
                        loader: 'html-loader',
                        options: {
                            root: path.resolve(__dirname, 'src'),
                            attrs: ['img:src', 'link:href']
                        }
                    },
                    // {
                    //     loader: 'html-withimg-loader'
                    // }
                ]
            }, {
                test: /\.(jsx|js)$/,
                exclude: /node_moudles/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // presets: ["es2015", "react"]
                        presets: ["env", "react"]
                    }
                },
            },
            {
                test: /\.vue$/,
                use: ["vue-loader"]
            }, {
                /**配置postcss-loader和css前缀补全 */
                test: /\.css$/,
                exclude: /node_moudles/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                // modules: true
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.less$/,
                exclude: /node_moudles/,
                use: extractTextPlugin.extract({
                    use: [{
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                exclude: /node_moudles/,
                use: extractTextPlugin.extract({
                    use: [{
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ],
                    fallback: "style-loader"
                })
            }, {
                test: /\.(png|jpg|gif)$/,
                exclude: /favicon\.png$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        outputPath: 'assets/images/',
                    }
                }]
            },
            {
                test: /favicon\.png$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].png'
                    }
                }]
            },
        ]
    },
    plugins: [
        // js compress 
        // need require uglifyjs-webpack-plugin
        new uglify(),

        // packing html file(一般必备)
        // need require uglifyjs-webpack-plugin
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: './src/index.html'
        }),

        // 打包分离css文件到css文件夹
        // packing and separate css file into css folders 
        new extractTextPlugin("assets/css/[name].[hash].css"),

        // 清楚打包后未使用的css样式
        // clear not use css style
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        }),

        // 全局引入jquery 或者 第三方库
        // global import jquery or third libraries
        new webpack.ProvidePlugin({
            $: "jquery"
        }),

        // 打包后文件添加注释
        // packing file add comment
        new webpack.BannerPlugin('zhouxin edit 2017/10/30 by 17:59'),

        // 打包的时候抽离第三方库
        // packing separate third libraries
        new webpack.optimize.CommonsChunkPlugin({
            // name对应入口文件中的名字，
            // name: ['jquery', 'vue', 'manifest'],
            name: ['vendor', 'manifest'],
            // 把文件打包到哪里，是一个路径
            // filename: "assets/js/[name].js",
            // 最小打包的文件模块数，这里直接写2就好
            minChunks: 2
        }),

        // 静态资源集中输出
        // static resouce export
        new copyWebpckPlugin([{
            from: __dirname + '/src/public',
            to: './public'
        }]),

        // webpack的热更新,只不过不是局部热更新
        new webpack.HotModuleReplacementPlugin(),

        // webpack打包可视化图表
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
        })
    ],

}