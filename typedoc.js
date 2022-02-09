// eslint-disable-next-line @typescript-eslint/no-var-requires
const { packages } = require('./discordoo.json')

module.exports = {
  entryPoints: packages.map(e => `./src/${e}/index.ts`),
  json: './docs/docs.json',
  name: 'Discordoo',
  excludeExternals: true,
}
