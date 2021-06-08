// eslint-disable-next-line @typescript-eslint/no-var-requires
const { packages } = require('./discordoo.json')

module.exports = {
  entryPoints: packages.map(e => `./src/${e}/index.ts`),
  theme: './theme',
  readme: './docs.md',
  plugin: 'none',
  name: 'Discordoo'
}
