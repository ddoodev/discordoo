import { EntitiesCacheManager } from '@src/api'
import { EntitiesManager } from '../EntitiesManager'
import { DiscordApplication, DiscordRestApplication } from '@src/core'
import { RawAppCommandEditData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandEditData'
import { GuildAppCommandEditData, RawGuildAppCommandEditData } from '@src/api/managers/interactions/InteractionSlashCommandGuildData'
import { AppCommandEditData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandEditData'
import { SlashCommandBuilder } from '@src/api/entities/interaction/SlashCommandBuilder'
import { DiscordooError, resolveGuildId } from '@src/utils'
import { AppCommand } from '@src/api/entities/interaction/AppCommand'
import { Keyspaces } from '@src/constants'
import { AnyAppCommand } from '../../entities'

export class ApplicationInteractionsSlashCommandManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AppCommand>
  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager(app, {
      storage: 'global',
      entity: 'AppCommand',
      keyspace: Keyspaces.ApplicationCommands,
      policy: 'commands',
    })
  }

  async createGlobal(command: SlashCommandBuilder | RawAppCommandEditData | AppCommandEditData) {
    const data = new SlashCommandBuilder(command).toJSON()

    const response = await this.app.internals.actions.createGlobalCommand(data)
    return response.result
  }

  async createGuild(command: SlashCommandBuilder | RawGuildAppCommandEditData | GuildAppCommandEditData) {
    const guildId = resolveGuildId(command.guild!)
    if (!guildId) {
      throw new DiscordooError(
        'ClientInteractionSlashCommandManager#createGuild', 'Cannot create guild command without guild id'
      )
    }

    const data = new SlashCommandBuilder(command).toJSON()

    const response = await this.app.internals.actions.createGuildCommand(guildId, data)
    return response.result
  }

  create(
    data: AnyAppCommand
  ) {
    return 'guild' in data ? this.createGuild(data) : this.createGlobal(data)
  }

  async editManyGlobal(commands: Array<SlashCommandBuilder | RawAppCommandEditData | AppCommandEditData>) {
    const data = commands.map(c => new SlashCommandBuilder(c).toJSON())

    //const response = await this.app.internals.actions.com
  }

  async editMany(
    data: AnyAppCommand[]
  ) {
    const [ guild, glob ] = data.reduce((acc, curr) => {
      'guild' in curr ? acc[0].push(curr) : acc[1].push(curr)
      return acc
    }, [ [] as AnyAppCommand[], [] as AnyAppCommand[] ])

    if (glob.length && !guild.length) return this.editManyGlobal(glob)
    //if (!glob.length && guild.length) return this.editManyGuild(guild)

    const globResult = await this.editManyGlobal(glob)
    //const guildResult = await this.editManyGuild(guild)

    return [
      //...globResult, ...guildResult
    ]
  }
}
