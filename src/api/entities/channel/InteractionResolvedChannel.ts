import { AbstractChannel } from '../../../../src/api/entities/channel/AbstractChannel'
import { EntityInitOptions, InteractionResolvedChannelData, ReadonlyPermissions } from '../../../../src/api'
import { ChannelTypes } from '../../../../src/constants'
import { attach } from '../../../../src/utils'

export class InteractionResolvedChannel extends AbstractChannel {
  declare type: Exclude<ChannelTypes,
    ChannelTypes.GuildPrivateThread
    | ChannelTypes.GuildPublicThread
    | ChannelTypes.GuildNewsThread
    | ChannelTypes.Dm
    | ChannelTypes.GroupDm
  >
  declare permissions: ReadonlyPermissions

  async init(data: InteractionResolvedChannelData, options?: EntityInitOptions) {
    await super.init(data, options)

    attach(this, data, {
      props: [
        'name'
      ],
      enabled: [ 'name' ]
    })

    this.permissions = new ReadonlyPermissions(data.permissions)

    return this
  }
}
