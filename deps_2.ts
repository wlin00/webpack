// 遍历ast树，进行入口文件的依赖分析
// -- 每次分析后，遍历ast的时候判断若当前是import则对引入的文件再做一次分析（递归分析）

import { parse }  from "@babel/parser"
import traverse from "@babel/traverse"
import { readFileSync } from 'fs'
import { relative, resolve, dirname } from 'path'

// 设置根目录
const projectRoot = resolve(__dirname, 'project_2') // 获取项目根目录的绝对路径

// 类型设置
type DepRelation = { [key: string]: { deps: string[], code: string } }

// 初始化map
const depRelation:DepRelation = {}

// 获取文件相对于根目录的相对路径
const getProjectPath = (path: string) => { // 接收一个绝对路径，转换为如：index.js的项目路径
  return relative(projectRoot, path).replace(/\\/g, '/')
}

// 依赖收集函数
const collect = (filePath: string) => {
  // 获取当前收集文件的项目路径如：index.js
  const key = getProjectPath(filePath)
  // 获取源代码
  const code = readFileSync(filePath).toString()
  // 生成ast， 并将当前依赖放入map
  depRelation[key] = {
    deps: [],
    code,
  }
  const ast = parse(code, { sourceType: 'module' })

  // 遍历ast， 进行依赖分析&收集
  traverse(ast, {
    enter: path => {
      if (path.node.type === 'ImportDeclaration') {
        // path.node.source.value 往往是一个相对路径， 所以我们需要转绝对路径 - 再转项目路径，方便放入依赖map的deps
        const depAbsolutePath = resolve(dirname(filePath), path.node.source.value)
        const depProjctPath = getProjectPath(depAbsolutePath)
        // 依赖收集
        depRelation[key].deps.push(depProjctPath)

        // 递归分析
        collect(depAbsolutePath)
      }
    }
  })

}

// 依赖收集
collect(resolve(projectRoot, 'index.js')) // 函数参数是：人口文件的绝对路径

console.log(depRelation)

