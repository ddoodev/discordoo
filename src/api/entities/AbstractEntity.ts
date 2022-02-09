import { Client } from '@src/core'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json, JsonProperties } from '@src/api/entities/interfaces/Json'
import { ToJsonOverrideSymbol } from '@src/constants'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export abstract class AbstractEntity {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  abstract init(data: any, options?: EntityInitOptions): Promise<this>

  async _clone(): Promise<this> {
    return await new (this.constructor as any)(this.client).init(this.toJson())
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    const json: Json = {}

    const keys = Object.keys(properties)

    for (const key of keys) {
      const target = obj ?? this

      const prop = properties[key], value = target[key]

      if (typeof prop === 'object') {
        if (prop.override === ToJsonOverrideSymbol) json[key] = AbstractEntity._handleToJsonProp(prop.value)
        else json[key] = AbstractEntity._handleToJsonProp(prop)
      } else if (prop) {
        json[key] = AbstractEntity._handleToJsonProp(value)
      }
    }

    return json
  }

  private static _handleToJsonProp(data: any): JsonProperties {
    switch (typeof data) {
      case 'string':
      case 'boolean':
      case 'number':
        return data
      case 'bigint':
        return data.toString() + 'n'
      case 'object': {
        if (data === null) return null
        if (typeof data.toJson === 'function') return data.toJson()
        return JSON.parse(JSON.stringify(data, (k, v) => typeof v === 'bigint' ? v.toString() + 'n' : v))
      }
    }

    return null
  }
}
