// 异步替换依赖文件中的'hello' 为 'async'
module.exports = function(source) {
  const options = this.getOptions() // 可获取webpack选项
  const callback = this.async() // 从 webpack - this获取async方法，用于异步场景返回数据给webpack

  setTimeout(() => {
    const res = source.replace('hello', 'async')
    callback(null, res) // loader 返回异步处理后的值
  }, 500)
}