export interface ThreadMetadata {
  archived: boolean
  autoArchiveDuration: number
  /**
   * The timestamp when the thread's archive status was changed.
   * If the thread was never archived, this will contain the creation timestamp.
   * */
  archiveTimestamp: number
  locked: boolean
  invitable?: boolean
}
