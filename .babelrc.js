const { packages } = require('./discordoo.json')

const pathAliases = {}
for (const package of packages) {
  pathAliases[`@${package}`] = `./src/${package}`
}

module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@src': './src',
          '@root': './',
          ...pathAliases
        }
      }
    ]
  ]
}