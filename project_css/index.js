// 合理的循环引用
import a from './a.js'
import b from './b.js'
// 编写 css-loader ， style-loader 来支持css文件打包成js
import './style.css'
console.log(a.getB())
console.log(b.getA())