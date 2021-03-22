// eslint-disable-next-line
const fs = require('fs')
// eslint-disable-next-line
const path = require('path')

module.exports = (name, log) => {
  log('Creating new package')

  const discordooJson = JSON.parse(
    fs.readFileSync(
      path.resolve('./discordoo.json'), 'utf-8'
    )
  )
  discordooJson.packages.push(name)
  fs.writeFileSync(
    path.resolve('./discordoo.json'),
    JSON.stringify(discordooJson, null, 2)
  )
  log('Created entry in discordoo.json')

  const pkgJson = JSON.parse(
    fs.readFileSync(path.resolve('./package.json'), 'utf-8')
  )
  pkgJson.exports[`./${name}`] = `./dist/${name}/index.js`
  pkgJson.typesVersions['*'][name] = [ `types/${name}/index.d.ts` ]
  fs.writeFileSync(
    path.resolve('./package.json'), JSON.stringify(pkgJson, null, 2)
  )
  log('Created entry in package.json')

  fs.mkdirSync(path.resolve(`./src/${name}`), { recursive: true })
  const message = `// Look at me! I am a shiny new package for Discordoo named ${name}!`
  fs.writeFileSync(path.resolve(`./src/${name}/index.ts`), message)
  log('Created files')

  log('Done')
}