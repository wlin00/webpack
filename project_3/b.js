import a from './a.js'
const b = {
  value: 'b',
  getA: () => a.value + 'from a.js'
}
export default b