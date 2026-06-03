const { rmSync } = require('fs')
const { join, resolve } = require('path')
const { spawnSync } = require('child_process')

const root = resolve(__dirname, '..')
const input = join(root, 'resources', 'logo.png')
const output = join(root, 'resources')
const iconsDir = join(output, 'icons')

rmSync(iconsDir, { force: true, recursive: true })

const result = spawnSync(
  join(root, 'node_modules', '.bin', 'electron-icon-builder'),
  [`--input=${input}`, `--output=${output}`],
  {
    cwd: root,
    env: {
      ...process.env,
      npm_config_phantomjs_cdnurl: 'https://npmmirror.com/mirrors/phantomjs',
    },
    shell: process.platform === 'win32',
    stdio: 'inherit',
  },
)

if (result.status !== 0) {
  process.exit(result.status || 1)
}
