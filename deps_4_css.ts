// 该文件模拟webpack打包核心功能，
  // 1、支持包括IE的浏览器运行ES6的代码，转换为es5；
  // 2、把所有文件打包成一个js，可直接任意浏览器中运行；
  // 3、depRelation数据结构改为一个对象数组，第一项为入口文件，作为collect递归依赖分析方法的入参。
  // 4、写一个generateCode方法来生成一个可运行的单js文件
  // 5、支持loader的形式打包css
// 可使用 node -r ts-node/register 文件路径 来运行，

import { parse }  from "@babel/parser"
import traverse from "@babel/traverse"
import { readFileSync, writeFileSync } from 'fs'
import { relative, resolve, dirname } from 'path'
import * as babel from '@babel/core'

// 设置根目录
const projectRoot = resolve(__dirname, 'project_css') // 获取项目根目录的绝对路径

// 类型设置
type DepRelation = { key: string, deps: string[], code: string  }[]

// 初始化map
const depRelation:DepRelation = []

// 获取文件相对于根目录的相对路径
const getProjectPath = (path: string) => { // 接收一个绝对路径，转换为如：index.js的项目路径
  return relative(projectRoot, path).replace(/\\/g, '/')
}

// 依赖收集函数
const collect = (filePath: string) => {
  // 获取当前收集文件的项目路径如：index.js
  const key = getProjectPath(filePath)
  if (depRelation.find(item => item.key === key)) {
    console.warn(`duplicated dependency: ${key}`) // 监测到重复key 不进行依赖收集
    return
  }
  // 获取源代码 - 通过babel/core的能力将代码转换为兼容的es5版本 - import 转为 require， export转为exports['default'] = aaa
  let code = readFileSync(filePath).toString()
  // 判断当前解析的项目路径（如a.js / a.css)是不是一个css文件
  if (/.css$/.test(filePath)) {
    code = require('./utils/css-loader')(code)
  }
  const { code: es5Code } = babel.transform(code, {
    presets: ['@babel/preset-env']
  })
  // 生成ast， 并将当前依赖放入depRelation中
  const dependency = {
    key,
    deps: [],
    code: es5Code,
  }
  depRelation.push(dependency)
  const ast = parse(code, { sourceType: 'module' })

  // 遍历ast， 进行依赖分析&收集
  traverse(ast, {
    enter: path => {
      if (path.node.type === 'ImportDeclaration') {
        // path.node.source.value 往往是一个相对路径， 所以我们需要转绝对路径 - 再转项目路径，方便放入依赖map的deps
        const depAbsolutePath = resolve(dirname(filePath), path.node.source.value)
        const depProjctPath = getProjectPath(depAbsolutePath)
        // 依赖收集
        // depRelation[key].deps.push(depProjctPath)
        dependency.deps.push(depProjctPath)

        // 递归分析
        collect(depAbsolutePath)
      }
    }
  })

}

// 依赖收集
collect(resolve(projectRoot, 'index.js')) // 函数参数是：人口文件的绝对路径

console.log(depRelation)

// 收集完后， 根据产出的依赖对象数组，产出一个可独立运行js代码，可通过writeFileSync写入文件。
/** 最终文件主要内容
  var depRelation = [ 
    {key: 'index.js', deps: ['a.js', 'b.js'], code: function... },
    {key: 'a.js', deps: ['b.js'], code: function... },
    {key: 'b.js', deps: ['a.js'], code: function... }
  ] 
  var modules = {} // modules 用于缓存所有模块
  execute(depRelation[0].key) // 运行入口文件
  function execute(key){
    var require = ... // 引入模块即运行一次模块即可
    var module = ...
    item.code(require, module, module.exports)
    ...
  }
 * 
 */
const generateCode = () => {
  let code = ''
  code += 
    'var depRelation = ['
    + depRelation.map((item) => {
      const { key, deps, code } = item
      return `{
        key: ${JSON.stringify(key)},
        deps: ${JSON.stringify(deps)},
        code: function(require, module, exports){
          ${code}
        }
      }`
    }).join(',')
    + '];\n'
  code += `var modules = {};\n`
  code += `execute(depRelation[0].key)\n`
  code += `
    function execute(key) { // 找到传入key的依赖，运行内部代码
      if (modules[key]) { return modules[key] } // 若模块中有该key，直接返回
      var dependency = depRelation.find((item) => item.key === key)
      if (!dependency) {
        throw new Error(\`\${key} is not found\`)
      }
      var pathToKey = (path) => {
        var dirname = key.substring(0, key.lastIndexOf('/') + 1)
        var projectPath = (dirname + path).replace(\/\\.\\\/\/g, '').replace(\/\\\/\\\/\/, '/')
        return projectPath
      }
      var require = (path) => {
        return execute(pathToKey(path))
      }
      modules[key] = { __esModule: true } // 缓存当前模块
      var module = { exports: modules[key] } // module用于CommonJs的兼容和约定写法
      dependency.code(require, module, module.exports)
      return modules[key]
    }
  `
  return code
}

writeFileSync('dist.js', generateCode())

