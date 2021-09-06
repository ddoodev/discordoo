import { Client } from '@src/core'

export abstract class AbstractEntity {
  public client: Client

  protected constructor(client: Client) {
    this.client = client
  }

  abstract init(data: any): Promise<void>

  toJSON(props: string[], returnProps?: boolean): Record<any, any> | string[] {
    if (returnProps) return props

    return {}
  }
}
