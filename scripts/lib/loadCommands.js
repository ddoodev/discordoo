// eslint-disable-next-line
const [ fs, path ] = [ 'fs', 'path' ].map(require)

module.exports = () => {
  const paths = fs.readdirSync(path.resolve('./scripts/cmds')).map(e => path.resolve(`./scripts/cmds/${e}`))
  return paths.map(require)
}