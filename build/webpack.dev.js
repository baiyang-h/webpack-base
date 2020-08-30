const path = require('path')

module.exports = {
    mode: 'development',
    devServer: {
        port: 7000,
        compress: true,   // gzip 可以提升返回页面的速度  压缩
        contentBase: path.resolve(__dirname, '../dist'),    // webpack 启动服务会在 dist 目录下
        // publicPath: '/aa'
    }
}