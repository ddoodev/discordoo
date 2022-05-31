/** Default options for any local ipc provider. */
export interface LocalIpcTransportProviderOptions {
  /** The maximum waiting time for a single packet response. If the time is exceeded, the provider should throw an error. */
  responseTimeout: number

  /**
   * Maximum retrying attempts. When initial connection to the client failed, provider should try to connect again.
   * When number of retrying is more than specified here, provider should throw an error.
   * */
  maxAuthRetrying: number

  
}