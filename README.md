# doctor-jones-loader

<p align="center">
  <a href='https://app.codacy.com/app/Leopoldthecoder/doctor-jones-loader?utm_source=github.com&utm_medium=referral&utm_content=Leopoldthecoder/doctor-jones-loader&utm_campaign=Badge_Grade_Dashboard'><img src='https://img.shields.io/codacy/grade/cd461cedec7f4609870bb5d94439e286.svg?style=for-the-badge' alt='Codacy grade' /></a>
  <a href='https://github.com/Leopoldthecoder/doctor-jones/blob/master/LICENSE'><img src='https://img.shields.io/npm/l/doctor-jones.svg?style=for-the-badge' alt='Liscense' /></a>
  <a href='https://github.com/Leopoldthecoder'><img src='https://img.shields.io/badge/made%20with-%E2%9D%A4-ff69b4.svg?style=for-the-badge' alt='love' /></a>
  <br>
  <br>
  <span>Links</span>
  <br>
  <a href='https://www.npmjs.com/package/doctor-jones-loader'>npm Page</a>
  <br>
  <br>
  <span>Related Projects</span>
  <br>
  <a href='https://github.com/Leopoldthecoder/doctor-jones'>doctor-jones</a>
  <span> · </span>
  <span>To Be Developed...</span>
</p>

### Introduction

<p align="center">
  <img width="70%" src="https://user-images.githubusercontent.com/10095631/51251905-5e293c80-19d5-11e9-8332-80c86b8ea671.gif">
</p>

This is a webpack loader for [doctor-jones](https://github.com/Leopoldthecoder/doctor-jones), which formats your source code during compiling. Once configured, the following parts of your code can be formatted:
- string literals
- template strings
- JSX templates
- templates in .vue SFCs
- scripts in .vue SFCs

Don't worry if you're writing TypeScript, we've also got you covered.

### Installation

```bash
npm i doctor-jones-loader -D
```

### Configuration

The simplest example is:
```js
// webpack.config.js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'doctor-jones-loader'
          }
        ]
      }
    ]
  }
}
```

To pass format options for doctor-jones, use `formatOptions`. Click [here](https://github.com/Leopoldthecoder/doctor-jones#%E6%A0%BC%E5%BC%8F%E5%8C%96%E9%80%89%E9%A1%B9) to see which options doctor-jones supports.
```js
{
  // ...
  use: [
    {
      loader: 'doctor-jones-loader',
      options: {
        formatOptions: {
          spacing: false
        }
      }
    }
  ]
}
```

To add JSX support (suppose you're using React):
```js
// webpack.config.js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: [
          {
            loader: 'doctor-jones-loader',
            options: { formatOptions: {/* ... */} }
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
}
```

Note that we're putting doctor-jones-loader before babel-loader. This is because the loader chain is executed in reverse order.

To add Vue support:
```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: path.resolve(__dirname, '../index.js'),
            options: { formatOptions: {/* ... */} }
          },
          {
            loader: 'vue-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

To add TypeScript support:
```js
// webpack.config.js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: path.resolve(__dirname, '../index.js'),
            options: { formatOptions: {/* ... */} }
          },
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
}
```

### Disabling formatting
To keep a certain line intact, you can simply add a leading comment for that line:
```js
const str1 = 'doctor-jones是一个“治疗”中英文混排格式的工具'
// doctor-jones-disabled-line
const str2 = 'doctor-jones是一个“治疗”中英文混排格式的工具'

// str1 will be formatted while str2 will not
```
