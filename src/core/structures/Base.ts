/**
 * Base structure for everything which has snowflake
 */
import getDateFromSnowflake from '../../util/getDateFromSnowflake'

export default class Base {
  id: string

  constructor(id: string) {
    this.id = id
  }

  equal(compareTo: Base) {
    return compareTo.id === this.id
  }

  get createdAt() {
    return getDateFromSnowflake(this.id)
  }
}