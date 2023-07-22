import { AbstractEntity } from '../../../../src/api/entities/AbstractEntity'
import { ChannelTypes } from '../../../../src/constants'
import { attach, idToDate, idToTimestamp } from '../../../../src/utils'
import { AbstractChannelData } from '../../../../src/api/entities/channel/interfaces/AbstractChannelData'
import { ToJsonProperties } from '../../../../src/api/entities/interfaces/ToJsonProperties'
import { Json } from '../../../../src/api/entities/interfaces/Json'
import { EntityInitOptions } from '../../../../src/api/entities/EntityInitOptions'
import { AnyChannel } from '../../../../src/api'

export abstract class AbstractChannel extends AbstractEntity {
  public declare id: string
  public declare type: ChannelTypes

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async init(data: AbstractChannelData, options?: EntityInitOptions): Promise<this> {
    // options declared for the future

    attach(this, data, {
      props: [ 'id', 'type' ],
    })

    return this
  }

  delete(reason): Promise<this | undefined> {
    return this.app.channels.delete(this.id, { reason, patchEntity: this as unknown as AnyChannel })
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  get createdDate(): Date {
    return idToDate(this.id)
  }

  toString() {
    return `<#${this.id}>`
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({ ...properties, id: true, type: true }, obj)
  }

}
