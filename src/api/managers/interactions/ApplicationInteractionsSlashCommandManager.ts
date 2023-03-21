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
    data: SlashCommandBuilder
      | RawGuildAppCommandEditData
      | RawAppCommandEditData
      | GuildAppCommandEditData
      | AppCommandEditData
  ) {
    return 'guild' in data ? this.createGuild(data) : this.createGlobal(data)
  }
}