import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { ChannelTypes } from '@src/constants'
import { attach, idToDate, idToTimestamp } from '@src/utils'
import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'

export abstract class AbstractChannel extends AbstractEntity {
  public id!: string
  public type!: ChannelTypes
  public deleted!: boolean

  async init(data: AbstractChannelData): Promise<this> {
    attach(this, data, {
      props: [ 'id', 'type' ]
    })

    this.deleted = !!data.deleted

    return this
  }

  delete(reason): Promise<this | undefined> {
    return this.client.channels.delete(this.id, { reason, patchEntity: this })
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

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({ ...properties, id: true, type: true, deleted: true }, obj)
  }

}
