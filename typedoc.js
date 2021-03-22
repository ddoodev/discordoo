const entryPoints = [
  'cache',
  'collection',
  'core',
  'main',
  'rest',
  'util',
  'ws'
]

module.exports = {
  entryPoints: entryPoints.map(e => `./src/${e}/index.ts`),
  json: './docs/docs.json',
  readme: './README.md'
}
