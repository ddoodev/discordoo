import { config as IpcConfig } from 'node-ipc'

export type RawIpcConfig = Omit<Partial<typeof IpcConfig>, 'id' | 'interfaces' | 'networkHost' | 'networkPort' | 'tls'>

