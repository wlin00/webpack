import { a } from '@/a' // 直接引入a
import { jsxDemo } from '@/jsx-demo.jsx';
import { tsDemo } from '@/ts-demo.ts'
import { tsxDemo } from '@/tsx-demo.tsx';

const b = import('@/b') // 动态引入b
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