import { IpcTlsOptions } from '@src/sharding'

export type IpcClientTlsOptions = Omit<IpcTlsOptions, 'dhparam' | 'requestCert'>
