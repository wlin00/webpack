const EsLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(), // emit阶段写文件前清空output目录，done阶段清空assets目录无用、过期的文件；
    new EsLintPlugin( // 让webpack打包时，能使用Eslint去找到代码中的错误
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ), 
  ],
  resolve: {
    alias: { // 若webpack发现@符号，则默认找到当前目录下src
      '@': path.resolve(__dirname, './src/')
    }
  },
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
      },
      { // 处理scss文件，loader处理顺序, sass-loader -> css-loader -> style-loader
        test: /\.s[ac]ss$/i, // 不区分大小写的匹配scss / sass
        use: ['style-loader', {
          loader: 'css-loader', // 额外配置css-loader，将解析类型改为icss，从而支持js读取css导出变量
          options: {
            modules: {
              compileType: 'icss'
            }
          }
        }, {
          loader: 'sass-loader',
          options: {
            additionalData: `@import '~@/scss-vars.scss';`, // 全局注入scss-vars.scss
            sassOptions: { // 若不配置alias，引入文件基于当前目录__dirname
              includePaths: [__dirname]
            }
          }
        }]
      },
      { // 处理less文件，loader处理顺序, less-loader -> css-loader -> style-loader
        test: /\.less$/i, // 不区分大小写的匹配less
        use: ['style-loader', {
          loader: 'css-loader', // 额外配置css-loader，将解析类型改为icss，从而支持js读取css导出变量
          options: {
            modules: {
              compileType: 'icss'
            }
          }
        }, {
          loader: 'less-loader',
          options: {
            additionalData: `@import '@/less-vars.less';`, // 全局注入scss-vars.scss
            lessOptions: { // 若不配置alias，引入文件基于当前目录__dirname
              includePaths: [__dirname]
            }
          }
        }]
      }, 
      { // 处理css文件，loader处理顺序, css-loader -> style-loader
        test: /\.css$/i, // 不区分大小写的匹配scss / sass
        use: ['style-loader', {
          loader: 'css-loader', // 额外配置css-loader，将解析类型改为icss，从而支持js读取css导出变量
          options: {
            modules: {
              compileType: 'icss'
            }
          }
        }]
      }
    ]
  }
}