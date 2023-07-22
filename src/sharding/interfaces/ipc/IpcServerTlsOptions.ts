import { IpcTlsOptions } from '@src/sharding'
import { NonOptional } from '@src/utils/types/NonOptional'

export type IpcServerTlsOptions = NonOptional<IpcTlsOptions, 'public' | 'private'>
