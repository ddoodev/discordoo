import {
  AbstractEntity,
  AppCommandData, AppCommandOptionChoiceData,
  AppCommandOptionData, BigBitFieldResolvable,
  Json, RawAppCommandData, RawAppCommandOptionData,
  ReadonlyPermissions, ToJsonProperties
} from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach } from '@src/utils'
import { AppCommandOptionTypes, AppCommandTypes, ToJsonOverrideSymbol } from '@src/constants'
import { Locale } from '@src/constants/common/Locale'

export class AppCommand extends AbstractEntity {
  declare id: string
  declare name: string
  declare nameLocalizations?: Record<Locale, string>
  declare description: string
  declare descriptionLocalizations?: Record<Locale, string>
  declare version: string
  declare applicationId: string
  declare type: AppCommandTypes
  declare guildId?: string
  public options: AppCommandOption[] = []
  declare defaultMemberPermissions?: ReadonlyPermissions
  declare dmPermission?: boolean

  async init(data: AppCommandData | RawAppCommandData, options?: EntityInitOptions): Promise<this> {
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

    if (data.options) {
      const ops: AppCommandOption[] = []
      for await (const option of data.options) {
        ops.push(await new AppCommandOption(this.client).init(option))
      }
      this.options = ops
    }

    let perms: BigBitFieldResolvable | undefined
    if ('default_member_permissions' in data) {
      perms = data.default_member_permissions
    } else if ('defaultMemberPermissions' in data) {
      perms = data.defaultMemberPermissions
    }
    if (perms) {
      this.defaultMemberPermissions = new ReadonlyPermissions(perms)
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      id: true,
      name: true,
      name_localizations: {
        override: ToJsonOverrideSymbol,
        value: this.nameLocalizations
      },
      description: true,
      description_localizations: {
        override: ToJsonOverrideSymbol,
        value: this.descriptionLocalizations
      },
      version: true,
      applicationId: true,
      type: true,
      guildId: true,
      options: true,
      default_member_permissions: {
        override: ToJsonOverrideSymbol,
        value: this.defaultMemberPermissions
      },
      dm_permission: {
        override: ToJsonOverrideSymbol,
        value: this.dmPermission
      },
    }, obj)
  }
}

export class AppCommandOption extends AbstractEntity {
  declare name: string
  declare nameLocalizations?: Record<Locale, string>
  declare description: string
  declare descriptionLocalizations?: Record<Locale, string>
  declare choices?: AppCommandOptionChoiceData[]
  declare required: boolean
  declare value: string
  declare type: AppCommandOptionTypes

  async init(data: AppCommandOptionData | RawAppCommandOptionData, options?: EntityInitOptions): Promise<this> {
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

    if (data.choices) {
      this.choices = data.choices.map(choice => ({
        name: choice.name,
        value: choice.value,
        nameLocalizations: choice.nameLocalizations ?? choice.name_localizations
      }))
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      name: true,
      name_localizations: {
        override: ToJsonOverrideSymbol,
        value: this.nameLocalizations
      },
      description: true,
      description_localizations: {
        override: ToJsonOverrideSymbol,
        value: this.descriptionLocalizations
      },
      choices: true,
      required: true,
      value: true,
      type: true,
    }, obj)
  }
}