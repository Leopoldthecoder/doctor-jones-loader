const test = require('ava')
const compiler = require('./compiler.js')
const fs = require('fs')
const path = require('path')
const inputFileName = './input.jsx'

const write = content => {
  fs.writeFileSync(path.resolve(__dirname, inputFileName), content, 'utf-8')
}

test.serial('woks', async t => {
  write('const a = "doctor-jones是一个“治疗”中英文混排格式的工具";')
  const stats = await compiler(inputFileName)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = "doctor-jones 是一个「治疗」中英文混排格式的工具";'

  t.is(output.trim(), expected.trim())
})

test.serial('respects options', async t => {
  write('const a = "doctor-jones是一个“治疗”中英文混排格式的工具";')
  const stats = await compiler(inputFileName, {
    djOptions: {
      spacing: false,
      replaceWithCornerQuotes: 'single'
    }
  })
  const output = stats.toJson().modules[0].source
  const expected = 'const a = "doctor-jones是一个『治疗』中英文混排格式的工具";'

  t.is(output.trim(), expected.trim())
})

test.serial('supports template strings', async t => {
  write('const a = `doctor${\'-\'}jones是一个“治疗”中英文混排格式的工具`;')
  const stats = await compiler(inputFileName)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = `doctor${\'-\'}jones 是一个「治疗」中英文混排格式的工具`;'

  t.is(output.trim(), expected.trim())
})


test.serial('supports jsx', async t => {
  write('const a = <div>doctor-jones是一个“治疗”中英文混排格式的工具</div>;')
  const stats = await compiler(inputFileName)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = React.createElement("div", null, "doctor-jones 是一个「治疗」中英文混排格式的工具");'

  t.is(output.trim(), expected.trim())
})

test.serial('ignores import declarations', async t => {
  write('import dj from "./汉Eng";')
  const stats = await compiler(inputFileName)
  const output = stats.toJson().modules[0].source
  const expected = 'import dj from "./汉Eng";'

  t.is(output.trim(), expected.trim())
})

test.serial('ignores path strings', async t => {
  write('const a = require("./汉Eng");')
  const stats = await compiler(inputFileName)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = require("./汉Eng");'

  t.is(output.trim(), expected.trim())
})

test.serial('ignores lines after disabling comments', async t => {
  write(`
// doctor-jones-disabled-line
const a = "doctor-jones是一个“治疗”中英文混排格式的工具";
  `)
  const stats = await compiler(inputFileName)
  const output = stats.toJson().modules[0].source
  const expected = `
// doctor-jones-disabled-line
const a = "doctor-jones是一个“治疗”中英文混排格式的工具";
  `

  t.is(output.trim(), expected.trim())
})
