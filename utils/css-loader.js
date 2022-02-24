// 写成js+es5原因就是让loader.js可以在任何版本浏览器运行
const transform = (code) => {
  // 将代码转js， 并
  var code = `
  var str = ${JSON.stringify(code)}
  if (document) {
    var style = document.createElement('style')
    style.innerHTML = str
    document.head.appendChild(style)
  }
  `
  return code
}
module.exports = transform