import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { ChannelTypes } from '@src/constants'
import { ChannelDeleteOptions } from '@src/api/entities/channel/interfaces'
import { idToDate, idToTimestamp, attach } from '@src/utils'
import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'

export abstract class AbstractChannel extends AbstractEntity {
  public id!: string
  public type!: ChannelTypes

  async init(data: AbstractChannelData): Promise<this> {
    attach(this, data, [ 'id', 'type' ])

    return this
  }

  delete(options: ChannelDeleteOptions = {}) {
    return this.client.channels.delete(this.id, options)
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
    return super.toJson({ ...properties, id: true, type: true }, obj)
  }

}
