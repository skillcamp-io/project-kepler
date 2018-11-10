const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Probably not ideal, but this way we can use MiniCssExtractPlugin when the env is Prod
const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  // Copy over our assets so they're publicly available
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'assets', '**', '*'),
      to: path.resolve(__dirname, 'build')
    }
  ]),
  // We define a few global vars, necessary so Phaser works with Webpack
  new webpack.DefinePlugin({
    'typeof CANVAS_RENDERER': JSON.stringify(true),
    'typeof WEBGL_RENDERER': JSON.stringify(true)
  }),
  // HtmlWebpackPlugin handles injecting our bundles and creating the index.
  new HtmlWebpackPlugin({
    title: 'Project Kepler',
    template: 'src/html/index.html',
    hash: true
  })
];

// If we're in prod, use the MiniCssExtractPlugin to extract the css per js file (to lazy load our css)
// Probably overkill, we can remove this
if (isProduction) {
  plugins.push(new MiniCssExtractPlugin());
}

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].[chunkhash].bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: [ /\.vert$/, /\.frag$/ ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/,
        use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'less-loader'
        ],
      },
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'build')
  },

  plugins: plugins,

  mode: isProduction ? 'production' : 'development',

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: chunk => chunk.name == 'main',
          reuseExistingChunk: true,
          priority: 1,
          test: module =>
            /[\\/]node_modules[\\/]/.test(module.context),
          minChunks: 1,
          minSize: 0,
        },
      },
    },
  },
};