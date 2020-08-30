const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')   // 压缩css
const TerserWebpackPlugin = require('terser-webpack-plugin')     // 压缩js， 生产环境webpack默认会压缩js，但不会压缩css，但是当用了上面的插件，js就不会被压缩了，所以需要手动进行压缩，需要使用这个插件

module.exports = {
    mode: 'production',
    optimization: {  //优化项
        minimizer: [  // 可以放置压缩方案
            new OptimizeCssAssetsWebpackPlugin(),  // 存在一个问题，  默认 js 是会被压缩的，  用了这个 js 不会被压缩了， 我们需要 手动进行压缩， 需要安装 terser-webpack-plugin 插件进行 js 压缩
            new TerserWebpackPlugin()
        ],
    }
}