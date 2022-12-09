import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { AppCommandOptionTypes, AppCommandTypes } from '@src/constants'
import { AppCommandOptionData, BigBitFieldResolvable, RawAppCommandOptionData } from '@src/api'
import { RawAppCommandEditData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandEditData'
import { attach, resolveBigBitField } from '@src/utils'
import { mix } from 'ts-mixer'
import { MixinNameDescription } from './mixins/MixinNameDescription'
import { AppCommandEditData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandEditData'

@mix(MixinNameDescription)
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
  public options: AppCommandOptionData[] = []
  /** set of permissions represented as a bit set */
  public defaultMemberPermissions?: bigint
  /**
   * indicates whether the command is available in DMs with the app, only for globally-scoped commands.
   * by default, commands are visible.
   */
  public dmPermission?: boolean

  constructor(data: SlashCommandConstructor | RawAppCommandEditData | AppCommandEditData) {
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

    // if (data.options) {
    //   this.options = data.options.map(option => new SlashCommandOptionConstructor(option))
    // }
  }

  public setDefaultPermissions(permissions: BigBitFieldResolvable): this {
    this.defaultMemberPermissions = resolveBigBitField(permissions)
    return this
  }

  public addSubcommandGroup(input: SlashCommandSubcommandGroupConstructor | AppCommandOptionData | RawAppCommandOptionData): this {
    const result = new SlashCommandSubcommandGroupConstructor(input)
    this.options.push(result.toJSON())

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

  addOption(option: AppCommandOptionData): this {
    this.options.push(option)
    return this
  }

  addSubcommand(input: SlashCommandSubcommandConstructor | AppCommandOptionData | RawAppCommandOptionData): this {
    const result = new SlashCommandSubcommandConstructor(input)
    this.options.push(result.toJSON())

    return this
  }

  public toJSON(): RawAppCommandEditData {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options,
      dm_permission: this.dmPermission,
      default_member_permissions: this.defaultMemberPermissions?.toString(),
    }
  }
}

@mix(MixinNameDescription)
export class SlashCommandSubcommandGroupConstructor implements AppCommandOptionData {
  public name!: string
  public description!: string
  public type = AppCommandOptionTypes.SubCommandGroup
  public options?: AppCommandOptionData[]

  constructor(data: SlashCommandSubcommandGroupConstructor | AppCommandOptionData | RawAppCommandOptionData) {
    attach(this, data, {
      props: [ 'name', 'description' ],
    })

    // if (data.options) {
    //   this.options = data.options.map(option => new SlashCommandOptionConstructor(option))
    // }
  }
  public toJSON(): AppCommandOptionData {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options,
    }
  }

  setType(type: AppCommandOptionTypes): this {
    this.type = type
    return this
  }
  addOption(option: AppCommandOptionData): this {
    this.options ??= []
    this.options.push(option)
    return this
  }
}

@mix(MixinNameDescription)
export class SlashCommandSubcommandConstructor implements AppCommandOptionData {
  declare name: string
  declare description: string
  public type = AppCommandOptionTypes.SubCommand
  public options?: AppCommandOptionData[]

  constructor(data: SlashCommandSubcommandConstructor | AppCommandOptionData | RawAppCommandOptionData) {
    attach(this, data, {
      props: [ 'name', 'description', 'options' ],
    })
  }

  setType(type: AppCommandOptionTypes): this {
    this.type = type
    return this
  }

  addOption(option: AppCommandOptionData): this {
    this.options ??= []
    this.options.push(option)
    return this
  }

  public toJSON(): AppCommandOptionData {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options,
    }
  }

}
