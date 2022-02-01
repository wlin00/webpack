import { parse }  from "@babel/parser"
import traverse from "@babel/traverse"
import generate  from "@babel/generator"

// source - code
const code = `let a = 'let'; let b = 2`

// code转换成AST抽象语法树
const ast = parse(code, { sourceType: 'module' })

traverse(ast, {
  enter: item => {
    // 若判断当前代码节点是‘变量声明’，且当前变量声明为let， 则转换为var
    if (item.node.type === 'VariableDeclaration' && item.node.kind === 'let') {
      item.node.kind = 'var'
    }
  }
})

// 将ast重新转化生成新的代码
const result = generate(ast, {}, code)
console.log('result -- ', result)