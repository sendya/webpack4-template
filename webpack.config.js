const path = require('path'),
  Webpack = require('webpack'),
  WebpackBar = require('webpackbar'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const options = {
  entry: {
    bundle: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(le|sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/assets/'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        use: ['file-loader?name=/assets/fonts/[name].[ext]&']
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.less', '.css']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: false,
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: false, // 压缩空格
        removeAttributeQuotes: false, // 移除引号
        removeComments: true // 移除注释
      }
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 9000,
    compress: true,
    hot: true,
    open: true,
    inline: true,
    overlay: true,
    // It's a required option.
    // publicPath: "/assets",
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  stats: 'errors-only'
}

module.exports = function(env, argv) {
  return require('./.webpack/webpack.' + (argv.mode === 'production' ? 'prod' : 'dev') + '.conf.js')(options)
}
