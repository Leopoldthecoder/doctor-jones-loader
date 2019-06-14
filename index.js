const { parse } = require('babel-eslint')
const { getOptions } = require('loader-utils')
const validateOptions = require('schema-utils')
const dj = require('doctor-jones')
const spliceString = require('splice-string')
const optionSchema = require('./schema')

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
  const options = getOptions(this) || {}
  validateOptions(optionSchema, options, 'doctor-jones-loader')

  const nodesNeedFormatting = []
  parse(source).body.forEach(node => {
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

  const flatNodes = nodesNeedFormatting
    .reduce((acc, cur) => acc.concat(cur), [])
    .filter(
      node =>
        !!node && // node 存在
        node.value !== null && // value 存在
        typeof node.value !== 'number' // 过滤模板字符串中的数字字面量
    )
    .sort((a, b) => (a.start > b.start ? -1 : 1))

  flatNodes.forEach(node => {
    const { value, start, end } = node
    if (isPath(value)) {
      return
    }
    source = spliceString(
      source,
      start,
      end - start,
      dj(
        source
          .slice(start, end)
          // 将被转义的汉字字符转化为原汉字
          .replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
            return p1 ? String.fromCodePoint(parseInt(p1, 16)) : match
          }),
        options.djOptions
      )
    )
  })

  return source
}
