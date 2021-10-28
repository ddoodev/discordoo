import { AbstractEntity } from '@src/api/entities/AbstractEntity'

export class AbstractThreadChannel extends AbstractEntity {
  init(data: any): Promise<this> {
    return Promise.resolve(this)
  }
}
