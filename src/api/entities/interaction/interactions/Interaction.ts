import { AbstractEntity } from '../../../../../src/api/entities/AbstractEntity'
import {
  AnyWritableChannel, AppCommandInteraction, AutocompleteInteraction,
  Guild,
  GuildMember,
  Message, MessageComponentInteraction,
  ModalSubmitInteraction,
  RawInteractionData,
  User
} from '../../../../../src/api'
import { EntityInitOptions } from '../../../../../src/api/entities/EntityInitOptions'
import { attach, idToDate, idToTimestamp } from '../../../../../src/utils'
import { InteractionTypes, Keyspaces } from '../../../../../src/constants'
import { CacheManagerGetOptions } from '../../../../../src/cache'

export abstract class Interaction extends AbstractEntity {
  declare id: string
  declare applicationId: string
  declare type: InteractionTypes
  declare guildId?: string
  declare channelId?: string
  declare userId: string
  declare token: string
  declare messageId?: string
  declare version: number
  declare locale?: string
  declare guildLocale?: string
  declare appPermissions?: string
  declare nsfw?: boolean

  async init(data: RawInteractionData, options?: EntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        'id',
        [ 'applicationId', 'application_id' ],
        'type',
        [ 'guildId', 'guild_id' ],
        [ 'channelId', 'channel_id' ],
        'token',
        'version',
        'locale',
        [ 'guildLocale', 'guild_locale' ],
        [ 'appPermissions', 'app_permissions' ]
      ],
      disabled: options?.ignore,
      enabled: [ 'id', 'applicationId', 'type', 'guildId' ]
    })

    this.messageId = data.message?.id

    this.userId = data.member?.user.id ?? data.user!.id

    return this
  }

  get createdDate(): Date {
    return idToDate(this.id)
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  async guild(options?: CacheManagerGetOptions): Promise<Guild | undefined> {
    return this.guildId ? this.app.guilds.cache.get(this.guildId, options) : undefined
  }

  async channel(options?: CacheManagerGetOptions): Promise<AnyWritableChannel | undefined> {
    if (this.channelId) {
      return this.app.internals.cache.get(
        Keyspaces.Channels, this.guildId ?? 'dm', 'channelEntityKey', this.channelId, options
      )
    }
  }

  async member(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    return this.userId ? this.app.members.cache.get(this.userId, { ...options, storage: this.guildId }) : undefined
  }

  async user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.userId ? this.app.users.cache.get(this.userId, options) : undefined
  }

  async author(options?: CacheManagerGetOptions): Promise<User | GuildMember | undefined> {
    return this.userId ? this.member(options) : this.user(options)
  }

  async message(options?: CacheManagerGetOptions): Promise<Message | undefined> {
    return this.messageId ? this.app.messages.cache.get(this.messageId, { ...options, storage: this.channelId }) : undefined
  }

  isAppCommand(): this is AppCommandInteraction {
    return this instanceof AppCommandInteraction
  }

  isModalSubmit(): this is ModalSubmitInteraction {
    return this instanceof ModalSubmitInteraction
  }

  isAutocomplete(): this is AutocompleteInteraction {
    return this instanceof AutocompleteInteraction
  }

  isMessageComponent(): this is MessageComponentInteraction {
    return this instanceof MessageComponentInteraction
  }
}
