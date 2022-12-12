import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { AppCommandTypes } from '@src/constants'
import { BigBitFieldResolvable, GuildResolvable, RawAppCommandOptionData } from '@src/api'
import { RawAppCommandEditData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandEditData'
import { attach, resolveBigBitField, resolveGuildId } from '@src/utils'
import { mix } from 'ts-mixer'
import { MixinNameDescriptionRequired } from '@src/api/entities/interaction/mixins/MixinNameDescriptionRequired'
import { AppCommandEditData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandEditData'
import { optionToRaw } from '@src/utils/optionToRaw'
import { AppCommandOptionWithSubcommandsData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandOptionData'
import { GuildAppCommandEditData, RawGuildAppCommandEditData } from '@src/api/managers/interactions/InteractionSlashCommandGuildData'

@mix(MixinNameDescriptionRequired)
export class SlashCommandConstructor {
  /** 1-32 character name */
  declare name: string
  /** localization dictionary for `name` field. Values follow the same restrictions as name */
  public nameLocalizations?: Record<DiscordLocale, string>
  /** 1-100 character description for `ChatInput` commands, empty string for `User` and `MESSAGE` commands */
  declare description: string
  /** localization dictionary for `description` field. Values follow the same restrictions as description */
  public descriptionLocalizations?: Record<DiscordLocale, string>
  /** the type of command, defaults `1` (`ChatInput`) if not set */
  public type?: AppCommandTypes
  /** parameters for the command, max of 25 */
  public options: RawAppCommandOptionData[] = []
  /** set of permissions represented as a bit set */
  public defaultMemberPermissions?: bigint
  /**
   * indicates whether the command is available in DMs with the app, only for globally-scoped commands.
   * by default, commands are visible.
   */
  public dmPermission?: boolean
  /**
   * if you wish to create a guild command, this will contain the guild id
   * */
  public guild?: string

  constructor(
    data: SlashCommandConstructor |
      RawAppCommandEditData |
      AppCommandEditData |
      GuildAppCommandEditData |
      RawGuildAppCommandEditData
  ) {
    attach(this, data, {
      props: [
        'name',
        [ 'nameLocalizations', 'name_localizations' ],
        'description',
        [ 'descriptionLocalizations', 'description_localizations' ],
        'type',
        [ 'dmPermission', 'dm_permission' ],
        [ 'defaultMemberPermissions', 'default_member_permissions' ],
      ]
    })

    if (data.options) {
      this.options = data.options.map(optionToRaw)
    }

    if ('guild' in data && data.guild) {
      this.guild = resolveGuildId(data.guild)
    }
  }

  setDefaultPermissions(permissions: BigBitFieldResolvable): this {
    this.defaultMemberPermissions = resolveBigBitField(permissions)
    return this
  }

  setType(type: AppCommandTypes): this {
    this.type = type
    return this
  }

  setDmPermission(dmPermission: boolean): this {
    this.dmPermission = dmPermission
    return this
  }

  addOption(option: AppCommandOptionWithSubcommandsData | RawAppCommandOptionData): this {
    const raw = optionToRaw(option)

    if (this.options.length >= 25) {
      throw new Error('Cannot add more than 25 options to a slash command')
    }

    this.options.push(raw)

    return this
  }

  addOptions(options: (AppCommandOptionWithSubcommandsData | RawAppCommandOptionData)[]): this {
    options.forEach(option => this.addOption(option))
    return this
  }

  setGuild(guild: GuildResolvable): this {
    this.guild = resolveGuildId(guild)
    return this
  }

  public toJSON(): RawAppCommandEditData | RawGuildAppCommandEditData {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options,
      dm_permission: this.dmPermission,
      default_member_permissions: this.defaultMemberPermissions?.toString(),
      name_localizations: this.nameLocalizations,
      description_localizations: this.descriptionLocalizations,
      guild: this.guild,
    }
  }
}