// eslint-disable-next-line
const load = require('./lib/loadCommands')
const args = process.argv.slice(2)

const commands = load()

function showHelp() {
  console.log('\nDiscordoo developer\'s tools')
  console.log('Usage: npm run utils <command-name> [options]')
  console.log('\nAvailable commands:')

  for (const cmd of commands) {
    console.log(`\t${cmd.help.name} ${cmd.help.usage} - ${cmd.help.description}`)
  }

  console.log('\nEnjoy contributing!')

  process.exit()
}

if (!args[0] || args[0] === 'help') {
  showHelp()
}

const cmd = commands.filter(e => e.help.name === args[0])[0]
if (!cmd) {
  showHelp()
}

cmd(args.slice(1))
