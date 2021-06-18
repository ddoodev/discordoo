export default interface IpcTlsOptions {
  public?: string
  private?: string
  dhparam?: string
  requestCert?: boolean
  rejectUnauthorized?: boolean
  trustedConnections?: string[]
}
