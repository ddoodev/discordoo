export default interface WSShardEvents {
  message: (msg: Buffer | string | ArrayBuffer | Buffer[]) => void
  disconnect: () => void
  connect: () => void
  identified: () => void
}
