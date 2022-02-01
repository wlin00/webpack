import {parse} from '@babel/parser'
import * as babel from '@babel/core'

// source code of ES6
const code = `let a = 'a'; let b = '123'; const c = 22`

// 获取ast
const ast = parse(code, { sourceType: 'module' })

// 使用babel能力：transformFromAstSync() 转换es6为es5
const result = babel.transformFromAstSync(ast, code, {
  presets: ['@babel/preset-env']
})

// generate
console.log('result - es5', result.code)
