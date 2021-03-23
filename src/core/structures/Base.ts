import idToDate from '../../util/idToDate'

/**
 * Base structure for everything which has snowflake
 */
export default class Base {
  /**
   * Unique id
   */
  id: string

  /**
   * @param id - id
   */
  constructor(id: string) {
    this.id = id
  }

  /**
   * Check, if two entities are equal
   *
   * @param compareTo - entity to compare to
   */
  equal(compareTo: Base) {
    return compareTo.id === this.id
  }

  /**
   * Get creation date
   */
  get createdAt() {
    return idToDate(this.id)
  }

  /**
   * Unix timestamp
   */
  get createdTimestamp() {
    return this.createdAt.getDate()
  }
}
