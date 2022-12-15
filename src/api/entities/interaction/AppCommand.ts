import {
  AppCommandData, AppCommandOptionChoiceData, BigBitFieldResolvable,
  Json, RawAppCommandData, RawAppCommandOptionData,
  ReadonlyPermissions, ToJsonProperties
} from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach } from '@src/utils'
import { AppCommandOptionTypes, AppCommandTypes } from '@src/constants'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { AppCommandOptionWithSubcommandsData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandOptionData'
import { AppCommandEntityInitOptions } from '@src/api/entities/interaction/interfaces/command/AppCommandEntityInitOptions'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'

export class AppCommand extends AbstractEntity {
  declare id: string
  declare name: string
  declare nameLocalizations?: Record<DiscordLocale, string>
  declare description: string
  declare descriptionLocalizations?: Record<DiscordLocale, string>
  declare version: string
  declare applicationId: string
  declare type: AppCommandTypes
  declare guildId?: string
  public options: AppCommandOption[] = []
  declare defaultMemberPermissions?: ReadonlyPermissions
  declare dmPermission?: boolean

  async init(data: AppCommandData | RawAppCommandData, options?: AppCommandEntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        'id',
        'name',
        [ 'nameLocalizations', 'name_localizations' ],
        'description',
        [ 'descriptionLocalizations', 'description_localizations' ],
        'version',
        [ 'applicationId', 'application_id' ],
        'type',
        [ 'guildId', 'guild_id' ],
        [ 'dmPermission', 'dm_permission' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'id', 'applicationId', 'type', 'guildId' ]
    })

    if (data.options && !options?.ignore?.includes('options')) {
      const ops: AppCommandOption[] = []
      for await (const option of data.options) {
        ops.push(new AppCommandOption(option, options?.optionsInit))
      }
      this.options = ops
    }

    let perms: BigBitFieldResolvable | undefined
    if ('default_member_permissions' in data) {
      perms = data.default_member_permissions
    } else if ('defaultMemberPermissions' in data) {
      perms = data.defaultMemberPermissions
    }
    if (perms && !options?.ignore?.includes('defaultMemberPermissions')) {
      this.defaultMemberPermissions = new ReadonlyPermissions(perms)
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      id: true,
      name: true,
      nameLocalizations: true,
      description: true,
      descriptionLocalizations: true,
      version: true,
      applicationId: true,
      type: true,
      guildId: true,
      options: true,
      defaultMemberPermissions: true,
      dmPermission: true,
    }, obj)
  }
}

export class AppCommandOption {
  declare name: string
  declare nameLocalizations?: Record<DiscordLocale, string>
  declare description: string
  declare descriptionLocalizations?: Record<DiscordLocale, string>
  declare choices?: AppCommandOptionChoiceData[]
  declare options?: AppCommandOption[]
  declare required: boolean
  declare value:
      (this['type'] extends AppCommandOptionTypes.String ? string : number)
    | (this['required'] extends true ? never : undefined)
  declare type: AppCommandOptionTypes

  constructor(data: AppCommandOptionWithSubcommandsData | RawAppCommandOptionData, options?: EntityInitOptions) {
    attach(this, data, {
      props: [
        'name',
        [ 'nameLocalizations', 'name_localizations' ],
        'description',
        [ 'descriptionLocalizations', 'description_localizations' ],
        'required',
        'value',
        'type',
      ],
      disabled: options?.ignore,
      enabled: [ 'name', 'type' ]
    })

    if ('choices' in data && data.choices) {
      this.choices = data.choices.map(choice => ({
        name: choice.name,
        value: choice.value,
        nameLocalizations: choice.nameLocalizations ?? choice.name_localizations
      }))
    }

    if ('options' in data && data.options) {
      this.options = data.options.map(option => new AppCommandOption(option, options))
    }

    return this
  }

  toJson(): AppCommandOptionWithSubcommandsData {
    // @ts-ignore
    return { ...this }
  }
}