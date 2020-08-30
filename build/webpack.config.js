const path = require('path')

// module.exports = {
//     // 模式
//     mode: 'development',
//     // 入口、出口
//     entry: path.resolve(__dirname, './src/index.js'),
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, 'dist')
//     }
// }

// 一般情况下 我们分为两个模式 一个开发模式  一开生产模式
// 基本配置
module.exports = env => {
    console.log(env)
    // 函数要返回配置文件，没返回会采用默认配置
    
}