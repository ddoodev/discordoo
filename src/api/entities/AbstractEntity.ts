import { Client } from '@src/core'
import { Resolvable } from '@src/api'

export abstract class AbstractEntity {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  abstract init(data: any): Promise<this>

  resolveID(resolvable: Resolvable<any>): string | undefined {
    if (typeof resolvable === 'string') return resolvable

    return resolvable.id
  }

  toJSON(props: string[], returnProps?: boolean): Record<any, any> | string[] {
    if (returnProps) return props

    return {}
  }
}
