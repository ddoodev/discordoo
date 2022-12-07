import { Client } from '@src/core'
import { ClientInteractionSlashCommandManager } from '@src/api/managers/interactions/ClientInteractionSlashCommandManager'
export class ClientApplicationManager {
  public commands: ClientInteractionSlashCommandManager
  public constructor(client: Client) {
    this.commands = new ClientInteractionSlashCommandManager(client)
  }
}