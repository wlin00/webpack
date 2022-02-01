import {parse} from '@babel/parser'
import * as babel from '@babel/core'
import * as fs from 'fs'

// source code of ES6
const code = fs.readFileSync('./test.js').toString()

// 获取ast
const ast = parse(code, { sourceType: 'module' })

// 使用babel能力：transformFromAstSync() 转换es6为es5
const result = babel.transformFromAstSync(ast, code, {
  presets: ['@babel/preset-env']
})

// generate
fs.writeFileSync('./test.es5.js', result.code)
console.log('result - es5', result.code)
