const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types') // 为解析tsx ，使用babel的预设插件
const fs = require('fs')
const fileName = 'source.tsx' // 工具的入口文件名

// 读取文件
const source = fs.readFileSync(`${__dirname}/${fileName}`).toString()

// 使用parse转tsx代码为ast
const ast = parse(source, { 
  sourceType: 'module', 
  plugins: ['typescript', 'jsx'], // 使用typescript & jsx插件解析tsx
 })

 // 遍历ast，对相应节点做处理（对console.log / console.error 特殊处理）
 traverse(ast, {
   // enter 可做入口依赖分析
   CallExpression: path => { // 一旦遇到节点是一个调用表达式：拿到函数调用的表达式，path代表节点信息
    // 判断当前调用表达式是log / error时特殊处理
    const calleeStr = generate(path.node.callee).code
    if (['console.log', 'console.error'].includes(calleeStr)) {
      // 给log/error的调用表达式节点，添加行列信息
      const { line, column } = path.node.loc.start
      path.node.arguments.unshift(types.stringLiteral(`${fileName}(${line}, ${column})`)) // 在ast中加入的不是字符串而是一个类型
    }
   }
 })

 // 将ast重新转化生成新的代码
const result = generate(ast, {}, source).code
console.log('result -- ', result)
