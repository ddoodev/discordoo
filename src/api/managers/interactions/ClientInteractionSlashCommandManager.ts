import { EntitiesManager } from '@src/api'
import { Client } from '@src/core'
import { RawAppCommandEditData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandEditData'
import { GuildAppCommandEditData, RawGuildAppCommandEditData } from '@src/api/managers/interactions/InteractionSlashCommandGuildData'
import { AppCommandEditData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandEditData'
import { SlashCommandConstructor } from '@src/api/entities/interaction/SlashCommandConstructor'

export class ClientInteractionSlashCommandManager extends EntitiesManager {
  constructor(client: Client) {
    super(client)
  }

  async createGlobal(command: RawAppCommandEditData | AppCommandEditData) {
    const Command = new SlashCommandConstructor(command)
    const data = Command.toJSON()

    const response = await this.client.internals.actions.createGlobalCommand(data)
    return response.result
  }

  async createGuild(command: RawGuildAppCommandEditData | GuildAppCommandEditData) {
    const Command = new SlashCommandConstructor(command)
    const data = Command.toJSON()

    const response = await this.client.internals.actions.createGuildCommand(command.guild.toString(), data)
    return response.result
  }

  create(data: RawGuildAppCommandEditData | RawAppCommandEditData | GuildAppCommandEditData | AppCommandEditData) {
    return 'guild' in data ? this.createGuild(data) : this.createGlobal(data)
  }
}