import { config as IpcConfig } from '@node-ipc/compat'

export type RawIpcConfig = Omit<Partial<typeof IpcConfig>, 'id' | 'interfaces' | 'networkHost' | 'networkPort' | 'tls'>

