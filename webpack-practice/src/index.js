import { a } from '@/a' // 直接引入a
import { jsxDemo } from '@/jsx-demo.jsx';
import { tsDemo } from '@/ts-demo.ts'
import { tsxDemo } from '@/tsx-demo.tsx';
import varsCss from '@/css-demo.css'
// test - scss
import '@/scssDemo.scss'
import vars from '@/scss-export.scss'
// test - less
import '@/lessDemo.less'
import varsLess from '@/less-export.less'
// 使用tree-shaking 来去除es-module中未使用的依赖
import { add } from '@/math.js'
// 多页面里，不同入口文件引入同一个文件, 记得使用common chunks优化
import { shared } from '@/shared.ts'

console.log('hello world') // 测试loader：替换hello为sync / async
console.log('index-shared', shared)
console.log('math', add(3,1))
const b = import('@/b') // 动态引入b
console.log('vars', vars)
console.log('vars-css', varsCss)
console.log('vars-Less', varsLess)
console.log('get - jsx', jsxDemo)
console.log('get - ts', tsDemo)
console.log('get - tsx', tsxDemo)

const fn = () => {
  console.log('test')
  console.log('a', a)
  console.log('b', b)
  console.log(Promise.resolve('test promise'))
}
fn()

// 应用service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(() => {
      console.log('registered')
    }).catch((err) => {
      console.log('registered err', err)
    })
  })
}