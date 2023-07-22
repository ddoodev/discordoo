import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { InviteChannelData, Json, ToJsonProperties } from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach, ImageUrlOptions } from '@src/utils'

export class InviteChannel extends AbstractChannel  {
  public name?: string
  public icon?: string

  async init(data: InviteChannelData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [ 'name', 'icon' ]
    })

    return this
  }

  iconUrl(options?: ImageUrlOptions): string | undefined {
    return this.icon ? this.app.internals.rest.cdn.channelIcon(this.id, this.icon, options) : undefined
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      name: true,
      icon: true
    }, obj)
  }
}
