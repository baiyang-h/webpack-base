const path = require('path')
const {merge} = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const dev = require('./webpack.dev')
const prod = require('./webpack.prod')

module.exports = env => {  
    
    // env 是环境变量
    let isDev = env === "development" ? true : false;

    // 默认配置
    const base = {
        entry: path.resolve(__dirname, '../src/index.js'),
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, '../dist')
        },
        module: {
            rules: [
                // 解析 js 文件， 默认会调用@babel/core
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                // postcss-loader  增加一个 postcss-config-js 文件来设置配置项(也可以在这里设置plugin配置)     新增一个.browserslistrc文件来设置浏览器版本 
                {
                    test: /\.css$/,
                    use: [
                        // 是不是开发环境 如果是就用 style-loader  生产环境 则需要抽离样式
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 
                        'css-loader', 
                        'postcss-loader'
                    ]
                },
            /*
                {
                    test: /\.css$/,
                    use: [
                        'style-loader', 
                        {
                            // 表示 如果 css 文件引入其他文件 @import 。 如 在 css 文件中引入了 .scss 文件，， 那么正常是不会解析的，所以我们要给 css-loader 增加配置，如下：
                            loader: 'css-loader',
                            options: {     
                                importLoaders: 2  // 表示的是 引入的文件 用该loader处理， 而 2 表示 当前loader的后面第二个，即 下面 的 sass-loader                        }
                            }, 
                        },
                        'postcss-loader'
                        'sass-loader'
                    ]
                }
                */
                /*
                // 匹配到 scss 结尾的使用 sass-loader 来调用 node-sass处理 sass 文件
                {  
                    test: /\s(c|a)ss$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
                }
                */
               // file-loader 会将图片进行打包，并且会生成一个打包后的路径返回
               {
                   test: /\.(jpe?g|png|gif)$/,
                //    use: 'file-loader'   // file-loader 默认的功能是拷贝功能
                    use: {
                        loader: 'url-loader',
                        options: {
                            name: 'images/[name].[contentHash].[ext]',
                            // 如果大于 8k 的图片会默认使用 file-loader， 小于会使用 url-loader
                            limit: 8 * 1024         
                        }
                    }
                    /*  
                    我希望当前比较小的图片可以转化成 base64， 那么我们需要使用 url-loader
                        缺点：转化后的图片会比以前大  
                        优点：就是不用发送http请求
                    */
               },
               {
                   test: /\.(woff|ttf|eot|svg)$/,
                   use: 'file-loader'
               }
            ]
        },
        plugins: [
            // 在每次打包前 先清楚 dist 目录下的文件
            new CleanWebpackPlugin(),   // 也可以设置清空哪些文件或目录下
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                minify: !isDev && {     // 生产环境进行压缩 或者 一些性能处理，，  具体一些对html的处理的属性看文档
                    removeAttributeQuotes: true,
                    collapseWhitespace: true                // 折叠
                    // ...
                }
            }),
            // 生产环境 才使用这个插件， 抽离样式
            !isDev && new MiniCssExtractPlugin({
                filename: 'css/style.css'
            })
        ].filter(Boolean)
    }

    if(isDev) {   // 开发环境 
         return merge(base, dev)
    } else { 
        return merge(base, prod)   // mode 生产环境 会默认进行压缩， 开发不会压缩
    }
} 