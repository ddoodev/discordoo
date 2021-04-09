/** Options for rest */
export default interface RESTOptions {
  /** API version to use */
  v: number,
  /**
   * UserAgent to use
   * Shouldn't be used, since Discord requires it to contain library name and it's version
   */
  useragent: string,
  /** Times, REST will try to perform the request with 5xx error code */
  maxRetries: number
}
