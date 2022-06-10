const EsLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const mode = 'production'
// const mode = 'development'

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
  // devtool: 'eval-cheap-module-source-map', // 不关心列信息 -> 获取经过loader处理后的es5代码 -> 每个模块用eval（）执行加速重构建 -> 报错信息精准；
  output: {
    filename: '[name].[contenthash].js', // 为输出的js添加hash，记得使用cleanWebpackPlugin 每次emit阶段清除dist
    path: path.resolve(__dirname, './dist')
  },
  // webpack优化配置，加快打包速度和体验等优化
  optimization: {
    // tree-shaking：在es-module中，只去打包项目使用的模块；
    // 如果需要在开发环境使用tree-shaking，（但webpack其实不会真正在开发环境去除不用的文件，而只是做标记），就配置usedExports: true
    // 并在 package.json 的 sideEffects 中配置上不希望tree-shaking掉的依赖
    // 若没有不想被shaking掉的包，则sideEffect设置为不去除css文件即可,如 "sideEffects": ["*.css"]
    usedExports: true,

    // 单独打包运行时文件（即webpack让浏览器中能运行我们打包代码所需要的额外代码）
    // 好处是：如果我们是单独打包运行时文件，在升级webpack版本等操作时（未动到文件源码）这样main.js没有改变，可以让用户依然使用main.js的缓存，为用户节省带宽降低打开页面用时，提升体验。
    runtimeChunk: 'single', 

    // 单独打包 node_modules引入的依赖 如 import React from 'react';
    // 1、由于react、vue这些依赖不常升级改变；所以在编译的时候，为了能缓存之前的依赖，我们配置splitChunks来单独打包 node依赖
    // 2、为了用户缓存考虑，类似runtime单独打包，若只升级node依赖、而源文件代码未改变，用户还是可以使用同一个main.js缓存，节省带宽；
    splitChunks: {
      cacheGroups: {
        vendor: {
          minSize: 0, // 不管这个node的包多小都单独打包
          test: /[\\/]node_modules[\\/]/, // 匹配/node_modules/ 和 \node_modules\
          name: 'vendors', // 单独打包输出到dist目录命名为 vendor.[hash]?.js
          chunks: 'all' // all 表示把来自node依赖的同步加载(initial)和异步加载(async)的都单独打包
        }
      }
    }
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