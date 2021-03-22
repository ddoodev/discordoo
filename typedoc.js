const { packages } = require('./discordoo.json')

module.exports = {
  entryPoints: packages.map(e => `./src/${e}/index.ts`),
  json: './docs/docs.json',
  readme: './README.md'
}
