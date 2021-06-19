import { config as IpcConfig } from 'node-ipc'

type RawIpcConfig = Omit<Partial<typeof IpcConfig>, 'id' | 'appspace' | 'interfaces' | 'networkHost' | 'networkPort' | 'tls'>

export default RawIpcConfig
