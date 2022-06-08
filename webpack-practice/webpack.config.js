const EsLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const mode = 'production'

// 简化代码 - 使用抽离函数统一处理css/scss/less
const useStyleLoader = (...loader) => [
  // 参数1根据当前环境判断，若是生产环境，则单独提取css文件为额外bundle
  mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
  { //提取css文件为单独bundle，在emitAssets阶段多导出一个css
    loader: 'css-loader', // 额外配置css-loader，将解析类型改为icss，从而支持js读取css导出变量
    options: {
      modules: {
        compileType: 'icss'
      }
    }
  }, 
  ...loader // 根据入参loader处理
]

module.exports = {
  mode,
  output: {
    filename: '[name].[contenthash].js', // 为输出的js添加hash，记得使用cleanWebpackPlugin 每次emit阶段清除dist
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    // emit阶段写文件前清空output目录，done阶段清空assets目录无用、过期的文件；
    new CleanWebpackPlugin(), 
    // 让webpack打包时，能使用Eslint去找到代码中的错误
    new EsLintPlugin( 
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ), 
    // 自动生成html页面
    new HtmlWebpackPlugin(),
    // 单独提取css文件，需要在对应css-loader前将MiniCssExtractPlugin.loader替换style-loader
    mode === 'production' && new MiniCssExtractPlugin({ 
      filename: '[name].[contenthash].css' // 为css添加hash
    }), 
  ].filter(Boolean), // 过滤plugins中为false（即未开启）的选项，这样的写法给各个插件提供了开关的功能
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
        use: useStyleLoader({
          loader: 'sass-loader',
          options: {
            additionalData: `@import '~@/scss-vars.scss';`, // 全局注入scss-vars.scss
            sassOptions: { // 若不配置alias，引入文件基于当前目录__dirname
              includePaths: [__dirname]
            }
          }
        })
      },
      { // 处理less文件，loader处理顺序, less-loader -> css-loader -> style-loader
        test: /\.less$/i, // 不区分大小写的匹配less
        use: useStyleLoader({
          loader: 'less-loader',
          options: {
            additionalData: `@import '~@/less-vars.less';`, // 全局注入less-vars.less
            lessOptions: { // 若不配置alias，引入文件基于当前目录__dirname
              includePaths: [__dirname]
            }
          }
        })
      }, 
      { // 处理css文件，loader处理顺序, css-loader -> style-loader
        test: /\.css$/i, // 不区分大小写的匹配scss / sass
        use: useStyleLoader()
      }
    ]
  }
}