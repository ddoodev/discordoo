import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Keyspaces } from '@src/constants'
import {
  AppCommand, AppCommandCreateData,
  CommandResolvable,
  EntitiesCacheManager,
  GuildApplicationCommandsManagerOptions,
  RawAppCommandCreateData,
  SlashCommandBuilder
} from '@src/api'
import { RestEligibleDiscordApplication } from '@src/core'

export class GuildApplicationCommandsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AppCommand>
  public options: GuildApplicationCommandsManagerOptions

  constructor(app: RestEligibleDiscordApplication, options: GuildApplicationCommandsManagerOptions) {
    super(app)

    this.options = options

    this.cache = new EntitiesCacheManager<AppCommand>(this.app, {
      keyspace: Keyspaces.ApplicationCommands,
      storage: options.guild,
      entity: 'AppCommand',
      policy: 'commands'
    })
  }

  async create(data: SlashCommandBuilder | RawAppCommandCreateData | AppCommandCreateData): Promise<AppCommand | undefined> {
    return this.app.interactions.commands.createGuild({ ...data, guild: this.options.guild })
  }

  async delete(command: CommandResolvable): Promise<boolean> {
    return this.app.interactions.commands.deleteGuild(this.options.guild, command)
  }

  async edit(
    command: CommandResolvable, data: SlashCommandBuilder | RawAppCommandCreateData | AppCommandCreateData
  ): Promise<AppCommand | undefined> {
    return this.app.interactions.commands.editGuild(this.options.guild, command, data)
  }

  async fetch(command: CommandResolvable): Promise<AppCommand | undefined>
  async fetch(): Promise<AppCommand[] | undefined>
  async fetch(command?: CommandResolvable): Promise<AppCommand[] | AppCommand | undefined> {
    return command ? this.fetchOne(command) : this.fetchMany()
  }

  async fetchMany(): Promise<AppCommand[] | undefined> {
    return this.app.interactions.commands.fetchGuildMany(this.options.guild)
  }

  async fetchOne(command: CommandResolvable): Promise<AppCommand | undefined> {
    return this.app.interactions.commands.fetchGuildOne(this.options.guild, command)
  }

  async overwrite(
    commands: Array<SlashCommandBuilder | RawAppCommandCreateData | AppCommandCreateData>
  ): Promise<AppCommand[] | undefined> {
    return this.app.interactions.commands.overwriteGuild(
      commands.map(c => ({ ...c, guild: this.options.guild }))
    )
  }
}
