// FileListPlugin - 用于emit阶段输出文件时，额外输出一个记录了本次打包依赖文件的md
class FileListPlugin {
  // 插件定义为一个类， 构造函数里可以获取配置项里的options
  constructor(options) {
  }
  // apply方法为webpack读取的入口方法
  apply(compiler) {
    // 监听webpack 输出文件的emit阶段 (这个阶段可以获取本次打包的编译compilation)
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      // create a header string for the generated file
      var fileList = 'In this build:\n\n'
      // loop through all compiled assets
      for (var filename in compilation.assets) {
        // compilation - 代表本次打包对应的‘编译’， key是模块对应名称
        // value 是一个存放其源代码的对象 { source: string, size: number }
        // 构造md 文件， 每隔一行记录一个本次打包的依赖文件
        fileList += '- ' + filename + '\n';
      }

      // Insert the list into the webpack build as a new file asset
      // 额外输出一个 filelist.md 文件
      compilation.assets['filelist.md'] = {
        source: function() { // 不用箭头函数， 为了让webpack的this读取到正确的函数作用域
          return fileList
        },
        size: function() {
          return fileList.length
        }
      }
      // plugin 最后执行回调通知weboack
      callback()
    })
  }
}

// 向外暴露插件
module.exports = FileListPlugin