const test = require('ava')
const compiler = require('./compiler.js')
const fs = require('fs')
const path = require('path')
const defaultFileName = './input.jsx'

const write = (content, fileName) => {
  const dir = __dirname + '/input'
  try {
    fs.mkdirSync(dir)
  } catch(e) {}
  fs.writeFileSync(
    path.resolve(dir, fileName || defaultFileName),
    content,
    'utf-8'
  )
}

test.serial('woks', async t => {
  write('const a = "doctor-jones是一个“治疗”中英文混排格式的工具";')
  const stats = await compiler(`./input/${defaultFileName}`)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = "doctor-jones 是一个「治疗」中英文混排格式的工具";'

  t.is(output.trim(), expected.trim())
})

test.serial('respects options', async t => {
  write('const a = "doctor-jones是一个“治疗”中英文混排格式的工具";')
  const stats = await compiler(`./input/${defaultFileName}`, {
    formatOptions: {
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
  const stats = await compiler(`./input/${defaultFileName}`)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = `doctor${\'-\'}jones 是一个「治疗」中英文混排格式的工具`;'

  t.is(output.trim(), expected.trim())
})

test.serial('supports ts', async t => {
  write('const a: String = "doctor-jones是一个“治疗”中英文混排格式的工具";', 'input.ts')
  const stats = await compiler('./input/input.ts')
  const output = stats.toJson().modules[0].source
  const expected = 'var a = "doctor-jones 是一个「治疗」中英文混排格式的工具";'

  t.is(output.trim(), expected.trim())
})


test.serial('supports jsx', async t => {
  write('const a = <div>doctor-jones是一个“治疗”中英文混排格式的工具</div>;')
  const stats = await compiler(`./input/${defaultFileName}`)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = React.createElement("div", null, "doctor-jones 是一个「治疗」中英文混排格式的工具");'

  t.is(output.trim(), expected.trim())
})

test.serial('supports vue SFCs', async t => {
  write(`
<template>
  <div>doctor-jones是一个“治疗”中英文混排格式的工具</div>
</template>
<script>
  export default {
    data() {
      return {
        content: 'doctor-jones是一个“治疗”中英文混排格式的工具'
      }
    }
  }
</script>
`, 'input.vue')
  const stats = await compiler('./input/input.vue')
  const { modules } = stats.toJson().modules[0]
  const expected = 'doctor-jones 是一个「治疗」中英文混排格式的工具'
  const hits = modules.reduce((acc, cur) => {
    return acc + (
      cur.source.includes(expected) ? 1 : 0
    )
  }, 0)

  t.is(hits, 2)
})

test.serial('ignores import declarations', async t => {
  write('import dj from "../汉Eng";')
  const stats = await compiler(`./input/${defaultFileName}`)
  const output = stats.toJson().modules[0].source
  const expected = 'import dj from "../汉Eng";'

  t.is(output.trim(), expected.trim())
})

test.serial('ignores path strings', async t => {
  write('const a = require("../汉Eng");')
  const stats = await compiler(`./input/${defaultFileName}`)
  const output = stats.toJson().modules[0].source
  const expected = 'const a = require("../汉Eng");'

  t.is(output.trim(), expected.trim())
})

test.serial('ignores lines after disabling comments', async t => {
  write(`
// doctor-jones-disabled-line
const a = "doctor-jones是一个“治疗”中英文混排格式的工具";
  `)
  const stats = await compiler(`./input/${defaultFileName}`)
  const output = stats.toJson().modules[0].source
  const expected = `
// doctor-jones-disabled-line
const a = "doctor-jones是一个“治疗”中英文混排格式的工具";
  `

  t.is(output.trim(), expected.trim())
})
