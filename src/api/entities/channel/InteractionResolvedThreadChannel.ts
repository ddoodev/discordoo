import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import {
  EntityInitOptions, InteractionResolvedThreadChannelData,
  RawInteractionResolvedThreadChannelData, ReadonlyPermissions, ThreadMetadata
} from '@src/api'
import { attach } from '@src/utils'
import { is } from 'typescript-is'
import { ChannelTypes } from '@src/constants'

export class InteractionResolvedThreadChannel extends AbstractChannel {
  declare type: ChannelTypes.GuildPublicThread
    | ChannelTypes.GuildPrivateThread
    | ChannelTypes.GuildNewsThread
  declare permissions: ReadonlyPermissions
  declare parentId: string
  declare metadata: ThreadMetadata

  async init(data: RawInteractionResolvedThreadChannelData | InteractionResolvedThreadChannelData, options?: EntityInitOptions) {
    await super.init(data, options)

    attach(this, data, {
      props: [
        'name',
        [ 'parentId', 'parent_id' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'name' ]
    })

    if ('thread_metadata' in data && data.thread_metadata) {
      this.metadata = {
        archived: data.thread_metadata.archived,
        archiveTimestamp: new Date(data.thread_metadata.archive_timestamp).getTime(),
        autoArchiveDuration: data.thread_metadata.auto_archive_duration,
        locked: data.thread_metadata.locked,
        invitable: data.thread_metadata.invitable
      }
    } else if ('metadata' in data && data.metadata) {
      if (is<ThreadMetadata>(data.metadata)) this.metadata = data.metadata
    }

    this.permissions = new ReadonlyPermissions(data.permissions)

    return this
  }
}
