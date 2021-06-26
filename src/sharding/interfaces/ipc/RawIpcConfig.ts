import { config as IpcConfig } from 'node-ipc'

export type RawIpcConfig = Omit<Partial<typeof IpcConfig>, 'id' | 'appspace' | 'interfaces' | 'networkHost' | 'networkPort' | 'tls'>

