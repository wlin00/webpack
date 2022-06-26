// 同步替换输出文件中的'hello' 为 'sync'
module.exports = function(source) {
  return source.replace('hello', 'sync')
}