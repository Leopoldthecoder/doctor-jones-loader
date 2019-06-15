module.exports = {
  entry: 'src/index',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              // change the next line to `loader: 'doctor-jones-loader'` in your project
              loader: require('path').resolve('../index.js'),
              options: {
                formatOptions: {
                  replaceWithCornerQuotes: 'single'
                }
              }
            }
          ]
        }
      ]
    }
  },
  plugins: [
    {
      resolve: '@poi/plugin-eslint'
    }
  ]
}
