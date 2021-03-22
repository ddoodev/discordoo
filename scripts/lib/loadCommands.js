// eslint-disable-next-line
const [ fs, path ] = [ 'fs', 'path' ].map(require)

module.exports = () => {
  console.log(process.argv[1])
  const paths = fs.readdirSync(path.resolve('./scripts/cmds')).map(e => path.resolve(`./scripts/cmds/${e}`))
  return paths.map(require)
}