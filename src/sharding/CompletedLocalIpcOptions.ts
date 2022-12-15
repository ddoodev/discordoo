export interface CompletedLocalIpcOptions {
  appspace: string
  socketRoot: string
  encoding: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'hex'
  logDepth: number
  logger: (msg: string) => any
}
