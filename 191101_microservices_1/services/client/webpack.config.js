const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const config = {
  mode: 'development',
  context: __dirname,
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ]
  },
  entry: path.resolve(__dirname, `src/client/index.ts`),
  output: {
    filename: `$client.dist.js`,
    path: path.resolve(__dirname, 'dist/client'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/client'),
  },
  module: {
    rules: [{
      test: /\.(js|jsx|ts|tsx)$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, `src/client/index.html`) }),
    new CleanWebpackPlugin(),
  ]
}

module.exports = config;
