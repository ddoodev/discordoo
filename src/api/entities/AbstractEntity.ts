import { Client } from '@src/core'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json, JsonProperties } from '@src/api/entities/interfaces/Json'

export abstract class AbstractEntity {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  abstract init(data: any): Promise<this>

  toJson(properties: ToJsonProperties, obj?: any): Json {
    const json: Json = {}

    const keys = Object.keys(properties)

    for (const key of keys) {
      const target = obj ?? this

      const prop = properties[key], value = target[key]

      if (typeof prop === 'object') {
        json[key] = this.toJson(prop, target)
      } else if (prop) {
        json[key] = AbstractEntity._handle(value)
      }
    }

    return json
  }

  private static _handle(data: any): JsonProperties {
    switch (typeof data) {
      case 'string':
      case 'boolean':
      case 'number':
        return data
      case 'bigint':
        return data.toString() + 'n'
      case 'object': {
        if (typeof data.toJson === 'function') return data.toJson()
        return JSON.parse(JSON.stringify(data, (k, v) => typeof v === 'bigint' ? v.toString() + 'n' : v))
      }
    }

    return null
  }
}
