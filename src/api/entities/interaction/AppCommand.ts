import {
  AppCommandData, AppCommandOption, BigBitFieldResolvable,
  Json, RawAppCommandData, ReadonlyPermissions, ToJsonProperties
} from '@src/api'
import { attach } from '@src/utils'
import { AppCommandTypes } from '@src/constants'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'
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
  declare nsfw?: boolean

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
        'nsfw',
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
