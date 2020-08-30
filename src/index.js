import './index.css'
// 获取当前打包 logo.jpg 后的路径
import logo from './p.jpg'

console.log(logo)   // file-loader 会生成一个打包后的路径返回

let img = document.createElement('img')
img.src = logo
document.body.appendChild(img)

// es6 -> es5
let b = [1, 2, 3].includes(2)    // 不能转化高级语法 实例上的语法 Promise

const fn = () => {
    
}
fn()

// 草案语法

@log
class A {
    a = 1     
}

function log(target) {

}

