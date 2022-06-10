
// 使用tree-shaking 来去除es-module中未使用的依赖
import { add } from '@/math.js'

// 多页面里，不同入口文件引入同一个文件, 记得使用common chunks优化
import { shared } from '@/shared.ts'
console.log('index-shared', shared)
console.log('admin')
console.log(add(6,5))