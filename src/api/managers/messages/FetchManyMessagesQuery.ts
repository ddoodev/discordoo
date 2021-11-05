export interface FetchManyMessagesQuery {
  // Get messages around this message id
  around?: string
  // Get messages before this message id
  before?: string
  // Get messages after this message id
  after?: string
  /**
   * Max number of messages to fetch (1-100)
   * @default 50
   */
  limit?: number
}
