const path = require('path')
const webpack = require('webpack')
const Memory = require('memory-fs')

module.exports = (fixture, options) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          use: [
            {
              loader: path.resolve(__dirname, '../index.js'),
              options
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-react']
              }
            }
          ]
        }
      ]
    }
  })

  compiler.outputFileSystem = new Memory()

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) reject(err)

      resolve(stats)
    })
  })
}
