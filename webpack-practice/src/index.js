import { a } from './a' // 直接引入a
const b = import('./b') // 动态引入b
import { jsxDemo } from './jsx-demo.jsx';
console.log('get - jsx', jsxDemo)

const fn = () => {
  console.log('test')
  console.log('a', a)
  console.log('b', b)
  console.log(Promise.resolve('test promise'))
}

fn()