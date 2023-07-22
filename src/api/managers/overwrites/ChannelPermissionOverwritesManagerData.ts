import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'

export interface ChannelPermissionOverwritesManagerData<T extends AnyGuildChannel> {
  channel: T
}
