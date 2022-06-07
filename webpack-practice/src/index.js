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


const b = import('@/b') // 动态引入b
console.log('vars', vars)
console.log('vars-css', varsCss)
console.log('vars-Less', varsLess)

const fn = () => {
  console.log('test')
  console.log('a', a)
  console.log('b', b)
  console.log(Promise.resolve('test promise'))
}

fn()