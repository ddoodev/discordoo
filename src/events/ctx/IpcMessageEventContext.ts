export interface IpcMessageEventContext {
  message: string
  /** ID of the sharding instance from which this message came */
  from: number
}