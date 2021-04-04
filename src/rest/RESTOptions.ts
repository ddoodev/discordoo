export default interface RESTOptions {
  /** API version to use */
  v: 6 | 8, // others are discounted, remove this version after 6 is discounted
  /**
   * UserAgent to use
   *
   * Shouldn't be used, since Discord requires it to contain library name and it's version
   */
  useragent: string,
  /** Times, REST will try to perform the request with 5xx error code */
  maxRetries: number
}