/**
 * Base structure for everything which has snowflake
 */
import idToDate from '../../util/idToDate'

export default class Base {
  id: string

  constructor(id: string) {
    this.id = id
  }

  equal(compareTo: Base) {
    return compareTo.id === this.id
  }

  get createdAt() {
    return idToDate(this.id)
  }

  get createdTimestamp() {
    return this.createdAt.getDate()
  }
}
