import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'

export interface ChannelPermissionsOverwritesManagerData<T extends AnyGuildChannel> {
  channel: T
}
