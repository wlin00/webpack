// math.js向外部暴露多个计算方法， 若在外部index.js里只用到其中的一个，则webpack使用tree-shaking 去除未使用的
export const add = (a, b) => {
  console.log('add-method')
  return a + b
}

export const minus = (a, b) => {
  console.log('minus-method')
  return a - b
}
