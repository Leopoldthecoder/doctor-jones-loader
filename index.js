const { parse } = require('babel-eslint')
const dj = require('doctor-jones')
// const fs = require('fs')

const getReplacer = quote => (match, p1) => {
  return isPath(p1) ? match : `${quote}${dj(p1)}${quote}`
}
const isPath = string =>
  /^((\.\.\/)*|((\.)?\/))([^/\s]+\/)+[^/\s]*$/.test(string)

const traverse = (obj, parents, nodes) => {
  const keys = Object.keys(obj)
  parents.push(obj)
  keys.forEach(key => {
    const value = obj[key]
    const type = Object.prototype.toString.call(value)
    if (
      key === 'type' &&
      (value === 'Literal' || value === 'TemplateElement')
    ) {
      nodes.push(obj)
      return
    }
    if (type === '[object Object]') {
      traverse(value, parents, nodes)
    } else if (type === '[object Array]') {
      value.forEach(el => {
        traverse(el, parents, nodes)
      })
    }
  })
}

module.exports = function(source) {
  // const path = this.resourcePath
  const nodesNeedFormatting = []
  parse(source).body.forEach((node, index) => {
    const parents = []
    const nodes = []
    traverse(node, parents, nodes)
    if (
      !parents.some(parent => {
        const { type, leadingComments = [{ value: '' }] } = parent
        return (
          leadingComments[leadingComments.length - 1].value.trim() ===
            'doctor-jones-disabled-line' || type === 'ImportDeclaration'
        )
      })
    ) {
      nodesNeedFormatting.push(nodes)
    }
  })
  // console.log(nodesNeedFormatting)
  const output = source
    .replace(/'(.+)'/g, getReplacer("'"))
    .replace(/"(.+)"/g, getReplacer('"'))
    .replace(/`(.+)`/g, getReplacer('`'))
  // if (output !== source) {
  //   fs.writeFileSync(path, output)
  // }
  return output
}
