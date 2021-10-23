import { AbstractEntity } from '@src/api/entities/AbstractEntity'

export class Presence extends AbstractEntity {
  init(data: any): Promise<this> {
    return Promise.resolve(this);
  }
}
