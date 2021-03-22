// eslint-disable-next-line
const mkpkg = require('../lib/createPackage')

module.exports = args => {
  if (!args[0]) {
    console.log('Specify name for new package')
    process.exit(-1)
  }
  console.log('Creating a new package')
  mkpkg(args[0], console.log)
}

module.exports.help = {
  usage: '<name>',
  description: 'Create a new package',
  name: 'new'
}