# webpack-base
初始化模板

- webpack 默认支持 模块的写法 commonjs 规范 node，也支持es6 规范 esModule
- webpack-cli 解析用户传递的参数
- 因为浏览器是不识别 这些规范的，所以通过 webpack 把这个模块 打包 解析出浏览器可以识别的代码



npx npm 5.2 之后出来的 npx webpack，可以在不下载全局安装webpack的情况下执行webpack命令，即安即删即用。



webpack 默认两个模式，开发模式、生产模式

可以使用 --mode 传入



npm  run scripts 里面可以配置对应的命令



## webpack.config.js

webpack 是基于nodejs 语法 commonjs 规范，所以内部用 commonjs 规范写法



环境

在package.json中配置

```package.json
"scripts": {
	"dev": "webpack --env.development",
	"build": "webpack --env.production"
},
```

在webpack.config.js中配置

```js
module.exports = env => {
    console.log(env)    // {development: true} 或 {production:true}
}
```



webpack配置文件默认叫 webpack.config.js  webpack.file.js



可以直接设置配置文件，如设置3个配置文件  webpack.base.js、webpack.dev.js、webpack.prod.js，然后通过--config 指定执行文件是哪一个，可以在webpack.base.js中配置会环境，也可以直接在这里设置好环境对应的文件webpack.dev.js、webpack.prod.js

```js
"scripts": {
    "dev": "webpack --env.development --config ./build/webpack.base.js",
    "build": "webpack --env.production --config ./build/webpack.base.js"
  },
```





webpack-merge 主要用来合并配置文件



如果是开发环境 要使用 webpack-dev-server

webpack-dev-server 是在内存中打包的，不会产生实体文件。那么有时候我们又想看看开发环境打包出来的文件是怎么样的，那么还是使用 webpack 进行打包

```js
"scripts": {
    "dev": "webpack-dev-server --env.development --config ./build/webpack.base.js",
    "dev：build": "webpack --env.development --config ./build/webpack.base.js",
    "build": "webpack --env.production --config ./build/webpack.base.js"
  },
```

![1598684262515](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1598684262515.png)





## Loader

### 解析 css



#### style-loader和css-loader



解析css 主要需要两个loader

- css-laoder 会解析css语法
- style-loader  会将解析的css 变成 style 标签插入到页面中

> 注意：这里解析css的过程中存在一个顺序，默认从下往上，或从右往左

```bash
npm i style-loader css-loader --save-dev
```

在webpack配置文件中配置如下

```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
    ]
},
```



#### 预处理器



css预处理器，

 .scss   node-sass   sass-loader   *匹配到 scss 结尾的使用 sass-loader 来调用 node-sass处理 sass 文件*

.less     less			less-loader

.stylus	 stylus	stylus-loader

```js
{  
    // 匹配到 scss 结尾的使用 sass-loader 来调用 node-sass处理 sass 文件
    test: /\s(c|a)ss$/,
    use: ['style-loader', 'css-loader', 'sass-loader']
}
```



#### css 文件中引入其他样式文件？



注意这里又有一个问题，比如

```css
/* 该文件是 css 文件 */
@import './a.scss'    /* 在css文件中引入了scss文件，这样为了能够解析css文件成功，我们需要对 css 结尾的文件如下配置 */
```

```js
{
    test: /\.css$/,
    use: [
    	'style-loader', 
        {
    		// 表示 如果 css 文件引入其他文件 @import 。 如 在 css 文件中引入了 .scss 文件，， 那么正常是不会解析的，所以我们要给 css-loader 增加配置，如下：
    		loader: 'css-loader',
    		options: {     
    			importLoaders: 1   // 表示的是 引入的文件 用该loader处理， 而 1 表示 当前loader的后面第一个，即 下面 的 sass-loader                        
     		}, 
        },
     	'sass-loader'
    ]
}
```



#### postcss-loader和autoprefixer



打包css 还需要处理一下 样式前缀

```bash
npm i postcss-loader autoprefixer --save-dev
```

webpack配置文件中配置

```js
{
    test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
},
```

在项目根路径下增加一个 `postcss.config.js` 文件，当然其实也是可以在 webpack配置文件的 loader 中进行设置的

```js
// postcss.config.js
//  默认自动添加前缀
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```

然后再新增一个 `.browserslistrc` 文件来表示对哪些浏览器进行

```js
// browserslistrc` 
cover 95%
```



#### 提取css单独成文件 mini-css-extract-plugin 插件



抽离css单独成为一个文件，需要使用 `mini-css-extract-plugin`这个插件

```bash
npm i mini-css-extract-plugin --save-dev
```

```js
// webpack.config.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                // 是不是开发环境 如果是就用 style-loader  生产环境 则需要抽离样式
                isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 
                'css-loader', 
                'postcss-loader'
            ]
        },
    ]
}

