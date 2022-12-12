import { EntitiesCacheManager, EntitiesManager } from '@src/api'
import { Client } from '@src/core'
import { RawAppCommandEditData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandEditData'
import { GuildAppCommandEditData, RawGuildAppCommandEditData } from '@src/api/managers/interactions/InteractionSlashCommandGuildData'
import { AppCommandEditData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandEditData'
import { SlashCommandConstructor } from '@src/api/entities/interaction/SlashCommandConstructor'
import { DiscordooError, resolveGuildId } from '@src/utils'
import { AppCommand } from '@src/api/entities/interaction/AppCommand'
import { Keyspaces } from '@src/constants'

export class ClientInteractionSlashCommandManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AppCommand>
  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager(client, {
      storage: 'global',
      entity: 'AppCommand',
      keyspace: Keyspaces.ApplicationCommands,
      policy: 'commands',
    })
  }

  async createGlobal(command: SlashCommandConstructor | RawAppCommandEditData | AppCommandEditData) {
    const data = new SlashCommandConstructor(command).toJSON()

    const response = await this.client.internals.actions.createGlobalCommand(data)
    return response.result
  }

  async createGuild(command: SlashCommandConstructor | RawGuildAppCommandEditData | GuildAppCommandEditData) {
    const guildId = resolveGuildId(command.guild!)
    if (!guildId) {
      throw new DiscordooError(
        'ClientInteractionSlashCommandManager#createGuild', 'Cannot create guild command without guild id'
      )
    }

    const data = new SlashCommandConstructor(command).toJSON()

    const response = await this.client.internals.actions.createGuildCommand(guildId, data)
    return response.result
  }

  create(
    data: SlashCommandConstructor
      | RawGuildAppCommandEditData
      | RawAppCommandEditData
      | GuildAppCommandEditData
      | AppCommandEditData
  ) {
    return 'guild' in data ? this.createGuild(data) : this.createGlobal(data)
  }
}