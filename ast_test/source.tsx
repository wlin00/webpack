// source.tsx 用于作为ast工具函数的入口，工具会将文件代码转ast遍历生成新文件，新文件内部的log会携带上行列信息
console.log(1)
function log(): number {
  console.debug('before')
  console.error(2)
  console.debug('after')
  return 0
}
log()
class Foo {
  bar(): void {
    console.log(3)
  }
  render() {
    return ''
  }
}