plugins: [
    // 生产环境 才使用这个插件， 抽离样式
    !isDev && new MiniCssExtractPlugin({
        filename: 'css/style.css'    // 会被抽离到css目录下 一个 style.css 文件
    })
]
```

但抽离出来的css 文件没有压缩，生产环境下打包，webpack 默认可以对js进行压缩，对css不会，所以我们需要进行配置和安装插件

```bash
npm i optimize-css-assets-webpack-plugin terser-webpack-plugin --save-dev
```

```js
// webpack.config.js  生产环境下
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',
    optimization: {  //优化项
        minimizer: [  // 可以放置压缩方案
            new OptimizeCssAssetsWebpackPlugin(),  
            new TerserWebpackPlugin()
        ],
    }
}
```

但是这里存在一个问题，就是 生产环境webpack默认会压缩js，但不会压缩css，但是当用了上面的插件，js就不会被压缩了，所以需要手动进行压缩，因此有需要用到 `terser-webpack-plugin` 插件，来进行手动压缩js文件



### 解析图片



```bash
npm i url-laoder file-loader --save-dev
```



```js
import logo from './p.jpg'

console.log(logo)   // file-loader 会生成一个打包后的路径返回    images/p.1ebc53bb31ed4f978ec1e1bcb32d9052.jpg
```

```js
// webpack.config.js

{
    test: /\.(jpe?g|png|gif)$/,
        //use: 'file-loader'   // file-loader 默认的功能是拷贝功能
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
}
```

`file-loader` 会将图片进行打包，并且会生成一个打包后的路径返回 ， file-loader 默认的功能是拷贝功能。

`url-loader` 会将图片转为 base64 格式，我们可以设置，如果图片小于某个大小则使用 base64 格式 `url-loader`， 否则还是使用 `file-laoder` 

- 缺点：转化后的图片会比以前大  
-  优点：就是不用发送http请求



###  解析图标



```js
{
    test: /\.(woff|ttf|eot|svg)$/,
    use: 'file-loader'
}
```



### 解析 js



es6 转为 es5 有些 api 不是 es6 语法，如装饰器、类的属性

babel 转化

默认会调用 `@babel/core` 会转化代码，转化的时候需要用 `@babel/preset-env` 转化成 es5

```bash
npm install -D babel-loader @babel/core @babel/preset-env
```

webpack上配置loader 

```js
// 解析 js 文件， 默认会调用@babel/core
{
    test: /\.js$/,
    use: 'babel-loader',
    exclude: /node_modules/
},
```

设置babel的配置文件，有以下几种方式配置

- 可以在 package.json 中配置
- webpack配置文件的 babel-loader中配置
- 在项目根路径下创建一个 配置文件，以下几种都可以
  - .babelrc
  - babel.config.js
  - babel.config.json
  - .babelrc.js

这里就暂时使用.babelrc举例

```json
{
    // presets 执行顺序是从下往上
    "presets": [  
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3                     
            }
        ]
    ],
    // plugins 执行顺序是从上往下
    "plugins": [   
        ["@babel/plugin-proposal-decorators", { "legacy": true }],   // 插件 装饰器
        ["@babel/plugin-proposal-class-properties", {"loose": true}],    // 插件 类
        "@babel/plugin-transform-runtime"
    ]
}
```

1. 首先 presets 执行顺序是从下往上 ，plugins 执行顺序是从上往下

2. 虽然现在基本的语法已经被装换了，对于部分不支持的新特性，我们也可以使用额外的插件来安装进行转化，但是对于对象一些 API 还是没有进行转化，如 `Array.prototype.includes` 等属性，此时就需要配置上 `useBuiltIns` 和 `corejs` 属性来转化相关的API。并且能做到按需加载， 哪个文件用到了，就转化哪些API等，不会像以前polyfill 那样，一骨脑全导入进来。

3. 有时，我们在a文件中引入了b文件， 而a中和b中都有 class 类， 如果不做处理，最后打包出来，每个文件都会进行 class 转义， 所以我们使用 `babel-plugin-transform-runtime`和 `@babel/runtime`， 来避免编译后的代码中出现重复的帮助程序，有效减少包体积。这样在用到的地方会通过 helper 函数 进行导入，不会重复转化

   ```bash
   npm install --save-dev @babel/plugin-transform-runtime   npm install --save @babel/runtime
   ```

   



### 解析 react vue

......



## 插件

### html-webpack-plugin

自动生成html文件并且引入打包后的js内容

```bash
npm i html-webpack-plugin -s
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'index.html',
        minify: !isDev && {     // 生产环境进行压缩 或者 一些性能处理，，  具体一些对html的处理的属性看文档
            removeAttributeQuotes: true,
            collapseWhitespace: true                // 折叠
            ...
        }
    }),
]

```



### clean-webpack-plugin

每次打包都会清空设置的内容，默认清空打包后的文件

```bash
npm i clean-webpack-plugin -s
```

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

plugins: [
    // 在每次打包前 先清楚 dist 目录下的文件
    new CleanWebpackPlugin(),   // 也可以设置清空哪些文件或目录下
]
```

