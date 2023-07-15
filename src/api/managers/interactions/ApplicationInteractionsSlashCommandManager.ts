import {
  AnyAppCommandData, AppCommand,
  AppCommandCreateData, AppCommandEditData, CommandResolvable, EntitiesCacheManager,
  EntitiesUtil, FetchCommandOptions, FetchCommandQuery, GuildAppCommandCreateData,
  GuildAppCommandEditData,
  GuildResolvable,
  RawAppCommandCreateData, RawAppCommandEditData, RawGuildAppCommandCreateData,
  RawGuildAppCommandEditData,
  SlashCommandBuilder
} from '@src/api'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordRestApplication } from '@src/core'
import { DiscordooError, resolveBigBitField, resolveCommandId, resolveGuildId } from '@src/utils'
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

  async createGlobal(
    commandData: SlashCommandBuilder | RawAppCommandCreateData | AppCommandCreateData
  ): Promise<AppCommand | undefined> {
    const data = commandData instanceof SlashCommandBuilder ? commandData.toJSON() : new SlashCommandBuilder(commandData).toJSON()
    const response = await this.app.internals.actions.createGlobalCommand(data)

    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')

      const appCommand = await new AppCommand(this.app).init(response.result)
      await this.cache.set(appCommand.id, appCommand)

      return appCommand
    }
  }

  async createGuild(
    commandData: SlashCommandBuilder | RawGuildAppCommandCreateData | GuildAppCommandCreateData
  ): Promise<AppCommand | undefined> {
    const guildId = resolveGuildId(commandData.guild!)
    if (!guildId) {
      throw new DiscordooError(
        'ApplicationInteractionsSlashCommandManager#createGuild', 'Cannot create guild command without guild id'
      )
    }

    const data = commandData instanceof SlashCommandBuilder ? commandData.toJSON() : new SlashCommandBuilder(commandData).toJSON()
    const response = await this.app.internals.actions.createGuildCommand(guildId, data)

    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')

      const appCommand = await new AppCommand(this.app).init(response.result)
      await this.cache.set(appCommand.id, appCommand, { storage: appCommand.guildId })

      return appCommand
    }
  }

  create(data: AnyAppCommandData): Promise<AppCommand | undefined> {
    return 'guild' in data ? this.createGuild(data) : this.createGlobal(data)
  }

  async deleteGlobal(command: CommandResolvable): Promise<boolean> {
    const commandId = resolveCommandId(command)
    if (!commandId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#deleteGlobal',
      'Cannot delete global command without command id.'
    )

    const response = await this.app.internals.actions.deleteGlobalCommand(commandId)

    if (response.success) await this.cache.delete(commandId)
    return response.success
  }

  async deleteGuild(guild: GuildResolvable, command: CommandResolvable): Promise<boolean> {
    const guildId = resolveGuildId(guild)
    if (!guildId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#deleteGuild',
      'Cannot delete guild command without guild id.'
    )

    const commandId = resolveCommandId(command)
    if (!commandId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#deleteGuild',
      'Cannot delete guild command without command id.'
    )

    const response = await this.app.internals.actions.deleteGuildCommand(guildId, commandId)
    if (response.success) await this.cache.delete(commandId, { storage: guildId })
    return response.success
  }

  async editGlobal(command: CommandResolvable, data: AppCommandEditData): Promise<AppCommand | undefined> {
    const commandId = resolveCommandId(command)
    if (!commandId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#editGlobal',
      'Cannot edit global command without command id.'
    )

    const payload: RawAppCommandEditData = {
      ...data,
      name_localizations: data.nameLocalizations,
      description_localizations: data.descriptionLocalizations,
      dm_permission: data.dmPermission,
      default_member_permissions: data.defaultMemberPermissions
        ? resolveBigBitField(data.defaultMemberPermissions).toString()
        : undefined
    }

    const response = await this.app.internals.actions.editGlobalCommand(commandId, payload)
    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')

      const appCommand = await new AppCommand(this.app).init(response.result)
      await this.cache.set(appCommand.id, appCommand)

      return appCommand
    }
  }

  async editGuild(guild: GuildResolvable, command: CommandResolvable, data: GuildAppCommandEditData): Promise<AppCommand | undefined> {
    const guildId = resolveGuildId(guild)
    if (!guildId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#editGuild',
      'Cannot edit guild command without guild id.'
    )

    const commandId = resolveCommandId(command)
    if (!commandId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#editGuild',
      'Cannot edit guild command without command id.'
    )

    const payload: RawGuildAppCommandEditData = {
      ...data,
      name_localizations: data.nameLocalizations,
      description_localizations: data.descriptionLocalizations,
      default_member_permissions: data.defaultMemberPermissions
        ? resolveBigBitField(data.defaultMemberPermissions).toString()
        : undefined
    }

    const response = await this.app.internals.actions.editGuildCommand(guildId, commandId, payload)
    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')

      const appCommand = await new AppCommand(this.app).init(response.result)
      await this.cache.set(appCommand.id, appCommand, { storage: appCommand.guildId })

      return appCommand
    }
  }

  async fetchGlobalOne(command: CommandResolvable): Promise<AppCommand | undefined> {
    const commandId = resolveCommandId(command)
    if (!commandId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#fetchGlobalOne',
      'Cannot fetch global command without command id.'
    )

    const response = await this.app.internals.actions.getGlobalCommand(commandId)

    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')

      const appCommand = await new AppCommand(this.app).init(response.result)
      await this.cache.set(appCommand.id, appCommand)

      return appCommand
    }
  }

  async fetchGuildOne(guild: GuildResolvable, command: CommandResolvable): Promise<AppCommand | undefined> {
    const guildId = resolveGuildId(guild)
    if (!guildId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#fetchGuildOne',
      'Cannot fetch guild command without guild id.'
    )

    const commandId = resolveCommandId(command)
    if (!commandId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#fetchGuildOne',
      'Cannot fetch guild command without command id.'
    )

    const response = await this.app.internals.actions.getGuildCommand(guildId, commandId)

    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')

      const appCommand = await new AppCommand(this.app).init(response.result)
      await this.cache.set(appCommand.id, appCommand, { storage: appCommand.guildId })

      return appCommand
    }
  }

  async fetchGlobalMany(options: FetchCommandOptions = {}): Promise<AppCommand[] | undefined> {
    const query: FetchCommandQuery = {
      with_localizations: options.withLocalizations
    }
    const response = await this.app.internals.actions.getGlobalCommands(query)

    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')
      return await Promise.all(
        response.result.map(async (data) => {
          const appCommand = await new AppCommand(this.app).init(data)
          await this.cache.set(appCommand.id, appCommand)

          return appCommand
        })
      )
    }
  }

  async fetchGuildMany(guild: GuildResolvable, options: FetchCommandOptions = {}): Promise<AppCommand[] | undefined> {
    const guildId = resolveGuildId(guild)
    if (!guildId) throw new DiscordooError(
      'ApplicationInteractionsSlashCommandManager#fetchGuildMany',
      'Cannot fetch guild commands without guild id.'
    )

    const query: FetchCommandQuery = {
      with_localizations: options.withLocalizations
    }
    const response = await this.app.internals.actions.getGuildCommands(guildId, query)

    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')
      return await Promise.all(
        response.result.map(async (data) => {
          const appCommand = await new AppCommand(this.app).init(data)
          await this.cache.set(appCommand.id, appCommand, { storage: appCommand.guildId })

          return appCommand
        })
      )
    }
  }

  async overwriteGlobal(
    commandsData: Array<SlashCommandBuilder | RawAppCommandCreateData | AppCommandCreateData>
  ): Promise<AppCommand[] | undefined> {
    const data = commandsData.map((command) =>
      command instanceof SlashCommandBuilder
        ? command.toJSON()
        : new SlashCommandBuilder(command).toJSON()
    )

    const response = await this.app.internals.actions.overwriteGlobalCommandsBulk(data)
    if (response.success) {
      const AppCommand = EntitiesUtil.get('AppCommand')
      return await Promise.all(
        response.result.map(async (data) => {
          const appCommand = await new AppCommand(this.app).init(data)
          await this.cache.set(appCommand.id, appCommand)

          return appCommand
        })
      )
    }
  }

  async overwriteGuild(
    commandsData: Array<SlashCommandBuilder | RawGuildAppCommandCreateData | GuildAppCommandCreateData>
  ): Promise<AppCommand[] | undefined> {
    const commandsByGuild = {}
    commandsData.forEach((command) => {
      const guildId = resolveGuildId(command.guild!)
      if (!guildId) throw new DiscordooError(
        'ApplicationInteractionsSlashCommandManager#overwriteGuild',
        'Cannot fetch guild commands without guild id.'
      )

      if (!commandsByGuild[guildId]) commandsByGuild[guildId] = []

      commandsByGuild[guildId].push(
        command instanceof SlashCommandBuilder
        ? command.toJSON()
        : new SlashCommandBuilder(command).toJSON()
      )
    })

    const AppCommand = EntitiesUtil.get('AppCommand')
    const guilds = Object.keys(commandsByGuild)

    const result: AppCommand[] = await Promise.all(guilds.map(async (guildId) => {
      const response = await this.app.internals.actions.overwriteGuildCommandsBulk(guildId, commandsByGuild[guildId])
      if (response.success) {
        return response.result.map(async (data) => {
          const appCommand = await new AppCommand(this.app).init(data)
          await this.cache.set(appCommand.id, appCommand, { storage: appCommand.guildId })

          return appCommand
        })
      }
    }))

    if (result.length > 0) return result
  }

  async overwrite(commandsData: AnyAppCommandData[]): Promise<AppCommand[] | undefined> {
    const [ guild, global ] = commandsData.reduce((acc, curr) => {
      'guild' in curr ? acc[0].push(curr) : acc[1].push(curr)
      return acc
    }, [
      [] as Array<SlashCommandBuilder | RawGuildAppCommandCreateData | GuildAppCommandCreateData>,
      [] as Array<SlashCommandBuilder | RawAppCommandCreateData | AppCommandCreateData>
    ])

    if (global.length && !guild.length) return await this.overwriteGlobal(global)
    if (!global.length && guild.length) return await this.overwriteGuild(guild)
    if (!global.length && !guild.length) return

    const result: AppCommand[] = []

    const globResult = await this.overwriteGlobal(global)
    if (globResult) result.concat(globResult)

    const guildResult = await this.overwriteGuild(guild)
    if (guildResult) result.concat(guildResult)

    return result
  }

  // TODO permissions
}
