export interface FetchReactionUsersOptions {
  /**
   * Get users after this id
   * @default absent
   * */
  after?: string
  /**
   * Max number of users to return (1-100)
   * @default 25
   * */
  limit?: number
}
