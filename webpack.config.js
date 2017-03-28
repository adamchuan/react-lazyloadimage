var path = require('path')

module.exports = {
  resolve: {
    alias: {
      'react': path.join(__dirname, './node_modules/react/dist/react.min.js'),
      'react-dom': path.join(__dirname, './node_modules/react-dom/dist/react-dom.min.js')
    },
  },
  entry: {
      'imglazyload': "./src/index.js",
      'test': "./test/index.js",
  },
  output: {
      path: path.join(__dirname, "lib"),
      filename: "[name].build.js"
  },
  devServer: {
    contentBase: './test',
    publicPath: '/assets/',
    // hot: true,
    port: 80,
    proxy: {
      "/cgi-bin": {
        "target": {
          "host": "now.qq.com",
          "protocol": 'http:',
          "port": 80
        },
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader('Referer', 'http://now.qq.com/');
        },
        onProxyRes(proxyRes, req, res) {
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        },
        changeOrigin: true,
        secure: false
      }
    },
  },
  plugins: [],
  module: {
    loaders: [ {
      test: /\.js|jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [ 'react', 'es2015', 'stage-0' ]
      }
    }, {
      test: /\.json$/,
      loader: 'json'
    } ]
  }
}