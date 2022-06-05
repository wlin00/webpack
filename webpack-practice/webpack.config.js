const EsLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(), // emit阶段写文件前清空output目录，done阶段清空assets目录无用、过期的文件；
    new EsLintPlugin( // 让webpack打包时，能使用Eslint去找到代码中的错误
      { extensions: ['.js', '.jsx'] }
    ), 
  ],
  module: {
    rules: [
      {
        // 用babel-loader来处理js/jsx文件，而非用webpack默认能力打包
        // 这样方便拓展更多能力
        test: /\.[tj]sx?$/,
        exclude: /node_modules/, // 遇到node_modules文件不处理，因为这些文件都默认打包过
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'], // 使用babel-loader预设能力处理js文件，env是根据环境自动变化的一个推荐包
              ['@babel/preset-react', { runtime: 'classic' }], // 使用babel的预设react配置，让webpack支持打包jsx
              ['@babel/preset-typescript'], // 使用babel-loader预设能力处理ts文件
            ]
          }
        }
      }
    ]
  }
}