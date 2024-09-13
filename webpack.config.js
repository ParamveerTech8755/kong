const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  mode: 'development',
  entry: path.join(__dirname, "src", "index.jsx"),
  output: {
    path:path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-syntax-jsx']
          }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
}