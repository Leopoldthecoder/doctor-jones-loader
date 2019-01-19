const test = require('ava')
const compiler = require('./compiler.js')
const fs = require('fs')
const path = require('path')

test('init test', async t => {
  const stats = await compiler('example.jsx')
  const output = stats.toJson().modules[0].source
  const expected = fs.readFileSync(
    path.resolve(__dirname, './example.expect.js'),
    'utf-8'
  )

  t.is(output.trim(), expected.trim())
})
