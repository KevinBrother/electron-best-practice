const { readFileSync, writeFileSync } = require('fs')
const { join, resolve } = require('path')

const corePath = join(
  resolve(__dirname, '..'),
  'node_modules',
  'dmg-builder',
  'vendor',
  'dmgbuild',
  'core.py',
)

const oldBlock = `import sys
reload(sys)  # Reload is a hack
sys.setdefaultencoding('UTF8')
`

const newBlock = `import sys
if sys.version_info[0] < 3:
  reload(sys)  # Reload is a hack
  sys.setdefaultencoding('UTF8')
`

const source = readFileSync(corePath, 'utf8')

if (source.includes(newBlock)) {
  process.exit(0)
}

if (!source.includes(oldBlock)) {
  throw new Error(`Unexpected dmg-builder core.py format: ${corePath}`)
}

writeFileSync(corePath, source.replace(oldBlock, newBlock))
