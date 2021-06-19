import { IpcTlsOptions } from '@src/sharding'
import NonOptional from '@src/utils/NonOptional'

type IpcServerTlsOptions = NonOptional<IpcTlsOptions, 'public' | 'private'>

export default IpcServerTlsOptions
