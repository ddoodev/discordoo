import { AbstractEntity } from '@src/api'

export class Presence extends AbstractEntity {
  init(data: any): Promise<this> {
    return Promise.resolve(this);
  }
}
